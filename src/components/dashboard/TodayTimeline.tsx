import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowRight, LayoutGrid, Table as TableIcon, Users, Clock, MapPin, Search, Filter } from 'lucide-react';

export function TodayTimeline() {
  const { tasks, replanResult, setActiveNav, language } = useApp();

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const displayTasks = tasks.map(t => {
    const rec = replanResult?.recommendedTasks.find(r => r.id === t.id);
    return rec || t;
  });

  const filteredTasks = displayTasks.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (searchQuery.trim() && !t.name.toLowerCase().includes(searchQuery.toLowerCase()) && !t.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const counts = {
    all: displayTasks.length,
    reschedule: displayTasks.filter(t => t.status === 'reschedule').length,
    restricted: displayTasks.filter(t => t.status === 'restricted').length,
    continue: displayTasks.filter(t => t.status === 'continue').length,
    protect: displayTasks.filter(t => t.status === 'protect').length
  };

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl shadow-tactile overflow-hidden transition-all">
      {/* Top Header & View Controls */}
      <div className="p-4 sm:p-5 border-b border-[#E2E8F0] dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-black text-[#0F172A] dark:text-[#F8FAFC]">
            {language === 'hi' ? 'आज का कार्य कार्यक्रम' : "Today's Shift Schedule"}
          </h3>
          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#FEF08A] text-[#854D0E] dark:bg-[#422006] dark:text-[#FACC15] border border-[#EAB308] dark:border-[#854D0E] shadow-xs">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'}
          </span>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks..."
              className="text-xs pl-8 pr-2.5 py-1.5 rounded-lg bg-[#FFFFFF] dark:bg-[#07111C] border-2 border-[#CBD5E1] dark:border-[#334155] text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#CA8A04] w-36 sm:w-44 shadow-xs"
            />
          </div>

          {/* Toggle Button Group */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#F8F9FA] dark:bg-[#07111C] border-2 border-[#CBD5E1] dark:border-[#334155] shadow-xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-black transition cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#FACC15] text-[#0F172A] border border-[#CA8A04] shadow-xs'
                  : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-black transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#FACC15] text-[#0F172A] border border-[#CA8A04] shadow-xs'
                  : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A]'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <button
            onClick={() => setActiveNav('replan')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-[#0F172A] bg-[#FACC15] hover:bg-[#EAB308] border border-[#CA8A04] transition cursor-pointer shrink-0 shadow-xs"
          >
            <span>{language === 'hi' ? 'रीप्लान देखें' : 'View Replan'}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="px-4 py-2 bg-[#F8F9FA] dark:bg-[#07111C] border-b border-[#E2E8F0] dark:border-[#334155] flex items-center gap-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer shrink-0 shadow-xs ${
            filterStatus === 'all'
              ? 'bg-[#0F172A] text-white dark:bg-[#FACC15] dark:text-[#0F172A]'
              : 'text-[#475569] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B]'
          }`}
        >
          All Tasks ({counts.all})
        </button>
        {counts.reschedule > 0 && (
          <button
            onClick={() => setFilterStatus('reschedule')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer shrink-0 shadow-xs ${
              filterStatus === 'reschedule'
                ? 'bg-[#FACC15] text-[#0F172A] border border-[#CA8A04]'
                : 'text-[#854D0E] bg-[#FEF08A] dark:bg-[#422006] dark:text-[#FACC15] border border-[#EAB308] dark:border-[#854D0E]'
            }`}
          >
            Rescheduled ({counts.reschedule})
          </button>
        )}
        {counts.restricted > 0 && (
          <button
            onClick={() => setFilterStatus('restricted')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer shrink-0 shadow-xs ${
              filterStatus === 'restricted'
                ? 'bg-[#DC2626] text-white'
                : 'text-[#991B1B] bg-[#FEE2E2] dark:bg-[#451A1A] border border-[#FCA5A5] dark:border-[#7F1D1D]'
            }`}
          >
            Restricted ({counts.restricted})
          </button>
        )}
        {counts.continue > 0 && (
          <button
            onClick={() => setFilterStatus('continue')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer shrink-0 shadow-xs ${
              filterStatus === 'continue'
                ? 'bg-[#16A34A] text-white'
                : 'text-[#166534] bg-[#DCFCE7] dark:bg-[#064E3B] border border-[#86EFAC] dark:border-[#065F46]'
            }`}
          >
            Continue ({counts.continue})
          </button>
        )}
      </div>

      {/* VIEW MODE 1: APP CARDS (DEFAULT OPERATIONAL APK FEEL) */}
      {viewMode === 'cards' && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredTasks.map((task) => {
            const isRestricted = task.status === 'restricted';
            const isShifted = Boolean(task.recommendedStartTime && task.recommendedStartTime !== task.originalStartTime);

            return (
              <div
                key={task.id}
                className="p-4 rounded-xl border-2 border-[#CBD5E1] dark:border-[#334155] bg-[#FFFFFF] dark:bg-[#07111C] hover:border-[#CA8A04] dark:hover:border-[#FACC15] transition-all flex flex-col justify-between space-y-3 shadow-xs"
              >
                {/* Header: Title + Status Pill */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm text-[#0F172A] dark:text-[#F8FAFC]">
                        {task.name}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#F1F5F9] dark:bg-[#1E293B] text-[#334155] dark:text-[#94A3B8] border border-[#CBD5E1] dark:border-[#475569]">
                        {task.indoorOutdoor}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#475569] dark:text-[#94A3B8] font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#CA8A04] dark:text-[#FACC15]" />
                        <span>{task.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8]" />
                        <span>{task.workers} crew</span>
                      </span>
                      <span>• {task.duration}h</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <StatusBadge status={task.status} size="sm" />
                  </div>
                </div>

                {/* Timing Bar / Slot Pill */}
                <div className="p-2.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0B1522] border-2 border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[#475569] dark:text-[#94A3B8] font-semibold">
                    <Clock className="w-3.5 h-3.5 text-[#CA8A04] dark:text-[#FACC15]" />
                    <span>Planned: {task.originalStartTime}–{task.originalEndTime}</span>
                  </div>

                  <div>
                    {isRestricted ? (
                      <span className="text-xs font-black text-[#DC2626] dark:text-[#F87171] uppercase">
                        STANDBY (CURBED)
                      </span>
                    ) : isShifted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded bg-[#FEF08A] text-[#854D0E] dark:bg-[#422006] dark:text-[#FACC15] border border-[#EAB308] dark:border-[#854D0E]">
                        <span>Shifted:</span>
                        <span>{task.recommendedStartTime}–{task.recommendedEndTime}</span>
                      </span>
                    ) : (
                      <span className="text-xs font-black text-[#166534] dark:text-[#4ADE80]">
                        Confirmed: {task.originalStartTime}–{task.originalEndTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: ENTERPRISE DATA TABLE */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#07111C] text-[#64748B] dark:text-[#94A3B8] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Task</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Crew</th>
                <th className="py-3 px-4">Planned Slot</th>
                <th className="py-3 px-4">Optimized Slot</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
              {filteredTasks.map((task) => {
                const isRestricted = task.status === 'restricted';
                const isShifted = Boolean(task.recommendedStartTime && task.recommendedStartTime !== task.originalStartTime);

                return (
                  <tr key={task.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#0B1522] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                      <div className="flex items-center gap-2">
                        <span>{task.name}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B]">
                          {task.indoorOutdoor}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#64748B] dark:text-[#94A3B8]">{task.location}</td>
                    <td className="py-3 px-4 font-mono text-[#0F172A] dark:text-[#F8FAFC]">{task.workers} workers</td>
                    <td className="py-3 px-4 font-mono text-[#64748B] dark:text-[#94A3B8]">{task.originalStartTime}–{task.originalEndTime}</td>
                    <td className="py-3 px-4 font-mono font-semibold">
                      {isRestricted ? (
                        <span className="text-[#DC2626]">STANDBY</span>
                      ) : isShifted ? (
                        <span className="text-[#D97706]">{task.recommendedStartTime}–{task.recommendedEndTime}</span>
                      ) : (
                        <span className="text-[#16A34A]">{task.originalStartTime}–{task.originalEndTime}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={task.status} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
