'use client';

import React from 'react';
import { X, Bell, Zap, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useStudyStore } from '@/lib/store/StudyContext';

export default function NotificationsDrawer({ onClose }: { onClose: () => void }) {
  const { profile, recoveryModeActive } = useStudyStore();

  const notifications = [
    {
      id: '1',
      title: 'Thermodynamics Session Due',
      message: 'Your 45-minute Entropy session is scheduled next.',
      time: '10 min ago',
      icon: Zap,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      id: '2',
      title: 'Spaced Revision Alert',
      message: 'SOM — Bending Stress revision is due today to prevent forgetting.',
      time: '1 hour ago',
      icon: Calendar,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    ...(recoveryModeActive ? [{
      id: '3',
      title: 'Procrastination Recovery',
      message: 'You missed previous sessions. Click to launch a 20-min recovery session.',
      time: 'Just now',
      icon: AlertTriangle,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    }] : []),
    {
      id: '4',
      title: '7-Day Streak Achieved!',
      message: 'Keep going! You are 42 days away from your semester exam.',
      time: 'Today',
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#0d1322] border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl h-full">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-slate-100">Smart Notifications</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {notifications.map(n => {
              const Icon = n.icon;
              return (
                <div key={n.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3">
                  <div className={`p-2 rounded-lg border ${n.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-slate-200">{n.title}</h4>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Notifications adapt based on your exam date ({profile.examDate}) and daily study target.
          </p>
        </div>
      </div>
    </div>
  );
}
