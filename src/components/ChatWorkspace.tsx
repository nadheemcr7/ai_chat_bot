import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  RotateCcw,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Sliders,
  Terminal,
  GitBranch,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import {
  ChatMessage,
  DecisionTreeOption,
  DialogueContext,
  PipelineTrace
} from '../types/chatbot';
import { DECISION_TREES } from '../data/decisionTrees';

interface ChatWorkspaceProps {
  messages: ChatMessage[];
  dialogueContext: DialogueContext;
  confidenceThreshold: number;
  theme: 'light' | 'dark';
  onSendMessage: (text: string) => void;
  onSelectDecisionOption: (treeId: string, option: DecisionTreeOption) => void;
  onStartTreeById: (treeId: string) => void;
  onClearHistory: () => void;
  onResetFlow: () => void;
  onChangeThreshold: (val: number) => void;
  onFeedback: (messageId: string, rating: 'up' | 'down') => void;
  onToggleTheme: () => void;
  onNavigateTab: (tab: 'how-it-works' | 'quiz' | 'knowledge-base' | 'analytics') => void;
}

const DEMO_PRESET_QUERIES = [
  { label: 'Course Overview', query: 'What are the 5 modules and credit structure of CSDX 142?' },
  { label: 'Module I: Dialogue Systems', query: 'Explain Module 1 dialogue system architecture and ELIZA history' },
  { label: 'Module II: Conversational UI', query: 'Tell me about Module II Conversational UI stack and training approaches' },
  { label: 'Module III: Dialogflow', query: 'How do Dialogflow intents, entities, contexts, and webhook fulfillment work in Module 3?' },
  { label: 'Module IV: NLP & spaCy', query: 'Explain Module IV NLP methods, spaCy pipeline components, and TF-IDF' },
  { label: 'Module V: Multimodality & Ethics', query: 'What is covered in Module V regarding multimodality, social robots, IoT, and ethics?' },
  { label: 'Follow-up Coreference Test', query: 'What are the important exam topics for it?' },
  { label: 'Sample Attendance FAQ', query: 'What is the minimum attendance rule and passing marks?' },
  { label: 'Out-of-Domain Fallback Test', query: 'What is the live Champions League football score today?' }
];

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  messages,
  dialogueContext,
  confidenceThreshold,
  theme,
  onSendMessage,
  onSelectDecisionOption,
  onStartTreeById,
  onClearHistory,
  onResetFlow,
  onChangeThreshold,
  onFeedback,
  onToggleTheme,
  onNavigateTab
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);
  const [showInspectorMobile, setShowInspectorMobile] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Pick the trace to show in the right-hand inspector (either selected message or latest bot message with a trace)
  const botMessagesWithTrace = messages.filter((m) => m.sender === 'bot' && m.trace);
  const activeTraceMessage =
    botMessagesWithTrace.find((m) => m.id === selectedTraceId) ??
    botMessagesWithTrace[botMessagesWithTrace.length - 1];
  const activeTrace: PipelineTrace | undefined = activeTraceMessage?.trace;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages.length, isTyping]);

  const handleSubmit = (textToSubmit?: string) => {
    const query = (textToSubmit ?? inputText).trim();
    if (!query && textToSubmit === undefined) {
      // Allow testing empty submission if user explicitly clicks Send with empty box? Better: show brief typing or process immediately
      onSendMessage('');
      return;
    }
    if (textToSubmit === undefined) {
      setInputText('');
    }
    setIsTyping(true);
    window.setTimeout(() => {
      setIsTyping(false);
      onSendMessage(query);
    }, 140);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-5">
      {/* Compact Hero / Context Header Strip */}
      <section className="mb-5 pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span>CSDX 142: AI Chatbot Application</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>L-T-P-C: 3-0-0-3 (SDG 9)</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>100% Local Zero-Cost NLP Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100" style={{ textWrap: 'balance' }}>
            Intelligent College Assistant &amp; Syllabus Demonstrator
          </h1>
        </div>

        {/* Workspace Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
            <Sliders className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
            <label htmlFor="threshold-slider" className="font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
              Threshold (τ): <span className="font-mono tabular-nums font-semibold">{confidenceThreshold.toFixed(2)}</span>
            </label>
            <input
              id="threshold-slider"
              type="range"
              min="0.08"
              max="0.60"
              step="0.02"
              value={confidenceThreshold}
              onChange={(e) => onChangeThreshold(parseFloat(e.target.value))}
              aria-label="Confidence Rejection Threshold"
              className="w-20 accent-sky-600 cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={onResetFlow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Flow
          </button>

          <button
            type="button"
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Chat
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>

          <button
            type="button"
            onClick={() => setShowInspectorMobile((prev) => !prev)}
            className="xl:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-lg whitespace-nowrap shrink-0"
          >
            <Terminal className="w-3.5 h-3.5" />
            {showInspectorMobile ? 'Hide NLP Inspector' : 'Show NLP Inspector'}
          </button>
        </div>
      </section>

      {/* Main 2-Zone Split Workspace: Left = Chat & Guided Flows (65%), Right = Live NLP & FSM Inspector (35%) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chat Interface */}
        <div className="xl:col-span-8 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          {/* Guided Decision Tree & Demo Prompt Bar */}
          <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <GitBranch className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Guided Decision Trees (Module III):</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {Object.values(DECISION_TREES).map((tree) => (
                  <button
                    key={tree.id}
                    type="button"
                    onClick={() => onStartTreeById(tree.id)}
                    className="px-2.5 py-1 text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 hover:bg-sky-100 dark:hover:bg-sky-900/80 border border-sky-200/80 dark:border-sky-800/80 rounded-md transition-colors whitespace-nowrap shrink-0"
                  >
                    {tree.id === 'exam-advisor'
                      ? 'Exam Prep Tree'
                      : tree.id === 'architecture-selector'
                      ? 'Architecture Selector'
                      : 'Placement Prep Tree'}
                  </button>
                ))}
              </div>
            </div>

            {/* One-Click Demo Queries */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0 mr-1">
                Demo Prompts:
              </span>
              {DEMO_PRESET_QUERIES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSubmit(preset.query)}
                  className="px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-md transition-colors whitespace-nowrap shrink-0"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Messages Stream */}
          <div
            role="log"
            aria-label="Conversation history"
            data-testid="chat-message-list"
            className="p-4 sm:p-5 space-y-5 min-h-[420px] max-h-[540px] overflow-y-auto"
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isInspected = activeTraceMessage?.id === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  {/* Unboxed Metadata Line */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-mono tabular-nums">
                    <span className="font-sans font-semibold text-slate-700 dark:text-slate-300">
                      {isUser ? 'Student' : 'CampusMate AI'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{msg.timestamp}</span>
                    {!isUser && msg.trace && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Intent: {msg.trace.intent.intent}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Score:{' '}
                          {(msg.trace.topMatches[0]?.finalScore ?? msg.trace.intent.confidence).toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-full sm:max-w-2xl break-words rounded-xl px-4 py-3.5 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-sky-600 text-white dark:bg-sky-500 dark:text-slate-950 font-medium'
                        : 'bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700/80'
                    }`}
                  >
                    {/* Sample Data Disclaimer Kicker */}
                    {msg.isSampleData && (
                      <div className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-2 pb-1.5 border-b border-amber-200/70 dark:border-amber-800/60">
                        Sample Demo Data — Illustrative college rules for CSDX 142 demonstration
                      </div>
                    )}

                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Structured Bullet Points */}
                    {msg.bulletPoints && msg.bulletPoints.length > 0 && (
                      <ul className="mt-3 space-y-1.5 list-disc list-inside text-slate-700 dark:text-slate-200">
                        {msg.bulletPoints.map((pt, idx) => (
                          <li key={idx} className="leading-snug">
                            {pt}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Decision Tree Branch Buttons */}
                    {msg.decisionTreeOptions && msg.decisionTreeOptions.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Select a Decision Tree branch to continue:
                        </div>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                          {msg.decisionTreeOptions.map((opt, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                if (opt.followUpQuery && !opt.nextNodeId && !opt.resolutionText) {
                                  handleSubmit(opt.followUpQuery);
                                } else {
                                  onSelectDecisionOption(
                                    dialogueContext.activeTreeId ?? 'exam-advisor',
                                    opt
                                  );
                                }
                              }}
                              className="px-3 py-2 text-xs font-semibold text-left text-sky-800 dark:text-sky-200 bg-sky-100/80 dark:bg-sky-950/90 hover:bg-sky-200/80 dark:hover:bg-sky-900 border border-sky-300 dark:border-sky-800 rounded-lg transition-colors"
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ambiguity Clarification Options */}
                    {msg.clarificationOptions && msg.clarificationOptions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Did you mean one of these specific knowledge base entries?
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {msg.clarificationOptions.map((cand) => (
                            <button
                              key={cand.id}
                              type="button"
                              onClick={() => handleSubmit(`Explain ${cand.title}`)}
                              className="px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors"
                            >
                              {cand.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Source Citation & Message Footer Actions */}
                    {!isUser && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/70 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="truncate max-w-md">
                          Source: {msg.sourceReference ?? 'Local CSDX 142 Knowledge Base'}
                        </span>

                        <div className="flex items-center gap-2 shrink-0">
                          {msg.trace && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTraceId(msg.id);
                                setShowInspectorMobile(true);
                              }}
                              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                                isInspected
                                  ? 'bg-sky-600 text-white dark:bg-sky-500 dark:text-slate-950'
                                  : 'text-sky-700 dark:text-sky-300 hover:underline'
                              }`}
                            >
                              {isInspected ? 'Inspecting Trace' : 'Inspect NLP Trace'}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onFeedback(msg.id, 'up')}
                            aria-label={`Mark response helpful (${msg.id})`}
                            className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
                              msg.feedback === 'up' ? 'text-emerald-600 dark:text-emerald-400' : ''
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onFeedback(msg.id, 'down')}
                            aria-label={`Mark response unhelpful (${msg.id})`}
                            className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
                              msg.feedback === 'down' ? 'text-rose-600 dark:text-rose-400' : ''
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Clickable Quick Replies on the Latest Bot Message */}
                  {!isUser && msg.quickReplies && msg.quickReplies.length > 0 && msg.id === messages[messages.length - 1]?.id && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-2xl">
                      {msg.quickReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSubmit(reply)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-700 dark:hover:text-sky-300 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors text-left"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>CampusMate AI is computing TF-IDF &amp; entity vectors...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-end gap-2.5">
              <div className="flex-1">
                <label htmlFor="chat-query-input" className="sr-only">
                  Ask a question about CSDX 142 syllabus, NLP, Dialogflow, exams, or placements
                </label>
                <textarea
                  id="chat-query-input"
                  rows={2}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Module I–V, NLU/DST, Dialogflow, spaCy, TF-IDF, exam prep, or follow-up with 'it'... (Enter to send, Shift+Enter for new line)"
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                />
              </div>
              <button
                type="submit"
                aria-label="Send message"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live NLP & Finite-State Dialogue Inspector (35%) */}
        <aside
          aria-label="NLP and Dialogue State Inspector"
          className={`xl:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 ${
            showInspectorMobile ? 'block' : 'hidden xl:block'
          }`}
        >
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Live NLP &amp; FSM Inspector</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time deterministic trace of the selected bot response
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              Turn #{dialogueContext.turnCount}
            </span>
          </div>

          {/* Current Dialogue State & Context Slots */}
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              1. Finite-State Machine &amp; Context Memory (Module I &amp; III)
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 font-mono tabular-nums space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Active FSM State:</span>
                <span className="font-semibold text-sky-700 dark:text-sky-300">
                  {dialogueContext.state}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Context Module Slot:</span>
                <span className="text-slate-800 dark:text-slate-200">
                  {dialogueContext.lastModule ?? 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Context Topic Slot:</span>
                <span className="text-slate-800 dark:text-slate-200">
                  {dialogueContext.lastTopic ?? 'None'}
                </span>
              </div>
              {dialogueContext.activeTreeId && (
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Decision Tree:</span>
                  <span className="text-emerald-700 dark:text-emerald-400">
                    {dialogueContext.activeTreeId} ({dialogueContext.activeNodeId})
                  </span>
                </div>
              )}
            </div>
          </div>

          {activeTrace ? (
            <>
              {/* Stage 2: Preprocessing & Stemming */}
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-slate-700 dark:text-slate-300">
                  2. Text Normalization &amp; Stemming (Module IV)
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 font-mono space-y-1.5">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Filtered Tokens: </span>
                    <span className="text-slate-800 dark:text-slate-200">
                      [{activeTrace.preprocess.filteredTokens.join(', ') || 'none'}]
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Porter Stems: </span>
                    <span className="text-sky-700 dark:text-sky-300">
                      [{activeTrace.preprocess.stems.join(', ') || 'none'}]
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Removed Stop-Words: </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      [{activeTrace.preprocess.removedStopWords.join(', ') || 'none'}]
                    </span>
                  </div>
                </div>
              </div>

              {/* Stage 3: Intent Classification & Entity Extraction */}
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-slate-700 dark:text-slate-300">
                  3. Intent &amp; Entity Extraction (NLU)
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between font-mono tabular-nums">
                    <span className="text-slate-500 dark:text-slate-400">Predicted Intent:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {activeTrace.intent.intent} ({(activeTrace.intent.confidence * 100).toFixed(0)}%)
                    </span>
                  </div>

                  <div>
                    <div className="text-slate-500 dark:text-slate-400 mb-1">Extracted Entities:</div>
                    {activeTrace.entities.length > 0 ? (
                      <div className="space-y-1 font-mono">
                        {activeTrace.entities.map((ent, i) => (
                          <div key={i} className="text-slate-800 dark:text-slate-200">
                            {ent.type} = &quot;{ent.value}&quot; <span className="text-slate-500">(raw: &quot;{ent.rawText}&quot;)</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-500 italic">No named entities extracted in this turn.</div>
                    )}
                  </div>

                  {activeTrace.contextUsed.resolvedPronoun && (
                    <div className="pt-1 text-emerald-700 dark:text-emerald-400 font-medium">
                      Coreference Resolved: Injected [{activeTrace.contextUsed.inferredModule ?? activeTrace.contextUsed.inferredTopic}] from prior turn.
                    </div>
                  )}
                </div>
              </div>

              {/* Stage 4: TF-IDF Cosine Ranking */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    4. Top TF-IDF Cosine Matches
                  </span>
                  <span className="font-mono tabular-nums text-slate-500">
                    {activeTrace.executionTimeMs} ms
                  </span>
                </div>

                {activeTrace.topMatches.length > 0 ? (
                  <div className="space-y-2">
                    {activeTrace.topMatches.slice(0, 3).map((m, idx) => (
                      <div
                        key={m.id}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800"
                      >
                        <div className="flex items-center justify-between gap-2 font-medium text-slate-800 dark:text-slate-200">
                          <span className="truncate">
                            #{idx + 1} {m.title}
                          </span>
                          <span className="font-mono tabular-nums font-semibold text-sky-700 dark:text-sky-300 shrink-0">
                            {m.finalScore.toFixed(3)}
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                          Cosine: {m.tfidfScore.toFixed(3)} · Boost: {m.entityBoost >= 0 ? `+${m.entityBoost.toFixed(2)}` : m.entityBoost.toFixed(2)} · Terms: [{m.matchedTerms.join(', ')}]
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 text-slate-500">
                    Handled by deterministic intent/tree rule (no KB vector search required).
                  </div>
                )}

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">Policy Decision: </span>
                  {activeTrace.decisionReason}
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <p className="font-medium text-slate-800 dark:text-slate-200">
                Send a message or click any Demo Prompt above to inspect the live NLP pipeline trace.
              </p>
              <p>
                Every user turn logs exact tokens, Porter stems, extracted entities, TF-IDF cosine similarity scores, and Finite-State Machine transitions.
              </p>
            </div>
          )}

          {/* Quick Navigation Links to Academic Modules */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => onNavigateTab('how-it-works')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              How It Works
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('quiz')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              Take CSDX Quiz
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
