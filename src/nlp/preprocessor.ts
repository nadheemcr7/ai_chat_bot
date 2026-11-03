import { PreprocessResult } from '../types/chatbot';

const CONTRACTIONS: Record<string, string> = {
  "what's": 'what is',
  "who's": 'who is',
  "how's": 'how is',
  "it's": 'it is',
  "that's": 'that is',
  "there's": 'there is',
  "can't": 'cannot',
  "won't": 'will not',
  "don't": 'do not',
  "doesn't": 'does not',
  "didn't": 'did not',
  "isn't": 'is not',
  "aren't": 'are not',
  "wasn't": 'was not',
  "weren't": 'were not',
  "i'm": 'i am',
  "you're": 'you are',
  "we're": 'we are',
  "they're": 'they are',
  "i've": 'i have',
  "i'd": 'i would',
  "i'll": 'i will',
  "let's": 'let us'
};

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else', 'when',
  'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from',
  'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
  'further', 'once', 'here', 'there', 'all', 'any', 'both', 'each',
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will',
  'just', 'should', 'now', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing',
  'would', 'could', 'ought', 'am', 'of', 'as', 'me', 'my', 'myself',
  'we', 'our', 'ours', 'you', 'your', 'yours', 'he', 'him', 'his',
  'she', 'her', 'hers', 'they', 'them', 'their', 'what', 'which', 'who',
  'whom', 'this', 'that', 'these', 'those', 'tell', 'please', 'give', 'show'
]);

/**
 * Lightweight deterministic Porter-style stemmer for academic & NLP domain terms.
 */
export function stemWord(word: string): string {
  if (word.length <= 3) return word;

  // Keep domain acronyms/special terms intact
  const protectedTerms = new Set([
    'csdx', 'spacy', 'tfidf', 'eliza', 'parry', 'alice', 'iot', 'nlu', 'nlg', 'dst', 'asr', 'tts', 'cob1', 'cob2', 'cob3', 'cob4', 'cob5'
  ]);
  if (protectedTerms.has(word)) return word;

  let w = word;

  if (w.endsWith('ational')) return w.slice(0, -7) + 'ate';
  if (w.endsWith('tional')) return w.slice(0, -6) + 'tion';
  if (w.endsWith('ization')) return w.slice(0, -7) + 'ize';
  if (w.endsWith('fulness')) return w.slice(0, -7) + 'ful';
  if (w.endsWith('ousness')) return w.slice(0, -7) + 'ous';
  if (w.endsWith('iveness')) return w.slice(0, -7) + 'ive';
  if (w.endsWith('ality')) return w.slice(0, -5) + 'al';
  if (w.endsWith('bility')) return w.slice(0, -6) + 'ble';
  if (w.endsWith('ities')) return w.slice(0, -5) + 'ity';
  if (w.endsWith('sses')) return w.slice(0, -2);
  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
  if (w.endsWith('ing') && w.length > 5) {
    w = w.slice(0, -3);
    if (w.endsWith('at') || w.endsWith('bl') || w.endsWith('iz')) w += 'e';
    return w;
  }
  if (w.endsWith('ed') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('ment') && w.length > 6) return w.slice(0, -4);
  if (w.endsWith('ness') && w.length > 6) return w.slice(0, -4);
  if (w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && !w.endsWith('is') && w.length > 3) {
    return w.slice(0, -1);
  }

  return w;
}

export function preprocessText(input: string): PreprocessResult {
  const original = input ?? '';
  let normalized = original.toLowerCase().trim();

  // Expand contractions
  for (const [contraction, expansion] of Object.entries(CONTRACTIONS)) {
    const regex = new RegExp(`\\b${contraction.replace("'", "'?")}\\b`, 'g');
    normalized = normalized.replace(regex, expansion);
  }

  // Normalize hyphenated technical terms (e.g., tf-idf -> tfidf, rule-based -> rule based)
  normalized = normalized.replace(/\btf\s*-\s*idf\b/g, 'tfidf');
  normalized = normalized.replace(/\bcob\s*-\s*([1-5])\b/g, 'cob$1');

  // Replace punctuation with spaces while preserving alphanumeric and %
  normalized = normalized
    .replace(/[^a-z0-9%\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = normalized ? normalized.split(' ') : [];
  const filteredTokens: string[] = [];
  const removedStopWords: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const prev = i > 0 ? tokens[i - 1] : '';
    const isRomanModuleNum =
      (prev === 'module' || prev === 'unit') && ['i', 'ii', 'iii', 'iv', 'v'].includes(token);

    if (STOP_WORDS.has(token) && !isRomanModuleNum) {
      removedStopWords.push(token);
    } else {
      filteredTokens.push(token);
    }
  }

  const stems = filteredTokens.map(stemWord);

  return {
    original,
    normalized,
    tokens,
    filteredTokens,
    stems,
    removedStopWords
  };
}
