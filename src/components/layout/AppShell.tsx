import React, { useState } from 'react';
import { useApp, AppNavView } from '@/context/AppContext';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Sparkles, 
  History, 
  Cpu, 
  Settings, 
  Menu, 
  X, 
  RotateCcw,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Info,
  Award,
  ChevronRight,
  Search,
  Bell,
  MapPin,
  ChevronDown,
  Calendar,
  Leaf,
  Clock
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
    judgeMode,
    toggleJudgeMode,
    t,
    language
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  interface NavItem {
    id: AppNavView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const workspaceNav: NavItem[] = [
    { id: 'dashboard' as AppNavView, label: t.navDashboard, icon: LayoutDashboard },
    { id: 'plan' as AppNavView, label: t.navPlan, icon: CalendarClock },
    { 
      id: 'replan' as AppNavView, 
      label: t.navReplan, 
      icon: Sparkles, 
      badge: '2'
    },
    { id: 'activity' as AppNavView, label: t.navActivity, icon: History },
  ];

  const systemNav: NavItem[] = [
    { id: 'architecture' as AppNavView, label: t.navArchitecture, icon: Cpu },
    { id: 'settings' as AppNavView, label: t.navSettings, icon: Settings },
  ];

  const allNavItems: NavItem[] = [...workspaceNav, ...systemNav];

  const demoSteps = [
    { num: '1', title: 'Diurnal AQI', nav: 'dashboard' as AppNavView },
    { num: '2', title: 'Work Plan', nav: 'plan' as AppNavView },
    { num: '3', title: 'Bedrock Intake', nav: 'plan' as AppNavView },
    { num: '4', title: 'Dual Optimizer', nav: 'replan' as AppNavView },
    { num: '5', title: 'Multi-Action & Provenance', nav: 'replan' as AppNavView },
    { num: '6', title: 'Supervisor Approval', nav: 'replan' as AppNavView },
    { num: '7', title: 'Decision Replay', nav: 'activity' as AppNavView },
    { num: '8', title: 'Real AWS Cloud', nav: 'architecture' as AppNavView }
  ];

  const getPageMeta = () => {
    switch (activeNav) {
      case 'dashboard':
        return {
          title: t.navDashboard,
          subtitle: language === 'hi' ? 'आज का परिचालन निर्णय एवं पर्यावरणीय स्थिति' : "Today's work decision & environmental risk overview"
        };
      case 'plan':
        return {
          title: t.navPlan,
          subtitle: language === 'hi' ? 'प्राकृतिक भाषा में कार्य योजना एवं व्यापार विशेषताएं' : "Natural-language shift intake & trade parameter configuration"
        };
      case 'replan':
        return {
          title: t.navReplan,
          subtitle: language === 'hi' ? 'दोहरा उद्देश्य अनुकूलक, बहु-विकल्प एवं साक्ष्य' : "Dual-objective constraint solver, multi-action choices & audit provenance"
        };
      case 'activity':
        return {
          title: t.navActivity,
          subtitle: language === 'hi' ? 'अनुमोदित निर्णयों का क्रमानुसार ऑडिट व पुनरुत्पादन' : "Auditable decision log & deterministic decision replay"
        };
      case 'architecture':
        return {
          title: t.navArchitecture,
          subtitle: language === 'hi' ? 'वास्तविक AWS क्लाउड आर्किटेक्चर एवं रनटाइम स्थिति' : "Truthful AWS cloud architecture & runtime integration status"
        };
      case 'settings':
        return {
          title: t.navSettings,
          subtitle: language === 'hi' ? 'सिस्टम प्राथमिकताएं एवं साइट कॉन्फ़िगरेशन' : "Operational constraints & system configuration"
        };
      default:
        return { title: 'ClimaShift', subtitle: t.tagline };
    }
  };

  const pageMeta = getPageMeta();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F7F8FA] dark:bg-[#07111C] text-[#171A1F] dark:text-[#F5F7FA] antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className={`px-3.5 py-2.5 rounded-lg border shadow-subtle flex items-center gap-2.5 backdrop-blur-md text-xs font-medium ${
            toastMessage.type === 'success' ? 'bg-[#EBF8F2] text-[#16855B] border-[#C3ECD8] dark:bg-[#0E3A31] dark:text-[#38D9A9] dark:border-[#1E4B39]' :
            toastMessage.type === 'warning' ? 'bg-[#FEF7EB] text-[#B7791F] border-[#FBE3B8] dark:bg-[#2C2214] dark:text-[#F59E0B] dark:border-[#4B3B24]' :
            toastMessage.type === 'error' ? 'bg-[#FEEFEF] text-[#D64545] border-[#FBC8C8] dark:bg-[#2D1818] dark:text-[#F87171] dark:border-[#4E2424]' :
            'bg-[#FFFFFF] text-[#171A1F] border-[#E4E7EC] dark:bg-[#0D1B2A] dark:text-[#F5F7FA] dark:border-[#26384C]'
          }`}>
            {toastMessage.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0 text-[#16855B]" />}
            {toastMessage.type === 'warning' && <AlertTriangle className="w-4 h-4 shrink-0 text-[#B7791F]" />}
            {toastMessage.type === 'error' && <AlertTriangle className="w-4 h-4 shrink-0 text-[#D64545]" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 shrink-0 text-[#16B878]" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* EXACT REFERENCE DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-[260px] border-r border-[#E4E7EC] dark:border-[#1E3146] bg-[#FFFFFF] dark:bg-[#07111C] shrink-0 sticky top-0 h-screen overflow-y-auto select-none z-30">
        
        {/* Brand Header */}
        <div className="p-4 border-b border-[#E4E7EC] dark:border-[#1E3146]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#16B878]/15 text-[#16B878] border border-[#16B878]/30 flex items-center justify-center shrink-0">
              <Leaf className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-[#171A1F] dark:text-[#F5F7FA]">
                ClimaShift
              </div>
              <p className="text-[11px] text-[#667085] dark:text-[#A7B2C1] leading-none mt-0.5">
                Environmental Work-Safety
              </p>
            </div>
          </div>

          {/* Active Site Selector Card */}
          <div className="mt-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#A7B2C1]">
              ACTIVE PROJECT SITE
            </span>
            <div className="relative">
              <select
                value={siteProfile.id}
                onChange={(e) => {
                  const found = sitesList.find(s => s.id === e.target.value);
                  if (found) setSiteProfile(found);
                }}
                className="w-full text-xs font-semibold bg-[#F9FAFB] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-lg py-2 pl-7 pr-7 text-[#171A1F] dark:text-[#F5F7FA] appearance-none focus:outline-none focus:border-[#16B878] cursor-pointer"
              >
                {sitesList.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-[#16B878] absolute left-2.5 top-2.5 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-[#A7B2C1] absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Structured Navigation with Category Dividers */}
        <nav className="flex-1 p-3 space-y-4">
          {/* Section 1: WORKSPACE */}
          <div className="space-y-1">
            <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#A7B2C1] mb-1">
              WORKSPACE
            </div>
            {workspaceNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-[#E9F8F2] dark:bg-[#0E3A31]/60 text-[#087F5B] dark:text-[#16B878] font-semibold border-l-2 border-[#16B878]'
                      : 'text-[#667085] dark:text-[#A7B2C1] hover:text-[#171A1F] dark:hover:text-[#F5F7FA] hover:bg-[#F9FAFB] dark:hover:bg-[#0D1B2A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#087F5B] dark:text-[#16B878]' : 'text-[#667085] dark:text-[#A7B2C1]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#D99A24] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section 2: SYSTEM */}
          <div className="space-y-1">
            <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#A7B2C1] mb-1">
              SYSTEM
            </div>
            {systemNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-[#E9F8F2] dark:bg-[#0E3A31]/60 text-[#087F5B] dark:text-[#16B878] font-semibold border-l-2 border-[#16B878]'
                      : 'text-[#667085] dark:text-[#A7B2C1] hover:text-[#171A1F] dark:hover:text-[#F5F7FA] hover:bg-[#F9FAFB] dark:hover:bg-[#0D1B2A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#087F5B] dark:text-[#16B878]' : 'text-[#667085] dark:text-[#A7B2C1]'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-[#E4E7EC] dark:border-[#1E3146] space-y-2.5">
          <div className="flex items-center justify-between px-1 text-xs text-[#667085] dark:text-[#A7B2C1]">
            <span className="text-[11px] font-medium">{t.languageLabel}</span>
            <LanguageToggle />
          </div>

          <div className="flex items-center justify-between px-1 text-xs text-[#667085] dark:text-[#A7B2C1]">
            <span className="text-[11px] font-medium">{t.appearance}</span>
            <ThemeToggle />
          </div>

          {/* User / Demo Status Row */}
          <div className="pt-2 border-t border-[#E4E7EC]/70 dark:border-[#1E3146] flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#2F80ED] text-white font-bold text-xs flex items-center justify-center shrink-0">
                SG
              </div>
              <span className="text-xs font-medium text-[#171A1F] dark:text-[#F5F7FA]">Demo Mode</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#16B878] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16B878]"></span>
              <span>Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP HEADER */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-3.5 py-2.5 bg-[#FFFFFF] dark:bg-[#07111C] border-b border-[#E4E7EC] dark:border-[#1E3146]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#16B878]/15 text-[#16B878] flex items-center justify-center shrink-0">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-[#171A1F] dark:text-[#F5F7FA]">ClimaShift</span>
            <span className="block text-[10px] text-[#667085] dark:text-[#A7B2C1] truncate max-w-[130px]">{siteProfile.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <LanguageToggle />
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 rounded text-[#667085] dark:text-[#A7B2C1] hover:bg-[#F9FAFB] dark:hover:bg-[#0D1B2A] cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MOBILE ACCORDION MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E4E7EC] dark:border-[#1E3146] bg-[#FFFFFF] dark:bg-[#07111C] px-3 py-2 space-y-1 z-20">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium ${
                  isActive
                    ? 'bg-[#E9F8F2] dark:bg-[#0E3A31]/60 text-[#087F5B] dark:text-[#16B878] font-semibold'
                    : 'text-[#667085] dark:text-[#A7B2C1]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#D99A24] text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        
        {/* EXACT REFERENCE DESKTOP TOP HEADER */}
        <header className="hidden md:flex items-center justify-between px-6 py-3 border-b border-[#E4E7EC] dark:border-[#1E3146] bg-[#FFFFFF] dark:bg-[#07111C] sticky top-0 z-20">
          {/* Search bar */}
          <div className="relative w-80 lg:w-96">
            <Search className="w-4 h-4 text-[#A7B2C1] absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tasks, decisions, or settings..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] text-[#171A1F] dark:text-[#F5F7FA] placeholder:text-[#667085] dark:placeholder:text-[#A7B2C1]/60 focus:outline-none focus:border-[#16B878]"
            />
          </div>

          {/* Right Tools */}
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-1.5 text-xs text-[#16B878] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#16B878] animate-pulse"></span>
              <span>Live Data</span>
            </div>

            <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[#D99A24]/15 border border-[#D99A24]/40 text-[#D99A24]">
              DEMO SCENARIO
            </span>

            <div className="flex items-center gap-1.5 text-xs text-[#667085] dark:text-[#A7B2C1]">
              <Clock className="w-3.5 h-3.5" />
              <span>Last updated {siteProfile.lastUpdated || '07:15 IST'}</span>
            </div>

            {/* Notification Bell */}
            <button className="relative p-1.5 rounded-lg text-[#667085] dark:text-[#A7B2C1] hover:bg-[#F9FAFB] dark:hover:bg-[#0D1B2A] transition cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D94A4A]"></span>
            </button>

            {/* Judge Mode Switch */}
            <button
              onClick={toggleJudgeMode}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer border ${
                judgeMode
                  ? 'bg-[#FEF7EB] text-[#B7791F] border-[#FBE3B8] font-semibold dark:bg-[#2C2214] dark:text-[#F59E0B] dark:border-[#4B3B24]'
                  : 'bg-[#F9FAFB] dark:bg-[#0D1B2A] text-[#667085] dark:text-[#A7B2C1] border-[#E4E7EC] dark:border-[#26384C] hover:border-[#16B878]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#B7791F]" />
              <span>{judgeMode ? 'Judge ON' : 'Judge Mode'}</span>
            </button>

            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#2F80ED] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              SG
            </div>
          </div>
        </header>

        {/* GREETING & CONTEXT HEADER ON DASHBOARD */}
        {activeNav === 'dashboard' && (
          <div className="px-4 sm:px-6 pt-5 pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div>
              <h1 className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#171A1F] dark:text-[#F5F7FA] flex items-center gap-2">
                <span>Good morning, Supervisor</span>
                <span>👋</span>
              </h1>
              <p className="text-sm text-[#667085] dark:text-[#A7B2C1] mt-0.5">
                {"Here's today's work decision and environmental overview"}
              </p>
            </div>

            <div className="flex items-center gap-2.5 p-2 px-3 rounded-lg bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] text-xs shadow-xs">
              <Calendar className="w-4 h-4 text-[#16B878]" />
              <div>
                <div className="font-semibold text-[#171A1F] dark:text-[#F5F7FA]">Tue, 8 Oct 2026</div>
                <div className="text-[11px] text-[#667085] dark:text-[#A7B2C1]">{siteProfile.name}</div>
              </div>
            </div>
          </div>
        )}

        {/* Judge Mode 3-Minute Story Walkthrough Bar */}
        {judgeMode && (
          <div className="bg-[#FEF7EB] dark:bg-[#2C2214] border-b border-[#FBE3B8] dark:border-[#4B3B24] px-4 sm:px-6 py-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 min-w-max text-xs">
              <span className="font-mono font-bold text-[#B7791F] dark:text-[#F59E0B] uppercase text-[10px] mr-1">
                DEMO STORY:
              </span>
              {demoSteps.map((step, i) => (
                <React.Fragment key={step.num}>
                  <button
                    onClick={() => setActiveNav(step.nav)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                      activeNav === step.nav 
                        ? 'bg-[#B7791F] text-white font-semibold' 
                        : 'bg-[#FFFFFF] dark:bg-[#122235] text-[#171A1F] dark:text-[#F5F7FA] border border-[#FBE3B8] dark:border-[#4B3B24] hover:bg-[#FEF7EB]'
                    }`}
                  >
                    <span className="font-mono text-[10px]">{step.num}.</span>
                    <span>{step.title}</span>
                  </button>
                  {i < demoSteps.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-[#B7791F]/50 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Full-width Main Content Workspace */}
        <main className="flex-1 px-4 sm:px-6 py-5 w-full">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <div className="md:hidden sticky bottom-0 z-30 bg-[#FFFFFF] dark:bg-[#07111C] border-t border-[#E4E7EC] dark:border-[#1E3146] px-2 py-1 flex items-center justify-around">
          {workspaceNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex flex-col items-center justify-center p-1.5 rounded text-[11px] font-medium min-h-[44px] min-w-[50px] transition ${
                  isActive
                    ? 'text-[#16B878] font-semibold'
                    : 'text-[#667085] dark:text-[#A7B2C1]'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setActiveNav('activity')}
            className={`flex flex-col items-center justify-center p-1.5 rounded text-[11px] font-medium min-h-[44px] min-w-[50px] transition ${
              activeNav === 'activity'
                ? 'text-[#16B878] font-semibold'
                : 'text-[#667085] dark:text-[#A7B2C1]'
            }`}
          >
            <History className="w-4 h-4 mb-0.5" />
            <span>{t.navActivity}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
