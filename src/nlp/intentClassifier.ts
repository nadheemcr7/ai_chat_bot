import { ExtractedEntity, IntentPrediction, IntentType, PreprocessResult } from '../types/chatbot';

interface IntentRule {
  intent: IntentType;
  patterns: RegExp[];
  keywords: string[];
  entityBoostTypes: ExtractedEntity['type'][];
}

const INTENT_RULES: IntentRule[] = [
  {
    intent: 'greeting',
    patterns: [
      /^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening)|namaste|howdy)\b/i,
      /\b(hello|hi)\s+campusmate\b/i
    ],
    keywords: ['hello', 'hi', 'hey', 'greeting', 'morning', 'afternoon', 'evening', 'welcome'],
    entityBoostTypes: []
  },
  {
    intent: 'decision_tree_start',
    patterns: [
      /\b(start|launch|open|run|begin)\b.*\b(decision\s+tree|guided\s+flow|advisor|selector)\b/i,
      /\bdecision\s+tree\s+(flow|mode|demo|for)\b/i,
      /\bguided\s+(flow|decision|study\s+plan)\b/i
    ],
    keywords: ['guided', 'flow', 'advisor', 'selector', 'interactive', 'branch', 'walkthrough'],
    entityBoostTypes: []
  },
  {
    intent: 'architecture_how_it_works',
    patterns: [
      /\bhow\s+does\s+(this|the|your)\s+(chatbot|bot|system|app|campusmate)\s+work\b/i,
      /\bare\s+you\s+(a|an)\s+(llm|large\s+language\s+model|ai|rule\s+based)\b/i,
      /\bexplain\s+your\s+(architecture|nlp\s+pipeline|internal)\b/i,
      /\bwhy\s+is\s+this\s+(project\s+)?(zero\s+cost|free)\b/i
    ],
    keywords: ['internally', 'campusmate', 'openai', 'gemini', 'llm', 'zero', 'cost', 'free', 'transparent', 'limitations'],
    entityBoostTypes: []
  },
  {
    intent: 'exam_prep',
    patterns: [
      /\b(how\s+(to|should\s+i|do\s+i)\s+prepare|exam\s+prep(aration)?|study\s+(guide|plan|tips)|important\s+(exam\s+|10\s+mark\s+)?questions|10\s+mark|semester\s+exam|revision\s+tips)\b/i
    ],
    keywords: ['exam', 'prepare', 'preparation', 'study', 'revision', 'important', 'mark', 'marks', 'question', 'semester', 'weightage', 'tips'],
    entityBoostTypes: ['course_code']
  },
  {
    intent: 'placement_guidance',
    patterns: [
      /\b(placement|interview\s+(prep|tips|questions)|resume\s+tips|pitch\s+this\s+(ai\s+)?project|career\s+guidance|recruiter|hr\s+round|technical\s+round)\b/i
    ],
    keywords: ['placement', 'interview', 'resume', 'recruiter', 'career', 'job', 'hr', 'pitch', 'star', 'dsa', 'company'],
    entityBoostTypes: ['company_role']
  },
  {
    intent: 'college_faq',
    patterns: [
      /\b(minimum\s+attendance|attendance\s+rule|bonafide\s+certificate|library\s+timings|hostel|internship\s+noc|cgpa\s+grading|passing\s+marks|internal\s+assessment|cat\s+exam)\b/i
    ],
    keywords: ['attendance', '75%', 'library', 'bonafide', 'noc', 'hostel', 'cgpa', 'grading', 'passing', 'wifi', 'helpdesk', 'certificate', 'timings'],
    entityBoostTypes: []
  },
  {
    intent: 'syllabus_query',
    patterns: [
      /\b(module\s*(1|2|3|4|5|i|ii|iii|iv|v|one|two|three|four|five))\b/i,
      /\b(csdx\s*-?\s*142|course\s+objectives?|cob[1-5])\b/i,
      /\b(dialogue\s+system|conversational\s+ui|dialogflow|spacy|tf\s*-?\s*idf|cosine\s+similarity|eliza|parry|nlu|dst|nlg|multimodal(ity)?|social\s+robots?|tok2vec)\b/i,
      /\b(what\s+is\s+in|explain|tell\s+me\s+about|syllabus|topics\s+in)\b.*\b(module|unit|subject|course)\b/i
    ],
    keywords: [
      'module', 'syllabus', 'csdx', '142', 'cob1', 'cob2', 'cob3', 'cob4', 'cob5', 'objective',
      'dialogue', 'eliza', 'parry', 'alice', 'architecture', 'nlu', 'dst', 'nlg', 'cui', 'conversational',
      'dialogflow', 'fulfillment', 'webhook', 'spacy', 'tfidf', 'cosine', 'tokenization', 'stemming',
      'lemmatization', 'tok2vec', 'tagger', 'parser', 'ner', 'multimodal', 'multimodality', 'robot',
      'iot', 'ethic', 'bias', 'hallucination', 'utterance', 'coreference', 'grounding'
    ],
    entityBoostTypes: ['module', 'course_code', 'cob', 'topic']
  },
  {
    intent: 'bot_help',
    patterns: [
      /\b(help\s+me|what\s+commands|what\s+can\s+you\s+do|supported\s+commands|how\s+to\s+use\s+this\s+bot)\b/i
    ],
    keywords: ['help', 'command', 'commands', 'support', 'capabilities', 'menu', 'options'],
    entityBoostTypes: []
  },
  {
    intent: 'gratitude_farewell',
    patterns: [
      /\b(thank\s+you|thanks|thx|bye|goodbye|see\s+you|that\s+helped)\b/i
    ],
    keywords: ['thank', 'thanks', 'bye', 'goodbye', 'awesome', 'great', 'helpful'],
    entityBoostTypes: []
  }
];

