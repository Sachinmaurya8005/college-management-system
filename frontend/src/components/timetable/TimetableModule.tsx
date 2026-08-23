import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  PlusCircle,
  Trash2,
  Printer,
  BookOpen,
  User,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { TimetableSlot } from '../../types';
import { Modal } from '../common/Modal';
import { CollegeLogo } from '../common/CollegeLogo';

export const TimetableModule: React.FC = () => {
  const { timetable, addTimetableSlot, deleteTimetableSlot, settings } = useCollegeData();

  const [selectedBranch, setSelectedBranch] = useState('Computer Science & Engineering');
  const [selectedSemester, setSelectedSemester] = useState(4);
  const [activeDay, setActiveDay] = useState<'All' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({
    branch: 'Computer Science & Engineering',
    semester: 4,
    day: 'Monday' as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday',
    startTime: '09:30 AM',
    endTime: '10:30 AM',
    subject: '',
    subjectCode: '',
    teacherName: '',
    roomNo: 'Room 102',
    type: 'Theory' as 'Theory' | 'Practical Lab' | 'Tutorial'
  });

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  const filteredSlots = timetable.filter(
    t =>
      (t.branch.includes(selectedBranch) || selectedBranch.includes(t.branch)) &&
      t.semester === selectedSemester
  );

  const handleAddSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot.subject || !newSlot.teacherName) {
      alert('Please fill subject and teacher name.');
      return;
    }
    addTimetableSlot(newSlot);
    setIsAddModalOpen(false);
    setNewSlot({
      ...newSlot,
      subject: '',
      subjectCode: '',
      teacherName: ''
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Class &amp; Laboratory Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Government Polytechnic Bansdeeh • Weekly Academic Schedule (Monday–Saturday)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Print Schedule
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Add Timetable Slot
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Branch</label>
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
              <option value="Mechanical Engineering (Production)">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Electronics Engineering">Electronics Engineering</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Semester</label>
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(Number(e.target.value))}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map(s => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Day Filter Chips */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setActiveDay('All')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              activeDay === 'All'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All Days
          </button>
          {days.map(d => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeDay === d
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {d.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable Weekly Display */}
      <div className="space-y-6">
        {(activeDay === 'All' ? days : [activeDay]).map(day => {
          const daySlots = filteredSlots.filter(s => s.day === day);

          return (
            <div
              key={day}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600" />
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{day}</h3>
                  <span className="text-xs text-slate-400 font-medium">({daySlots.length} Scheduled Slots)</span>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {selectedBranch} • Sem {selectedSemester}
                </span>
              </div>

              {daySlots.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No classes scheduled for {day}.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {daySlots.map(slot => {
                    const typeColors = {
                      Theory: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200',
                      'Practical Lab': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200',
                      Tutorial: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200'
                    };

                    return (
                      <div
                        key={slot.id}
                        className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{slot.startTime} - {slot.endTime}</span>
                            </div>
                            <span
                              className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border ${
                                typeColors[slot.type] || typeColors.Theory
                              }`}
                            >
                              {slot.type}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {slot.subject}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 block mb-2">
                            Code: {slot.subjectCode}
                          </span>

                          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-semibold">{slot.teacherName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{slot.roomNo}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 mt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-end">
                          <button
                            onClick={() => deleteTimetableSlot(slot.id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded"
                            title="Remove Slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Slot Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Class / Laboratory Slot"
        subtitle="Add slot to weekly timetable"
        maxWidth="lg"
      >
        <form onSubmit={handleAddSlotSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Day of Week
              </label>
              <select
                value={newSlot.day}
                onChange={e => setNewSlot({ ...newSlot, day: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              >
                {days.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Class Type
              </label>
              <select
                value={newSlot.type}
                onChange={e => setNewSlot({ ...newSlot, type: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="Theory">Theory Lecture</option>
                <option value="Practical Lab">Practical Laboratory</option>
                <option value="Tutorial">Tutorial / Seminar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={newSlot.startTime}
                onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })}
                placeholder="09:30 AM"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Time
              </label>
              <input
                type="text"
                value={newSlot.endTime}
                onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })}
                placeholder="10:30 AM"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject Name *
              </label>
              <input
                type="text"
                required
                value={newSlot.subject}
                onChange={e => setNewSlot({ ...newSlot, subject: e.target.value })}
                placeholder="e.g. Operating Systems"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject Code
              </label>
              <input
                type="text"
                value={newSlot.subjectCode}
                onChange={e => setNewSlot({ ...newSlot, subjectCode: e.target.value })}
                placeholder="CS-404"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Room / Hall Allotment
              </label>
              <input
                type="text"
                value={newSlot.roomNo}
                onChange={e => setNewSlot({ ...newSlot, roomNo: e.target.value })}
                placeholder="Room 102 / Computer Lab 1"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Faculty Name *
              </label>
              <input
                type="text"
                required
                value={newSlot.teacherName}
                onChange={e => setNewSlot({ ...newSlot, teacherName: e.target.value })}
                placeholder="e.g. Dr. Alok Kumar Rai"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
            >
              Add Class Slot
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
