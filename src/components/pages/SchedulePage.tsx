'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowRight, 
  Search, 
  Filter, 
  LayoutGrid, 
  Table as TableIcon,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export function SchedulePage() {
  const { tasks, replanResult, setActiveNav, language, siteProfile } = useApp();

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [filterTrade, setFilterTrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const displayTasks = tasks.map(t => {
    const rec = replanResult?.recommendedTasks.find(r => r.id === t.id);
    return rec || t;
  });

  const filteredTasks = displayTasks.filter(t => {
    if (filterTrade !== 'all' && t.status !== filterTrade) return false;
    if (searchQuery.trim() && 
        !t.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !t.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const rescheduledCount = displayTasks.filter(t => t.status === 'reschedule').length;
  const restrictedCount = displayTasks.filter(t => t.status === 'restricted').length;
  const continueCount = displayTasks.filter(t => t.status === 'continue').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Visual Hero Banner with Generated AI Image */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#CBD5E1] dark:border-[#334155] shadow-tactile bg-[#0F172A]">
        <div className="relative h-60 sm:h-64 w-full">
          <Image
            src="/images/crane-sunrise.jpg"
            alt="Tower Crane at Golden Hour Sunrise"
            fill
            priority
            className="object-cover opacity-85 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>
        </div>

        {/* Floating Content Over Banner */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5 text-white">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#FACC15] text-[#0F172A] font-black text-[10px] px-2 uppercase shadow-xs">
                DAILY DISPATCH BOARD
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {siteProfile.name} • Shift 07:00 – 19:00 IST
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {language === 'hi' ? 'दैनिक शिफ्ट कार्य कार्यक्रम' : 'Daily Shift Task Schedule'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Coordinated trade activities planned with dynamic environmental hazard windows to protect workers from peak pollution.
            </p>
          </div>

          <button
            onClick={() => setActiveNav('replan')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs text-[#0F172A] bg-[#FACC15] hover:bg-[#EAB308] border-2 border-[#CA8A04] transition shadow-lamy cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>Open Dual Optimizer</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">Total Tasks</span>
          <div className="text-2xl font-black font-mono text-[#0F172A] dark:text-[#F8FAFC]">{displayTasks.length}</div>
        </div>
        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#854D0E] dark:text-[#FACC15]">Rescheduled</span>
          <div className="text-2xl font-black font-mono text-[#854D0E] dark:text-[#FACC15]">{rescheduledCount}</div>
        </div>
        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#991B1B] dark:text-[#F87171]">Standby Curbs</span>
          <div className="text-2xl font-black font-mono text-[#DC2626] dark:text-[#F87171]">{restrictedCount}</div>
        </div>
        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#166534] dark:text-[#4ADE80]">Confirmed</span>
          <div className="text-2xl font-black font-mono text-[#16A34A] dark:text-[#4ADE80]">{continueCount}</div>
        </div>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl p-4 shadow-tactile flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search task or location..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-[#F8F9FA] dark:bg-[#07111C] border-2 border-[#CBD5E1] dark:border-[#334155] text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#CA8A04] shadow-xs font-medium"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setFilterTrade('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer shadow-xs ${
              filterTrade === 'all'
                ? 'bg-[#0F172A] text-white dark:bg-[#FACC15] dark:text-[#0F172A]'
                : 'text-[#475569] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]'
            }`}
          >
            All ({displayTasks.length})
          </button>
          <button
            onClick={() => setFilterTrade('reschedule')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer shadow-xs ${
              filterTrade === 'reschedule'
                ? 'bg-[#FACC15] text-[#0F172A] border border-[#CA8A04]'
                : 'text-[#854D0E] bg-[#FEF08A] dark:bg-[#422006] dark:text-[#FACC15] border border-[#EAB308]'
            }`}
          >
            Rescheduled ({rescheduledCount})
          </button>
          <button
            onClick={() => setFilterTrade('restricted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer shadow-xs ${
              filterTrade === 'restricted'
                ? 'bg-[#DC2626] text-white'
                : 'text-[#991B1B] bg-[#FEE2E2] dark:bg-[#451A1A] border border-[#FCA5A5]'
            }`}
          >
            Restricted ({restrictedCount})
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-0.5 rounded-xl bg-[#F8F9FA] dark:bg-[#07111C] border-2 border-[#CBD5E1] dark:border-[#334155] shadow-xs">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-[#FACC15] text-[#0F172A] border border-[#CA8A04] shadow-xs'
                : 'text-[#475569] dark:text-[#94A3B8]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
              viewMode === 'table'
                ? 'bg-[#FACC15] text-[#0F172A] border border-[#CA8A04] shadow-xs'
                : 'text-[#475569] dark:text-[#94A3B8]'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Task List: Cards Mode */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const isRestricted = task.status === 'restricted';
            const isShifted = Boolean(task.recommendedStartTime && task.recommendedStartTime !== task.originalStartTime);

            return (
              <div
                key={task.id}
                className="p-5 rounded-2xl border-2 border-[#CBD5E1] dark:border-[#334155] bg-[#FFFFFF] dark:bg-[#07111C] hover:border-[#CA8A04] dark:hover:border-[#FACC15] transition-all flex flex-col justify-between space-y-4 shadow-tactile"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-base text-[#0F172A] dark:text-[#F8FAFC]">
                          {task.name}
                        </h3>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#F1F5F9] dark:bg-[#1E293B] text-[#334155] dark:text-[#94A3B8] border border-[#CBD5E1] dark:border-[#475569]">
                          {task.indoorOutdoor}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#475569] dark:text-[#94A3B8] font-medium mt-1">
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

                    <StatusBadge status={task.status} size="sm" />
                  </div>
                </div>

                {/* Timing Badge */}
                <div className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#0B1522] border-2 border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between text-xs font-mono">
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
                      <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded bg-[#FEF08A] text-[#854D0E] dark:bg-[#422006] dark:text-[#FACC15] border border-[#EAB308]">
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

      {/* Task List: Table Mode */}
      {viewMode === 'table' && (
        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl overflow-hidden shadow-tactile">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-[#CBD5E1] dark:border-[#334155] bg-[#F8F9FA] dark:bg-[#07111C] text-[#475569] dark:text-[#94A3B8] font-black uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Task</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Crew</th>
                <th className="py-3.5 px-4">Planned Slot</th>
                <th className="py-3.5 px-4">Optimized Slot</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
              {filteredTasks.map((task) => {
                const isRestricted = task.status === 'restricted';
                const isShifted = Boolean(task.recommendedStartTime && task.recommendedStartTime !== task.originalStartTime);

                return (
                  <tr key={task.id} className="hover:bg-[#F8F9FA] dark:hover:bg-[#0B1522] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                      {task.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#475569] dark:text-[#94A3B8] font-medium">{task.location}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F172A] dark:text-[#F8FAFC]">{task.workers} crew</td>
                    <td className="py-3.5 px-4 font-mono text-[#475569] dark:text-[#94A3B8]">{task.originalStartTime}–{task.originalEndTime}</td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {isRestricted ? (
                        <span className="text-[#DC2626]">STANDBY</span>
                      ) : isShifted ? (
                        <span className="text-[#854D0E] dark:text-[#FACC15]">{task.recommendedStartTime}–{task.recommendedEndTime}</span>
                      ) : (
                        <span className="text-[#16A34A]">{task.originalStartTime}–{task.originalEndTime}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
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
