import { 
  Task, 
  EnvironmentalWindow, 
  RegulatoryRule, 
  ReplanResult, 
  TaskExplanation, 
  ImpactMetrics, 
  SiteProfile,
  OperationalStatus 
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

    // If hard regulatory restriction applies and cannot be avoided by window shifting
    if (matchedRule && matchedRule.action === 'RESTRICT') {
      const recTask: Task = {
        ...task,
        status: 'restricted',
        statusReason: `Prohibited under ${matchedRule.jurisdiction} ${matchedRule.name}.`,
        appliedRule: {
          id: matchedRule.id,
          title: matchedRule.name,
          source: matchedRule.source,
          action: 'RESTRICT'
        },
        recommendedStartTime: task.originalStartTime,
        recommendedEndTime: task.originalEndTime
      };
      
      recommendedTasks.push(recTask);
      scheduledTimeSlots.set(task.id, { start: origStartHour, end: origEndHour });

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
        mitigationImpact: `Halts 0 allowable work windows until ambient levels drop below regulatory action trigger.`
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
        } : undefined
      };
      recommendedTasks.push(recTask);
      scheduledTimeSlots.set(task.id, { start: origStartHour, end: origEndHour });

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
        mitigationImpact: origIsHighRisk ? 'Enforce continuous PPE misting, 15m shade rest cycles.' : 'Standard operations.'
      });
      continue;
    }

    // Step 3: Find Best Feasible Window
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

      // Penalties
      const heatPenalty = (isOutdoor && maxSliceHeat > 36) ? (maxSliceHeat - 36) * 12 : 0;
      const aqiPenalty = (isOutdoor && maxSliceAQI > 340) ? (maxSliceAQI - 340) * 0.4 : 0;
      
      // Preference penalty: slight penalty for shifting away from preferred start time
      const timeShiftPenalty = Math.abs(start - origStartHour) * 3.5;

      // Heavy tasks indoor vs outdoor exposure multiplier
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

    // Sort candidates by lowest total cost
    candidateScores.sort((a, b) => a.totalCost - b.totalCost);

    const bestWindow = candidateScores[0] || {
      startHour: origStartHour,
      endHour: origEndHour,
      environmentalRiskScore: origAvgRisk,
      totalCost: 100
    };

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
      } : undefined
    };

    recommendedTasks.push(recTask);
    scheduledTimeSlots.set(task.id, { start: bestWindow.startHour, end: bestWindow.endHour });

    // Generate strict explainability record
    let explanationHeadline = 'No Shift Required — Safe Window';
    let mitigationImpact = 'Standard site operations maintained.';

    if (hasMoved) {
      const hoursDiff = Math.abs(bestWindow.startHour - origStartHour);
      const riskDelta = Math.round(origAvgRisk - bestWindow.environmentalRiskScore);
      explanationHeadline = `Optimized: Shifted ${hoursDiff}h Earlier for ${riskDelta > 0 ? riskDelta : 15}% Lower Environmental Exposure`;
      mitigationImpact = `Avoids dangerous mid-day heat & PM resuspension window; safeguards ${task.workers} workers.`;
    } else if (status === 'protect') {
      explanationHeadline = 'Maintained with Mandated Engineering Controls';
      mitigationImpact = `Requires continuous water misting cannons and N95 masks per regulatory rules.`;
    }

    explanations.push({
      taskId: task.id,
      taskName: task.name,
      originalTime: `${task.originalStartTime} - ${task.originalEndTime}`,
      recommendedTime: `${newStartStr} - ${newEndStr}`,
      moved: hasMoved,
      status,
      headline: explanationHeadline,
      environmentalFactor: `Original slot: Risk ${Math.round(origAvgRisk)}/100 (AQI ${origMaxAQI}, Heat Index ${origMaxHeatIndex}°C). Selected slot: Risk ${Math.round(bestWindow.environmentalRiskScore)}/100.`,
      taskFactor: `${task.indoorOutdoor.toUpperCase()} activity with ${task.intensity} metabolic intensity and ${task.workers} workers.`,
      regulatoryFactor: matchedRule ? `${matchedRule.name} (${matchedRule.source})` : 'Compliant with all active site environmental thresholds.',
      mitigationImpact
    });
  }

  // Restore task order to match user original sequence
  const orderedRecommendedTasks = originalTasks.map(orig => {
    return recommendedTasks.find(r => r.id === orig.id) || orig;
  });

  // Calculate Impact Metrics transparently
  const impactMetrics = calculateTransparentImpactMetrics(originalTasks, orderedRecommendedTasks, windows);

  // Generate worker notification preview text
  const notificationPreviewText = generateNotificationPreview(siteProfile, orderedRecommendedTasks);

  return {
    originalTasks,
    recommendedTasks: orderedRecommendedTasks,
    impactMetrics,
    explanations,
    siteProfile,
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    approvalStatus: 'pending',
    notificationPreviewText
  };
}

