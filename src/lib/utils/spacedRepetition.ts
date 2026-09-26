import { Topic, UnderstandingRating, DailyPlan, StudyPlanTask } from '../types';

export function calculateNextRevisionDate(
  lastStudiedDate: Date,
  previousIntervalDays: number = 1,
  rating: UnderstandingRating = 'good'
): { nextDate: Date; newIntervalDays: number } {
  let multiplier = 1.0;

  switch (rating) {
    case 'poor':
      multiplier = 0.4; // Retest quickly
      break;
    case 'okay':
      multiplier = 1.0;
      break;
    case 'good':
      multiplier = 1.8;
      break;
    case 'excellent':
      multiplier = 2.5; // Extend interval
      break;
  }

  const newIntervalDays = Math.max(1, Math.round(previousIntervalDays * multiplier));
  const nextDate = new Date(lastStudiedDate.getTime() + newIntervalDays * 24 * 60 * 60 * 1000);

  return { nextDate, newIntervalDays };
}

export function redistributeMissedTasks(
  plans: DailyPlan[],
  missedTaskId: string
): DailyPlan[] {
  const updatedPlans = JSON.parse(JSON.stringify(plans)) as DailyPlan[];
  
  let missedTask: StudyPlanTask | undefined;

  // Find missed task
  for (const plan of updatedPlans) {
    const taskIndex = plan.tasks.findIndex(t => t.id === missedTaskId);
    if (taskIndex !== -1) {
      missedTask = plan.tasks[taskIndex];
      plan.tasks[taskIndex].status = 'skipped';
      break;
    }
  }

  if (!missedTask) return plans;

  // Clone task to reschedule
  const rescheduledTask: StudyPlanTask = {
    ...missedTask,
    id: `resched-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: 'pending',
    scheduledTime: undefined
  };

  // Find target day with lowest total minutes (avoiding overloading tomorrow!)
  const futurePlans = updatedPlans.filter(p => p.label !== 'Today');
  const targetPlan = futurePlans.sort((a, b) => {
    const totalA = a.tasks.reduce((sum, t) => sum + (t.status === 'pending' ? t.estimatedMinutes : 0), 0);
    const totalB = b.tasks.reduce((sum, t) => sum + (t.status === 'pending' ? t.estimatedMinutes : 0), 0);
    return totalA - totalB;
  })[0] || updatedPlans[updatedPlans.length - 1];

  if (targetPlan) {
    targetPlan.tasks.push(rescheduledTask);
    targetPlan.isAdjusted = true;
  }

  return updatedPlans;
}
