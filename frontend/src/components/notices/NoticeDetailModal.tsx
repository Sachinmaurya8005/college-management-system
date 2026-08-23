import React from 'react';
import { NoticeItem } from '../../types';
import { Modal } from '../common/Modal';
import { Printer, Download, Clock, Tag, UserCheck, ShieldCheck, FileText } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { useCollegeData } from '../../context/CollegeDataContext';
import { CollegeLogo } from '../common/CollegeLogo';

interface NoticeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: NoticeItem | null;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({
  isOpen,
  onClose,
  notice
}) => {
  const { settings } = useCollegeData();

  if (!notice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Administrative Circular"
      subtitle={`Ref: ${notice.referenceNo}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Printable Official Circular Document */}
        <div className="printable-area bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-xl text-slate-900 dark:text-slate-100 font-sans relative">
          {/* Header */}
          <div className="text-center pb-5 border-b-2 border-polytechnic-900 dark:border-blue-500">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CollegeLogo size="sm" subtitle={false} />
            </div>
            <h2 className="font-serif text-base sm:text-lg font-black uppercase text-polytechnic-900 dark:text-white">
              {settings.collegeName}
            </h2>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {settings.hindiName} (BTEUP CODE: {settings.bteupCode})
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              {settings.address}, {settings.district} - {settings.pincode} (U.P.)
            </p>
          </div>

          {/* Reference & Date Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-slate-200 dark:border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-400 font-sans">Ref No: </span>
              <strong>{notice.referenceNo}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-sans">Date: </span>
              <strong>{formatDate(notice.publishDate)}</strong>
            </div>
          </div>

          {/* Subject Headline */}
          <div className="my-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Subject / Circular Title:
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              {notice.title}
            </h3>
          </div>

          {/* Notice Body */}
          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 whitespace-pre-line py-2">
            {notice.content}
          </div>

          {/* Attachment Pill if present */}
          {notice.attachmentName && (
            <div className="mt-5 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold">
                <FileText className="w-4 h-4" />
                <span>Enclosure: {notice.attachmentName}</span>
              </div>
              <button
                onClick={() => alert(`Simulating download of ${notice.attachmentName}`)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[11px] font-bold hover:bg-blue-700 flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>
          )}

          {/* Signatory Footer */}
          <div className="pt-10 mt-8 border-t border-slate-200 dark:border-slate-800 flex items-end justify-between text-xs">
            <div className="text-slate-500 text-[10px] space-y-0.5">
              <div>Copy to:</div>
              <div>1. All Head of Departments (CSE / ME / CE / EE / ECE / IT)</div>
              <div>2. Student Notice Boards (Academic &amp; Hostel)</div>
              <div>3. Institution Website Portal</div>
            </div>

            <div className="text-center">
              <div className="font-serif italic font-bold text-slate-900 dark:text-white text-sm mb-1">
                {settings.principalName}
              </div>
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                {notice.issuedBy}
              </div>
              <div className="text-[10px] text-slate-400">Govt. Polytechnic Uttar Pradesh</div>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
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
            <Printer className="w-4 h-4" /> Print Official Circular
          </button>
        </div>
      </div>
    </Modal>
  );
};
