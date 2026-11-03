import { DecisionTree } from '../types/chatbot';

export const DECISION_TREES: Record<string, DecisionTree> = {
  'exam-advisor': {
    id: 'exam-advisor',
    title: 'CSDX 142 Exam Preparation Advisor',
    syllabusModule: 'Module III (Decision Trees) & All Modules Revision',
    description: 'Interactive decision tree that diagnoses your preparation stage and generates a tailored CSDX 142 study plan.',
    rootNodeId: 'root',
    nodes: {
      root: {
        id: 'root',
        prompt: 'Welcome to the CSDX 142 Exam Prep Decision Tree! How much time do you have before your exam or assessment?',
        description: 'Decision Tree Node 1/3 — Selecting time horizon',
        options: [
          { label: 'Last-minute revision (< 24 hours)', nextNodeId: 'urgent' },
          { label: '1 to 3 days (Focused module prep)', nextNodeId: 'moderate' },
          { label: '1+ week (Comprehensive mastery & project)', nextNodeId: 'comprehensive' }
        ]
      },
      urgent: {
        id: 'urgent',
        prompt: 'For < 24 hours, focus on high-yield diagrams and definitions. Which area do you feel least confident in right now?',
        description: 'Decision Tree Node 2/3 — Rapid triage',
        options: [
          {
            label: 'Modules I & II (Dialogue Architecture & CUI Stack)',
            resolutionText:
              'Rapid Revision Plan (Modules I & II): 1) Memorize the 6-box Pipeline: ASR → NLU → DST → Policy → NLG → TTS. 2) Review ELIZA (1966) vs PARRY (1972) vs ALICE (1995). 3) Draw the 5-layer Conversational UI Stack and contrast Rule-Based, Retrieval-Based, and Generative bots.',
            followUpQuery: 'Explain Module I Dialogue System architecture'
          },
          {
            label: 'Modules III & IV (Dialogflow, TF-IDF & spaCy)',
            resolutionText:
              'Rapid Revision Plan (Modules III & IV): 1) Master the 4 Dialogflow pillars: Intents, Entities, Contexts (with Lifespan), and Webhook Fulfillment. 2) Practice writing the NLP preprocessing pipeline (Tokenization → Stop-words → Lemmatization) and the spaCy pipeline (tok2vec → tagger → parser → ner).',
            followUpQuery: 'Explain Module IV NLP for Chatbots'
          },
          {
            label: 'Module V (Multimodality, Reasoning & Ethics)',
            resolutionText:
              'Rapid Revision Plan (Module V): Focus on Early vs. Late Multimodal Fusion, Neuro-symbolic reasoning limitations, Social Robots (turn-taking & gaze), and the 5 Ethical pillars: Bias, Hallucination, Privacy, Transparency, and Anthropomorphism.',
            followUpQuery: 'Explain Module V Future Directions'
          }
        ]
      },
      moderate: {
        id: 'moderate',
        prompt: 'With 1–3 days available, what is your primary exam format?',
        description: 'Decision Tree Node 2/3 — Assessment format selection',
        options: [
          {
            label: 'Theory Descriptive Exam (CAT / End-Semester)',
            resolutionText:
              '3-Day Theory Strategy: Day 1 — Master Modules I & II block diagrams and CUI challenges. Day 2 — Work through Module III Decision Trees, Dialogflow Context lifespans, and Module IV spaCy/TF-IDF mathematical examples. Day 3 — Review Module V Ethics & Multimodal diagrams, then take the 10-question Quiz in the Quiz tab.',
            followUpQuery: 'how to prepare for csdx 142 exam'
          },
          {
            label: 'Project Viva / Practical Demonstration',
            resolutionText:
              'Viva & Demo Strategy: 1) Use the "How It Works" tab to show the 8-stage NLP pipeline. 2) Demonstrate live entity extraction and TF-IDF confidence scores in the Chat Inspector. 3) Show the automated 16-query NLP Evaluation Benchmark in the Analytics tab.',
            followUpQuery: 'how does this chatbot work'
          }
        ]
      },
      comprehensive: {
        id: 'comprehensive',
        prompt: 'Great! With 1+ week, would you like to prioritize deep theoretical concepts or hands-on NLP implementation?',
        description: 'Decision Tree Node 2/3 — Deep learning track',
        options: [
          {
            label: 'Deep Theory across COB1–COB5',
            resolutionText:
              'Full Mastery Roadmap: Study one module per day (Modules I–V), map every topic to Course Objectives COB1–COB5, and complete all difficulty levels in the interactive Syllabus Quiz.',
            followUpQuery: 'what are the course objectives'
          },
          {
            label: 'Hands-on NLP & Chatbot Engineering',
            resolutionText:
              'Engineering Roadmap: Inspect the TypeScript source modules (preprocessor.ts, entityExtractor.ts, retriever.ts, dialogueManager.ts), experiment with the Confidence Threshold slider in Chat, and add custom JSON entries in the Knowledge Base tab.',
            followUpQuery: 'explain spacy pipeline components tok2vec tagger parser ner'
          }
        ]
      }
    }
  },
  'architecture-selector': {
    id: 'architecture-selector',
    title: 'Chatbot Architecture Selector (Module II & III)',
    syllabusModule: 'Module II (Development Approaches) & Module III (Business Considerations)',
    description: 'Guided decision tree that helps select the right chatbot architecture based on domain constraints, budget, and safety requirements.',
    rootNodeId: 'root',
    nodes: {
      root: {
        id: 'root',
        prompt: 'Let us choose the optimal Chatbot Architecture (Module II & III). What is the primary requirement of your use case?',
        description: 'Architecture Decision Node 1/2',
        options: [
          { label: 'Strict zero-cost, deterministic accuracy, zero hallucinations', nextNodeId: 'zero-cost' },
          { label: 'Cloud-managed multi-channel enterprise bot with webhooks', nextNodeId: 'enterprise' },
          { label: 'Open-ended creative synthesis or multi-hop reasoning', nextNodeId: 'generative' }
        ]
      },
      'zero-cost': {
        id: 'zero-cost',
        prompt: 'Does the bot need to handle paraphrased natural language queries or only button-driven workflows?',
        description: 'Architecture Decision Node 2/2',
        options: [
          {
            label: 'Paraphrased natural language + guided flows (Like CampusMate AI)',
            resolutionText:
              'Recommended Architecture: Hybrid Local NLP + TF-IDF Cosine Retrieval + Finite-State Decision Tree. Runs 100% client-side at ₹0 cost, guarantees verified answers from a curated JSON Knowledge Base, and rejects out-of-domain queries via a confidence threshold.',
            followUpQuery: 'how does this chatbot work'
          },
          {
            label: 'Strictly structured triage or troubleshooting steps',
            resolutionText:
              'Recommended Architecture: Deterministic Rule-Based Decision Tree / Finite-State Automaton (Module III). Best when compliance requires users to follow an exact diagnostic sequence.',
            followUpQuery: 'explain module 3 building chatbot'
          }
        ]
      },
      enterprise: {
        id: 'enterprise',
        prompt: 'Do you require on-premise data hosting or managed Google Cloud integration?',
        description: 'Architecture Decision Node 2/2',
        options: [
          {
            label: 'Managed Cloud NLU with fast Messenger/Web integration',
            resolutionText:
              'Recommended Architecture: Google Dialogflow ES/CX (Module III & IV) with Input/Output Contexts, Custom Entities, and Node.js Webhook Fulfillment.',
            followUpQuery: 'how does dialogflow work internally'
          },
          {
            label: 'Self-hosted open-source Python pipeline',
            resolutionText:
              'Recommended Architecture: Rasa Open Source + spaCy NLU pipeline (en_core_web_md) deployed via Docker containers.',
            followUpQuery: 'explain spacy pipeline components tok2vec tagger parser ner'
          }
        ]
      },
      generative: {
        id: 'generative',
        prompt: 'Recommendation for Open-Ended Reasoning (Module V):',
        description: 'Architecture Resolution',
        options: [
          {
            label: 'View Retrieval-Augmented Generation (RAG) & Ethical Safeguards',
            resolutionText:
              'Recommended Architecture: Retrieval-Augmented Generation (RAG) combining vector retrieval with an LLM, paired with Module V ethical guardrails (citation grounding, PII scrubbing, and hallucination checks). Note: Requires API or GPU compute budget.',
            followUpQuery: 'explain module 5 future directions'
          }
        ]
      }
    }
  },
  'placement-prep': {
    id: 'placement-prep',
    title: 'Placement & Interview Readiness Advisor',
    syllabusModule: 'Student Career & Placement Guidance',
    description: 'Step-by-step guided flow for preparing for technical, AI/NLP, and HR placement interviews.',
    rootNodeId: 'root',
    nodes: {
      root: {
        id: 'root',
        prompt: 'Which placement interview round are you preparing for right now?',
        description: 'Placement Decision Node 1/2',
        options: [
          { label: 'Project & AI/NLP Technical Round', nextNodeId: 'ai-round' },
          { label: 'Core Software Engineering / System Design Round', nextNodeId: 'swe-round' },
          { label: 'HR & Behavioral Round', nextNodeId: 'hr-round' }
        ]
      },
      'ai-round': {
        id: 'ai-round',
        prompt: 'In AI/NLP project interviews, recruiters test whether you built the pipeline yourself. What would you like to review?',
        description: 'Placement Decision Node 2/2',
        options: [
          {
            label: 'How to explain TF-IDF, Cosine Similarity & Confidence Thresholds',
            resolutionText:
              'Interview Tip: Explain that TF-IDF weights terms by rarity across documents, Cosine Similarity normalizes for document length (dot product over L2 norms), and the Confidence Threshold prevents false-positive answers by routing low-scoring queries to a fallback handler.',
            followUpQuery: 'how does tfidf cosine similarity formula work'
          },
          {
            label: 'How to explain Finite-State Dialogue Management & Context',
            resolutionText:
              'Interview Tip: Explain that your Dialogue Manager maintains a state object (IDLE, ANSWERING_KB, AWAITING_CLARIFICATION, IN_DECISION_TREE) and stores the last active module/topic so follow-up pronouns like "it" resolve deterministically.',
            followUpQuery: 'difference between nlu dst and nlg'
          }
        ]
      },
      'swe-round': {
        id: 'swe-round',
        prompt: 'For Software Engineering rounds, how would you like to position this project?',
        description: 'Placement Decision Node 2/2',
        options: [
          {
            label: 'Full-Stack Architecture, TypeScript Modularity & Automated Testing',
            resolutionText:
              'SWE Pitch: Highlight strict TypeScript interfaces, separation of concerns (preprocessor, entity extractor, classifier, retriever, FSM manager), zero external runtime dependencies, and deterministic unit testing with Node test runner.',
            followUpQuery: 'placement preparation tips for cse and ai students'
          }
        ]
      },
      'hr-round': {
        id: 'hr-round',
        prompt: 'For Behavioral & HR rounds:',
        description: 'Placement Resolution',
        options: [
          {
            label: 'View STAR Method Template for Project Challenges',
            resolutionText:
              'STAR Answer: Situation — Needed an intelligent college assistant for CSDX 142 with ₹0 budget. Task — Build real NLP without paid LLM keys. Action — Implemented local tokenization, stemming, TF-IDF cosine ranking, and FSM context tracking. Result — Sub-5ms response latency, 100% privacy, and zero hosting cost.',
            followUpQuery: 'placement preparation tips for cse and ai students'
          }
        ]
      }
    }
  }
};
