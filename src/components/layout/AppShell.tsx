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
  Clock,
  Radio,
  HardHat,
  Scale
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
    { id: 'telemetry' as AppNavView, label: t.navTelemetry, icon: Radio },
    { id: 'schedule' as AppNavView, label: t.navSchedule, icon: Calendar },
    { id: 'plan' as AppNavView, label: t.navPlan, icon: CalendarClock },
    { 
      id: 'replan' as AppNavView, 
      label: t.navReplan, 
      icon: Sparkles, 
      badge: '2'
    },
    { id: 'safety' as AppNavView, label: t.navSafety, icon: HardHat },
    { id: 'compliance' as AppNavView, label: t.navCompliance, icon: Scale },
    { id: 'activity' as AppNavView, label: t.navActivity, icon: History },
  ];

  const systemNav: NavItem[] = [
    { id: 'architecture' as AppNavView, label: t.navArchitecture, icon: Cpu },
    { id: 'settings' as AppNavView, label: t.navSettings, icon: Settings },
  ];

  const allNavItems: NavItem[] = [...workspaceNav, ...systemNav];

  const demoSteps = [
    { num: '1', title: 'Live Telemetry', nav: 'telemetry' as AppNavView },
    { num: '2', title: 'Shift Schedule', nav: 'schedule' as AppNavView },
    { num: '3', title: 'Bedrock Intake', nav: 'plan' as AppNavView },
    { num: '4', title: 'Dual Optimizer', nav: 'replan' as AppNavView },
    { num: '5', title: 'Safety Passes', nav: 'safety' as AppNavView },
    { num: '6', title: 'GRAP Curbs', nav: 'compliance' as AppNavView },
    { num: '7', title: 'Decision Audit', nav: 'activity' as AppNavView },
    { num: '8', title: 'Real AWS Cloud', nav: 'architecture' as AppNavView }
  ];

  const getPageMeta = () => {
    switch (activeNav) {
      case 'dashboard':
        return {
          title: t.navDashboard,
          subtitle: language === 'hi' ? 'आज का परिचालन निर्णय एवं पर्यावरणीय स्थिति' : "Today's work decision & environmental risk overview"
        };
      case 'telemetry':
        return {
          title: t.navTelemetry,
          subtitle: language === 'hi' ? 'लाइव मौसम सेंसर, AQI एवं तापमान टेलीमेट्री' : "Continuous IoT micro-climate weather monitoring & live forecast"
        };
      case 'schedule':
        return {
          title: t.navSchedule,
          subtitle: language === 'hi' ? 'दैनिक शिफ्ट कार्य कार्यक्रम एवं व्यापार आवंटन' : "Full shift schedule, trade timelines & planned vs recommended slots"
        };
      case 'safety':
        return {
          title: t.navSafety,
          subtitle: language === 'hi' ? 'श्रमिक स्वास्थ्य, डिजिटल पास एवं सुरक्षा प्रोटोकॉल' : "Worker protection passes, mandatory PPE checklists & heat stress tracking"
        };
      case 'compliance':
        return {
          title: t.navCompliance,
          subtitle: language === 'hi' ? 'सीएक्यूएम ग्रैप-III वैधानिक निर्देश व कानूनी साक्ष्य' : "CAQM GRAP-III statutory curbs, dust enforcement & legal affidavit"
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
      <aside className="hidden md:flex flex-col w-[260px] border-r border-[#D8DEE4] dark:border-[#334155] bg-[#FFFFFF] dark:bg-[#07111C] shrink-0 sticky top-0 h-screen overflow-y-auto select-none z-30 shadow-sm">
        
        {/* Brand Header */}
        <div className="p-4 border-b border-[#D8DEE4] dark:border-[#334155]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FACC15] text-[#0F172A] border border-[#EAB308] flex items-center justify-center shrink-0 shadow-lamy">
              <Leaf className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-1.5">
                <span>ClimaShift</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#FEF08A] text-[#854D0E] dark:bg-[#422006] dark:text-[#FACC15] border border-[#FDE047] dark:border-[#854D0E]">
                  PRO APK
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] leading-none mt-0.5">
                Environmental Work-Safety
              </p>
            </div>
          </div>

          {/* Active Site Selector Card */}
          <div className="mt-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
              ACTIVE PROJECT SITE
            </span>
            <div className="relative">
              <select
                value={siteProfile.id}
                onChange={(e) => {
                  const found = sitesList.find(s => s.id === e.target.value);
                  if (found) setSiteProfile(found);
                }}
                className="w-full text-xs font-semibold bg-[#F8FAFC] dark:bg-[#0D1B2A] border border-[#CBD5E1] dark:border-[#334155] rounded-lg py-2 pl-7 pr-7 text-[#0F172A] dark:text-[#F8FAFC] appearance-none focus:outline-none focus:border-[#CA8A04] cursor-pointer shadow-xs"
              >
                {sitesList.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-[#CA8A04] dark:text-[#FACC15] absolute left-2.5 top-2.5 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Structured Navigation with Category Dividers */}
        <nav className="flex-1 p-3 space-y-4">
          {/* Section 1: WORKSPACE */}
          <div className="space-y-1">
            <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-1">
              WORKSPACE
            </div>
            {workspaceNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-[#FEF9C3] dark:bg-[#422006] text-[#0F172A] dark:text-[#FACC15] font-bold border-l-4 border-[#FACC15] shadow-xs'
                      : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#0D1B2A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#854D0E] dark:text-[#FACC15]' : 'text-[#64748B] dark:text-[#94A3B8]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#FACC15] text-[#0F172A] border border-[#EAB308]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section 2: SYSTEM */}
          <div className="space-y-1">
            <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-1">
              SYSTEM
            </div>
            {systemNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-[#FEF9C3] dark:bg-[#422006] text-[#0F172A] dark:text-[#FACC15] font-bold border-l-4 border-[#FACC15] shadow-xs'
                      : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#0D1B2A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#854D0E] dark:text-[#FACC15]' : 'text-[#64748B] dark:text-[#94A3B8]'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-[#D8DEE4] dark:border-[#334155] space-y-2.5">
          <div className="flex items-center justify-between px-1 text-xs text-[#475569] dark:text-[#94A3B8]">
            <span className="text-[11px] font-semibold">{t.languageLabel}</span>
            <LanguageToggle />
          </div>

          <div className="flex items-center justify-between px-1 text-xs text-[#475569] dark:text-[#94A3B8]">
            <span className="text-[11px] font-semibold">{t.appearance}</span>
            <ThemeToggle />
          </div>

          {/* User / Demo Status Row */}
          <div className="pt-2 border-t border-[#D8DEE4] dark:border-[#334155] flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#0F172A] text-[#FACC15] font-black text-xs flex items-center justify-center shrink-0 border border-[#CA8A04]/40 shadow-xs">
                SG
              </div>
              <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">Demo Mode</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#059669] dark:text-[#34D399] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span>Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP HEADER */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-3.5 py-2.5 bg-[#FFFFFF] dark:bg-[#07111C] border-b border-[#D8DEE4] dark:border-[#334155] shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#FACC15] text-[#0F172A] border border-[#EAB308] flex items-center justify-center shrink-0 shadow-xs">
            <Leaf className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-[#0F172A] dark:text-[#F8FAFC]">ClimaShift</span>
              <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-[#FEF08A] text-[#854D0E] dark:bg-[#422006] dark:text-[#FACC15]">
                APK
              </span>
            </div>
            <span className="block text-[10px] text-[#475569] dark:text-[#94A3B8] font-medium truncate max-w-[130px]">{siteProfile.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <LanguageToggle />
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 rounded-lg text-[#475569] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#0D1B2A] border border-[#D8DEE4] dark:border-[#334155] cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MOBILE ACCORDION MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#D8DEE4] dark:border-[#334155] bg-[#FFFFFF] dark:bg-[#07111C] px-3 py-2 space-y-1 z-20 shadow-md">
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
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-semibold ${
                  isActive
                    ? 'bg-[#FEF9C3] dark:bg-[#422006] text-[#0F172A] dark:text-[#FACC15] font-bold'
                    : 'text-[#475569] dark:text-[#94A3B8]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FACC15] text-[#0F172A]">
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
        <header className="hidden md:flex items-center justify-between px-6 py-3 border-b border-[#D8DEE4] dark:border-[#334155] bg-[#FFFFFF] dark:bg-[#07111C] sticky top-0 z-20 shadow-xs">
          {/* Search bar */}
          <div className="relative w-80 lg:w-96">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tasks, decisions, or settings..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg bg-[#F8F9FA] dark:bg-[#0D1B2A] border border-[#CBD5E1] dark:border-[#334155] text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8]/60 focus:outline-none focus:border-[#CA8A04] shadow-xs"
            />
          </div>

          {/* Right Tools */}
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-1.5 text-xs text-[#16A34A] dark:text-[#4ADE80] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span>Live Telemetry</span>
            </div>

            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-[#FEF9C3] dark:bg-[#422006] border border-[#FDE047] dark:border-[#A16207] text-[#854D0E] dark:text-[#FACC15] shadow-xs">
              DEMO SCENARIO
            </span>

            <div className="flex items-center gap-1.5 text-xs text-[#475569] dark:text-[#94A3B8] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#CA8A04] dark:text-[#FACC15]" />
              <span>Last updated {siteProfile.lastUpdated || '07:15 IST'}</span>
            </div>

            {/* Notification Bell */}
            <button className="relative p-1.5 rounded-lg text-[#475569] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#0D1B2A] border border-[#D8DEE4] dark:border-[#334155] transition cursor-pointer shadow-xs">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#DC2626]"></span>
            </button>

            {/* Judge Mode Switch */}
            <button
              onClick={toggleJudgeMode}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer border shadow-xs ${
                judgeMode
                  ? 'bg-[#FEF08A] text-[#854D0E] border-[#CA8A04] dark:bg-[#422006] dark:text-[#FACC15] dark:border-[#A16207]'
                  : 'bg-[#F8F9FA] dark:bg-[#0D1B2A] text-[#475569] dark:text-[#94A3B8] border-[#CBD5E1] dark:border-[#334155] hover:border-[#CA8A04]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#CA8A04] dark:text-[#FACC15]" />
              <span>{judgeMode ? 'Judge ON' : 'Judge Mode'}</span>
            </button>

            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#0F172A] text-[#FACC15] font-black text-xs flex items-center justify-center shrink-0 border border-[#CA8A04]/40 shadow-xs">
              SG
            </div>
          </div>
        </header>

        {/* OPERATIONAL CONTEXT HEADER ON DASHBOARD */}
        {activeNav === 'dashboard' && (
          <div className="px-4 sm:px-6 pt-5 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#854D0E] dark:text-[#FACC15] bg-[#FEF9C3] dark:bg-[#422006] px-2 py-0.5 rounded-md border border-[#FDE047] dark:border-[#A16207] shadow-xs">
                  Operational Console
                </span>
                <span className="text-xs text-[#475569] dark:text-[#94A3B8] font-medium">
                  {siteProfile.jurisdiction || 'Delhi-NCR CAQM Jurisdiction'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-[26px] font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC] mt-1">
                {siteProfile.name}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#CBD5E1] dark:border-[#334155] text-xs shadow-xs">
                <Calendar className="w-3.5 h-3.5 text-[#CA8A04] dark:text-[#FACC15]" />
                <div>
                  <div className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Tue, 8 Oct 2026</div>
                  <div className="text-[10px] text-[#475569] dark:text-[#94A3B8] font-mono font-semibold">Shift 07:00–19:00 IST</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Judge Mode 3-Minute Story Walkthrough Bar */}
        {judgeMode && (
          <div className="bg-[#FEF9C3] dark:bg-[#422006]/80 border-b border-[#FDE047] dark:border-[#854D0E] px-4 sm:px-6 py-2 overflow-x-auto shadow-xs">
            <div className="flex items-center gap-1.5 min-w-max text-xs">
              <span className="font-mono font-extrabold text-[#854D0E] dark:text-[#FACC15] uppercase text-[10px] mr-1">
                DEMO STORY:
              </span>
              {demoSteps.map((step, i) => (
                <React.Fragment key={step.num}>
                  <button
                    onClick={() => setActiveNav(step.nav)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer shadow-xs ${
                      activeNav === step.nav 
                        ? 'bg-[#0F172A] text-[#FACC15] border border-[#CA8A04]' 
                        : 'bg-[#FFFFFF] dark:bg-[#122235] text-[#0F172A] dark:text-[#F8FAFC] border border-[#FDE047] dark:border-[#854D0E] hover:bg-[#FEF08A]'
                    }`}
                  >
                    <span className="font-mono text-[10px]">{step.num}.</span>
                    <span>{step.title}</span>
                  </button>
                  {i < demoSteps.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-[#854D0E]/60 dark:text-[#FACC15]/60 shrink-0" />
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
        <div className="md:hidden sticky bottom-0 z-30 bg-[#FFFFFF] dark:bg-[#07111C] border-t border-[#D8DEE4] dark:border-[#334155] px-2 py-1 flex items-center justify-around shadow-md">
          {workspaceNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex flex-col items-center justify-center p-1.5 rounded text-[11px] font-semibold min-h-[44px] min-w-[50px] transition ${
                  isActive
                    ? 'text-[#854D0E] dark:text-[#FACC15] font-bold'
                    : 'text-[#475569] dark:text-[#94A3B8]'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setActiveNav('activity')}
            className={`flex flex-col items-center justify-center p-1.5 rounded text-[11px] font-semibold min-h-[44px] min-w-[50px] transition ${
              activeNav === 'activity'
                ? 'text-[#854D0E] dark:text-[#FACC15] font-bold'
                : 'text-[#475569] dark:text-[#94A3B8]'
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
