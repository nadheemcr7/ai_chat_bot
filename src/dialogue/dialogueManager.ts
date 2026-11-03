import {
  ChatMessage,
  DialogueContext,
  ExtractedEntity,
  KnowledgeEntry,
  PipelineTrace
} from '../types/chatbot';
import { DECISION_TREES } from '../data/decisionTrees';
import { preprocessText } from '../nlp/preprocessor';
import { extractEntities } from '../nlp/entityExtractor';
import { classifyIntent } from '../nlp/intentClassifier';
import { retrieveKnowledge } from '../nlp/retriever';

export const INITIAL_DIALOGUE_CONTEXT: DialogueContext = {
  state: 'IDLE',
  turnCount: 0
};

export interface DialogueTurnOutput {
  botMessage: ChatMessage;
  updatedContext: DialogueContext;
}

const PRONOUN_PATTERNS = /\b(it|its|that\s+module|this\s+module|that\s+unit|that\s+topic|those\s+topics|the\s+same\s+module)\b/i;

/**
 * Core Finite-State Dialogue Manager (Module I & Module III).
 * Handles:
 * 1. Active Decision Tree traversal & reset escape hatches
 * 2. Clarification resolution when previous turn was ambiguous
 * 3. Multi-turn context & pronoun/coreference resolution
 * 4. TF-IDF retrieval confidence check & ambiguity detection
 * 5. Full PipelineTrace generation for the Developer Inspector
 */
