import { QuizQuestion, InterviewQuestion } from '../types/chatbot';

export const SYLLABUS_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-mod1-1',
    moduleNumber: 'Module I',
    difficulty: 'Foundation',
    question: 'In a classic modular Dialogue System Architecture (Module I), which component updates and maintains the conversation belief state across multiple user turns?',
    options: [
      'Automatic Speech Recognition (ASR)',
      'Dialogue State Tracker (DST)',
      'Natural Language Generation (NLG)',
      'Morphological Tokenizer'
    ],
    correctIndex: 1,
    explanation: 'The Dialogue State Tracker (DST) maintains the representation of the user\'s goals, filled entity slots, and active conversation context across turns before the Dialogue Policy selects the next action.'
  },
  {
    id: 'q-mod1-2',
    moduleNumber: 'Module I',
    difficulty: 'Intermediate',
    question: 'Which historical dialogue system introduced in 1966 by Joseph Weizenbaum simulated a Rogerian psychotherapist using pattern matching and substitution rules?',
    options: [
      'PARRY',
      'ALICE (AIML)',
      'ELIZA',
      'SHRDLU'
    ],
    correctIndex: 2,
    explanation: 'ELIZA (1966) used keyword-based decomposition and reassembly rules (specifically the DOCTOR script) to reflect user statements back as questions without maintaining a deep world model.'
  },
  {
    id: 'q-mod2-1',
    moduleNumber: 'Module II',
    difficulty: 'Foundation',
    question: 'Which of the following is a primary usability challenge unique to Conversational User Interfaces (CUIs) compared to Graphical User Interfaces (GUIs)?',
    options: [
      'Excessive visual menu hierarchy',
      'Low feature discoverability ("blank canvas" problem where users do not know what they can ask)',
      'Inability to render text on mobile screens',
      'Requirement for a physical mouse pointer'
    ],
    correctIndex: 1,
    explanation: 'Unlike GUIs that display visible buttons and menus, a blank chat input gives little indication of supported capabilities—making welcome prompts, quick replies, and suggested questions essential CUI design patterns.'
  },
  {
    id: 'q-mod2-2',
    moduleNumber: 'Module II',
    difficulty: 'Intermediate',
    question: 'How does a Retrieval-Based Chatbot differ fundamentally from a Generative Chatbot (Module II)?',
    options: [
      'Retrieval-based systems rank and select verified responses from a curated knowledge base, preventing fabricated sentences.',
      'Retrieval-based systems synthesize brand-new token sequences word by word without a knowledge base.',
      'Retrieval-based systems cannot use NLP preprocessing or vector similarity.',
      'Generative systems only work with button clicks.'
    ],
    correctIndex: 0,
    explanation: 'Retrieval-based chatbots use scoring algorithms (such as TF-IDF + Cosine Similarity or dense embeddings) to select the best-matching pre-authored answer, guaranteeing zero hallucinated phrasing.'
  },
  {
    id: 'q-mod3-1',
    moduleNumber: 'Module III',
    difficulty: 'Foundation',
    question: 'In Google Dialogflow (Module III), which mechanism controls whether a follow-up intent can be triggered based on prior conversation turns?',
    options: [
      'Webhook TLS Certificate',
      'Input and Output Contexts with a configured turn Lifespan',
      'Static HTML CSS Selectors',
      'Stop-word Removal Dictionary'
    ],
    correctIndex: 1,
    explanation: 'Dialogflow Contexts represent the current state of a user\'s request. Setting an Output Context on a parent intent and matching Input Context on a child intent enables multi-turn follow-up resolution.'
  },
  {
    id: 'q-mod3-2',
    moduleNumber: 'Module III',
    difficulty: 'Intermediate',
    question: 'When designing a business chatbot using Decision Trees (Module III), what do the internal nodes and leaf nodes represent?',
    options: [
      'Internal nodes represent CSS styles; leaf nodes represent database tables.',
      'Internal nodes represent conditional questions/criteria; leaf nodes represent final diagnostic resolutions or actions.',
      'Internal nodes represent TTS audio files; leaf nodes represent ASR microphones.',
      'Both internal and leaf nodes represent random chitchat.'
    ],
    correctIndex: 1,
    explanation: 'In a Decision Tree conversational flow, internal nodes evaluate user choices or slot conditions, guiding the user deterministically along branches until reaching a leaf node resolution.'
  },
  {
    id: 'q-mod4-1',
    moduleNumber: 'Module IV',
    difficulty: 'Intermediate',
    question: 'In the standard spaCy NLP pipeline (Module IV), what is the correct execution order of core pipeline components after tokenization?',
    options: [
      'ner → parser → tagger → tok2vec',
      'tok2vec → tagger (POS) → parser (dependency) → ner (named entity recognition)',
      'tts → asr → webhook → html',
      'lemmatizer → tokenizer → lowercase'
    ],
    correctIndex: 1,
    explanation: 'After the Tokenizer segments raw text into a Doc object, spaCy runs tok2vec (token embeddings), tagger (Part-of-Speech tags), parser (syntactic dependencies), and ner (Named Entity Recognition).'
  },
  {
    id: 'q-mod4-2',
    moduleNumber: 'Module IV',
    difficulty: 'Advanced',
    question: 'Why does TF-IDF (Term Frequency–Inverse Document Frequency) multiply Term Frequency by log((N + 1) / (DF + 1))?',
    options: [
      'To give higher weight to rare, domain-specific keywords (like "spacy" or "dialogflow") and penalize words that appear in almost every document.',
      'To make longer documents always score 1.0 regardless of query terms.',
      'To remove all nouns and verbs from the user query.',
      'To encrypt the knowledge base in localStorage.'
    ],
    correctIndex: 0,
    explanation: 'Inverse Document Frequency (IDF) scales down terms that occur across many documents while boosting discriminative domain terms that uniquely identify specific syllabus modules or topics.'
  },
  {
    id: 'q-mod5-1',
    moduleNumber: 'Module V',
    difficulty: 'Intermediate',
    question: 'In Multimodal Dialogue Systems (Module V), what is the difference between Early (Feature-Level) Fusion and Late (Decision-Level) Fusion?',
    options: [
      'Early fusion concatenates joint representations (e.g., audio + visual + text features) before classification, whereas Late fusion combines independent unimodal predictions.',
      'Early fusion only uses text, whereas Late fusion only uses speech.',
      'Early fusion runs after NLG, whereas Late fusion runs before ASR.',
      'There is no architectural difference between the two.'
    ],
    correctIndex: 0,
    explanation: 'Early fusion integrates low-level features across modalities into a shared representation space, capturing cross-modal correlations, while Late fusion merges separate modality classifiers at the decision stage.'
  },
  {
    id: 'q-mod5-2',
    moduleNumber: 'Module V',
    difficulty: 'Foundation',
    question: 'Which of the following is an essential Ethical Design principle for educational and public-service chatbots (Module V)?',
    options: [
      'Pretending the chatbot is a real human professor to increase engagement',
      'Presenting fabricated university dates and policies as official facts when uncertain',
      'Transparency about system capabilities/limitations, clear labeling of sample data, and calibrated fallback on low confidence',
      'Silently logging private user credentials to public repositories'
    ],
    correctIndex: 2,
    explanation: 'Module V emphasizes transparency (disclosing that the user is interacting with an automated system), truthfulness (avoiding hallucinated policies via confidence thresholds), and user data privacy.'
  }
];

