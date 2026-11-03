# 5-Minute Viva Demo Script & 10 Sample Capability Questions

## Part A: 10 Sample Questions Demonstrating All Chatbot Capabilities

Use these 10 questions during your live classroom or viva demonstration:

1. **Course Overview & SDG Mapping:** `"What are the 5 modules and credit structure of CSDX 142?"`
2. **Module I (Dialogue Systems & History):** `"Explain Module 1 dialogue system architecture and ELIZA history"`
3. **Module I Deep Dive (Paraphrased without Module number):** `"What is the difference between NLU, DST, and NLG in a dialogue pipeline?"`
4. **Module II (Conversational UI Stack & Approaches):** `"Tell me about Module II Conversational UI stack and training approaches"`
5. **Module III (Dialogflow Intents, Entities & Contexts):** `"How do Dialogflow intents, entities, contexts, and webhook fulfillment work in Module 3?"`
6. **Module IV (NLP Preprocessing, spaCy & TF-IDF):** `"Explain Module IV NLP methods, spaCy pipeline components, and TF-IDF"`
7. **Multi-Turn Coreference Follow-Up (Run right after #6):** `"What are the stages in spaCy like tok2vec, tagger, parser, and ner in it?"`
8. **Module V (Multimodality, Social Robots, IoT & Ethics):** `"What is covered in Module V regarding multimodality, social robots, IoT, and ethics?"`
9. **Interactive Decision Tree Trigger (Module III):** `"Start a guided decision tree flow for exam prep"`
10. **Out-of-Domain Rejection & Non-Hallucination Gate:** `"What is the live Champions League football score and Bitcoin price today?"`

---

## Part B: 5-Minute Viva Walkthrough Script

### Minute 0:00 – 1:00 | Introduction & Zero-Cost Honesty
- Open the live HTTPS application on the **Chat** tab.
- State clearly: *"CampusMate AI is built for CSDX 142 (AI Chatbot Application). It runs at ₹0 cost with zero external LLM APIs. Every response is computed locally in TypeScript using text normalization, Porter-style stemming, regex/gazetteer entity extraction, TF-IDF cosine similarity retrieval, and a Finite-State Machine dialogue manager."*

### Minute 1:00 – 2:30 | Demonstrating NLP & Multi-Turn Context (Modules I & IV)
- Click the demo prompt **Module IV: NLP & spaCy**.
- Point to the **Live NLP & FSM Inspector** on the right side of the screen:
  - Show the filtered tokens and Porter stems.
  - Show the extracted entities (`module = "Module IV"`, `topic = "spaCy"`, `topic = "TF-IDF & Cosine Similarity"`).
  - Show the top-3 TF-IDF Cosine Similarity ranking and sub-2ms execution time.
- Next, click **Follow-up Coreference Test** (`"What are the important exam topics for it?"`).
- Highlight how the Inspector reports `Coreference Resolved: Injected [Module IV] from prior turn` and transitions the FSM state to `FOLLOW_UP_CONTEXT`.

### Minute 2:30 – 3:30 | Decision Trees & Safe Fallback Rejection (Modules II & III)
- Click **Exam Prep Tree** in the Guided Decision Trees bar.
- Click through two branches (e.g., `Last-minute revision (< 24 hours)` $\to$ `Modules III & IV`) to demonstrate deterministic DAG state transitions (`IN_DECISION_TREE`).
- Click **Out-of-Domain Fallback Test** (`"What is the live Champions League football score today?"`) and show that because the TF-IDF score is `0.00 < 0.22`, the bot transitions to `FALLBACK_RECOVERY` instead of fabricating an answer.

### Minute 3:30 – 5:00 | Syllabus Architecture, Knowledge Base & QA Benchmark (Module V)
- Switch to **How It Works**: Click through the 8-stage pipeline diagram and test a live sentence in the **Live NLP & TF-IDF Vectorizer Sandbox**.
- Switch to **Quiz & Prep**: Answer a Module IV question and open the **Placement Interview Practice** simulator.
- Switch to **Knowledge Base**: Point out the `[Sample Demo Data]` labels on college rules and add a quick custom FAQ entry.
- Switch to **Analytics & Report**: Show the **16-Query NLP Evaluation Dataset** passing at 100% accuracy.
