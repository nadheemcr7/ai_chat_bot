import { ExtractedEntity } from '../types/chatbot';

const MODULE_MAP: Record<string, 'Module I' | 'Module II' | 'Module III' | 'Module IV' | 'Module V'> = {
  '1': 'Module I',
  'i': 'Module I',
  'one': 'Module I',
  'first': 'Module I',
  '2': 'Module II',
  'ii': 'Module II',
  'two': 'Module II',
  'second': 'Module II',
  '3': 'Module III',
  'iii': 'Module III',
  'three': 'Module III',
  'third': 'Module III',
  '4': 'Module IV',
  'iv': 'Module IV',
  'four': 'Module IV',
  'fourth': 'Module IV',
  '5': 'Module V',
  'v': 'Module V',
  'five': 'Module V',
  'fifth': 'Module V'
};

const TOPIC_GAZETTEER: { pattern: RegExp; canonical: string }[] = [
  { pattern: /\bdialog\s*flow\b/i, canonical: 'Dialogflow' },
  { pattern: /\bspacy\b|\ben_core_web_(sm|md|lg|trf)\b|\btok2vec\b/i, canonical: 'spaCy' },
  { pattern: /\btf\s*-?\s*idf\b|\bcosine\s+similarity\b/i, canonical: 'TF-IDF & Cosine Similarity' },
  { pattern: /\bdecision\s+trees?\b/i, canonical: 'Decision Trees' },
  { pattern: /\beliza\b|\bparry\b|\balice\b|\baiml\b/i, canonical: 'Early Dialogue Systems (ELIZA/PARRY/ALICE)' },
  { pattern: /\bnlu\b|\bnatural\s+language\s+understanding\b/i, canonical: 'NLU' },
  { pattern: /\bdst\b|\bdialogue\s+state\s+track(er|ing)\b/i, canonical: 'Dialogue State Tracking (DST)' },
  { pattern: /\bnlg\b|\bnatural\s+language\s+generation\b/i, canonical: 'NLG' },
  { pattern: /\bconversational\s+ui\b|\bcui\b/i, canonical: 'Conversational UI' },
  { pattern: /\bmultimodal(ity)?\b/i, canonical: 'Multimodality' },
  { pattern: /\bsocial\s+robots?\b/i, canonical: 'Social Robots' },
  { pattern: /\biot\b|\binternet\s+of\s+things\b/i, canonical: 'IoT Dialogue' },
  { pattern: /\bethic(s|al)?\b|\bbias\b|\bhallucination\b|\bprivacy\b/i, canonical: 'Ethics & Privacy' },
  { pattern: /\bmessenger\b|\bwebhook\b|\bfulfillment\b/i, canonical: 'Messenger & Webhooks' },
  { pattern: /\btokeniz(e|ation)\b|\bstemming\b|\blemmatiz(e|ation)\b/i, canonical: 'Text Normalization & Tokenization' },
  { pattern: /\bfsm\b|\bfinite\s+state\b/i, canonical: 'Finite-State Machine (FSM)' }
];

const CATEGORY_GAZETTEER: { pattern: RegExp; canonical: string }[] = [
  { pattern: /\b(exam|semester|cat|revision|marks|question\s+bank)\b/i, canonical: 'exam_prep' },
  { pattern: /\b(placement|interview|resume|recruiter|hr|career|job)\b/i, canonical: 'placement' },
  { pattern: /\b(attendance|library|bonafide|hostel|noc|cgpa|grading|wifi|timings)\b/i, canonical: 'college_faq' },
  { pattern: /\b(syllabus|module|curriculum|credits|ltpc)\b/i, canonical: 'syllabus' }
];

/**
 * Extracts structured entities (modules, course codes, COBs, technical topics, and query categories)
 * using deterministic regex patterns and domain gazetteers (analogous to spaCy EntityRuler).
 */
export function extractEntities(rawText: string): ExtractedEntity[] {
  const entities: ExtractedEntity[] = [];
  const seen = new Set<string>();

  const addUnique = (entity: ExtractedEntity) => {
    const key = `${entity.type}:${entity.value}`;
    if (!seen.has(key)) {
      seen.add(key);
      entities.push(entity);
    }
  };

  // 1. Course Code detection (e.g., CSDX 142, CSDX-142, CSDX142)
  const courseMatch = rawText.match(/\bcsdx\s*-?\s*142\b/i);
  if (courseMatch) {
    addUnique({
      type: 'course_code',
      value: 'CSDX 142',
      rawText: courseMatch[0],
      confidence: 0.99
    });
  }

  // 2. Course Objectives detection (COB1 - COB5)
  const cobRegex = /\bcob\s*-?\s*([1-5])\b/gi;
  let cobMatch: RegExpExecArray | null;
  while ((cobMatch = cobRegex.exec(rawText)) !== null) {
    addUnique({
      type: 'cob',
      value: `COB${cobMatch[1]}`,
      rawText: cobMatch[0],
      confidence: 0.98
    });
  }
  if (/\bcourse\s+objectives?\b/i.test(rawText) && !seen.has('cob:COB1')) {
    addUnique({
      type: 'cob',
      value: 'COB1–COB5',
      rawText: 'course objectives',
      confidence: 0.92
    });
  }

  // 3. Module Number detection (Module 1..5, Module I..V, Unit 1..5, First module, etc.)
  const modAfterRegex = /\b(?:module|unit|chapter|mod)\s*[-:#]?\s*(1|2|3|4|5|iii|ii|iv|v|i|one|two|three|four|five)\b/gi;
  let modMatch: RegExpExecArray | null;
  while ((modMatch = modAfterRegex.exec(rawText)) !== null) {
    const key = modMatch[1].toLowerCase();
    const mapped = MODULE_MAP[key];
    if (mapped) {
      addUnique({
        type: 'module',
        value: mapped,
        rawText: modMatch[0],
        confidence: 0.98
      });
    }
  }

  const modBeforeRegex = /\b(first|second|third|fourth|fifth)\s+(?:module|unit)\b/gi;
  let modBeforeMatch: RegExpExecArray | null;
  while ((modBeforeMatch = modBeforeRegex.exec(rawText)) !== null) {
    const key = modBeforeMatch[1].toLowerCase();
    const mapped = MODULE_MAP[key];
    if (mapped) {
      addUnique({
        type: 'module',
        value: mapped,
        rawText: modBeforeMatch[0],
        confidence: 0.95
      });
    }
  }

  // 4. Technical Topic Gazetteer
  for (const item of TOPIC_GAZETTEER) {
    const match = rawText.match(item.pattern);
    if (match) {
      addUnique({
        type: 'topic',
        value: item.canonical,
        rawText: match[0],
        confidence: 0.94
      });
    }
  }

  // 5. Category Gazetteer
  for (const cat of CATEGORY_GAZETTEER) {
    const match = rawText.match(cat.pattern);
    if (match) {
      addUnique({
        type: 'category',
        value: cat.canonical,
        rawText: match[0],
        confidence: 0.88
      });
    }
  }

  return entities;
}
