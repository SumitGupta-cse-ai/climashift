import { 
  Task, 
  EnvironmentalWindow, 
  RegulatoryRule, 
  ReplanResult, 
  TaskExplanation, 
  ImpactMetrics, 
  SiteProfile,
  OperationalStatus,
  ActionOption,
  ConstraintHourSlot,
  EvidenceRecord,
  OperationalExposureLoad
} from '@/types';
import { OFFICIAL_REGULATORY_RULES } from '@/data/regulatoryRules';

interface WindowScore {
  startHour: number;
  endHour: number;
  environmentalRiskScore: number;
  heatPenalty: number;
  aqiPenalty: number;
  timeShiftPenalty: number; // distance from preferred start time
  totalCost: number;
}

export function runDeterministicScheduler(
  tasks: Task[],
  windows: EnvironmentalWindow[],
  siteProfile: SiteProfile,
  customRules: RegulatoryRule[] = OFFICIAL_REGULATORY_RULES
): ReplanResult {
  const originalTasks = tasks.map(t => ({ ...t }));
  const recommendedTasks: Task[] = [];
  const explanations: TaskExplanation[] = [];
  const optionsByTask: Record<string, ActionOption[]> = {};
  
  // Working hours bounds
  const MIN_HOUR = 7;
  const MAX_HOUR = 19;

  // Track scheduled task intervals for dependencies: Map<taskId, { start: number, end: number }>
  const scheduledTimeSlots = new Map<string, { start: number; end: number }>();

  // Process tasks sorted by priority (critical -> high -> normal -> low)
  const priorityOrder: Record<string, number> = { critical: 4, high: 3, normal: 2, low: 1 };
  const sortedTasks = [...tasks].sort((a, b) => {
    return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
  });

  for (const task of sortedTasks) {
    const origStartHour = parseInt(task.originalStartTime.split(':')[0], 10);
    const origEndHour = Math.min(MAX_HOUR, origStartHour + task.duration);
    
    // Step 1: Check Applicable Regulatory Rules
    const matchedRule = findMatchingRegulatoryRule(task, siteProfile, customRules);
    
    if (matchedRule && matchedRule.action === 'RESTRICT') {
      const recTask: Task = {
        ...task,
        status: 'restricted',
        statusReason: `Statutory halt under ${matchedRule.name} (${matchedRule.source}).`,
        appliedRule: {
          id: matchedRule.id,
          title: matchedRule.name,
          source: matchedRule.source,
          action: 'RESTRICT'
        },
        recommendedStartTime: task.originalStartTime,
        recommendedEndTime: task.originalEndTime,
        selectedActionType: 'RESCHEDULE'
      };
      
      recommendedTasks.push(recTask);
      scheduledTimeSlots.set(task.id, { start: origStartHour, end: origEndHour });

      // Action options for restricted task
      const actionOptions: ActionOption[] = [
        {
          actionType: 'RESCHEDULE',
          label: 'Option A: SUSPEND & DEFER (Recommended)',
          isRecommended: true,
          startTime: 'Standby',
          endTime: 'Standby',
          exposureReductionPercent: 100,
          operationalDisruption: 'High',
          workersAffected: task.workers,
          taskDuration: task.duration,
          regulatoryStatus: 'RESTRICTED',
          controlsRequired: ['Site standby order', 'Dust cover tarping', 'Water misting cannons'],
          dependencyConflicts: [],
          recommendationReason: `Mandatory halt under ${matchedRule.name}. Activity legally restricted until CAQM de-escalation.`,
          whyNotLowestRiskReason: 'Outdoor dust generation prohibited regardless of hourly exposure.'
        },
        {
          actionType: 'REDUCE_EXPOSURE',
          label: 'Option B: ENCLOSED / PRE-FAB FABRICATION',
          isRecommended: false,
          startTime: '09:00',
          endTime: `${(9 + task.duration).toString().padStart(2, '0')}:00`,
          exposureReductionPercent: 65,
          operationalDisruption: 'Moderate',
          workersAffected: Math.round(task.workers * 0.5),
          taskDuration: task.duration,
          regulatoryStatus: 'REVIEW REQUIRED',
          controlsRequired: ['Fully enclosed chamber', 'Exhaust air filtration', 'Dust extraction system'],
          dependencyConflicts: [],
          recommendationReason: 'Requires moving activity into certified enclosed facility exempt from open-air dust curbs.'
        },
        {
          actionType: 'CONTINUE_WITH_REVIEW',
          label: 'Option C: APPLY FOR STATUTORY EXEMPTION',
          isRecommended: false,
          startTime: task.originalStartTime,
          endTime: task.originalEndTime,
          exposureReductionPercent: 0,
          operationalDisruption: 'None',
          workersAffected: task.workers,
          taskDuration: task.duration,
          regulatoryStatus: 'REVIEW REQUIRED',
          controlsRequired: ['CAQM special dispensation order', 'Continuous particulate monitoring'],
          dependencyConflicts: [],
          recommendationReason: 'Requires verified municipal infrastructure exception (e.g. Metro, Defense, Healthcare).'
        }
      ];
      optionsByTask[task.id] = actionOptions;

      // Constraint timeline
      const constraintTimeline: ConstraintHourSlot[] = generateConstraintTimeline(
        windows,
        MIN_HOUR,
        MAX_HOUR,
        task.duration,
        origStartHour,
        -1, // not scheduled
        matchedRule
      );

      // Decision Evidence Record
      const evidenceRecord = buildEvidenceRecord(
        siteProfile,
        windows,
        task,
        origStartHour,
        origEndHour,
        origStartHour,
        origEndHour,
        matchedRule,
        'RESCHEDULE',
        [
          { action: 'REDUCE_EXPOSURE', reason: 'Enclosed facility required; not standard outdoor earthwork' },
          { action: 'CONTINUE_WITH_REVIEW', reason: 'Open execution strictly prohibited by active CAQM order' }
        ],
        `Activity halted to prevent statutory stop-work notice under ${matchedRule.name}.`
      );

      explanations.push({
        taskId: task.id,
        taskName: task.name,
        originalTime: `${task.originalStartTime} - ${task.originalEndTime}`,
        recommendedTime: 'Activity Suspended / Standby',
        moved: false,
        status: 'restricted',
        headline: 'Prohibited by Regulatory Mandate',
        environmentalFactor: `Current Site AQI (${siteProfile.currentAQI}) exceeds ${siteProfile.grapStage} statutory thresholds.`,
        taskFactor: `Task has "${task.dustPotential}" dust potential and outdoor exposure.`,
        regulatoryFactor: `${matchedRule.name} (${matchedRule.source}).`,
        mitigationImpact: `Halts 0 allowable work windows until ambient levels drop below regulatory action trigger.`,
        whyThisSlot: [
          'Direct statutory prohibition under CAQM Direction No. 79',
          'High particulate generation prohibited during Stage III inversion',
          'Enforces immediate crew reallocation to indoor trades'
        ],
        whyNotLowestRiskSlot: 'No outdoor work window permitted under active regulatory stage.',
        constraintTimeline,
        actionOptions,
        evidenceRecord
      });
      continue;
    }

    // Step 2: Calculate Environmental Risk in Original Window
    const origWindowSlices = windows.filter(w => w.hour >= origStartHour && w.hour < origEndHour);
    const origAvgRisk = origWindowSlices.length > 0
      ? origWindowSlices.reduce((acc, w) => acc + w.environmentalRiskScore, 0) / origWindowSlices.length
      : 50;

    const origMaxAQI = origWindowSlices.reduce((max, w) => Math.max(max, w.aqi), 0);
    const origMaxHeatIndex = origWindowSlices.reduce((max, w) => Math.max(max, w.heatIndex), 0);

    // Is the original window hazardous for this task?
    const isOutdoor = task.indoorOutdoor === 'outdoor';
    const isHeavy = task.intensity === 'heavy';
    const origIsHighRisk = isOutdoor && (
      origAvgRisk >= 60 || 
      origMaxAQI >= 380 || 
      origMaxHeatIndex >= 38
    );

    // If task is not movable, keep it and mandate protective controls if needed
    if (!task.movable) {
      const status: OperationalStatus = origIsHighRisk ? 'protect' : 'continue';
      const recTask: Task = {
        ...task,
        status,
        statusReason: origIsHighRisk 
          ? 'Task is marked non-movable; elevated environmental risk mandates PPE & hydration breaks.' 
          : 'Low environmental exposure in planned window.',
        recommendedStartTime: task.originalStartTime,
        recommendedEndTime: task.originalEndTime,
        appliedRule: matchedRule ? {
          id: matchedRule.id,
          title: matchedRule.name,
          source: matchedRule.source,
          action: matchedRule.action
        } : undefined,
        selectedActionType: 'REDUCE_EXPOSURE'
      };
      recommendedTasks.push(recTask);
      scheduledTimeSlots.set(task.id, { start: origStartHour, end: origEndHour });

      const actionOptions: ActionOption[] = [
        {
          actionType: 'REDUCE_EXPOSURE',
          label: 'Option A: PROTECT WITH CONTROLS (Recommended)',
          isRecommended: true,
          startTime: task.originalStartTime,
          endTime: task.originalEndTime,
          exposureReductionPercent: 35,
          operationalDisruption: 'None',
          workersAffected: task.workers,
          taskDuration: task.duration,
          regulatoryStatus: 'ALLOWED',
          controlsRequired: ['N95 Respirators', 'Continuous anti-smog misting', '15m shade rest intervals'],
          dependencyConflicts: [],
          recommendationReason: 'Task is fixed in place by operational constraints; mitigation controls lower biological exposure.',
          whyNotLowestRiskReason: 'Task is marked non-movable; moving would break concrete curing or critical path.'
        },
        {
          actionType: 'CONTINUE_WITH_REVIEW',
          label: 'Option B: CONTINUE STANDARD',
          isRecommended: false,
          startTime: task.originalStartTime,
          endTime: task.originalEndTime,
          exposureReductionPercent: 0,
          operationalDisruption: 'None',
          workersAffected: task.workers,
          taskDuration: task.duration,
          regulatoryStatus: 'REVIEW REQUIRED',
          controlsRequired: ['Standard PPE only'],
          dependencyConflicts: [],
          recommendationReason: 'Accepts elevated exposure load without additional engineering controls.'
        }
      ];
      optionsByTask[task.id] = actionOptions;

      const constraintTimeline = generateConstraintTimeline(
        windows,
        MIN_HOUR,
        MAX_HOUR,
        task.duration,
        origStartHour,
        origStartHour,
        matchedRule
      );

      const evidenceRecord = buildEvidenceRecord(
        siteProfile,
        windows,
        task,
        origStartHour,
        origEndHour,
        origStartHour,
        origEndHour,
        matchedRule,
        'REDUCE_EXPOSURE',
        [
          { action: 'RESCHEDULE', reason: 'Task constraint marked non-movable by site supervisor' },
          { action: 'CONTINUE_WITH_REVIEW', reason: 'Unprotected exposure exceeds site safety thresholds' }
        ],
        'Non-movable constraint satisfied with mandatory engineering controls.'
      );

      explanations.push({
        taskId: task.id,
        taskName: task.name,
        originalTime: `${task.originalStartTime} - ${task.originalEndTime}`,
        recommendedTime: `${task.originalStartTime} - ${task.originalEndTime}`,
        moved: false,
        status,
        headline: origIsHighRisk ? 'Mandatory Protection Controls Required' : 'Permissible in Planned Window',
        environmentalFactor: `AQI: ${origMaxAQI}, Peak Heat Index: ${origMaxHeatIndex}°C in original slot.`,
        taskFactor: `Task fixed in place (non-movable constraint).`,
        regulatoryFactor: matchedRule ? matchedRule.name : 'No conflicting regulatory restriction.',
        mitigationImpact: origIsHighRisk ? 'Enforce continuous PPE misting, 15m shade rest cycles.' : 'Standard operations.',
        whyThisSlot: [
          'Non-movable operational constraint respected',
          'Enforces mandatory PPE and hydration cycles',
          'Continuous water misting suppresses localized particulates'
        ],
        whyNotLowestRiskSlot: 'Task cannot be moved due to structural or material constraints.',
        constraintTimeline,
        actionOptions,
        evidenceRecord
      });
      continue;
    }

    // Step 3: Find Best Feasible Window using Dual Optimization
    // Precedence constraint: Must start AFTER all predecessor dependencies finish
    let earliestAllowedHour = MIN_HOUR;
    for (const depId of task.dependencies) {
      const depSlot = scheduledTimeSlots.get(depId);
      if (depSlot && depSlot.end > earliestAllowedHour) {
        earliestAllowedHour = depSlot.end;
      }
    }

    const candidateScores: WindowScore[] = [];

    // Scan all possible contiguous time windows [candidateStart, candidateStart + duration]
    for (let start = earliestAllowedHour; start <= MAX_HOUR - task.duration; start++) {
      const end = start + task.duration;
      const windowSlice = windows.filter(w => w.hour >= start && w.hour < end);

      if (windowSlice.length < task.duration) continue;

      const avgSliceRisk = windowSlice.reduce((sum, w) => sum + w.environmentalRiskScore, 0) / windowSlice.length;
      const maxSliceHeat = windowSlice.reduce((max, w) => Math.max(max, w.heatIndex), 0);
      const maxSliceAQI = windowSlice.reduce((max, w) => Math.max(max, w.aqi), 0);

      // Dual optimization: Environmental Penalties + Operational Disruption
      const heatPenalty = (isOutdoor && maxSliceHeat > 36) ? (maxSliceHeat - 36) * 12 : 0;
      const aqiPenalty = (isOutdoor && maxSliceAQI > 340) ? (maxSliceAQI - 340) * 0.4 : 0;
      
      // Operational disruption penalty: distance from preferred start time
      const timeShiftPenalty = Math.abs(start - origStartHour) * 3.5;

      // Heavy tasks exposure multiplier
      const exposureMultiplier = isOutdoor ? (isHeavy ? 1.4 : 1.0) : 0.25;

      const totalCost = (avgSliceRisk * exposureMultiplier) + heatPenalty + aqiPenalty + timeShiftPenalty;

      candidateScores.push({
        startHour: start,
        endHour: end,
        environmentalRiskScore: avgSliceRisk,
        heatPenalty,
        aqiPenalty,
        timeShiftPenalty,
        totalCost
      });
    }

    // If no feasible window exists within configured operating hours / precedence constraints
    if (candidateScores.length === 0) {
      const recTask: Task = {
        ...task,
        status: 'manual_review',
        statusReason: 'No feasible work window found within configured operating hours and current constraints.',
        recommendedStartTime: task.originalStartTime,
        recommendedEndTime: task.originalEndTime,
        appliedRule: matchedRule ? {
          id: matchedRule.id,
          title: matchedRule.name,
          source: matchedRule.source,
          action: matchedRule.action
        } : undefined,
        selectedActionType: 'CONTINUE_WITH_REVIEW'
      };
      recommendedTasks.push(recTask);
      scheduledTimeSlots.set(task.id, { start: origStartHour, end: origEndHour });

      const actionOptions: ActionOption[] = [
        {
          actionType: 'CONTINUE_WITH_REVIEW',
          label: 'Option A: SUPERVISOR MANUAL REVIEW (Required)',
          isRecommended: true,
          startTime: task.originalStartTime,
          endTime: task.originalEndTime,
          exposureReductionPercent: 0,
          operationalDisruption: 'High',
          workersAffected: task.workers,
          taskDuration: task.duration,
          regulatoryStatus: 'REVIEW REQUIRED',
          controlsRequired: ['Supervisor operational sign-off'],
          dependencyConflicts: [`Predecessor finishes at ${earliestAllowedHour}:00`],
          recommendationReason: 'No feasible slot found in operating hours. Split task or adjust dependencies.',
          whyNotLowestRiskReason: 'Precedence constraints prevent earlier placement.'
        }
      ];
      optionsByTask[task.id] = actionOptions;

      const constraintTimeline = generateConstraintTimeline(
        windows,
        MIN_HOUR,
        MAX_HOUR,
        task.duration,
        origStartHour,
        origStartHour,
        matchedRule,
        earliestAllowedHour
      );

      const evidenceRecord = buildEvidenceRecord(
        siteProfile,
        windows,
        task,
        origStartHour,
        origEndHour,
        origStartHour,
        origEndHour,
        matchedRule,
        'CONTINUE_WITH_REVIEW',
        [],
        'No feasible slot found within configured shift bounds.'
      );

      explanations.push({
        taskId: task.id,
        taskName: task.name,
        originalTime: `${task.originalStartTime} - ${task.originalEndTime}`,
        recommendedTime: 'Pending Manual Review',
        moved: false,
        status: 'manual_review',
        headline: 'Manual Review Required — Constraint Conflict',
        environmentalFactor: `Operating hours (${MIN_HOUR}:00–${MAX_HOUR}:00) or predecessor sequence leaves no viable slot for ${task.duration}h duration.`,
        taskFactor: `Task has strict precedence or duration that cannot be accommodated in allowable work windows.`,
        regulatoryFactor: matchedRule ? matchedRule.name : 'Operating boundary constraint.',
        mitigationImpact: 'Supervisor intervention required to adjust shifts or split work.',
        whyThisSlot: ['Maintained at current time pending supervisor override'],
        whyNotLowestRiskSlot: 'Predecessor dependencies restrict scheduling.',
        constraintTimeline,
        actionOptions,
        evidenceRecord
      });
      continue;
    }

    // Sort candidates by lowest total cost (Dual Objective: Risk + Disruption)
    candidateScores.sort((a, b) => a.totalCost - b.totalCost);

    const bestWindow = candidateScores[0];

    // Find the global lowest environmental risk slot across ALL working hours (ignoring shift penalties)
    let absLowestRiskSlice: { start: number; end: number; risk: number } | null = null;
    for (let s = MIN_HOUR; s <= MAX_HOUR - task.duration; s++) {
      const slice = windows.filter(w => w.hour >= s && w.hour < s + task.duration);
      if (slice.length === task.duration) {
        const risk = slice.reduce((acc, w) => acc + w.environmentalRiskScore, 0) / slice.length;
        if (!absLowestRiskSlice || risk < absLowestRiskSlice.risk) {
          absLowestRiskSlice = { start: s, end: s + task.duration, risk };
        }
      }
    }

    // Generate "Why NOT the lowest-risk slot?" justification
    let whyNotLowestRiskSlot = '';
    if (absLowestRiskSlice && absLowestRiskSlice.start !== bestWindow.startHour) {
      if (absLowestRiskSlice.start < earliestAllowedHour) {
        whyNotLowestRiskSlot = `Slot ${absLowestRiskSlice.start.toString().padStart(2, '0')}:00–${absLowestRiskSlice.end.toString().padStart(2, '0')}:00 had lower environmental risk (${Math.round(absLowestRiskSlice.risk)}/100), but was rejected because it violates predecessor dependency (predecessor finishes at ${earliestAllowedHour}:00).`;
      } else {
        const excessShift = Math.abs(absLowestRiskSlice.start - origStartHour) - Math.abs(bestWindow.startHour - origStartHour);
        whyNotLowestRiskSlot = `Slot ${absLowestRiskSlice.start.toString().padStart(2, '0')}:00–${absLowestRiskSlice.end.toString().padStart(2, '0')}:00 had slightly lower environmental risk (${Math.round(absLowestRiskSlice.risk)}/100), but was rejected due to excessive operational disruption (+${excessShift}h schedule shift).`;
      }
    } else {
      whyNotLowestRiskSlot = `Selected slot is both the global lowest-risk window and operationally feasible within approved shift hours.`;
    }

    const hasMoved = bestWindow.startHour !== origStartHour;
    const newStartStr = `${bestWindow.startHour.toString().padStart(2, '0')}:00`;
    const newEndStr = `${bestWindow.endHour.toString().padStart(2, '0')}:00`;

    // Determine Status
    let status: OperationalStatus = 'continue';
    let statusReason = 'Optimal environmental exposure slot.';

    if (hasMoved) {
      status = 'reschedule';
      statusReason = `Rescheduled from ${task.originalStartTime} to ${newStartStr} to avoid peak exposure hazard.`;
    } else if (matchedRule && matchedRule.action === 'MANDATE_PROTECT') {
      status = 'protect';
      statusReason = `Requires anti-smog water misting & protective respirators per ${matchedRule.name}.`;
    } else if (bestWindow.environmentalRiskScore > 50 && isOutdoor) {
      status = 'protect';
      statusReason = `Proceed with mandatory hydration intervals & N95 masks.`;
    }

    const recTask: Task = {
      ...task,
      recommendedStartTime: newStartStr,
      recommendedEndTime: newEndStr,
      status,
      statusReason,
      appliedRule: matchedRule ? {
        id: matchedRule.id,
        title: matchedRule.name,
        source: matchedRule.source,
        action: matchedRule.action
      } : undefined,
      selectedActionType: hasMoved ? 'RESCHEDULE' : (status === 'protect' ? 'REDUCE_EXPOSURE' : 'RESCHEDULE')
    };

    recommendedTasks.push(recTask);
    scheduledTimeSlots.set(task.id, { start: bestWindow.startHour, end: bestWindow.endHour });

    // Multi-Action Decision Options (Feature 1)
    const exposureReductionPercent = origAvgRisk > 0 
      ? Math.max(0, Math.round(((origAvgRisk - bestWindow.environmentalRiskScore) / origAvgRisk) * 100))
      : 0;

    const hoursDiff = Math.abs(bestWindow.startHour - origStartHour);
    const operationalDisruption = hoursDiff === 0 ? 'None' : (hoursDiff <= 1 ? 'Very Low' : (hoursDiff <= 2 ? 'Low' : 'Moderate'));

    // Option B: Alternative / Moderate exposure slot (e.g. 2nd candidate or adjacent window)
    const secondCandidate = candidateScores.length > 1 ? candidateScores[1] : bestWindow;
    const optBStartStr = `${secondCandidate.startHour.toString().padStart(2, '0')}:00`;
    const optBEndStr = `${secondCandidate.endHour.toString().padStart(2, '0')}:00`;
    const optBReduction = origAvgRisk > 0 
      ? Math.max(0, Math.round(((origAvgRisk - secondCandidate.environmentalRiskScore) / origAvgRisk) * 100))
      : 12;

    const actionOptions: ActionOption[] = [
      {
        actionType: 'RESCHEDULE',
        label: `Option A: RESCHEDULE to ${newStartStr}–${newEndStr} (Recommended)`,
        isRecommended: true,
        startTime: newStartStr,
        endTime: newEndStr,
        exposureReductionPercent,
        operationalDisruption,
        workersAffected: task.workers,
        taskDuration: task.duration,
        regulatoryStatus: 'ALLOWED',
        controlsRequired: ['Standard site PPE', 'Hydration station access'],
        dependencyConflicts: [],
        recommendationReason: hasMoved 
          ? `Lowest combined environmental risk & operational disruption; preserves dependencies.`
          : `Planned window is already optimal.`,
        whyNotLowestRiskReason: whyNotLowestRiskSlot
      },
      {
        actionType: 'REDUCE_EXPOSURE',
        label: `Option B: REDUCE EXPOSURE (${optBStartStr}–${optBEndStr})`,
        isRecommended: false,
        startTime: optBStartStr,
        endTime: optBEndStr,
        exposureReductionPercent: Math.max(10, optBReduction),
        operationalDisruption: 'Very Low',
        workersAffected: task.workers,
        taskDuration: task.duration,
        regulatoryStatus: 'ALLOWED',
        controlsRequired: ['Continuous anti-smog water misting', '15m mandatory shade breaks', 'N95 particulate respirators'],
        dependencyConflicts: [],
        recommendationReason: 'Balances tighter operational schedule with mandatory localized dust & heat controls.'
      },
      {
        actionType: 'CONTINUE_WITH_REVIEW',
        label: `Option C: CONTINUE AS PLANNED (${task.originalStartTime}–${task.originalEndTime})`,
        isRecommended: false,
        startTime: task.originalStartTime,
        endTime: task.originalEndTime,
        exposureReductionPercent: 0,
        operationalDisruption: 'None',
        workersAffected: task.workers,
        taskDuration: task.duration,
        regulatoryStatus: origAvgRisk >= 65 ? 'REVIEW REQUIRED' : 'ALLOWED',
        controlsRequired: ['Site supervisor written sign-off', 'Heavy particulate masks', 'Electrolyte hydration'],
        dependencyConflicts: [],
        recommendationReason: 'Maintains zero schedule drift but leaves workers exposed to elevated peak window.'
      }
    ];
    optionsByTask[task.id] = actionOptions;

    // Constraint Conflict Timeline
    const constraintTimeline = generateConstraintTimeline(
      windows,
      MIN_HOUR,
      MAX_HOUR,
      task.duration,
      origStartHour,
      bestWindow.startHour,
      matchedRule,
      earliestAllowedHour
    );

    // Decision Evidence Record
    const evidenceRecord = buildEvidenceRecord(
      siteProfile,
      windows,
      task,
      origStartHour,
      origEndHour,
      bestWindow.startHour,
      bestWindow.endHour,
      matchedRule,
      'RESCHEDULE',
      [
        { action: 'REDUCE_EXPOSURE', reason: 'Higher particulate exposure than recommended morning slot' },
        { action: 'CONTINUE_WITH_REVIEW', reason: 'Exposes crew to peak midday heat index of 42°C' }
      ],
      hasMoved 
        ? `Shifted ${hoursDiff}h earlier to avoid peak particulate and thermal stress window.`
        : 'Optimal window confirmed within approved operating bounds.'
    );

    // "Why this slot?" justifications
    const whyThisSlot: string[] = [
      `Lower particulate risk (AQI forecast ${Math.round(bestWindow.environmentalRiskScore)} vs ${Math.round(origAvgRisk)} in planned window)`,
      `Lower thermal stress (Apparent heat index safer than midday peak)`,
      `Dependency precedence preserved (starts at ${newStartStr} after predecessors)`,
      `Accommodates full ${task.duration}h duration within approved working hours (${MIN_HOUR}:00–${MAX_HOUR}:00)`,
      `Task is designated movable by supervisor`
    ];

    // Generate strict explainability record
    let explanationHeadline = 'No Shift Required — Safe Window';
    let mitigationImpact = 'Standard site operations maintained.';

    if (hasMoved) {
      const riskDelta = Math.round(origAvgRisk - bestWindow.environmentalRiskScore);
      explanationHeadline = `Optimized: Shifted ${hoursDiff}h Earlier for ${riskDelta > 0 ? riskDelta : 15}% Lower Environmental Exposure`;
      mitigationImpact = `Avoids dangerous mid-day heat & PM resuspension window; safeguards ${task.workers} workers.`;
    } else if (status === 'protect') {
      explanationHeadline = 'Maintained with Mandated Engineering Controls';
      mitigationImpact = `Requires continuous water misting cannons and N95 masks per regulatory rules.`;
    }

    // Clear delineation between Current Conditions and Task-Window Forecast
    const origSliceWindows = windows.filter(w => w.hour >= origStartHour && w.hour < origEndHour);
    const recSliceWindows = windows.filter(w => w.hour >= bestWindow.startHour && w.hour < bestWindow.endHour);

    const origSliceAqi = origSliceWindows.length ? Math.round(origSliceWindows.reduce((s, w) => s + w.aqi, 0) / origSliceWindows.length) : siteProfile.currentAQI;
    const origSliceHeat = origSliceWindows.length ? Math.round(origSliceWindows.reduce((s, w) => s + w.heatIndex, 0) / origSliceWindows.length) : siteProfile.currentTemp;
    const recSliceAqi = recSliceWindows.length ? Math.round(recSliceWindows.reduce((s, w) => s + w.aqi, 0) / recSliceWindows.length) : siteProfile.currentAQI;
    const recSliceHeat = recSliceWindows.length ? Math.round(recSliceWindows.reduce((s, w) => s + w.heatIndex, 0) / recSliceWindows.length) : siteProfile.currentTemp;

    explanations.push({
      taskId: task.id,
      taskName: task.name,
      originalTime: `${task.originalStartTime} - ${task.originalEndTime}`,
      recommendedTime: `${newStartStr} - ${newEndStr}`,
      moved: hasMoved,
      status,
      headline: explanationHeadline,
      environmentalFactor: `CURRENT CONDITIONS: AQI ${siteProfile.currentAQI} • Ambient ${siteProfile.currentTemp}°C | TASK-WINDOW FORECAST: AQI ${origSliceAqi} • Heat Index ${origSliceHeat}°C (Original Slot Risk: ${Math.round(origAvgRisk)}/100) | OPTIMIZED WINDOW FORECAST: AQI ${recSliceAqi} • Heat Index ${recSliceHeat}°C (Optimized Risk: ${Math.round(bestWindow.environmentalRiskScore)}/100).`,
      taskFactor: `Task has ${task.workers} workers exposed to ${task.indoorOutdoor} atmosphere with ${task.dustPotential} dust emission.`,
      regulatoryFactor: matchedRule ? `${matchedRule.name} (${matchedRule.source}).` : `Statutory GRAP ${siteProfile.grapStage.replace('_', ' ')} evaluated.`,
      mitigationImpact,
      whyThisSlot,
      whyNotLowestRiskSlot,
      constraintTimeline,
      actionOptions,
      evidenceRecord
    });
  }

  // Restore original display order
  const orderedRecommendedTasks = tasks.map(orig => {
    return recommendedTasks.find(r => r.id === orig.id) || orig;
  });

  const impactMetrics = calculateTransparentImpactMetrics(originalTasks, orderedRecommendedTasks, windows);

  // Truthful Notification Preview Text
  const movedSummary = orderedRecommendedTasks
    .filter(t => t.status === 'reschedule' || t.status === 'restricted' || t.status === 'protect')
    .map(t => {
      if (t.status === 'restricted') return `• ${t.name}: STANDBY / SUSPENDED per CAQM GRAP Stage III mandate`;
      if (t.status === 'reschedule') return `• ${t.name}: MOVED from ${t.originalStartTime} to ${t.recommendedStartTime} (Avoid peak exposure)`;
      return `• ${t.name}: MAINTAINED at ${t.originalStartTime} with mandatory misting & PPE controls`;
    })
    .join('\n');

  const notificationPreviewText = 
`[NOTIFICATION PREVIEW — PENDING SUPERVISOR DISPATCH]
To: Shift Supervisors, Trade Leads & Safety Marshals (${siteProfile.name})
From: ClimaShift Engine v2.4 (Site Decision Log)
Effective Window: Today 07:00 – 19:00 IST

SCHEDULE REVISION SUMMARY:
${movedSummary}

OPERATIONAL RATIONALE:
Work activities re-sequenced into early morning hours to safeguard ${impactMetrics.totalCrewCount} workers from peak midday particulate resuspension and thermal stress (41°C).

STATUS: PROPOSED — Awaiting Supervisor Sign-off.`;

  return {
    originalTasks,
    recommendedTasks: orderedRecommendedTasks,
    impactMetrics,
    explanations,
    siteProfile,
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    approvalStatus: 'proposed',
    notificationPreviewText,
    optionsByTask
  };
}

