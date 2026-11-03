import React, { useState } from 'react';
import {
  ArrowRight,
  Cpu,
  Layers,
  GitBranch,
  Search,
  ShieldCheck,
  Database,
  AlertTriangle,
  Sparkles,
  Play
} from 'lucide-react';
import { preprocessText } from '../nlp/preprocessor';
import { extractEntities } from '../nlp/entityExtractor';
import { classifyIntent } from '../nlp/intentClassifier';
import { retrieveKnowledge } from '../nlp/retriever';
import { INITIAL_KNOWLEDGE_BASE } from '../data/knowledgeBase';

interface HowItWorksViewProps {
  onTryInChat: (query: string) => void;
}

interface PipelineStageInfo {
  step: number;
  title: string;
  sourceFile: string;
  syllabusModule: string;
  summary: string;
  implementationDetails: string[];
  codeFormula: string;
}

const PIPELINE_STAGES: PipelineStageInfo[] = [
  {
    step: 1,
    title: 'User Message (Utterance Input)',
    sourceFile: 'src/components/ChatWorkspace.tsx',
    syllabusModule: 'Module II: Conversational UI Stack',
    summary:
      'Captures raw natural language text or quick-reply selections from the student interface with keyboard accessibility (Enter to send, Shift+Enter for newline).',
    implementationDetails: [
      'Validates non-empty input and trims leading/trailing whitespace.',
      'Supports 1-click suggested queries and guided Decision Tree branch buttons to solve the Conversational UI "blank canvas" discoverability problem.',
      'Passes the raw utterance alongside the active DialogueContext to the Dialogue Manager.'
    ],
    codeFormula: 'u_t = rawInput.trim() // Turn t user utterance'
  },
  {
    step: 2,
    title: 'Text Preprocessing & Normalization',
    sourceFile: 'src/nlp/preprocessor.ts',
    syllabusModule: 'Module IV: NLP Methods & Text Processing',
    summary:
      'Normalizes raw text into canonical tokens and morphological stems so surface variations ("deploying", "deployment", "What\'s") map to identical features.',
    implementationDetails: [
      'Case folding (toLowerCase) and contraction expansion ("what\'s" → "what is").',
      'Hyphenated technical normalization ("TF-IDF" → "tfidf", "COB-4" → "cob4").',
      'Stop-word removal using a 95-word English stop-word set while preserving Roman numerals (i, ii, iii, iv, v) after "module" or "unit".',
      'Deterministic Porter-style suffix stemmer stripping inflections (-ing, -ed, -ational, -ization, -ness, -ment).'
    ],
    codeFormula: 'Tokens = filterStopWords(tokenize(expandContractions(u_t.toLowerCase())))\nStems = Tokens.map(stemWord)'
  },
  {
    step: 3,
    title: 'Intent & Entity Detection (NLU)',
    sourceFile: 'src/nlp/intentClassifier.ts & src/nlp/entityExtractor.ts',
    syllabusModule: 'Module III (Dialogflow Concepts) & Module IV (spaCy EntityRuler)',
    summary:
      'Classifies the user goal into one of 10 structured intents and extracts domain entities (modules, course codes, COBs, and technical topics).',
    implementationDetails: [
      'Entity Extractor uses regex + domain gazetteers (analogous to spaCy EntityRuler) to extract module (Module I–V from digits, Roman numerals, or ordinal words), course_code (CSDX 142), cob (COB1–COB5), and 16 technical topics.',
      'Hybrid Intent Classifier combines regex phrase patterns (+0.58), stemmed keyword overlap (up to +0.45), and entity slot boosts (+0.22).',
      'Disambiguates compound utterances (e.g., "Hello! Explain Module 4") so domain intents take priority over greetings.'
    ],
    codeFormula: 'Score(Intent_k) = min(0.99, PatternMatch + KeywordOverlap + EntitySlotBoost)'
  },
  {
    step: 4,
    title: 'TF-IDF & Cosine Similarity Retrieval',
    sourceFile: 'src/nlp/retriever.ts',
    syllabusModule: 'Module II (Retrieval Bots) & Module IV (Vector Similarity)',
    summary:
      'Vectorizes the preprocessed query and ranks all entries in the local JSON Knowledge Base using TF-IDF weighting, Cosine Similarity, and entity alignment boosts.',
    implementationDetails: [
      'Computes Inverse Document Frequency across all N knowledge entries: IDF(t) = log((N + 1) / (DF(t) + 1)) + 1.',
      'Computes sublinear TF weighting (1 + log(TF)) and normalizes query and document vectors by their L2 Euclidean norms.',
      'Adds structured Entity Boost (+0.28 for exact Module match; -0.15 penalty for mismatched specific modules) to ensure high precision.'
    ],
    codeFormula: 'cos(θ) = (Q · D) / (||Q|| × ||D||)\nFinalScore = 0.55 × cos(θ) + 0.35 × KeywordOverlap + EntityBoost'
  },
  {
    step: 5,
    title: 'Confidence Check & Ambiguity Gate',
    sourceFile: 'src/dialogue/dialogueManager.ts',
    syllabusModule: 'Module III & V: Safe Rejection & Non-Hallucination',
    summary:
      'Compares the top retrieval score against the configurable rejection threshold (τ, default 0.22) and verifies that the top-2 matches are not ambiguously close.',
    implementationDetails: [
      'If Top1.FinalScore < τ, the query is rejected to FALLBACK_RECOVERY—preventing fabricated or guessed answers on out-of-domain questions.',
      'If Top1 and Top2 belong to different modules with a score margin < 0.04, the bot enters AWAITING_CLARIFICATION and presents disambiguation buttons.',
      'Users can adjust τ live via the workspace slider to observe precision vs. recall trade-offs.'
    ],
    codeFormula: 'Passed = (Top1.FinalScore >= τ)\nAmbiguous = (!ExplicitModule && |Top1 - Top2| < 0.04)'
  },
  {
    step: 6,
    title: 'Finite-State Dialogue Manager (DST & Policy)',
    sourceFile: 'src/dialogue/dialogueManager.ts',
    syllabusModule: 'Module I (Dialogue Management) & Module III (Decision Trees)',
    summary:
      'Maintains multi-turn conversation state (IDLE, ANSWERING_KB, AWAITING_CLARIFICATION, IN_DECISION_TREE, FOLLOW_UP_CONTEXT, FALLBACK_RECOVERY) and resolves pronouns.',
    implementationDetails: [
      'Stores lastModule, lastTopic, and active Decision Tree pointers in DialogueContext across turns.',
      'Coreference Resolution: When a follow-up contains "it", "its", or "that module", injects the stored module/topic into the NLU pipeline automatically.',
      'Deterministic Decision Tree traversal for Exam Preparation, Chatbot Architecture Selection, and Placement Readiness.'
    ],
    codeFormula: 'NextState = Policy(CurrentState, Intent, Entities, PassedThreshold, DialogueContext)'
  },
  {
    step: 7,
    title: 'Response Construction & Source Citation (NLG)',
    sourceFile: 'src/dialogue/dialogueManager.ts',
    syllabusModule: 'Module I (NLG) & Module V (Ethical Transparency)',
    summary:
      'Formats the verified answer, structured bullet points, official syllabus source reference, sample-data disclaimer (when applicable), and context-aware quick replies.',
    implementationDetails: [
      'Attaches explicit source citations (e.g., "CSDX 142 Syllabus — Module IV") to every response.',
      'Flags sample college rules with a prominent [Sample Demo Data] banner so fabricated university dates or rules are never presented as official fact.',
      'Attaches the complete PipelineTrace object for real-time inspection.'
    ],
    codeFormula: 'Response = { text, bulletPoints, sourceReference, isSampleData, quickReplies, trace }'
  },
  {
    step: 8,
    title: 'Conversation History & Local Persistence',
    sourceFile: 'src/storage/localStore.ts',
    syllabusModule: 'Module II & IV: Client-Side State & Privacy',
    summary:
      'Persists conversation history, dialogue context, custom knowledge base entries, and user feedback in browser localStorage with zero external network transmission.',
    implementationDetails: [
      '100% client-side persistence—no student queries or personal data ever leave the browser.',
      'Supports instant Clear Chat, Flow Reset, and JSON Knowledge Base import/export.',
      'Feeds real-time session metrics into the Analytics & Evaluation dashboard.'
    ],
    codeFormula: 'localStorage.setItem("campusmate_messages_v1", JSON.stringify(messages))'
  }
];

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onTryInChat }) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);
  const [sandboxInput, setSandboxInput] = useState(
    "What's covered in Module 4 regarding spaCy pipelines and TF-IDF?"
  );

  const selectedStage = PIPELINE_STAGES[selectedStageIndex];

  // Live sandbox calculation
  const livePrep = preprocessText(sandboxInput);
  const liveEntities = extractEntities(sandboxInput);
  const liveIntent = classifyIntent(livePrep, liveEntities);
  const liveMatches = retrieveKnowledge(livePrep, liveEntities, liveIntent, INITIAL_KNOWLEDGE_BASE).slice(0, 3);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <section className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          <span>Syllabus Demonstration Panel</span>
          <span aria-hidden="true" className="mx-2">·</span>
          <span>CSDX 142 Modules I–V Architecture</span>
          <span aria-hidden="true" className="mx-2">·</span>
          <span>100% Verifiable Source Mapping</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          How This Chatbot Works — Architecture &amp; Syllabus Mapping
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          CampusMate AI is a genuine local Natural Language Processing (NLP), TF-IDF vector retrieval, and Finite-State Dialogue System written in TypeScript. It does not call paid LLM APIs (no OpenAI, Gemini, or Claude) and never pretends that deterministic retrieval is a generative neural network.
        </p>
      </section>

      {/* Interactive 8-Stage Pipeline Flow Diagram */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Interactive 8-Stage Conversation Lifecycle Pipeline
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any stage in the flow diagram below to inspect its exact implementation, syllabus module, and mathematical formula.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-sky-700 dark:text-sky-300">
            Stage {selectedStage.step} of 8 Selected
          </span>
        </div>

        {/* Flow Diagram Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isSelected = idx === selectedStageIndex;
            return (
              <button
                key={stage.step}
                type="button"
                onClick={() => setSelectedStageIndex(idx)}
                className={`p-3.5 rounded-xl border text-left transition-colors flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-50/90 dark:bg-sky-950/80 border-sky-500 dark:border-sky-400'
                    : 'bg-slate-50/70 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400 mb-1">
                    <span>STAGE 0{stage.step}</span>
                    {idx < PIPELINE_STAGES.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden lg:inline" />
                    )}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {stage.title}
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-800 text-[11px] font-mono text-sky-700 dark:text-sky-300 truncate">
                  {stage.sourceFile}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Deep-Dive Detail Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-mono text-sky-700 dark:text-sky-300">
              {selectedStage.syllabusModule} · {selectedStage.sourceFile}
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              0{selectedStage.step}. {selectedStage.title}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedStage.summary}
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
              {selectedStage.implementationDetails.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-xs">
            <div>
              <div className="text-slate-400 mb-2">Implementation Formula / Code Logic:</div>
              <pre className="whitespace-pre-wrap text-sky-300 leading-relaxed">
                {selectedStage.codeFormula}
              </pre>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Deterministic TypeScript Execution</span>
              <span>Latency: &lt; 2 ms</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive NLP Pipeline Sandbox */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Live NLP &amp; TF-IDF Vectorizer Sandbox
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Type any sentence below to watch tokenization, stop-word removal, Porter stemming, entity extraction, and TF-IDF ranking update in real time.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onTryInChat(sandboxInput)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start"
          >
            <Play className="w-3.5 h-3.5" />
            Send to Chat Workspace
          </button>
        </div>

        <div>
          <label htmlFor="nlp-sandbox-input" className="sr-only">
            Test utterance for live NLP inspection
          </label>
          <input
            id="nlp-sandbox-input"
            type="text"
            value={sandboxInput}
            onChange={(e) => setSandboxInput(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="font-sans font-semibold text-slate-800 dark:text-slate-200">
              Step A: Tokens &amp; Porter Stems
            </div>
            <div>
              <span className="text-slate-500">Normalized: </span>
              <span className="text-slate-800 dark:text-slate-200">{livePrep.normalized || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500">Filtered: </span>
              <span className="text-slate-800 dark:text-slate-200">[{livePrep.filteredTokens.join(', ')}]</span>
            </div>
            <div>
              <span className="text-slate-500">Stems: </span>
              <span className="text-sky-700 dark:text-sky-300">[{livePrep.stems.join(', ')}]</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="font-sans font-semibold text-slate-800 dark:text-slate-200">
              Step B: Intent &amp; Extracted Entities
            </div>
            <div>
              <span className="text-slate-500">Intent: </span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {liveIntent.intent} ({(liveIntent.confidence * 100).toFixed(0)}%)
              </span>
            </div>
            <div>
              <span className="text-slate-500">Entities: </span>
              {liveEntities.length > 0 ? (
                <ul className="mt-1 space-y-0.5 text-emerald-700 dark:text-emerald-400">
                  {liveEntities.map((e, i) => (
                    <li key={i}>
                      {e.type}: &quot;{e.value}&quot;
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-slate-500">None</span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="font-sans font-semibold text-slate-800 dark:text-slate-200">
              Step C: Top TF-IDF Ranked Entries
            </div>
            {liveMatches.map((m, idx) => (
              <div key={m.entry.id} className="flex items-center justify-between gap-2">
                <span className="truncate text-slate-700 dark:text-slate-300">
                  #{idx + 1} {m.entry.title}
                </span>
                <span className="tabular-nums font-bold text-sky-700 dark:text-sky-300 shrink-0">
                  {m.finalScore.toFixed(3)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 Mandatory Academic Explanations (Section 5 of Project Brief) */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          8 Core Engineering &amp; Syllabus Explanations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              01. Dialogue-System Architecture &amp; Lifecycle (Module I / COB1)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              CampusMate AI implements a classic modular pipeline: Natural Language Understanding (NLU via <code className="font-mono">preprocessor.ts</code>, <code className="font-mono">entityExtractor.ts</code>, and <code className="font-mono">intentClassifier.ts</code>), Dialogue State Tracking (<code className="font-mono">DialogueContext</code> in <code className="font-mono">dialogueManager.ts</code>), Policy Selection (threshold gate, coreference injection, or decision tree step), and Template/Structured NLG.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              02. Conversational UI &amp; User Experience (Module II / COB2)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Conversational interfaces often suffer from low discoverability (&quot;blank canvas paralysis&quot;). CampusMate AI solves this with structured onboarding prompts, context-sensitive follow-up quick replies after every answer, decision-tree option buttons, typing feedback, and a live confidence threshold control.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              03. Decision Trees &amp; Dialogue State Management (Module III / COB3)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Defined in <code className="font-mono">src/data/decisionTrees.ts</code>, our three multi-step decision trees (Exam Preparation Advisor, Chatbot Architecture Selector, and Placement Readiness Advisor) transition the FSM into <code className="font-mono">IN_DECISION_TREE</code> and mirror Dialogflow Input/Output Context lifespans locally.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              04. NLP Pipeline &amp; Intent Classification (Module IV / COB4)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Rather than naive substring matching, <code className="font-mono">preprocessor.ts</code> expands contractions, strips punctuation, filters 95 stop-words, and applies Porter-style stemming before <code className="font-mono">intentClassifier.ts</code> scores 10 intents using weighted regex patterns, stemmed token overlap, and entity slot boosts.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              05. Entity Extraction &amp; Similarity-Based Retrieval (Module IV / COB4)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <code className="font-mono">entityExtractor.ts</code> acts like spaCy&apos;s <code className="font-mono">EntityRuler</code>, normalizing numeric (<code className="font-mono">Module 4</code>), Roman (<code className="font-mono">Module IV</code>), and ordinal (<code className="font-mono">fourth module</code>) references into canonical slots. <code className="font-mono">retriever.ts</code> then computes sublinear TF-IDF vectors and Cosine Similarity across all KB entries.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              06. Knowledge-Base Construction &amp; Configuration (Module II &amp; III)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Stored in <code className="font-mono">src/data/knowledgeBase.ts</code> and extensible via the Knowledge Base tab, each entry contains <code className="font-mono">questionPatterns</code>, domain <code className="font-mono">keywords</code>, structured <code className="font-mono">bulletPoints</code>, <code className="font-mono">followUpSuggestions</code>, <code className="font-mono">sourceReference</code>, and an explicit <code className="font-mono">isSampleData</code> flag.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              07. Reasoning &amp; Problem-Solving Limitations (Module V / COB5)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Honest Engineering Assessment: Because CampusMate AI uses lexical TF-IDF retrieval and deterministic FSM rules rather than a multi-billion parameter LLM, it cannot write novel essays, solve arbitrary math word problems, or match unseen synonyms outside its vocabulary. In exchange, it guarantees zero hallucinated syllabus facts and ₹0 cost.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              08. Privacy, Ethical Considerations &amp; Future Scope (Module V / COB5)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              All chat history stays strictly in browser <code className="font-mono">localStorage</code>; zero student data is sent to third-party servers. Sample college rules are visibly labeled as demo data. Future enhancements include WebAssembly/WebGPU local dense embeddings, Web Speech API voice multimodality, and multilingual Indic translation.
            </p>
          </div>
        </div>
      </section>

      {/* Complete 5-Module Syllabus Mapping Table */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            CSDX 142 Syllabus-to-Code Traceability Matrix (All 5 Modules)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Direct mapping between the official CSDX 142 syllabus units, Course Objectives (COB1–COB5), and source code files in this project.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                <th className="py-3 px-4">Module &amp; Hours</th>
                <th className="py-3 px-4">Course Objective</th>
                <th className="py-3 px-4">Syllabus Topics Covered</th>
                <th className="py-3 px-4">Implemented Feature &amp; Source File</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3 px-4 font-semibold whitespace-nowrap">Module I (9 Hrs)<br /><span className="font-normal text-slate-500">Dialogue System</span></td>
                <td className="py-3 px-4 font-mono">COB1</td>
                <td className="py-3 px-4">History (ELIZA, PARRY, ALICE), Modelling Conversation, Dialogue System Architecture (NLU/DST/Policy/NLG), Designing Dialogue Systems, Tools.</td>
                <td className="py-3 px-4 font-mono">src/dialogue/dialogueManager.ts<br />Finite-State Machine, turn tracking &amp; coreference slot memory.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold whitespace-nowrap">Module II (9 Hrs)<br /><span className="font-normal text-slate-500">Conversational UI</span></td>
                <td className="py-3 px-4 font-mono">COB2</td>
                <td className="py-3 px-4">Evolution, Stack of CUI, Challenges &amp; Gaps (discoverability), Sources of Data, Training Chatbots, Rule-based vs Retrieval vs Generative approaches.</td>
                <td className="py-3 px-4 font-mono">src/components/ChatWorkspace.tsx<br />Quick replies, demo prompts, threshold slider &amp; JSON KB importer.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold whitespace-nowrap">Module III (9 Hrs)<br /><span className="font-normal text-slate-500">Building Chatbot</span></td>
                <td className="py-3 px-4 font-mono">COB3</td>
                <td className="py-3 px-4">Business Considerations, Decision Trees, Chatbot Frameworks, Components of Chatbot, Dialogflow (Intents, Entities, Contexts, Fulfillment).</td>
                <td className="py-3 px-4 font-mono">src/data/decisionTrees.ts<br />3 interactive Decision Trees + Dialogflow-style Context lifespan tracking.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold whitespace-nowrap">Module IV (9 Hrs)<br /><span className="font-normal text-slate-500">NLP for Chatbots</span></td>
                <td className="py-3 px-4 font-mono">COB4</td>
                <td className="py-3 px-4">Methods of NLP, Tokenization, Stop-words, Stemming, TF-IDF &amp; Cosine Similarity, spaCy Models (tok2vec, tagger, parser, ner), Messenger &amp; Deployment.</td>
                <td className="py-3 px-4 font-mono">src/nlp/preprocessor.ts, entityExtractor.ts, retriever.ts<br />Live NLP Sandbox + GitHub Pages CI/CD workflow.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold whitespace-nowrap">Module V (9 Hrs)<br /><span className="font-normal text-slate-500">Future Directions</span></td>
                <td className="py-3 px-4 font-mono">COB5</td>
                <td className="py-3 px-4">Multimodality in Dialogue, Reasoning &amp; Problem Solving, Dialogue with Social Robots, Dialogue &amp; IoT, Social &amp; Ethical Issues (Privacy, Bias, Hallucinations).</td>
                <td className="py-3 px-4 font-mono">src/components/HowItWorksView.tsx &amp; knowledgeBase.ts<br />Explicit [Sample Demo Data] labeling, non-hallucination threshold &amp; 100% local privacy.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
