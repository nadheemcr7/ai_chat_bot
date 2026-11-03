import React from 'react';

export type ActiveTab =
  | 'chat'
  | 'how-it-works'
  | 'quiz'
  | 'knowledge-base'
  | 'analytics';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onRunDemoQuery: () => void;
}

const NAV_ITEMS: { id: ActiveTab; label: string }[] = [
  { id: 'chat', label: 'Chat' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'quiz', label: 'Quiz & Prep' },
  { id: 'knowledge-base', label: 'Knowledge Base' },
  { id: 'analytics', label: 'Benchmark' }
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onRunDemoQuery
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('chat')}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 text-left focus-visible:outline-2 focus-visible:outline-sky-600 cursor-pointer"
        >
          CampusMate AI
        </button>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-sky-600 dark:border-sky-400 text-slate-900 dark:text-slate-100 font-semibold'
                    : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onRunDemoQuery}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
          >
            Run Demo Query
          </button>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <nav
        aria-label="Mobile Navigation"
        className="flex md:hidden items-center gap-4 overflow-x-auto px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 text-xs font-medium text-slate-600 dark:text-slate-400"
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            activeTab === item.id ||
            (item.id === 'analytics' && activeTab === 'knowledge-base');
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`py-1 whitespace-nowrap shrink-0 border-b-2 ${
                isActive
                  ? 'border-sky-600 dark:border-sky-400 text-slate-900 dark:text-slate-100 font-semibold'
                  : 'border-transparent'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
