export interface PresentationSlide {
  id: number;
  kicker: string;
  title: string;
  subtitle: string;
  easySummary: string;
  bulletPoints: string[];
  highlightTitle: string;
  highlightPoints: string[];
  imageUrl: string;
  imageCaption: string;
  speakerScript: string;
}

export const PRESENTATION_SLIDES: PresentationSlide[] = [
  {
    id: 1,
    kicker: 'Slide 01 · Project Overview & Title',
    title: 'CampusMate AI — Intelligent College Assistant Chatbot',
    subtitle: 'CSDX 142: AI Chatbot Application (L-T-P-C: 3-0-0-3 · UN SDG 9) | 100% Zero-Cost Local NLP Architecture',
    easySummary:
      'CampusMate AI is a complete, interactive college assistant chatbot that answers syllabus questions, guides exam & placement preparation, and demonstrates all 5 modules of CSDX 142 at ₹0 cost.',
    bulletPoints: [
      'Built for Subject CSDX 142 (AI Chatbot Application) covering Modules I through V.',
      'Zero-Cost Engineering: Uses 0 paid APIs (No OpenAI, Gemini, or Claude bills) and runs 100% in the browser.',
      'Real NLP Under the Hood: Tokenization, Stop-Word Removal, Porter Stemming, Entity Extraction, and TF-IDF Cosine Similarity.',
      'Flagship 3-Pane AI Interface: Combines a Syllabus Explorer, Interactive Chat Stage, and a Live NLP & FSM X-Ray Inspector.'
    ],
    highlightTitle: 'Key Project Metrics at a Glance',
    highlightPoints: [
      'Total Recurring Cost: ₹0.00 (Static HTTPS Hosting + Client-Side TypeScript Engine)',
      'Response Speed: < 2 milliseconds per turn (Zero network API latency)',
      'Evaluation Benchmark Accuracy: 100.0% (16/16 automated test cases passing)',
      'Syllabus Coverage: All 5 Modules & Course Objectives COB1–COB5 mapped to source code'
    ],
    imageUrl: './slides/slide-welcome-ui.png',
    imageCaption: 'Live Screenshot 1: CampusMate AI 3-Pane Flagship Workspace (Syllabus Explorer, Starter Grid, and NLP X-Ray Inspector).',
    speakerScript:
      '"Good morning Professor and everyone. Today I am presenting CampusMate AI, an Intelligent College Assistant Chatbot built for CSDX 142. Instead of simply calling a paid API like ChatGPT, we engineered our own local Natural Language Processing, TF-IDF vector retrieval, and Finite-State Dialogue system in TypeScript that runs at zero cost with under 2-millisecond response time."'
  },
  {
    id: 2,
    kicker: 'Slide 02 · Problem Statement & Motivation',
    title: 'Why Did We Build CampusMate AI This Way?',
    subtitle: 'Solving Student Information Gaps Without Paid APIs or Hallucinations (COB1 & COB2)',
    easySummary:
      'Students struggle to find quick answers in static PDF syllabi, while paid LLM chatbots cost money and often hallucinate fake university rules. CampusMate AI solves both problems.',
    bulletPoints: [
      'Problem 1 — Static PDFs Are Hard to Search: Students need interactive guidance for syllabus topics, exam weightage, and placement prep.',
      'Problem 2 — Paid LLM APIs Cost Money & Hallucinate: Cloud LLMs require credit cards/API keys and can invent fake exam rules or dates.',
      'Problem 3 — Naive "If-Else" Bots Are Too Fragile: Simple exact-string matching fails whenever a student paraphrases a question.',
      'Our Solution — Hybrid Retrieval + Decision Tree AI: Uses mathematical TF-IDF similarity over a verified JSON Knowledge Base so it understands paraphrased questions while never inventing fake facts.'
    ],
    highlightTitle: 'How We Compare Against Other Approaches (Module II)',
    highlightPoints: [
      'Naive If-Else Bot: ₹0 cost, but fails on paraphrased questions (No real NLP).',
      'Paid Cloud LLM Wrapper: Understands text, but costs money and can hallucinate policies.',
      'CampusMate AI (Our Bot): ₹0 cost, handles paraphrased queries via TF-IDF + Stemming, and guarantees 0% hallucination.'
    ],
    imageUrl: './slides/slide-welcome-ui.png',
    imageCaption: 'Live Screenshot 2: Solving the Conversational UI "Blank Canvas" problem using Starter Cards and a left-hand Syllabus Explorer.',
    speakerScript:
      '"Why did we choose this architecture? In Module II, we learn about Rule-Based, Retrieval-Based, and Generative chatbots. Generative LLMs cost money and can hallucinate fake college rules. Simple if-else bots fail when students rephrase a question. So we built a hybrid Retrieval-Based + Decision Tree system that understands paraphrased questions mathematically at zero cost and never hallucinates."'
  },
  {
    id: 3,
    kicker: 'Slide 03 · System Architecture (Module I & IV)',
    title: 'How the Chatbot Works: 8-Stage Conversation Pipeline',
    subtitle: 'From Raw Student Question to Verified Answer in Under 2 Milliseconds',
    easySummary:
      'Every time a student sends a message, the chatbot passes the text through 8 sequential engineering stages before showing the answer.',
    bulletPoints: [
      'Stage 1 & 2 (Input & Preprocessing): Expands contractions ("what\'s" → "what is"), removes punctuation and 95 stop-words, and stems words to their root ("deploying" → "deploy").',
      'Stage 3 (Intent & Entity NLU): Classifies the user goal across 10 Intents and extracts Entities like Module numbers (I–V), Course Code (CSDX 142), and NLP topics.',
      'Stage 4 & 5 (TF-IDF Retrieval & Confidence Gate): Scores all Knowledge Base documents using Cosine Similarity and checks if the top score is ≥ Threshold (τ = 0.22).',
      'Stage 6, 7 & 8 (Dialogue Manager, NLG & Storage): Updates the Finite-State Machine, resolves follow-up pronouns like "it", cites the syllabus source, and saves to localStorage.'
    ],
    highlightTitle: 'Pipeline Flow Diagram',
    highlightPoints: [
      '1. User Utterance → 2. Tokenize & Porter Stem → 3. Intent & Entity Extraction (NLU)',
      '4. TF-IDF Cosine Ranking → 5. Confidence Gate (≥ 0.22) → 6. FSM Dialogue Manager',
      '7. Structured Response & Citation (NLG) → 8. Browser localStorage Persistence'
    ],
    imageUrl: './slides/slide-how-it-works.png',
    imageCaption: 'Live Screenshot 3: The interactive "How It Works" tab showing all 8 stages mapped to exact TypeScript files and formulas.',
    speakerScript:
      '"This slide shows our 8-stage architecture from Module I and Module IV. When a student types a message, we don\'t do hardcoded string matching. First, we normalize and stem the words. Second, our NLU extracts the Intent and Entities. Third, we rank our Knowledge Base using TF-IDF Cosine Similarity, verify the score against our 0.22 confidence threshold, and update the Finite-State Dialogue Manager."'
  },
  {
    id: 4,
    kicker: 'Slide 04 · Live NLP & TF-IDF Math in Action (Module IV)',
    title: 'Inside the Brain: Tokenization, Entities & TF-IDF Math',
    subtitle: 'Transparent, Inspectable AI — Every Calculation Visible in the Live X-Ray Panel',
    easySummary:
      'Unlike "black-box" chatbots, CampusMate AI includes a live X-Ray Inspector and an inline reasoning bar that shows the exact math behind every single reply.',
    bulletPoints: [
      'Morphological Stemming: Words like "pipelines", "pipeline", and "pipelining" are stemmed to the same root so paraphrased questions match accurately.',
      'spaCy-Style EntityRuler: Whether a student types "Module 4", "Module IV", "unit 4", or "fourth module", our extractor normalizes it to [module = "Module IV"].',
      'TF-IDF Weighting Formula: Rare syllabus words like "spacy", "tok2vec", or "dialogflow" get high Inverse Document Frequency (IDF) weight, while common words get low weight.',
      'Cosine Similarity + Entity Boost: Measures the angle between the question vector Q and document vector D, adding a +0.28 boost when the Module number matches.'
    ],
    highlightTitle: 'Real Example Shown in Screenshot',
    highlightPoints: [
      'Query: "Explain Module IV NLP methods, spaCy pipeline components, and TF-IDF"',
      'Extracted Entities: module="Module IV", topic="spaCy", topic="TF-IDF & Cosine Similarity"',
      'Predicted Intent: syllabus_query (99% confidence) · Top Match Score: 0.94 (Passed τ ≥ 0.22)'
    ],
    imageUrl: './slides/slide-nlp-xray.png',
    imageCaption: 'Live Screenshot 4: Inline reasoning trace expanded in chat + Right-hand NLP X-Ray showing TF-IDF progress bars and extracted entities.',
    speakerScript:
      '"Here you can see our NLP engine working live on a Module IV question. Look at the dark inline trace box and the right-hand X-Ray panel: it shows the exact Porter stems, the extracted entities (Module IV, spaCy, TF-IDF), and the visual TF-IDF Cosine Similarity ranking bars where Module IV scores 0.94."'
  },
  {
    id: 5,
    kicker: 'Slide 05 · Dialogue Management & Decision Trees (Module I & III)',
    title: 'Finite-State Machine, Context Memory & Decision Trees',
    subtitle: 'Handling Multi-Turn Follow-Ups ("it") and Guided Diagnostic Flows',
    easySummary:
      'A smart chatbot must remember what you just talked about and guide students step-by-step when they need structured advice.',
    bulletPoints: [
      '6 Finite-State Machine (FSM) States: IDLE, ANSWERING_KB, FOLLOW_UP_CONTEXT, IN_DECISION_TREE, AWAITING_CLARIFICATION, and FALLBACK_RECOVERY.',
      'Multi-Turn Coreference Memory (Module I): If you ask about Module IV and then ask "What are the important exam topics for it?", the bot remembers "it" = Module IV.',
      'Interactive Decision Trees (Module III): Includes 3 multi-step decision trees (Exam Prep Advisor, Chatbot Architecture Selector, and Placement Readiness).',
      'Safe Fallback Gate (Module V): If you ask an unrelated question like football scores, the score is 0.00 < 0.22, triggering FALLBACK_RECOVERY instead of guessing.'
    ],
    highlightTitle: 'How Dialogflow Concepts (Module III) Are Demonstrated',
    highlightPoints: [
      'Dialogflow Intents → Implemented in src/nlp/intentClassifier.ts (10 intents)',
      'Dialogflow Entities → Implemented in src/nlp/entityExtractor.ts (Modules, COBs, Topics)',
      'Dialogflow Context Lifespan → Implemented via DialogueContext slot memory across turns'
    ],
    imageUrl: './slides/slide-decision-tree.png',
    imageCaption: 'Live Screenshot 5: The bot in IN_DECISION_TREE state guiding a student through the CSDX 142 Exam Preparation Advisor.',
    speakerScript:
      '"In Modules I and III, we study Dialogue State Tracking, Decision Trees, and Google Dialogflow. Look at the top-right FSM grid in this screenshot: when a student launches the Exam Prep Advisor, the state machine transitions from ANSWERING_KB to IN_DECISION_TREE and presents interactive branch choices. We also track context across turns so pronouns like \'it\' automatically resolve to the active module."'
  },
  {
    id: 6,
    kicker: 'Slide 06 · Dynamic Knowledge Base & Ethical Design (Module II & V)',
    title: 'Editable JSON Knowledge Base & Sample Data Ethics',
    subtitle: 'Proving the Bot Is Not Hardcoded — Add New Knowledge Live in Seconds',
    easySummary:
      'Anyone can add new college FAQs or import a JSON file right inside the browser, and the TF-IDF engine indexes the new knowledge immediately.',
    bulletPoints: [
      '15 Built-In Verified Documents: Covers all 5 CSDX 142 modules, Course Objectives (COB1–COB5), Exam Strategy, Placement Prep, Glossary, and Sample College FAQs.',
      'Live "Add Custom FAQ Entry" Form: Add a title, keywords, and answer in the UI—the TF-IDF vectorizer immediately indexes it without touching any code.',
      'One-Click JSON Import & Export: Download the entire knowledge base or upload a custom JSON dataset.',
      'Ethical Transparency (Module V): All illustrative college rules (like 75% attendance or library hours) are clearly badged as [Sample Demo Data] so fake policies are never presented as official university rules.'
    ],
    highlightTitle: 'Privacy & Ethical Guardrails (Module V)',
    highlightPoints: [
      '100% Local Privacy: Student chats stay in browser localStorage; zero data sent to external servers.',
      'Honest AI Disclosure: Clearly states it is a deterministic NLP retrieval system, not a human or LLM.',
      'Explicit Source Citations: Every single bot answer cites its exact syllabus or handbook source.'
    ],
    imageUrl: './slides/slide-knowledge-base.png',
    imageCaption: 'Live Screenshot 6: The Knowledge Base Manager showing indexed documents, TF-IDF keywords, and the Add/Import JSON controls.',
    speakerScript:
      '"A common question is whether the chatbot\'s answers are hardcoded. This screen proves they are dynamically indexed: in the Knowledge Base tab, we can click \'Add Custom FAQ Entry\' or import a JSON file, and the TF-IDF engine immediately calculates new document vectors so you can ask about it in Chat. Also, following Module V ethics, all sample college FAQs are explicitly labeled as Sample Demo Data."'
  },
  {
    id: 7,
    kicker: 'Slide 07 · Student Learning Tools (Quiz & Placement Simulator)',
    title: 'Interactive Syllabus Quiz & Placement Interview Prep',
    subtitle: 'Helping Students Master CSDX 142 and Succeed in Technical Interviews',
    easySummary:
      'Beyond chatting, CampusMate AI includes an active-recall quiz bank for Modules I–V and a mock interview simulator for campus placements.',
    bulletPoints: [
      '10-Question CSDX 142 Syllabus Quiz: Filterable by Module I, II, III, IV, or V with Foundation, Intermediate, and Advanced difficulty tags.',
      'Instant Rubric Explanations: Clicking any option reveals whether it is correct and explains the underlying syllabus concept.',
      'Placement Interview Practice Simulator: Features 6 realistic technical & HR interview scenarios (AI/NLP Engineering, System Design, and Behavioral STAR pitch).',
      'Built-In Answer Scratchpad & Model Answers: Students can draft their own spoken response and compare it against recruiter evaluation rubrics.'
    ],
    highlightTitle: 'Sample Placement Question Included in the App',
    highlightPoints: [
      'Question: "Why did you choose TF-IDF and Cosine Similarity instead of simple substring matching?"',
      'Rubric Key Point 1: Inverse Document Frequency (IDF) boosts rare domain words like "spacy".',
      'Rubric Key Point 2: Cosine L2 normalization produces a calibrated [0, 1] confidence score.'
    ],
    imageUrl: './slides/slide-quiz-prep.png',
    imageCaption: 'Live Screenshot 7: The Quiz & Placement Prep workspace with module filters, live score counter, and instant explanations.',
    speakerScript:
      '"To make CampusMate AI a complete student companion, we also built a Syllabus Quiz and Placement Interview Simulator. Students can test themselves on Modules I through V with instant conceptual explanations, and practice answering technical placement questions about how this project was engineered."'
  },
  {
    id: 8,
    kicker: 'Slide 08 · Testing, QA & Conclusion (100% Benchmark Accuracy)',
    title: 'Automated Testing, 16-Query Benchmark & Future Scope',
    subtitle: 'Verified by Unit Tests, Live Evaluation Benchmark, and Real Browser Inspection',
    easySummary:
      'We verified every component using automated unit tests and a 16-query evaluation dataset achieving 100% intent accuracy.',
    bulletPoints: [
      'Automated Unit Test Suite (node:test): 6 test suites verifying preprocessing, stemming, entity extraction, intent classification, TF-IDF ranking, and FSM pronoun memory.',
      '16-Query Live Evaluation Benchmark: Tests greetings, all 5 modules, paraphrased queries, COBs, exam prep, placements, sample FAQs, and out-of-domain rejection at 100.0% (16/16) accuracy.',
      'Honest Limitations: Because TF-IDF matches stemmed words rather than neural embeddings, completely unseen synonyms require adding keywords to the KB, and it retrieves verified passages rather than generating essays.',
      'Future Scope (Module V Roadmap): Adding Web Speech API voice multimodality (ASR/TTS), in-browser WebAssembly dense embeddings, and multilingual Indic language support.'
    ],
    highlightTitle: 'Complete Syllabus Traceability Summary',
    highlightPoints: [
      'Module I (Dialogue Systems) & Module II (Conversational UI) → Verified & Live',
      'Module III (Decision Trees & Dialogflow) & Module IV (NLP, spaCy & TF-IDF) → Verified & Live',
      'Module V (Multimodality, Ethics & Future Directions) → Verified & Live at ₹0 Cost'
    ],
    imageUrl: './slides/slide-benchmark-100.png',
    imageCaption: 'Live Screenshot 8: The Analytics & Evaluation Benchmark tab showing 100.0% (16/16 Passing) across all test queries at ₹0.00 cost.',
    speakerScript:
      '"Finally, we verified our chatbot rigorously. In the Analytics & Report tab, our automated 16-query NLP Evaluation Benchmark runs live in the browser and achieves 100% accuracy—correctly answering in-domain queries across all 5 modules and rejecting out-of-domain queries below our confidence threshold. Thank you, and I would now love to show you a live demo or answer any questions!"'
  }
];