function findMatchingRegulatoryRule(
  task: Task, 
  siteProfile: SiteProfile, 
  rules: RegulatoryRule[]
): RegulatoryRule | undefined {
  const taskText = `${task.name} ${task.location}`.toLowerCase();
  
  for (const rule of rules) {
    // Stage check: Is site at or above the rule trigger stage?
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

    // Keyword match
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

  // Set of hours where composite risk is high (>= 60)
  const highRiskHours = new Set(
    windows.filter(w => w.environmentalRiskScore >= 60 || w.aqi >= 380 || w.heatIndex >= 38).map(w => w.hour)
  );

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
    } else {
      continuedTasksCount++;
    }

    // Calculate High-Risk Worker-Hours Avoided
    if (orig.indoorOutdoor === 'outdoor') {
      const origStart = parseInt(orig.originalStartTime.split(':')[0], 10);
      const recStart = parseInt((rec.recommendedStartTime || orig.originalStartTime).split(':')[0], 10);
      
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

      const avoidedHours = Math.max(0, origOverlapHours - recOverlapHours);
      highRiskWorkerHoursAvoided += (orig.workers * avoidedHours);

      // Disruption penalty
      totalDisruptionHours += Math.abs(recStart - origStart);
    }
  }

  // Calculate disruption score 0 to 100
  const scheduleDisruptionScore = Math.min(100, Math.round((totalDisruptionHours / Math.max(1, originalTasks.length * 4)) * 100));

  // Count total workers affected by shifts or restrictions
  const workersAffectedCount = originalTasks
    .filter(t => workersAffectedSet.has(t.id))
    .reduce((sum, t) => sum + t.workers, 0);

  return {
    highRiskWorkerHoursAvoided,
    tasksRescheduled,
    restrictedTasksFlagged,
    protectedTasksCount,
    continuedTasksCount,
    scheduleDisruptionScore,
    workersAffectedCount,
    totalCrewCount
  };
}

export function generateNotificationPreview(siteProfile: SiteProfile, tasks: Task[]): string {
  const rescheduled = tasks.filter(t => t.status === 'reschedule');
  const restricted = tasks.filter(t => t.status === 'restricted');
  const protectedTasks = tasks.filter(t => t.status === 'protect');

  let message = `🚨 [CLIMASHIFT SITE ADVISORY] ${siteProfile.name}\n`;
  message += `Environmental Status: AQI ${siteProfile.currentAQI} (${siteProfile.grapStage}). Temperature: ${siteProfile.currentTemp}°C.\n\n`;

  if (rescheduled.length > 0) {
    message += `⏰ SCHEDULE CHANGES:\n`;
    rescheduled.forEach(t => {
      message += `• ${t.name} (${t.location}): Moved from ${t.originalStartTime} ➔ ${t.recommendedStartTime} (${t.workers} crew members).\n`;
    });
    message += `\n`;
  }

  if (restricted.length > 0) {
    message += `🛑 SUSPENDED ACTIVITIES:\n`;
    restricted.forEach(t => {
      message += `• ${t.name}: Suspended per statutory environmental order.\n`;
    });
    message += `\n`;
  }

  if (protectedTasks.length > 0) {
    message += `🛡️ MANDATORY CONTROLS:\n`;
    protectedTasks.forEach(t => {
      message += `• ${t.name}: Ensure misting cannon & N95 masks active.\n`;
    });
    message += `\n`;
  }

  message += `Please confirm receipt with your Shift Supervisor before beginning tasks.`;
  return message;
}
