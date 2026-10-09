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
  selectedActionType?: 'RESCHEDULE' | 'REDUCE_EXPOSURE' | 'CONTINUE_WITH_REVIEW';
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

export type RegulatoryStatus = 
  | 'ALLOWED' 
  | 'RESTRICTED' 
  | 'REVIEW REQUIRED' 
  | 'NO RESTRICTION DETECTED' 
  | 'UNKNOWN' 
  | 'MANUAL REVIEW';

export interface RegulatoryRule {
  id: string;
  name: string;
  jurisdiction: string;
  ruleRef: string;
  source: string;
  effectiveDate: string;
  revisionDate?: string;
  grapStageTrigger: GRAPStage;
  affectedKeywords: string[];
  affectedActivity: string;
  restriction: string;
  requiresHighDust: boolean;
  action: 'RESTRICT' | 'MANDATE_PROTECT' | 'REVIEW';
  status: RegulatoryStatus;
  description: string;
  exceptions: string[];
  severity: 'critical' | 'warning' | 'info';
  lastVerified: string;
}

export type ActionType = 'RESCHEDULE' | 'REDUCE_EXPOSURE' | 'CONTINUE_WITH_REVIEW';

export interface ActionOption {
  actionType: ActionType;
  label: string;                  // e.g. "Option A: RESCHEDULE (Recommended)"
  isRecommended: boolean;
  startTime: string;              // "07:30"
  endTime: string;                // "10:30"
  exposureReductionPercent: number; // e.g. 31
  operationalDisruption: 'None' | 'Very Low' | 'Low' | 'Moderate' | 'High';
  workersAffected: number;
  taskDuration: number;
  regulatoryStatus: RegulatoryStatus;
  controlsRequired: string[];
  dependencyConflicts: string[];
  recommendationReason: string;
  whyNotLowestRiskReason?: string;
}

export interface ConstraintHourSlot {
  hour: number;
  timeLabel: string;
  environmentalRisk: number; // 0-100
  dependencyAllowed: boolean;
  workingHoursAllowed: boolean;
  taskDurationFits: boolean;
  isFeasible: boolean;
  isSelected: boolean;
}

export interface EvidenceRecord {
  environmentalInput: {
    source: string;
    currentAQI: number;
    forecastTaskWindowAQI: number;
    currentTemp: number;
    forecastHeatIndex: number;
    freshness: string;
    timestamp: string;
    currentVsForecastText: string;
  };
  regulatoryInput: {
    source: string;
    ruleRef: string;
    ruleTitle: string;
    effectiveDate: string;
    jurisdiction: string;
    affectedActivity: string;
    restriction: string;
    verificationStatus: RegulatoryStatus;
    exceptions: string[];
  };
  taskInput: {
    taskId: string;
    taskName: string;
    location: string;
    workers: number;
    duration: number;
    indoorOutdoor: string;
    dustPotential: string;
    intensity: string;
    movable: boolean;
    dependencies: string[];
  };
  engine: {
    version: string;
    ruleSetVersion: string;
    timestamp: string;
  };
  decision: {
    selectedAction: ActionType;
    rejectedAlternatives: { action: ActionType; reason: string }[];
    coreRationale: string;
  };
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
  whyThisSlot?: string[];
  whyNotLowestRiskSlot?: string;
  constraintTimeline?: ConstraintHourSlot[];
  actionOptions?: ActionOption[];
  evidenceRecord?: EvidenceRecord;
}

export interface OperationalExposureLoad {
  beforeLoad: number;             // Calculated: sum(Risk Score * Duration * Workers * Exposure Factor)
  afterLoad: number;
  percentReduction: number;
  formulaExplanation: string;
  disclaimer: string;
}

export interface ImpactMetrics {
  highRiskWorkerHoursAvoided: number; // worker-hours shifted out of identified high-risk windows
  tasksRescheduled: number;
  restrictedTasksFlagged: number;
  protectedTasksCount: number;
  continuedTasksCount: number;
  exposureReductionPercent: number; // calculated exposure reduction
  scheduleDisruptionScore: number;    // 0-100 operational drift score
  workersAffectedCount: number;
  totalCrewCount: number;
  operationalExposureLoad?: OperationalExposureLoad;
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
  approvalStatus: 'proposed' | 'approved' | 'rejected';
  notificationPreviewText: string;
  optionsByTask?: Record<string, ActionOption[]>;
}
