import React, { useState } from 'react';
import { useApp, AppNavView } from '@/context/AppContext';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { DataFreshnessBadge } from '@/components/common/DataFreshnessBadge';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Sparkles, 
  History, 
  Cpu, 
  Settings, 
  Building2, 
  Menu, 
  X, 
  RotateCcw,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { 
    activeNav, 
    setActiveNav, 
    siteProfile, 
    setSiteProfile, 
    sitesList, 
    replanResult, 
    toastMessage, 
    resetToDemo,
    isOptimizing
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AppNavView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'plan', label: 'Work Plan', icon: CalendarClock },
    { 
      id: 'replan', 
      label: 'Replan Engine', 
      icon: Sparkles, 
      badge: replanResult?.impactMetrics.tasksRescheduled ? `${replanResult.impactMetrics.tasksRescheduled} moved` : undefined 
    },
    { id: 'activity', label: 'Decision Log', icon: History },
    { id: 'architecture', label: 'AWS Architecture', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
      {/* Toast Overlay */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-bounce-short">
          <div className={`p-4 rounded-xl shadow-elevated border flex items-center gap-3 backdrop-blur-md ${
            toastMessage.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-400' :
            toastMessage.type === 'warning' ? 'bg-amber-500/90 text-white border-amber-400' :
            toastMessage.type === 'error' ? 'bg-rose-500/90 text-white border-rose-400' :
            'bg-slate-900/90 text-white border-slate-700'
          }`}>
            {toastMessage.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
            {toastMessage.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0" />}
            {toastMessage.type === 'error' && <AlertTriangle className="w-5 h-5 shrink-0" />}
            {toastMessage.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shrink-0 select-none">
        {/* Brand */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                ClimaShift
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-700/50">
                  Enterprise
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Environmental Work-Safety Engine
              </p>
            </div>
          </div>

          {/* Site Selector Dropdown */}
          <div className="mt-4">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
              Active Project Site
            </label>
            <div className="relative">
              <select
                value={siteProfile.id}
                onChange={(e) => {
                  const selected = sitesList.find(s => s.id === e.target.value);
                  if (selected) setSiteProfile(selected);
                }}
                className="w-full text-xs font-semibold pl-8 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {sitesList.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.location})
                  </option>
                ))}
              </select>
              <Building2 className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Appearance</span>
            <ThemeToggle />
          </div>

          <button
            onClick={resetToDemo}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700/80 hover:bg-white dark:hover:bg-slate-800 transition min-h-[38px]"
            title="Reset site and plan back to benchmark demo scenario"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo Scenario</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">ClimaShift</span>
            <span className="block text-[10px] text-slate-500 font-medium truncate max-w-[140px]">{siteProfile.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2 animate-fadeIn z-20">
          <div className="mb-3">
            <label className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">Select Site</label>
            <select
              value={siteProfile.id}
              onChange={(e) => {
                const selected = sitesList.find(s => s.id === e.target.value);
                if (selected) {
                  setSiteProfile(selected);
                  setMobileMenuOpen(false);
                }
              }}
              className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {sitesList.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold min-h-[44px] ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                resetToDemo();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 p-2 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Benchmark Scenario</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar for Desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {activeNav === 'dashboard' && 'Environmental Operations Dashboard'}
                {activeNav === 'plan' && 'Work-Plan Builder & Ingestion'}
                {activeNav === 'replan' && 'Intelligent Replan & Safety Optimization'}
                {activeNav === 'activity' && 'Decision Audit Log & Broadcast Records'}
                {activeNav === 'architecture' && 'AWS Cloud Architecture Specifications'}
                {activeNav === 'settings' && 'Site Configuration & API Controls'}
              </h2>
              {isOptimizing && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Evaluating Constraints...
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              “Don’t just monitor the environment. Plan the work around it.”
            </p>
          </div>

          <div className="flex items-center gap-4">
            <DataFreshnessBadge 
              lastUpdated={siteProfile.lastUpdated} 
              isDemoData={siteProfile.isDemoData} 
              dataSource={siteProfile.dataSource} 
            />
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar (Persistent touch-friendly tabs) */}
        <div className="md:hidden sticky bottom-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1 flex items-center justify-around">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg text-[10px] font-semibold min-h-[44px] min-w-[54px] transition ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
