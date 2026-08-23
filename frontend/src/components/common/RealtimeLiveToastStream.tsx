import React from 'react';
import {
  Radio,
  Bell,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Landmark,
  ShieldCheck,
  BookOpen,
  Users,
  X,
  Sparkles
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { LiveActivityItem } from '../../types';

export const RealtimeLiveToastStream: React.FC = () => {
  const { liveActivityLog, dismissLiveActivity } = useCollegeData();

  // Exclude initial placeholder if other events exist
  const activeActivities = liveActivityLog.filter(a => a.id !== 'act-init').slice(0, 3);

  if (activeActivities.length === 0) return null;

  const getIcon = (type: LiveActivityItem['type']) => {
    switch (type) {
      case 'notice':
        return <Bell className="w-4 h-4 text-blue-500" />;
      case 'attendance':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'salary':
      case 'treasury':
        return <Landmark className="w-4 h-4 text-emerald-600" />;
      case 'fee':
        return <IndianRupee className="w-4 h-4 text-amber-500" />;
      case 'student':
        return <Users className="w-4 h-4 text-purple-500" />;
      case 'course':
      case 'exam':
        return <BookOpen className="w-4 h-4 text-indigo-500" />;
      default:
        return <Radio className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {activeActivities.map(item => (
        <div
          key={item.id}
          className="pointer-events-auto p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-start gap-3 text-xs animate-slide-in-right transition-all group hover:scale-102"
        >
          {/* Glowing pulse icon */}
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 relative">
            {getIcon(item.type)}
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Live Update
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
            </div>

            <h4 className="font-bold text-slate-900 dark:text-white mt-0.5 truncate leading-snug">
              {item.message}
            </h4>

            {item.detail && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {item.detail}
              </p>
            )}
          </div>

          <button
            onClick={() => dismissLiveActivity(item.id)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors flex-shrink-0"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
