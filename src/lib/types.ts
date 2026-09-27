export type CurrentLevel = 'Beginner' | 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';

export type GoalType = 
  | 'Learn the Skill'
  | 'Become Job Ready'
  | 'Build Projects'
  | 'Get Freelance Ready'
  | 'Prepare for Interviews'
  | 'Career Transition'
  | 'Master the Skill'
  | 'Exam Preparation'
  | 'Build a Portfolio'
  | 'Data Analyst'
  | 'Backend Developer'
  | 'Automation Specialist'
  | 'Data Scientist'
  | string;

export type DurationOption = '30 Days' | '2 Months' | '3 Months' | '6 Months' | '9 Months' | '1 Year' | string;
export type TimeDedicatedOption = '30 min' | '1 hr' | '1.5 hr' | '2 hr' | '3 hr' | '4 hr+' | string;
export type LearningMode = '🎓 Structured Learning' | '⚡ Fast Track' | '🧠 Deep Learning' | '💼 Job Ready' | '🛠 Project First';
export type TopicPriority = '🔴 Essential' | '🟡 Important' | '🔵 Optional' | '🟣 Advanced';

export interface ResourceItem {
  id: string;
  title: string;
  url: string;
  category: '📚 Documentation' | '🎥 Video' | '📝 Articles' | '🧪 Practice' | '💻 Coding Platforms' | '📖 Books' | '🎯 Projects';
  type: 'Primary' | 'Practice' | 'Reference';
  whyThisResource: string;
}

export interface RoadmapTopic {
  id: string;
  name: string;
  priority: TopicPriority;
  estimatedMinutes: number;
  category: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  mastery: number; // 0 - 100
  masteryLevel: 'Awareness' | 'Beginner' | 'Developing' | 'Proficient' | 'Strong'; // 0-20, 21-40, 41-60, 61-80, 81-100
  description: string;
  resources: ResourceItem[];
}

export interface ProjectStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedMinutes?: number;
}

export interface RoadmapProject {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skillsPracticed: string[];
  estimatedTime: string;
  prerequisites: string[];
  featuresToBuild: string[];
  suggestedTechStack: string[];
  portfolioValue: string;
  extensionIdeas: string[];
  steps?: ProjectStep[];
  isCompleted?: boolean;
}

export interface RoadmapMilestone {
  id: string;
  monthNumber: number;
  title: string;
  description: string;
  badge: string;
  isCompleted: boolean;
  status: 'upcoming' | 'in_progress' | 'achieved';
}

export interface RoadmapModule {
  id: string;
  monthNumber: number;
  weekNumber: number;
  title: string;
  status: 'upcoming' | 'active' | 'completed';
  topics: RoadmapTopic[];
  projects?: RoadmapProject[];
}

export interface RoadmapMonth {
  monthNumber: number;
  title: string;
  badgeColor: 'emerald' | 'amber' | 'cyan' | 'purple' | 'indigo';
  status: 'active' | 'upcoming' | 'completed';
  weeks: RoadmapModule[];
}

export interface RoadmapOverview {
  skill: string;
  totalDuration: DurationOption;
  dailyStudyTime: TimeDedicatedOption;
  estimatedTotalHours: number;
  currentLevel: CurrentLevel;
  targetLevel: string;
  careerGoal: GoalType;
  modulesCount: number;
  projectsCount: number;
  milestonesCount: number;
  learningMode: LearningMode;
}

export interface ActionableTask {
  id: string;
  topicId?: string;
  timeSlot: string; // e.g. "09:00 - 09:30"
  icon: string;
  title: string;
  category: string;
  estimatedMinutes: number;
  status: 'pending' | 'completed' | 'skipped';
  priority: TopicPriority;
}

export interface DailyPlanner {
  dayNumber: number;
  date: string;
  availableHours: string;
  progressPercentage: number;
  tasks: ActionableTask[];
}

export interface ReplanningRecord {
  changedAt: string;
  reason: string;
  beforeSummary: string;
  afterSummary: string;
}

export interface UserRoadmap {
  id: string;
  createdAt: string;
  updatedAt: string;
  overview: RoadmapOverview;
  months: RoadmapMonth[];
  projects: RoadmapProject[];
  milestones: RoadmapMilestone[];
  dailyPlan: DailyPlanner;
  completedTopicIds: string[];
  completedProjectIds: string[];
  totalHoursStudied: number;
  streakDays: number;
  missedDaysCount: number;
  replanningHistory: ReplanningRecord[];
}

export interface UserInputs {
  skill: string;
  dailyHours: TimeDedicatedOption;
  currentLevel: CurrentLevel;
  goal: GoalType;
  duration: DurationOption;
  learningMode?: LearningMode;
}

export type RoadmapChangeType = 
  | 'more_time' 
  | 'less_time' 
  | 'missed_days' 
  | 'change_goal' 
  | 'change_duration' 
  | 'finish_earlier' 
  | 'need_practice';

export interface AIRoadmapRecommendation {
  id: string;
  changeType: RoadmapChangeType;
  title: string;
  recommendationText: string;
  reasons: string[];
  beforeSummary: string;
  afterSummary: string;
  removedModules: string[];
  addedModules: string[];
  compressedModules: string[];
  proposedRoadmap: UserRoadmap;
}
