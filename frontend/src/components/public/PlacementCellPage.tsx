import React, { useState } from 'react';
import {
  Briefcase,
  Award,
  Building2,
  TrendingUp,
  Users,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Search,
  FileCheck,
  Send,
  Sparkles,
  MapPin,
  IndianRupee
} from 'lucide-react';
import { formatCurrencyINR } from '../../utils/helpers';
import confetti from 'canvas-confetti';

export const PlacementCellPage: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [appliedDrives, setAppliedDrives] = useState<string[]>([]);
  const [showApplyModal, setShowApplyModal] = useState<any | null>(null);

  const PLACEMENT_STATS = [
    { label: 'Highest Package', value: '₹4.80 LPA', sub: 'Tata Motors Technical' },
    { label: 'Average Package', value: '₹2.85 LPA', sub: 'Diploma Trainee' },
    { label: 'Total Placed (2025-26)', value: '184+', sub: '88.5% Placement Rate' },
    { label: 'Corporate Recruiters', value: '45+', sub: 'MNCs & Govt PSUs' }
  ];

  const TOP_RECRUITERS = [
    { name: 'Tata Motors', logo: '🚗', domain: 'Automobile & EV Engineering', hires: '38 Placed' },
    { name: 'Larsen & Toubro (L&T)', logo: '🏗️', domain: 'Civil & Heavy Infrastructure', hires: '26 Placed' },
    { name: 'Bharat Heavy Electricals (BHEL)', logo: '⚡', domain: 'Power Systems & Manufacturing', hires: '18 Placed' },
    { name: 'Tech Mahindra', logo: '💻', domain: 'IT & Cloud Infrastructure', hires: '22 Placed' },
    { name: 'Infosys BPM', logo: '🌐', domain: 'Digital Tech Services', hires: '19 Placed' },
    { name: 'Motherson Sumi', logo: '⚙️', domain: 'Precision Electronics & Wire Harness', hires: '31 Placed' },
    { name: 'Maruti Suzuki India', logo: '🏎️', domain: 'Production & Robotics Workshop', hires: '15 Placed' },
    { name: 'Schneider Electric', logo: '🔌', domain: 'Electrical Automation & Energy', hires: '15 Placed' }
  ];

  const ACTIVE_DRIVES = [
    {
      id: 'drv-01',
      company: 'Tata Motors Ltd',
      role: 'Diploma Engineer Trainee (DET)',
      package: 420000,
      eligibleBranches: ['Mechanical', 'Electrical', 'Electronics'],
      minPercentage: 60,
      date: '2026-05-20',
      location: 'Pune / Pantnagar Plant',
      openings: 35,
      status: 'Open'
    },
    {
      id: 'drv-02',
      company: 'L&T Construction',
      role: 'Junior Site Engineer (Diploma)',
      package: 380000,
      eligibleBranches: ['Civil', 'Mechanical', 'Electrical'],
      minPercentage: 65,
      date: '2026-05-28',
      location: 'Lucknow / Delhi-NCR Expressways',
      openings: 25,
      status: 'Open'
    },
    {
      id: 'drv-03',
      company: 'Tech Mahindra Ltd',
      role: 'Associate Network & Cloud Support Engineer',
      package: 350000,
      eligibleBranches: ['Computer Science', 'Information Technology', 'Electronics'],
      minPercentage: 60,
      date: '2026-06-05',
      location: 'Noida / Hyderabad Tech Park',
      openings: 20,
      status: 'Open'
    },
    {
      id: 'drv-04',
      company: 'Schneider Electric',
      role: 'Industrial Automation Specialist Trainee',
      package: 360000,
      eligibleBranches: ['Electrical', 'Electronics'],
      minPercentage: 65,
      date: '2026-06-12',
      location: 'Greater Noida Smart Factory',
      openings: 15,
      status: 'Open'
    }
  ];

  const filteredDrives = ACTIVE_DRIVES.filter(d =>
    selectedBranch === 'All' || d.eligibleBranches.some(b => b.includes(selectedBranch))
  );

  const handleApply = (drive: any) => {
    if (!appliedDrives.includes(drive.id)) {
      setAppliedDrives(prev => [...prev, drive.id]);
      confetti({ particleCount: 50, spread: 70 });
    }
    setShowApplyModal(null);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      {/* Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-slate-900 to-polytechnic-900 text-white shadow-2xl border border-polytechnic-800 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Training, Placement &amp; Apprenticeship Cell (TPO)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Campus Recruitment &amp; Career Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Government Polytechnic Bansdeeh bridges academic excellence with industry readiness. We partner with India's leading engineering corporations, PSUs, and technology giants for 100% placement and apprentice assistance.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-2 flex-shrink-0">
          <span className="text-3xl font-black text-amber-400">88.5%</span>
          <div className="text-xs font-bold text-white uppercase tracking-wider">Placement Rate 2025-26</div>
          <p className="text-[11px] text-blue-200">National NATS Portal Certified</p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {PLACEMENT_STATS.map((stat, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">{stat.label}</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stat.value}</div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* Top Recruiters Logos */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" /> Top Corporate Recruiters
            </h3>
            <p className="text-xs text-slate-500">Leading industrial partners hiring diploma engineers from GP Bansdeeh</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TOP_RECRUITERS.map((rec, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
              <span className="text-2xl">{rec.logo}</span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rec.name}</h4>
                <p className="text-[10px] text-slate-500 truncate">{rec.domain}</p>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{rec.hires}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Campus Drives */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" /> Active Campus Drives (सक्रिय भर्ती अभियान)
            </h3>
            <p className="text-xs text-slate-500">Apply directly for upcoming diploma engineering recruitment drives</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-bold">Filter by Branch:</span>
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="All">All Engineering Branches</option>
              <option value="Computer">Computer Science &amp; Engg</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Civil">Civil Engineering</option>
              <option value="Electrical">Electrical Engineering</option>
              <option value="Electronics">Electronics Engineering</option>
              <option value="Information">Information Technology</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDrives.map(drive => {
            const isApplied = appliedDrives.includes(drive.id);
            return (
              <div
                key={drive.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                        {drive.company}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                        {drive.role}
                      </h4>
                    </div>
                    <span className="text-sm font-black text-emerald-600 font-mono">
                      {formatCurrencyINR(drive.package)}/yr
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{drive.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Interview Drive Date: <strong className="text-slate-800 dark:text-slate-200">{drive.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Openings: <strong>{drive.openings} Positions</strong> • Min Criteria: <strong>{drive.minPercentage}% in Diploma</strong></span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Eligible Branches:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {drive.eligibleBranches.map((b, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Direct Campus Drive
                  </span>

                  {isApplied ? (
                    <button
                      disabled
                      className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Applied Successfully
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowApplyModal(drive)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" /> Apply for Drive
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Apply Confirmation Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Confirm Application: {showApplyModal.company}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              You are applying for <strong>{showApplyModal.role}</strong> ({formatCurrencyINR(showApplyModal.package)}/yr). Your academic dossier, attendance percentage, and BTEUP marks will be automatically submitted to the corporate HR.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
              <div>Interview Date: <strong>{showApplyModal.date}</strong></div>
              <div>Location: <strong>{showApplyModal.location}</strong></div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowApplyModal(null)}
                className="px-4 py-2 rounded-xl border text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApply(showApplyModal)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