export function classifyIntent(
  preprocess: PreprocessResult,
  entities: ExtractedEntity[]
): IntentPrediction {
  const allScores: Record<IntentType, number> = {
    greeting: 0,
    syllabus_query: 0,
    exam_prep: 0,
    placement_guidance: 0,
    college_faq: 0,
    architecture_how_it_works: 0,
    decision_tree_start: 0,
    gratitude_farewell: 0,
    bot_help: 0,
    unknown_fallback: 0.15
  };

  const matchedSignals: string[] = [];
  const raw = preprocess.original.trim();

  if (!raw || preprocess.tokens.length === 0) {
    return {
      intent: 'unknown_fallback',
      confidence: 0,
      matchedSignals: ['Empty or whitespace-only input'],
      allScores
    };
  }

  const tokenSet = new Set([...preprocess.filteredTokens, ...preprocess.stems]);

  for (const rule of INTENT_RULES) {
    let score = 0;

    // 1. Pattern match contribution
    for (const pattern of rule.patterns) {
      if (pattern.test(raw)) {
        score += 0.58;
        matchedSignals.push(`Pattern[${rule.intent}]`);
        break;
      }
    }

    // 2. Keyword overlap contribution
    let keywordHits = 0;
    for (const kw of rule.keywords) {
      if (tokenSet.has(kw) || preprocess.normalized.includes(kw)) {
        keywordHits++;
      }
    }
    if (keywordHits > 0) {
      const kwScore = Math.min(0.45, keywordHits * 0.16);
      score += kwScore;
      matchedSignals.push(`Keywords[${rule.intent}:${keywordHits}]`);
    }

    // 3. Entity boost contribution
    for (const entity of entities) {
      if (rule.entityBoostTypes.includes(entity.type)) {
        score += 0.22;
        matchedSignals.push(`EntityBoost[${entity.type}=${entity.value}]`);
      }
    }

    allScores[rule.intent] = Number(Math.min(0.99, score).toFixed(3));
  }

  // Disambiguate when greeting is combined with an actual syllabus/exam/placement question
  const domainMax = Math.max(
    allScores.syllabus_query,
    allScores.exam_prep,
    allScores.placement_guidance,
    allScores.college_faq,
    allScores.architecture_how_it_works,
    allScores.decision_tree_start
  );
  if (allScores.greeting > 0 && domainMax >= 0.45) {
    allScores.greeting = Number((allScores.greeting * 0.4).toFixed(3));
  }
  // If greeting is standalone or paired with generic "what can you help me with", boost greeting
  if (allScores.greeting >= 0.55 && domainMax < 0.45) {
    allScores.greeting = Math.max(allScores.greeting, 0.85);
  }
  // When user explicitly asks to start/launch a decision tree or guided flow, prioritize decision_tree_start
  if (allScores.decision_tree_start >= 0.58) {
    allScores.decision_tree_start = 0.99;
  }
  // When user explicitly asks how this chatbot works internally, prioritize architecture_how_it_works
  if (allScores.architecture_how_it_works >= 0.58) {
    allScores.architecture_how_it_works = 0.99;
  }
  // When exam_prep matches strongly and no specific module (I-V) is requested, prevent generic course_code tie with syllabus_query
  const hasSpecificModule = entities.some((e) => e.type === 'module');
  if (allScores.exam_prep >= 0.80 && !hasSpecificModule && allScores.syllabus_query >= allScores.exam_prep) {
    allScores.syllabus_query = Number((allScores.exam_prep - 0.05).toFixed(3));
  }

  // Pick top intent
  let bestIntent: IntentType = 'unknown_fallback';
  let bestScore = 0;

  for (const [intentKey, score] of Object.entries(allScores) as [IntentType, number][]) {
    if (intentKey === 'unknown_fallback') continue;
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intentKey;
    }
  }

  if (bestScore < 0.24) {
    return {
      intent: 'unknown_fallback',
      confidence: Number(bestScore.toFixed(3)),
      matchedSignals: matchedSignals.length ? matchedSignals : ['No domain intent exceeded 0.24 threshold'],
      allScores
    };
  }

  return {
    intent: bestIntent,
    confidence: Number(bestScore.toFixed(3)),
    matchedSignals,
    allScores
  };
}
