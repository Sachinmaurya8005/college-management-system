import { apiClient } from './api';
import {
  PublicHomePayload,
  AboutCollegeData,
  CollegeLocationData,
  Facility,
  GalleryItem,
  ImportantLink,
  PublicFeeStructure,
  Course,
  NoticeItem,
  ExamSchedule,
  TimetableSlot
} from '../types';
import {
  INITIAL_COURSES,
  INITIAL_NOTICES,
  INITIAL_EXAMS,
  INITIAL_TIMETABLE,
  INITIAL_TEACHERS
} from '../data/mockData';

export const DEFAULT_FACILITIES: Facility[] = [
  {
    id: 1,
    title: 'Advanced Computer & AI Computing Center',
    category: 'Laboratories',
    short_description: 'High-speed gigabit networked computing center with 120+ Core-i7 workstations and Python AI lab tools.',
    detailed_notes: 'The Advanced Computer Center provides round-the-clock high-speed fiber internet, Linux & Windows dual-boot development environments, Oracle/PostgreSQL databases, and modern web application development stacks for CSE and IT diploma students.',
    cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
    equipment_list: ['120x Intel Core-i7 16GB Workstations', '1 Gbps Dedicated NKN Fiber Leased Line', 'Cisco Layer-3 Managed Switches', 'Smart Interactive Displays & Projectors'],
    display_order: 1,
    status: 'Published'
  },
  {
    id: 2,
    title: 'Central Mechanical Engineering Workshop',
    category: 'Workshops',
    short_description: 'Industrial grade manufacturing workshop equipped with CNC trainers, high-precision lathe machines, and welding bays.',
    detailed_notes: 'Offers hands-on training in basic fitting, sheet metal work, gas & arc welding, foundry, carpentry, and precision machining to build practical workshop competencies from the 1st year.',
    cover_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&fit=crop',
    equipment_list: ['18x Heavy-duty Center Lathe Machines', 'MIG & TIG Electric Arc Welding Units', 'Universal Milling Machine', 'Hydraulic Shaping & Planing Machines'],
    display_order: 2,
    status: 'Published'
  },
  {
    id: 3,
    title: 'Digital Electronics & Microprocessor Laboratory',
    category: 'Laboratories',
    short_description: 'Cutting-edge instrumentation for digital logic design, 8085/8086 microprocessors, and embedded IoT trainers.',
    detailed_notes: 'Designed for practical experiments in digital switching circuits, communication engineering, microcontroller programming, and VLSI circuit simulation.',
    cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop',
    equipment_list: ['20x Digital Storage Oscilloscopes (DSO 100MHz)', '8085 / 8086 Microprocessor Development Kits', 'FPGA & Arduino IoT Embedded Trainer Kits', 'Function Generators & DC Regulated Power Supplies'],
    display_order: 3,
    status: 'Published'
  },
  {
    id: 4,
    title: 'Central Library & Digital Reference Wing',
    category: 'Library',
    short_description: 'Repository of 22,000+ technical volumes, national journals, and DELNET digital e-book access terminals.',
    detailed_notes: 'Automated library system with open-access book stacks, separate reading halls for 150+ students, previous years BTEUP question banks, and competitive technical exam preparation sections.',
    cover_image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=500&fit=crop',
    equipment_list: ['22,000+ Technical Engineering Textbooks', 'DELNET Digital E-Journal Consortium Terminals', 'Automated RFID / Barcode Book Circulation System', 'Air-conditioned 150-seat Reading Hall'],
    display_order: 4,
    status: 'Published'
  }
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 1,
    title: 'Annual Technical Exhibition & Project Showcase 2026',
    category: 'Events',
    image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop',
    description: 'Final year diploma engineering students demonstrating working robotics and IoT prototypes.',
    date: '2026-03-15',
    status: 'Published'
  },
  {
    id: 2,
    title: 'Main Institutional Administrative & Academic Complex',
    category: 'Campus',
    image_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop',
    description: 'Lush green 12.5-acre campus situated in Bansdeeh, Ballia, Uttar Pradesh.',
    date: '2026-02-20',
    status: 'Published'
  },
  {
    id: 3,
    title: 'Central Workshop Practice & Lathe Turning Session',
    category: 'Labs',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    description: 'Mechanical engineering students acquiring hands-on machining competence.',
    date: '2026-03-01',
    status: 'Published'
  },
  {
    id: 4,
    title: 'Computer Science Software Coding & Project Lab',
    category: 'Labs',
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
    description: 'Hands-on web engineering and database management laboratory session.',
    date: '2026-03-10',
    status: 'Published'
  },
  {
    id: 5,
    title: 'Republic Day & Independence Day Celebrations',
    category: 'Celebrations',
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop',
    description: 'Flag hoisting and cultural presentations by faculty and student council.',
    date: '2026-01-26',
    status: 'Published'
  },
  {
    id: 6,
    title: 'Campus Placement & Industrial Recruitment Drive',
    category: 'Placements',
    image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop',
    description: 'Reputed engineering corporations conducting interviews for final semester students.',
    date: '2026-03-05',
    status: 'Published'
  }
];

