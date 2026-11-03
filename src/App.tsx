import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { ChatWorkspace } from './components/ChatWorkspace';
import { HowItWorksView } from './components/HowItWorksView';
import { QuizAndInterviewView } from './components/QuizAndInterviewView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { AnalyticsAndEvalView } from './components/AnalyticsAndEvalView';
import {
  ChatMessage,
  DecisionTreeOption,
  DialogueContext,
  KnowledgeEntry
} from './types/chatbot';
import {
  INITIAL_DIALOGUE_CONTEXT,
  processUserMessage,
  advanceDecisionTree
} from './dialogue/dialogueManager';
import {
  createWelcomeMessage,
  loadConfidenceThreshold,
  loadKnowledgeBase,
  loadStoredContext,
  loadStoredMessages,
  loadThemePreference,
  saveConfidenceThreshold,
  saveCustomKnowledgeEntries,
  saveStoredContext,
  saveStoredMessages,
  saveThemePreference
} from './storage/localStore';

const DEMO_SEQUENCE_QUERIES = [
  'Explain Module IV NLP methods, spaCy pipeline components, and TF-IDF',
  'What are the stages in spaCy like tok2vec, tagger, parser, and ner?',
  'How do Dialogflow intents, entities, contexts, and webhook fulfillment work in Module 3?',
  'Explain Module 1 dialogue system architecture and ELIZA history'
];

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadStoredMessages());
  const [dialogueContext, setDialogueContext] = useState<DialogueContext>(() => loadStoredContext());
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeEntry[]>(() => loadKnowledgeBase());
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(() => loadConfidenceThreshold());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadThemePreference());
  const [demoQueryIndex, setDemoQueryIndex] = useState(0);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveThemePreference(theme);
  }, [theme]);

  useEffect(() => {
    saveStoredMessages(messages);
  }, [messages]);

  useEffect(() => {
    saveStoredContext(dialogueContext);
  }, [dialogueContext]);

  const handleSendMessage = (rawText: string) => {
    const trimmed = rawText.trim();
    const userMessage: ChatMessage | null = trimmed
      ? {
          id: `user-${Date.now()}`,
          sender: 'user',
          text: trimmed,
          timestamp: new Date().toLocaleTimeString()
        }
      : null;

    const turnOutput = processUserMessage(
      rawText,
      dialogueContext,
      knowledgeBase,
      confidenceThreshold
    );

    setMessages((prev) =>
      userMessage
        ? [...prev, userMessage, turnOutput.botMessage]
        : [...prev, turnOutput.botMessage]
    );
    setDialogueContext(turnOutput.updatedContext);
  };

  const handleSelectDecisionOption = (treeId: string, option: DecisionTreeOption) => {
    const userChoiceMsg: ChatMessage = {
      id: `user-tree-${Date.now()}`,
      sender: 'user',
      text: option.label,
      timestamp: new Date().toLocaleTimeString()
    };

    const turnOutput = advanceDecisionTree(
      treeId,
      option.label,
      option.nextNodeId,
      option.resolutionText,
      dialogueContext
    );

    setMessages((prev) => [...prev, userChoiceMsg, turnOutput.botMessage]);
    setDialogueContext(turnOutput.updatedContext);
  };

  const handleStartTreeById = (treeId: string) => {
    const queryMap: Record<string, string> = {
      'exam-advisor': 'Start a guided decision tree flow for exam prep',
      'architecture-selector': 'Start a guided decision tree for chatbot architecture selector',
      'placement-prep': 'Start a guided decision tree for placement interview prep'
    };
    handleSendMessage(queryMap[treeId] ?? 'Start a guided decision tree flow for exam prep');
  };

  const handleClearHistory = () => {
    const freshWelcome = createWelcomeMessage();
    setMessages([freshWelcome]);
    setDialogueContext(INITIAL_DIALOGUE_CONTEXT);
  };

  const handleResetFlow = () => {
    handleSendMessage('reset');
  };

  const handleChangeThreshold = (val: number) => {
    setConfidenceThreshold(val);
    saveConfidenceThreshold(val);
  };

  const handleFeedback = (messageId: string, rating: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback: rating } : m))
    );
  };

  const handleAddKnowledgeEntry = (newEntry: KnowledgeEntry) => {
    setKnowledgeBase((prev) => {
      const updated = [newEntry, ...prev];
      saveCustomKnowledgeEntries(updated);
      return updated;
    });
  };

  const handleDeleteCustomEntry = (id: string) => {
    setKnowledgeBase((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveCustomKnowledgeEntries(updated);
      return updated;
    });
  };

  const handleImportEntries = (imported: KnowledgeEntry[]) => {
    setKnowledgeBase((prev) => {
      const existingIds = new Set(prev.map((e) => e.id));
      const uniqueNew = imported.filter((e) => !existingIds.has(e.id));
      const updated = [...uniqueNew, ...prev];
      saveCustomKnowledgeEntries(updated);
      return updated;
    });
  };

  const handleRunDemoQuery = () => {
    const nextQuery = DEMO_SEQUENCE_QUERIES[demoQueryIndex % DEMO_SEQUENCE_QUERIES.length];
    setDemoQueryIndex((prev) => prev + 1);
    setActiveTab('chat');
    handleSendMessage(nextQuery);
  };

  const handleTryQueryFromOtherTab = (query: string) => {
    setActiveTab('chat');
    handleSendMessage(query);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onRunDemoQuery={handleRunDemoQuery}
      />

      <main className="flex-1">
        {activeTab === 'chat' && (
          <ChatWorkspace
            messages={messages}
            dialogueContext={dialogueContext}
            confidenceThreshold={confidenceThreshold}
            theme={theme}
            onSendMessage={handleSendMessage}
            onSelectDecisionOption={handleSelectDecisionOption}
            onStartTreeById={handleStartTreeById}
            onClearHistory={handleClearHistory}
            onResetFlow={handleResetFlow}
            onChangeThreshold={handleChangeThreshold}
            onFeedback={handleFeedback}
            onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorksView onTryInChat={handleTryQueryFromOtherTab} />
        )}

        {activeTab === 'quiz' && <QuizAndInterviewView />}

        {activeTab === 'knowledge-base' && (
          <KnowledgeBaseView
            entries={knowledgeBase}
            onAddEntry={handleAddKnowledgeEntry}
            onDeleteCustomEntry={handleDeleteCustomEntry}
            onImportEntries={handleImportEntries}
            onAskInChat={handleTryQueryFromOtherTab}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsAndEvalView
            messages={messages}
            knowledgeBase={knowledgeBase}
            confidenceThreshold={confidenceThreshold}
            onRunQueryInChat={handleTryQueryFromOtherTab}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-4 sm:px-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>CampusMate AI — CSDX 142 (AI Chatbot Application)</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>L-T-P-C: 3-0-0-3 (SDG 9)</span>
          </div>
          <div>
            <span>100% Local TypeScript NLP, TF-IDF &amp; Finite-State Dialogue Engine</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>₹0 Recurring Cost</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
