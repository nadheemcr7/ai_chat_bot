import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Briefcase,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { SYLLABUS_QUIZ_QUESTIONS, PLACEMENT_INTERVIEW_QUESTIONS } from '../data/quizAndInterview';

export const QuizAndInterviewView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'quiz' | 'interview'>('quiz');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('ALL');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [expandedInterviewId, setExpandedInterviewId] = useState<string>(
    PLACEMENT_INTERVIEW_QUESTIONS[0].id
  );
  const [practiceNotes, setPracticeNotes] = useState<Record<string, string>>({});

  const filteredQuestions =
    selectedModuleFilter === 'ALL'
      ? SYLLABUS_QUIZ_QUESTIONS
      : SYLLABUS_QUIZ_QUESTIONS.filter((q) => q.moduleNumber === selectedModuleFilter);

  const totalAnswered = Object.keys(userAnswers).length;
  const totalCorrect = SYLLABUS_QUIZ_QUESTIONS.filter(
    (q) => userAnswers[q.id] !== undefined && userAnswers[q.id] === q.correctIndex
  ).length;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setRevealedAnswers((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setRevealedAnswers({});
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header & Mode Switch */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span>Active Recall &amp; Career Readiness</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>CSDX 142 Modules I–V</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Syllabus Quiz &amp; Placement Interview Simulator
          </h1>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setActiveSubTab('quiz')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeSubTab === 'quiz'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            CSDX 142 Syllabus Quiz (10 Qs)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('interview')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeSubTab === 'interview'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Placement Interview Practice (6 Scenarios)
          </button>
        </div>
      </section>

      {activeSubTab === 'quiz' ? (
        <div className="space-y-6">
          {/* Quiz Filter & Live Score Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {['ALL', 'Module I', 'Module II', 'Module III', 'Module IV', 'Module V'].map((mod) => (
                <button
                  key={mod}
                  type="button"
                  onClick={() => setSelectedModuleFilter(mod)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    selectedModuleFilter === mod
                      ? 'bg-sky-600 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {mod === 'ALL' ? 'All Modules (10)' : mod}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Score: </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {totalCorrect} / {SYLLABUS_QUIZ_QUESTIONS.length}
                </span>
                <span className="text-slate-500 dark:text-slate-400"> ({totalAnswered} answered)</span>
              </div>
              <button
                type="button"
                onClick={handleResetQuiz}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Quiz
              </button>
            </div>
          </div>

          {/* Quiz Questions List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredQuestions.map((q, index) => {
              const selectedIdx = userAnswers[q.id];
              const isRevealed = revealedAnswers[q.id];
              const isCorrect = selectedIdx === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <span>
                        {q.moduleNumber} · {q.difficulty}
                      </span>
                      <span>Question #{index + 1}</span>
                    </div>

                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {q.question}
                    </h2>

                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isThisSelected = selectedIdx === optIdx;
                        const isThisCorrect = q.correctIndex === optIdx;

                        let btnStyle =
                          'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-sky-400';
                        if (isRevealed) {
                          if (isThisCorrect) {
                            btnStyle =
                              'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                          } else if (isThisSelected && !isThisCorrect) {
                            btnStyle =
                              'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors flex items-start justify-between gap-3 ${btnStyle}`}
                          >
                            <span>
                              <strong className="font-mono mr-2">
                                {String.fromCharCode(65 + optIdx)}.
                              </strong>
                              {opt}
                            </span>
                            {isRevealed && isThisCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            )}
                            {isRevealed && isThisSelected && !isThisCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {isRevealed && (
                    <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {isCorrect ? 'Correct Answer!' : 'Explanation & Syllabus Concept:'}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Placement Mock Interview Practice Simulator */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-2.5">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Select an Interview Prompt to Practice:
            </div>
            {PLACEMENT_INTERVIEW_QUESTIONS.map((item, idx) => {
              const isSelected = item.id === expandedInterviewId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setExpandedInterviewId(item.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    isSelected
                      ? 'bg-sky-50/90 dark:bg-sky-950/70 border-sky-500 dark:border-sky-400'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-mono text-sky-700 dark:text-sky-300 mb-1">
                    Scenario 0{idx + 1} · {item.track}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {item.question}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            {PLACEMENT_INTERVIEW_QUESTIONS.filter((i) => i.id === expandedInterviewId).map((activeItem) => (
              <div
                key={activeItem.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-5"
              >
                <div>
                  <div className="text-xs font-mono text-sky-700 dark:text-sky-300 mb-1">
                    {activeItem.track}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {activeItem.question}
                  </h2>
                </div>

                {/* Student Practice Input */}
                <div className="space-y-2">
                  <label
                    htmlFor="interview-practice-textarea"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Draft Your Spoken / Written Answer Before Checking the Rubric:
                  </label>
                  <textarea
                    id="interview-practice-textarea"
                    rows={3}
                    value={practiceNotes[activeItem.id] ?? ''}
                    onChange={(e) =>
                      setPracticeNotes((prev) => ({ ...prev, [activeItem.id]: e.target.value }))
                    }
                    placeholder="Type key points you would mention to the interviewer..."
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg"
                  />
                </div>

                {/* Evaluation Rubric Checkpoints */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Key Engineering Concepts Interviewers Look For:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                    {activeItem.keyConceptsToMention.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                {/* Model Strong Answer */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    Model Strong Answer (STAR / Technical Structure):
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {activeItem.sampleStrongAnswer}
                  </p>
                </div>

                {/* Follow-up Probe */}
                <div className="p-3.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-semibold">Typical Recruiter Follow-Up Probe: </span>
                  {activeItem.followUpProbe}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
