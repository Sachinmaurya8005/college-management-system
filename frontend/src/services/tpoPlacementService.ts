import { PlacementDrive, TopRecruiter, PlacementStats, TPOPlacementData } from '../types';

export const DEFAULT_TPO_STATS: PlacementStats = {
  highestPackage: '₹4.80 LPA',
  highestPackageCompany: 'Tata Motors Technical Wing',
  averagePackage: '₹2.85 LPA',
  averagePackageRole: 'Diploma Trainee Engineer (DET)',
  totalPlaced: '184+',
  placementRate: '88.5%',
  corporateRecruitersCount: '45+',
  natsCertified: true
};

export const DEFAULT_TOP_RECRUITERS: TopRecruiter[] = [
  { id: 'rec-1', name: 'Tata Motors', logo: '🚗', domain: 'Automobile & EV Engineering', hires: '38 Placed', packageRange: '₹3.6 - ₹4.8 LPA' },
  { id: 'rec-2', name: 'Larsen & Toubro (L&T)', logo: '🏗️', domain: 'Civil & Heavy Infrastructure', hires: '26 Placed', packageRange: '₹3.5 - ₹4.2 LPA' },
  { id: 'rec-3', name: 'Bharat Heavy Electricals (BHEL)', logo: '⚡', domain: 'Power Systems & Manufacturing', hires: '18 Placed', packageRange: '₹3.2 - ₹4.0 LPA' },
  { id: 'rec-4', name: 'Tech Mahindra', logo: '💻', domain: 'IT & Cloud Infrastructure', hires: '22 Placed', packageRange: '₹3.0 - ₹3.8 LPA' },
  { id: 'rec-5', name: 'Infosys BPM', logo: '🌐', domain: 'Digital Tech Services', hires: '19 Placed', packageRange: '₹2.8 - ₹3.5 LPA' },
  { id: 'rec-6', name: 'Motherson Sumi', logo: '⚙️', domain: 'Precision Electronics & Wire Harness', hires: '31 Placed', packageRange: '₹2.6 - ₹3.4 LPA' },
  { id: 'rec-7', name: 'Maruti Suzuki India', logo: '🏎️', domain: 'Production & Robotics Workshop', hires: '15 Placed', packageRange: '₹3.2 - ₹4.0 LPA' },
  { id: 'rec-8', name: 'Schneider Electric', logo: '🔌', domain: 'Electrical Automation & Energy', hires: '15 Placed', packageRange: '₹3.0 - ₹3.6 LPA' }
];

export const DEFAULT_ACTIVE_DRIVES: PlacementDrive[] = [
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
    status: 'Open',
    contactPerson: 'Er. R. K. Srivastava (TPO Officer)',
    description: 'Pool campus drive for final year diploma engineering students in vehicle production and assembly.'
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
    status: 'Open',
    contactPerson: 'Er. R. K. Srivastava (TPO Officer)',
    description: 'Site engineering and infrastructure project quality assurance role.'
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
    status: 'Open',
    contactPerson: 'Er. R. K. Srivastava (TPO Officer)',
    description: 'Enterprise network configuration, router maintenance and IT cloud helpdesk.'
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
    status: 'Open',
    contactPerson: 'Er. R. K. Srivastava (TPO Officer)',
    description: 'PLC/SCADA programming and smart electrical panel commissioning.'
  }
];

export const DEFAULT_TPO_OFFICER = {
  name: 'Er. R. K. Srivastava',
  designation: 'Head - Training & Placement Cell (TPO)',
  email: 'tpo@polytechnic.edu',
  phone: '+91 94150 99887'
};

const STORAGE_KEYS = {
  STATS: 'gpb_tpo_placement_stats',
  RECRUITERS: 'gpb_tpo_recruiters_list',
  DRIVES: 'gpb_tpo_campus_drives',
  OFFICER: 'gpb_tpo_officer_info'
};

