import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  Play,
  FileText,
  Mic,
  ShieldCheck
} from 'lucide-react';
import { ChatMessage, KnowledgeEntry } from '../types/chatbot';
import { EVALUATION_DATASET } from '../data/evaluationDataset';
import {
  INITIAL_DIALOGUE_CONTEXT,
  processUserMessage
} from '../dialogue/dialogueManager';

interface AnalyticsAndEvalViewProps {
  messages: ChatMessage[];
  knowledgeBase: KnowledgeEntry[];
  confidenceThreshold: number;
  onRunQueryInChat: (query: string) => void;
}

export const AnalyticsAndEvalView: React.FC<AnalyticsAndEvalViewProps> = ({
  messages,
  knowledgeBase,
  confidenceThreshold,
  onRunQueryInChat
}) => {
  const [activeSubView, setActiveSubView] = useState<'analytics' | 'benchmark' | 'report'>('benchmark');

  // Compute live session telemetry from messages
  const userMessages = messages.filter((m) => m.sender === 'user');
  const botMessagesWithTrace = messages.filter((m) => m.sender === 'bot' && m.trace);

  const intentCounts: Record<string, number> = {};
  let fallbackCount = 0;
  let totalConfidence = 0;
  let highConfCount = 0; // >= 0.55
  let medConfCount = 0;  // 0.25 - 0.54
  let lowConfCount = 0;  // < 0.25

  for (const m of botMessagesWithTrace) {
    const tr = m.trace!;
    const intentName = tr.intent.intent;
    intentCounts[intentName] = (intentCounts[intentName] ?? 0) + 1;

    if (!tr.passedThreshold || intentName === 'unknown_fallback') {
      fallbackCount++;
    }

    const score = tr.topMatches[0]?.finalScore ?? tr.intent.confidence;
    totalConfidence += score;
    if (score >= 0.55) highConfCount++;
    else if (score >= 0.25) medConfCount++;
    else lowConfCount++;
  }

  const avgConfidence =
    botMessagesWithTrace.length > 0
      ? (totalConfidence / botMessagesWithTrace.length).toFixed(2)
      : '0.00';

  const positiveFeedbackCount = messages.filter((m) => m.feedback === 'up').length;
  const negativeFeedbackCount = messages.filter((m) => m.feedback === 'down').length;

  // Run automated 16-query NLP Evaluation Benchmark deterministically
  const benchmarkResults = EVALUATION_DATASET.map((testCase) => {
    const output = processUserMessage(
      testCase.query,
      INITIAL_DIALOGUE_CONTEXT,
      knowledgeBase,
      confidenceThreshold
    );
    const trace = output.botMessage.trace!;
    const predictedIntent = trace.intent.intent;
    const topScore = trace.topMatches[0]?.finalScore ?? trace.intent.confidence;
    const extractedTypes = trace.entities.map((e) => e.type);
    const intentMatched = predictedIntent === testCase.expectedIntent;

    return {
      testCase,
      predictedIntent,
      topScore,
      extractedEntities: trace.entities,
      extractedTypes,
      matchedTitle: trace.topMatches[0]?.title ?? 'Rule / Fallback Handler',
      intentMatched,
      executionMs: trace.executionTimeMs
    };
  });

  const passedCount = benchmarkResults.filter((r) => r.intentMatched).length;
  const benchmarkAccuracy = ((passedCount / benchmarkResults.length) * 100).toFixed(1);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header & Sub-Navigation */}
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span>Telemetry, QA Benchmark &amp; Project Deliverables</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span className="font-mono tabular-nums">Benchmark Accuracy: {benchmarkAccuracy}% ({passedCount}/{benchmarkResults.length})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Analytics, NLP Evaluation Benchmark &amp; Academic Report
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setActiveSubView('benchmark')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeSubView === 'benchmark'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            NLP Evaluation Dataset (16 Tests)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubView('analytics')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeSubView === 'analytics'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Live Session Analytics
          </button>
          <button
            type="button"
            onClick={() => setActiveSubView('report')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeSubView === 'report'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Project Report &amp; 5-Min Demo Script
          </button>
        </div>
      </section>

      {/* Top KPI Summary Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Evaluation Dataset Accuracy
          </div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {benchmarkAccuracy}%
          </div>
          <div className="mt-1 text-xs text-slate-500 font-mono tabular-nums">
            {passedCount} of {benchmarkResults.length} test queries passed
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Total Conversation Turns
          </div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
            {messages.length}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-mono tabular-nums">
            {userMessages.length} student queries · {fallbackCount} fallbacks
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Mean Retrieval Confidence
          </div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-sky-600 dark:text-sky-400">
            {avgConfidence}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-mono tabular-nums">
            Active threshold τ = {confidenceThreshold.toFixed(2)}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Total Recurring Cost
          </div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
            ₹0.00
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Zero paid APIs · 100% browser execution
          </div>
        </div>
      </section>

      {activeSubView === 'benchmark' && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Automated 16-Query NLP Evaluation Benchmark Suite
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live execution of the evaluation dataset testing greetings, Modules I–V, paraphrases, COBs, exam prep, placements, sample FAQs, and out-of-domain rejection.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold">
              Status: {passedCount}/{benchmarkResults.length} Passing
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  <th className="py-3 px-4">ID &amp; Category</th>
                  <th className="py-3 px-4">Test Query Utterance</th>
                  <th className="py-3 px-4">Expected vs Predicted Intent</th>
                  <th className="py-3 px-4">Extracted Entities</th>
                  <th className="py-3 px-4 text-right">Score</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {benchmarkResults.map((row) => (
                  <tr key={row.testCase.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {row.testCase.id}
                      </div>
                      <div className="text-slate-500">{row.testCase.category}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        &ldquo;{row.testCase.query}&rdquo;
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        Matched: {row.matchedTitle}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono whitespace-nowrap">
                      <div>Exp: {row.testCase.expectedIntent}</div>
                      <div className="text-sky-700 dark:text-sky-300">
                        Pred: {row.predictedIntent}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {row.extractedEntities.length > 0
                        ? row.extractedEntities.map((e) => `${e.type}=${e.value}`).join(' · ')
                        : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold">
                      {row.topScore.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {row.intentMatched ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                          <XCircle className="w-3.5 h-3.5" />
                          MISMATCH
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onRunQueryInChat(row.testCase.query)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-sky-700 dark:text-sky-300 hover:underline"
                      >
                        <Play className="w-3 h-3" />
                        Run
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeSubView === 'analytics' && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detected Intents Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Detected Intents Distribution (Current Session)
            </h2>
            {Object.keys(intentCounts).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(intentCounts).map(([intentName, count]) => {
                  const pct = Math.round((count / Math.max(1, botMessagesWithTrace.length)) * 100);
                  return (
                    <div key={intentName} className="space-y-1 text-xs">
                      <div className="flex justify-between font-mono tabular-nums">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {intentName}
                        </span>
                        <span className="text-slate-500">
                          {count} turns ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sky-600 dark:bg-sky-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No user queries sent in this session yet. Send a query in the Chat tab to populate live intent metrics!
              </p>
            )}
          </div>

          {/* Confidence Distribution & Feedback */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Confidence Distribution &amp; User Feedback
            </h2>
            <div className="space-y-2.5 text-xs font-mono tabular-nums">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                <span>High Confidence (&ge; 0.55):</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{highConfCount} turns</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                <span>Moderate Confidence (0.25 – 0.54):</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">{medConfCount} turns</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                <span>Low / Rejected (&lt; 0.25):</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{lowConfCount} turns</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                <span>Response Feedback Ratings:</span>
                <span>
                  Helpful: {positiveFeedbackCount} · Unhelpful: {negativeFeedbackCount}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeSubView === 'report' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 5-Minute Viva & Demo Script */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Mic className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>5-Minute Academic Viva &amp; Project Demo Script</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Step-by-step script for presenting CampusMate AI to your CSDX 142 faculty evaluator.
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  Minute 0:00 – 1:00 | Problem Statement &amp; Zero-Cost Architecture
                </div>
                <p>
                  &ldquo;Good morning Professor. This is CampusMate AI, built for CSDX 142 (AI Chatbot Application). Instead of wrapping a paid LLM API like OpenAI or Gemini, we engineered a 100% client-side TypeScript NLP, TF-IDF vector retrieval, and Finite-State Dialogue System that runs at ₹0 recurring cost.&rdquo;
                </p>
              </div>

              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  Minute 1:00 – 2:30 | Live NLP Trace &amp; Multi-Turn Coreference (Modules I &amp; IV)
                </div>
                <p>
                  Click the Demo Prompt <em>&ldquo;Module IV: NLP &amp; spaCy&rdquo;</em> in Chat. Point to the right-hand <strong>Live NLP &amp; FSM Inspector</strong> to show contraction expansion, stop-word removal, Porter stems, extracted entities (<code className="font-mono">module=Module IV</code>, <code className="font-mono">topic=spaCy</code>), and TF-IDF cosine ranking. Next, click <em>&ldquo;Follow-up Coreference Test&rdquo;</em> (&ldquo;What are the important exam topics for it?&rdquo;) and show how the Dialogue State Tracker resolves <code className="font-mono">it &rarr; Module IV</code>.
                </p>
              </div>

              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  Minute 2:30 – 3:30 | Decision Trees &amp; Confidence Rejection Gate (Modules II &amp; III)
                </div>
                <p>
                  Click <em>&ldquo;Exam Prep Tree&rdquo;</em> to demonstrate deterministic DAG traversal (<code className="font-mono">IN_DECISION_TREE</code> state). Then click <em>&ldquo;Out-of-Domain Fallback Test&rdquo;</em> (&ldquo;What is the live Champions League football score today?&rdquo;) to prove the bot rejects low-confidence queries (&lt; 0.22) rather than hallucinating.
                </p>
              </div>

              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  Minute 3:30 – 5:00 | Live Knowledge Base Expansion &amp; 16-Case QA Benchmark (Module V)
                </div>
                <p>
                  Open the <strong>How It Works</strong> tab to show the 8-stage pipeline diagram and syllabus traceability matrix. Open <strong>Knowledge Base</strong> to show explicit <code className="font-mono">[Sample Demo Data]</code> labeling on college FAQs, and finish on this <strong>NLP Evaluation Dataset</strong> table showing 100% reproducible benchmark testing.
                </p>
              </div>
            </div>
          </div>

          {/* Academic Project Report Summary & Zero-Cost Proof */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Academic Report Summary, Zero-Cost Proof &amp; Future Scope</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Full Markdown documentation is also included in /README.md, /docs/PROJECT_REPORT.md, and /docs/TEST_REPORT.md.
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  Why This Architecture Has ₹0 Recurring Cost
                </div>
                <p>
                  All NLP tokenization, stemming, regex/gazetteer entity extraction, and TF-IDF cosine vector ranking execute in the client&apos;s JavaScript engine (<code className="font-mono">&lt; 2 ms</code> per turn). Persistence uses browser <code className="font-mono">localStorage</code>, and static assets are served via free HTTPS static hosting (AI Studio Cloud Run preview &amp; GitHub Pages workflow) with zero paid API keys or database bills.
                </p>
              </div>

              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  Honest Engineering Limitations
                </div>
                <ul className="list-disc list-inside space-y-1">
                  <li>Lexical Vocabulary Gap: TF-IDF matches stemmed words; unseen synonyms not in the KB require adding keywords.</li>
                  <li>Retrieval Only: Returns verified academic passages rather than synthesizing free-form essays or novel code.</li>
                  <li>Single-Browser Storage: Custom KB entries added via UI are saved locally in the current browser&apos;s <code className="font-mono">localStorage</code>.</li>
                </ul>
              </div>

              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  Future Enhancements (Module V Roadmap — Marked as Future Work)
                </div>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>[Future Work] Multimodal Voice &amp; Diagram Input:</strong> Integrating browser Web Speech API (ASR/TTS) and OCR diagram parsing.</li>
                  <li><strong>[Future Work] In-Browser Dense Embeddings:</strong> Running quantized ONNX sentence-transformers via WebAssembly/WebGPU for semantic synonym matching.</li>
                  <li><strong>[Future Work] Multilingual Indic Support:</strong> Adding Tamil, Hindi, and Telugu transliteration and syllabus translation layers.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
