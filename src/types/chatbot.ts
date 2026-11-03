export type IntentType =
  | 'greeting'
  | 'syllabus_query'
  | 'exam_prep'
  | 'placement_guidance'
  | 'college_faq'
  | 'architecture_how_it_works'
  | 'decision_tree_start'
  | 'gratitude_farewell'
  | 'bot_help'
  | 'unknown_fallback';

export type DialogueState =
  | 'IDLE'
  | 'ANSWERING_KB'
  | 'AWAITING_CLARIFICATION'
  | 'IN_DECISION_TREE'
  | 'FOLLOW_UP_CONTEXT'
  | 'FALLBACK_RECOVERY';

export type KnowledgeCategory =
  | 'syllabus'
  | 'objectives'
  | 'exam_prep'
  | 'placement'
  | 'college_faq'
  | 'terminology'
  | 'bot_help';

export interface KnowledgeEntry {
  id: string;
  title: string;
  category: KnowledgeCategory;
  moduleNumber?: 'Module I' | 'Module II' | 'Module III' | 'Module IV' | 'Module V' | 'General';
  courseObjective?: 'COB1' | 'COB2' | 'COB3' | 'COB4' | 'COB5';
  questionPatterns: string[];
  keywords: string[];
  answer: string;
  bulletPoints?: string[];
  followUpSuggestions: string[];
  sourceReference: string;
  isSampleData?: boolean;
  isCustom?: boolean;
}

export interface ExtractedEntity {
  type: 'module' | 'course_code' | 'cob' | 'topic' | 'category' | 'company_role';
  value: string;
  rawText: string;
  confidence: number;
}

export interface IntentPrediction {
  intent: IntentType;
  confidence: number;
  matchedSignals: string[];
  allScores: Record<IntentType, number>;
}

export interface RetrievalMatch {
  entry: KnowledgeEntry;
  tfidfScore: number;
  keywordOverlapScore: number;
  entityBoost: number;
  finalScore: number;
  matchedTerms: string[];
}

export interface PreprocessResult {
  original: string;
  normalized: string;
  tokens: string[];
  filteredTokens: string[];
  stems: string[];
  removedStopWords: string[];
}

export interface PipelineTrace {
  timestamp: string;
  preprocess: PreprocessResult;
  intent: IntentPrediction;
  entities: ExtractedEntity[];
  topMatches: {
    id: string;
    title: string;
    category: KnowledgeCategory;
    moduleNumber?: string;
    tfidfScore: number;
    entityBoost: number;
    finalScore: number;
    matchedTerms: string[];
  }[];
  thresholdUsed: number;
  passedThreshold: boolean;
  isAmbiguous: boolean;
  previousState: DialogueState;
  nextState: DialogueState;
  contextUsed: {
    resolvedPronoun: boolean;
    inferredModule?: string;
    inferredTopic?: string;
    activeTreeId?: string;
    activeNodeId?: string;
  };
  decisionReason: string;
  executionTimeMs: number;
}

export interface DecisionTreeOption {
  label: string;
  nextNodeId?: string;
  resolutionText?: string;
  followUpQuery?: string;
}

export interface DecisionTreeNode {
  id: string;
  prompt: string;
  description?: string;
  options: DecisionTreeOption[];
}

export interface DecisionTree {
  id: string;
  title: string;
  syllabusModule: string;
  description: string;
  rootNodeId: string;
  nodes: Record<string, DecisionTreeNode>;
}

export interface DialogueContext {
  state: DialogueState;
  lastModule?: 'Module I' | 'Module II' | 'Module III' | 'Module IV' | 'Module V' | 'General';
  lastCategory?: KnowledgeCategory;
  lastTopic?: string;
  lastEntryId?: string;
  clarificationCandidates?: {
    id: string;
    title: string;
    moduleNumber?: string;
  }[];
  activeTreeId?: string;
  activeNodeId?: string;
  turnCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  bulletPoints?: string[];
  sourceReference?: string;
  isSampleData?: boolean;
  quickReplies?: string[];
  decisionTreeOptions?: DecisionTreeOption[];
  clarificationOptions?: { id: string; title: string; moduleNumber?: string }[];
  feedback?: 'up' | 'down';
  trace?: PipelineTrace;
}

export interface QuizQuestion {
  id: string;
  moduleNumber: 'Module I' | 'Module II' | 'Module III' | 'Module IV' | 'Module V';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
}

export interface InterviewQuestion {
  id: string;
  track: 'AI & NLP Engineering' | 'Full-Stack & System Design' | 'Behavioral & HR';
  question: string;
  keyConceptsToMention: string[];
  sampleStrongAnswer: string;
  followUpProbe: string;
}

export interface EvaluationTestCase {
  id: string;
  query: string;
  category: string;
  expectedIntent: IntentType;
  expectedModule?: string;
  expectedEntityTypes: string[];
  minExpectedConfidence: number;
  description: string;
}
