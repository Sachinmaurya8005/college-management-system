import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  BookOpen,
  GraduationCap,
  Mail,
  Shield,
  Briefcase
} from 'lucide-react';
import { publicService } from '../../services/publicService';

export const PublicFacultyPage: React.FC = () => {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await publicService.getPublicFaculty(selectedDept);
        setFaculty(res);
      } catch (err) {
        console.error('Failed to load public faculty', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, [selectedDept]);

  const DEPARTMENTS = [
    'All',
    'Computer Science & Engineering',
    'Mechanical Engineering (Production)',
    'Civil Engineering',
    'Electrical Engineering',
    'Electronics Engineering',
    'Applied Sciences & Humanities'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase">
            Dedicated Teaching Staff
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Faculty &amp; Academic Instructors Directory
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 max-w-2xl">
            Experienced engineers, lecturers, and workshop instructors committed to practical excellence and mentorship.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
          <GraduationCap className="w-5 h-5 text-amber-400" />
          <span>BTEUP &amp; AICTE Certified</span>
        </div>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DEPARTMENTS.map(dept => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDept === dept
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map((member, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={member.photo_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces'}
                alt={member.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-md flex-shrink-0"
              />
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {member.name}
                </h3>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold block">
                  {member.designation}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {member.department}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Qualification: <strong>{member.qualification}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Briefcase className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span>Experience: <strong>{member.experience_years} Years</strong></span>
              </div>
              {member.subjects && member.subjects.length > 0 && (
                <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Subjects Taught:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {member.subjects.map((s: string, sIdx: number) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-medium border border-slate-200 dark:border-slate-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <span>Verified Faculty</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                ● Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
