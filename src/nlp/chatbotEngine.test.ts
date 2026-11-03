import test from 'node:test';
import assert from 'node:assert/strict';
import { preprocessText, stemWord } from './preprocessor';
import { extractEntities } from './entityExtractor';
import { classifyIntent } from './intentClassifier';
import { retrieveKnowledge } from './retriever';
import { INITIAL_KNOWLEDGE_BASE } from '../data/knowledgeBase';
import { EVALUATION_DATASET } from '../data/evaluationDataset';
import {
  INITIAL_DIALOGUE_CONTEXT,
  processUserMessage,
  advanceDecisionTree
} from '../dialogue/dialogueManager';

test('NLP Preprocessor: expands contractions, strips punctuation, removes stop-words, and preserves Roman numerals after module', () => {
  const res = preprocessText("What's covered in Module IV regarding TF-IDF and spaCy's pipelines?");
  assert.equal(res.normalized.includes('what is'), true);
  assert.equal(res.filteredTokens.includes('module'), true);
  assert.equal(res.filteredTokens.includes('iv'), true);
  assert.equal(res.filteredTokens.includes('tfidf'), true);
  assert.equal(res.removedStopWords.includes('what'), true);
  assert.equal(res.removedStopWords.includes('in'), true);
  assert.equal(stemWord('deploying'), 'deploy');
});

test('Entity Extractor: extracts Module I-V (numeric, Roman, word), CSDX 142, COBs, and technical topics', () => {
  const entities1 = extractEntities('Explain Module 4 spaCy pipeline and TF-IDF in CSDX 142 for COB4');
  const types1 = entities1.map((e) => `${e.type}:${e.value}`);
  assert.equal(types1.includes('module:Module IV'), true);
  assert.equal(types1.includes('course_code:CSDX 142'), true);
  assert.equal(types1.includes('cob:COB4'), true);
  assert.equal(types1.includes('topic:spaCy'), true);
  assert.equal(types1.includes('topic:TF-IDF & Cosine Similarity'), true);

  const entities2 = extractEntities('What is in the third module about Dialogflow?');
  const types2 = entities2.map((e) => `${e.type}:${e.value}`);
  assert.equal(types2.includes('module:Module III'), true);
  assert.equal(types2.includes('topic:Dialogflow'), true);
});

test('Intent Classifier: accurately classifies greetings, syllabus queries, exam prep, placements, and out-of-domain queries', () => {
  const gPrep = preprocessText('Hello CampusMate! Good morning');
  const gIntent = classifyIntent(gPrep, extractEntities(gPrep.original));
  assert.equal(gIntent.intent, 'greeting');
  assert.equal(gIntent.confidence >= 0.75, true);

  const sPrep = preprocessText('Explain Module III Dialogflow intents and webhook fulfillment');
  const sIntent = classifyIntent(sPrep, extractEntities(sPrep.original));
  assert.equal(sIntent.intent, 'syllabus_query');
  assert.equal(sIntent.confidence >= 0.65, true);

  const uPrep = preprocessText('Who won the cricket match yesterday in Mumbai?');
  const uIntent = classifyIntent(uPrep, extractEntities(uPrep.original));
  assert.equal(uIntent.intent, 'unknown_fallback');
});

test('TF-IDF Retriever: ranks specific module and topic entries at #1 above threshold', () => {
  const raw = 'Explain spaCy pipeline stages tok2vec tagger parser ner in Module IV';
  const prep = preprocessText(raw);
  const ents = extractEntities(raw);
  const intent = classifyIntent(prep, ents);
  const matches = retrieveKnowledge(prep, ents, intent, INITIAL_KNOWLEDGE_BASE);

  assert.equal(matches.length > 0, true);
  assert.equal(matches[0].entry.moduleNumber, 'Module IV');
  assert.equal(matches[0].finalScore >= 0.45, true);
});

test('Dialogue Manager FSM: handles empty input, multi-turn pronoun coreference, decision tree transitions, and fallback', () => {
  // 1. Empty / whitespace input
  const emptyTurn = processUserMessage('   ', INITIAL_DIALOGUE_CONTEXT, INITIAL_KNOWLEDGE_BASE);
  assert.equal(emptyTurn.updatedContext.state, 'IDLE');
  assert.equal(emptyTurn.botMessage.trace?.passedThreshold, false);

  // 2. Turn 1: Ask about Module IV
  const turn1 = processUserMessage(
    'Explain Module IV NLP for Chatbots',
    INITIAL_DIALOGUE_CONTEXT,
    INITIAL_KNOWLEDGE_BASE
  );
  assert.equal(turn1.updatedContext.state, 'ANSWERING_KB');
  assert.equal(turn1.updatedContext.lastModule, 'Module IV');

  // 3. Turn 2: Follow-up using pronoun "it" ("What are the spacy pipeline components in it?")
  const turn2 = processUserMessage(
    'What are the spacy pipeline components in it?',
    turn1.updatedContext,
    INITIAL_KNOWLEDGE_BASE
  );
  assert.equal(turn2.botMessage.trace?.contextUsed.resolvedPronoun, true);
  assert.equal(turn2.botMessage.trace?.contextUsed.inferredModule, 'Module IV');
  assert.equal(turn2.updatedContext.state, 'FOLLOW_UP_CONTEXT');

  // 4. Decision Tree launch & branch advancement
  const treeStart = processUserMessage(
    'Start a guided decision tree flow for exam prep',
    turn2.updatedContext,
    INITIAL_KNOWLEDGE_BASE
  );
  assert.equal(treeStart.updatedContext.state, 'IN_DECISION_TREE');
  assert.equal(treeStart.updatedContext.activeTreeId, 'exam-advisor');

  const treeStep = advanceDecisionTree(
    'exam-advisor',
    'Last-minute revision (< 24 hours)',
    'urgent',
    undefined,
    treeStart.updatedContext
  );
  assert.equal(treeStep.updatedContext.state, 'IN_DECISION_TREE');
  assert.equal(treeStep.updatedContext.activeNodeId, 'urgent');

  // 5. Out-of-domain query triggers FALLBACK_RECOVERY
  const fallbackTurn = processUserMessage(
    'What is the stock price of Tesla and weather in Tokyo?',
    INITIAL_DIALOGUE_CONTEXT,
    INITIAL_KNOWLEDGE_BASE
  );
  assert.equal(fallbackTurn.updatedContext.state, 'FALLBACK_RECOVERY');
  assert.equal(fallbackTurn.botMessage.trace?.passedThreshold, false);
});

test('Evaluation Dataset Benchmark: achieves 100% (16/16) intent accuracy across all test cases', () => {
  let passedCount = 0;
  const mismatches: string[] = [];

  for (const testCase of EVALUATION_DATASET) {
    const turn = processUserMessage(
      testCase.query,
      INITIAL_DIALOGUE_CONTEXT,
      INITIAL_KNOWLEDGE_BASE
    );
    const predictedIntent = turn.botMessage.trace?.intent.intent;
    if (predictedIntent === testCase.expectedIntent) {
      passedCount++;
    } else {
      mismatches.push(`${testCase.id}: expected ${testCase.expectedIntent}, got ${predictedIntent}`);
    }
  }

  assert.equal(
    passedCount,
    EVALUATION_DATASET.length,
    `Expected 16/16 evaluation dataset accuracy, got ${passedCount}/${EVALUATION_DATASET.length}. Mismatches: ${mismatches.join('; ')}`
  );
});
