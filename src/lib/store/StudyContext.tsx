'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, Subject, Topic, DailyPlan, StudyPlanTask, 
  Mistake, Commitment, Recommendation, EnergyLevel, Quiz, UnderstandingRating 
} from '../types';
import { generateRecommendation } from '../utils/priorityEngine';
import { redistributeMissedTasks, calculateNextRevisionDate } from '../utils/spacedRepetition';
import { StudyAI } from '../ai/gemini';

const INITIAL_PROFILE: UserProfile = {
  id: 'user-1',
  name: 'Prakhar',
  exam: 'University Semester Exam',
  examType: 'University Exam',
  examDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  dailyStudyHours: 3,
  preparationLevel: 'Intermediate',
  strongSubjects: ['Manufacturing Tech', 'CAD/CAM Systems'],
  weakSubjects: ['Thermodynamics', 'Strength of Materials (SOM)'],
  streak: 7,
  xp: 850,
  level: 3,
  badges: [
    { id: 'b1', name: '7-Day Streak', description: 'Maintained 7 consecutive study days', icon: '🔥', unlockedAt: '2026-09-20' },
    { id: 'b2', name: '25 Topics Mastered', description: 'Completed 25 syllabus topics', icon: '📚', unlockedAt: '2026-09-18' }
  ],
  hasCompletedOnboarding: true
};

const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub-1', name: 'Thermodynamics', priority: 'Critical', color: '#ef4444' },
  { id: 'sub-2', name: 'Strength of Materials (SOM)', priority: 'High', color: '#f97316' },
  { id: 'sub-3', name: 'Manufacturing Tech', priority: 'Medium', color: '#3b82f6' },
  { id: 'sub-4', name: 'CAD/CAM Systems', priority: 'Low', color: '#10b981' }
];

const INITIAL_TOPICS: Topic[] = [
  {
    id: 'top-1',
    subjectId: 'sub-1',
    subjectName: 'Thermodynamics',
    name: 'Entropy & Second Law',
    importance: 9,
    difficulty: 4,
    mastery: 42,
    lastStudied: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    nextRevision: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    revisionRisk: 'High Risk',
    mistakeCount: 3,
    totalTimeSpentMinutes: 180
  },
  {
    id: 'top-2',
    subjectId: 'sub-1',
    subjectName: 'Thermodynamics',
    name: 'First Law & Open Systems',
    importance: 8,
    difficulty: 3,
    mastery: 65,
    lastStudied: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    nextRevision: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    revisionRisk: 'Due Soon',
    mistakeCount: 1,
    totalTimeSpentMinutes: 120
  },
  {
    id: 'top-3',
    subjectId: 'sub-2',
    subjectName: 'Strength of Materials (SOM)',
    name: 'Bending Stress in Beams',
    importance: 9,
    difficulty: 4,
    mastery: 51,
    lastStudied: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    nextRevision: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    revisionRisk: 'High Risk',
    mistakeCount: 2,
    totalTimeSpentMinutes: 150
  }
];

const INITIAL_PLANS: DailyPlan[] = [
  {
    date: new Date().toISOString().split('T')[0],
    label: 'Today',
    tasks: [
      {
        id: 't-1',
        subjectId: 'sub-1',
        subjectName: 'Thermodynamics',
        topicId: 'top-1',
        topicName: 'Entropy & Second Law',
        estimatedMinutes: 45,
        priority: 'Critical',
        activityType: 'Concept',
        status: 'pending',
        scheduledTime: '14:00 - 14:45'
      },
      {
        id: 't-2',
        subjectId: 'sub-2',
        subjectName: 'Strength of Materials (SOM)',
        topicId: 'top-3',
        topicName: 'Bending Stress in Beams',
        estimatedMinutes: 45,
        priority: 'Critical',
        activityType: 'Practice',
        status: 'pending',
        scheduledTime: '15:00 - 15:45'
      }
    ]
  }
];

