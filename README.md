# CampusMate AI — Intelligent College Assistant Chatbot (CSDX 142)

**Course:** CSDX 142 — AI Chatbot Application (L-T-P-C: 3-0-0-3 | UN SDG 9)  
**Total Cost:** ₹0.00 (100% Client-Side TypeScript NLP, TF-IDF Cosine Retrieval, and Finite-State Dialogue Engine)

---

## 1. Project Overview

**CampusMate AI** is an interactive, zero-cost academic chatbot engineered to demonstrate every module of the **CSDX 142 — AI Chatbot Application** curriculum. Unlike projects that wrap paid external LLM APIs (such as OpenAI or Gemini) or fake AI using hardcoded `if/else` strings, CampusMate AI implements a transparent, mathematically inspectable **Natural Language Processing (NLP)** and **Dialogue Management** pipeline directly in TypeScript:

1. **Text Preprocessing (`src/nlp/preprocessor.ts`):** Case folding, contraction expansion, hyphen normalization (`TF-IDF` → `tfidf`), punctuation stripping, 95-word stop-word filtering (preserving Roman numerals after `Module`), and deterministic Porter-style suffix stemming.
2. **Entity Extraction (`src/nlp/entityExtractor.ts`):** Regex and domain gazetteer extraction (analogous to spaCy's `EntityRuler`) recognizing `module` (`Module I`–`Module V` from digits, Roman numerals, or ordinal words), `course_code` (`CSDX 142`), `cob` (`COB1`–`COB5`), `topic` (`Dialogflow`, `spaCy`, `TF-IDF`, `ELIZA`, `NLU`, `DST`, `NLG`, `Multimodality`, etc.), and `category`.
3. **Hybrid Intent Classification (`src/nlp/intentClassifier.ts`):** Classifies utterances across 10 intents (`greeting`, `syllabus_query`, `exam_prep`, `placement_guidance`, `college_faq`, `architecture_how_it_works`, `decision_tree_start`, `gratitude_farewell`, `bot_help`, `unknown_fallback`) using pattern signals, stemmed token weights, and entity boosts.
4. **TF-IDF & Cosine Similarity Retrieval (`src/nlp/retriever.ts`):** Computes sublinear TF-IDF vectors and Cosine Similarity across the structured JSON Knowledge Base (`src/data/knowledgeBase.ts`), applying entity alignment boosts and top-2 ambiguity margin checks.
5. **Finite-State Machine Dialogue Manager (`src/dialogue/dialogueManager.ts`):** Manages 6 conversation states (`IDLE`, `ANSWERING_KB`, `AWAITING_CLARIFICATION`, `IN_DECISION_TREE`, `FOLLOW_UP_CONTEXT`, `FALLBACK_RECOVERY`), resolves multi-turn pronoun coreference (`"What are the exam topics for it?"`), and executes 3 interactive **Decision Trees** (`src/data/decisionTrees.ts`).

---

## 2. Running Locally on Your MacBook

```bash
# 1. Clone or navigate into the project directory
git clone <your-github-repo-url>
cd campusmate-ai-csdx142

# 2. Install dependencies
npm install

# 3. Run the automated NLP & Dialogue unit tests (node:test via tsx)
npm test

# 4. Start the local development server on http://localhost:3000
npm run dev

# 5. Type-check and build the production static bundle
npm run build
```

---

## 3. Architecture & Conversation Lifecycle Diagram

```text
+-------------------+     +----------------------------+     +-------------------------------+
|   User Message    | --> |    Text Preprocessing      | --> |  Intent & Entity Detection    |
| (Utterance Input) |     | (Lower, Stopwords, Stems)  |     | (10 Intents + Gazetteer NER)  |
+-------------------+     +----------------------------+     +-------------------------------+
                                                                             |
                                                                             v
+-------------------+     +----------------------------+     +-------------------------------+
|  Dialogue Policy  | <-- |   Confidence & Ambiguity   | <-- |  TF-IDF & Cosine Similarity   |
|  & FSM Manager    |     |   Gate (Threshold >= 0.22) |     |  Knowledge Base Retrieval     |
+-------------------+     +----------------------------+     +-------------------------------+
          |
          v
+-------------------+     +----------------------------+
| Structured Output | --> | Conversation History &     |
| & Live NLP Trace  |     | Browser localStorage       |
+-------------------+     +----------------------------+
```

---

## 4. Mapping to CSDX 142 Syllabus Modules (Modules I–V)

| Syllabus Module | Course Objective | Topics Demonstrated | Implementation Files |
| :--- | :--- | :--- | :--- |
| **Module I: Dialogue System (9 Hrs)** | **COB1** | History (ELIZA, PARRY, ALICE), Conversation Modelling, NLU/DST/Policy/NLG Architecture, Designing Dialogue Systems | `src/dialogue/dialogueManager.ts`, `src/data/knowledgeBase.ts` |
| **Module II: Conversational UI (9 Hrs)** | **COB2** | Evolution of CUI, CUI Stack, Discoverability Challenges, Training Data Sources, Rule vs Retrieval vs Generative | `src/components/ChatWorkspace.tsx`, `src/components/KnowledgeBaseView.tsx` |
| **Module III: Building Chatbot (9 Hrs)** | **COB3** | Business Considerations, Decision Trees, Frameworks, Components, Dialogflow (Intents, Entities, Contexts, Fulfillment) | `src/data/decisionTrees.ts`, `src/dialogue/dialogueManager.ts` |
| **Module IV: NLP for Chatbots (9 Hrs)** | **COB4** | Tokenization, Stop-words, Stemming, TF-IDF & Cosine Similarity, spaCy Models (`tok2vec`, `tagger`, `parser`, `ner`), Deployment | `src/nlp/preprocessor.ts`, `src/nlp/entityExtractor.ts`, `src/nlp/retriever.ts`, `.github/workflows/deploy.yml` |
| **Module V: Future Directions (9 Hrs)** | **COB5** | Multimodality, Reasoning & Problem Solving, Social Robots, IoT, Social & Ethical Issues (Privacy, Hallucination, Sample Data Labeling) | `src/components/HowItWorksView.tsx`, `src/components/AnalyticsAndEvalView.tsx` |

---

## 5. Zero-Cost Hosting & GitHub Pages Deployment

The Vite configuration (`vite.config.ts`) uses `base: './'` so the compiled `dist/` bundle works on any root domain or GitHub Pages subpath (`https://<username>.github.io/<repo>/`).

To deploy to your own GitHub Pages account in 60 seconds:
1. Create a new public repository on GitHub (free tier, no credit card required).
2. Push this repository:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git branch -M main
   git push -u origin main
   ```
3. In your GitHub repository, go to **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**. The included `.github/workflows/deploy.yml` workflow will automatically run unit tests, build `dist/`, and publish your live HTTPS URL.
