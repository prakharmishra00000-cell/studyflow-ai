import { Topic, BrainState, ExamReadiness, UserProfile } from '../types';

export function getBrainState(topic: Topic): BrainState {
  if (!topic.lastStudied && topic.mastery <= 30) return 'Not Started';
  if (topic.revisionRisk === 'High Risk') return 'Needs Review';
  if (topic.mastery >= 85) return 'Mastered';
  if (topic.mastery >= 70) return 'Strong';
  if (topic.mastery >= 50) return 'Learning';
  return 'Needs Practice';
}

export function calculateExamReadiness(
  topics: Topic[],
  profile: UserProfile,
  daysUntilExam: number
): ExamReadiness {
  if (!topics || topics.length === 0) {
    return {
      percentage: 71,
      strongSubjects: ['Manufacturing Tech'],
      improvingSubjects: ['Strength of Materials (SOM)'],
      needsAttentionSubjects: ['Thermodynamics'],
      criticalTopics: ['Entropy & Second Law Numericals'],
      nextBestAction: {
        topicName: 'Entropy & Second Law',
        actionText: 'Practice 10 Entropy & Carnot Cycle numerical problems.',
        recommendedDuration: 15
      }
    };
  }

  // Calculate weighted average mastery
  const totalWeight = topics.reduce((sum, t) => sum + (t.importance || 5), 0);
  const weightedMasterySum = topics.reduce((sum, t) => sum + (t.mastery * (t.importance || 5)), 0);
  const rawPercentage = Math.round(weightedMasterySum / Math.max(1, totalWeight));

  // Readiness adjusted by time remaining
  const timeFactor = Math.min(1.1, Math.max(0.85, (100 - daysUntilExam) / 100));
  const finalPercentage = Math.min(98, Math.max(15, Math.round(rawPercentage * timeFactor)));

  // Group subjects by readiness status
  const subjectScores: Record<string, { total: number; count: number }> = {};
  topics.forEach(t => {
    if (!subjectScores[t.subjectName]) {
      subjectScores[t.subjectName] = { total: 0, count: 0 };
    }
    subjectScores[t.subjectName].total += t.mastery;
    subjectScores[t.subjectName].count += 1;
  });

  const strongSubjects: string[] = [];
  const improvingSubjects: string[] = [];
  const needsAttentionSubjects: string[] = [];

  Object.entries(subjectScores).forEach(([subName, data]) => {
    const avg = data.total / data.count;
    if (avg >= 75) strongSubjects.push(subName);
    else if (avg >= 55) improvingSubjects.push(subName);
    else needsAttentionSubjects.push(subName);
  });

  // Critical topics
  const criticalTopics = topics
    .filter(t => t.mastery < 55 || t.revisionRisk === 'High Risk' || t.mistakeCount > 0)
    .sort((a, b) => (b.importance * (100 - b.mastery)) - (a.importance * (100 - a.mastery)))
    .map(t => `${t.name} (${t.subjectName})`);

  // Target topic for next best action
  const targetTopic = topics.sort((a, b) => {
    const scoreA = (100 - a.mastery) * a.importance + (a.mistakeCount * 20);
    const scoreB = (100 - b.mastery) * b.importance + (b.mistakeCount * 20);
    return scoreB - scoreA;
  })[0] || topics[0];

  return {
    percentage: finalPercentage,
    strongSubjects: strongSubjects.length > 0 ? strongSubjects : ['General Concepts'],
    improvingSubjects: improvingSubjects.length > 0 ? improvingSubjects : ['Practice Numericals'],
    needsAttentionSubjects: needsAttentionSubjects.length > 0 ? needsAttentionSubjects : ['High Risk Topics'],
    criticalTopics: criticalTopics.slice(0, 3),
    nextBestAction: {
      topicName: targetTopic.name,
      actionText: `Practice 10 ${targetTopic.name} numerical and active recall questions.`,
      recommendedDuration: 15
    }
  };
}
