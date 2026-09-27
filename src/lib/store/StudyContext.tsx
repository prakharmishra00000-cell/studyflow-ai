'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserInputs, UserRoadmap, ProjectStep, TopicPriority, AIRoadmapRecommendation, RoadmapChangeType } from '../types';
import { RoadmapEngine } from '../ai/roadmapEngine';
import { StudyAI } from '../ai/gemini';

const DEFAULT_INPUTS: UserInputs = {
  skill: 'Python',
  dailyHours: '2 hr',
  currentLevel: 'Beginner',
  goal: 'Data Analyst',
  duration: '6 Months',
  learningMode: '💼 Job Ready'
};

interface StudyContextType {
  roadmap: UserRoadmap;
  inputs: UserInputs;
  isGenerating: boolean;
  generationStep: number;
  pendingRecommendation: AIRoadmapRecommendation | null;
  showReviewModal: boolean;
  generateRoadmap: (newInputs: UserInputs) => Promise<void>;
  adjustPlan: (
    type: RoadmapChangeType,
    value?: any
  ) => { recommendation: string; beforeSummary: string; afterSummary: string };
  requestPlanChange: (
    type: RoadmapChangeType,
    value?: any
  ) => AIRoadmapRecommendation;
  applyRecommendation: () => void;
  keepCurrentPlan: () => void;
  toggleReviewModal: (show?: boolean) => void;
  completeTask: (taskId: string) => void;
  toggleTopicStatus: (topicId: string) => void;
  toggleProjectStatus: (projectId: string) => void;
  generateProjectPlan: (projectId: string) => Promise<ProjectStep[]>;
  updateTopicMastery: (topicId: string, masteryDelta: number) => void;
  resetRoadmap: () => void;
  loadScenario: (scenarioKey: string) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inputs, setInputs] = useState<UserInputs>(DEFAULT_INPUTS);
  const [roadmap, setRoadmap] = useState<UserRoadmap>(() => RoadmapEngine.generateRoadmap(DEFAULT_INPUTS));
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [pendingRecommendation, setPendingRecommendation] = useState<AIRoadmapRecommendation | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from local storage
  useEffect(() => {
    try {
      const savedInputs = localStorage.getItem('studyflow_v2_inputs');
      const savedRoadmap = localStorage.getItem('studyflow_v2_roadmap');

      if (savedInputs) setInputs(JSON.parse(savedInputs));
      if (savedRoadmap) setRoadmap(JSON.parse(savedRoadmap));
    } catch (e) {
      console.error('Failed loading storage data:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to local storage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('studyflow_v2_inputs', JSON.stringify(inputs));
      localStorage.setItem('studyflow_v2_roadmap', JSON.stringify(roadmap));
    } catch (e) {
      console.error('Failed saving state to storage:', e);
    }
  }, [inputs, roadmap, isLoaded]);

  // Generate Roadmap with step sequence
  const generateRoadmap = async (newInputs: UserInputs) => {
    setInputs(newInputs);
    setIsGenerating(true);
    setGenerationStep(1);

    // Simulate realistic multi-step generation animation sequence
    for (let step = 1; step <= 7; step++) {
      setGenerationStep(step);
      await new Promise(res => setTimeout(res, 400));
    }

    const generated = RoadmapEngine.generateRoadmap(newInputs);
    setRoadmap(generated);
    setPendingRecommendation(null);
    setIsGenerating(false);
  };

  // Section 30 User Control: Request a plan change and produce recommendation for user review
  const requestPlanChange = (type: RoadmapChangeType, value?: any): AIRoadmapRecommendation => {
    const rec = RoadmapEngine.generateRecommendation(roadmap, { type, value });
    setPendingRecommendation(rec);
    return rec;
  };

  // Section 30 User Control: Apply recommendation
  const applyRecommendation = () => {
    if (!pendingRecommendation) return;
    setRoadmap(pendingRecommendation.proposedRoadmap);

    // Update inputs state based on change type
    const changeType = pendingRecommendation.changeType;
    if (changeType === 'more_time' || changeType === 'less_time') {
      const newHours = pendingRecommendation.proposedRoadmap.overview.dailyStudyTime;
      setInputs(prev => ({ ...prev, dailyHours: newHours }));
    }
    if (changeType === 'change_goal') {
      const newGoal = pendingRecommendation.proposedRoadmap.overview.careerGoal;
      setInputs(prev => ({ ...prev, goal: newGoal }));
    }
    if (changeType === 'finish_earlier' || changeType === 'change_duration') {
      const newDuration = pendingRecommendation.proposedRoadmap.overview.totalDuration;
      setInputs(prev => ({ ...prev, duration: newDuration }));
    }

    setPendingRecommendation(null);
    setShowReviewModal(false);
  };

  // Section 30 User Control: Keep current plan
  const keepCurrentPlan = () => {
    setPendingRecommendation(null);
    setShowReviewModal(false);
  };

  const toggleReviewModal = (show?: boolean) => {
    setShowReviewModal(prev => (typeof show === 'boolean' ? show : !prev));
  };

  // Legacy direct adjustPlan (now also triggers recommendation)
  const adjustPlan = (
    type: RoadmapChangeType,
    value?: any
  ) => {
    const rec = requestPlanChange(type, value);
    return {
      recommendation: rec.recommendationText,
      beforeSummary: rec.beforeSummary,
      afterSummary: rec.afterSummary
    };
  };

  // Complete task in Today view
  const completeTask = (taskId: string) => {
    setRoadmap(prev => {
      const updatedTasks = prev.dailyPlan.tasks.map(t => 
        t.id === taskId ? { ...t, status: (t.status === 'completed' ? 'pending' : 'completed') as 'pending' | 'completed' | 'skipped' } : t
      );
      const completedCount = updatedTasks.filter(t => t.status === 'completed').length;
      const progressPercentage = Math.round((completedCount / updatedTasks.length) * 100);

      return {
        ...prev,
        totalHoursStudied: prev.totalHoursStudied + 0.5,
        dailyPlan: {
          ...prev.dailyPlan,
          progressPercentage,
          tasks: updatedTasks
        }
      };
    });
  };

  // Toggle topic status in roadmap
  const toggleTopicStatus = (topicId: string) => {
    setRoadmap(prev => {
      const updatedMonths = prev.months.map(m => ({
        ...m,
        weeks: m.weeks.map(w => ({
          ...w,
          topics: w.topics.map(t => {
            if (t.id === topicId) {
              const nextStatus: 'pending' | 'in_progress' | 'completed' | 'skipped' = t.status === 'completed' ? 'pending' : 'completed';
              return { ...t, status: nextStatus, mastery: nextStatus === 'completed' ? 90 : 30 };
            }
            return t;
          })
        }))
      }));

      const completedTopicIds = updatedMonths
        .flatMap(m => m.weeks)
        .flatMap(w => w.topics)
        .filter(t => t.status === 'completed')
        .map(t => t.id);

      return {
        ...prev,
        completedTopicIds,
        months: updatedMonths
      };
    });
  };

  // Toggle project completion
  const toggleProjectStatus = (projectId: string) => {
    setRoadmap(prev => {
      const updatedProjects = prev.projects.map(p => 
        p.id === projectId ? { ...p, isCompleted: !p.isCompleted } : p
      );
      const completedProjectIds = updatedProjects.filter(p => p.isCompleted).map(p => p.id);

      return {
        ...prev,
        projects: updatedProjects,
        completedProjectIds
      };
    });
  };

  // Generate Project Plan breakdown steps
  const generateProjectPlan = async (projectId: string): Promise<ProjectStep[]> => {
    const project = roadmap.projects.find(p => p.id === projectId);
    if (!project) return [];

    if (project.steps && project.steps.length > 0) return project.steps;

    const steps = await StudyAI.generateProjectPlan(project);
    
    // Attach steps to roadmap project
    setRoadmap(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === projectId ? { ...p, steps } : p)
    }));

    return steps;
  };

  // Update Topic Mastery
  const updateTopicMastery = (topicId: string, masteryDelta: number) => {
    setRoadmap(prev => ({
      ...prev,
      months: prev.months.map(m => ({
        ...m,
        weeks: m.weeks.map(w => ({
          ...w,
          topics: w.topics.map(t => {
            if (t.id === topicId) {
              const newMastery = Math.min(100, Math.max(0, t.mastery + masteryDelta));
              const level = newMastery > 80 ? 'Strong' : newMastery > 60 ? 'Proficient' : newMastery > 40 ? 'Developing' : newMastery > 20 ? 'Beginner' : 'Awareness';
              return { ...t, mastery: newMastery, masteryLevel: level };
            }
            return t;
          })
        }))
      }))
    }));
  };

  // Reset Roadmap to default
  const resetRoadmap = () => {
    setInputs(DEFAULT_INPUTS);
    setRoadmap(RoadmapEngine.generateRoadmap(DEFAULT_INPUTS));
    localStorage.removeItem('studyflow_v2_inputs');
    localStorage.removeItem('studyflow_v2_roadmap');
  };

  // Load specific demo verification scenarios (Section 36)
  const loadScenario = (scenarioKey: string) => {
    switch (scenarioKey) {
      case 'python_analyst_6m':
        generateRoadmap({ skill: 'Python', dailyHours: '2 hr', currentLevel: 'Beginner', goal: 'Data Analyst', duration: '6 Months' });
        break;
      case 'python_3h':
        adjustPlan('more_time', '3 hr');
        break;
      case 'python_1h':
        adjustPlan('less_time', '1 hr');
        break;
      case 'missed_3days':
        adjustPlan('missed_days', 3);
        break;
      case 'change_data_scientist':
        adjustPlan('change_goal', 'Data Scientist');
        break;
      case 'duration_3m':
        adjustPlan('finish_earlier', '3 Months');
        break;
      default:
        break;
    }
  };

  return (
    <StudyContext.Provider
      value={{
        roadmap,
        inputs,
        isGenerating,
        generationStep,
        pendingRecommendation,
        showReviewModal,
        generateRoadmap,
        adjustPlan,
        requestPlanChange,
        applyRecommendation,
        keepCurrentPlan,
        toggleReviewModal,
        completeTask,
        toggleTopicStatus,
        toggleProjectStatus,
        generateProjectPlan,
        updateTopicMastery,
        resetRoadmap,
        loadScenario
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudyStore = () => {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudyStore must be used within a StudyProvider');
  return context;
};
