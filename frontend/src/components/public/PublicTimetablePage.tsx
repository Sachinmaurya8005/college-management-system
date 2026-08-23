import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  MapPin,
  Filter
} from 'lucide-react';
import { publicService } from '../../services/publicService';
import { TimetableSlot } from '../../types';

export const PublicTimetablePage: React.FC = () => {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('Computer Science & Engineering');
  const [selectedSemester, setSelectedSemester] = useState<number>(4);
  const [selectedDay, setSelectedDay] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await publicService.getPublicTimetable({
          branch: selectedBranch,
          semester: selectedSemester,
          day: selectedDay
        });
        setSlots(res);
      } catch (err) {
        console.error('Failed to load public timetable', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, [selectedBranch, selectedSemester, selectedDay]);

  const BRANCHES = [
    'Computer Science & Engineering',
    'Mechanical Engineering (Production)',
    'Civil Engineering',
    'Electrical Engineering',
    'Electronics Engineering',
    'Information Technology'
  ];

  const DAYS = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase">
            Academic Schedule 2026
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Institutional Class Timetable &amp; Lecture Schedules
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 max-w-2xl">
            Weekly theory and laboratory practical schedules for all 6 semesters across diploma engineering branches.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
          <Calendar className="w-5 h-5 text-amber-400" />
          <span>Even Semester Session</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter Timetable Schedule</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Branch / Discipline
            </label>
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none"
            >
              {BRANCHES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Semester
            </label>
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Day of Week
            </label>
            <select
              value={selectedDay}
              onChange={e => setSelectedDay(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none"
            >
              {DAYS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Schedule Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slots.length > 0 ? (
          slots.map((slot, idx) => (
            <div
              key={slot.id || idx}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-lg transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono">
                  {slot.day}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  slot.type?.toLowerCase().includes('lab') || slot.type?.toLowerCase().includes('practical')
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                }`}>
                  {slot.type || 'Theory Lecture'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {slot.subject}
                </h3>
                {slot.subjectCode && (
                  <span className="text-xs text-slate-400 font-mono">Code: {slot.subjectCode}</span>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>Time: <strong>{slot.startTime} - {slot.endTime}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Users className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Teacher: <strong>{slot.teacherName}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Venue: <strong>{slot.roomNo}</strong></span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            No timetable slots found for the selected branch, semester, or day.
          </div>
        )}
      </div>
    </div>
  );
};