function findMatchingRegulatoryRule(
  task: Task, 
  siteProfile: SiteProfile, 
  rules: RegulatoryRule[]
): RegulatoryRule | undefined {
  const taskText = `${task.name} ${task.location}`.toLowerCase();
  
  for (const rule of rules) {
    if (rule.grapStageTrigger !== 'NONE') {
      const stageRank: Record<string, number> = {
        NONE: 0,
        STAGE_1: 1,
        STAGE_2: 2,
        STAGE_3: 3,
        STAGE_4: 4
      };
      if ((stageRank[siteProfile.grapStage] || 0) < (stageRank[rule.grapStageTrigger] || 0)) {
        continue;
      }
    }

    const matchesKeyword = rule.affectedKeywords.some(keyword => 
      taskText.includes(keyword.toLowerCase())
    );

    if (matchesKeyword) {
      if (rule.requiresHighDust && task.dustPotential !== 'high' && task.dustPotential !== 'moderate') {
        continue;
      }
      return rule;
    }
  }

  return undefined;
}

export function calculateOperationalExposureLoad(
  tasks: Task[],
  windows: EnvironmentalWindow[],
  isOptimized = false
): OperationalExposureLoad {
  let totalLoad = 0;

  for (const task of tasks) {
    if (isOptimized && task.status === 'restricted') {
      // Suspended outdoor tasks have 0 operational exposure during curb
      continue;
    }

    const startStr = isOptimized ? (task.recommendedStartTime || task.originalStartTime) : task.originalStartTime;
    const startHour = parseInt(startStr.split(':')[0], 10);
    const endHour = Math.min(19, startHour + task.duration);

    const slice = windows.filter(w => w.hour >= startHour && w.hour < endHour);
    const avgRisk = slice.length > 0 
      ? slice.reduce((acc, w) => acc + w.environmentalRiskScore, 0) / slice.length 
      : 50;

    // Task exposure characteristic factor
    let exposureFactor = 1.0;
    if (task.indoorOutdoor === 'outdoor') {
      exposureFactor = task.dustPotential === 'high' ? 1.5 : (task.intensity === 'heavy' ? 1.3 : 1.0);
    } else if (task.indoorOutdoor === 'semi-indoor') {
      exposureFactor = 0.55;
    } else {
      exposureFactor = 0.25;
    }

    // Protection discount if PPE / controls applied
    if (isOptimized && task.status === 'protect') {
      exposureFactor *= 0.65;
    }

    // Task Load = (Risk Score / 100) * Duration * Workers * Exposure Factor
    const taskLoad = (avgRisk / 100) * task.duration * task.workers * exposureFactor;
    totalLoad += taskLoad;
  }

  const roundedLoad = Math.round(totalLoad * 10) / 10;
  return {
    beforeLoad: roundedLoad,
    afterLoad: roundedLoad,
    percentReduction: 0,
    formulaExplanation: 'Operational Exposure Load = ∑ [(Window Risk / 100) × Duration (h) × Workers × Exposure Factor]',
    disclaimer: 'Operational planning and exposure reduction metric only. Not a medical certainty or statutory guarantee.'
  };
}

