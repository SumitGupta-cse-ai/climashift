import React, { useState } from 'react';
import { useApp, AppNavView } from '@/context/AppContext';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageToggle } from '@/components/common/LanguageToggle';
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
  Info,
  Languages
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
    isOptimizing,
    t,
    language
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AppNavView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'plan', label: t.navPlan, icon: CalendarClock },
    { 
      id: 'replan', 
      label: t.navReplan, 
      icon: Sparkles, 
      badge: replanResult?.impactMetrics.tasksRescheduled ? `${replanResult.impactMetrics.tasksRescheduled} ${t.movedBadge}` : undefined 
    },
    { id: 'activity', label: t.navActivity, icon: History },
    { id: 'architecture', label: t.navArchitecture, icon: Cpu },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification Overlay */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-bounce-short">
          <div className={`p-4 rounded-xl shadow-elevated border flex items-center gap-3 backdrop-blur-md ${
            toastMessage.type === 'success' ? 'bg-emerald-500/95 text-slate-950 border-emerald-400 font-medium' :
            toastMessage.type === 'warning' ? 'bg-amber-500/95 text-slate-950 border-amber-400 font-medium' :
            toastMessage.type === 'error' ? 'bg-rose-500/95 text-white border-rose-400 font-medium' :
            'bg-slate-900/95 text-white border-slate-700 font-medium'
          }`}>
            {toastMessage.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
            {toastMessage.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0" />}
            {toastMessage.type === 'error' && <AlertTriangle className="w-5 h-5 shrink-0" />}
            {toastMessage.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-semibold">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* STATIC DESKTOP SIDEBAR - PINNED & STICKY, NEVER MOVES OR SHIFTS ON SCROLL */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-900/95 shrink-0 sticky top-0 h-screen overflow-y-auto select-none z-30 shadow-subtle">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                {t.appName}
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700/50">
                  PRO
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Active Site Selector */}
          <div className="mt-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
              {t.activeSite}
            </label>
            <div className="relative">
              <select
                value={siteProfile.id}
                onChange={(e) => {
                  const selected = sitesList.find(s => s.id === e.target.value);
                  if (selected) setSiteProfile(selected);
                }}
                className="w-full text-xs font-semibold pl-8 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {sitesList.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <Building2 className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-xs'
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

        {/* Static Sidebar Footer Controls */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3 bg-slate-50/50 dark:bg-slate-900/60">
          {/* Language Switcher */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.languageLabel}</span>
            </span>
            <LanguageToggle />
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.appearance}</span>
            <ThemeToggle />
          </div>

          {/* Benchmark Reset CTA */}
          <button
            onClick={resetToDemo}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700/80 hover:bg-white dark:hover:bg-slate-800 transition min-h-[38px] cursor-pointer"
            title="Reset site and plan back to benchmark demo scenario"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.resetDemo}</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">ClimaShift</span>
            <span className="block text-[10px] text-slate-500 font-medium truncate max-w-[130px]">{siteProfile.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
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

      {/* MOBILE DROPDOWN DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2 animate-fadeIn z-20">
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold min-h-[44px] ${
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
        </div>
      )}

      {/* MAIN CONTENT AREA - SCROLLS INDEPENDENTLY & SMOOTHLY */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Sticky Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {activeNav === 'dashboard' && t.navDashboard}
                {activeNav === 'plan' && t.navPlan}
                {activeNav === 'replan' && t.navReplan}
                {activeNav === 'activity' && t.navActivity}
                {activeNav === 'architecture' && t.navArchitecture}
                {activeNav === 'settings' && t.navSettings}
              </h2>
              {isOptimizing && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {t.evaluatingConstraints}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {t.tagline}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle />
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

        {/* Mobile Bottom Navigation Bar */}
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
