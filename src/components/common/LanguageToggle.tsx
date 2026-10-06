import React from 'react';
import { useApp } from '@/context/AppContext';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useApp();

  return (
    <div 
      className="inline-flex items-center p-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-slate-700/80 shadow-xs"
      role="group"
      aria-label="Language selection"
    >
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all min-h-[34px] cursor-pointer ${
          language === 'en'
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
        title="Switch to English"
      >
        <span>EN</span>
      </button>

      <button
        onClick={() => setLanguage('hi')}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all min-h-[34px] cursor-pointer ${
          language === 'hi'
            ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
        title="हिंदी में बदलें (Switch to Hindi)"
      >
        <span>हिंदी</span>
      </button>
    </div>
  );
}
