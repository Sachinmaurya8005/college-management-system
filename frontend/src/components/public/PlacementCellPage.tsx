import React, { useState, useEffect } from 'react';
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
  IndianRupee,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
  RotateCcw,
  Sliders,
  X
} from 'lucide-react';
import { formatCurrencyINR } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import {
  PlacementDrive,
  TopRecruiter,
  PlacementStats
} from '../../types';
import {
  tpoPlacementService,
  DEFAULT_TPO_OFFICER
} from '../../services/tpoPlacementService';
import confetti from 'canvas-confetti';

const ALL_AVAILABLE_BRANCHES = [
  'Mechanical',
  'Civil',
  'Electrical',
  'Computer Science',
  'Electronics',
  'Information Technology'
];

export const PlacementCellPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Data State
  const [stats, setStats] = useState<PlacementStats>(() => tpoPlacementService.getStats());
  const [recruiters, setRecruiters] = useState<TopRecruiter[]>(() => tpoPlacementService.getRecruiters());
  const [drives, setDrives] = useState<PlacementDrive[]>(() => tpoPlacementService.getDrives());
  const [officer, setOfficer] = useState(() => tpoPlacementService.getOfficer());

  // Public Filter & Apply State
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [appliedDrives, setAppliedDrives] = useState<string[]>([]);
  const [showApplyModal, setShowApplyModal] = useState<PlacementDrive | null>(null);

  // Admin Modals State
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [editingDrive, setEditingDrive] = useState<PlacementDrive | null>(null);
  const [driveForm, setDriveForm] = useState<Partial<PlacementDrive>>({
    company: '',
    role: 'Diploma Engineer Trainee (DET)',
    package: 360000,
    eligibleBranches: ['Mechanical', 'Electrical'],
    minPercentage: 60,
    date: '2026-06-15',
    location: 'Uttar Pradesh / NCR',
    openings: 20,
    status: 'Open',
    contactPerson: officer.name,
    description: ''
  });

  const [showRecruiterModal, setShowRecruiterModal] = useState(false);
  const [editingRecruiter, setEditingRecruiter] = useState<TopRecruiter | null>(null);
  const [recruiterForm, setRecruiterForm] = useState<Partial<TopRecruiter>>({
    name: '',
    logo: '🏢',
    domain: 'Engineering & Manufacturing',
    hires: '20+ Placed',
    packageRange: '₹3.2 - ₹4.5 LPA'
  });

  const [showStatsModal, setShowStatsModal] = useState(false);
  const [statsForm, setStatsForm] = useState<PlacementStats>(stats);

  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [officerForm, setOfficerForm] = useState(officer);

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Real-time synchronization
  useEffect(() => {
    const channel = new BroadcastChannel('gpb_realtime_broadcast_channel');
    const handleBroadcast = (e: MessageEvent) => {
      if (e.data?.type === 'TPO_DRIVES_UPDATED') {
        setDrives(tpoPlacementService.getDrives());
      } else if (e.data?.type === 'TPO_RECRUITERS_UPDATED') {
        setRecruiters(tpoPlacementService.getRecruiters());
      } else if (e.data?.type === 'TPO_STATS_UPDATED') {
        setStats(tpoPlacementService.getStats());
      } else if (e.data?.type === 'TPO_OFFICER_UPDATED') {
        setOfficer(tpoPlacementService.getOfficer());
      } else if (e.data?.type === 'TPO_DATA_RESET') {
        setStats(tpoPlacementService.getStats());
        setRecruiters(tpoPlacementService.getRecruiters());
        setDrives(tpoPlacementService.getDrives());
        setOfficer(tpoPlacementService.getOfficer());
      }
    };
    channel.addEventListener('message', handleBroadcast);
    return () => {
      channel.removeEventListener('message', handleBroadcast);
      channel.close();
    };
  }, []);

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // --- DRIVE CRUD ---
  const handleOpenAddDrive = () => {
    setEditingDrive(null);
    setDriveForm({
      company: '',
      role: 'Diploma Engineer Trainee (DET)',
      package: 360000,
      eligibleBranches: ['Mechanical', 'Electrical'],
      minPercentage: 60,
      date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      location: 'Uttar Pradesh / NCR Plant',
      openings: 20,
      status: 'Open',
      contactPerson: officer.name,
      description: 'Campus recruitment drive for final year diploma engineering candidates.'
    });
    setShowDriveModal(true);
  };

  const handleOpenEditDrive = (drive: PlacementDrive) => {
    setEditingDrive(drive);
    setDriveForm({ ...drive });
    setShowDriveModal(true);
  };

  const handleSaveDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveForm.company?.trim()) {
      alert('कृपया कंपनी का नाम दर्ज करें।');
      return;
    }
    if (editingDrive) {
      const updated = tpoPlacementService.updateDrive(editingDrive.id, driveForm as PlacementDrive);
      setDrives(updated);
      showToast('✅ भर्ती विवरण सफलतापूर्वक अपडेट हो गया!');
    } else {
      const created = tpoPlacementService.addDrive(driveForm as Omit<PlacementDrive, 'id'>);
      setDrives(tpoPlacementService.getDrives());
      showToast('🎉 नई कंपनी भर्ती सफलतापूर्वक जोड़ी गई!');
    }
    setShowDriveModal(false);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleDeleteDrive = (id: string, company: string) => {
    if (window.confirm(`क्या आप वास्तव में "${company}" की इस भर्ती को हटाना चाहते हैं?`)) {
      const updated = tpoPlacementService.deleteDrive(id);
      setDrives(updated);
      showToast('🗑️ भर्ती रिकॉर्ड हटा दिया गया।');
    }
  };

  const toggleBranchSelection = (branch: string) => {
    const current = driveForm.eligibleBranches || [];
    if (current.includes(branch)) {
      if (current.length === 1) return; // Keep at least one
      setDriveForm({ ...driveForm, eligibleBranches: current.filter(b => b !== branch) });
    } else {
      setDriveForm({ ...driveForm, eligibleBranches: [...current, branch] });
    }
  };

  // --- RECRUITER CRUD ---
  const handleOpenAddRecruiter = () => {
    setEditingRecruiter(null);
    setRecruiterForm({
      name: '',
      logo: '🏢',
      domain: 'Engineering & Manufacturing',
      hires: '20+ Placed',
      packageRange: '₹3.2 - ₹4.5 LPA'
    });
    setShowRecruiterModal(true);
  };

  const handleOpenEditRecruiter = (rec: TopRecruiter) => {
    setEditingRecruiter(rec);
    setRecruiterForm({ ...rec });
    setShowRecruiterModal(true);
  };

  const handleSaveRecruiter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruiterForm.name?.trim()) {
      alert('कृपया कंपनी का नाम दर्ज करें।');
      return;
    }
    if (editingRecruiter) {
      const updated = tpoPlacementService.updateRecruiter(editingRecruiter.id, recruiterForm);
      setRecruiters(updated);
      showToast('✅ रिक्रूटर विवरण सफलतापूर्वक अपडेट हो गया!');
    } else {
      tpoPlacementService.addRecruiter(recruiterForm as Omit<TopRecruiter, 'id'>);
      setRecruiters(tpoPlacementService.getRecruiters());
      showToast('🎉 नया रिक्रूटर पार्टनर सफलतापूर्वक जोड़ा गया!');
    }
    setShowRecruiterModal(false);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleDeleteRecruiter = (id: string, name: string) => {
    if (window.confirm(`क्या आप वास्तव में "${name}" को रिक्रूटर सूची से हटाना चाहते हैं?`)) {
      const updated = tpoPlacementService.deleteRecruiter(id);
      setRecruiters(updated);
      showToast('🗑️ रिक्रूटर सूची से हटा दिया गया।');
    }
  };

  // --- STATS CRUD ---
  const handleOpenStats = () => {
    setStatsForm(stats);
    setShowStatsModal(true);
  };

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = tpoPlacementService.updateStats(statsForm);
    setStats(updated);
    setShowStatsModal(false);
    showToast('✅ प्लेसमेंट सांख्यिकी (KPIs) अपडेट हो गई!');
    confetti({ particleCount: 50, spread: 60 });
  };

  // --- OFFICER CRUD ---
  const handleOpenOfficer = () => {
    setOfficerForm(officer);
    setShowOfficerModal(true);
  };

  const handleSaveOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = tpoPlacementService.updateOfficer(officerForm);
    setOfficer(updated);
    setShowOfficerModal(false);
    showToast('✅ TPO अधिकारी संपर्क विवरण अपडेट हो गया!');
  };

  const handleResetDefaults = () => {
    if (window.confirm('क्या आप TPO प्लेसमेंट का संपूर्ण डेटा डिफ़ॉल्ट पर रीसेट करना चाहते हैं?')) {
      const data = tpoPlacementService.resetToDefault();
      setStats(data.stats);
      setRecruiters(data.recruiters);
      setDrives(data.drives);
      setOfficer(data.tpoOfficer);
      showToast('🔄 TPO डेटा डिफ़ॉल्ट पर रीसेट कर दिया गया।');
    }
  };

  // Filter drives for display
  const filteredDrives = drives.filter(d =>
    selectedBranch === 'All' || d.eligibleBranches.some(b => b.toLowerCase().includes(selectedBranch.toLowerCase()))
  );

  const handleApply = (drive: PlacementDrive) => {
    if (!appliedDrives.includes(drive.id)) {
      setAppliedDrives(prev => [...prev, drive.id]);
      confetti({ particleCount: 70, spread: 80 });
    }
    setShowApplyModal(null);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-2xl border border-slate-700 animate-slide-up flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* ADMIN CONTROLS BAR (Shown when logged in as Admin) */}
      {isAdmin && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl border border-blue-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-wide text-white">TPO Placement Admin Controller</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase">
                  Admin Access
                </span>
              </div>
              <p className="text-xs text-blue-200">
                भर्ती अभियान, रिक्रूटर कम्पनियाँ व प्लेसमेंट आंकड़े जोड़ें, बदलें या हटाएं।
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleOpenAddDrive}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> + नई भर्ती जोड़ें
            </button>
            <button
              onClick={handleOpenAddRecruiter}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> + रिक्रूटर जोड़ें
            </button>
            <button
              onClick={handleOpenStats}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-all"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-300" /> आंकड़े बदलें
            </button>
            <button
              onClick={handleOpenOfficer}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-blue-300" /> TPO Officer
            </button>
            <button
              onClick={handleResetDefaults}
              title="Reset TPO to Defaults"
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
            Government Polytechnic bridges academic excellence with industry readiness. We partner with India's leading engineering corporations, PSUs, and technology giants for 100% placement and apprentice assistance.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" /> TPO Officer: <strong className="text-white">{officer.name}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-400" /> {officer.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-amber-400" /> {officer.phone}
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-2 flex-shrink-0">
          <span className="text-3xl font-black text-amber-400">{stats.placementRate}</span>
          <div className="text-xs font-bold text-white uppercase tracking-wider">Placement Rate 2025-26</div>
          <p className="text-[11px] text-blue-200">National NATS Portal Certified</p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Placement Highlights &amp; Packages</h3>
          {isAdmin && (
            <button
              onClick={handleOpenStats}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" /> Edit Stats (आंकड़े बदलें)
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1 relative group">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Highest Package</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stats.highestPackage}</div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block truncate">{stats.highestPackageCompany}</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Average Package</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stats.averagePackage}</div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block truncate">{stats.averagePackageRole}</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Placed (2025-26)</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stats.totalPlaced}</div>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 block truncate">{stats.placementRate} Placement Rate</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Corporate Recruiters</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stats.corporateRecruitersCount}</div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 block truncate">MNCs &amp; Govt PSUs</span>
          </div>
        </div>
      </div>

      {/* Top Recruiters Logos */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" /> Top Corporate Recruiters ({recruiters.length} कम्पनियाँ)
            </h3>
            <p className="text-xs text-slate-500">Leading industrial partners hiring diploma engineers from Government Polytechnic</p>
          </div>
          {isAdmin && (
            <button
              onClick={handleOpenAddRecruiter}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" /> + Add Recruiter Company
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recruiters.map(rec => (
            <div
              key={rec.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 flex items-start justify-between gap-3 group hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="text-2xl flex-shrink-0">{rec.logo || '🏢'}</span>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{rec.name}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{rec.domain}</p>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{rec.hires}</span>
                    {rec.packageRange && (
                      <span className="text-slate-400 font-mono">({rec.packageRange})</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Actions for Recruiter */}
              {isAdmin && (
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEditRecruiter(rec)}
                    title="Edit Recruiter"
                    className="p-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteRecruiter(rec.id, rec.name)}
                    title="Delete Recruiter"
                    className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
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

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <button
                onClick={handleOpenAddDrive}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
              >
                <Plus className="w-4 h-4" /> + नई कंपनी भर्ती जोड़ें
              </button>
            )}

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-bold">Filter Branch:</span>
              <select
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="All">All Engineering Branches</option>
                {ALL_AVAILABLE_BRANCHES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDrives.map(drive => {
            const isApplied = appliedDrives.includes(drive.id);
            return (
              <div
                key={drive.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                          {drive.company}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          drive.status === 'Open'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : drive.status === 'Upcoming'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {drive.status}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                        {drive.role}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-600 font-mono block">
                        {formatCurrencyINR(drive.package)}/yr
                      </span>
                      <span className="text-[10px] text-slate-400">CTC Package</span>
                    </div>
                  </div>

                  {drive.description && (
                    <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                      {drive.description}
                    </p>
                  )}

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{drive.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Drive Date: <strong className="text-slate-800 dark:text-slate-200">{drive.date}</strong></span>
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

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Direct Campus Drive
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Admin Edit & Delete Buttons */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 mr-2">
                        <button
                          onClick={() => handleOpenEditDrive(drive)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDrive(drive.id, drive.company)}
                          className="px-2.5 py-1.5 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    )}

                    {isApplied ? (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Applied
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
              </div>
            );
          })}
        </div>

        {filteredDrives.length === 0 && (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-slate-500 font-bold text-sm">No campus drives found matching branch "{selectedBranch}".</p>
            {isAdmin && (
              <button
                onClick={handleOpenAddDrive}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> + Create New Drive for this branch
              </button>
            )}
          </div>
        )}
      </div>

      {/* ================= MODAL: ADD / EDIT CAMPUS DRIVE ================= */}
      {showDriveModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span>{editingDrive ? 'भर्ती विवरण बदलें (Edit Campus Drive)' : 'नई कंपनी भर्ती जोड़ें (Add Campus Drive)'}</span>
              </h3>
              <button
                onClick={() => setShowDriveModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDrive} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name (कंपनी का नाम) *</label>
                  <input
                    type="text"
                    required
                    value={driveForm.company || ''}
                    onChange={e => setDriveForm({ ...driveForm, company: e.target.value })}
                    placeholder="e.g. Tata Motors Ltd"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-emerald-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Job Role / Designation (पद का नाम) *</label>
                  <input
                    type="text"
                    required
                    value={driveForm.role || ''}
                    onChange={e => setDriveForm({ ...driveForm, role: e.target.value })}
                    placeholder="e.g. Diploma Engineer Trainee (DET)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Annual CTC in ₹ (वार्षिक पैकेज) *</label>
                  <input
                    type="number"
                    required
                    step="10000"
                    value={driveForm.package || 360000}
                    onChange={e => setDriveForm({ ...driveForm, package: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 420000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">
                    {formatCurrencyINR(driveForm.package || 0)}/yr
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Drive Date (साक्षात्कार तिथि) *</label>
                  <input
                    type="date"
                    required
                    value={driveForm.date || ''}
                    onChange={e => setDriveForm({ ...driveForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location (स्थान / प्लांट)</label>
                  <input
                    type="text"
                    value={driveForm.location || ''}
                    onChange={e => setDriveForm({ ...driveForm, location: e.target.value })}
                    placeholder="e.g. Pune / Pantnagar Plant"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Openings &amp; Min % Criteria</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={driveForm.openings || 20}
                      onChange={e => setDriveForm({ ...driveForm, openings: parseInt(e.target.value) || 1 })}
                      placeholder="Openings"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                    />
                    <input
                      type="number"
                      value={driveForm.minPercentage || 60}
                      onChange={e => setDriveForm({ ...driveForm, minPercentage: parseInt(e.target.value) || 50 })}
                      placeholder="Min %"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Drive Status (स्थिति)</label>
                  <select
                    value={driveForm.status || 'Open'}
                    onChange={e => setDriveForm({ ...driveForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold outline-none"
                  >
                    <option value="Open">Open (खुला है)</option>
                    <option value="Upcoming">Upcoming (आगामी)</option>
                    <option value="Completed">Completed (संपन्न)</option>
                    <option value="Closed">Closed (बंद)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">TPO Contact Person</label>
                  <input
                    type="text"
                    value={driveForm.contactPerson || officer.name}
                    onChange={e => setDriveForm({ ...driveForm, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Eligible Branches Selection */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Eligible Diploma Branches (पात्र डिप्लोमा शाखाएं चुनें) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_AVAILABLE_BRANCHES.map(branch => {
                    const isSelected = driveForm.eligibleBranches?.includes(branch);
                    return (
                      <button
                        key={branch}
                        type="button"
                        onClick={() => toggleBranchSelection(branch)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-1 ring-emerald-500'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-300'
                        }`}
                      >
                        <span>{branch}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Drive Description / Special Instructions</label>
                <textarea
                  rows={2}
                  value={driveForm.description || ''}
                  onChange={e => setDriveForm({ ...driveForm, description: e.target.value })}
                  placeholder="Additional eligibility requirements, exam rounds or documents needed..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDriveModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md shadow-emerald-600/30"
                >
                  {editingDrive ? 'Save Drive Updates' : 'Publish Campus Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT RECRUITER ================= */}
      {showRecruiterModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>{editingRecruiter ? 'रिक्रूटर विवरण बदलें' : 'नया रिक्रूटर पार्टनर जोड़ें'}</span>
              </h3>
              <button
                onClick={() => setShowRecruiterModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecruiter} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name (कंपनी का नाम) *</label>
                <input
                  type="text"
                  required
                  value={recruiterForm.name || ''}
                  onChange={e => setRecruiterForm({ ...recruiterForm, name: e.target.value })}
                  placeholder="e.g. Maruti Suzuki India"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Industry Domain (उद्योग क्षेत्र) *</label>
                <input
                  type="text"
                  required
                  value={recruiterForm.domain || ''}
                  onChange={e => setRecruiterForm({ ...recruiterForm, domain: e.target.value })}
                  placeholder="e.g. Automobile &amp; EV Engineering"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Logo Emoji / Icon</label>
                  <input
                    type="text"
                    value={recruiterForm.logo || '🏢'}
                    onChange={e => setRecruiterForm({ ...recruiterForm, logo: e.target.value })}
                    placeholder="e.g. 🚗, 🏗️, 💻, ⚡"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center text-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Hires Count</label>
                  <input
                    type="text"
                    value={recruiterForm.hires || '20+ Placed'}
                    onChange={e => setRecruiterForm({ ...recruiterForm, hires: e.target.value })}
                    placeholder="e.g. 35 Placed"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none font-semibold text-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Package Range (पैकेज सीमा)</label>
                <input
                  type="text"
                  value={recruiterForm.packageRange || '₹3.2 - ₹4.5 LPA'}
                  onChange={e => setRecruiterForm({ ...recruiterForm, packageRange: e.target.value })}
                  placeholder="e.g. ₹3.5 - ₹4.8 LPA"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRecruiterModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md shadow-blue-600/30"
                >
                  Save Recruiter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT PLACEMENT STATS ================= */}
      {showStatsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <span>Edit Placement Highlights &amp; KPIs (सांख्यिकी सुधारें)</span>
              </h3>
              <button
                onClick={() => setShowStatsModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStats} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Highest Package</label>
                  <input
                    type="text"
                    value={statsForm.highestPackage}
                    onChange={e => setStatsForm({ ...statsForm, highestPackage: e.target.value })}
                    placeholder="e.g. ₹4.80 LPA"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Highest Package Company</label>
                  <input
                    type="text"
                    value={statsForm.highestPackageCompany}
                    onChange={e => setStatsForm({ ...statsForm, highestPackageCompany: e.target.value })}
                    placeholder="e.g. Tata Motors"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Average Package</label>
                  <input
                    type="text"
                    value={statsForm.averagePackage}
                    onChange={e => setStatsForm({ ...statsForm, averagePackage: e.target.value })}
                    placeholder="e.g. ₹2.85 LPA"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Average Package Role</label>
                  <input
                    type="text"
                    value={statsForm.averagePackageRole}
                    onChange={e => setStatsForm({ ...statsForm, averagePackageRole: e.target.value })}
                    placeholder="e.g. Diploma Trainee"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Total Placed (Students)</label>
                  <input
                    type="text"
                    value={statsForm.totalPlaced}
                    onChange={e => setStatsForm({ ...statsForm, totalPlaced: e.target.value })}
                    placeholder="e.g. 184+"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Placement Rate %</label>
                  <input
                    type="text"
                    value={statsForm.placementRate}
                    onChange={e => setStatsForm({ ...statsForm, placementRate: e.target.value })}
                    placeholder="e.g. 88.5%"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold outline-none text-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowStatsModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md"
                >
                  Save Stats
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT TPO OFFICER ================= */}
      {showOfficerModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Edit TPO Officer Contact Info</span>
              </h3>
              <button
                onClick={() => setShowOfficerModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOfficer} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Officer Name (अधिकारी का नाम)</label>
                <input
                  type="text"
                  required
                  value={officerForm.name}
                  onChange={e => setOfficerForm({ ...officerForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Designation (पद)</label>
                <input
                  type="text"
                  required
                  value={officerForm.designation}
                  onChange={e => setOfficerForm({ ...officerForm, designation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={officerForm.email}
                  onChange={e => setOfficerForm({ ...officerForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile / Phone Number</label>
                <input
                  type="text"
                  required
                  value={officerForm.phone}
                  onChange={e => setOfficerForm({ ...officerForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowOfficerModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md"
                >
                  Save Officer Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: STUDENT APPLY FOR DRIVE ================= */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs animate-scale-up">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Confirm Application: {showApplyModal.company}</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              You are applying for <strong>{showApplyModal.role}</strong> ({formatCurrencyINR(showApplyModal.package)}/yr CTC). Your verified academic dossier, attendance record, and BTEUP marks will be automatically submitted to the TPO &amp; Corporate HR.
            </p>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 space-y-1.5 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Interview Drive Date:</span>
                <strong className="text-slate-900 dark:text-white font-mono">{showApplyModal.date}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Plant / Location:</span>
                <strong className="text-slate-900 dark:text-white">{showApplyModal.location}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Eligible Branches:</span>
                <span className="font-semibold text-emerald-600">{showApplyModal.eligibleBranches.join(', ')}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowApplyModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApply(showApplyModal)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
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
