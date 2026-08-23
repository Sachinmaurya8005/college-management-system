import React from 'react';
import { StudentResult } from '../../types';
import { Modal } from '../common/Modal';
import { Printer, Download, Award, ShieldCheck, CheckCircle } from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { CollegeLogo } from '../common/CollegeLogo';

interface MarksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: StudentResult | null;
}

export const MarksheetModal: React.FC<MarksheetModalProps> = ({
  isOpen,
  onClose,
  result
}) => {
  const { settings } = useCollegeData();

  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="BTEUP Diploma Statement of Marks"
      subtitle={`Roll No: ${result.rollNo} • ${result.studentName}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Printable Marksheet Container */}
        <div className="printable-area bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border-2 border-polytechnic-900 dark:border-blue-500 shadow-2xl text-slate-900 dark:text-slate-100 font-sans relative overflow-hidden">
          {/* Official Board & Institution Crest Header */}
          <div className="text-center pb-5 border-b-2 border-polytechnic-900 dark:border-blue-500">
            <div className="flex items-center justify-center gap-3 mb-2">
              <CollegeLogo size="md" subtitle={false} />
            </div>

            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              BOARD OF TECHNICAL EDUCATION, UTTAR PRADESH, LUCKNOW
            </h3>
            <h2 className="font-serif text-lg sm:text-xl font-black text-polytechnic-900 dark:text-white uppercase mt-0.5">
              {settings.collegeName}
            </h2>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {settings.hindiName} (INSTITUTE CODE: {settings.bteupCode})
            </p>
            <div className="mt-2 inline-block px-4 py-1 bg-polytechnic-900 dark:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-md">
              STATEMENT OF MARKS — DIPLOMA IN ENGINEERING
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {result.examSession}
            </p>
          </div>

          {/* Student & Candidate Profile Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-3 rounded-xl my-4">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate Name</span>
              <strong className="text-slate-900 dark:text-white text-sm">{result.studentName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">BTEUP Roll Number</span>
              <strong className="font-mono text-slate-900 dark:text-white text-sm">{result.rollNo}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Enrollment Number</span>
              <strong className="font-mono text-slate-900 dark:text-white">{result.enrollmentNo}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Branch &amp; Semester</span>
              <strong className="text-slate-900 dark:text-white">
                {result.branch} (Sem-{result.semester})
              </strong>
            </div>
          </div>

          {/* Subject-wise Marks Table */}
          <div className="py-2 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-300 dark:border-slate-700">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold uppercase text-[10px] text-center">
                  <th className="border border-slate-300 dark:border-slate-700 p-2 text-left" rowSpan={2}>Subject Code &amp; Title</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-1" colSpan={2}>Theory Evaluation</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-1" colSpan={2}>Practical / Sessional</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-1" colSpan={2}>Aggregate Total</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2" rowSpan={2}>Letter Grade</th>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-[10px] text-center">
                  <th className="border border-slate-300 dark:border-slate-700 p-1.5">Max</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-1.5">Obt</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-1.5">Max</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-1.5">Obt</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-1.5">Max</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-1.5">Obt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {result.marks.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-center">
                    <td className="border border-slate-300 dark:border-slate-700 p-2 text-left font-medium">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 mr-2">{m.subjectCode}</span>
                      {m.subjectName}
                    </td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">{m.theoryMax || '-'}</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-bold">{m.theoryObtained || '-'}</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">{m.practicalMax || '-'}</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-bold">{m.practicalObtained || '-'}</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-semibold">{m.totalMax}</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-black text-slate-900 dark:text-white">
                      {m.totalObtained}
                    </td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-extrabold text-blue-600 dark:text-blue-400">
                      {m.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 dark:bg-slate-800/80 font-bold">
                <tr className="text-center">
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-right font-black uppercase text-xs">
                    Grand Total:
                  </td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2" colSpan={4}>-</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2 font-extrabold text-sm">{result.grandTotalMax}</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2 font-black text-sm text-emerald-600 dark:text-emerald-400">
                    {result.grandTotalObtained}
                  </td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2 font-black text-emerald-600">
                    {result.percentage}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Performance Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs my-4">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Semester SGPA</span>
              <strong className="text-base font-black text-blue-600 dark:text-blue-400">{result.cgpa} / 10.0</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Percentage</span>
              <strong className="text-base font-black text-slate-900 dark:text-white">{result.percentage}%</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Division Awarded</span>
              <strong className="text-xs font-bold text-slate-800 dark:text-slate-200">{result.division}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Final Result</span>
              <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                <CheckCircle className="w-3.5 h-3.5" /> {result.status}
              </span>
            </div>
          </div>

          {/* Signatures & Accreditation Footer */}
          <div className="pt-8 mt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="text-center">
              <div className="font-serif italic font-bold text-slate-700 dark:text-slate-300">
                Tabulator
              </div>
              <div className="text-[10px] text-slate-400">Exam Cell, GP Bansdeeh</div>
            </div>

            <div className="w-16 h-16 border-2 border-dashed border-polytechnic-900/40 rounded-full flex flex-col items-center justify-center text-center p-1 text-[8px] font-bold text-polytechnic-900 rotate-[-10deg]">
              <span>BTEUP SEAL</span>
              <span>LUCKNOW</span>
            </div>

            <div className="text-center">
              <div className="font-serif italic font-bold text-slate-700 dark:text-slate-300">
                Principal / Center Supdt.
              </div>
              <div className="text-[10px] text-slate-400">Govt. Polytechnic Bansdeeh, Ballia</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
          >
            <Printer className="w-4 h-4" /> Print BTEUP Marksheet
          </button>
        </div>
      </div>
    </Modal>
  );
};
