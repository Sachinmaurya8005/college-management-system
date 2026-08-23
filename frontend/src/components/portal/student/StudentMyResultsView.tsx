import React, { useState } from 'react';
import {
  Award,
  Calendar,
  Download,
  FileText,
  Printer,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Layers,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useCollegeData } from '../../../context/CollegeDataContext';
import { StudentResult, SubjectMark } from '../../../types';
import { MarksheetModal } from '../../examination/MarksheetModal';

export const StudentMyResultsView: React.FC = () => {
  const { user } = useAuth();
  const { results } = useCollegeData();

  const [selectedSemester, setSelectedSemester] = useState<number>(4);
  const [activeMarksheet, setActiveMarksheet] = useState<StudentResult | null>(null);

  // Multi-semester comprehensive results dataset for CSE / Polytechnic Diploma
  const SEMESTER_RESULTS: Record<number, StudentResult> = {
    1: {
      id: 'res-sem-1',
      studentId: 'std-001',
      studentName: user?.name || 'Rahul Verma',
      rollNo: user?.rollNo || 'E224412355001',
      enrollmentNo: user?.rollNo || '224412001',
      branch: user?.branch || 'Computer Science & Engineering',
      semester: 1,
      examSession: 'Odd Semester 2023-2024',
      marks: [
        { subjectCode: 'BAS-101', subjectName: 'Applied Mathematics-I', theoryMax: 50, theoryObtained: 40, practicalMax: 50, practicalObtained: 42, totalMax: 100, totalObtained: 82, grade: 'A', gradePoint: 8 },
        { subjectCode: 'BAS-102', subjectName: 'Applied Physics-I', theoryMax: 50, theoryObtained: 38, practicalMax: 50, practicalObtained: 40, totalMax: 100, totalObtained: 78, grade: 'B+', gradePoint: 7 },
        { subjectCode: 'BAS-103', subjectName: 'Applied Chemistry', theoryMax: 50, theoryObtained: 39, practicalMax: 50, practicalObtained: 41, totalMax: 100, totalObtained: 80, grade: 'A', gradePoint: 8 },
        { subjectCode: 'ENG-104', subjectName: 'Engineering Drawing-I', theoryMax: 60, theoryObtained: 51, practicalMax: 40, practicalObtained: 34, totalMax: 100, totalObtained: 85, grade: 'A+', gradePoint: 9 },
        { subjectCode: 'CS-105', subjectName: 'Basics of Information Technology', theoryMax: 50, theoryObtained: 45, practicalMax: 50, practicalObtained: 46, totalMax: 100, totalObtained: 91, grade: 'O', gradePoint: 10 },
        { subjectCode: 'WKP-106', subjectName: 'General Workshop Practice-I', theoryMax: 0, theoryObtained: 0, practicalMax: 100, practicalObtained: 86, totalMax: 100, totalObtained: 86, grade: 'A+', gradePoint: 9 },
        { subjectCode: 'SCA-100', subjectName: 'Student Centered Activities', theoryMax: 0, theoryObtained: 0, practicalMax: 100, practicalObtained: 66, totalMax: 100, totalObtained: 66, grade: 'B', gradePoint: 6 }
      ],
      grandTotalMax: 700,
      grandTotalObtained: 568,
      percentage: 81.14,
      cgpa: 8.2,
      division: 'First Division with Distinction',
      status: 'PASS'
    },
    2: {
      id: 'res-sem-2',
      studentId: 'std-001',
      studentName: user?.name || 'Rahul Verma',
      rollNo: user?.rollNo || 'E224412355001',
      enrollmentNo: user?.rollNo || '224412001',
      branch: user?.branch || 'Computer Science & Engineering',
      semester: 2,
      examSession: 'Even Semester 2023-2024',
      marks: [
        { subjectCode: 'BAS-201', subjectName: 'Applied Mathematics-II', theoryMax: 50, theoryObtained: 41, practicalMax: 50, practicalObtained: 43, totalMax: 100, totalObtained: 84, grade: 'A', gradePoint: 8 },
        { subjectCode: 'BAS-202', subjectName: 'Applied Physics-II', theoryMax: 50, theoryObtained: 40, practicalMax: 50, practicalObtained: 41, totalMax: 100, totalObtained: 81, grade: 'A', gradePoint: 8 },
        { subjectCode: 'EE-203', subjectName: 'Basics of Electrical & Electronics Engg', theoryMax: 50, theoryObtained: 41, practicalMax: 50, practicalObtained: 42, totalMax: 100, totalObtained: 83, grade: 'A', gradePoint: 8 },
        { subjectCode: 'ENV-204', subjectName: 'Environmental Studies & Disaster Mgmt', theoryMax: 50, theoryObtained: 39, practicalMax: 50, practicalObtained: 40, totalMax: 100, totalObtained: 79, grade: 'B+', gradePoint: 7 },
        { subjectCode: 'CS-205', subjectName: 'Programming in C & Problem Solving', theoryMax: 50, theoryObtained: 44, practicalMax: 50, practicalObtained: 46, totalMax: 100, totalObtained: 90, grade: 'A+', gradePoint: 9 },
        { subjectCode: 'WKP-206', subjectName: 'General Workshop Practice-II', theoryMax: 0, theoryObtained: 0, practicalMax: 100, practicalObtained: 88, totalMax: 100, totalObtained: 88, grade: 'A+', gradePoint: 9 },
        { subjectCode: 'SCA-200', subjectName: 'Student Centered Activities', theoryMax: 0, theoryObtained: 0, practicalMax: 100, practicalObtained: 72, totalMax: 100, totalObtained: 72, grade: 'B+', gradePoint: 7 }
      ],
      grandTotalMax: 700,
      grandTotalObtained: 577,
      percentage: 82.43,
      cgpa: 8.4,
      division: 'First Division with Distinction',
      status: 'PASS'
    },
    3: {
      id: 'res-sem-3',
      studentId: 'std-001',
      studentName: user?.name || 'Rahul Verma',
      rollNo: user?.rollNo || 'E224412355001',
      enrollmentNo: user?.rollNo || '224412001',
      branch: user?.branch || 'Computer Science & Engineering',
      semester: 3,
      examSession: 'Odd Semester 2024-2025',
      marks: [
        { subjectCode: 'BAS-301', subjectName: 'Applied Mathematics-III', theoryMax: 50, theoryObtained: 42, practicalMax: 50, practicalObtained: 43, totalMax: 100, totalObtained: 85, grade: 'A+', gradePoint: 9 },
        { subjectCode: 'CS-302', subjectName: 'Internet & Web Technology', theoryMax: 50, theoryObtained: 44, practicalMax: 50, practicalObtained: 45, totalMax: 100, totalObtained: 89, grade: 'A+', gradePoint: 9 },
        { subjectCode: 'EC-303', subjectName: 'Digital Electronics & Microprocessors', theoryMax: 50, theoryObtained: 39, practicalMax: 50, practicalObtained: 42, totalMax: 100, totalObtained: 81, grade: 'A', gradePoint: 8 },
        { subjectCode: 'CS-304', subjectName: 'Object Oriented Programming with C++', theoryMax: 50, theoryObtained: 43, practicalMax: 50, practicalObtained: 44, totalMax: 100, totalObtained: 87, grade: 'A+', gradePoint: 9 },
        { subjectCode: 'CS-305', subjectName: 'Computer Architecture & Hardware Lab', theoryMax: 50, theoryObtained: 40, practicalMax: 50, practicalObtained: 42, totalMax: 100, totalObtained: 82, grade: 'A', gradePoint: 8 },
        { subjectCode: 'CS-306', subjectName: 'Data Communication Fundamentals', theoryMax: 50, theoryObtained: 37, practicalMax: 50, practicalObtained: 41, totalMax: 100, totalObtained: 78, grade: 'B+', gradePoint: 7 },
        { subjectCode: 'SCA-300', subjectName: 'Student Centered Activities', theoryMax: 0, theoryObtained: 0, practicalMax: 100, practicalObtained: 77, totalMax: 100, totalObtained: 77, grade: 'A', gradePoint: 8 }
      ],
      grandTotalMax: 700,
      grandTotalObtained: 579,
      percentage: 82.71,
      cgpa: 8.3,
      division: 'First Division with Distinction',
      status: 'PASS'
    },
    4: {
      id: 'res-sem-4',
      studentId: 'std-001',
      studentName: user?.name || 'Rahul Verma',
      rollNo: user?.rollNo || 'E224412355001',
      enrollmentNo: user?.rollNo || '224412001',
      branch: user?.branch || 'Computer Science & Engineering',
      semester: 4,
      examSession: 'Even Semester 2025-2026',
      marks: [
        { subjectCode: 'CS-401', subjectName: 'Data Structures & Algorithms Using Python', theoryMax: 50, theoryObtained: 42, practicalMax: 50, practicalObtained: 45, totalMax: 100, totalObtained: 87, grade: 'A+', gradePoint: 9 },
        { subjectCode: 'CS-402', subjectName: 'Database Management Systems', theoryMax: 50, theoryObtained: 40, practicalMax: 50, practicalObtained: 44, totalMax: 100, totalObtained: 84, grade: 'A', gradePoint: 8 },
        { subjectCode: 'CS-403', subjectName: 'Operating Systems & Linux Architecture', theoryMax: 50, theoryObtained: 41, practicalMax: 50, practicalObtained: 44, totalMax: 100, totalObtained: 85, grade: 'A+', gradePoint: 9 },
        { subjectCode: 'CS-404', subjectName: 'Computer Communication & Networks', theoryMax: 50, theoryObtained: 36, practicalMax: 50, practicalObtained: 42, totalMax: 100, totalObtained: 78, grade: 'A', gradePoint: 8 },
        { subjectCode: 'CS-405', subjectName: 'Web Technology & PHP Frameworks', theoryMax: 50, theoryObtained: 44, practicalMax: 50, practicalObtained: 48, totalMax: 100, totalObtained: 92, grade: 'O', gradePoint: 10 },
        { subjectCode: 'CS-406', subjectName: 'Universal Human Values & Professional Ethics', theoryMax: 50, theoryObtained: 35, practicalMax: 50, practicalObtained: 40, totalMax: 100, totalObtained: 75, grade: 'B+', gradePoint: 7 },
        { subjectCode: 'SCA-400', subjectName: 'Student Centered Activities (SCA)', theoryMax: 0, theoryObtained: 0, practicalMax: 100, practicalObtained: 84, totalMax: 100, totalObtained: 84, grade: 'A', gradePoint: 8 }
      ],
      grandTotalMax: 700,
      grandTotalObtained: 585,
      percentage: 83.57,
      cgpa: 8.5,
      division: 'First Division with Distinction',
      status: 'PASS'
    }
  };

  const selectedResult: StudentResult | undefined =
    results.find(
      r => r.semester === selectedSemester &&
           ((user?.rollNo && r.rollNo.toLowerCase() === user.rollNo.toLowerCase()) ||
            (user?.name && r.studentName.toLowerCase().includes(user.name.toLowerCase())))
    ) || SEMESTER_RESULTS[selectedSemester];

  const isUpcomingSemester = selectedSemester > 4;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Semester Academic Dossier • BTEUP Code: 4412</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My BTEUP Board Examination Results
          </h1>
          <p className="text-xs sm:text-sm text-blue-200">
            Student: <strong className="text-white">{user?.name}</strong> • Roll: <strong className="font-mono text-amber-300">{user?.rollNo || 'E224412355001'}</strong> • DOB: <strong className="font-mono text-amber-300">{user?.dob || '2004-05-14'}</strong> • Branch: {user?.branch || 'CSE'}
          </p>
        </div>

        {selectedResult && !isUpcomingSemester && (
          <div className="px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-center backdrop-blur-md z-10">
            <span className="text-xs text-blue-200 uppercase font-bold block">Semester {selectedSemester} Result</span>
            <span className="text-2xl font-black text-emerald-400 block mt-0.5">
              {selectedResult.status}
            </span>
            <span className="text-[10px] text-blue-200 block">CGPA: {selectedResult.cgpa} ({selectedResult.percentage}%)</span>
          </div>
        )}
      </div>

      {/* Interactive Semester Selector Pills */}
      <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Semester:</span>
        </div>
        {[1, 2, 3, 4, 5, 6].map(sem => {
          const isCurrent = sem === 4;
          const isPast = sem < 4;
          const isSelected = selectedSemester === sem;
          return (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>Semester {sem}</span>
              {isCurrent && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-slate-950">
                  Current
                </span>
              )}
              {isPast && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Passed
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isUpcomingSemester ? (
        /* Upcoming Semester Curriculum Notice */
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Semester {selectedSemester} Academic Session En Route
            </h3>
            <p className="text-xs text-slate-500">
              Examination registration and marksheet generation for Semester {selectedSemester} will open upon successful commencement of the upcoming BTEUP term.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setSelectedSemester(4)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20"
            >
              View Current Semester 4 Marksheet →
            </button>
          </div>
        </div>
      ) : selectedResult ? (
        <>
          {/* KPI Summary Cards for Selected Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Grand Total Marks</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {selectedResult.grandTotalObtained} / {selectedResult.grandTotalMax}
              </p>
              <span className="text-[11px] text-slate-500 block">Percentage: {selectedResult.percentage}%</span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Semester SGPA / CGPA</span>
              <p className="text-2xl font-black text-blue-600 font-mono">
                {selectedResult.cgpa} / 10.0
              </p>
              <span className="text-[11px] text-slate-500 block">{selectedResult.division}</span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-2">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">BTEUP Board Status</span>
              <p className="text-2xl font-black text-emerald-600 font-mono">
                {selectedResult.status}
              </p>
              <span className="text-[11px] text-slate-500 block">Official Board Verified</span>
            </div>
          </div>

          {/* Marksheet Table Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Semester {selectedSemester} Subject-Wise Evaluation</span>
                </h2>
                <span className="text-xs text-slate-400 font-medium">
                  {selectedResult.examSession} • Board of Technical Education, Uttar Pradesh
                </span>
              </div>

              <button
                onClick={() => setActiveMarksheet(selectedResult)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
              >
                <Printer className="w-4 h-4" /> Print Semester {selectedSemester} Marksheet
              </button>
            </div>

            {/* Subjects Marks Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Subject Code</th>
                    <th className="py-3 px-4">Subject Name</th>
                    <th className="py-3 px-4 text-center">Theory (Max 50/60)</th>
                    <th className="py-3 px-4 text-center">Practical (Max 50/100)</th>
                    <th className="py-3 px-4 text-center">Total (Max 100)</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedResult.marks.map((sub: SubjectMark, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{sub.subjectCode}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{sub.subjectName}</td>
                      <td className="py-3.5 px-4 text-center font-mono">{sub.theoryObtained} / {sub.theoryMax}</td>
                      <td className="py-3.5 px-4 text-center font-mono">{sub.practicalObtained} / {sub.practicalMax}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900 dark:text-white">{sub.totalObtained} / {sub.totalMax}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-amber-600">{sub.grade}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          PASS
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}

      {/* Marksheet Print Modal */}
      {activeMarksheet && (
        <MarksheetModal
          result={activeMarksheet}
          isOpen={true}
          onClose={() => setActiveMarksheet(null)}
        />
      )}
    </div>
  );
};
