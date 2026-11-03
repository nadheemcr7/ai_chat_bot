import React, { useState } from 'react';
import {
  Search,
  Plus,
  Download,
  Upload,
  Trash2,
  Play,
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { KnowledgeCategory, KnowledgeEntry } from '../types/chatbot';

interface KnowledgeBaseViewProps {
  entries: KnowledgeEntry[];
  onAddEntry: (entry: KnowledgeEntry) => void;
  onDeleteCustomEntry: (id: string) => void;
  onImportEntries: (entries: KnowledgeEntry[]) => void;
  onAskInChat: (query: string) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  entries,
  onAddEntry,
  onDeleteCustomEntry,
  onImportEntries,
  onAskInChat
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Entry Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeCategory>('college_faq');
  const [newModule, setNewModule] = useState<KnowledgeEntry['moduleNumber']>('General');
  const [newPatterns, setNewPatterns] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newSource, setNewSource] = useState('Custom Student Knowledge Entry [Sample/Demo Data]');
  const [newIsSample, setNewIsSample] = useState(true);

  const filteredEntries = entries.filter((entry) => {
    const matchesCat = categoryFilter === 'ALL' || entry.category === categoryFilter;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesCat;
    return (
      matchesCat &&
      (entry.title.toLowerCase().includes(q) ||
        entry.answer.toLowerCase().includes(q) ||
        entry.keywords.some((k) => k.toLowerCase().includes(q)) ||
        (entry.moduleNumber ?? '').toLowerCase().includes(q))
    );
  });

  const handleCreateCustomEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAnswer.trim() || !newKeywords.trim()) {
      setStatusBanner({
        type: 'error',
        text: 'Please provide at least a Title, Keywords, and Answer before saving.'
      });
      return;
    }

    const created: KnowledgeEntry = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      moduleNumber: newModule,
      questionPatterns: newPatterns
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      keywords: newKeywords
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
      answer: newAnswer.trim(),
      followUpSuggestions: ['What are the 5 modules of CSDX 142?'],
      sourceReference: newSource.trim() || 'Custom Student Knowledge Base Entry',
      isSampleData: newIsSample,
      isCustom: true
    };

    onAddEntry(created);
    setNewTitle('');
    setNewPatterns('');
    setNewKeywords('');
    setNewAnswer('');
    setShowAddForm(false);
    setStatusBanner({
      type: 'success',
      text: `Added "${created.title}" to the local Knowledge Base! You can immediately query it in the Chat tab.`
    });
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'campusmate-csdx142-knowledge-base.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(String(event.target?.result));
        if (!Array.isArray(parsed)) {
          throw new Error('JSON file must contain an array of KnowledgeEntry objects.');
        }
        const validEntries: KnowledgeEntry[] = parsed
          .filter((item) => item && typeof item.title === 'string' && typeof item.answer === 'string')
          .map((item, idx) => ({
            id: item.id || `imported-${Date.now()}-${idx}`,
            title: item.title,
            category: item.category || 'college_faq',
            moduleNumber: item.moduleNumber || 'General',
            questionPatterns: Array.isArray(item.questionPatterns) ? item.questionPatterns : [item.title],
            keywords: Array.isArray(item.keywords)
              ? item.keywords
              : item.title.toLowerCase().split(/\s+/),
            answer: item.answer,
            bulletPoints: Array.isArray(item.bulletPoints) ? item.bulletPoints : undefined,
            followUpSuggestions: Array.isArray(item.followUpSuggestions)
              ? item.followUpSuggestions
              : ['What are the 5 modules of CSDX 142?'],
            sourceReference: item.sourceReference || 'Imported JSON Knowledge File [Sample Data]',
            isSampleData: item.isSampleData ?? true,
            isCustom: true
          }));

        if (validEntries.length === 0) {
          throw new Error('No valid entries with "title" and "answer" fields found.');
        }

        onImportEntries(validEntries);
        setStatusBanner({
          type: 'success',
          text: `Successfully imported ${validEntries.length} knowledge base entries!`
        });
      } catch (err) {
        setStatusBanner({
          type: 'error',
          text: err instanceof Error ? err.message : 'Invalid JSON file format.'
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header & Actions */}
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span>Module II &amp; IV Data Sources</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span className="font-mono tabular-nums">{entries.length} Structured Documents Indexed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Local JSON Knowledge Base &amp; Training Corpus
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
            Inspect the structured documents ranked by our TF-IDF vectorizer. All sample college rules are explicitly tagged as demo data. Add custom entries or import a JSON file to expand the bot&apos;s knowledge immediately.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start">
          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:text-slate-950 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            {showAddForm ? 'Close Entry Form' : 'Add Custom FAQ Entry'}
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>

          <label className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImportJsonFile}
              className="sr-only"
            />
          </label>
        </div>
      </section>

      {/* Status Notification */}
      {statusBanner && (
        <div
          role="status"
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            statusBanner.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusBanner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusBanner.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="underline font-medium shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Add Custom Knowledge Entry Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateCustomEntry}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4"
        >
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Add New Knowledge Base Document (Indexed Live by TF-IDF)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              New entries are persisted in browser localStorage and immediately included in TF-IDF cosine ranking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label htmlFor="kb-title-input" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Document Title *
              </label>
              <input
                id="kb-title-input"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Sample Dept Lab Project Submission Rules"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label htmlFor="kb-category-select" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                id="kb-category-select"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as KnowledgeCategory)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              >
                <option value="college_faq">College FAQ (Sample Data)</option>
                <option value="syllabus">CSDX 142 Syllabus</option>
                <option value="exam_prep">Exam Preparation</option>
                <option value="placement">Placement Guidance</option>
                <option value="terminology">Academic Terminology</option>
              </select>
            </div>

            <div>
              <label htmlFor="kb-module-select" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Associated Module
              </label>
              <select
                id="kb-module-select"
                value={newModule}
                onChange={(e) => setNewModule(e.target.value as KnowledgeEntry['moduleNumber'])}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              >
                <option value="General">General / Cross-Module</option>
                <option value="Module I">Module I</option>
                <option value="Module II">Module II</option>
                <option value="Module III">Module III</option>
                <option value="Module IV">Module IV</option>
                <option value="Module V">Module V</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label htmlFor="kb-keywords-input" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Comma-Separated Keywords * (Used for TF-IDF &amp; Overlap)
              </label>
              <input
                id="kb-keywords-input"
                type="text"
                value={newKeywords}
                onChange={(e) => setNewKeywords(e.target.value)}
                placeholder="e.g., capstone, deadline, rubric, demo, submission"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>

            <div>
              <label htmlFor="kb-source-input" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Source Reference Citation
              </label>
              <input
                id="kb-source-input"
                type="text"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="text-xs">
            <label htmlFor="kb-answer-input" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Verified Response Answer *
            </label>
            <textarea
              id="kb-answer-input"
              rows={3}
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write the authoritative answer that CampusMate AI should return when this entry is retrieved..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={newIsSample}
                onChange={(e) => setNewIsSample(e.target.checked)}
                className="rounded accent-sky-600"
              />
              <span>Label this entry as [Sample Demo Data] in chat responses</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:text-slate-950 rounded-lg transition-colors"
              >
                Save to Knowledge Base
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <label htmlFor="kb-search-input" className="sr-only">
            Search knowledge base entries
          </label>
          <input
            id="kb-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, module, keyword, or concept (e.g., spacy, dialogflow, attendance)..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: 'All Entries' },
            { id: 'syllabus', label: 'Syllabus (Mod I–V)' },
            { id: 'objectives', label: 'Objectives (COBs)' },
            { id: 'exam_prep', label: 'Exam Prep' },
            { id: 'placement', label: 'Placement' },
            { id: 'college_faq', label: 'Sample College FAQs' },
            { id: 'terminology', label: 'Terminology' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                categoryFilter === cat.id
                  ? 'bg-sky-600 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Base Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredEntries.map((entry) => (
          <article
            key={entry.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              {/* Unboxed Metadata Line */}
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <div>
                  <span>{entry.moduleNumber ?? 'General'}</span>
                  <span aria-hidden="true" className="mx-1.5">·</span>
                  <span>{entry.category}</span>
                  {entry.isSampleData && (
                    <>
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      <span className="text-amber-700 dark:text-amber-400 font-semibold">
                        Sample Demo Data
                      </span>
                    </>
                  )}
                </div>
                <span>ID: {entry.id}</span>
              </div>

              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {entry.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {entry.answer}
              </p>

              {entry.bulletPoints && entry.bulletPoints.length > 0 && (
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                  {entry.bulletPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="font-mono text-slate-500 dark:text-slate-400 truncate">
                <span className="font-sans font-semibold text-slate-700 dark:text-slate-300">
                  TF-IDF Keywords:{' '}
                </span>
                {entry.keywords.join(', ')}
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400 truncate">
                  Source: {entry.sourceReference}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  {entry.isCustom && (
                    <button
                      type="button"
                      onClick={() => onDeleteCustomEntry(entry.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      onAskInChat(entry.questionPatterns[0] ?? `Explain ${entry.title}`)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 hover:bg-sky-100 dark:hover:bg-sky-900 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Play className="w-3 h-3" />
                    Test in Chat
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