interface StudyContextType {
  profile: UserProfile;
  subjects: Subject[];
  topics: Topic[];
  plans: DailyPlan[];
  mistakes: Mistake[];
  commitments: Commitment[];
  updateProfile: (data: Partial<UserProfile>) => void;
  setupCustomSubjectsAndResearchedSyllabus: (enteredSubjects: string[], examName: string, weakSubs: string[]) => Promise<void>;
  resetToDemo: () => void;
  getRecommendation: (availableMinutes?: number, energy?: EnergyLevel) => Recommendation;
  completeTask: (taskId: string, rating?: UnderstandingRating) => void;
  skipTask: (taskId: string) => void;
  addTopic: (topic: Partial<Topic>) => void;
  addMistake: (mistake: Omit<Mistake, 'id' | 'dateAdded' | 'attemptsCount' | 'resolved'>) => void;
  resolveMistake: (mistakeId: string) => void;
  addCommitment: (comm: Omit<Commitment, 'id'>) => void;
  removeCommitment: (id: string) => void;
  daysUntilExam: number;
  recoveryModeActive: boolean;
  activateRecoveryPlan: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);
  const [plans, setPlans] = useState<DailyPlan[]>(INITIAL_PLANS);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('studyflow_profile');
      const savedSubjects = localStorage.getItem('studyflow_subjects');
      const savedTopics = localStorage.getItem('studyflow_topics');
      const savedPlans = localStorage.getItem('studyflow_plans');
      const savedMistakes = localStorage.getItem('studyflow_mistakes');
      const savedCommitments = localStorage.getItem('studyflow_commitments');

      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
      if (savedTopics) setTopics(JSON.parse(savedTopics));
      if (savedPlans) setPlans(JSON.parse(savedPlans));
      if (savedMistakes) setMistakes(JSON.parse(savedMistakes));
      if (savedCommitments) setCommitments(JSON.parse(savedCommitments));
    } catch (e) {
      console.error('Failed loading storage data:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('studyflow_profile', JSON.stringify(profile));
      localStorage.setItem('studyflow_subjects', JSON.stringify(subjects));
      localStorage.setItem('studyflow_topics', JSON.stringify(topics));
      localStorage.setItem('studyflow_plans', JSON.stringify(plans));
      localStorage.setItem('studyflow_mistakes', JSON.stringify(mistakes));
      localStorage.setItem('studyflow_commitments', JSON.stringify(commitments));
    } catch (e) {
      console.error('Failed saving state to storage:', e);
    }
  }, [profile, subjects, topics, plans, mistakes, commitments, isLoaded]);

  const daysUntilExam = Math.max(
    1,
    Math.ceil((new Date(profile.examDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
  );

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  const setupCustomSubjectsAndResearchedSyllabus = async (enteredSubjectNames: string[], examName: string, weakSubs: string[]) => {
    if (!enteredSubjectNames || enteredSubjectNames.length === 0) return;

    // 1. Create Subject objects
    const colors = ['#ef4444', '#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'];
    const newSubjects: Subject[] = enteredSubjectNames.map((name, i) => ({
      id: `sub-custom-${i + 1}`,
      name,
      priority: weakSubs.includes(name) ? 'Critical' : 'High',
      color: colors[i % colors.length]
    }));
    setSubjects(newSubjects);

    // 2. Call AI research to get full authoritative syllabus breakdown
    const researched = await StudyAI.researchExamSyllabus(enteredSubjectNames, examName);

    // 3. Build Topic objects
    const newTopics: Topic[] = [];
    researched.forEach((res, sIdx) => {
      const parentSub = newSubjects.find(s => s.name.toLowerCase() === res.subject.toLowerCase()) || newSubjects[sIdx] || newSubjects[0];
      res.topics.forEach((t, tIdx) => {
        const isWeak = weakSubs.includes(parentSub.name);
        newTopics.push({
          id: `top-custom-${sIdx}-${tIdx}`,
          subjectId: parentSub.id,
          subjectName: parentSub.name,
          name: t.name,
          importance: t.importance || 8,
          difficulty: t.difficulty || 3,
          mastery: isWeak ? 35 : 65,
          revisionRisk: isWeak ? 'High Risk' : 'Due Soon',
          mistakeCount: 0,
          totalTimeSpentMinutes: 0,
          lastStudied: new Date(Date.now() - (sIdx + tIdx + 2) * 24 * 60 * 60 * 1000).toISOString()
        });
      });
    });

    setTopics(newTopics);

    // 4. Generate dynamic Initial Daily Plan
    const todayTasks: StudyPlanTask[] = newTopics.slice(0, 3).map((t, idx) => ({
      id: `t-init-${idx}`,
      subjectId: t.subjectId,
      subjectName: t.subjectName,
      topicId: t.id,
      topicName: t.name,
      estimatedMinutes: 45,
      priority: weakSubs.includes(t.subjectName) ? 'Critical' : 'High',
      activityType: idx === 0 ? 'Concept' : idx === 1 ? 'Practice' : 'Revision',
      status: 'pending'
    }));

    const tomorrowTasks: StudyPlanTask[] = newTopics.slice(3, 5).map((t, idx) => ({
      id: `t-tom-${idx}`,
      subjectId: t.subjectId,
      subjectName: t.subjectName,
      topicId: t.id,
      topicName: t.name,
      estimatedMinutes: 45,
      priority: 'High',
      activityType: 'Concept',
      status: 'pending'
    }));

    setPlans([
      { date: new Date().toISOString().split('T')[0], label: 'Today', tasks: todayTasks },
      { date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], label: 'Tomorrow', tasks: tomorrowTasks },
      { date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], label: 'This Week', tasks: [] }
    ]);
  };

  const resetToDemo = () => {
    setProfile(INITIAL_PROFILE);
    setSubjects(INITIAL_SUBJECTS);
    setTopics(INITIAL_TOPICS);
    setPlans(INITIAL_PLANS);
    setMistakes([]);
    setCommitments([]);
    localStorage.clear();
  };

  const getRecommendation = (availableMinutes: number = 45, energy: EnergyLevel = 'normal') => {
    return generateRecommendation(topics, daysUntilExam, availableMinutes, energy);
  };

  const completeTask = (taskId: string, rating: UnderstandingRating = 'good') => {
    let completedTopicId: string | undefined;

    setPlans(prevPlans => 
      prevPlans.map(plan => ({
        ...plan,
        tasks: plan.tasks.map(task => {
          if (task.id === taskId) {
            completedTopicId = task.topicId;
            return { ...task, status: 'completed' };
          }
          return task;
        })
      }))
    );

    if (completedTopicId) {
      setTopics(prevTopics =>
        prevTopics.map(t => {
          if (t.id === completedTopicId) {
            const masteryBoost = rating === 'excellent' ? 15 : rating === 'good' ? 10 : rating === 'okay' ? 5 : -5;
            const newMastery = Math.min(100, Math.max(10, t.mastery + masteryBoost));
            const { nextDate } = calculateNextRevisionDate(new Date(), 3, rating);
            return {
              ...t,
              mastery: newMastery,
              lastStudied: new Date().toISOString(),
              nextRevision: nextDate.toISOString(),
              revisionRisk: newMastery > 75 ? 'Fresh' : newMastery > 55 ? 'Due Soon' : 'Needs Revision'
            };
          }
          return t;
        })
      );
    }

    setProfile(prev => ({
      ...prev,
      xp: prev.xp + 50,
      streak: prev.streak + 1
    }));
  };

  const skipTask = (taskId: string) => {
    const updatedPlans = redistributeMissedTasks(plans, taskId);
    setPlans(updatedPlans);
  };

  const addTopic = (newTop: Partial<Topic>) => {
    const topicItem: Topic = {
      id: `top-${Date.now()}`,
      subjectId: newTop.subjectId || subjects[0]?.id || 'sub-1',
      subjectName: newTop.subjectName || subjects[0]?.name || 'General',
      name: newTop.name || 'New Topic',
      importance: newTop.importance || 5,
      difficulty: newTop.difficulty || 3,
      mastery: newTop.mastery || 30,
      revisionRisk: 'Needs Revision',
      mistakeCount: 0,
      totalTimeSpentMinutes: 0
    };
    setTopics(prev => [...prev, topicItem]);
  };

  const addMistake = (mistakeData: Omit<Mistake, 'id' | 'dateAdded' | 'attemptsCount' | 'resolved'>) => {
    const newMistake: Mistake = {
      ...mistakeData,
      id: `m-${Date.now()}`,
      attemptsCount: 1,
      dateAdded: new Date().toISOString().split('T')[0],
      resolved: false
    };
    setMistakes(prev => [newMistake, ...prev]);
    setTopics(prev => prev.map(t => t.id === mistakeData.topicId ? { ...t, mistakeCount: t.mistakeCount + 1 } : t));
  };

  const resolveMistake = (mistakeId: string) => {
    setMistakes(prev => prev.map(m => m.id === mistakeId ? { ...m, resolved: true } : m));
  };

  const addCommitment = (comm: Omit<Commitment, 'id'>) => {
    setCommitments(prev => [...prev, { ...comm, id: `c-${Date.now()}` }]);
  };

  const removeCommitment = (id: string) => {
    setCommitments(prev => prev.filter(c => c.id !== id));
  };

  const skippedCount = plans.flatMap(p => p.tasks).filter(t => t.status === 'skipped').length;
  const recoveryModeActive = skippedCount >= 2;

  const activateRecoveryPlan = () => {
    if (!topics || topics.length === 0) return;
    setPlans(prev => [
      {
        date: new Date().toISOString().split('T')[0],
        label: 'Today',
        isAdjusted: true,
        tasks: [
          {
            id: `recov-${Date.now()}`,
            subjectId: topics[0].subjectId,
            subjectName: topics[0].subjectName,
            topicId: topics[0].id,
            topicName: topics[0].name,
            estimatedMinutes: 20,
            priority: 'Critical',
            activityType: 'Concept',
            status: 'pending'
          }
        ]
      },
      ...prev.filter(p => p.label !== 'Today')
    ]);
  };

  return (
    <StudyContext.Provider value={{
      profile,
      subjects,
      topics,
      plans,
      mistakes,
      commitments,
      updateProfile,
      setupCustomSubjectsAndResearchedSyllabus,
      resetToDemo,
      getRecommendation,
      completeTask,
      skipTask,
      addTopic,
      addMistake,
      resolveMistake,
      addCommitment,
      removeCommitment,
      daysUntilExam,
      recoveryModeActive,
      activateRecoveryPlan
    }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudyStore = () => {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudyStore must be used within a StudyProvider');
  return context;
};