export const DEFAULT_LINKS: ImportantLink[] = [
  {
    id: 1,
    title: 'Board of Technical Education, Uttar Pradesh (BTEUP Lucknow)',
    description: 'Official Examination portal for syllabus, exam schedules, and semester marksheet verification.',
    url: 'https://bteup.ac.in',
    category: 'Affiliation & Board',
    is_active: true,
    display_order: 1
  },
  {
    id: 2,
    title: 'All India Council for Technical Education (AICTE New Delhi)',
    description: 'Apex national regulatory body for technical institutions, accreditation, and scholarship schemes.',
    url: 'https://aicte-india.org',
    category: 'National Regulatory Body',
    is_active: true,
    display_order: 2
  },
  {
    id: 3,
    title: 'UP Scholarship & Fee Reimbursement Online System',
    description: 'Official portal for Post-Matric and Technical Diploma fee scholarship applications and biometric authentication.',
    url: 'https://scholarship.up.gov.in',
    category: 'Government Schemes',
    is_active: true,
    display_order: 3
  },
  {
    id: 4,
    title: 'JEECUP - UP Polytechnic Joint Entrance Examination',
    description: 'Official counseling and entrance examination gateway for polytechnic diploma admissions across Uttar Pradesh.',
    url: 'https://jeecup.admissions.nic.in',
    category: 'Admissions & Entrance',
    is_active: true,
    display_order: 4
  },
  {
    id: 5,
    title: 'Department of Technical Education, Government of Uttar Pradesh',
    description: 'Administrative nodal department for government polytechnics, staffing, and development grants.',
    url: 'http://dte.up.gov.in',
    category: 'State Government',
    is_active: true,
    display_order: 5
  }
];

export const DEFAULT_FEES: PublicFeeStructure[] = [
  {
    id: 1,
    branch: 'All Diploma Branches (CSE, ME, CE, EE, ECE, IT)',
    academic_year: '2025-2026',
    fee_type: 'Annual Government Tuition Fee',
    amount: 8000,
    notes: 'Subsidized state government tuition fee as regulated by BTEUP Lucknow.',
    is_published: true,
    display_order: 1
  },
  {
    id: 2,
    branch: 'All Diploma Branches',
    academic_year: '2025-2026',
    fee_type: 'Student Welfare & Development Fund',
    amount: 1500,
    notes: 'Includes sports, cultural activities, student magazine, and ID cards.',
    is_published: true,
    display_order: 2
  },
  {
    id: 3,
    branch: 'All Diploma Branches',
    academic_year: '2025-2026',
    fee_type: 'Central Library & Digital Resource Fee',
    amount: 800,
    notes: 'Covers library book bank access and online journal memberships.',
    is_published: true,
    display_order: 3
  },
  {
    id: 4,
    branch: 'All Diploma Branches',
    academic_year: '2025-2026',
    fee_type: 'Institutional Caution Money (Refundable)',
    amount: 1000,
    notes: 'One-time refundable security deposit payable at the time of 1st year admission.',
    is_published: true,
    display_order: 4
  },
  {
    id: 5,
    branch: 'All Diploma Branches',
    academic_year: '2025-2026',
    fee_type: 'BTEUP Semester Examination Fee',
    amount: 1150,
    notes: 'Payable per semester for BTEUP theory & practical exam registration.',
    is_published: true,
    display_order: 5
  }
];

