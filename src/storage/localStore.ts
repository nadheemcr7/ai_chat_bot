import { ChatMessage, DialogueContext, KnowledgeEntry } from '../types/chatbot';
import { INITIAL_KNOWLEDGE_BASE } from '../data/knowledgeBase';
import { INITIAL_DIALOGUE_CONTEXT } from '../dialogue/dialogueManager';

const STORAGE_KEYS = {
  MESSAGES: 'campusmate_messages_v1',
  CONTEXT: 'campusmate_context_v1',
  CUSTOM_KB: 'campusmate_custom_kb_v1',
  THRESHOLD: 'campusmate_threshold_v1',
  THEME: 'campusmate_theme_v1',
  QUIZ_BEST: 'campusmate_quiz_best_v1'
};

export function createWelcomeMessage(): ChatMessage {
  return {
    id: 'welcome-msg-initial',
    sender: 'bot',
    text: 'Welcome to CampusMate AI — your zero-cost Intelligent College Assistant built for CSDX 142 (AI Chatbot Application). I run a local TypeScript NLP pipeline (Tokenization, Stemming, Regex/Gazetteer Entity Extraction, TF-IDF Cosine Similarity Retrieval, and a Finite-State Dialogue Manager) directly in your browser.',
    bulletPoints: [
      'Explore all 5 Modules of CSDX 142 (Dialogue Systems, Conversational UI, Building Chatbots/Dialogflow, NLP/spaCy, Future Directions & Ethics).',
      'Try multi-turn follow-up questions (e.g., ask about Module IV, then ask "What are the important exam questions for it?").',
      'Run interactive Decision Trees for Exam Prep, Architecture Selection, or Placement Interviews.',
      'Inspect live TF-IDF vectors, confidence scores, and FSM state transitions in the Developer Inspector panel.'
    ],
    sourceReference: 'CSDX 142 Complete Syllabus Engine (Modules I–V)',
    timestamp: new Date().toLocaleTimeString(),
    quickReplies: [
      'What are the 5 modules of CSDX 142?',
      'Explain Module I Dialogue System architecture',
      'Explain Module IV NLP methods, spaCy & TF-IDF',
      'How do Dialogflow intents and contexts work in Module 3?',
      'Start a guided decision tree flow for exam prep',
      'Placement interview tips for AI projects'
    ]
  };
}

export function loadStoredMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!raw) return [createWelcomeMessage()];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [createWelcomeMessage()];
  } catch {
    return [createWelcomeMessage()];
  }
}

export function saveStoredMessages(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

export function loadStoredContext(): DialogueContext {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTEXT);
    if (!raw) return INITIAL_DIALOGUE_CONTEXT;
    return JSON.parse(raw) as DialogueContext;
  } catch {
    return INITIAL_DIALOGUE_CONTEXT;
  }
}

export function saveStoredContext(context: DialogueContext): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONTEXT, JSON.stringify(context));
  } catch {
    // Ignore
  }
}

export function loadKnowledgeBase(): KnowledgeEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_KB);
    if (!raw) return INITIAL_KNOWLEDGE_BASE;
    const customEntries = JSON.parse(raw) as KnowledgeEntry[];
    if (!Array.isArray(customEntries)) return INITIAL_KNOWLEDGE_BASE;
    return [...INITIAL_KNOWLEDGE_BASE, ...customEntries];
  } catch {
    return INITIAL_KNOWLEDGE_BASE;
  }
}

export function saveCustomKnowledgeEntries(allEntries: KnowledgeEntry[]): void {
  try {
    const customOnly = allEntries.filter((e) => e.isCustom);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_KB, JSON.stringify(customOnly));
  } catch {
    // Ignore
  }
}

export function loadConfidenceThreshold(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THRESHOLD);
    if (!raw) return 0.22;
    const num = parseFloat(raw);
    return Number.isFinite(num) && num >= 0.05 && num <= 0.8 ? num : 0.22;
  } catch {
    return 0.22;
  }
}

export function saveConfidenceThreshold(threshold: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THRESHOLD, String(threshold));
  } catch {
    // Ignore
  }
}

export function loadThemePreference(): 'light' | 'dark' {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME);
    return raw === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveThemePreference(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch {
    // Ignore
  }
}
