'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, Subject, Topic, DailyPlan, StudyPlanTask, 
  Mistake, Commitment, Recommendation, EnergyLevel, Quiz, UnderstandingRating 
} from '../types';
import { generateRecommendation } from '../utils/priorityEngine';
import { redistributeMissedTasks, calculateNextRevisionDate } from '../utils/spacedRepetition';

const INITIAL_PROFILE: UserProfile = {
  id: 'user-1',
  name: 'Prakhar',
  exam: 'University Semester Exam',
  examType: 'University Exam',
  examDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 42 days from now
  dailyStudyHours: 3,
  preparationLevel: 'Intermediate',
  strongSubjects: ['Manufacturing Tech', 'CAD/CAM Systems'],
  weakSubjects: ['Thermodynamics', 'Strength of Materials (SOM)'],
  streak: 7,
  xp: 850,
  level: 3,
  badges: [
    { id: 'b1', name: '7-Day Streak', description: 'Maintained 7 consecutive study days', icon: '🔥', unlockedAt: '2026-09-20' },
    { id: 'b2', name: '25 Topics Mastered', description: 'Completed 25 syllabus topics', icon: '📚', unlockedAt: '2026-09-18' },
    { id: 'b3', name: '500 Questions Solved', description: 'Answered 500 quiz questions', icon: '🧠', unlockedAt: '2026-09-22' },
    { id: 'b4', name: '10 Revision Sessions', description: 'Completed 10 active recall sessions', icon: '🎯', unlockedAt: '2026-09-24' }
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
  },
  {
    id: 'top-4',
    subjectId: 'sub-2',
    subjectName: 'Strength of Materials (SOM)',
    name: 'Torsion of Shafts',
    importance: 7,
    difficulty: 3,
    mastery: 72,
    lastStudied: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    nextRevision: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    revisionRisk: 'Fresh',
    mistakeCount: 0,
    totalTimeSpentMinutes: 90
  },
  {
    id: 'top-5',
    subjectId: 'sub-3',
    subjectName: 'Manufacturing Tech',
    name: 'Orthogonal Metal Cutting',
    importance: 8,
    difficulty: 3,
    mastery: 81,
    lastStudied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nextRevision: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    revisionRisk: 'Fresh',
    mistakeCount: 0,
    totalTimeSpentMinutes: 210
  },
  {
    id: 'top-6',
    subjectId: 'sub-4',
    subjectName: 'CAD/CAM Systems',
    name: 'CNC Programming & G-Codes',
    importance: 6,
    difficulty: 2,
    mastery: 88,
    lastStudied: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    nextRevision: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    revisionRisk: 'Fresh',
    mistakeCount: 0,
    totalTimeSpentMinutes: 140
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
      },
      {
        id: 't-3',
        subjectId: 'sub-3',
        subjectName: 'Manufacturing Tech',
        topicId: 'top-5',
        topicName: 'Orthogonal Metal Cutting',
        estimatedMinutes: 30,
        priority: 'Medium',
        activityType: 'Revision',
        status: 'pending',
        scheduledTime: '18:00 - 18:30'
      }
    ]
  },
  {
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    label: 'Tomorrow',
    tasks: [
      {
        id: 't-4',
        subjectId: 'sub-1',
        subjectName: 'Thermodynamics',
        topicId: 'top-2',
        topicName: 'First Law & Open Systems',
        estimatedMinutes: 45,
        priority: 'High',
        activityType: 'Concept',
        status: 'pending'
      },
      {
        id: 't-5',
        subjectId: 'sub-2',
        subjectName: 'Strength of Materials (SOM)',
        topicId: 'top-4',
        topicName: 'Torsion of Shafts',
        estimatedMinutes: 45,
        priority: 'High',
        activityType: 'Practice',
        status: 'pending'
      }
    ]
  },
  {
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    label: 'This Week',
    tasks: [
      {
        id: 't-6',
        subjectId: 'sub-4',
        subjectName: 'CAD/CAM Systems',
        topicId: 'top-6',
        topicName: 'CNC Programming & G-Codes',
        estimatedMinutes: 30,
        priority: 'Low',
        activityType: 'Recall',
        status: 'pending'
      }
    ]
  }
];

const INITIAL_MISTAKES: Mistake[] = [
  {
    id: 'm-1',
    subjectId: 'sub-1',
    subjectName: 'Thermodynamics',
    topicId: 'top-1',
    topicName: 'Entropy & Second Law',
    questionText: 'In an irreversible adiabatic expansion process of an ideal gas, what is the net change in entropy of the universe?',
    userAnswer: 'Zero (ΔS = 0)',
    correctAnswer: 'Greater than zero (ΔS > 0)',
    explanation: 'Irreversibility always generates entropy internally (S_gen > 0). Even though Q = 0 (adiabatic), entropy increases.',
    attemptsCount: 2,
    dateAdded: '2026-09-18',
    resolved: false
  },
  {
    id: 'm-2',
    subjectId: 'sub-2',
    subjectName: 'Strength of Materials (SOM)',
    topicId: 'top-3',
    topicName: 'Bending Stress in Beams',
    questionText: 'What is the section modulus (Z) for a rectangular beam section of width b and depth d?',
    userAnswer: 'b * d^2 / 12',
    correctAnswer: 'b * d^2 / 6',
    explanation: 'Moment of inertia I = b*d^3/12. Neutral axis distance y_max = d/2. Section modulus Z = I / y_max = (b*d^3/12) / (d/2) = b*d^2/6.',
    attemptsCount: 1,
    dateAdded: '2026-09-21',
    resolved: false
  }
];

const INITIAL_COMMITMENTS: Commitment[] = [
  { id: 'c-1', title: 'College Lectures', category: 'college', startTime: '09:00', endTime: '13:00', durationHours: 4 },
  { id: 'c-2', title: 'Coaching Institute', category: 'coaching', startTime: '16:00', endTime: '18:00', durationHours: 2 },
  { id: 'c-3', title: 'Gym & Fitness', category: 'gym', startTime: '18:30', endTime: '19:30', durationHours: 1 },
  { id: 'c-4', title: 'Sleep & Recovery', category: 'sleep', startTime: '23:00', endTime: '07:00', durationHours: 8 }
];

interface StudyContextType {
  profile: UserProfile;
  subjects: Subject[];
  topics: Topic[];
  plans: DailyPlan[];
  mistakes: Mistake[];
  commitments: Commitment[];
  updateProfile: (data: Partial<UserProfile>) => void;
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
  const [mistakes, setMistakes] = useState<Mistake[]>(INITIAL_MISTAKES);
  const [commitments, setCommitments] = useState<Commitment[]>(INITIAL_COMMITMENTS);
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

  const resetToDemo = () => {
    setProfile(INITIAL_PROFILE);
    setSubjects(INITIAL_SUBJECTS);
    setTopics(INITIAL_TOPICS);
    setPlans(INITIAL_PLANS);
    setMistakes(INITIAL_MISTAKES);
    setCommitments(INITIAL_COMMITMENTS);
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

    // Award XP
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

    // Also update topic mistake count
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
