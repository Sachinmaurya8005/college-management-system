import React from 'react';
import { CollegeLogo } from './CollegeLogo';
import { Heart, ShieldCheck, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';

export const Footer: React.FC = () => {
  const { settings } = useCollegeData();

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Branding */}
          <div className="flex items-center gap-3">
            <CollegeLogo size="xs" subtitle={false} />
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                College Management System
              </span>{' '}
              • BTEUP Code: {settings.bteupCode}
            </div>
          </div>

          {/* Center / Right: Copyright & Made with Love */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <span>Designed &amp; Developed with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              <span>for Technical Excellence</span>
            </div>
            <div className="font-medium">
              &copy; 2026 Government Polytechnic Bansdeeh, Ballia
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
