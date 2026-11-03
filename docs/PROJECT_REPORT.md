# Academic Project Report: CampusMate AI — Intelligent College Assistant Chatbot

**Subject Code & Title:** CSDX 142 — AI Chatbot Application (L-T-P-C: 3-0-0-3, SDG 9)  
**Project Title:** CampusMate AI — Zero-Cost Local NLP, TF-IDF Retrieval & Finite-State Dialogue Assistant

---

## 1. Problem Statement

University students frequently need immediate, accurate answers regarding course syllabi, module-wise exam preparation, placement interview readiness, and campus procedures. However:
1. Searching through static PDF syllabi and handbooks is slow and lacks interactive guidance.
2. Commercial Large Language Model (LLM) APIs require paid subscriptions/API keys, introduce network latency, expose student queries to third-party servers, and risk hallucinating unverified university rules or exam dates.

**Objective:** Design, implement, test, and deploy a 100% zero-cost, privacy-preserving, deterministic AI Chatbot web application that demonstrates all five instructional modules of CSDX 142 using verifiable client-side NLP, TF-IDF vector retrieval, and Finite-State Dialogue Management.

---

## 2. Course Objectives Alignment (COB1–COB5)

- **COB1 (Dialogue Systems & Architecture):** Implemented a modular NLU → Dialogue State Tracker (DST) → Dialogue Policy → NLG pipeline with explicit state transitions and coreference slot memory.
- **COB2 (Conversational UI & Evolution):** Built an accessible, responsive Conversational UI with onboarding quick replies, typing feedback, threshold controls, and a JSON Knowledge Base editor to overcome CUI discoverability gaps.
- **COB3 (Business Need, Decision Trees & Dialogflow):** Implemented 3 interactive multi-step Decision Trees and replicated Dialogflow's Intent, Entity, and Input/Output Context lifespan mechanisms locally.
- **COB4 (NLP Methods, spaCy Concepts & Deployment):** Engineered tokenization, stop-word filtering, Porter-style suffix stemming, regex/gazetteer entity extraction (modeled on spaCy's `EntityRuler`), and sublinear TF-IDF + Cosine Similarity ranking.
- **COB5 (Future Directions, Reasoning & Ethics):** Enforced a calibrated confidence rejection threshold (`τ = 0.22`) to prevent hallucination, clearly labeled all sample college FAQs as `[Sample Demo Data]`, and preserved 100% local data privacy.

---

## 3. System Methodology & Mathematical Formulation

### 3.1 Text Preprocessing (`src/nlp/preprocessor.ts`)
Given a raw user utterance $u_t$, the preprocessor performs:
1. Lowercasing and contraction expansion (e.g., `"what's"` $\to$ `"what is"`).
2. Technical compound normalization (`"tf-idf"` $\to$ `"tfidf"`).
3. Alphanumeric tokenization and stop-word removal against a 95-word stop-word lexicon (with contextual preservation of Roman numerals `i`–`v` following `"module"` or `"unit"`).
4. Deterministic Porter-style suffix stemming (`stemWord`).

### 3.2 Entity Extraction (`src/nlp/entityExtractor.ts`)
Extracts typed slots $E = \{(t_i, v_i)\}$ across five entity categories:
- `module`: Normalizes `"Module 4"`, `"Module IV"`, `"fourth module"`, and `"unit 4"` to canonical `"Module IV"`.
- `course_code`: Recognizes `"CSDX 142"`.
- `cob`: Recognizes `"COB1"` through `"COB5"`.
- `topic`: Matches 16 syllabus domain concepts (`Dialogflow`, `spaCy`, `TF-IDF & Cosine Similarity`, `NLU`, `DST`, `NLG`, `Decision Trees`, `Multimodality`, `Social Robots`, `IoT Dialogue`, `Ethics & Privacy`, etc.).

### 3.3 TF-IDF Vectorization & Cosine Similarity (`src/nlp/retriever.ts`)
For a corpus of $N$ knowledge base documents, the Inverse Document Frequency of stemmed term $t$ is:
$$\text{IDF}(t) = \ln\left(\frac{N + 1}{\text{DF}(t) + 1}\right) + 1$$
Sublinear Term Frequency weight is:
$$w(t, d) = (1 + \ln(\text{TF}(t, d))) \times \text{IDF}(t)$$
Cosine similarity between query vector $\mathbf{Q}$ and document vector $\mathbf{D}$ is:
$$\cos(\theta) = \frac{\mathbf{Q} \cdot \mathbf{D}}{\|\mathbf{Q}\|_2 \|\mathbf{D}\|_2}$$
The final calibrated retrieval score combines Cosine Similarity ($0.55$ weight), Keyword Overlap ($0.35$ weight), and structured Entity Alignment Boosts ($+0.28$ when the query's extracted `module` matches the document's `moduleNumber`).

### 3.4 Finite-State Dialogue Manager (`src/dialogue/dialogueManager.ts`)
Maintains `DialogueContext` across 6 states:
- `IDLE`: Ready for new conversation turns.
- `ANSWERING_KB`: Returned a verified knowledge base entry above threshold $\tau$.
- `FOLLOW_UP_CONTEXT`: Resolved pronoun coreference (`"it"`, `"its"`, `"that module"`) using `context.lastModule` or `context.lastTopic`.
- `IN_DECISION_TREE`: Stepping deterministically through a multi-node Decision Tree DAG.
- `AWAITING_CLARIFICATION`: Top-2 matches from different modules scored within $0.04$ margin; prompts user disambiguation.
- `FALLBACK_RECOVERY`: Top score $< \tau$; safely declines to guess and offers guided recovery prompts.

---

## 4. Honest Limitations & Zero-Cost Justification

### Why Recurring Cost is ₹0
- **Zero External APIs:** No OpenAI, Gemini, Claude, or cloud NLU API keys are used.
- **Zero Server Compute Bill:** All vector math runs in $< 2\text{ ms}$ inside the user's browser tab.
- **Zero Database Bill:** Knowledge base customization and chat history use browser `localStorage` and JSON file import/export.

### Technical Limitations
1. **Lexical Matching vs. Deep Semantic Reasoning:** TF-IDF relies on stemmed lexical overlap. If a user phrases a query using synonyms completely absent from the Knowledge Base patterns/keywords, recall is lower than a dense neural embedding model.
2. **Non-Generative Retrieval:** The chatbot retrieves curated academic passages and bullet points; it does not synthesize novel essays or write arbitrary code outside its knowledge base.

---

## 5. Future Scope (Module V Extensions — Clearly Marked as Future Work)

1. **[Future Work] WebAssembly / WebGPU Dense Embeddings:** Integrating quantized local embedding models (`all-MiniLM-L6-v2` via `transformers.js`) for dense semantic similarity in-browser at zero cost.
2. **[Future Work] Multimodal Voice & Diagram Support:** Adding browser `SpeechRecognition` (ASR) and `speechSynthesis` (TTS) alongside syllabus block-diagram image inspection.
3. **[Future Work] Optional Hybrid RAG:** Allowing students who bring their own local Ollama instance to synthesize custom practice quizzes from retrieved KB chunks.
