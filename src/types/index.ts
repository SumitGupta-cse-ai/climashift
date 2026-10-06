export type OperationalStatus = 
  | 'continue'      // 🟢 CONTINUE: Low environmental risk & permissible
  | 'reschedule'    // 🟡 RESCHEDULE: High risk in original window, safer window available
  | 'protect'       // 🟠 PROTECT: Can proceed if specific PPE/controls are deployed
  | 'restricted'    // 🔴 RESTRICTED: Configured regulatory curb prohibits activity
  | 'manual_review';// ⚪ MANUAL REVIEW: Ambiguity, conflicting dependencies or missing specs

export type GRAPStage = 'NONE' | 'STAGE_1' | 'STAGE_2' | 'STAGE_3' | 'STAGE_4';

export interface Task {
  id: string;
  name: string;
  location: string;
  workers: number;
  duration: number; // in hours
  indoorOutdoor: 'indoor' | 'outdoor' | 'semi-indoor';
  dustPotential: 'none' | 'low' | 'moderate' | 'high';
  intensity: 'light' | 'moderate' | 'heavy';
  airExposure: 'low' | 'moderate' | 'high';
  heatExposure: 'low' | 'moderate' | 'high';
  movable: boolean;
  priority: 'low' | 'normal' | 'high' | 'critical';
  dependencies: string[]; // task IDs that must complete prior to this
  preferredStartTime: string; // "HH:MM" e.g. "09:00"
  originalStartTime: string;  // "HH:MM"
  originalEndTime: string;    // "HH:MM"
  recommendedStartTime?: string; // "HH:MM"
  recommendedEndTime?: string;   // "HH:MM"
  status: OperationalStatus;
  statusReason?: string;
  appliedRule?: {
    id: string;
    title: string;
    source: string;
    action: string;
  };
  recommendedControls?: string[]; // e.g., ["N95 Respirator", "Water misting during work", "Hydration 15m intervals"]
}

export interface EnvironmentalWindow {
  hour: number;          // 7 to 19 (working hours 7 AM to 7 PM)
  timeLabel: string;     // e.g. "07:00"
  aqi: number;
  pm25: number;          // µg/m³
  pm10: number;          // µg/m³
  temperature: number;   // °C
  humidity: number;      // %
  heatIndex: number;     // °C (calculated apparent temp)
  windSpeed: number;     // km/h
  rainProb: number;      // %
  grapStage: GRAPStage;
  airQualityCategory: 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe' | 'Severe+';
  heatRisk: 'Normal' | 'Caution' | 'Extreme Caution' | 'Danger';
  isSafeForHeavyOutdoor: boolean;
  environmentalRiskScore: number; // Normalized 0-100 (0=best, 100=extreme danger)
}

export interface RegulatoryRule {
  id: string;
  name: string;
  jurisdiction: string;
  source: string;
  effectiveDate: string;
  revisionDate?: string;
  grapStageTrigger: GRAPStage;
  affectedKeywords: string[]; // e.g. ["excavation", "demolition", "plastering", "painting", "earthwork", "unloading"]
  requiresHighDust: boolean;
  action: 'RESTRICT' | 'MANDATE_PROTECT' | 'REVIEW';
  description: string;
  exceptions: string[];
  severity: 'critical' | 'warning' | 'info';
  lastVerified: string;
}

export interface TaskExplanation {
  taskId: string;
  taskName: string;
  originalTime: string;
  recommendedTime: string;
  moved: boolean;
  status: OperationalStatus;
  headline: string;
  environmentalFactor: string;
  taskFactor: string;
  regulatoryFactor: string;
  mitigationImpact: string;
}

export interface ImpactMetrics {
  highRiskWorkerHoursAvoided: number; // workers * hours moved out of danger windows
  tasksRescheduled: number;
  restrictedTasksFlagged: number;
  protectedTasksCount: number;
  continuedTasksCount: number;
  scheduleDisruptionScore: number;    // 0-100 penalty metric based on time shifts
  workersAffectedCount: number;
  totalCrewCount: number;
}

export interface SiteProfile {
  id: string;
  name: string;
  location: string;
  jurisdiction: string;
  grapStage: GRAPStage;
  currentAQI: number;
  currentTemp: number;
  currentHumidity: number;
  weatherCondition: string;
  dataSource: string;
  isDemoData: boolean;
  lastUpdated: string;
}

export interface ReplanResult {
  originalTasks: Task[];
  recommendedTasks: Task[];
  impactMetrics: ImpactMetrics;
  explanations: TaskExplanation[];
  siteProfile: SiteProfile;
  generatedAt: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  notificationPreviewText: string;
}