export const DEFAULT_ABOUT: AboutCollegeData = {
  college_name: 'Government Polytechnic Bansdeeh, Ballia',
  hindi_name: 'राजकीय पॉलिटेक्निक बांसडीह, बलिया',
  bteup_code: '4412',
  aicte_approval: 'Approved by AICTE New Delhi & Affiliated to BTEUP Lucknow',
  history: 'Government Polytechnic Bansdeeh, Ballia was established by the Department of Technical Education, Government of Uttar Pradesh to extend high-standard engineering diploma education to the Purvanchal region. Spanning 12.5 acres of modern campus infrastructure, the institution provides 6 AICTE-approved 3-year diploma programs with advanced laboratories, machine workshops, and computer centers.',
  vision: 'To emerge as a benchmark institution in technical education, practical skill competence, and innovation, empowering students from all socioeconomic strata to become globally competitive engineers and entrepreneurs.',
  mission: 'To deliver rigorous industry-aligned engineering curricula, hands-on workshop training, and moral ethics, ensuring high employability and sustainable nation-building.',
  principal_name: 'Er. R. C. Srivastava',
  principal_message: 'Technical education is the cornerstone of industrial transformation and self-reliance. At Government Polytechnic Bansdeeh, we are committed to providing top-tier academic discipline, modern laboratory experiences, and career development to every student.',
  principal_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
  achievements: [
    'Affiliated to Board of Technical Education, Uttar Pradesh (BTEUP Code 4412)',
    'Approved by All India Council for Technical Education (AICTE), New Delhi',
    '100% Campus High-Speed Fiber Internet & Smart Classrooms',
    'Active Industry Partnerships and Robust Placement Record in Top MNCs'
  ],
  key_highlights: [
    '6 High-Demand 3-Year Diploma Engineering Branches',
    '14+ Fully Equipped Practical Laboratories and Central Workshop',
    '22,000+ Volume Automated Central Library with DELNET E-Resources',
    '100% UP Government Subsidized Fee Structure & Scholarship Facilitation'
  ]
};

export const DEFAULT_LOCATION: CollegeLocationData = {
  address: 'Government Polytechnic Bansdeeh, Ballia, Uttar Pradesh',
  district: 'Ballia',
  state: 'Uttar Pradesh',
  pincode: '277202',
  landmark: 'Near Bansdeeh Stadium, Bansdeeh Road',
  latitude: 25.86472,
  longitude: 84.22153,
  map_embed_url: 'https://maps.google.com/maps?q=Bansdeeh,Ballia,Uttar+Pradesh&t=&z=13&ie=UTF8&iwloc=&output=embed',
  map_view_url: 'https://maps.google.com/?q=25.86472,84.22153',
  directions_url: 'https://www.google.com/maps/dir/?api=1&destination=25.86472,84.22153',
  connectivity_bus: 'Bansdeeh Bus Stand (2.5 km) with regular buses connecting Ballia City, Sikanderpur, and Patna.',
  connectivity_train: 'Ballia Railway Station - BUI (18 km) connected to major trains via Varanasi and Gorakhpur.',
  contact_phone: '+91 94150 24510 / +91 5498 299100',
  contact_email: 'principal.gpbansdeeh@gmail.com'
};

export const DEFAULT_HOME_PAYLOAD: PublicHomePayload = {
  college_name: 'Government Polytechnic Bansdeeh, Ballia',
  bteup_code: '4412',
  aicte_approval: 'Approved by AICTE New Delhi & Affiliated to BTEUP Lucknow',
  principal_name: 'Er. R. C. Srivastava',
  principal_message: 'Our mission is to foster technical excellence, practical workshop competence, and disciplined leadership in every diploma engineer.',
  principal_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
  history_snippet: 'Government Polytechnic Bansdeeh, Ballia is a premier government institution dedicated to excellence in 3-year technical diploma engineering programs with world-class laboratories and workshop facilities.',
  location: DEFAULT_LOCATION,
  latest_notices: INITIAL_NOTICES,
  courses: INITIAL_COURSES,
  featured_facilities: DEFAULT_FACILITIES,
  gallery_preview: DEFAULT_GALLERY,
  upcoming_exams: INITIAL_EXAMS,
  important_links: DEFAULT_LINKS,
  public_fees: DEFAULT_FEES
};

