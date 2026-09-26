import { Topic, PriorityLevel, RevisionRisk, Recommendation, EnergyLevel } from '../types';

export function calculateTopicPriorityScore(
  topic: Topic,
  daysUntilExam: number
): { score: number; level: PriorityLevel; risk: RevisionRisk } {
  // 1. Weakness Score (0-100, higher means weaker)
  const weakness = 100 - topic.mastery;

  // 2. Importance Score (1-10 mapped to 0-100)
  const importanceScore = topic.importance * 10;

  // 3. Days since last studied
  const daysSinceStudied = topic.lastStudied
    ? Math.floor((new Date().getTime() - new Date(topic.lastStudied).getTime()) / (1000 * 3600 * 24))
    : 14;

  // 4. Forgetting decay penalty (increases with days since studied and higher difficulty)
  const decayRate = 0.08 * (topic.difficulty / 3);
  const forgettingRiskVal = Math.min(100, Math.pow(1 + decayRate, daysSinceStudied) * 15);

  // 5. Urgency multiplier (closer exam = higher weight for weak high-importance topics)
  const urgencyMultiplier = Math.max(1.0, 30 / Math.max(1, daysUntilExam));

  // 6. Mistake penalty
  const mistakeScore = Math.min(30, topic.mistakeCount * 10);

  // Combined score formula
  const totalScore = 
    (weakness * 0.35) + 
    (importanceScore * 0.30) + 
    (forgettingRiskVal * 0.20) + 
    (mistakeScore * 0.15);

  const weightedScore = totalScore * (daysUntilExam < 15 ? 1.2 : 1.0);

  // Classify Priority Level
  let level: PriorityLevel = 'Low';
  if (weightedScore >= 70) level = 'Critical';
  else if (weightedScore >= 52) level = 'High';
  else if (weightedScore >= 35) level = 'Medium';

  // Classify Revision Risk
  let risk: RevisionRisk = 'Fresh';
  if (daysSinceStudied >= 10 || topic.mastery < 45) risk = 'High Risk';
  else if (daysSinceStudied >= 6 || topic.mastery < 65) risk = 'Needs Revision';
  else if (daysSinceStudied >= 3) risk = 'Due Soon';

  return { score: weightedScore, level, risk };
}

export function generateRecommendation(
  topics: Topic[],
  daysUntilExam: number,
  availableMinutes: number = 45,
  energy: EnergyLevel = 'normal'
): Recommendation {
  if (!topics || topics.length === 0) {
    return {
      topicId: 'demo-1',
      topicName: 'Entropy & Second Law',
      subjectId: 'sub-1',
      subjectName: 'Thermodynamics',
      priority: 'Critical',
      recommendedDurationMinutes: availableMinutes,
      reason: 'High priority topic with low recent mastery.',
      detailedReasons: ['Weak topic (42% mastery)', 'High exam weight', 'Last revised 8 days ago'],
      sessionBreakdown: [
        { phase: 'Learn Concept', durationMinutes: Math.round(availableMinutes * 0.35), action: 'Review core formulas & definitions' },
        { phase: 'Solve Questions', durationMinutes: Math.round(availableMinutes * 0.45), action: 'Attempt 10-15 targeted practice problems' },
        { phase: 'Active Recall', durationMinutes: Math.round(availableMinutes * 0.20), action: 'Self-test key concepts and record any mistakes' }
      ]
    };
  }

  // Score all topics
  const scoredTopics = topics.map(t => {
    const { score, level, risk } = calculateTopicPriorityScore(t, daysUntilExam);
    
    // Adjust based on energy level
    let energyFit = 1.0;
    if (energy === 'low') {
      // Low energy favors lower difficulty or revision topics
      energyFit = t.mastery > 60 || t.difficulty <= 3 ? 1.3 : 0.7;
    } else if (energy === 'high') {
      // High energy favors critical, difficult, or low-mastery topics
      energyFit = t.difficulty >= 3 || t.mastery < 50 ? 1.4 : 0.9;
    }

    return {
      topic: t,
      finalScore: score * energyFit,
      level,
      risk
    };
  });

  // Sort descending by finalScore
  scoredTopics.sort((a, b) => b.finalScore - a.finalScore);
  const best = scoredTopics[0];
  const t = best.topic;

  const daysSince = t.lastStudied
    ? Math.floor((new Date().getTime() - new Date(t.lastStudied).getTime()) / (1000 * 3600 * 24))
    : 10;

  const detailedReasons: string[] = [];
  if (t.mastery < 60) detailedReasons.push(`Weak topic: ${t.mastery}% mastery score`);
  if (t.importance >= 7) detailedReasons.push(`High exam weight (Importance ${t.importance}/10)`);
  if (daysSince >= 4) detailedReasons.push(`Last revised ${daysSince} days ago`);
  if (t.mistakeCount > 0) detailedReasons.push(`${t.mistakeCount} un-reviewed quiz mistake(s)`);
  if (energy === 'low') detailedReasons.push(`Tailored for low energy session`);
  if (energy === 'high') detailedReasons.push(`Optimal for high focus energy burst`);

  // Build breakdown based on duration
  const learnMin = Math.round(availableMinutes * 0.35);
  const solveMin = Math.round(availableMinutes * 0.45);
  const recallMin = Math.max(5, availableMinutes - learnMin - solveMin);

  return {
    topicId: t.id,
    topicName: t.name,
    subjectId: t.subjectId,
    subjectName: t.subjectName,
    priority: best.level,
    recommendedDurationMinutes: availableMinutes,
    reason: `This topic is recommended because it has high exam weight (${t.importance}/10), your current mastery is ${t.mastery}%, and it is due for revision.`,
    detailedReasons,
    sessionBreakdown: [
      { phase: 'Learn Concept', durationMinutes: learnMin, action: `Read core theory and key formulas for ${t.name}` },
      { phase: 'Solve Questions', durationMinutes: solveMin, action: `Solve practice questions & review previous mistakes` },
      { phase: 'Active Recall', durationMinutes: recallMin, action: `Close notes, answer quick flashcards & grade your understanding` }
    ]
  };
}
