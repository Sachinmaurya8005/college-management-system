import React, { useState, useEffect } from 'react';
import { Search, User, GraduationCap, Bell, BookOpen, Calendar, ArrowRight, X } from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, metadata?: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const { students, teachers, notices, courses, exams } = useCollegeData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Handled in parent or toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const filteredStudents = cleanQuery
    ? students.filter(
        s =>
          s.name.toLowerCase().includes(cleanQuery) ||
          s.rollNo.toLowerCase().includes(cleanQuery) ||
          s.branch.toLowerCase().includes(cleanQuery)
      ).slice(0, 3)
    : [];

  const filteredTeachers = cleanQuery
    ? teachers.filter(
        t =>
          t.name.toLowerCase().includes(cleanQuery) ||
          t.department.toLowerCase().includes(cleanQuery) ||
          t.subjects.some(sub => sub.toLowerCase().includes(cleanQuery))
      ).slice(0, 3)
    : [];

  const filteredNotices = cleanQuery
    ? notices.filter(
        n =>
          n.title.toLowerCase().includes(cleanQuery) ||
          n.content.toLowerCase().includes(cleanQuery) ||
          n.category.toLowerCase().includes(cleanQuery)
      ).slice(0, 3)
    : [];

  const filteredCourses = cleanQuery
    ? courses.filter(
        c =>
          c.name.toLowerCase().includes(cleanQuery) ||
          c.code.toLowerCase().includes(cleanQuery) ||
          c.shortCode.toLowerCase().includes(cleanQuery)
      ).slice(0, 3)
    : [];

  const filteredExams = cleanQuery
    ? exams.filter(
        e =>
          e.subject.toLowerCase().includes(cleanQuery) ||
          e.examName.toLowerCase().includes(cleanQuery) ||
          e.branch.toLowerCase().includes(cleanQuery)
      ).slice(0, 3)
    : [];

  const totalResults =
    filteredStudents.length +
    filteredTeachers.length +
    filteredNotices.length +
    filteredCourses.length +
    filteredExams.length;

  const handleSelect = (tab: string, metadata?: any) => {
    onNavigate(tab, metadata);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all z-10"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="relative flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search students, faculty, notices, courses, exams (e.g. Rahul, CSE, 4412)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full py-4 text-base bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-sm">
              Type keywords above to search across the entire Government Polytechnic portal.
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Tip: Press Esc to close
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Try "Computer Science" or "Exam"
                </span>
              </div>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
              No matching records found for "{query}".
            </div>
          )}

          {/* Students Section */}
          {filteredStudents.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-500" /> Students ({filteredStudents.length})
              </div>
              <div className="space-y-1">
                {filteredStudents.map(student => (
                  <div
                    key={student.id}
                    onClick={() => handleSelect('students', { studentId: student.id })}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={student.photoUrl}
                        alt={student.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {student.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {student.rollNo} • {student.branch} (Sem-{student.semester})
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teachers Section */}
          {filteredTeachers.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-500" /> Faculty ({filteredTeachers.length})
              </div>
              <div className="space-y-1">
                {filteredTeachers.map(teacher => (
                  <div
                    key={teacher.id}
                    onClick={() => handleSelect('teachers', { teacherId: teacher.id })}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={teacher.photoUrl}
                        alt={teacher.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {teacher.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {teacher.designation} • Dept. of {teacher.department}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notices Section */}
          {filteredNotices.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-500" /> Official Circulars ({filteredNotices.length})
              </div>
              <div className="space-y-1">
                {filteredNotices.map(notice => (
                  <div
                    key={notice.id}
                    onClick={() => handleSelect('notices', { noticeId: notice.id })}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
                        {notice.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {notice.category} • Ref: {notice.referenceNo} • {notice.publishDate}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses Section */}
          {filteredCourses.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-500" /> Engineering Departments ({filteredCourses.length})
              </div>
              <div className="space-y-1">
                {filteredCourses.map(course => (
                  <div
                    key={course.id}
                    onClick={() => handleSelect('courses')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {course.name} ({course.shortCode})
                      </div>
                      <div className="text-xs text-slate-400">
                        Code: {course.code} • Seats: {course.totalSeats} • HOD: {course.hodName}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exams Section */}
          {filteredExams.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-500" /> Examinations ({filteredExams.length})
              </div>
              <div className="space-y-1">
                {filteredExams.map(exam => (
                  <div
                    key={exam.id}
                    onClick={() => handleSelect('examination')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {exam.subject} ({exam.subjectCode})
                      </div>
                      <div className="text-xs text-slate-400">
                        {exam.examName} • Date: {exam.examDate} ({exam.startTime})
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