const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('gpb_realtime_broadcast_channel')
  : null;

function notifyUpdate(type: string, data: any) {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type, payload: data });
    } catch {
      // ignore
    }
  }
}

export const tpoPlacementService = {
  getStats(): PlacementStats {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.STATS);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_TPO_STATS;
  },

  updateStats(stats: Partial<PlacementStats>): PlacementStats {
    const current = this.getStats();
    const updated = { ...current, ...stats };
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
      notifyUpdate('TPO_STATS_UPDATED', updated);
    } catch (e) {
      console.error(e);
    }
    return updated;
  },

  getRecruiters(): TopRecruiter[] {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.RECRUITERS);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_TOP_RECRUITERS;
  },

  saveRecruiters(list: TopRecruiter[]): TopRecruiter[] {
    try {
      localStorage.setItem(STORAGE_KEYS.RECRUITERS, JSON.stringify(list));
      notifyUpdate('TPO_RECRUITERS_UPDATED', list);
    } catch (e) {
      console.error(e);
    }
    return list;
  },

  addRecruiter(rec: Omit<TopRecruiter, 'id'>): TopRecruiter {
    const list = this.getRecruiters();
    const newRec: TopRecruiter = {
      ...rec,
      id: 'rec-' + Date.now()
    };
    list.unshift(newRec);
    this.saveRecruiters(list);
    return newRec;
  },

  updateRecruiter(id: string, updates: Partial<TopRecruiter>): TopRecruiter[] {
    const list = this.getRecruiters();
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.saveRecruiters(list);
    }
    return list;
  },

  deleteRecruiter(id: string): TopRecruiter[] {
    const list = this.getRecruiters().filter(r => r.id !== id);
    this.saveRecruiters(list);
    return list;
  },

  getDrives(): PlacementDrive[] {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.DRIVES);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ACTIVE_DRIVES;
  },

  saveDrives(list: PlacementDrive[]): PlacementDrive[] {
    try {
      localStorage.setItem(STORAGE_KEYS.DRIVES, JSON.stringify(list));
      notifyUpdate('TPO_DRIVES_UPDATED', list);
    } catch (e) {
      console.error(e);
    }
    return list;
  },

  addDrive(drive: Omit<PlacementDrive, 'id'>): PlacementDrive {
    const list = this.getDrives();
    const newDrive: PlacementDrive = {
      ...drive,
      id: 'drv-' + Date.now()
    };
    list.unshift(newDrive);
    this.saveDrives(list);
    return newDrive;
  },

  updateDrive(id: string, updates: Partial<PlacementDrive>): PlacementDrive[] {
    const list = this.getDrives();
    const idx = list.findIndex(d => d.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.saveDrives(list);
    }
    return list;
  },

  deleteDrive(id: string): PlacementDrive[] {
    const list = this.getDrives().filter(d => d.id !== id);
    this.saveDrives(list);
    return list;
  },

  getOfficer() {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.OFFICER);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_TPO_OFFICER;
  },

  updateOfficer(info: Partial<typeof DEFAULT_TPO_OFFICER>) {
    const current = this.getOfficer();
    const updated = { ...current, ...info };
    try {
      localStorage.setItem(STORAGE_KEYS.OFFICER, JSON.stringify(updated));
      notifyUpdate('TPO_OFFICER_UPDATED', updated);
    } catch (e) {
      console.error(e);
    }
    return updated;
  },

  getAllData(): TPOPlacementData {
    return {
      stats: this.getStats(),
      recruiters: this.getRecruiters(),
      drives: this.getDrives(),
      tpoOfficer: this.getOfficer()
    };
  },

  resetToDefault(): TPOPlacementData {
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.RECRUITERS);
    localStorage.removeItem(STORAGE_KEYS.DRIVES);
    localStorage.removeItem(STORAGE_KEYS.OFFICER);
    notifyUpdate('TPO_DATA_RESET', null);
    return this.getAllData();
  }
};
