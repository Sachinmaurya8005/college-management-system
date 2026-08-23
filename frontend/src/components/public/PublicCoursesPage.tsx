import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Users,
  Clock,
  Award,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';
import { publicService } from '../../services/publicService';
import { Course } from '../../types';

export const PublicCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await publicService.getPublicCourses();
        setCourses(res);
        if (res.length > 0) setSelectedCourse(res[0]);
      } catch (err) {
        console.error('Failed to load public courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase">
            3-Year Regular Diploma Programs
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Academic Courses &amp; Engineering Branches
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 max-w-2xl">
            AICTE-approved and BTEUP-affiliated 3-year diploma engineering disciplines with state-of-the-art laboratory practicals.
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-center backdrop-blur-md">
          <span className="text-xl font-black text-amber-400">JEECUP</span>
          <span className="text-[11px] text-blue-200 block">Admission via UP Joint Entrance</span>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(c => (
          <div
            key={c.id}
            onClick={() => setSelectedCourse(c)}
            className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedCourse?.id === c.id
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-lg ring-2 ring-blue-600/30'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-lg'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-polytechnic-900 text-amber-400 text-xs font-mono font-bold">
                  {c.code}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {c.durationYears} Years (6 Semesters)
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {c.name}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                {c.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Intake: <strong className="text-slate-900 dark:text-white">{c.totalSeats} Seats</strong>
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5">
                View Syllabus <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Course Detailed Dossier */}
      {selectedCourse && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">
                {selectedCourse.code} • BTEUP Curriculum
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {selectedCourse.name}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold">
              Status: {selectedCourse.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <span className="text-slate-400 block mb-1">Approved Annual Seats</span>
              <strong className="text-slate-900 dark:text-white text-base">{selectedCourse.totalSeats} Seats</strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <span className="text-slate-400 block mb-1">Head of Department (HOD)</span>
              <strong className="text-slate-900 dark:text-white text-sm">{selectedCourse.hodName || 'Assigned Senior Faculty'}</strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <span className="text-slate-400 block mb-1">Dedicated Laboratories</span>
              <strong className="text-slate-900 dark:text-white text-base">{selectedCourse.labsCount} Practical Labs</strong>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Course Overview &amp; Career Scope
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedCourse.description}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <strong className="font-bold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Eligibility &amp; Admission Guidelines:
            </strong>
            <p>
              Candidates must have passed 10th Standard (High School) with minimum 35% marks and appeared in Joint Entrance Examination Council Uttar Pradesh (JEECUP Group A). Lateral entry to 2nd year available for 12th PCM / ITI holders (JEECUP Group K).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