export function processUserMessage(
  rawInput: string,
  currentContext: DialogueContext,
  knowledgeBase: KnowledgeEntry[],
  confidenceThreshold = 0.22
): DialogueTurnOutput {
  const startTime = performance.now();
  const trimmed = (rawInput ?? '').trim();
  const previousState = currentContext.state;

  // Handle empty or malformed whitespace input gracefully
  if (!trimmed) {
    const emptyPrep = preprocessText('');
    const emptyIntent = classifyIntent(emptyPrep, []);
    const trace: PipelineTrace = {
      timestamp: new Date().toLocaleTimeString(),
      preprocess: emptyPrep,
      intent: emptyIntent,
      entities: [],
      topMatches: [],
      thresholdUsed: confidenceThreshold,
      passedThreshold: false,
      isAmbiguous: false,
      previousState,
      nextState: 'IDLE',
      contextUsed: { resolvedPronoun: false },
      decisionReason: 'Rejected empty input before retrieval.',
      executionTimeMs: Number((performance.now() - startTime).toFixed(2))
    };

    return {
      botMessage: {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Please enter a valid question or topic. You can ask about any CSDX 142 module (Modules I–V), Dialogflow, spaCy, exam preparation, or placement interviews.',
        timestamp: trace.timestamp,
        quickReplies: [
          'What are the 5 modules of CSDX 142?',
          'Explain Module IV NLP & spaCy',
          'Start Exam Prep Decision Tree'
        ],
        trace
      },
      updatedContext: {
        ...currentContext,
        state: 'IDLE'
      }
    };
  }

  // Check if user wants to reset/exit decision tree or conversation flow
  if (/^(reset|exit|cancel|stop|restart\s+flow|main\s+menu)$/i.test(trimmed)) {
    const prep = preprocessText(trimmed);
    const intent = classifyIntent(prep, []);
    const trace: PipelineTrace = {
      timestamp: new Date().toLocaleTimeString(),
      preprocess: prep,
      intent,
      entities: [],
      topMatches: [],
      thresholdUsed: confidenceThreshold,
      passedThreshold: true,
      isAmbiguous: false,
      previousState,
      nextState: 'IDLE',
      contextUsed: { resolvedPronoun: false },
      decisionReason: 'User triggered explicit conversation flow reset.',
      executionTimeMs: Number((performance.now() - startTime).toFixed(2))
    };

    return {
      botMessage: {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Conversation flow and context have been reset to IDLE. How can I help you with CSDX 142 today?',
        timestamp: trace.timestamp,
        quickReplies: [
          'What is CSDX 142 about?',
          'Explain Module I Dialogue Systems',
          'Start Exam Prep Decision Tree'
        ],
        trace
      },
      updatedContext: {
        state: 'IDLE',
        turnCount: currentContext.turnCount + 1
      }
    };
  }

  // Stage 1: Preprocess & Extract Entities
  let effectiveInput = trimmed;
  let resolvedPronoun = false;
  let inferredModule: string | undefined;
  let inferredTopic: string | undefined;

  const initialEntities = extractEntities(trimmed);
  const hasExplicitModule = initialEntities.some((e) => e.type === 'module');
  const hasExplicitTopic = initialEntities.some((e) => e.type === 'topic');

  // Coreference / Follow-up Context Resolution (e.g., "Tell me more about its architecture" or "What are the exam questions for it?")
  if (
    !hasExplicitModule &&
    (PRONOUN_PATTERNS.test(trimmed) || /^(what\s+about|and\s+what\s+are|tell\s+me\s+more|give\s+deep\s+dive)/i.test(trimmed)) &&
    (currentContext.lastModule || currentContext.lastTopic)
  ) {
    resolvedPronoun = true;
    inferredModule = currentContext.lastModule;
    inferredTopic = hasExplicitTopic ? undefined : currentContext.lastTopic;
    const contextAddon = [currentContext.lastModule, inferredTopic].filter(Boolean).join(' ');
    effectiveInput = `${trimmed} ${contextAddon}`;
  }

  const preprocess = preprocessText(effectiveInput);
  const entities: ExtractedEntity[] = extractEntities(effectiveInput);
  const intent = classifyIntent(preprocess, entities);

  // Stage 2: Check if user is starting or stepping through a Decision Tree (Module III)
  if (intent.intent === 'decision_tree_start') {
    let treeId = 'exam-advisor';
    if (/architecture|framework|selector|dialogflow/i.test(trimmed)) {
      treeId = 'architecture-selector';
    } else if (/placement|interview|career|resume/i.test(trimmed)) {
      treeId = 'placement-prep';
    }

    const tree = DECISION_TREES[treeId];
    const rootNode = tree.nodes[tree.rootNodeId];

    const trace: PipelineTrace = {
      timestamp: new Date().toLocaleTimeString(),
      preprocess,
      intent,
      entities,
      topMatches: [],
      thresholdUsed: confidenceThreshold,
      passedThreshold: true,
      isAmbiguous: false,
      previousState,
      nextState: 'IN_DECISION_TREE',
      contextUsed: {
        resolvedPronoun: false,
        activeTreeId: tree.id,
        activeNodeId: rootNode.id
      },
      decisionReason: `Launched guided Decision Tree "${tree.title}" at root node.`,
      executionTimeMs: Number((performance.now() - startTime).toFixed(2))
    };

    return {
      botMessage: {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `[Guided Decision Tree: ${tree.title}]\n${rootNode.prompt}`,
        timestamp: trace.timestamp,
        sourceReference: tree.syllabusModule,
        decisionTreeOptions: rootNode.options,
        quickReplies: ['Reset flow'],
        trace
      },
      updatedContext: {
        ...currentContext,
        state: 'IN_DECISION_TREE',
        activeTreeId: tree.id,
        activeNodeId: rootNode.id,
        turnCount: currentContext.turnCount + 1
      }
    };
  }

  // Stage 3: Handle Greeting & Gratitude/Farewell Intents deterministically
  if (intent.intent === 'greeting' && intent.confidence >= 0.7) {
    const trace: PipelineTrace = {
      timestamp: new Date().toLocaleTimeString(),
      preprocess,
      intent,
      entities,
      topMatches: [],
      thresholdUsed: confidenceThreshold,
      passedThreshold: true,
      isAmbiguous: false,
      previousState,
      nextState: 'IDLE',
      contextUsed: { resolvedPronoun: false },
      decisionReason: 'Matched high-confidence greeting intent; returned structured onboarding welcome.',
      executionTimeMs: Number((performance.now() - startTime).toFixed(2))
    };

    return {
      botMessage: {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Hello! I am CampusMate AI, your zero-cost intelligent assistant for CSDX 142 (AI Chatbot Application). I use local NLP preprocessing, regex/gazetteer entity extraction, TF-IDF cosine similarity retrieval, and a Finite-State Dialogue Manager.',
        bulletPoints: [
          'Ask about any CSDX 142 Module (Module I to Module V) or Course Objectives (COB1–COB5).',
          'Ask deep technical questions on NLU/DST/NLG, Conversational UI, Dialogflow, spaCy, or TF-IDF.',
          'Launch an interactive Decision Tree for Exam Preparation, Chatbot Architecture, or Placements.',
          'Inspect my real-time mathematical trace in the right-hand NLP & Dialogue Inspector panel.'
        ],
        timestamp: trace.timestamp,
        sourceReference: 'CampusMate AI Onboarding Engine (Module I & II)',
        quickReplies: [
          'What are the 5 modules of CSDX 142?',
          'Explain Module IV NLP & spaCy',
          'Start Exam Prep Decision Tree',
          'How does this chatbot work?'
        ],
        trace
      },
      updatedContext: {
        ...currentContext,
        state: 'IDLE',
        turnCount: currentContext.turnCount + 1
      }
    };
  }

  if (intent.intent === 'gratitude_farewell' && intent.confidence >= 0.55) {
    const trace: PipelineTrace = {
      timestamp: new Date().toLocaleTimeString(),
      preprocess,
      intent,
      entities,
      topMatches: [],
      thresholdUsed: confidenceThreshold,
      passedThreshold: true,
      isAmbiguous: false,
      previousState,
      nextState: 'IDLE',
      contextUsed: { resolvedPronoun: false },
      decisionReason: 'Matched conversational closing/gratitude intent.',
      executionTimeMs: Number((performance.now() - startTime).toFixed(2))
    };

    return {
      botMessage: {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'You are most welcome! Best of luck with your CSDX 142 examination, project viva, and campus placements. Feel free to test the Syllabus Quiz or inspect the NLP Benchmark anytime.',
        timestamp: trace.timestamp,
        quickReplies: [
          'How to prepare for CSDX 142 exam',
          'Placement interview tips',
          'What is in Module V Future Directions?'
        ],
        trace
      },
      updatedContext: {
        ...currentContext,
        state: 'IDLE',
        turnCount: currentContext.turnCount + 1
      }
    };
  }

  // Stage 4: TF-IDF & Cosine Similarity Retrieval over Knowledge Base
  const rankedMatches = retrieveKnowledge(preprocess, entities, intent, knowledgeBase);
  const top1 = rankedMatches[0];
  const top2 = rankedMatches[1];

  const topMatchesSummary = rankedMatches.slice(0, 4).map((m) => ({
    id: m.entry.id,
    title: m.entry.title,
    category: m.entry.category,
    moduleNumber: m.entry.moduleNumber,
    tfidfScore: m.tfidfScore,
    entityBoost: m.entityBoost,
    finalScore: m.finalScore,
    matchedTerms: m.matchedTerms
  }));

  const passedThreshold = Boolean(top1 && top1.finalScore >= confidenceThreshold);

  // Ambiguity check: If query is very broad (e.g., "Tell me about module") or top-2 scores are close across different modules without an explicit module entity
  const isBroadAmbiguousQuery =
    /^(explain\s+module|tell\s+me\s+about\s+the\s+module|which\s+module|module\s+details)$/i.test(trimmed) ||
    (passedThreshold &&
      !hasExplicitModule &&
      !resolvedPronoun &&
      top1 &&
      top2 &&
      top1.finalScore < 0.42 &&
      top1.finalScore - top2.finalScore < 0.04 &&
      top1.entry.moduleNumber !== top2.entry.moduleNumber);

  if (isBroadAmbiguousQuery && top1 && top2) {
    const candidates = rankedMatches.slice(0, 3).map((m) => ({
      id: m.entry.id,
      title: m.entry.title,
      moduleNumber: m.entry.moduleNumber
    }));

    const trace: PipelineTrace = {
      timestamp: new Date().toLocaleTimeString(),
      preprocess,
      intent,
      entities,
      topMatches: topMatchesSummary,
      thresholdUsed: confidenceThreshold,
      passedThreshold: true,
      isAmbiguous: true,
      previousState,
      nextState: 'AWAITING_CLARIFICATION',
      contextUsed: {
        resolvedPronoun,
        inferredModule,
        inferredTopic
      },
      decisionReason: `Detected ambiguous query across multiple modules (Top1=${top1.finalScore} vs Top2=${top2.finalScore}). Requesting user disambiguation.`,
      executionTimeMs: Number((performance.now() - startTime).toFixed(2))
    };

    return {
      botMessage: {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Your query matches multiple syllabus topics with similar confidence scores. Which specific topic or module would you like me to explain?',
        timestamp: trace.timestamp,
        clarificationOptions: candidates,
        quickReplies: candidates.map((c) => `Explain ${c.title}`),
        trace
      },
      updatedContext: {
        ...currentContext,
        state: 'AWAITING_CLARIFICATION',
        clarificationCandidates: candidates,
        turnCount: currentContext.turnCount + 1
      }
    };
  }

  // Stage 5: High-Confidence Knowledge Base Match
  if (passedThreshold && top1) {
    const matchedEntry = top1.entry;
    const nextState = resolvedPronoun ? 'FOLLOW_UP_CONTEXT' : 'ANSWERING_KB';
    const extractedModule =
      (entities.find((e) => e.type === 'module')?.value as DialogueContext['lastModule']) ??
      matchedEntry.moduleNumber ??
      currentContext.lastModule;
    const extractedTopic =
      entities.find((e) => e.type === 'topic')?.value ?? currentContext.lastTopic;

    const trace: PipelineTrace = {
      timestamp: new Date().toLocaleTimeString(),
      preprocess,
      intent,
      entities,
      topMatches: topMatchesSummary,
      thresholdUsed: confidenceThreshold,
      passedThreshold: true,
      isAmbiguous: false,
      previousState,
      nextState,
      contextUsed: {
        resolvedPronoun,
        inferredModule,
        inferredTopic
      },
      decisionReason: resolvedPronoun
        ? `Resolved follow-up context (${inferredModule ?? inferredTopic}) and matched "${matchedEntry.title}" with score ${top1.finalScore} >= ${confidenceThreshold}.`
        : `Selected top TF-IDF + Entity match "${matchedEntry.title}" with score ${top1.finalScore} >= ${confidenceThreshold}.`,
      executionTimeMs: Number((performance.now() - startTime).toFixed(2))
    };

    return {
      botMessage: {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: matchedEntry.answer,
        bulletPoints: matchedEntry.bulletPoints,
        sourceReference: matchedEntry.sourceReference,
        isSampleData: matchedEntry.isSampleData,
        timestamp: trace.timestamp,
        quickReplies: matchedEntry.followUpSuggestions,
        trace
      },
      updatedContext: {
        ...currentContext,
        state: nextState,
        lastModule: extractedModule,
        lastCategory: matchedEntry.category,
        lastTopic: extractedTopic,
        lastEntryId: matchedEntry.id,
        clarificationCandidates: undefined,
        turnCount: currentContext.turnCount + 1
      }
    };
  }

  // Stage 6: Fallback Recovery (Score < Confidence Threshold)
  const bestScore = top1 ? top1.finalScore : 0;
  const trace: PipelineTrace = {
    timestamp: new Date().toLocaleTimeString(),
    preprocess,
    intent: {
      ...intent,
      intent: 'unknown_fallback'
    },
    entities,
    topMatches: topMatchesSummary,
    thresholdUsed: confidenceThreshold,
    passedThreshold: false,
    isAmbiguous: false,
    previousState,
    nextState: 'FALLBACK_RECOVERY',
    contextUsed: {
      resolvedPronoun,
      inferredModule,
      inferredTopic
    },
    decisionReason: `Top retrieval score (${bestScore}) is below rejection threshold (${confidenceThreshold}). Triggered safe Fallback Recovery without hallucinating.`,
    executionTimeMs: Number((performance.now() - startTime).toFixed(2))
  };

  return {
    botMessage: {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `I could not find a verified answer above the confidence threshold (${bestScore.toFixed(2)} < ${confidenceThreshold.toFixed(2)}). Because I am a deterministic local NLP + TF-IDF retrieval assistant rather than an open-domain LLM, I never fabricate or guess answers outside my academic knowledge base.`,
      bulletPoints: [
        'Try asking about CSDX 142 Modules I, II, III, IV, or V (e.g., "Explain Module IV spaCy and TF-IDF").',
        'Ask about Exam Preparation, Course Objectives (COB1–COB5), or Placement Interview guidance.',
        'You can also add custom FAQ entries directly in the "Knowledge Base" tab and ask me again!'
      ],
      sourceReference: 'Fallback Recovery Handler (Module III & IV Confidence Threshold)',
      timestamp: trace.timestamp,
      quickReplies: [
        'What are the 5 modules of CSDX 142?',
        'How to prepare for CSDX 142 exam',
        'Start Exam Prep Decision Tree',
        'Placement interview tips'
      ],
      trace
    },
    updatedContext: {
      ...currentContext,
      state: 'FALLBACK_RECOVERY',
      turnCount: currentContext.turnCount + 1
    }
  };
}

