'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStudyStore } from '@/lib/store/StudyContext';
import { StudyAI } from '@/lib/ai/gemini';
import { ConceptNode } from '@/lib/types';
import { Network, Sparkles, BookOpen, Play, HelpCircle, X, ChevronRight } from 'lucide-react';

export default function ConceptMapPage() {
  const { subjects, topics } = useStudyStore();
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]?.name || 'Thermodynamics');
  const [nodes, setNodes] = useState<ConceptNode[]>([]);
  const [activeNode, setActiveNode] = useState<ConceptNode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    StudyAI.generateConceptMap(selectedSubject, 'Entropy & Second Law').then(res => {
      if (isMounted) {
        setNodes(res);
        setActiveNode(res[0] || null);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [selectedSubject]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
          <Network className="w-3.5 h-3.5 text-purple-400" />
          <span>INTERACTIVE KNOWLEDGE TREE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Visual Concept Map</h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore interconnected subject concepts. Click any node to reveal formulas, definitions, and active recall tests.
        </p>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {subjects.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSubject(s.name)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedSubject === s.name
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Concept Map Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 overflow-x-auto space-y-6">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> {selectedSubject} Knowledge Graph
          </h3>

          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-400 space-y-2">
              <Sparkles className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
              <p>AI is building interactive concept map...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6 min-w-[300px] py-4">
              {nodes.map((node, i) => {
                const isSelected = activeNode?.id === node.id;

                return (
                  <React.Fragment key={node.id}>
                    <div
                      onClick={() => setActiveNode(node)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all max-w-sm w-full text-center ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-500 shadow-xl text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[10px] font-extrabold uppercase text-indigo-400 block">
                        Node {i + 1}
                      </span>
                      <h4 className="font-bold text-sm text-white">{node.label}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{node.description}</p>
                    </div>

                    {i < nodes.length - 1 && (
                      <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500 to-cyan-400" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Node Inspection Sidebar */}
        {activeNode && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5 h-fit sticky top-24">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-cyan-400">CONCEPT INSPECTOR</span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">{activeNode.label}</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Description:</span>
                <p className="text-slate-200 leading-relaxed">{activeNode.description}</p>
              </div>

              {activeNode.formula && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-cyan-300">
                  <span className="text-slate-400 font-semibold block text-[10px]">Governing Equation:</span>
                  <code>{activeNode.formula}</code>
                </div>
              )}

              {activeNode.examples && activeNode.examples.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[10px]">Real-World Examples:</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {activeNode.examples.map((ex, idx) => (
                      <li key={idx}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href={`/focus-session?topic=${encodeURIComponent(activeNode.label)}&subject=${encodeURIComponent(selectedSubject)}&duration=30`}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-current" /> Practice Concept
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
