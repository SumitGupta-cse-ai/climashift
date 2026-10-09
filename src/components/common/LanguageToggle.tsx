import React from 'react';
import { useApp } from '@/context/AppContext';

export function LanguageToggle() {
  const { language, setLanguage } = useApp();

  return (
    <div 
      className="inline-flex items-center p-1 rounded-lg bg-[#F7F8FA] dark:bg-[#07111C] border border-[#E4E7EC] dark:border-[#26384C]"
      role="group"
      aria-label="Language selection"
    >
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-[#FFFFFF] dark:bg-[#122235] text-[#16B878] font-bold shadow-xs border border-[#E4E7EC] dark:border-[#26384C]'
            : 'text-[#667085] dark:text-[#A7B2C1] hover:text-[#171A1F] dark:hover:text-[#F5F7FA]'
        }`}
        title="Switch to English"
      >
        <span>English</span>
      </button>

      <button
        onClick={() => setLanguage('hi')}
        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
          language === 'hi'
            ? 'bg-[#FFFFFF] dark:bg-[#122235] text-[#16B878] font-bold shadow-xs border border-[#E4E7EC] dark:border-[#26384C]'
            : 'text-[#667085] dark:text-[#A7B2C1] hover:text-[#171A1F] dark:hover:text-[#F5F7FA]'
        }`}
        title="हिंदी में बदलें (Switch to Hindi)"
      >
        <span>हिंदी</span>
      </button>
    </div>
  );
}
