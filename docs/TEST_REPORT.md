# Test & Verification Report — CampusMate AI (CSDX 142)

## 1. Automated Unit Tests (`src/nlp/chatbotEngine.test.ts`)

Executed via Node's built-in test runner (`npx --yes tsx --test src/nlp/chatbotEngine.test.ts`):

| Test Suite Name | Scope Verified | Status |
| :--- | :--- | :--- |
| **1. NLP Preprocessor** | Contraction expansion (`"What's"` → `"what is"`), hyphen normalization (`TF-IDF` → `tfidf`), stop-word removal, Roman numeral preservation after `Module`, Porter stemming (`deploying` → `deploy`). | **PASS** |
| **2. Entity Extractor** | Extracts `Module I`–`Module V` across digits (`4`), Roman numerals (`IV`), and ordinal words (`third`), `CSDX 142` course code, `COB1`–`COB5`, and syllabus topics (`spaCy`, `Dialogflow`, `TF-IDF`). | **PASS** |
| **3. Intent Classifier** | Classifies `greeting`, `syllabus_query`, `exam_prep`, `placement_guidance`, `college_faq`, `decision_tree_start`, and rejects out-of-domain sports/weather queries to `unknown_fallback`. | **PASS** |
| **4. TF-IDF Retriever** | Ranks `Module IV` spaCy & TF-IDF entries at #1 with calibrated confidence score $\ge 0.45$ when queried on `tok2vec tagger parser ner`. | **PASS** |
| **5. Dialogue Manager FSM** | Verifies empty/whitespace handling, multi-turn pronoun coreference (`"What are the spacy pipeline components in it?"` resolving `it` → `Module IV`), Decision Tree branch transitions, and `FALLBACK_RECOVERY`. | **PASS** |
| **6. 16-Case Evaluation Dataset Benchmark** | Verifies intent classification and retrieval across all 16 benchmark queries in `src/data/evaluationDataset.ts` (Achieved **100% [16/16] accuracy**). | **PASS** |

---

## 2. 16-Query NLP Evaluation Benchmark Results

| ID | Test Query | Expected Intent | Predicted Intent | Top Score | Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eval-01` | Hello CampusMate! Good morning, what can you help me with? | `greeting` | `greeting` | `0.85` | **PASS** |
| `eval-02` | What are the 5 modules and credit structure of CSDX 142? | `syllabus_query` | `syllabus_query` | `0.80` | **PASS** |
| `eval-03` | Explain Module 1 dialogue system architecture and ELIZA history | `syllabus_query` | `syllabus_query` | `0.99` | **PASS** |
| `eval-04` | What is the difference between NLU, DST, and NLG in a dialogue pipeline? | `syllabus_query` | `syllabus_query` | `0.90` | **PASS** |
| `eval-05` | Tell me about Module II Conversational UI stack and training approaches | `syllabus_query` | `syllabus_query` | `0.99` | **PASS** |
| `eval-06` | How do Dialogflow intents, entities, contexts, and webhook fulfillment work in Module 3? | `syllabus_query` | `syllabus_query` | `0.99` | **PASS** |
| `eval-07` | Explain Module IV NLP methods, spaCy pipeline components, and TF-IDF | `syllabus_query` | `syllabus_query` | `0.99` | **PASS** |
| `eval-08` | What are the stages in spaCy like tok2vec, tagger, parser, and ner? | `syllabus_query` | `syllabus_query` | `0.86` | **PASS** |
| `eval-09` | What is covered in Module V regarding multimodality, social robots, IoT, and ethics? | `syllabus_query` | `syllabus_query` | `0.99` | **PASS** |
| `eval-10` | What are the course objectives COB1 to COB5 for this subject? | `syllabus_query` | `syllabus_query` | `0.94` | **PASS** |
| `eval-11` | How should I prepare for the CSDX 142 semester exam and important 10 mark questions? | `exam_prep` | `exam_prep` | `0.92` | **PASS** |
| `eval-12` | Give me placement interview tips and how to pitch this AI project to recruiters | `placement_guidance` | `placement_guidance` | `0.89` | **PASS** |
| `eval-13` | What is the minimum attendance rule and how do I apply for a bonafide certificate? | `college_faq` | `college_faq` | `0.78` | **PASS** |
| `eval-14` | How does this chatbot work internally and are you using an LLM API? | `architecture_how_it_works` | `architecture_how_it_works` | `0.95` | **PASS** |
| `eval-15` | Start a guided decision tree flow for exam prep | `decision_tree_start` | `decision_tree_start` | `0.99` | **PASS** |
| `eval-16` | What is the live Champions League football score and Bitcoin price today? | `unknown_fallback` | `unknown_fallback` | `0.00` | **PASS** |
