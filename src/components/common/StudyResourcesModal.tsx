'use client';

import React from 'react';
import { RoadmapTopic, ResourceItem } from '@/lib/types';
import { X, BookOpen, ExternalLink, Video, Code2, FileText, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface StudyResourcesModalProps {
  topic: RoadmapTopic | null;
  onClose: () => void;
}

export default function StudyResourcesModal({ topic, onClose }: StudyResourcesModalProps) {
  if (!topic) return null;

  const resources: ResourceItem[] = topic.resources && topic.resources.length > 0 
    ? topic.resources 
    : [
        {
          id: 'res-default-1',
          title: `${topic.name} — Official Documentation & Standard Guide`,
          url: 'https://docs.python.org/3/',
          category: '📚 Documentation',
          type: 'Primary',
          whyThisResource: `Authoritative core reference explaining ${topic.name} definitions, syntax rules, and standard usage.`
        },
        {
          id: 'res-default-2',
          title: `${topic.name} — Video Walkthrough & Visual Tutorial`,
          url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(`${topic.name} tutorial`),
          category: '🎥 Video',
          type: 'Primary',
          whyThisResource: 'Step-by-step visual explanation for building intuitive understanding.'
        },
        {
          id: 'res-default-3',
          title: `${topic.name} — Interactive Hands-on Practice Problems`,
          url: 'https://leetcode.com',
          category: '🧪 Practice',
          type: 'Practice',
          whyThisResource: 'Interactive exercises and coding challenges to test edge cases and syntax.'
        },
        {
          id: 'res-default-4',
          title: `${topic.name} — Quick Reference Syntax Cheat Sheet`,
          url: 'https://cheatsheet.com',
          category: '📝 Articles',
          type: 'Reference',
          whyThisResource: 'Fast reference card for methods, parameters, and common patterns.'
        }
      ];

  const getCategoryIcon = (category: string) => {
    if (category.includes('Video')) return <Video className="w-4 h-4 text-cyan-400" />;
    if (category.includes('Practice') || category.includes('Coding')) return <Code2 className="w-4 h-4 text-emerald-400" />;
    if (category.includes('Articles') || category.includes('Books')) return <FileText className="w-4 h-4 text-amber-400" />;
    return <BookOpen className="w-4 h-4 text-indigo-400" />;
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-[#040812] border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/90 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#071322] via-[#091a2e] to-[#040812] p-6 border-b border-cyan-500/20 flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>NEXRON Curated Study Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {topic.name}
            </h2>
            <p className="text-xs text-slate-400">
              Category: <strong className="text-slate-200">{topic.category}</strong> • Priority: <strong className="text-cyan-400">{topic.priority}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Resource Cards */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-200">
          <p className="text-xs text-slate-300 font-medium">
            AI-curated learning materials to master this topic. Select a resource to start studying:
          </p>

          <div className="space-y-3">
            {resources.map((res) => (
              <a
                key={res.id}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl bg-[#08101e] border border-cyan-500/20 hover:border-cyan-400/60 hover:bg-[#0c1629] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      {getCategoryIcon(res.category)}
                    </span>
                    <span className="text-xs font-bold text-cyan-300">{res.category}</span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      res.type === 'Primary' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      res.type === 'Practice' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {res.type}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                    <span>{res.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {res.whyThisResource}
                  </p>
                </div>

                <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shrink-0 flex items-center gap-1.5">
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#03060d] border-t border-slate-900 flex items-center justify-between text-xs text-slate-500">
          <span>Clicking links opens authoritative learning docs in a new tab.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
