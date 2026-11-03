import { KnowledgeEntry } from '../types/chatbot';

export const INITIAL_KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: 'kb-course-overview',
    title: 'CSDX 142 Course Overview & Credits (AI Chatbot Application)',
    category: 'syllabus',
    moduleNumber: 'General',
    questionPatterns: [
      'what is csdx 142',
      'course overview syllabus credits',
      'tell me about ai chatbot application subject',
      'ltpc credits for csdx 142',
      'what are the five modules in syllabus',
      'sdg goal for csdx 142'
    ],
    keywords: [
      'csdx', '142', 'overview', 'syllabus', 'course', 'credits', 'ltpc', 'sdg', 'modules', 'application', 'subject'
    ],
    answer:
      'CSDX 142 — AI Chatbot Application is a 3-credit undergraduate engineering course (L-T-P-C: 3-0-0-3, 45 lecture hours total, 9 hours per module) aligned with UN Sustainable Development Goal 9 (Industry, Innovation, and Infrastructure). It covers end-to-end engineering of conversational systems from classical dialogue architectures to modern NLP pipelines and ethical deployment.',
    bulletPoints: [
      'Module I (9 Hrs): Dialogue Systems — History, conversation modelling, architecture, design, and tools.',
      'Module II (9 Hrs): Conversational UI — Evolution, UI stack, challenges, gaps, training data sources, and development approaches.',
      'Module III (9 Hrs): Building Chatbots — Business considerations, decision trees, frameworks, components, and Google Dialogflow.',
      'Module IV (9 Hrs): NLP for Chatbots — Text preprocessing, intent/entity extraction, spaCy pipelines, Messenger integration, and deployment.',
      'Module V (9 Hrs): Future Directions — Multimodal dialogue, reasoning & problem solving, social robots, IoT dialogue, and ethics.'
    ],
    followUpSuggestions: [
      'What are the Course Objectives (COB1 to COB5)?',
      'Explain Module I Dialogue System architecture',
      'Compare Module IV NLP methods and spaCy'
    ],
    sourceReference: 'CSDX 142 Official Syllabus Header (L-T-P-C: 3-0-0-3, SDG 9)',
    isSampleData: false
  },
  {
    id: 'kb-course-objectives',
    title: 'Course Objectives (COB1 to COB5) — CSDX 142',
    category: 'objectives',
    moduleNumber: 'General',
    courseObjective: 'COB1',
    questionPatterns: [
      'what are the course objectives',
      'explain cob1 cob2 cob3 cob4 cob5',
      'course outcomes and objectives of csdx 142',
      'why do we study csdx 142'
    ],
    keywords: [
      'cob1', 'cob2', 'cob3', 'cob4', 'cob5', 'objectives', 'outcomes', 'goals', 'purpose', 'understand', 'explore'
    ],
    answer:
      'The CSDX 142 curriculum defines five core Course Objectives (COB1–COB5) mapped directly to the five instructional modules:',
    bulletPoints: [
      'COB1: Understand dialogue systems along with their different types (task-oriented vs open-domain) and layered architecture.',
      'COB2: Address the concept of Conversational UI, trace how conversational interfaces evolved, and analyze usability challenges.',
      'COB3: Explore chatbots considering real-world business needs, decision trees, and enterprise NLU platforms like Dialogflow.',
      'COB4: Learn Natural Language Processing (NLP) methods required for chatbots, including spaCy pipelines and cloud/static deployment.',
      'COB5: Expose current research challenges and future development areas in dialogue systems for multimodal reasoning and problem solving.'
    ],
    followUpSuggestions: [
      'Tell me about Module I Dialogue Systems',
      'Explain Module III Dialogflow and Decision Trees',
      'What ethical challenges are covered in Module V?'
    ],
    sourceReference: 'CSDX 142 Syllabus — Course Objectives Section (COB1–COB5)',
    isSampleData: false
  },
  {
    id: 'kb-mod1-overview',
    title: 'Module I: Dialogue Systems — History, Modelling & Architecture',
    category: 'syllabus',
    moduleNumber: 'Module I',
    courseObjective: 'COB1',
    questionPatterns: [
      'explain module 1 dialogue system',
      'module i syllabus topics',
      'history of dialogue systems eliza parry alice',
      'dialogue system architecture components',
      'modelling conversation in dialogue system',
      'designing dialogue system and tools'
    ],
    keywords: [
      'module', '1', 'i', 'one', 'dialogue', 'history', 'eliza', 'parry', 'alice', 'architecture', 'modelling', 'nlu', 'nlg', 'dst', 'manager', 'turn', 'grounding'
    ],
    answer:
      'Module I (9 Hours) introduces the foundations of Dialogue Systems. It traces the evolution from early rule-based programs (ELIZA in 1966 using Rogerian pattern matching, PARRY in 1972 adding internal affect state, and ALICE in 1995 using AIML) to modern modular and neural architectures.',
    bulletPoints: [
      'Conversation Modelling: Speech Act Theory (Austin/Searle), turn-taking, grounding (establishing mutual belief), adjacency pairs, and coreference.',
      'Standard Pipeline Architecture: Automatic Speech Recognition (ASR) → Natural Language Understanding (NLU) → Dialogue State Tracker (DST) → Dialogue Policy / Manager → Natural Language Generation (NLG) → Text-to-Speech (TTS).',
      'System Taxonomy: Task-oriented (goal-driven, slot-filling for booking/support) vs. Open-domain (chitchat/companion systems).',
      'Designing & Tools: User-centric persona definition, error recovery prompts, finite-state scripts, frame-based slot filling, and prototyping tools (Botpress, Rasa, Voiceflow).'
    ],
    followUpSuggestions: [
      'Explain Dialogue State Tracking (DST) in detail',
      'How does CampusMate AI implement a Dialogue Manager?',
      'What is in Module II Conversational UI?'
    ],
    sourceReference: 'CSDX 142 Syllabus — Module I: Dialogue System (9 Hours)',
    isSampleData: false
  },
  {
    id: 'kb-mod1-architecture-deep',
    title: 'Module I Deep Dive: NLU, Dialogue State Tracking (DST) & NLG Pipeline',
    category: 'syllabus',
    moduleNumber: 'Module I',
    courseObjective: 'COB1',
    questionPatterns: [
      'difference between nlu dst and nlg',
      'how does dialogue state tracker work',
      'explain dialogue policy and frame based architecture',
      'components of dialogue system architecture'
    ],
    keywords: [
      'nlu', 'dst', 'nlg', 'tracker', 'policy', 'slot', 'filling', 'frame', 'state', 'machine', 'pipeline', 'understanding', 'generation'
    ],
    answer:
      'In a modular Dialogue System Architecture (Module I), each stage has a distinct mathematical and functional responsibility:',
    bulletPoints: [
      'NLU (Natural Language Understanding): Maps raw user text u_t into structured semantic representation (Intent I and Entity slots E).',
      'DST (Dialogue State Tracker): Maintains the belief state s_t across turns by updating filled slots, active module context, and unresolved questions.',
      'Dialogue Policy (π): Selects the optimal system action a_t = π(s_t), such as answering from KB, asking a clarifying question, or advancing a decision tree.',
      'NLG (Natural Language Generation): Converts the abstract system action a_t into natural, human-readable text using templates or sequence models.'
    ],
    followUpSuggestions: [
      'Show how this chatbot implements FSM states',
      'What are the challenges of Conversational UI in Module II?',
      'Quiz me on Module I'
    ],
    sourceReference: 'CSDX 142 Syllabus — Module I: Dialogue System Architecture',
    isSampleData: false
  },
  {
    id: 'kb-mod2-overview',
    title: 'Module II: Conversational UI — Evolution, Stack, Training & Approaches',
    category: 'syllabus',
    moduleNumber: 'Module II',
    courseObjective: 'COB2',
    questionPatterns: [
      'explain module 2 conversational ui',
      'module ii syllabus topics',
      'stack of conversational ui and evolution',
      'challenges and gaps in conversational ui',
      'training chatbots and sources of data',
      'chatbot development approaches rule based vs retrieval vs generative'
    ],
    keywords: [
      'module', '2', 'ii', 'two', 'conversational', 'ui', 'interface', 'evolution', 'stack', 'challenges', 'gaps', 'sources', 'data', 'training', 'approaches', 'rule', 'retrieval', 'generative'
    ],
    answer:
      'Module II (9 Hours) focuses on Conversational User Interfaces (CUI)—interfaces where human-computer interaction occurs primarily through natural language dialogue rather than graphical menus alone.',
    bulletPoints: [
      'Evolution of UI: Command Line Interfaces (CLI) → Graphical User Interfaces (GUI) → Mobile Touch UI → Conversational UI (Text/Voice bots) → Multimodal Hybrid UI.',
      'Stack of Conversational UI: Messaging Channel Layer (Web, WhatsApp, Slack) → Bot Connector/Gateway → Conversational UX Layer (Quick replies, cards, carousels, typing indicators) → Intelligence/NLU Engine → Knowledge & Backend Layer.',
      'Challenges & Gaps: Discoverability ("blank canvas paralysis"), false expectations of human intelligence, context loss, ambiguity handling, and error recovery.',
      'Sources of Data & Training: Historical support logs, domain FAQs, synthetic utterance expansion, crowdsourced paraphrases, and domain corpora.',
      'Development Approaches: (1) Rule-Based / Pattern Matching, (2) Retrieval-Based (TF-IDF / Vector similarity ranking over verified answers), and (3) Generative Models (Seq2Seq / Transformers).'
    ],
    followUpSuggestions: [
      'Why does CampusMate AI use a Hybrid Retrieval + Rule approach?',
      'Explain Module III Decision Trees and Dialogflow',
      'What are best practices for overcoming CUI discoverability gaps?'
    ],
    sourceReference: 'CSDX 142 Syllabus — Module II: Conversational UI (9 Hours)',
    isSampleData: false
  },
  {
    id: 'kb-mod3-overview',
    title: 'Module III: Building Chatbots — Business Need, Decision Trees & Dialogflow',
    category: 'syllabus',
    moduleNumber: 'Module III',
    courseObjective: 'COB3',
    questionPatterns: [
      'explain module 3 building chatbot',
      'module iii syllabus topics',
      'business considerations and need for chatbots',
      'what is a decision tree in chatbots',
      'explain dialogflow intents entities fulfillment contexts',
      'chatbot frameworks and components'
    ],
    keywords: [
      'module', '3', 'iii', 'three', 'building', 'business', 'considerations', 'roi', 'decision', 'tree', 'frameworks', 'dialogflow', 'fulfillment', 'webhook', 'contexts', 'components'
    ],
    answer:
      'Module III (9 Hours) bridges conversational theory with practical software engineering, business justification, deterministic decision trees, and industrial frameworks like Google Dialogflow.',
    bulletPoints: [
      'Business Considerations: 24/7 availability, reduced First Response Time (FRT), ticket deflection rate, cost-per-contact optimization, and clear human-handoff escalation criteria.',
      'Decision Trees: Directed acyclic graphs (DAGs) where each internal node poses a structured choice and edges transition the user deterministically toward a diagnostic resolution.',
      'Chatbot Frameworks Comparison: Google Dialogflow ES/CX (cloud managed), Rasa Open Source (Python local NLU + stories), Microsoft Bot Framework, and custom TypeScript/Node NLP engines.',
      'Dialogflow Core Concepts: Agent (top-level project), Intents (user goals with training phrases), Entities (system & custom slot types like @sys.date or @module_number), Contexts (input/output lifespan for multi-turn state), and Fulfillment (webhook API calls or inline responses).'
    ],
    followUpSuggestions: [
      'Launch an interactive Decision Tree flow',
      'Explain Module IV NLP and spaCy models',
      'How do Dialogflow Input and Output Contexts work?'
    ],
    sourceReference: 'CSDX 142 Syllabus — Module III: Building Chatbot (9 Hours)',
    isSampleData: false
  },
  {
    id: 'kb-mod3-dialogflow-deep',
    title: 'Module III Deep Dive: Google Dialogflow Architecture (Intents, Entities, Contexts, Fulfillment)',
    category: 'syllabus',
    moduleNumber: 'Module III',
    courseObjective: 'COB3',
    questionPatterns: [
      'how does dialogflow work internally',
      'explain dialogflow contexts and lifespan',
      'what is fulfillment and webhook in dialogflow',
      'fallback intent in dialogflow'
    ],
    keywords: [
      'dialogflow', 'agent', 'training', 'phrases', 'lifespan', 'input', 'output', 'context', 'webhook', 'fulfillment', 'slot', 'parameters', 'action'
    ],
    answer:
      'Google Dialogflow (studied in Module III) models conversations using four primary abstractions that mirror the local engine built into CampusMate AI:',
    bulletPoints: [
      '1. Intents & Training Phrases: Developers provide 15–20 example utterances per intent. Dialogflow trains a classifier to match unseen paraphrases and extract action parameters.',
      '2. System & Custom Entities: Dictionaries and regex patterns (e.g., @course_module, @exam_type) that extract typed values from user sentences and support required slot-filling prompts.',
      '3. Input & Output Contexts: State variables with a turn lifespan (e.g., lifespan = 5 turns) that restrict follow-up intents so phrases like "What are the important questions for it?" only fire when a module context is active.',
      '4. Fulfillment & Webhooks: When static responses are insufficient, Dialogflow sends a JSON payload to a webhook endpoint to query databases or compute dynamic answers.'
    ],
    followUpSuggestions: [
      'How does CampusMate AI replicate Dialogflow contexts locally?',
      'Tell me about Module IV spaCy models',
      'What exam questions come from Module III?'
    ],
    sourceReference: 'CSDX 142 Syllabus — Module III: Dialogflow & Components of Chatbot',
    isSampleData: false
  },
  {
    id: 'kb-mod4-overview',
    title: 'Module IV: NLP for Chatbots — Text Processing, spaCy, Messenger & Deployment',
    category: 'syllabus',
    moduleNumber: 'Module IV',
    courseObjective: 'COB4',
    questionPatterns: [
      'explain module 4 nlp for chatbots',
      'module iv syllabus topics',
      'methods of nlp for building chatbot',
      'explain spacy models and pipeline',
      'designing messenger chatbot and deploying chatbot',
      'tokenization stemming lemmatization tfidf'
    ],
    keywords: [
      'module', '4', 'iv', 'four', 'nlp', 'methods', 'spacy', 'tokenization', 'stemming', 'lemmatization', 'stopwords', 'tfidf', 'cosine', 'messenger', 'deploying', 'deployment', 'ner', 'pos'
    ],
    answer:
      'Module IV (9 Hours) covers the core Natural Language Processing (NLP) pipeline required to transform unstructured human text into actionable machine representations, alongside channel integration and deployment.',
    bulletPoints: [
      'NLP Preprocessing Pipeline: Case folding (lowercasing), punctuation stripping, contraction expansion, tokenization, stop-word removal, and morphological normalization (stemming vs. lemmatization).',
      'Feature Representation & Retrieval: Bag-of-Words (BoW), TF-IDF (Term Frequency–Inverse Document Frequency) weighting, Cosine Similarity ranking, and word embeddings (Word2Vec, GloVe).',
      'spaCy Architecture & Models: Industrial-strength Python NLP library featuring pretrained pipelines (en_core_web_sm/md/lg) with Tokenizer → tok2vec → Tagger (POS) → Dependency Parser → EntityRecognizer (NER) → EntityRuler.',
      'Designing & Integrating Messenger Chatbots: Webhook verification (GET challenge token), POST message event handling, sender PSID tracking, structured templates, and quick-reply payloads.',
      'Deploying Chatbots: Static zero-cost edge hosting (GitHub Pages for client-side NLP engines) vs. containerized cloud webhooks (Docker/Cloud Run), HTTPS requirements, and monitoring.'
    ],
    followUpSuggestions: [
      'How is TF-IDF and Cosine Similarity calculated in this chatbot?',
      'Explain spaCy pipeline components in detail',
      'Explain Module V Future Directions and Ethics'
    ],
    sourceReference: 'CSDX 142 Syllabus — Module IV: NLP for Chatbots (9 Hours)',
    isSampleData: false
  },
  {
    id: 'kb-mod4-spacy-tfidf',
    title: 'Module IV Deep Dive: spaCy Pipelines vs. Local TF-IDF & EntityRuler',
    category: 'syllabus',
    moduleNumber: 'Module IV',
    courseObjective: 'COB4',
    questionPatterns: [
      'explain spacy pipeline components tok2vec tagger parser ner',
      'difference between en_core_web_sm and en_core_web_md',
      'how does tfidf cosine similarity formula work',
      'stemming vs lemmatization in nlp'
    ],
    keywords: [
      'spacy', 'tok2vec', 'tagger', 'parser', 'ner', 'entityruler', 'en_core_web_sm', 'en_core_web_md', 'formula', 'tfidf', 'cosine', 'similarity', 'vector', 'lemma'
    ],
    answer:
      'Module IV emphasizes both statistical vector retrieval (TF-IDF + Cosine Similarity) and structured linguistic pipelines (spaCy):',
    bulletPoints: [
      'TF-IDF Formula: weight(t, d) = TF(t, d) × log((N + 1) / (DF(t) + 1)) + 1. Rare domain terms like "spacy" or "dialogflow" receive higher Inverse Document Frequency weight than common terms.',
      'Cosine Similarity: cos(θ) = (Q · D) / (||Q|| × ||D||), measuring the angle between the query vector Q and knowledge document vector D on a [0, 1] scale regardless of document length.',
      'spaCy Pretrained Models: en_core_web_sm (lightweight CNN without static word vectors), en_core_web_md (includes 20k word vectors for semantic similarity), and en_core_web_trf (Transformer-based accuracy).',
      'Browser Equivalent in CampusMate AI: Because Python spaCy requires a server runtime, CampusMate AI implements an equivalent TypeScript pipeline—contraction expansion, stop-word filtering, Porter-style suffix stemming, regex/gazetteer EntityRuler, and TF-IDF cosine ranking—directly in the browser at ₹0 cost.'
    ],
    followUpSuggestions: [
      'Open the NLP Inspector to see live TF-IDF vectors',
      'What is in Module V Future Directions?',
      'Quiz me on Module IV NLP concepts'
    ],
    sourceReference: 'CSDX 142 Syllabus — Module IV: NLP Methods & spaCy Models',
    isSampleData: false
  },
  {
    id: 'kb-mod5-overview',
    title: 'Module V: Future Directions — Multimodality, Reasoning, Social Robots, IoT & Ethics',
    category: 'syllabus',
    moduleNumber: 'Module V',
    courseObjective: 'COB5',
    questionPatterns: [
      'explain module 5 future directions',
      'module v syllabus topics',
      'multimodality in dialogue systems',
      'reasoning and problem solving in dialogue systems',
      'dialogue with social robots and iot',
      'social and ethical issues in chatbots privacy bias hallucination'
    ],
    keywords: [
      'module', '5', 'v', 'five', 'future', 'directions', 'multimodality', 'multimodal', 'reasoning', 'problem', 'solving', 'social', 'robots', 'iot', 'ethical', 'ethics', 'bias', 'privacy', 'hallucination'
    ],
    answer:
      'Module V (9 Hours) explores frontier capabilities and ethical responsibilities in next-generation dialogue systems:',
    bulletPoints: [
      'Multimodality in Dialogue: Combining speech, text, vision (camera/diagrams), gesture, and gaze fusion—including Cross-Modal Attention and late/early sensory fusion.',
      'Reasoning & Problem Solving: Multi-hop inference, neuro-symbolic integration, chain-of-thought decomposition, constraint satisfaction, and verifying factual grounding.',
      'Dialogue with Social Robots & IoT: Embodied conversational agents (Pepper, Furhat) managing spatial turn-taking and affective cues; edge voice interfaces controlling smart-campus/home IoT sensors via MQTT/matter.',
      'Social & Ethical Issues: Algorithmic bias in training corpora, hallucination of false facts, user data privacy (GDPR/DPDP compliance), anthropomorphic deception (pretending a bot is human), and carbon/compute sustainability.'
    ],
    followUpSuggestions: [
      'How does CampusMate AI address ethical transparency and privacy?',
      'What are the limitations of this chatbot?',
      'Show important exam questions for Module V'
    ],
    sourceReference: 'CSDX 142 Syllabus — Module V: Future Directions (9 Hours)',
    isSampleData: false
  },
  {
    id: 'kb-exam-prep-guide',
    title: 'CSDX 142 Exam Preparation Strategy & High-Weightage Topics',
    category: 'exam_prep',
    moduleNumber: 'General',
    questionPatterns: [
      'how to prepare for csdx 142 exam',
      'important exam questions for ai chatbot application',
      'important topics for semester exam',
      'study guide and exam tips for all modules',
      '10 mark questions in csdx 142'
    ],
    keywords: [
      'exam', 'preparation', 'study', 'important', 'questions', 'marks', 'semester', 'revision', 'test', 'tips', 'topics', 'weightage'
    ],
    answer:
      'To score well in the CSDX 142 examination, focus on architectural block diagrams, comparative tables, and concrete pipeline walk-throughs across all five modules:',
    bulletPoints: [
      'Module I (High Priority): Draw and label the complete Dialogue System Architecture (ASR → NLU → DST → Policy → NLG → TTS) and compare Task-Oriented vs. Open-Domain systems.',
      'Module II (High Priority): Explain the Conversational UI Stack diagram and compare Rule-Based, Retrieval-Based, and Generative chatbot training approaches with pros/cons.',
      'Module III (High Priority): Design a Decision Tree for a student/customer support scenario and explain Dialogflow Intents, Entities, Context Lifespan, and Webhook Fulfillment.',
      'Module IV (High Priority): Trace an example sentence through Tokenization, Stop-word removal, Stemming vs. Lemmatization, TF-IDF Cosine Similarity math, and the spaCy NLP pipeline.',
      'Module V (High Priority): Discuss Multimodal Fusion architectures, Reasoning limitations in dialogue systems, IoT/Social Robot constraints, and 5 core Ethical guidelines (Privacy, Bias, Hallucination, Transparency, Safety).'
    ],
    followUpSuggestions: [
      'Start the Interactive Exam Prep Decision Tree',
      'Take the CSDX 142 Syllabus Quiz',
      'Explain Module IV TF-IDF math for the exam'
    ],
    sourceReference: 'CSDX 142 Academic Study Guide & Question Bank',
    isSampleData: false
  },
  {
    id: 'kb-placement-ai-nlp',
    title: 'Placement Guidance: AI/ML & Software Engineering Interview Preparation',
    category: 'placement',
    moduleNumber: 'General',
    questionPatterns: [
      'placement preparation tips for cse and ai students',
      'how to explain this chatbot project in placement interview',
      'common nlp and ai interview questions for placements',
      'resume tips and technical interview guidance',
      'career guidance for software and ml roles'
    ],
    keywords: [
      'placement', 'interview', 'career', 'resume', 'job', 'company', 'hr', 'technical', 'dsa', 'project', 'pitch', 'recruiter', 'preparation'
    ],
    answer:
      'When presenting CampusMate AI during campus placements or technical interviews, structure your explanation around engineering trade-offs, measurable evaluation metrics, and deterministic reliability:',
    bulletPoints: [
      '2-Minute Project Pitch (STAR Method): Explain how you built a zero-cost client-side NLP + TF-IDF retrieval + Finite-State Dialogue Manager in TypeScript without relying on paid external LLM wrappers.',
      'Key Technical Questions Asked by Interviewers: (1) Why TF-IDF + Cosine Similarity over simple substring matching? (2) How do you prevent false positives? (Answer: Calibrated confidence threshold + ambiguity margin check). (3) How is multi-turn context stored? (Answer: FSM DialogueContext with pronoun/coreference slot resolution).',
      'Core Placement Tracks: Combine strong Data Structures & Algorithms (Arrays, Trees, Graphs, Dynamic Programming) with 1–2 deep, verifiable projects where you understand every line of code.',
      'Resume Bullet Template: "Engineered a zero-cost local NLP chatbot using TF-IDF vectorization, cosine similarity ranking, regex/gazetteer entity extraction, and finite-state dialogue management achieving >90% intent accuracy on an evaluation benchmark."'
    ],
    followUpSuggestions: [
      'Start the Placement Readiness Decision Tree',
      'Practice Mock Interview Questions in the Quiz & Prep tab',
      'How does the confidence threshold work?'
    ],
    sourceReference: 'CampusMate Career & Placement Preparation Guide',
    isSampleData: false
  },
  {
    id: 'kb-college-faq-academic',
    title: 'Sample College FAQ: Attendance, Grading & Exam Eligibility [Sample Demo Data]',
    category: 'college_faq',
    moduleNumber: 'General',
    questionPatterns: [
      'what is the minimum attendance requirement',
      'college attendance rule and medical leave',
      'cgpa grading system and passing marks',
      'internal assessment marks split cat exam',
      'semester exam eligibility rules'
    ],
    keywords: [
      'attendance', 'minimum', '75%', 'medical', 'leave', 'cgpa', 'gpa', 'grading', 'passing', 'marks', 'internal', 'cat', 'assessment', 'eligibility', 'college', 'rules'
    ],
    answer:
      '[SAMPLE DEMO DATA — For Academic Project Demonstration Only] In the sample engineering college curriculum model used for this demo, course evaluation and attendance follow a standard credit-based structure:',
    bulletPoints: [
      '[Sample Rule] Attendance Requirement: Minimum 75% overall attendance is required to appear for End-Semester Examinations (65%–74% requires approved medical certificate condonation).',
      '[Sample Rule] Assessment Weightage (100 Marks): 40 Marks Continuous Internal Assessment (2 CAT exams + Capstone Project/Assignment) and 60 Marks End-Semester Theory Examination.',
      '[Sample Rule] Passing Criterion: Minimum 50% aggregate marks (internal + external combined) and at least 45% in the end-semester exam.',
      'Disclaimer: These figures are clearly labeled sample dataset entries for demonstrating CSDX 142 FAQ retrieval. Always consult your department handbook for official university regulations.'
    ],
    followUpSuggestions: [
      'What college services and library timings are in the sample FAQ?',
      'How can I add my own college FAQ to the Knowledge Base?',
      'Explain how FAQ retrieval works'
    ],
    sourceReference: 'Sample Campus Handbook Dataset v1.0 [Explicit Demo Data]',
    isSampleData: true
  },
  {
    id: 'kb-college-faq-services',
    title: 'Sample College FAQ: Library, Labs, Bonafide & Hostel Services [Sample Demo Data]',
    category: 'college_faq',
    moduleNumber: 'General',
    questionPatterns: [
      'library timings and book borrowing rules',
      'how to apply for bonafide certificate or internship noc',
      'computer lab hours and wifi access',
      'hostel and campus student support services',
      'student helpdesk and administrative office faq'
    ],
    keywords: [
      'library', 'timings', 'books', 'bonafide', 'certificate', 'noc', 'internship', 'lab', 'wifi', 'hostel', 'services', 'helpdesk', 'office', 'campus'
    ],
    answer:
      '[SAMPLE DEMO DATA — For Academic Project Demonstration Only] Here are the sample campus service workflows included in the demonstration knowledge base:',
    bulletPoints: [
      '[Sample Service] Central Library: Open Monday–Saturday, 8:00 AM to 8:00 PM. Students may borrow up to 4 textbooks for 14 days using their smart ID card.',
      '[Sample Service] Bonafide & Internship NOC: Apply via the Student ERP Portal → Certificates tab; digital certificates are issued within 2 working days at ₹0 fee.',
      '[Sample Service] AI & Computing Lab (CSDX 142 Lab): Open 8:30 AM to 5:30 PM with pre-installed Node.js, Python 3.11, spaCy, and Git.',
      'Customization Tip: You can open the "Knowledge Base" tab in the navigation bar to add or import your institution\'s custom JSON FAQs.'
    ],
    followUpSuggestions: [
      'How do I add custom entries to the Knowledge Base?',
      'What are the sample attendance and grading rules?',
      'Show me the CSDX 142 syllabus modules'
    ],
    sourceReference: 'Sample Student Services Directory [Explicit Demo Data]',
    isSampleData: true
  },
  {
    id: 'kb-terminology-glossary',
    title: 'Academic Glossary: Key Chatbot & NLP Terminology (CSDX 142)',
    category: 'terminology',
    moduleNumber: 'General',
    questionPatterns: [
      'define intent entity utterance slot filling',
      'glossary of chatbot terms and definitions',
      'what is coreference resolution and grounding',
      'what is fallback threshold and confusion matrix',
      'academic terminology definitions for chatbots'
    ],
    keywords: [
      'define', 'definition', 'terminology', 'glossary', 'utterance', 'intent', 'entity', 'coreference', 'grounding', 'fallback', 'threshold', 'token', 'lemma'
    ],
    answer:
      'Key academic definitions from the CSDX 142 syllabus used directly in CampusMate AI:',
    bulletPoints: [
      'Utterance: Any raw phrase or sentence typed or spoken by the user (e.g., "What is in Module 4?").',
      'Intent: The underlying goal or action category behind an utterance (e.g., syllabus_query, exam_prep, placement_guidance).',
      'Entity (Slot): A specific structured parameter extracted from the utterance (e.g., module = "Module IV", topic = "spaCy").',
      'Coreference Resolution: Linking pronouns like "it", "that module", or "its topics" back to the entity mentioned in the previous turn.',
      'Confidence Threshold (τ): The minimum score required to accept a retrieval match. If score < τ, the dialogue manager triggers a safe Fallback or Clarification state instead of guessing.'
    ],
    followUpSuggestions: [
      'How does this chatbot work internally?',
      'Explain Module IV TF-IDF and Cosine Similarity',
      'Test coreference resolution with a follow-up question'
    ],
    sourceReference: 'CSDX 142 Core Terminology Reference (Modules I–V)',
    isSampleData: false
  },
  {
    id: 'kb-how-bot-works',
    title: 'How CampusMate AI Works: Honest Architecture & Zero-Cost NLP Pipeline',
    category: 'bot_help',
    moduleNumber: 'General',
    questionPatterns: [
      'how does this chatbot work',
      'are you a large language model or rule based',
      'explain your architecture and nlp pipeline',
      'why is this project zero cost',
      'what commands and features do you support'
    ],
    keywords: [
      'how', 'work', 'works', 'architecture', 'llm', 'openai', 'gemini', 'zero', 'cost', 'free', 'commands', 'help', 'capabilities', 'honest', 'limitations'
    ],
    answer:
      'Transparency Statement: CampusMate AI is NOT a remote Large Language Model (LLM) and makes zero calls to paid external APIs (no OpenAI, Gemini, or Claude). It is a deterministic, client-side Hybrid NLP + TF-IDF Retrieval + Finite-State Dialogue System running 100% in your browser at ₹0 cost.',
    bulletPoints: [
      'Stage 1 — Text Preprocessing: Lowercasing, contraction expansion, punctuation stripping, tokenization, stop-word removal, and Porter-style suffix stemming.',
      'Stage 2 — Intent & Entity Extraction: Pattern + token-weight intent classifier across 10 intents paired with regex/gazetteer entity extraction for modules (I–V), course codes, COBs, and NLP topics.',
      'Stage 3 — TF-IDF & Cosine Similarity Retrieval: Vectorizes the query against all Knowledge Base entries, applies entity boosts, and checks both the rejection threshold (default 0.18) and top-2 ambiguity margin.',
      'Stage 4 — Finite-State Dialogue Manager: Tracks multi-turn context (resolving follow-ups like "What are the exam questions for it?"), manages interactive Decision Trees, and logs full pipeline telemetry.'
    ],
    followUpSuggestions: [
      'Start a Guided Decision Tree',
      'Explain Module I Dialogue Systems',
      'What are the limitations of TF-IDF retrieval vs LLMs?'
    ],
    sourceReference: 'CampusMate AI System Architecture Specification v1.0',
    isSampleData: false
  }
];
