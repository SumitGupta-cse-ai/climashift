export type Language = 'en' | 'hi';

export interface Translations {
  appName: string;
  appSubtitle: string;
  tagline: string;
  activeSite: string;
  languageLabel: string;
  appearance: string;
  resetDemo: string;
  evaluatingConstraints: string;
  demoDataLabel: string;
  liveTelemetryLabel: string;
  updatedLabel: string;

  // Nav
  navDashboard: string;
  navTelemetry: string;
  navSchedule: string;
  navPlan: string;
  navReplan: string;
  navSafety: string;
  navCompliance: string;
  navActivity: string;
  navArchitecture: string;
  navSettings: string;
  movedBadge: string;

  // Statuses
  statusContinue: string;
  statusReschedule: string;
  statusProtect: string;
  statusRestricted: string;
  statusManualReview: string;

  // Dashboard
  heroAdvisory: string;
  heroHeadline: string;
  heroDescription: string;
  todayWorkDecision: string;
  tasksEvaluatedLabel: string;
  recommendedOutdoorWindow: string;
  recommendedWindowTime: string;
  replanMyDay: string;
  editPlanBtn: string;
  todayScheduleTitle: string;
  viewSideBySide: string;
  diurnalTitle: string;
  diurnalSubtitle: string;
  regulatoryTitle: string;
  regulatorySubtitle: string;

  // Metric Cards
  cardAqi: string;
  cardTemp: string;
  cardHeatIndex: string;
  cardHumidity: string;
  cardRegulatory: string;

  // Plan
  planIntakeTitle: string;
  planIntakeSubtitle: string;
  supervisorTranscriptLabel: string;
  loadDemoPlans: string;
  generatePlanBtn: string;
  extractingBtn: string;
  taskReviewTitle: string;
  taskReviewSubtitle: string;
  addManualTask: string;
  taskNameLabel: string;
  locationLabel: string;
  workersLabel: string;
  durationLabel: string;
  plannedStartLabel: string;
  environmentLabel: string;
  dustLabel: string;
  movableLabel: string;
  priorityLabel: string;

  // Replan
  replanHeaderTitle: string;
  replanHeaderSubtitle: string;
  reviewNotifyBtn: string;
  editConstraintsBtn: string;
  beforeTitle: string;
  afterTitle: string;
  whyMovedTitle: string;
  whyMovedSubtitle: string;
  envFactor: string;
  taskFactor: string;
  regFactor: string;
  mitigationImpact: string;

  // Impact
  impactHoursAvoided: string;
  impactTasksRescheduled: string;
  impactCurbsEnforced: string;
  impactWorkersProtected: string;
  impactDisruption: string;

  // Approval Modal
  approvalModalTitle: string;
  approvalModalSubtitle: string;
  dispatchPreviewLabel: string;
  supervisorRemarksLabel: string;
  humanInLoopNotice: string;
  approveBroadcastBtn: string;
  backToEditBtn: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'ClimaShift',
    appSubtitle: 'Environmental Work-Safety Engine',
    tagline: '“Don’t just monitor the environment. Plan the work around it.”',
    activeSite: 'Active Project Site',
    languageLabel: 'Language',
    appearance: 'Theme',
    resetDemo: 'Reset Demo Benchmark',
    evaluatingConstraints: 'Evaluating Constraints...',
    demoDataLabel: 'DEMO / FALLBACK DATA',
    liveTelemetryLabel: 'LIVE TELEMETRY',
    updatedLabel: 'Updated',

    navDashboard: 'Dashboard',
    navTelemetry: 'Live Telemetry',
    navSchedule: 'Shift Schedule',
    navPlan: 'Work Plan',
    navReplan: 'Replan Engine',
    navSafety: 'Crew Safety Passes',
    navCompliance: 'GRAP Compliance',
    navActivity: 'Decision Log',
    navArchitecture: 'AWS Architecture',
    navSettings: 'Settings',
    movedBadge: 'moved',

    statusContinue: 'CONTINUE',
    statusReschedule: 'RESCHEDULE',
    statusProtect: 'PROTECT',
    statusRestricted: 'RESTRICTED',
    statusManualReview: 'MANUAL REVIEW',