export const PLACEMENT_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'int-1',
    track: 'AI & NLP Engineering',
    question: 'Walk me through the architecture of your CampusMate AI project. How did you build an intelligent chatbot without using paid LLM APIs like OpenAI or Gemini?',
    keyConceptsToMention: [
      'Modular 4-Stage Pipeline (Preprocessing, Intent/Entity NLU, TF-IDF Cosine Retrieval, FSM Dialogue Manager)',
      'Zero external runtime cost & sub-5ms browser execution',
      'Confidence threshold + top-2 ambiguity detection to prevent false positives',
      'Multi-turn DialogueContext for pronoun/coreference resolution'
    ],
    sampleStrongAnswer:
      'I designed CampusMate AI as a deterministic, client-side NLP and retrieval system in TypeScript. First, user utterances go through a preprocessing pipeline that expands contractions, strips punctuation, removes stop-words, and applies Porter-style suffix stemming. Second, a hybrid intent classifier and regex/gazetteer entity extractor identify the user\'s goal (e.g., syllabus_query) and slots (e.g., Module IV, spaCy). Third, a TF-IDF vectorizer computes Cosine Similarity against our structured JSON knowledge base, applying entity boosts when module numbers match. Finally, a Finite-State Machine Dialogue Manager checks the confidence threshold, resolves follow-up pronouns using stored dialogue context, or launches guided decision trees—running 100% locally at ₹0 cost.',
    followUpProbe: 'What happens if a user asks a question where two modules score almost identically?'
  },
  {
    id: 'int-2',
    track: 'AI & NLP Engineering',
    question: 'Why did you choose TF-IDF and Cosine Similarity instead of simple keyword substring matching (indexOf / includes)?',
    keyConceptsToMention: [
      'Term weighting via Inverse Document Frequency (IDF)',
      'Document length normalization via L2 vector norms in Cosine Similarity',
      'Stemmed token matching handles morphological variants (deploying vs deployment)',
      'Quantifiable [0, 1] confidence score for threshold calibration'
    ],
    sampleStrongAnswer:
      'Simple substring matching treats all words equally—so common words like "what", "explain", or "chatbot" would cause false matches across unrelated entries, and minor inflection changes like "deploying" vs "deployment" would fail. By combining Porter-style stemming with TF-IDF weighting and Cosine Similarity, rare discriminative terms like "spacy", "dialogflow", or "multimodality" receive high IDF weights, and normalizing by the L2 vector norm produces a calibrated similarity score between 0 and 1 that we can test against a rejection threshold.',
    followUpProbe: 'What is a known limitation of TF-IDF compared to dense transformer embeddings?'
  },
  {
    id: 'int-3',
    track: 'AI & NLP Engineering',
    question: 'What are the limitations of a TF-IDF retrieval chatbot compared to a Large Language Model, and when is retrieval actually preferable?',
    keyConceptsToMention: [
      'Lexical gap / out-of-vocabulary synonyms without static word vectors',
      'Cannot synthesize novel code or multi-hop open-ended essays outside the KB',
      'Advantage: Zero hallucination of factual syllabus/policy data',
      'Advantage: Deterministic auditability, zero API latency, and ₹0 operating cost'
    ],
    sampleStrongAnswer:
      'TF-IDF relies on lexical overlap of stemmed tokens, so if a user uses a rare synonym not present in our question patterns or keywords, recall drops compared to dense semantic embeddings. Additionally, it retrieves verified answers rather than generating novel prose. However, for academic syllabi and institutional FAQs, retrieval is often superior because it guarantees zero hallucinated exam rules, provides full pipeline explainability via our trace inspector, and runs with zero API cost or privacy exposure.',
    followUpProbe: 'How could you upgrade semantic recall in the future while keeping the app free?'
  },
  {
    id: 'int-4',
    track: 'Full-Stack & System Design',
    question: 'How did you design the Finite-State Machine (FSM) in your Dialogue Manager to support both free-text queries and guided Decision Trees?',
    keyConceptsToMention: [
      'Explicit DialogueState union type (IDLE, ANSWERING_KB, AWAITING_CLARIFICATION, IN_DECISION_TREE, FOLLOW_UP_CONTEXT, FALLBACK_RECOVERY)',
      'Context persistence across turns (lastModule, lastTopic, activeTreeId, activeNodeId)',
      'Priority routing in processUserMessage (Clarification & Decision Tree checks before general retrieval)',
      'Escape hatch allowing users to exit a decision tree at any time'
    ],
    sampleStrongAnswer:
      'The Dialogue Manager maintains a strongly typed DialogueContext object containing the current FSM state and slot memory (lastModule, lastTopic, and active decision tree pointers). On each turn, it evaluates state transitions in priority order: if the user is in IN_DECISION_TREE or AWAITING_CLARIFICATION, it checks whether the input selects a branch or asks to reset; if the user asks a follow-up with pronouns like "it" or "that module", it injects the stored lastModule entity into the NLU context before scoring TF-IDF matches.',
    followUpProbe: 'How do you test this state machine automatically without launching a browser?'
  },
  {
    id: 'int-5',
    track: 'Full-Stack & System Design',
    question: 'How do you verify and test the quality of your NLP pipeline when someone edits the Knowledge Base?',
    keyConceptsToMention: [
      'Decoupled pure TypeScript modules testable via Node built-in test runner',
      '16-case Evaluation Benchmark covering greetings, all 5 modules, paraphrases, follow-ups, and out-of-domain queries',
      'Automated checks for Intent Accuracy, Entity Recall, and Threshold Rejection of unknown queries'
    ],
    sampleStrongAnswer:
      'All NLP and dialogue modules are written as pure, side-effect-free TypeScript functions decoupled from React DOM state. We maintain both a CLI unit test suite using node:test and an in-browser Evaluation Benchmark Runner with 16 labeled test cases. Whenever knowledge base entries or weights are tuned, we run the benchmark to verify that in-domain queries exceed the confidence threshold with the expected intent and out-of-domain queries (like weather or sports) are cleanly rejected into unknown_fallback.',
    followUpProbe: 'Show me how the live benchmark runner works in the Analytics tab.'
  },
  {
    id: 'int-6',
    track: 'Behavioral & HR',
    question: 'Tell me about a tough constraint you faced while building this college project and how you solved it.',
    keyConceptsToMention: [
      'Strict ₹0 budget constraint & prohibition of paid LLM APIs',
      'Requirement to demonstrate all 5 modules of CSDX 142 authentically',
      'Built transparent developer trace inspector & live evaluation benchmark'
    ],
    sampleStrongAnswer:
      'Our primary constraint was building a genuinely intelligent college assistant for CSDX 142 with an absolute ₹0 budget—no OpenAI, Gemini, or paid cloud databases—while still demonstrating real NLP, entity extraction, dialogue state tracking, and decision trees across all five syllabus modules. Instead of faking AI with hardcoded if-else strings, I implemented a real TF-IDF + Cosine Similarity vectorizer, Porter-style stemmer, and FSM dialogue tracker in TypeScript, and exposed the internal mathematical trace in a live Developer Inspector so evaluators can verify every step.',
    followUpProbe: 'What would you add next if you had another month to work on CampusMate AI?'
  }
];
