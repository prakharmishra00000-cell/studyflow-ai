export type ExamType = 
  | 'University Exam'
  | 'SSC'
  | 'Banking'
  | 'UPSC'
  | 'GATE'
  | 'NEET'
  | 'JEE'
  | 'Certification'
  | 'Other';

export type PreparationLevel = 
  | 'Starting from zero'
  | 'Beginner'
  | 'Intermediate'
  | 'Mostly prepared'
  | 'Revision only';

export type EnergyLevel = 'low' | 'normal' | 'high';
export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type RevisionRisk = 'Fresh' | 'Due Soon' | 'Needs Revision' | 'High Risk';
export type SessionCompletion = 'completed' | 'partially' | 'skipped';
export type UnderstandingRating = 'poor' | 'okay' | 'good' | 'excellent';

export interface UserProfile {
  id: string;
  name: string;
  exam: string;
  examType: ExamType;
  examDate: string; // YYYY-MM-DD
  dailyStudyHours: number;
  preparationLevel: PreparationLevel;
  strongSubjects: string[];
  weakSubjects: string[];
  streak: number;
  xp: number;
  level: number;
  badges: Badge[];
  hasCompletedOnboarding: boolean;
  apiKey?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface Subject {
  id: string;
  name: string;
  priority: PriorityLevel;
  color: string;
  icon?: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  subjectName: string;
  name: string;
  importance: number; // 1-10
  difficulty: number; // 1-5
  mastery: number; // 0-100%
  lastStudied?: string; // ISO date string
  nextRevision?: string; // ISO date string
  revisionRisk: RevisionRisk;
  mistakeCount: number;
  totalTimeSpentMinutes: number;
}

export interface Recommendation {
  topicId: string;
  topicName: string;
  subjectId: string;
  subjectName: string;
  priority: PriorityLevel;
  recommendedDurationMinutes: number;
  reason: string;
  detailedReasons: string[];
  sessionBreakdown: {
    phase: string;
    durationMinutes: number;
    action: string;
  }[];
}

export interface StudyPlanTask {
  id: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  estimatedMinutes: number;
  priority: PriorityLevel;
  activityType: 'Concept' | 'Practice' | 'Recall' | 'Revision' | 'Diagnostic';
  status: 'pending' | 'completed' | 'skipped';
  scheduledTime?: string;
}

export interface DailyPlan {
  date: string; // YYYY-MM-DD
  label: string; // Today, Tomorrow, Monday, etc.
  tasks: StudyPlanTask[];
  isAdjusted?: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'mcq' | 'tf' | 'short' | 'numerical';
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  title: string;
  questions: QuizQuestion[];
  score?: number;
  totalQuestions: number;
  completedAt?: string;
}

export interface Mistake {
  id: string;
  quizId?: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  attemptsCount: number;
  dateAdded: string;
  resolved: boolean;
}

export interface Commitment {
  id: string;
  title: string;
  category: 'college' | 'coaching' | 'work' | 'gym' | 'travel' | 'sleep' | 'other';
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  durationHours: number;
}

export interface SyllabusItem {
  subject: string;
  unit: string;
  topics: string[];
}