    heroAdvisory: 'Operational Risk Advisory',
    todayWorkDecision: "TODAY'S WORK DECISION",
    tasksEvaluatedLabel: 'TASKS EVALUATED',
    recommendedOutdoorWindow: 'RECOMMENDED OUTDOOR WORK WINDOW',
    recommendedWindowTime: '07:00 – 10:00 IST',
    heroHeadline: 'Morning outdoor window (07:30 – 10:30) recommended. Midday heat & particulate spike require immediate task shifts.',
    heroDescription: 'Severe AQI and peak heat index (41°C) create statutory curbs and biological stress for outdoor trades between 11:00 AM and 3:30 PM. ClimaShift automatically re-sequences tasks into safer hours.',
    replanMyDay: 'REPLAN MY DAY',
    editPlanBtn: 'Edit Work Plan & Tasks',
    todayScheduleTitle: "Today's Work Schedule",
    viewSideBySide: 'View Side-by-Side Optimization',
    diurnalTitle: 'Diurnal Environmental Exposure & Safe Work Windows (07:00 – 19:00)',
    diurnalSubtitle: 'Evaluated composite risk combining particulate index (AQI) and wet-bulb heat index.',
    regulatoryTitle: 'Statutory Compliance & Regulatory Rules Engine',
    regulatorySubtitle: 'Commission for Air Quality Management (CAQM) / Graded Response Action Plan (GRAP)',

    cardAqi: 'Air Quality (AQI)',
    cardTemp: 'Ambient Temperature',
    cardHeatIndex: 'Heat Index / Solar Stress',
    cardHumidity: 'Relative Humidity',
    cardRegulatory: 'Regulatory Mandate',

    planIntakeTitle: 'Natural Language Work-Plan Intake',
    planIntakeSubtitle: 'Dictate or type raw shift instructions. AI extracts structured trades, crews, and duration.',
    supervisorTranscriptLabel: 'Supervisor Daily Work Plan (Voice / Text Transcript)',
    loadDemoPlans: 'Quick Load Demo Work-Plans:',
    generatePlanBtn: 'GENERATE STRUCTURED PLAN',
    extractingBtn: 'Extracting Structured Tasks...',
    taskReviewTitle: 'Structured Tasks Review & Constraint Configuration',
    taskReviewSubtitle: 'Verify trade parameters before passing to the deterministic scheduling optimizer.',
    addManualTask: 'Add Manual Task',
    taskNameLabel: 'Task Name',
    locationLabel: 'Location / Sector',
    workersLabel: 'Workers',
    durationLabel: 'Duration (Hours)',
    plannedStartLabel: 'Planned Start',
    environmentLabel: 'Environment',
    dustLabel: 'Dust Potential',
    movableLabel: 'Movable',
    priorityLabel: 'Priority',

    replanHeaderTitle: 'Work Plan Successfully Optimized',
    replanHeaderSubtitle: 'Evaluated against active environmental exposure & statutory rules.',
    reviewNotifyBtn: 'Review & Notify Workers',
    editConstraintsBtn: 'Edit Constraints',
    beforeTitle: 'ORIGINAL WORK PLAN',
    afterTitle: 'OPTIMIZED WORK PLAN',
    whyMovedTitle: 'WHY DID THIS MOVE?',
    whyMovedSubtitle: 'Inspect environmental factor, task/exposure factor, and regulatory citations.',
    envFactor: 'Environmental Factor',
    taskFactor: 'Task & Exposure Factor',
    regFactor: 'Regulatory Rule Factor',
    mitigationImpact: 'Mitigation Impact',

    impactHoursAvoided: 'High-Risk Worker-Hours Shifted',
    impactTasksRescheduled: 'Tasks Rescheduled',
    impactCurbsEnforced: 'Statutory Curbs Enforced',
    impactWorkersProtected: 'Worker-Hours Shifted Out of Identified High-Risk Windows',
    impactDisruption: 'Schedule Disruption Score',