/**
 * Advances an active Decision Tree when a user clicks one of the branch buttons.
 */
export function advanceDecisionTree(
  treeId: string,
  optionLabel: string,
  nextNodeId: string | undefined,
  resolutionText: string | undefined,
  currentContext: DialogueContext
): DialogueTurnOutput {
  const startTime = performance.now();
  const tree = DECISION_TREES[treeId] ?? DECISION_TREES['exam-advisor'];
  const prep = preprocessText(optionLabel);
  const entities = extractEntities(optionLabel);
  const intent = classifyIntent(prep, entities);

  if (nextNodeId && tree.nodes[nextNodeId]) {
    const nextNode = tree.nodes[nextNodeId];
    const trace: PipelineTrace = {
      timestamp: new Date().toLocaleTimeString(),
      preprocess: prep,
      intent: { ...intent, intent: 'decision_tree_start', confidence: 0.99 },
      entities,
      topMatches: [],
      thresholdUsed: 0.22,
      passedThreshold: true,
      isAmbiguous: false,
      previousState: currentContext.state,
      nextState: 'IN_DECISION_TREE',
      contextUsed: {
        resolvedPronoun: false,
        activeTreeId: tree.id,
        activeNodeId: nextNode.id
      },
      decisionReason: `Decision Tree transition: [${tree.id}] -> node "${nextNode.id}".`,
      executionTimeMs: Number((performance.now() - startTime).toFixed(2))
    };

    return {
      botMessage: {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `[${tree.title} — ${nextNode.description ?? 'Next Step'}]\n${nextNode.prompt}`,
        timestamp: trace.timestamp,
        sourceReference: tree.syllabusModule,
        decisionTreeOptions: nextNode.options,
        quickReplies: ['Reset flow'],
        trace
      },
      updatedContext: {
        ...currentContext,
        state: 'IN_DECISION_TREE',
        activeTreeId: tree.id,
        activeNodeId: nextNode.id,
        turnCount: currentContext.turnCount + 1
      }
    };
  }

  // Leaf node resolution reached
  const trace: PipelineTrace = {
    timestamp: new Date().toLocaleTimeString(),
    preprocess: prep,
    intent: { ...intent, intent: 'decision_tree_start', confidence: 0.99 },
    entities,
    topMatches: [],
    thresholdUsed: 0.22,
    passedThreshold: true,
    isAmbiguous: false,
    previousState: currentContext.state,
    nextState: 'ANSWERING_KB',
    contextUsed: {
      resolvedPronoun: false,
      activeTreeId: tree.id,
      activeNodeId: 'LEAF_RESOLVED'
    },
    decisionReason: `Reached leaf resolution node in Decision Tree "${tree.title}". Transitioning back to ANSWERING_KB.`,
    executionTimeMs: Number((performance.now() - startTime).toFixed(2))
  };

  return {
    botMessage: {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: resolutionText ?? 'Decision tree completed.',
      timestamp: trace.timestamp,
      sourceReference: `${tree.title} — Leaf Resolution`,
      quickReplies: [
        'Explain Module I Dialogue Systems',
        'Explain Module IV NLP for Chatbots',
        'Start Exam Prep Decision Tree'
      ],
      trace
    },
    updatedContext: {
      ...currentContext,
      state: 'ANSWERING_KB',
      activeTreeId: undefined,
      activeNodeId: undefined,
      turnCount: currentContext.turnCount + 1
    }
  };
}
