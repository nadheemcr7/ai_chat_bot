import { ExtractedEntity, IntentPrediction, KnowledgeEntry, PreprocessResult, RetrievalMatch } from '../types/chatbot';
import { preprocessText } from './preprocessor';

interface IndexedDocument {
  entry: KnowledgeEntry;
  termFreqs: Map<string, number>;
  keywordSet: Set<string>;
}

/**
 * Computes TF-IDF Cosine Similarity + Keyword Overlap + Structured Entity Boost
 * across all entries in the local Knowledge Base.
 */
export function retrieveKnowledge(
  queryPreprocess: PreprocessResult,
  entities: ExtractedEntity[],
  intent: IntentPrediction,
  knowledgeBase: KnowledgeEntry[]
): RetrievalMatch[] {
  const queryTerms = Array.from(new Set([...queryPreprocess.filteredTokens, ...queryPreprocess.stems]));
  if (queryTerms.length === 0) return [];

  const N = knowledgeBase.length;
  const docFreq = new Map<string, number>();

  // 1. Index knowledge base documents with weighted fields (title & keywords weighted 2x)
  const indexedDocs: IndexedDocument[] = knowledgeBase.map((entry) => {
    const combinedText = [
      entry.title,
      entry.title,
      entry.moduleNumber ?? '',
      entry.courseObjective ?? '',
      ...entry.questionPatterns,
      ...entry.keywords,
      ...entry.keywords,
      entry.answer,
      ...(entry.bulletPoints ?? [])
    ].join(' ');

    const docPrep = preprocessText(combinedText);
    const allDocTerms = [...docPrep.filteredTokens, ...docPrep.stems];
    const termFreqs = new Map<string, number>();

    for (const term of allDocTerms) {
      termFreqs.set(term, (termFreqs.get(term) ?? 0) + 1);
    }

    for (const uniqueTerm of termFreqs.keys()) {
      docFreq.set(uniqueTerm, (docFreq.get(uniqueTerm) ?? 0) + 1);
    }

    const kwPrep = preprocessText(entry.keywords.join(' '));
    const keywordSet = new Set([...entry.keywords.map((k) => k.toLowerCase()), ...kwPrep.stems]);

    return {
      entry,
      termFreqs,
      keywordSet
    };
  });

  // 2. Build IDF lookup table: IDF(t) = log((N + 1) / (df(t) + 1)) + 1
  const idfMap = new Map<string, number>();
  for (const [term, df] of docFreq.entries()) {
    idfMap.set(term, Math.log((N + 1) / (df + 1)) + 1);
  }

  // 3. Build query TF-IDF vector
  const queryTf = new Map<string, number>();
  for (const t of [...queryPreprocess.filteredTokens, ...queryPreprocess.stems]) {
    queryTf.set(t, (queryTf.get(t) ?? 0) + 1);
  }

  const queryVec = new Map<string, number>();
  let queryNormSq = 0;
  for (const [term, tf] of queryTf.entries()) {
    const idf = idfMap.get(term) ?? 1.0;
    const w = (1 + Math.log(tf)) * idf;
    queryVec.set(term, w);
    queryNormSq += w * w;
  }
  const queryNorm = Math.sqrt(queryNormSq) || 1;

  // Extract entity filters for boosting
  const moduleEntity = entities.find((e) => e.type === 'module')?.value;
  const cobEntity = entities.find((e) => e.type === 'cob')?.value;
  const topicEntities = entities.filter((e) => e.type === 'topic').map((e) => e.value.toLowerCase());

  // 4. Score each document
  const results: RetrievalMatch[] = indexedDocs.map(({ entry, termFreqs, keywordSet }) => {
    let dotProduct = 0;
    let docNormSq = 0;
    const matchedTerms: string[] = [];

    for (const [term, tf] of termFreqs.entries()) {
      const idf = idfMap.get(term) ?? 1.0;
      const docW = (1 + Math.log(tf)) * idf;
      docNormSq += docW * docW;

      const qW = queryVec.get(term);
      if (qW !== undefined) {
        dotProduct += qW * docW;
        if (!matchedTerms.includes(term) && term.length > 1) {
          matchedTerms.push(term);
        }
      }
    }

    const docNorm = Math.sqrt(docNormSq) || 1;
    const rawCosine = dotProduct / (queryNorm * docNorm);

    // Keyword overlap ratio
    let kwHits = 0;
    for (const qt of queryTerms) {
      if (keywordSet.has(qt)) {
        kwHits++;
      }
    }
    const keywordOverlapScore = Math.min(1, kwHits / Math.max(2, Math.min(queryTerms.length, 5)));

    // Entity and Intent alignment boost
    let entityBoost = 0;
    if (moduleEntity) {
      if (entry.moduleNumber === moduleEntity) {
        entityBoost += 0.28;
      } else if (entry.moduleNumber && entry.moduleNumber !== 'General') {
        // Penalize mismatched specific module numbers
        entityBoost -= 0.15;
      }
    }

    if (cobEntity && (entry.id === 'kb-course-objectives' || entry.courseObjective === cobEntity)) {
      entityBoost += 0.25;
    }

    for (const topic of topicEntities) {
      if (
        entry.title.toLowerCase().includes(topic.split(' ')[0]) ||
        entry.answer.toLowerCase().includes(topic.split(' ')[0])
      ) {
        entityBoost += 0.16;
      }
    }

    if (intent.intent === 'exam_prep' && entry.category === 'exam_prep') {
      entityBoost += 0.26;
    } else if (intent.intent === 'placement_guidance' && entry.category === 'placement') {
      entityBoost += 0.26;
    } else if (intent.intent === 'college_faq' && entry.category === 'college_faq') {
      entityBoost += 0.24;
    } else if (intent.intent === 'architecture_how_it_works' && entry.id === 'kb-how-bot-works') {
      entityBoost += 0.35;
    }

    // Combined calibrated score in [0, 0.99]
    const combined = rawCosine * 0.55 + keywordOverlapScore * 0.35 + entityBoost;
    const finalScore = Number(Math.max(0, Math.min(0.99, combined)).toFixed(3));

    return {
      entry,
      tfidfScore: Number(rawCosine.toFixed(3)),
      keywordOverlapScore: Number(keywordOverlapScore.toFixed(3)),
      entityBoost: Number(entityBoost.toFixed(3)),
      finalScore,
      matchedTerms: matchedTerms.slice(0, 8)
    };
  });

  results.sort((a, b) => b.finalScore - a.finalScore);
  return results;
}