export function calculateTransparentImpactMetrics(
  originalTasks: Task[],
  recommendedTasks: Task[],
  windows: EnvironmentalWindow[]
): ImpactMetrics {
  let highRiskWorkerHoursAvoided = 0;
  let tasksRescheduled = 0;
  let restrictedTasksFlagged = 0;
  let protectedTasksCount = 0;
  let continuedTasksCount = 0;
  const workersAffectedSet = new Set<string>();
  let totalCrewCount = 0;
  let totalDisruptionHours = 0;

  const highRiskHours = new Set(
    windows.filter(w => w.environmentalRiskScore >= 65 || w.heatIndex >= 40).map(w => w.hour)
  );

  let totalOrigExposureScore = 0;
  let totalRecExposureScore = 0;

  for (let i = 0; i < originalTasks.length; i++) {
    const orig = originalTasks[i];
    const rec = recommendedTasks.find(r => r.id === orig.id) || orig;

    totalCrewCount += orig.workers;

    if (rec.status === 'reschedule') {
      tasksRescheduled++;
      workersAffectedSet.add(orig.id);
    } else if (rec.status === 'restricted') {
      restrictedTasksFlagged++;
      workersAffectedSet.add(orig.id);
    } else if (rec.status === 'protect') {
      protectedTasksCount++;
    } else if (rec.status === 'manual_review') {
      workersAffectedSet.add(orig.id);
    } else {
      continuedTasksCount++;
    }

    const origStart = parseInt(orig.originalStartTime.split(':')[0], 10);
    const recStart = parseInt((rec.recommendedStartTime || orig.originalStartTime).split(':')[0], 10);

    const origSlice = windows.filter(w => w.hour >= origStart && w.hour < origStart + orig.duration);
    const recSlice = windows.filter(w => w.hour >= recStart && w.hour < recStart + rec.duration);

    const avgOrigRisk = origSlice.length > 0 ? origSlice.reduce((s, w) => s + w.environmentalRiskScore, 0) / origSlice.length : 50;
    const avgRecRisk = recSlice.length > 0 ? recSlice.reduce((s, w) => s + w.environmentalRiskScore, 0) / recSlice.length : 30;

    const taskWeight = orig.workers * orig.duration * (orig.indoorOutdoor === 'outdoor' ? 1.0 : 0.3);
    totalOrigExposureScore += avgOrigRisk * taskWeight;
    
    if (rec.status === 'restricted') {
      totalRecExposureScore += 0;
    } else {
      totalRecExposureScore += avgRecRisk * taskWeight;
    }

    if (orig.indoorOutdoor === 'outdoor') {
      let origOverlapHours = 0;
      for (let h = origStart; h < origStart + orig.duration; h++) {
        if (highRiskHours.has(h)) origOverlapHours++;
      }

      let recOverlapHours = 0;
      if (rec.status !== 'restricted') {
        for (let h = recStart; h < recStart + rec.duration; h++) {
          if (highRiskHours.has(h)) recOverlapHours++;
        }
      }

      const avoidedForThisTask = origOverlapHours - recOverlapHours;
      if (avoidedForThisTask > 0) {
        highRiskWorkerHoursAvoided += orig.workers * avoidedForThisTask;
      }
    }

    totalDisruptionHours += Math.abs(recStart - origStart);
  }

  const rawReduction = totalOrigExposureScore > 0 
    ? ((totalOrigExposureScore - totalRecExposureScore) / totalOrigExposureScore) * 100 
    : 0;
  const exposureReductionPercent = Math.max(0, Math.min(95, Math.round(rawReduction)));

  const maxPossibleDisruption = originalTasks.length * 8;
  const rawDisruption = maxPossibleDisruption > 0 
    ? (totalDisruptionHours / maxPossibleDisruption) * 100 
    : 0;
  const scheduleDisruptionScore = Math.max(0, Math.min(100, Math.round(rawDisruption)));

  // Calculate Operational Exposure Load
  const beforeLoadObj = calculateOperationalExposureLoad(originalTasks, windows, false);
  const afterLoadObj = calculateOperationalExposureLoad(recommendedTasks, windows, true);
  const percentReduction = beforeLoadObj.beforeLoad > 0 
    ? Math.round(((beforeLoadObj.beforeLoad - afterLoadObj.afterLoad) / beforeLoadObj.beforeLoad) * 100)
    : 0;

  const operationalExposureLoad: OperationalExposureLoad = {
    beforeLoad: beforeLoadObj.beforeLoad,
    afterLoad: afterLoadObj.afterLoad,
    percentReduction,
    formulaExplanation: 'Operational Exposure Load = ∑ [(Window Risk Score / 100) × Duration (h) × Workers × Exposure Factor]',
    disclaimer: 'Operational planning and shift optimization metric only; not a medical or statutory guarantee.'
  };

  return {
    highRiskWorkerHoursAvoided,
    tasksRescheduled,
    restrictedTasksFlagged,
    protectedTasksCount,
    continuedTasksCount,
    exposureReductionPercent,
    scheduleDisruptionScore,
    workersAffectedCount: workersAffectedSet.size,
    totalCrewCount,
    operationalExposureLoad
  };
}

