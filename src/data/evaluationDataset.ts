import { EvaluationTestCase } from '../types/chatbot';

export const EVALUATION_DATASET: EvaluationTestCase[] = [
  {
    id: 'eval-01',
    query: 'Hello CampusMate! Good morning, what can you help me with?',
    category: 'Greeting & Onboarding',
    expectedIntent: 'greeting',
    expectedEntityTypes: [],
    minExpectedConfidence: 0.75,
    description: 'Detects standard conversational greeting intent.'
  },
  {
    id: 'eval-02',
    query: 'What are the 5 modules and credit structure of CSDX 142?',
    category: 'Course Overview',
    expectedIntent: 'syllabus_query',
    expectedEntityTypes: ['course_code'],
    minExpectedConfidence: 0.55,
    description: 'Extracts CSDX 142 course code and retrieves overall syllabus structure.'
  },
  {
    id: 'eval-03',
    query: 'Explain Module 1 dialogue system architecture and ELIZA history',
    category: 'Module I Direct',
    expectedIntent: 'syllabus_query',
    expectedModule: 'Module I',
    expectedEntityTypes: ['module', 'topic'],
    minExpectedConfidence: 0.60,
    description: 'Extracts Module I (numeric "1" normalized to Roman "Module I") and historical topic.'
  },
  {
    id: 'eval-04',
    query: 'What is the difference between NLU, DST, and NLG in a dialogue pipeline?',
    category: 'Module I Paraphrased',
    expectedIntent: 'syllabus_query',
    expectedModule: 'Module I',
    expectedEntityTypes: ['topic'],
    minExpectedConfidence: 0.50,
    description: 'Matches Module I architectural components without explicitly naming "Module 1".'
  },
  {
    id: 'eval-05',
    query: 'Tell me about Module II Conversational UI stack and training approaches',
    category: 'Module II Direct',
    expectedIntent: 'syllabus_query',
    expectedModule: 'Module II',
    expectedEntityTypes: ['module'],
    minExpectedConfidence: 0.60,
    description: 'Retrieves Module II Conversational UI stack, challenges, and training approaches.'
  },
  {
    id: 'eval-06',
    query: 'How do Dialogflow intents, entities, contexts, and webhook fulfillment work in Module 3?',
    category: 'Module III Direct',
    expectedIntent: 'syllabus_query',
    expectedModule: 'Module III',
    expectedEntityTypes: ['module', 'topic'],
    minExpectedConfidence: 0.65,
    description: 'Extracts Module III and Dialogflow entities with high TF-IDF cosine score.'
  },
  {
    id: 'eval-07',
    query: 'Explain Module IV NLP methods, spaCy pipeline components, and TF-IDF',
    category: 'Module IV Direct',
    expectedIntent: 'syllabus_query',
    expectedModule: 'Module IV',
    expectedEntityTypes: ['module', 'topic'],
    minExpectedConfidence: 0.65,
    description: 'Extracts Module IV, spaCy, and TF-IDF entities and retrieves NLP details.'
  },
  {
    id: 'eval-08',
    query: 'What are the stages in spaCy like tok2vec, tagger, parser, and ner?',
    category: 'Module IV Deep Technical',
    expectedIntent: 'syllabus_query',
    expectedModule: 'Module IV',
    expectedEntityTypes: ['topic'],
    minExpectedConfidence: 0.55,
    description: 'Matches deep technical Module IV spaCy pipeline entry via domain terms.'
  },
  {
    id: 'eval-09',
    query: 'What is covered in Module V regarding multimodality, social robots, IoT, and ethics?',
    category: 'Module V Direct',
    expectedIntent: 'syllabus_query',
    expectedModule: 'Module V',
    expectedEntityTypes: ['module', 'topic'],
    minExpectedConfidence: 0.60,
    description: 'Extracts Module V and frontier ethical/multimodal topics.'
  },
  {
    id: 'eval-10',
    query: 'What are the course objectives COB1 to COB5 for this subject?',
    category: 'Course Objectives',
    expectedIntent: 'syllabus_query',
    expectedEntityTypes: ['cob'],
    minExpectedConfidence: 0.60,
    description: 'Recognizes COB1–COB5 course objective entities.'
  },
  {
    id: 'eval-11',
    query: 'How should I prepare for the CSDX 142 semester exam and important 10 mark questions?',
    category: 'Exam Preparation',
    expectedIntent: 'exam_prep',
    expectedEntityTypes: ['course_code'],
    minExpectedConfidence: 0.55,
    description: 'Classifies exam preparation query and retrieves module-by-module high-yield topics.'
  },
  {
    id: 'eval-12',
    query: 'Give me placement interview tips and how to pitch this AI project to recruiters',
    category: 'Placement Guidance',
    expectedIntent: 'placement_guidance',
    expectedEntityTypes: ['category'],
    minExpectedConfidence: 0.55,
    description: 'Classifies placement guidance intent and provides STAR pitch + technical prep.'
  },
  {
    id: 'eval-13',
    query: 'What is the minimum attendance rule and how do I apply for a bonafide certificate?',
    category: 'College FAQ (Sample Data)',
    expectedIntent: 'college_faq',
    expectedEntityTypes: ['category'],
    minExpectedConfidence: 0.50,
    description: 'Retrieves sample college FAQ with explicit demo-data disclaimer.'
  },
  {
    id: 'eval-14',
    query: 'How does this chatbot work internally and are you using an LLM API?',
    category: 'Architecture Transparency',
    expectedIntent: 'architecture_how_it_works',
    expectedEntityTypes: ['topic'],
    minExpectedConfidence: 0.60,
    description: 'Explains local deterministic NLP + TF-IDF architecture honestly.'
  },
  {
    id: 'eval-15',
    query: 'Start a guided decision tree flow for exam prep',
    category: 'Decision Tree Trigger',
    expectedIntent: 'decision_tree_start',
    expectedEntityTypes: ['topic'],
    minExpectedConfidence: 0.70,
    description: 'Triggers FSM transition into interactive Module III Decision Tree.'
  },
  {
    id: 'eval-16',
    query: 'What is the live Champions League football score and Bitcoin price today?',
    category: 'Out-of-Domain Fallback',
    expectedIntent: 'unknown_fallback',
    expectedEntityTypes: [],
    minExpectedConfidence: 0.0,
    description: 'Correctly rejects out-of-domain query below confidence threshold.'
  }
];
