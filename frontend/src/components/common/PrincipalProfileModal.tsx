import React from 'react';
import { Modal } from '../common/Modal';
import { PRINCIPAL_DETAILS } from '../../data/mockData';
import {
  Award,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Briefcase,
  Printer,
  FileBadge
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { CollegeLogo } from './CollegeLogo';

interface PrincipalProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrincipalProfileModal: React.FC<PrincipalProfileModalProps> = ({
  isOpen,
  onClose
}) => {
  const p = PRINCIPAL_DETAILS;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Principal Leadership Dossier: {p.name}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
            Head of Institution
          </span>
        </div>
      }
      subtitle="Government Polytechnic Bansdeeh, Ballia (Affiliated to BTEUP Lucknow)"
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Top Executive Profile Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-slate-900 to-polytechnic-900 text-white shadow-xl flex flex-col sm:flex-row items-center gap-6 border border-polytechnic-800">
          <img
            src={p.photoUrl}
            alt={p.name}
            className="w-28 h-28 rounded-2xl object-cover ring-4 ring-amber-400/60 shadow-2xl flex-shrink-0"
          />
          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Office of the Principal &amp; Chief Administrator</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              {p.name}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-amber-400">
              {p.designation}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {p.department}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-blue-200">
              <span className="bg-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Age: <strong className="text-white font-mono">{p.age} Years</strong> (DOB: {p.dob})
              </span>
              <span className="bg-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                Experience: <strong className="text-white font-mono">{p.experienceYears}+ Years</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Grid: Qualifications & Institutional Authority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Qualifications */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-card">
            <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Academic &amp; Professional Qualifications
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Degrees &amp; Specialization:</span>
              <p className="font-bold text-slate-900 dark:text-white text-xs leading-relaxed">
                {p.qualification}
              </p>
              <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold block pt-1">
                ✓ Fellow of Institution of Engineers (FIE) • Govt. Certified Technical Leader
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Key Achievements &amp; Mandates:</span>
              {p.achievements.map((ach: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{ach}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Jurisdiction & Contact */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-card">
            <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Official Office &amp; Directives
            </h4>

            <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Official Email</span>
                <span className="font-bold text-slate-900 dark:text-white">{p.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Chamber Helpline</span>
                <span className="font-bold text-slate-900 dark:text-white">{p.mobile}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Principal Since</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatDate(p.joiningDate)} (14+ Yrs at GPB)</span>
              </div>
              <div className="py-1">
                <span className="text-slate-500 font-medium flex items-center gap-1 mb-0.5">
                  <MapPin className="w-3 h-3 text-amber-500" /> Chamber Location
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  {p.officeLocation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message / Vision */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed italic">
          "{p.bio}"
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 no-print">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5" /> Print Profile
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
