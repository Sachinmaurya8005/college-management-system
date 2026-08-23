import React, { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Shield,
  Download,
  CheckCircle2
} from 'lucide-react';
import { publicService } from '../../services/publicService';
import { ExamSchedule } from '../../types';

export const PublicExamPage: React.FC = () => {
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await publicService.getPublicExamSchedules();
        setExams(res);
      } catch (err) {
        console.error('Failed to load public exam schedules', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase">
            BTEUP Board Examinations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Examination Schemes, Dates &amp; Guidelines
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 max-w-2xl">
            Official examination schemes, center guidelines, and important notices for Board of Technical Education, Uttar Pradesh (BTEUP) Diploma exams.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
          <Shield className="w-5 h-5 text-amber-400" />
          <span>BTEUP Exam Center: GPB 4412</span>
        </div>
      </div>

      {/* Guidelines Box */}
      <div className="p-6 rounded-3xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 space-y-3">
        <strong className="font-bold text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          Important Instructions for Diploma Examinees:
        </strong>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Students must carry their official BTEUP Admit Card and Institute Photo ID Card.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Entry inside the examination hall closes 15 minutes prior to the commencement of the exam.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Minimum 75% attendance in theory and practicals is strictly mandatory to sit for board exams.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Mobile phones, programmable calculators, and unauthorized materials are strictly prohibited.</span>
          </div>
        </div>
      </div>

      {/* Exam Schedules Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            <span>Upcoming Examination Schedule (Even Semester 2026)</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">BTEUP Board Scheme</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-6">Exam Date</th>
                <th className="py-3.5 px-6">Subject &amp; Code</th>
                <th className="py-3.5 px-6">Branch / Semester</th>
                <th className="py-3.5 px-6">Exam Timing</th>
                <th className="py-3.5 px-6">Venue / Hall</th>
                <th className="py-3.5 px-6 text-right">Max Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {exams.map((ex, idx) => (
                <tr key={ex.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                    {ex.examDate}
                  </td>
                  <td className="py-4 px-6">
                    <strong className="text-slate-900 dark:text-white font-bold block">{ex.subject}</strong>
                    <span className="text-[11px] text-slate-400 font-mono">{ex.subjectCode}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span>{ex.branch}</span>
                    <span className="text-slate-400 block text-[11px]">Semester {ex.semester}</span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold text-[11px]">
                      {ex.startTime} - {ex.endTime}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-800 dark:text-slate-200">
                    {ex.roomNo}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-slate-900 dark:text-white text-sm font-mono">
                    {ex.maxMarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
