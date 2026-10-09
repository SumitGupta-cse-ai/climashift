import React from 'react';
import { useApp, ThemeMode } from '@/context/AppContext';
import { Sun, Moon, Laptop } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useApp();

  const options: { mode: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: 'light', label: 'Light', icon: Sun },
    { mode: 'dark', label: 'Dark', icon: Moon },
    { mode: 'system', label: 'System', icon: Laptop },
  ];

  return (
    <div 
      className="inline-flex items-center p-1 rounded-lg bg-[#F7F8FA] dark:bg-[#07111C] border border-[#E4E7EC] dark:border-[#26384C]"
      role="radiogroup" 
      aria-label="Theme selection"
    >
      {options.map(({ mode, label, icon: Icon }) => {
        const isActive = theme === mode;
        return (
          <button
            key={mode}
            onClick={() => setTheme(mode)}
            role="radio"
            aria-checked={isActive}
            aria-label={`${label} theme`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              isActive
                ? 'bg-[#FFFFFF] dark:bg-[#122235] text-[#16B878] font-semibold shadow-xs border border-[#E4E7EC] dark:border-[#26384C]'
                : 'text-[#667085] dark:text-[#A7B2C1] hover:text-[#171A1F] dark:hover:text-[#F5F7FA]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
