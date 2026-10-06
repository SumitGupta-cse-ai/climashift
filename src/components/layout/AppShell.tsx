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
    t
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
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-sm animate-bounce-short">
          <div className={`px-4 py-3 rounded-lg shadow-elevated border flex items-center gap-2.5 backdrop-blur-md ${
            toastMessage.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500 font-medium' :
            toastMessage.type === 'warning' ? 'bg-amber-600 text-white border-amber-500 font-medium' :
            toastMessage.type === 'error' ? 'bg-rose-600 text-white border-rose-500 font-medium' :
            'bg-slate-900 text-white border-slate-700 font-medium'
          }`}>
            {toastMessage.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
            {toastMessage.type === 'warning' && <AlertTriangle className="w-4 h-4 shrink-0" />}
            {toastMessage.type === 'error' && <AlertTriangle className="w-4 h-4 shrink-0" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 shrink-0" />}
            <span className="text-xs font-medium">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* COMPACT ENTERPRISE DESKTOP SIDEBAR - PINNED & RESTRAINED */}
      <aside className="hidden md:flex flex-col w-60 lg:w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shrink-0 sticky top-0 h-screen overflow-y-auto select-none z-30">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">ClimaShift</span>
                <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  OPS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Active Site Selector */}
          <div className="mt-3">
            <div className="relative">
              <select
                value={siteProfile.id}
                onChange={(e) => {
                  const selected = sitesList.find(s => s.id === e.target.value);
                  if (selected) setSiteProfile(selected);
                }}
                className="w-full text-xs font-medium pl-7 pr-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer truncate"
              >
                {sitesList.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Navigation links with subtle active indicator */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors min-h-[38px] cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Compact Footer Controls */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 bg-slate-50/40 dark:bg-slate-900/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Languages className="w-3 h-3 text-slate-400" />
              <span>{t.languageLabel}</span>
            </span>
            <LanguageToggle />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{t.appearance}</span>
            <ThemeToggle />
          </div>

          <button
            onClick={resetToDemo}
            className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition min-h-[32px] cursor-pointer"
            title="Reset to benchmark scenario"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>{t.resetDemo}</span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP HEADER */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-3.5 py-2.5 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs tracking-tight text-slate-900 dark:text-white">ClimaShift</span>
            <span className="block text-[9px] text-slate-500 truncate max-w-[120px]">{siteProfile.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <LanguageToggle />
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU ACCORDION */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] px-3 py-2.5 space-y-1 animate-fadeIn z-20">
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium min-h-[40px] ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* MAIN CONTENT VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#111827]/70 backdrop-blur-md sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                {activeNav === 'dashboard' && t.navDashboard}
                {activeNav === 'plan' && t.navPlan}
                {activeNav === 'replan' && t.navReplan}
                {activeNav === 'activity' && t.navActivity}
                {activeNav === 'architecture' && t.navArchitecture}
                {activeNav === 'settings' && t.navSettings}
              </h2>
              {isOptimizing && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {t.evaluatingConstraints}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.tagline}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DataFreshnessBadge 
              lastUpdated={siteProfile.lastUpdated} 
              isDemoData={siteProfile.isDemoData} 
              dataSource={siteProfile.dataSource} 
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-6xl w-full mx-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation (44px touch targets) */}
        <div className="md:hidden sticky bottom-0 z-30 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-1 py-1 flex items-center justify-around">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex flex-col items-center justify-center p-1.5 rounded text-[10px] font-medium min-h-[44px] min-w-[50px] transition ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
