import React from 'react';
import { Radio, AlertCircle } from 'lucide-react';

interface DataFreshnessBadgeProps {
  lastUpdated: string;
  isDemoData: boolean;
  dataSource?: string;
}

export function DataFreshnessBadge({ lastUpdated, isDemoData, dataSource }: DataFreshnessBadgeProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {isDemoData ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>DEMO / FALLBACK DATA</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>LIVE TELEMETRY</span>
        </span>
      )}

      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
        <Radio className="w-3 h-3 text-slate-400 shrink-0" />
        <span>Updated {lastUpdated}</span>
      </span>

      {dataSource && (
        <span className="text-slate-400 dark:text-slate-500 hidden sm:inline-block truncate max-w-[200px]" title={dataSource}>
          • {dataSource}
        </span>
      )}
    </div>
  );
}
