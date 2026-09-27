'use client';

import React, { useState } from 'react';
import { 
  Target, Sparkles, Code2, Clock, CheckCircle2, ChevronRight, Layers, ArrowRight, Loader2
} from 'lucide-react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AIMentorDrawer } from '@/components/common/AIMentorDrawer';
import { RoadmapProject, ProjectStep } from '@/lib/types';

export default function ProjectsPage() {
  const { roadmap, toggleProjectStatus, generateProjectPlan } = useStudyStore();
  const [activeProject, setActiveProject] = useState<RoadmapProject | null>(null);
  const [steps, setSteps] = useState<ProjectStep[]>([]);
  const [isGeneratingSteps, setIsGeneratingSteps] = useState(false);

  if (!roadmap) return null;

  const { projects, overview } = roadmap;

  const handleGenerateSteps = async (proj: RoadmapProject) => {
    setActiveProject(proj);
    setIsGeneratingSteps(true);
    const generatedSteps = await generateProjectPlan(proj.id);
    setSteps(generatedSteps);
    setIsGeneratingSteps(false);
  };

  return (
    <div className="min-h-screen bg-[#060811] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 pb-20 lg:pb-8">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Header */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Level-Aware Project Generator
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Hands-on projects generated specifically for <strong className="text-white">{overview.skill}</strong> → <strong className="text-cyan-300">{overview.careerGoal}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Project Cards */}
            <div className="lg:col-span-2 space-y-6">
              {projects.map((proj) => {
                const isCompleted = proj.isCompleted;
                const isSelected = activeProject?.id === proj.id;

                return (
                  <div
                    key={proj.id}
                    className={`p-6 rounded-3xl border transition-all space-y-4 ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500/50 shadow-xl shadow-cyan-500/10'
                        : isCompleted
                          ? 'bg-slate-900/40 border-slate-800 opacity-70'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          proj.difficulty === 'Beginner'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : proj.difficulty === 'Intermediate'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {proj.difficulty}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{proj.estimatedTime}</span>
                      </div>

                      <button
                        onClick={() => toggleProjectStatus(proj.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isCompleted ? '✓ Completed' : 'Mark Complete'}
                      </button>
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-white">{proj.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{proj.portfolioValue}</p>
                    </div>

                    {/* Features & Skills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                      <div className="p-3 rounded-2xl bg-[#060811] border border-slate-800 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Skills Practiced</span>
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {proj.skillsPracticed.map((sk, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#060811] border border-slate-800 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Suggested Stack</span>
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {proj.suggestedTechStack.map((st, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-semibold">
                              {st}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-1.5 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Features to Build:</span>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {proj.featuresToBuild.map((f, idx) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Action button */}
                    <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                      <button
                        onClick={() => handleGenerateSteps(proj)}
                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>✨ Generate Project Plan</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Step-by-Step Project Breakdown Inspector */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 sticky top-20">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Project Implementation Plan</span>
                </h3>

                {isGeneratingSteps ? (
                  <div className="p-8 text-center text-cyan-400 space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    <p className="text-xs">AI is breaking down project into step-by-step tasks...</p>
                  </div>
                ) : activeProject && steps.length > 0 ? (
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1 border-b border-slate-800 pb-3">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">Active Breakdown</span>
                      <h4 className="text-sm font-bold text-white">{activeProject.name}</h4>
                    </div>

                    <div className="space-y-3">
                      {steps.map((st) => (
                        <div key={st.stepNumber} className="p-3 rounded-2xl bg-[#060811] border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between font-bold text-cyan-300">
                            <span>Step {st.stepNumber}: {st.title}</span>
                            {st.estimatedMinutes && <span className="text-[10px] text-slate-400">{st.estimatedMinutes}m</span>}
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed">{st.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-2 text-slate-500">
                    <Target className="w-8 h-8 mx-auto text-slate-700" />
                    <p className="text-xs">Click "✨ Generate Project Plan" on any project card to view step-by-step build instructions.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </main>
      </div>

      <MobileNav />
      <AIMentorDrawer />
    </div>
  );
}