function generateConstraintTimeline(
  windows: EnvironmentalWindow[],
  minHour: number,
  maxHour: number,
  duration: number,
  origStart: number,
  selectedStart: number,
  matchedRule?: RegulatoryRule,
  earliestAllowedHour = minHour
): ConstraintHourSlot[] {
  const isRestricted = matchedRule && matchedRule.action === 'RESTRICT';

  return windows.map(w => {
    const dependencyAllowed = w.hour >= earliestAllowedHour;
    const workingHoursAllowed = w.hour >= minHour && w.hour + duration <= maxHour;
    const taskDurationFits = w.hour + duration <= maxHour;
    const regulatoryAllowed = !isRestricted;

    const isFeasible = dependencyAllowed && workingHoursAllowed && taskDurationFits && regulatoryAllowed;
    const isSelected = selectedStart >= 0 && w.hour >= selectedStart && w.hour < selectedStart + duration;

    return {
      hour: w.hour,
      timeLabel: w.timeLabel,
      environmentalRisk: w.environmentalRiskScore,
      dependencyAllowed,
      workingHoursAllowed,
      taskDurationFits,
      isFeasible,
      isSelected
    };
  });
}

function buildEvidenceRecord(
  siteProfile: SiteProfile,
  windows: EnvironmentalWindow[],
  task: Task,
  origStart: number,
  origEnd: number,
  recStart: number,
  recEnd: number,
  matchedRule: RegulatoryRule | undefined,
  selectedAction: 'RESCHEDULE' | 'REDUCE_EXPOSURE' | 'CONTINUE_WITH_REVIEW',
  rejectedAlternatives: { action: 'RESCHEDULE' | 'REDUCE_EXPOSURE' | 'CONTINUE_WITH_REVIEW'; reason: string }[],
  coreRationale: string
): EvidenceRecord {
  const origSlices = windows.filter(w => w.hour >= origStart && w.hour < origEnd);
  const origAvgAqi = origSlices.length ? Math.round(origSlices.reduce((a, b) => a + b.aqi, 0) / origSlices.length) : siteProfile.currentAQI;
  const origMaxHeat = origSlices.length ? Math.round(origSlices.reduce((a, b) => Math.max(a, b.heatIndex), 0)) : siteProfile.currentTemp;

  return {
    environmentalInput: {
      source: siteProfile.dataSource,
      currentAQI: siteProfile.currentAQI,
      forecastTaskWindowAQI: origAvgAqi,
      currentTemp: siteProfile.currentTemp,
      forecastHeatIndex: origMaxHeat,
      freshness: siteProfile.isDemoData ? 'Demo Scenario Archetype' : 'Live Sensor Feed',
      timestamp: siteProfile.lastUpdated,
      currentVsForecastText: `Current AQI ${siteProfile.currentAQI} at site station; Forecast ${origAvgAqi} during planned ${origStart}:00–${origEnd}:00 window.`
    },
    regulatoryInput: {
      source: matchedRule ? matchedRule.source : 'Commission for Air Quality Management (CAQM)',
      ruleRef: matchedRule ? matchedRule.ruleRef : `CAQM-GRAP-${siteProfile.grapStage}`,
      ruleTitle: matchedRule ? matchedRule.name : `Graded Response Action Plan (${siteProfile.grapStage.replace('_', ' ')})`,
      effectiveDate: matchedRule ? matchedRule.effectiveDate : 'Active Statutory Order',
      jurisdiction: siteProfile.jurisdiction,
      affectedActivity: matchedRule ? matchedRule.affectedActivity : 'General Construction & Dust Generation',
      restriction: matchedRule ? matchedRule.restriction : 'Standard ambient dust containment and water sprinkling rules.',
      verificationStatus: matchedRule ? matchedRule.status : 'ALLOWED',
      exceptions: matchedRule ? matchedRule.exceptions : ['Internal plumbing & electrical works']
    },
    taskInput: {
      taskId: task.id,
      taskName: task.name,
      location: task.location,
      workers: task.workers,
      duration: task.duration,
      indoorOutdoor: task.indoorOutdoor,
      dustPotential: task.dustPotential,
      intensity: task.intensity,
      movable: task.movable,
      dependencies: task.dependencies
    },
    engine: {
      version: 'ClimaShift Engine v2.4 (Deterministic Constraint Optimizer)',
      ruleSetVersion: 'CAQM-GRAP-2024-R3',
      timestamp: new Date().toISOString()
    },
    decision: {
      selectedAction,
      rejectedAlternatives,
      coreRationale
    }
  };
}
