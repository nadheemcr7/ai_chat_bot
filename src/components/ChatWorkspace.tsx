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
  BookOpen,
  HelpCircle,
  Compass,
  Cpu,
  GraduationCap,
  Briefcase,
  Layers,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  PlusCircle,
  ShieldAlert,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';
import {
  ChatMessage,
  DecisionTreeOption,
  DialogueContext,
  DialogueState,
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

const SYLLABUS_EXPLORER_ITEMS = [
  {
    code: 'Module I',
    title: 'Dialogue Systems & Architecture',
    query: 'Explain Module 1 dialogue system architecture and ELIZA history'
  },
  {
    code: 'Module II',
    title: 'Conversational UI & Training',
    query: 'Tell me about Module II Conversational UI stack and training approaches'
  },
  {
    code: 'Module III',
    title: 'Decision Trees & Dialogflow',
    query: 'How do Dialogflow intents, entities, contexts, and webhook fulfillment work in Module 3?'
  },
  {
    code: 'Module IV',
    title: 'NLP Methods, spaCy & TF-IDF',
    query: 'Explain Module IV NLP methods, spaCy pipeline components, and TF-IDF'
  },
  {
    code: 'Module V',
    title: 'Multimodality, IoT & Ethics',
    query: 'What is covered in Module V regarding multimodality, social robots, IoT, and ethics?'
  },
  {
    code: 'Exam Guide',
    title: 'High-Weightage Exam Prep',
    query: 'How should I prepare for the CSDX 142 semester exam and important 10 mark questions?'
  },
  {
    code: 'Placements',
    title: 'AI Project Pitch & Interviews',
    query: 'Give me placement interview tips and how to pitch this AI project to recruiters'
  }
];

const STARTER_CARDS = [
  {
    kicker: 'Module IV · NLP & Vector Math',
    title: 'Explain spaCy pipelines & TF-IDF Cosine Similarity',
    description: 'See how tokenization, tok2vec, NER, and vector ranking work in Module IV.',
    query: 'Explain Module IV NLP methods, spaCy pipeline components, and TF-IDF',
    icon: Cpu
  },
  {
    kicker: 'Module I · Core Architecture',
    title: 'Walk through NLU, DST, Policy & NLG stages',
    description: 'Understand how dialogue systems track conversation belief state across turns.',
    query: 'What is the difference between NLU, DST, and NLG in a dialogue pipeline?',
    icon: Layers
  },
  {
    kicker: 'Module III · Guided Flow',
    title: 'Launch the Interactive Exam Prep Decision Tree',
    description: 'Step through a deterministic decision tree tailored to your study timeline.',
    query: 'Start a guided decision tree flow for exam prep',
    icon: GitBranch
  },
  {
    kicker: 'Career & Viva · STAR Pitch',
    title: 'How to pitch this zero-cost AI project to recruiters',
    description: 'Get technical interview talking points and resume bullets for CampusMate AI.',
    query: 'Give me placement interview tips and how to pitch this AI project to recruiters',
    icon: Briefcase
  }
];

const FSM_STATES: DialogueState[] = [
  'IDLE',
  'ANSWERING_KB',
  'FOLLOW_UP_CONTEXT',
  'IN_DECISION_TREE',
  'AWAITING_CLARIFICATION',
  'FALLBACK_RECOVERY'
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
  const [expandedInlineTraces, setExpandedInlineTraces] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showInspector, setShowInspector] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const botMessagesWithTrace = messages.filter((m) => m.sender === 'bot' && m.trace);
  const activeTraceMessage =
    botMessagesWithTrace.find((m) => m.id === selectedTraceId) ??
    botMessagesWithTrace[botMessagesWithTrace.length - 1];
  const activeTrace: PipelineTrace | undefined = activeTraceMessage?.trace;

  const hasUserMessages = messages.some((m) => m.sender === 'user');

  useEffect(() => {
    if (messages.length > 1) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages.length, isTyping]);

  const handleSubmit = (textToSubmit?: string) => {
    const query = (textToSubmit ?? inputText).trim();
    if (!query && textToSubmit === undefined) {
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

  const handleCopyText = (id: string, text: string, bullets?: string[]) => {
    const fullText = bullets && bullets.length > 0 ? `${text}\n\n${bullets.map((b) => `• ${b}`).join('\n')}` : text;
    navigator.clipboard?.writeText(fullText);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  const toggleInlineTrace = (id: string) => {
    setExpandedInlineTraces((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-4">
      {/* 3-Pane Flagship AI Assistant Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT PANE: Syllabus Explorer, Decision Trees & Engine Controls (3 Cols on lg) */}
        <aside
          aria-label="Syllabus Explorer and Guided Flows"
          className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-5"
        >
          {/* New Chat & Reset Action */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClearHistory}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 rounded-xl transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Conversation</span>
            </button>
            <button
              type="button"
              onClick={onResetFlow}
              title="Reset Dialogue State Machine to IDLE"
              className="inline-flex items-center justify-center p-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="sr-only">Reset Flow</span>
            </button>
          </div>

          {/* CSDX 142 Syllabus Topic Explorer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
              <span>CSDX 142 Syllabus Explorer</span>
              <span className="font-mono">5 Modules</span>
            </div>
            <div className="space-y-1">
              {SYLLABUS_EXPLORER_ITEMS.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSubmit(item.query)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-sky-600 dark:text-sky-400 font-semibold">
                      {item.code}
                    </div>
                    <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-sky-600 dark:group-hover:text-sky-300">
                      {item.title}
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Decision Trees (Module III) */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
              <GitBranch className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Guided Decision Trees (Mod III)</span>
            </div>
            <div className="space-y-1.5">
              {Object.values(DECISION_TREES).map((tree) => (
                <button
                  key={tree.id}
                  type="button"
                  onClick={() => onStartTreeById(tree.id)}
                  className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 hover:bg-sky-50 dark:hover:bg-sky-950/50 border border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800 transition-colors flex items-center justify-between gap-2"
                >
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {tree.id === 'exam-advisor'
                      ? 'Exam Prep Advisor Tree'
                      : tree.id === 'architecture-selector'
                      ? 'Bot Architecture Selector'
                      : 'Placement Readiness Tree'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Confidence Threshold & Theme Controls */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="threshold-slider"
                  className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Confidence Gate (τ)</span>
                </label>
                <span className="font-mono tabular-nums font-bold text-sky-700 dark:text-sky-300">
                  {confidenceThreshold.toFixed(2)}
                </span>
              </div>
              <input
                id="threshold-slider"
                type="range"
                min="0.08"
                max="0.60"
                step="0.02"
                value={confidenceThreshold}
                onChange={(e) => onChangeThreshold(parseFloat(e.target.value))}
                aria-label="Confidence Rejection Threshold"
                className="w-full accent-sky-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Queries scoring below {confidenceThreshold.toFixed(2)} trigger safe fallback without hallucinating.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                )}
                <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
              </button>

              <button
                type="button"
                onClick={onClearHistory}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Chat</span>
              </button>
            </div>
          </div>
        </aside>

        {/* CENTER PANE: Flagship AI Conversation Stage (6 Cols when Inspector Open, 9 Cols when Closed) */}
        <section
          aria-label="AI Assistant Conversation Stage"
          className={`${
            showInspector ? 'lg:col-span-6' : 'lg:col-span-9'
          } flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs`}
        >
          {/* Stage Top Bar */}
          <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/60 dark:bg-slate-950/40">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                CampusMate AI Assistant
              </h1>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                <span>CSDX 142 Local Engine</span>
                <span aria-hidden="true" className="mx-1.5">·</span>
                <span>State: {dialogueContext.state}</span>
                {dialogueContext.lastModule && (
                  <>
                    <span aria-hidden="true" className="mx-1.5">·</span>
                    <span className="text-sky-600 dark:text-sky-400 font-semibold">
                      Context: {dialogueContext.lastModule}
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInspector((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {showInspector ? (
                <>
                  <PanelRightClose className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Hide NLP X-Ray</span>
                </>
              ) : (
                <>
                  <PanelRightOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Show NLP X-Ray</span>
                </>
              )}
            </button>
          </div>

          {/* Scrollable Conversation & Welcome Stage */}
          <div
            role="log"
            aria-label="Conversation history"
            data-testid="chat-message-list"
            className="p-4 sm:p-6 space-y-6 min-h-[500px] max-h-[640px] overflow-y-auto"
          >
            {/* Modern AI Welcome Stage & 4-Card Starter Grid when conversation is fresh */}
            {!hasUserMessages && (
              <div className="space-y-5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                <div className="space-y-1.5">
                  <div className="text-xs font-mono text-sky-600 dark:text-sky-400 font-semibold">
                    CSDX 142 · AI Chatbot Application · Zero-Cost Local NLP
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight" style={{ textWrap: 'balance' }}>
                    What would you like to explore in CSDX 142 today?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                    Ask any question in natural language, test multi-turn follow-up memory, or click one of the starter cards below to watch the live TF-IDF &amp; entity extraction pipeline in action.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STARTER_CARDS.map((card) => {
                    const IconComponent = card.icon;
                    return (
                      <button
                        key={card.title}
                        type="button"
                        onClick={() => handleSubmit(card.query)}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 hover:bg-sky-50/60 dark:hover:bg-sky-950/30 hover:border-sky-300 dark:hover:border-sky-800 text-left transition-colors group flex flex-col justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            <span>{card.kicker}</span>
                            <IconComponent className="w-4 h-4 text-sky-600 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-700 dark:group-hover:text-sky-300 leading-snug">
                            {card.title}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {card.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Message Thread */}
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isInspected = activeTraceMessage?.id === msg.id;
              const isInlineExpanded = Boolean(expandedInlineTraces[msg.id]);

              if (isUser) {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-full sm:max-w-xl flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1 font-mono tabular-nums">
                        <span className="font-sans font-semibold text-slate-700 dark:text-slate-300">
                          You
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div className="max-w-full break-words rounded-2xl rounded-tr-xs px-4 py-3 text-sm leading-relaxed bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-medium shadow-2xs">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex items-start gap-3">
                  {/* AI Avatar Mark */}
                  <div
                    aria-hidden="true"
                    className="w-8 h-8 rounded-xl bg-sky-600 dark:bg-sky-500 text-white dark:text-slate-950 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-2xs"
                  >
                    AI
                  </div>

                  <div className="flex-1 min-w-0 space-y-2.5">
                    {/* Bot Header & Inline Collapsible Reasoning Trace Bar (Claude / Perplexity style) */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                        <span className="font-sans font-bold text-slate-900 dark:text-slate-100">
                          CampusMate AI
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {msg.trace && (
                        <button
                          type="button"
                          onClick={() => toggleInlineTrace(msg.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono tabular-nums text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          <Cpu className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                          <span>
                            Processed in {msg.trace.executionTimeMs}ms · Intent: {msg.trace.intent.intent} (
                            {((msg.trace.topMatches[0]?.finalScore ?? msg.trace.intent.confidence) * 100).toFixed(0)}%)
                          </span>
                          {isInlineExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Inline Expandable Reasoning & Retrieval Box */}
                    {msg.trace && isInlineExpanded && (
                      <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono space-y-2 border border-slate-800">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sky-300 border-b border-slate-800 pb-1.5">
                          <span>FSM Transition: {msg.trace.previousState} → {msg.trace.nextState}</span>
                          <span>Threshold τ = {msg.trace.thresholdUsed.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Porter Stems: </span>
                          <span>[{msg.trace.preprocess.stems.join(', ')}]</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Entities: </span>
                          <span>
                            {msg.trace.entities.length > 0
                              ? msg.trace.entities.map((e) => `${e.type}="${e.value}"`).join(', ')
                              : 'None'}
                          </span>
                        </div>
                        <div className="text-emerald-300">{msg.trace.decisionReason}</div>
                      </div>
                    )}

                    {/* Main AI Answer Card */}
                    <div className="max-w-full break-words rounded-2xl rounded-tl-xs p-4 sm:p-5 bg-slate-50/90 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700/80 space-y-3.5">
                      {msg.isSampleData && (
                        <div className="flex items-center gap-2 text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/70 rounded-lg px-3 py-2">
                          <ShieldAlert className="w-4 h-4 shrink-0" />
                          <span>
                            Sample Demo Data — Illustrative college rules for CSDX 142 demonstration (Not official university policy)
                          </span>
                        </div>
                      )}

                      <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-line">
                        {msg.text}
                      </p>

                      {/* Structured Key Takeaways / Bullet Points */}
                      {msg.bulletPoints && msg.bulletPoints.length > 0 && (
                        <div className="pt-1 space-y-2">
                          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            Key Syllabus &amp; Technical Breakdown:
                          </div>
                          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                            {msg.bulletPoints.map((pt, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2.5 bg-white dark:bg-slate-900/70 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800"
                              >
                                <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 mt-0.5 shrink-0">
                                  0{idx + 1}.
                                </span>
                                <span className="leading-relaxed">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Decision Tree Interactive Options */}
                      {msg.decisionTreeOptions && msg.decisionTreeOptions.length > 0 && (
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2.5">
                          <div className="text-xs font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                            <GitBranch className="w-3.5 h-3.5" />
                            <span>Select Your Next Decision Tree Branch:</span>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
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
                                className="px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-left text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-sky-950/80 border border-sky-300 dark:border-sky-800 rounded-xl transition-colors flex items-center justify-between gap-2 shadow-2xs"
                              >
                                <span>{opt.label}</span>
                                <ChevronRight className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ambiguity Clarification Options */}
                      {msg.clarificationOptions && msg.clarificationOptions.length > 0 && (
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            Multiple syllabus topics matched closely. Select the exact topic you want:
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

                      {/* Source Citation & Action Toolbar */}
                      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/70 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="truncate max-w-md font-medium">
                          Source: {msg.sourceReference ?? 'CSDX 142 Verified Knowledge Base'}
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {msg.trace && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTraceId(msg.id);
                                setShowInspector(true);
                              }}
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                                isInspected
                                  ? 'bg-sky-600 text-white dark:bg-sky-500 dark:text-slate-950'
                                  : 'text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/60'
                              }`}
                            >
                              {isInspected ? 'Active in X-Ray' : 'View in X-Ray'}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.id, msg.text, msg.bulletPoints)}
                            aria-label="Copy response text"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => onFeedback(msg.id, 'up')}
                            aria-label={`Mark response helpful (${msg.id})`}
                            className={`p-1.5 rounded-md hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors ${
                              msg.feedback === 'up' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' : ''
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onFeedback(msg.id, 'down')}
                            aria-label={`Mark response unhelpful (${msg.id})`}
                            className={`p-1.5 rounded-md hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors ${
                              msg.feedback === 'down' ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50' : ''
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Perplexity-Style Suggested Follow-Up Stack on the Latest Bot Message */}
                    {msg.quickReplies &&
                      msg.quickReplies.length > 0 &&
                      msg.id === messages[messages.length - 1]?.id && (
                        <div className="pt-1 space-y-1.5">
                          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
                            Suggested Follow-Up Questions:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.quickReplies.map((reply, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSubmit(reply)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-700 dark:hover:text-sky-300 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors text-left"
                              >
                                <span>{reply}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono pl-11">
                <span>Computing TF-IDF vectors &amp; entity slot alignment...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Flagship Floating-Style Composer Dock */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="p-3.5 sm:p-4 bg-slate-50/90 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 space-y-2.5"
          >
            {/* Quick Capability Test Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap shrink-0 mr-1">
                Quick Tests:
              </span>
              <button
                type="button"
                onClick={() => handleSubmit('What are the stages in spaCy like tok2vec, tagger, parser, and ner in it?')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-400 whitespace-nowrap shrink-0 transition-colors"
              >
                Test Follow-Up (&ldquo;it&rdquo;)
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('What is the minimum attendance rule and passing marks?')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-400 whitespace-nowrap shrink-0 transition-colors"
              >
                Test Sample College FAQ
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('What is the live Champions League football score today?')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-400 whitespace-nowrap shrink-0 transition-colors"
              >
                Test Out-of-Domain Rejection
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('How does this chatbot work internally and are you using an LLM API?')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-400 whitespace-nowrap shrink-0 transition-colors"
              >
                Ask Bot Architecture
              </button>
            </div>

            <div className="flex items-end gap-2.5 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-sky-500 shadow-2xs">
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
                  placeholder="Ask CampusMate AI anything about CSDX 142 Modules I–V, NLU/DST, Dialogflow, spaCy, TF-IDF, or placements..."
                  className="w-full px-2.5 py-1.5 text-sm bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                aria-label="Send message"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </section>

        {/* RIGHT PANE: Visual NLP & FSM X-Ray Inspector (3 Cols on lg) */}
        {showInspector && (
          <aside
            aria-label="NLP and Dialogue State Inspector"
            className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4"
          >
            <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>NLP &amp; FSM X-Ray</span>
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Under-the-hood math &amp; state tracker
                </p>
              </div>
              <span className="text-xs font-mono tabular-nums font-semibold text-sky-700 dark:text-sky-300">
                Turn #{dialogueContext.turnCount}
              </span>
            </div>

            {/* Visual FSM State Grid */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-700 dark:text-slate-300">
                1. Finite-State Machine (Mod I &amp; III)
              </div>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                {FSM_STATES.map((st) => {
                  const isCurrent = dialogueContext.state === st;
                  return (
                    <div
                      key={st}
                      className={`px-2 py-1.5 rounded-lg border truncate ${
                        isCurrent
                          ? 'bg-sky-600 text-white dark:bg-sky-500 dark:text-slate-950 border-sky-600 font-bold'
                          : 'bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {st}
                    </div>
                  );
                })}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 font-mono tabular-nums text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Memory Module:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {dialogueContext.lastModule ?? 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Memory Topic:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                    {dialogueContext.lastTopic ?? 'None'}
                  </span>
                </div>
              </div>
            </div>

            {activeTrace ? (
              <>
                {/* Stage 2: Intent & Entities */}
                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-slate-700 dark:text-slate-300">
                    2. Detected Intent &amp; Entities (NLU)
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between font-mono tabular-nums">
                      <span className="text-slate-500">Intent:</span>
                      <span className="font-bold text-sky-700 dark:text-sky-300">
                        {activeTrace.intent.intent} ({(activeTrace.intent.confidence * 100).toFixed(0)}%)
                      </span>
                    </div>

                    {activeTrace.entities.length > 0 ? (
                      <div className="space-y-1 font-mono text-[11px] pt-1 border-t border-slate-200/70 dark:border-slate-800">
                        {activeTrace.entities.map((ent, i) => (
                          <div key={i} className="flex items-center justify-between gap-2">
                            <span className="text-slate-500">{ent.type}:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {ent.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 italic">
                        No named entities in this utterance.
                      </div>
                    )}

                    {activeTrace.contextUsed.resolvedPronoun && (
                      <div className="pt-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                        Coreference: Injected [{activeTrace.contextUsed.inferredModule ?? activeTrace.contextUsed.inferredTopic}]
                      </div>
                    )}
                  </div>
                </div>

                {/* Stage 3: Visual TF-IDF Cosine Similarity Bars */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      3. TF-IDF Vector Ranking
                    </span>
                    <span className="font-mono tabular-nums text-[11px] text-slate-500">
                      {activeTrace.executionTimeMs} ms
                    </span>
                  </div>

                  {activeTrace.topMatches.length > 0 ? (
                    <div className="space-y-2">
                      {activeTrace.topMatches.slice(0, 3).map((m, idx) => {
                        const pct = Math.min(100, Math.round(m.finalScore * 100));
                        return (
                          <div
                            key={m.id}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-slate-800 dark:text-slate-200">
                              <span className="truncate">
                                #{idx + 1} {m.title}
                              </span>
                              <span className="font-mono tabular-nums font-bold text-sky-700 dark:text-sky-300 shrink-0">
                                {m.finalScore.toFixed(2)}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  idx === 0 ? 'bg-sky-600 dark:bg-sky-400' : 'bg-slate-400 dark:bg-slate-600'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className="text-[10px] font-mono tabular-nums text-slate-500 truncate">
                              Cosine: {m.tfidfScore.toFixed(2)} · Boost: {m.entityBoost >= 0 ? `+${m.entityBoost.toFixed(2)}` : m.entityBoost.toFixed(2)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500">
                      Handled via deterministic rule / decision tree node.
                    </div>
                  )}
                </div>

                {/* Stage 4: Stemmed Tokens */}
                <div className="space-y-1.5 text-xs">
                  <div className="font-semibold text-slate-700 dark:text-slate-300">
                    4. Stemmed Tokens (Mod IV)
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 break-words">
                    [{activeTrace.preprocess.stems.join(', ') || 'none'}]
                  </div>
                </div>
              </>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Ready to Inspect
                </p>
                <p className="text-[11px] leading-relaxed">
                  Click any Starter Card or syllabus module on the left to see real-time entity extraction, Porter stems, and TF-IDF similarity bars here.
                </p>
              </div>
            )}

            {/* Quick Deep-Dive Navigation */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => onNavigateTab('how-it-works')}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Pipeline Diagram</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('quiz')}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Syllabus Quiz</span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
