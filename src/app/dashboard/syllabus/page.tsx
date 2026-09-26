'use client';

import React, { useState } from 'react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { StudyAI } from '@/lib/ai/gemini';
import { SyllabusItem } from '@/lib/types';
import { BookOpen, Upload, Sparkles, Edit2, Plus, Check, FileText, Trash2 } from 'lucide-react';

export default function SyllabusPage() {
  const { addTopic } = useStudyStore();

  const [rawText, setRawText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [extractedSyllabus, setExtractedSyllabus] = useState<SyllabusItem[]>([
    {
      subject: 'Thermodynamics',
      unit: 'Unit 1: Energy & Second Law',
      topics: ['Entropy & Second Law', 'First Law & Open Systems', 'Exergy & Availability']
    },
    {
      subject: 'Strength of Materials (SOM)',
      unit: 'Unit 2: Beam Stresses',
      topics: ['Bending Stress in Beams', 'Torsion of Shafts', 'Shear Force & Bending Moment']
    }
  ]);

  const [editingTopic, setEditingTopic] = useState<{ subIdx: number; topicIdx: number } | null>(null);
  const [editedValue, setEditedValue] = useState<string>('');

  const handleImport = async () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    try {
      const result = await StudyAI.extractSyllabus(rawText);
      if (result && result.length > 0) {
        setExtractedSyllabus(result);
      }
    } catch (e) {
      console.error('Failed extracting syllabus:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveTopicEdit = (subIdx: number, topicIdx: number) => {
    if (editedValue.trim()) {
      setExtractedSyllabus(prev => {
        const copy = [...prev];
        copy[subIdx].topics[topicIdx] = editedValue.trim();
        return copy;
      });
    }
    setEditingTopic(null);
  };

  const addTopicToSyllabus = (subIdx: number) => {
    setExtractedSyllabus(prev => {
      const copy = [...prev];
      copy[subIdx].topics.push('New Topic');
      return copy;
    });
  };

  const addAllToStudyPlan = () => {
    extractedSyllabus.forEach(item => {
      item.topics.forEach(topName => {
        addTopic({
          name: topName,
          subjectName: item.subject,
          importance: 7,
          difficulty: 3,
          mastery: 30
        });
      });
    });
    alert('Extracted syllabus topics added to your active study plan!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI SYLLABUS EXTRACTOR</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">PDF & Syllabus Import</h1>
        <p className="text-xs text-slate-400 mt-1">
          Paste course outlines or exam notifications. AI parses subjects and topics with editable verification.
        </p>
      </div>

      {/* Import Input Box */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" /> Paste Syllabus / Outline Text
        </label>
        <textarea
          rows={4}
          placeholder="Paste syllabus text here (e.g., Unit 1: First Law of Thermodynamics, Entropy, Bending Stresses)..."
          value={rawText}
          onChange={e => setRawText(e.target.value)}
          className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
        />

        <div className="flex justify-between items-center">
          <p className="text-[11px] text-slate-500">
            Note: You can review and edit extracted topics before injecting them into your plan.
          </p>
          <button
            onClick={handleImport}
            disabled={isProcessing || !rawText.trim()}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>{isProcessing ? 'Extracting with AI...' : 'Extract Syllabus Topics'}</span>
          </button>
        </div>
      </div>

      {/* EXTRACTED SYLLABUS TREE */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" /> Imported Syllabus Structure
          </h2>
          <button
            onClick={addAllToStudyPlan}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-xs shadow-md"
          >
            Add All To My Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {extractedSyllabus.map((item, subIdx) => (
            <div key={subIdx} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-cyan-400 tracking-wider">
                  {item.unit}
                </span>
                <h3 className="font-extrabold text-lg text-white mt-0.5">{item.subject}</h3>
              </div>

              <div className="space-y-2">
                {item.topics.map((tName, topicIdx) => {
                  const isEditing = editingTopic?.subIdx === subIdx && editingTopic?.topicIdx === topicIdx;

                  return (
                    <div key={topicIdx} className="p-3 rounded-xl bg-[#090d16] border border-slate-800 flex items-center justify-between text-xs">
                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editedValue}
                            onChange={e => setEditedValue(e.target.value)}
                            className="flex-1 p-1.5 rounded bg-slate-900 border border-indigo-500 text-white text-xs focus:outline-none"
                          />
                          <button onClick={() => saveTopicEdit(subIdx, topicIdx)} className="p-1.5 rounded bg-emerald-600 text-white">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="font-semibold text-slate-200">{tName}</span>
                          <button
                            onClick={() => { setEditingTopic({ subIdx, topicIdx }); setEditedValue(tName); }}
                            className="text-slate-400 hover:text-white p-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => addTopicToSyllabus(subIdx)}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 hover:border-slate-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Topic to {item.subject}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