    approvalModalTitle: 'Supervisor Approval & Worker Notification',
    approvalModalSubtitle: 'Explicit supervisor approval required prior to worker notification dispatch.',
    dispatchPreviewLabel: 'NOTIFICATION PREVIEW (Worker Shift Advisory)',
    supervisorRemarksLabel: 'Supervisor Verification & Log Notes',
    humanInLoopNotice: 'Human-in-the-loop Protocol: No schedule changes or worker messages are dispatched without supervisor approval.',
    approveBroadcastBtn: 'Approve & Notify Workers',
    backToEditBtn: 'Back to Edit Schedule',
  },
  hi: {
    appName: 'क्लाइमाशिफ्ट (ClimaShift)',
    appSubtitle: 'पर्यावरणीय कार्य-सुरक्षा एवं शेड्यूलिंग इंजन',
    tagline: '“केवल पर्यावरण की निगरानी न करें। इसके अनुसार कार्य की योजना बनाएं।”',
    activeSite: 'सक्रिय प्रोजेक्ट साइट',
    languageLabel: 'भाषा',
    appearance: 'थीम',
    resetDemo: 'डेमो रीसेट करें',
    evaluatingConstraints: 'नियमों की गणना हो रही है...',
    demoDataLabel: 'डेमो / बैकअप डेटा',
    liveTelemetryLabel: 'लाइव डेटा (LIVE)',
    updatedLabel: 'अपडेटेड',

    navDashboard: 'डैशबोर्ड (Dashboard)',
    navTelemetry: 'लाइव टेलीमेट्री (Telemetry)',
    navSchedule: 'शिफ्ट कार्यक्रम (Schedule)',
    navPlan: 'कार्य योजना (Work Plan)',
    navReplan: 'रीप्लान इंजन (Replan)',
    navSafety: 'श्रमिक सुरक्षा पास (Safety Passes)',
    navCompliance: 'GRAP अनुपालन (Compliance)',
    navActivity: 'निर्णय लॉग (Decision Log)',
    navArchitecture: 'AWS क्लाउड (Architecture)',
    navSettings: 'सेटिंग्स (Settings)',
    movedBadge: 'बदले गए',

    statusContinue: 'जारी रखें (CONTINUE)',
    statusReschedule: 'समय बदलें (RESCHEDULE)',
    statusProtect: 'सुरक्षा उपाय (PROTECT)',
    statusRestricted: 'प्रतिबंधित (RESTRICTED)',
    statusManualReview: 'मैन्युअल समीक्षा (REVIEW)',

    heroAdvisory: 'कार्य-जोखिम परामर्श (Operational Advisory)',
    todayWorkDecision: "आज का कार्य निर्णय (TODAY'S WORK DECISION)",
    tasksEvaluatedLabel: 'कार्यों का मूल्यांकन (TASKS EVALUATED)',
    recommendedOutdoorWindow: 'अनुशंसित आउटडोर कार्य समय',
    recommendedWindowTime: '07:00 – 10:00 IST',
    heroHeadline: 'सुबह का समय (07:30 – 10:30) सुरक्षित है। दोपहर की अत्यधिक गर्मी व प्रदूषण के कारण कार्यों का समय बदलना अनिवार्य है।',
    heroDescription: 'गंभीर AQI और अत्यधिक हीट इंडेक्स (41°C) के कारण दोपहर 11:00 से 3:30 के बीच खुले में काम करने पर प्रतिबंध व जैविक जोखिम है। क्लाइमाशिफ्ट कार्यों को सुरक्षित समय पर स्वतः रीशेड्यूल करता है।',
    replanMyDay: 'आज का कार्य रीप्लान करें',
    editPlanBtn: 'कार्य योजना संपादित करें',
    todayScheduleTitle: 'आज का कार्य शेड्यूल',
    viewSideBySide: 'आमने-सामने तुलना देखें (Side-by-Side)',
    diurnalTitle: 'दिनभर का पर्यावरणीय जोखिम एवं सुरक्षित कार्य समय (07:00 – 19:00)',
    diurnalSubtitle: 'प्रदूषण (AQI) और तापमान/गर्मी तनाव का संयुक्त विश्लेषित जोखिम स्कोर।',
    regulatoryTitle: 'कानूनी अनुपालन एवं CAQM / GRAP नियम',
    regulatorySubtitle: 'वायु गुणवत्ता प्रबंधन आयोग (CAQM) / ग्रेडेड रिस्पांस एक्शन प्लान (GRAP)',

    cardAqi: 'वायु गुणवत्ता (AQI)',
    cardTemp: 'परिवेश का तापमान',
    cardHeatIndex: 'हीट इंडेक्स (गर्मी का प्रभाव)',
    cardHumidity: 'आर्द्रता / नमी',
    cardRegulatory: 'सक्रिय नियामक आदेश',

    planIntakeTitle: 'प्राकृतिक भाषा में कार्य योजना दर्ज करें',
    planIntakeSubtitle: 'बोलें या अपनी भाषा में लिखें। AI कार्यों, श्रमिकों और समय को स्वतः समझ लेगा।',
    supervisorTranscriptLabel: 'पर्यवेक्षक दैनिक कार्य योजना (आवाज या टेक्स्ट विवरण)',
    loadDemoPlans: 'तैयार डेमो योजनाएं चुनें:',
    generatePlanBtn: 'संरचित योजना तैयार करें (GENERATE)',
    extractingBtn: 'कार्यों को विश्लेषित किया जा रहा है...',
    taskReviewTitle: 'कार्यों की सूची एवं परिचालन सेटिंग्स',
    taskReviewSubtitle: 'शेड्यूलिंग इंजन चलाने से पहले श्रमिकों और समय की जांच करें।',
    addManualTask: '+ नया कार्य जोड़ें',
    taskNameLabel: 'कार्य का नाम',
    locationLabel: 'स्थान / सेक्टर',
    workersLabel: 'श्रमिकों की संख्या',
    durationLabel: 'अवधि (घंटे)',
    plannedStartLabel: 'नियोजित समय',
    environmentLabel: 'कार्य स्थल',
    dustLabel: 'धूल स्तर (Dust)',
    movableLabel: 'समय बदल सकते हैं?',
    priorityLabel: 'प्राथमिकता',

    replanHeaderTitle: 'कार्य योजना सफलतापूर्वक सुरक्षित कर दी गई है',
    replanHeaderSubtitle: 'पर्यावरणीय परिस्थितियों और कानूनी नियमों के अनुसार अनुकूलित।',
    reviewNotifyBtn: 'समीक्षा करें और श्रमिकों को सूचित करें',
    editConstraintsBtn: 'शर्तें संपादित करें',
    beforeTitle: 'मूल कार्य योजना (ORIGINAL WORK PLAN)',
    afterTitle: 'अनुकूलित कार्य योजना (OPTIMIZED WORK PLAN)',
    whyMovedTitle: 'यह कार्य क्यों बदला गया? (WHY DID THIS MOVE?)',
    whyMovedSubtitle: 'प्रत्येक निर्णय के पीछे का सटीक पर्यावरण कारक, जोखिम और कानूनी नियम देखें।',
    envFactor: 'पर्यावरणीय कारक (AQI / गर्मी)',
    taskFactor: 'कार्य प्रकृति और श्रमिक जोखिम',
    regFactor: 'कानूनी नियम (CAQM / GRAP)',
    mitigationImpact: 'सुरक्षा प्रभाव',

    impactHoursAvoided: 'बचाए गए उच्च-जोखिम श्रमिक-घंटे',
    impactTasksRescheduled: 'बदले गए कार्य',
    impactCurbsEnforced: 'कानूनी रूप से रोके गए कार्य',
    impactWorkersProtected: 'उच्च-जोखिम से स्थानांतरित श्रमिक-घंटे',
    impactDisruption: 'शेड्यूल विचलन स्कोर',

    approvalModalTitle: 'पर्यवेक्षक अनुमोदन एवं श्रमिक सूचना',
    approvalModalSubtitle: 'श्रमिकों को संदेश भेजने से पहले सुपरवाइजर का स्पष्ट अनुमोदन अनिवार्य है।',
    dispatchPreviewLabel: 'सूचना पूर्वावलोकन (NOTIFICATION PREVIEW)',
    supervisorRemarksLabel: 'पर्यवेक्षक टिप्पणी एवं अनुमोदन नोट',
    humanInLoopNotice: 'सुरक्षा प्रोटोकॉल: पर्यवेक्षक अनुमोदन के बिना किसी श्रमिक का समय नहीं बदला जाएगा।',
    approveBroadcastBtn: 'स्वीकृत करें और श्रमिकों को भेजें',
    backToEditBtn: 'वापस जाएं और संपादित करें',
  }
};