// Safe API response parser: ensures if server returns HTML string on 404/SPA rewrite, we return fallback
function isObjectPayload<T>(val: any): val is T {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function isArrayPayload<T>(val: any): val is T[] {
  return Array.isArray(val);
}

export const publicService = {
  getHomeOverview: async (): Promise<PublicHomePayload> => {
    try {
      const res = await apiClient.get<PublicHomePayload>('/public/home/');
      if (isObjectPayload<PublicHomePayload>(res.data) && res.data.college_name) {
        return res.data;
      }
    } catch (e) {
      // Backend offline / not reachable
    }
    return DEFAULT_HOME_PAYLOAD;
  },

  getAboutCollege: async (): Promise<AboutCollegeData> => {
    try {
      const res = await apiClient.get<AboutCollegeData>('/public/about/');
      if (isObjectPayload<AboutCollegeData>(res.data) && res.data.college_name) {
        return res.data;
      }
    } catch (e) {
      // Backend offline
    }
    return DEFAULT_ABOUT;
  },

  getCollegeLocation: async (): Promise<CollegeLocationData> => {
    try {
      const res = await apiClient.get<CollegeLocationData>('/public/location/');
      if (isObjectPayload<CollegeLocationData>(res.data) && res.data.address) {
        return res.data;
      }
    } catch (e) {
      // Backend offline
    }
    return DEFAULT_LOCATION;
  },

  getFacilities: async (category?: string): Promise<Facility[]> => {
    try {
      const params = category && category !== 'All' ? { category } : {};
      const res = await apiClient.get<Facility[]>('/public/facilities/', { params });
      if (isArrayPayload<Facility>(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (e) {
      // Backend offline
    }
    if (category && category !== 'All') {
      return DEFAULT_FACILITIES.filter(f => f.category.toLowerCase() === category.toLowerCase());
    }
    return DEFAULT_FACILITIES;
  },

  getGallery: async (category?: string): Promise<GalleryItem[]> => {
    try {
      const params = category && category !== 'All' ? { category } : {};
      const res = await apiClient.get<GalleryItem[]>('/public/gallery/', { params });
      if (isArrayPayload<GalleryItem>(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (e) {
      // Backend offline
    }
    if (category && category !== 'All') {
      return DEFAULT_GALLERY.filter(g => g.category.toLowerCase() === category.toLowerCase());
    }
    return DEFAULT_GALLERY;
  },

  getImportantLinks: async (): Promise<ImportantLink[]> => {
    try {
      const res = await apiClient.get<ImportantLink[]>('/public/links/');
      if (isArrayPayload<ImportantLink>(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (e) {
      // Backend offline
    }
    return DEFAULT_LINKS;
  },

  getPublicFees: async (): Promise<PublicFeeStructure[]> => {
    try {
      const res = await apiClient.get<PublicFeeStructure[]>('/public/fees/');
      if (isArrayPayload<PublicFeeStructure>(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (e) {
      // Backend offline
    }
    return DEFAULT_FEES;
  },

  getPublicCourses: async (): Promise<Course[]> => {
    try {
      const res = await apiClient.get<Course[]>('/public/courses/');
      if (isArrayPayload<Course>(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (e) {
      // Backend offline
    }
    return INITIAL_COURSES;
  },

  getPublicFaculty: async (department?: string): Promise<any[]> => {
    try {
      const params = department && department !== 'All' ? { department } : {};
      const res = await apiClient.get<any[]>('/public/faculty/', { params });
      if (isArrayPayload(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (e) {
      // Backend offline
    }
    if (department && department !== 'All') {
      return INITIAL_TEACHERS.filter(t => t.department.toLowerCase().includes(department.toLowerCase()));
    }
    return INITIAL_TEACHERS;
  },

  getPublicNotices: async (category?: string): Promise<NoticeItem[]> => {
    try {
      const params = category && category !== 'All' ? { category } : {};
      const res = await apiClient.get<NoticeItem[]>('/public/notices/', { params });
      if (isArrayPayload<NoticeItem>(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (e) {
      // Backend offline
    }
    if (category && category !== 'All') {
      return INITIAL_NOTICES.filter(n => n.category.toLowerCase() === category.toLowerCase());
    }
    return INITIAL_NOTICES;
  },

  getPublicExamSchedules: async (): Promise<ExamSchedule[]> => {
    try {
      const res = await apiClient.get<ExamSchedule[]>('/public/examinations/');
      if (isArrayPayload<ExamSchedule>(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (e) {
      // Backend offline
    }
    return INITIAL_EXAMS;
  },

  getPublicTimetable: async (params?: { branch?: string; semester?: number; day?: string }): Promise<TimetableSlot[]> => {
    try {
      const res = await apiClient.get<TimetableSlot[]>('/public/timetable/', { params });
      if (isArrayPayload<TimetableSlot>(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (e) {
      // Backend offline
    }
    let slots = INITIAL_TIMETABLE;
    if (params?.branch) {
      slots = slots.filter(s => s.branch.toLowerCase().includes(params.branch!.toLowerCase()));
    }
    if (params?.semester) {
      slots = slots.filter(s => s.semester === params.semester);
    }
    if (params?.day) {
      slots = slots.filter(s => s.day.toLowerCase() === params.day!.toLowerCase());
    }
    return slots;
  }
};
