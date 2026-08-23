import {
  Student,
  Teacher,
  FeeRecord,
  ExamSchedule,
  StudentResult,
  TimetableSlot,
  NoticeItem,
  Course,
  CollegeSettings,
  NotificationItem,
  PrincipalProfile,
  TeacherDailyAttendance,
  CollegeBankAccount,
  TeacherBankAccount,
  SalaryDisbursementRecord
} from '../types';

export const STAFF_DEPARTMENTS = [
  // Academic Engineering & Sciences
  { id: 'cse', name: 'Computer Science & Engineering', category: 'Academic Engineering', group: 'शैक्षणिक विभाग' },
  { id: 'me', name: 'Mechanical Engineering (Production)', category: 'Academic Engineering', group: 'शैक्षणिक विभाग' },
  { id: 'ce', name: 'Civil Engineering', category: 'Academic Engineering', group: 'शैक्षणिक विभाग' },
  { id: 'ee', name: 'Electrical Engineering', category: 'Academic Engineering', group: 'शैक्षणिक विभाग' },
  { id: 'ece', name: 'Electronics Engineering', category: 'Academic Engineering', group: 'शैक्षणिक विभाग' },
  { id: 'it', name: 'Information Technology', category: 'Academic Engineering', group: 'शैक्षणिक विभाग' },
  { id: 'ash', name: 'Applied Sciences & Humanities (Physics, Chem, Math)', category: 'Academic Engineering', group: 'शैक्षणिक विभाग' },

  // Library Services (लाइब्रेरियन)
  { id: 'library', name: 'Central Library & Digital Resource Wing (पुस्तकालय / लाइब्रेरियन)', category: 'Library & Information', group: 'पुस्तकालय विभाग' },

  // Administration, Registry & Peon (प्यून, अनुसेवक, चपरासी व क्लर्क)
  { id: 'admin_registry', name: 'Administrative Registry & Peon Staff (कार्यालय / प्यून, अनुसेवक व क्लर्क)', category: 'Administration & Registry', group: 'प्रशासनिक व अनुसेवक' },

  // Transport & Bus Fleet (बस चालक / ड्राइवर व कंडक्टर)
  { id: 'transport', name: 'Transport & Campus Bus Fleet (परिवहन / बस चालक व स्टाफ)', category: 'Transport & Fleet', group: 'परिवहन विभाग' },

  // Central Workshop & Technical Labs (वर्कशॉप अनुदेशक व लैब सहायक)
  { id: 'workshop', name: 'Central Workshop & Technical Labs (केंद्रीय वर्कशॉप व लैब)', category: 'Workshop & Labs', group: 'वर्कशॉप एवं प्रयोगशाला' },

  // Accounts & Treasury (लेखाकार व कैशियर)
  { id: 'accounts', name: 'Accounts, Audit & Treasury (लेखा एवं वित्त विभाग)', category: 'Finance & Accounts', group: 'लेखा विभाग' },

  // Hostel, Mess & Security (छात्रावास, मेस व सुरक्षा स्टाफ)
  { id: 'hostel_estate', name: 'Hostel, Mess & Campus Security (छात्रावास, मेस व सुरक्षा)', category: 'Hostel & Security', group: 'छात्रावास व सुरक्षा' }
];

export const INITIAL_COLLEGE_BANK_ACCOUNT: CollegeBankAccount = {
  bankName: "State Bank of India",
  accountNumber: "4018294019284",
  ifscCode: "SBIN0001234",
  branchName: "Govt Treasury Branch, Ballia Main",
  accountHolderName: "Principal, Government Polytechnic Bansdeeh (Institutional Treasury A/C)",
  availableBalance: 8550000, // ₹85.50 Lakhs available government fund
  treasuryCode: "UP-TREAS-BLA-4412",
  lastUpdated: "2026-08-22"
};

export const INITIAL_SETTINGS: CollegeSettings = {
  collegeName: "GOVERNMENT POLYTECHNIC BANSDEEH, BALLIA",
  hindiName: "राजकीय पॉलिटेक्निक बांसडीह, बलिया",
  tagline: "Approved by AICTE, New Delhi & Affiliated to Board of Technical Education, Uttar Pradesh (BTEUP)",
  code: "GPB-4412",
  bteupCode: "4412",
  aicteApproved: true,
  address: "Bansdeeh Main Road, Near Block Office, Bansdeeh",
  district: "Ballia",
  state: "Uttar Pradesh",
  pincode: "277202",
  phone: "+91 5498 245120",
  email: "principal.gpbansdeeh@gmail.com",
  website: "https://gpbansdeeh.up.gov.in",
  principalName: "Er. Ramesh Chandra Srivastava (M.Tech, FIE)",
  establishedYear: 2013,
  customLogoUrl: ""
};

export const INITIAL_COURSES: Course[] = [
  {
    id: "course-1",
    code: "DIP-CSE",
    name: "Diploma in Computer Science & Engineering",
    shortCode: "CSE",
    durationYears: 3,
    totalSeats: 60,
    activeStudents: 58,
    facultyCount: 6,
    hodName: "Dr. Alok Kumar Rai",
    labsCount: 4,
    description: "Covers Programming, Data Structures, Web Technologies, Database Management, Operating Systems, and Cloud Computing aligned with modern industry demands.",
    status: "Active"
  },
  {
    id: "course-2",
    code: "DIP-ME",
    name: "Diploma in Mechanical Engineering (Production)",
    shortCode: "ME",
    durationYears: 3,
    totalSeats: 60,
    activeStudents: 56,
    facultyCount: 7,
    hodName: "Er. Vinay Pratap Singh",
    labsCount: 5,
    description: "Focuses on Thermodynamics, CNC Machining, CAD/CAM, Manufacturing Science, Fluid Mechanics, and Industrial Engineering.",
    status: "Active"
  },
  {
    id: "course-3",
    code: "DIP-CE",
    name: "Diploma in Civil Engineering",
    shortCode: "CE",
    durationYears: 3,
    totalSeats: 60,
    activeStudents: 59,
    facultyCount: 5,
    hodName: "Er. Sudhir Kumar Mishra",
    labsCount: 4,
    description: "Includes Surveying, Structural Analysis, Concrete Technology, Building Construction, Transportation Engineering, and Geotechnical Studies.",
    status: "Active"
  },
  {
    id: "course-4",
    code: "DIP-EE",
    name: "Diploma in Electrical Engineering",
    shortCode: "EE",
    durationYears: 3,
    totalSeats: 60,
    activeStudents: 57,
    facultyCount: 6,
    hodName: "Er. Meenakshi Singh",
    labsCount: 4,
    description: "Focuses on Electrical Machines, Power Systems, Circuit Theory, Control Systems, Renewable Energy, and Switchgear.",
    status: "Active"
  },
  {
    id: "course-5",
    code: "DIP-ECE",
    name: "Diploma in Electronics Engineering",
    shortCode: "ECE",
    durationYears: 3,
    totalSeats: 60,
    activeStudents: 52,
    facultyCount: 5,
    hodName: "Er. Rajeshwar Nath",
    labsCount: 3,
    description: "Comprehensive training in Digital Electronics, Microprocessors, Embedded Systems, Communication Systems, and IoT.",
    status: "Active"
  },
  {
    id: "course-6",
    code: "DIP-IT",
    name: "Diploma in Information Technology",
    shortCode: "IT",
    durationYears: 3,
    totalSeats: 60,
    activeStudents: 54,
    facultyCount: 5,
    hodName: "Er. Pratibha Tiwari",
    labsCount: 3,
    description: "Specialized curriculum on Cybersecurity, Networking, Python Programming, Mobile App Development, and AI Basics.",
    status: "Active"
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "std-01",
    rollNo: "E224412355001",
    enrollmentNo: "E224412001",
    name: "Rahul Verma",
    fatherName: "Shri Santosh Verma",
    motherName: "Smt. Sunita Verma",
    dob: "2004-05-14",
    gender: "Male",
    branch: "Computer Science & Engineering",
    semester: 4,
    mobile: "+91 98381 23450",
    email: "rahul.cse22@gpbansdeeh.ac.in",
    address: "Civil Lines, Near District Hospital, Ballia, UP - 277001",
    category: "OBC",
    bloodGroup: "B+",
    admissionYear: 2022,
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces",
    attendancePercentage: 88,
    feeStatus: "Paid"
  },
  {
    id: "std-02",
    rollNo: "E224412355002",
    enrollmentNo: "E224412002",
    name: "Priya Sharma",
    fatherName: "Shri Anand Sharma",
    motherName: "Smt. Manju Sharma",
    dob: "2005-02-18",
    gender: "Female",
    branch: "Computer Science & Engineering",
    semester: 4,
    mobile: "+91 94152 87612",
    email: "priya.cse22@gpbansdeeh.ac.in",
    address: "Bansdeeh Road, Ward No. 4, Ballia, UP - 277202",
    category: "General",
    bloodGroup: "O+",
    admissionYear: 2022,
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    attendancePercentage: 94,
    feeStatus: "Paid"
  },
  {
    id: "std-03",
    rollNo: "E224412355003",
    enrollmentNo: "E224412003",
    name: "Amit Kumar Yadav",
    fatherName: "Shri Ramakant Yadav",
    motherName: "Smt. Geeta Devi",
    dob: "2003-11-20",
    gender: "Male",
    branch: "Mechanical Engineering (Production)",
    semester: 4,
    mobile: "+91 87654 32190",
    email: "amit.me22@gpbansdeeh.ac.in",
    address: "Village Reoti, Post Office Reoti, Ballia - 277209",
    category: "OBC",
    bloodGroup: "A+",
    admissionYear: 2022,
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    attendancePercentage: 72,
    feeStatus: "Partial"
  },
  {
    id: "std-04",
    rollNo: "E234412355004",
    enrollmentNo: "E234412004",
    name: "Sneha Patel",
    fatherName: "Shri Dinesh Patel",
    motherName: "Smt. Shanti Devi",
    dob: "2005-08-10",
    gender: "Female",
    branch: "Civil Engineering",
    semester: 2,
    mobile: "+91 91200 45678",
    email: "sneha.ce23@gpbansdeeh.ac.in",
    address: "Station Road, Sikanderpur, Ballia, UP - 277303",
    category: "OBC",
    bloodGroup: "AB+",
    admissionYear: 2023,
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
    attendancePercentage: 91,
    feeStatus: "Paid"
  },
  {
    id: "std-05",
    rollNo: "E224412355005",
    enrollmentNo: "E224412005",
    name: "Vikas Singh Chauhan",
    fatherName: "Shri Virendra Chauhan",
    motherName: "Smt. Pushpa Devi",
    dob: "2004-03-25",
    gender: "Male",
    branch: "Electrical Engineering",
    semester: 4,
    mobile: "+91 73889 12345",
    email: "vikas.ee22@gpbansdeeh.ac.in",
    address: "Manjhanpur, Rasra, Ballia, UP - 277123",
    category: "General",
    bloodGroup: "B-",
    admissionYear: 2022,
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    attendancePercentage: 62,
    feeStatus: "Pending"
  },
  {
    id: "std-06",
    rollNo: "E214412355006",
    enrollmentNo: "E214412006",
    name: "Anjali Gupta",
    fatherName: "Shri Prakash Gupta",
    motherName: "Smt. Maya Gupta",
    dob: "2003-09-12",
    gender: "Female",
    branch: "Computer Science & Engineering",
    semester: 6,
    mobile: "+91 99365 77890",
    email: "anjali.cse21@gpbansdeeh.ac.in",
    address: "Chitragupta Nagar, Ballia, UP - 277001",
    category: "General",
    bloodGroup: "O-",
    admissionYear: 2021,
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    attendancePercentage: 96,
    feeStatus: "Paid"
  },
  {
    id: "std-07",
    rollNo: "E234412355007",
    enrollmentNo: "E234412007",
    name: "Mohammad Faizan",
    fatherName: "Shri Akhtar Ansari",
    motherName: "Smt. Razia Begum",
    dob: "2005-01-05",
    gender: "Male",
    branch: "Electronics Engineering",
    semester: 2,
    mobile: "+91 80045 66712",
    email: "faizan.ece23@gpbansdeeh.ac.in",
    address: "Qazipura, Ballia Sadar, UP - 277001",
    category: "OBC",
    bloodGroup: "A-",
    admissionYear: 2023,
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=faces",
    attendancePercentage: 81,
    feeStatus: "Paid"
  },
  {
    id: "std-08",
    rollNo: "E224412355008",
    enrollmentNo: "E224412008",
    name: "Deepak Kumar Chaurasia",
    fatherName: "Shri Harishankar Chaurasia",
    motherName: "Smt. Radha Chaurasia",
    dob: "2004-07-19",
    gender: "Male",
    branch: "Mechanical Engineering (Production)",
    semester: 4,
    mobile: "+91 94503 11223",
    email: "deepak.me22@gpbansdeeh.ac.in",
    address: "Bairia Bazar, Ballia, UP - 277201",
    category: "OBC",
    bloodGroup: "B+",
    admissionYear: 2022,
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces",
    attendancePercentage: 79,
    feeStatus: "Paid"
  },
  {
    id: "std-09",
    rollNo: "E234412355009",
    enrollmentNo: "E234412009",
    name: "Ritu Kumari",
    fatherName: "Shri Rajesh Prasad",
    motherName: "Smt. Anita Devi",
    dob: "2005-12-01",
    gender: "Female",
    branch: "Information Technology",
    semester: 2,
    mobile: "+91 79051 44556",
    email: "ritu.it23@gpbansdeeh.ac.in",
    address: "Maniar Town, Ward 7, Ballia - 277211",
    category: "SC",
    bloodGroup: "O+",
    admissionYear: 2023,
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=faces",
    attendancePercentage: 85,
    feeStatus: "Paid"
  },
  {
    id: "std-10",
    rollNo: "E214412355010",
    enrollmentNo: "E214412010",
    name: "Abhishek Pandey",
    fatherName: "Shri Dayanand Pandey",
    motherName: "Smt. Bimla Pandey",
    dob: "2003-04-16",
    gender: "Male",
    branch: "Civil Engineering",
    semester: 6,
    mobile: "+91 96213 88990",
    email: "abhishek.ce21@gpbansdeeh.ac.in",
    address: "Belthara Road, Near Railway Colony, Ballia - 277121",
    category: "EWS",
    bloodGroup: "A+",
    admissionYear: 2021,
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=faces",
    attendancePercentage: 89,
    feeStatus: "Paid"
  }
];

export const PRINCIPAL_DETAILS: PrincipalProfile = {
  name: "Er. R. C. Srivastava",
  designation: "Principal & Chief Administrator (प्राचार्य एवं मुख्य प्रशासक)",
  department: "Administration & Technical Education Directorate",
  age: 54,
  dob: "1972-08-12",
  qualification: "M.Tech (CAD/CAM - IIT Roorkee), B.Tech (Mechanical Engineering - HBTI Kanpur), FIE",
  experienceYears: 28,
  email: "principal@gpbansdeeh.ac.in",
  mobile: "+91 94150 24510",
  officeLocation: "Principal Chamber, Administrative Block, Government Polytechnic Bansdeeh, Ballia (U.P.) - 277202",
  joiningDate: "2012-07-01",
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces",
  bio: "Senior Academician & Technical Administrator with over 28 years of distinguished service under the Department of Technical Education, Government of Uttar Pradesh. Dedicated to institutional discipline, 100% diploma curriculum execution, state-of-the-art laboratory modernisation, and industry-aligned training for Purvanchal students.",
  achievements: [
    "28+ Years of Service in UP Technical Education Department",
    "Spearheaded Modern CNC Lab & Computer Center at GP Bansdeeh",
    "BTEUP Examination Zonal Chief Superintendent",
    "State Technical Excellence Leadership Citation 2023"
  ]
};

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: "fac-01",
    name: "Dr. Alok Kumar Rai",
    empCode: "FAC-CSE-01",
    department: "Computer Science & Engineering",
    designation: "Head of Department & Associate Professor",
    qualification: "Ph.D (CSE - MMMUT Gorakhpur), M.Tech (KNIT Sultanpur)",
    email: "alok.rai@gpbansdeeh.ac.in",
    mobile: "+91 94150 12345",
    joiningDate: "2014-08-01",
    subjects: ["Data Structures & Algorithms", "Database Management Systems", "Python Programming"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces",
    experienceYears: 12,
    age: 44,
    dob: "1982-04-15",
    gender: "Male",
    salary: 98500,
    payScale: "7th CPC Level 12 (₹79,800 - ₹2,11,500)",
    promotionStatus: "Promoted to Associate Professor (Grade-I) in Aug 2022 • Confirmed",
    address: "Faculty Quarters A-02, GP Bansdeeh Campus, Ballia - 277202",
    bloodGroup: "B+",
    staffType: "Teaching Faculty",
    workDescription: "Department Head for CSE, Conducts Theory & Practical Lectures for 3rd & 4th Sem, BTEUP Exam Coordination",
    bankAccount: {
      bankName: "State Bank of India",
      accountNumber: "30481920491",
      ifscCode: "SBIN0004412",
      accountHolderName: "Dr. Alok Kumar Rai",
      branchName: "Bansdeeh Main Branch",
      panNumber: "ABCPR1234F",
      upiId: "alokrai@sbi"
    }
  },
  {
    id: "fac-02",
    name: "Er. Vinay Pratap Singh",
    empCode: "FAC-ME-02",
    department: "Mechanical Engineering (Production)",
    designation: "Head of Department & Senior Lecturer",
    qualification: "M.Tech (CAD/CAM - HBTI Kanpur), B.Tech (Mechanical)",
    email: "vinay.singh@gpbansdeeh.ac.in",
    mobile: "+91 98380 98765",
    joiningDate: "2015-01-15",
    subjects: ["Thermodynamics", "CNC Machining & Automation", "Manufacturing Processes"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    experienceYears: 11,
    age: 42,
    dob: "1984-06-20",
    gender: "Male",
    salary: 92400,
    payScale: "7th CPC Level 11 (₹67,700 - ₹2,08,700)",
    promotionStatus: "Promoted to Senior Lecturer (Level-11) in Jan 2023",
    address: "Faculty Enclave B-04, GP Bansdeeh Campus, Ballia - 277202",
    bloodGroup: "O+",
    staffType: "Teaching Faculty",
    workDescription: "HOD Mechanical, In-charge of Production Workshop, CNC Lab, and Student Industrial Apprenticeship",
    bankAccount: {
      bankName: "Punjab National Bank",
      accountNumber: "1829001500293",
      ifscCode: "PUNB0182900",
      accountHolderName: "Er. Vinay Pratap Singh",
      branchName: "Ballia Collectorate Branch",
      panNumber: "BNCPS5678G",
      upiId: "vinaysingh@pnb"
    }
  },
  {
    id: "fac-03",
    name: "Er. Sudhir Kumar Mishra",
    empCode: "FAC-CE-03",
    department: "Civil Engineering",
    designation: "Head of Department & Lecturer",
    qualification: "M.Tech (Structural Engg - IIT BHU), B.Tech (Civil)",
    email: "sudhir.mishra@gpbansdeeh.ac.in",
    mobile: "+91 94500 33445",
    joiningDate: "2016-07-20",
    subjects: ["Surveying I & II", "Concrete Technology", "Design of Steel Structures"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces",
    experienceYears: 9,
    age: 39,
    dob: "1987-11-10",
    gender: "Male",
    salary: 84200,
    payScale: "7th CPC Level 10 (₹56,100 - ₹1,77,500)",
    promotionStatus: "Senior Lecturer CAS Application Submitted • Under DTE Review",
    address: "Civil Lines, Ballia Sadar, UP - 277001",
    bloodGroup: "A+",
    staffType: "Teaching Faculty",
    workDescription: "HOD Civil, Conducts Structural Labs, Highway Engg Field Surveys, Campus Infrastructure Maintenance Cell",
    bankAccount: {
      bankName: "Bank of Baroda",
      accountNumber: "2491010002849",
      ifscCode: "BARB0BALLIA",
      accountHolderName: "Er. Sudhir Kumar Mishra",
      branchName: "Civil Lines Branch, Ballia",
      panNumber: "CKSPM9012H"
    }
  },
  {
    id: "fac-04",
    name: "Er. Meenakshi Singh",
    empCode: "FAC-EE-04",
    department: "Electrical Engineering",
    designation: "Senior Lecturer & Proctorial Board Member",
    qualification: "M.Tech (Power Electronics - NIT Allahabad), B.Tech (EE)",
    email: "meenakshi.ee@gpbansdeeh.ac.in",
    mobile: "+91 91250 88776",
    joiningDate: "2017-09-01",
    subjects: ["Electrical Machines", "Power System Engineering", "Network Analysis"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces",
    experienceYears: 8,
    age: 37,
    dob: "1989-03-25",
    gender: "Female",
    salary: 82100,
    payScale: "7th CPC Level 10 (₹56,100 - ₹1,77,500)",
    promotionStatus: "Promoted to Senior Lecturer (CAS Stage-2) in Sep 2023",
    address: "Bansdeeh Road, Teachers Colony, Ballia - 277202",
    bloodGroup: "B+",
    staffType: "Teaching Faculty",
    workDescription: "Lectures on Power Grid & Electrical Machines, In-charge of Electrical Drives Lab & Women Welfare Cell",
    bankAccount: {
      bankName: "Union Bank of India",
      accountNumber: "5849020100481",
      ifscCode: "UBIN0558490",
      accountHolderName: "Er. Meenakshi Singh",
      branchName: "Bansdeeh Bazar Branch",
      panNumber: "DMPSI3456J"
    }
  },
  {
    id: "fac-05",
    name: "Er. Rajeshwar Nath",
    empCode: "FAC-ECE-05",
    department: "Electronics Engineering",
    designation: "Lecturer & Training & Placement Officer",
    qualification: "M.Tech (VLSI Design - AKTU Lucknow)",
    email: "rajeshwar.nath@gpbansdeeh.ac.in",
    mobile: "+91 87650 99881",
    joiningDate: "2018-03-10",
    subjects: ["Digital Electronics", "Microprocessors & Interfacing", "Communication Systems"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces",
    experienceYears: 7,
    age: 36,
    dob: "1990-09-18",
    gender: "Male",
    salary: 76500,
    payScale: "7th CPC Level 10 (₹56,100 - ₹1,77,500)",
    promotionStatus: "Regular Confirmed • Eligible for Level-11 CAS in 2027",
    address: "Near Stadium, Bansdeeh, Ballia - 277202",
    bloodGroup: "O+",
    staffType: "Teaching Faculty",
    workDescription: "Lectures on Microprocessors & Embedded Systems, Oversees Campus Placement Drives & Industry MOUs",
    bankAccount: {
      bankName: "State Bank of India",
      accountNumber: "38920194821",
      ifscCode: "SBIN0004412",
      accountHolderName: "Er. Rajeshwar Nath",
      branchName: "Bansdeeh Main Branch",
      panNumber: "ELPRN7890K"
    }
  },
  {
    id: "fac-06",
    name: "Er. Pratibha Tiwari",
    empCode: "FAC-IT-06",
    department: "Information Technology",
    designation: "Lecturer & Cyber Cell Incharge",
    qualification: "M.Tech (Information Security - BBDU Lucknow)",
    email: "pratibha.it@gpbansdeeh.ac.in",
    mobile: "+91 99180 44550",
    joiningDate: "2019-08-25",
    subjects: ["Web Development & PHP", "Computer Networks", "Cyber Security Laws"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces",
    experienceYears: 6,
    age: 34,
    dob: "1992-01-14",
    gender: "Female",
    salary: 72400,
    payScale: "7th CPC Level 10 (₹56,100 - ₹1,77,500)",
    promotionStatus: "Regular Service Confirmed in Aug 2021",
    address: "Station Road, Ballia City, UP - 277001",
    bloodGroup: "AB+",
    staffType: "Teaching Faculty",
    workDescription: "Conducts Full Stack Web & Network Security Labs, Manages Official Institute Web Portal & Server Infrastructure",
    bankAccount: {
      bankName: "HDFC Bank",
      accountNumber: "50100294819284",
      ifscCode: "HDFC0001829",
      accountHolderName: "Er. Pratibha Tiwari",
      branchName: "Civil Lines, Ballia",
      panNumber: "FMPPT2345L"
    }
  },
  {
    id: "fac-07",
    name: "Shri Ramashray Singh",
    empCode: "STF-TECH-07",
    department: "Central Workshop & Mechanical Section",
    designation: "Workshop Superintendent & Senior Technical Officer",
    qualification: "Diploma in Mechanical Engg (BTEUP), National Craft Instructor Certificate (NCIC)",
    email: "ramashray.workshop@gpbansdeeh.ac.in",
    mobile: "+91 94151 77889",
    joiningDate: "2010-04-01",
    subjects: ["Workshop Practice (Fitting, Welding, Carpentry, Smithy)"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    experienceYears: 16,
    age: 51,
    dob: "1975-05-10",
    gender: "Male",
    salary: 68900,
    payScale: "7th CPC Level 8 (₹47,600 - ₹1,51,100)",
    promotionStatus: "Promoted to Senior Workshop Superintendent in 2020",
    address: "Staff Colony C-01, GP Bansdeeh Campus, Ballia - 277202",
    bloodGroup: "B+",
    staffType: "Technical Staff",
    workDescription: "Supervises Central Workshop, Material Procurement, Heavy Machinery Maintenance, Lathe & Welding Training",
    bankAccount: {
      bankName: "State Bank of India",
      accountNumber: "20184910294",
      ifscCode: "SBIN0004412",
      accountHolderName: "Shri Ramashray Singh",
      branchName: "Bansdeeh Main Branch",
      panNumber: "GHPSS6789M"
    }
  },
  {
    id: "fac-08",
    name: "Shri Virendra Kumar Pandey",
    empCode: "STF-ADM-08",
    department: "Administrative & Establishment Section",
    designation: "Office Superintendent & Registrar (प्रशासनिक अधीक्षक)",
    qualification: "M.A. (Public Administration), Post Graduate Diploma in Office Management",
    email: "virendra.registrar@gpbansdeeh.ac.in",
    mobile: "+91 94502 66778",
    joiningDate: "2011-10-15",
    subjects: ["Student Admissions, BTEUP Enrollment & Staff Service Records"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    experienceYears: 15,
    age: 49,
    dob: "1977-02-28",
    gender: "Male",
    salary: 65400,
    payScale: "7th CPC Level 7 (₹44,900 - ₹1,42,400)",
    promotionStatus: "Promoted to Office Superintendent in Nov 2019",
    address: "Ward No. 6, Bansdeeh Bazar, Ballia - 277202",
    bloodGroup: "A+",
    staffType: "Administrative Staff",
    workDescription: "Manages Student Admissions, BTEUP Affiliation & Board Dispatch, Faculty Service Registers, Govt Correspondence",
    bankAccount: {
      bankName: "Canara Bank",
      accountNumber: "1482010003841",
      ifscCode: "CNRB0001482",
      accountHolderName: "Shri Virendra Kumar Pandey",
      branchName: "Ballia Sadar Branch",
      panNumber: "HJPPV0123N"
    }
  },
  {
    id: "fac-09",
    name: "Shri Dinesh Chandra Gupta",
    empCode: "STF-ACC-09",
    department: "Accounts & Finance Section",
    designation: "Head Accountant & Cashier (मुख्य लेखाकार)",
    qualification: "M.Com (Accountancy & Taxation), Tally ERP Expert",
    email: "dinesh.accounts@gpbansdeeh.ac.in",
    mobile: "+91 98390 11224",
    joiningDate: "2013-05-12",
    subjects: ["Tuition Fee Collections, UP Govt Treasury Ledger & Staff Payroll"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=faces",
    experienceYears: 13,
    age: 46,
    dob: "1980-12-05",
    gender: "Male",
    salary: 62800,
    payScale: "7th CPC Level 7 (₹44,900 - ₹1,42,400)",
    promotionStatus: "Confirmed Regular Service • Senior Accountant Grade",
    address: "Kadam Chauraha, Ballia Sadar - 277001",
    bloodGroup: "O+",
    staffType: "Administrative Staff",
    workDescription: "Manages Student Fee Registers, Digital Receipts, UP State Treasury Payroll, Scholarship Verifications, Audit Dispatches"
  },
  {
    id: "fac-10",
    name: "Smt. Sunita Srivastava",
    empCode: "STF-LIB-10",
    department: "Central Library & Digital Resource Center",
    designation: "Chief Librarian & Documentation Officer (पुस्तकालयाध्यक्ष)",
    qualification: "M.Lib.I.Sc (Master of Library & Information Science - BHU)",
    email: "sunita.library@gpbansdeeh.ac.in",
    mobile: "+91 94155 33441",
    joiningDate: "2015-09-01",
    subjects: ["Book Bank Management, National Digital Library (NDLI) In-charge"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
    experienceYears: 11,
    age: 43,
    dob: "1983-07-22",
    gender: "Female",
    salary: 58500,
    payScale: "7th CPC Level 6 (₹35,400 - ₹1,12,400)",
    promotionStatus: "Promoted to Senior Librarian in 2021",
    address: "Near Water Tank, Bansdeeh, Ballia - 277202",
    bloodGroup: "B+",
    staffType: "Support Staff",
    workDescription: "Central Library Cataloguing, SC/ST Book Bank Scheme, Digital E-Journals, Student Library Card Issues"
  },
  {
    id: "fac-11",
    name: "Shri Manoj Kumar Verma",
    empCode: "STF-LAB-11",
    department: "Computer & Electronics Laboratories",
    designation: "Senior Computer Lab Technician & System Admin",
    qualification: "B.Sc (Computer Science), Diploma in Hardware & Networking (CCNA)",
    email: "manoj.lab@gpbansdeeh.ac.in",
    mobile: "+91 79050 88990",
    joiningDate: "2017-02-20",
    subjects: ["Computer Hardware, Local Area Network (LAN) & Software Installations"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces",
    experienceYears: 9,
    age: 36,
    dob: "1990-10-18",
    gender: "Male",
    salary: 46200,
    payScale: "7th CPC Level 5 (₹29,200 - ₹92,300)",
    promotionStatus: "Regular Service Confirmed in Feb 2019",
    address: "Maniar Road, Bansdeeh, Ballia - 277202",
    bloodGroup: "O+",
    staffType: "Technical Staff",
    workDescription: "Maintains 120+ Computer Systems across Lab 1 & Lab 2, Campus Wi-Fi, Biometric Attendance Machine Maintenance"
  },
  {
    id: "fac-12",
    name: "Shri Ram Bilas Yadav",
    empCode: "STF-PEON-12",
    department: "Administrative Registry & Peon Staff (कार्यालय / प्यून, अनुसेवक व क्लर्क)",
    designation: "Senior Peon & Office Attendant (वरिष्ठ अनुसेवक / प्यून)",
    qualification: "Intermediate (UP Board), Office Assistance Training",
    email: "rambilas.peon@gpbansdeeh.ac.in",
    mobile: "+91 94158 90123",
    joiningDate: "2012-08-01",
    subjects: ["Official Dispatch, Class Bell Management, Principal Office Care"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    experienceYears: 14,
    age: 48,
    dob: "1978-03-12",
    gender: "Male",
    salary: 32400,
    payScale: "7th CPC Level 2 (₹19,900 - ₹63,200)",
    promotionStatus: "Promoted to Senior Office Attendant in 2021",
    address: "Village Kharid, Post Bansdeeh, Ballia - 277202",
    bloodGroup: "B+",
    staffType: "Support Staff",
    workDescription: "Academic Block File Dispatch, Examination Hall Seating & Bell Management, Office Cleanliness & Staff Support",
    bankAccount: {
      bankName: "State Bank of India",
      accountNumber: "30194820194",
      ifscCode: "SBIN0004412",
      accountHolderName: "Shri Ram Bilas Yadav",
      branchName: "Bansdeeh Main Branch"
    }
  },
  {
    id: "fac-13",
    name: "Shri Manoj Kumar Singh",
    empCode: "STF-BUS-13",
    department: "Transport & Campus Bus Fleet (परिवहन / बस चालक व स्टाफ)",
    designation: "Senior Heavy Vehicle Bus Driver (वरिष्ठ बस चालक)",
    qualification: "High School, Heavy Commercial Transport Driving License (HTV)",
    email: "manoj.transport@gpbansdeeh.ac.in",
    mobile: "+91 98394 56789",
    joiningDate: "2016-07-10",
    subjects: ["Route-1 (Ballia City to Bansdeeh Campus Bus Services)"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    experienceYears: 10,
    age: 45,
    dob: "1981-08-25",
    gender: "Male",
    salary: 34500,
    payScale: "7th CPC Level 2 (₹19,900 - ₹63,200)",
    promotionStatus: "Confirmed Regular Transport Staff Grade",
    address: "Station Road, Bansdeeh, Ballia - 277202",
    bloodGroup: "O+",
    staffType: "Support Staff",
    workDescription: "Drives 52-Seater College Bus on Daily Student Route (Ballia Station - Bansdeeh), Bus Maintenance & Fuel Log",
    bankAccount: {
      bankName: "Punjab National Bank",
      accountNumber: "2849001500481",
      ifscCode: "PUNB0284900",
      accountHolderName: "Shri Manoj Kumar Singh",
      branchName: "Bansdeeh Branch"
    }
  },
  {
    id: "fac-14",
    name: "Shri Virendra Bahadur Singh",
    empCode: "STF-SEC-14",
    department: "Hostel, Mess & Campus Security (छात्रावास, मेस व सुरक्षा)",
    designation: "Chief Campus Security Supervisor & Hostel Caretaker",
    qualification: "Ex-Serviceman / 10+2, Certified Industrial Security Officer",
    email: "virendra.security@gpbansdeeh.ac.in",
    mobile: "+91 94508 23456",
    joiningDate: "2015-03-01",
    subjects: ["Main Gate Visitor Log, Campus 24x7 Security & CCTV Monitoring"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces",
    experienceYears: 11,
    age: 52,
    dob: "1974-11-15",
    gender: "Male",
    salary: 31200,
    payScale: "7th CPC Level 2 (₹19,900 - ₹63,200)",
    promotionStatus: "Confirmed Security Supervisor",
    address: "Campus Security Quarters, GP Bansdeeh, Ballia - 277202",
    bloodGroup: "A+",
    staffType: "Support Staff",
    workDescription: "Oversees 3 Campus Entry Gates, 24x7 CCTV Control Room, Hostel In-Out Registers, Anti-Ragging Patrol"
  }
];

export const INITIAL_FEES: FeeRecord[] = [
  {
    id: "fee-01",
    receiptNo: "GPB/FEE/2026/00142",
    studentId: "std-01",
    studentName: "Rahul Verma",
    rollNo: "E224412355001",
    branch: "Computer Science & Engineering",
    semester: 4,
    academicYear: "2025-2026",
    totalFee: 12450,
    paidAmount: 12450,
    pendingAmount: 0,
    dueDate: "2026-03-31",
    paymentStatus: "Paid",
    transactions: [
      {
        id: "tx-101",
        receiptNo: "GPB/FEE/2026/00142",
        amount: 12450,
        paymentDate: "2026-02-10",
        paymentMode: "Online UPI",
        transactionRef: "UPI/30491823901/SBI",
        remarks: "Annual Academic & Exam Fee for 4th Sem",
        collectedBy: "Accounts Section, GP Bansdeeh"
      }
    ]
  },
  {
    id: "fee-02",
    receiptNo: "GPB/FEE/2026/00143",
    studentId: "std-02",
    studentName: "Priya Sharma",
    rollNo: "E224412355002",
    branch: "Computer Science & Engineering",
    semester: 4,
    academicYear: "2025-2026",
    totalFee: 12450,
    paidAmount: 12450,
    pendingAmount: 0,
    dueDate: "2026-03-31",
    paymentStatus: "Paid",
    transactions: [
      {
        id: "tx-102",
        receiptNo: "GPB/FEE/2026/00143",
        amount: 12450,
        paymentDate: "2026-02-12",
        paymentMode: "Net Banking",
        transactionRef: "PNB/NB99182371",
        remarks: "Complete Tuition & Hostel Fee",
        collectedBy: "Accounts Section, GP Bansdeeh"
      }
    ]
  },
  {
    id: "fee-03",
    receiptNo: "GPB/FEE/2026/00144",
    studentId: "std-03",
    studentName: "Amit Kumar Yadav",
    rollNo: "E224412355003",
    branch: "Mechanical Engineering (Production)",
    semester: 4,
    academicYear: "2025-2026",
    totalFee: 12450,
    paidAmount: 7000,
    pendingAmount: 5450,
    dueDate: "2026-04-15",
    paymentStatus: "Partial",
    transactions: [
      {
        id: "tx-103",
        receiptNo: "GPB/FEE/2026/00144",
        amount: 7000,
        paymentDate: "2026-01-20",
        paymentMode: "Challan",
        transactionRef: "CHLN/UBI/88712",
        remarks: "1st Installment Paid at Union Bank Bansdeeh",
        collectedBy: "Accounts Section, GP Bansdeeh"
      }
    ]
  },
  {
    id: "fee-04",
    receiptNo: "GPB/FEE/2026/00145",
    studentId: "std-05",
    studentName: "Vikas Singh Chauhan",
    rollNo: "E224412355005",
    branch: "Electrical Engineering",
    semester: 4,
    academicYear: "2025-2026",
    totalFee: 12450,
    paidAmount: 0,
    pendingAmount: 12450,
    dueDate: "2026-03-15",
    paymentStatus: "Pending",
    transactions: []
  },
  {
    id: "fee-05",
    receiptNo: "GPB/FEE/2026/00146",
    studentId: "std-06",
    studentName: "Anjali Gupta",
    rollNo: "E214412355006",
    branch: "Computer Science & Engineering",
    semester: 6,
    academicYear: "2025-2026",
    totalFee: 12450,
    paidAmount: 12450,
    pendingAmount: 0,
    dueDate: "2026-03-31",
    paymentStatus: "Paid",
    transactions: [
      {
        id: "tx-105",
        receiptNo: "GPB/FEE/2026/00146",
        amount: 12450,
        paymentDate: "2026-01-15",
        paymentMode: "Online UPI",
        transactionRef: "UPI/9981240182/GPAY",
        remarks: "Final Year Tuition & BTEUP Exam Registration",
        collectedBy: "Accounts Section, GP Bansdeeh"
      }
    ]
  }
];

export const INITIAL_EXAMS: ExamSchedule[] = [
  {
    id: "exam-01",
    examName: "BTEUP Even Semester Examination 2026",
    branch: "Computer Science & Engineering",
    semester: 4,
    subject: "Data Communication & Computer Networks",
    subjectCode: "CS-401",
    examDate: "2026-05-15",
    startTime: "09:30 AM",
    endTime: "12:00 PM",
    roomNo: "Room 102 (Main Academic Block)",
    maxMarks: 50,
    examType: "Final BTEUP"
  },
  {
    id: "exam-02",
    examName: "BTEUP Even Semester Examination 2026",
    branch: "Computer Science & Engineering",
    semester: 4,
    subject: "Database Management Systems (DBMS)",
    subjectCode: "CS-402",
    examDate: "2026-05-18",
    startTime: "09:30 AM",
    endTime: "12:00 PM",
    roomNo: "Room 104",
    maxMarks: 50,
    examType: "Final BTEUP"
  },
  {
    id: "exam-03",
    examName: "BTEUP Even Semester Examination 2026",
    branch: "Mechanical Engineering (Production)",
    semester: 4,
    subject: "Hydraulics & Pneumatics",
    subjectCode: "ME-401",
    examDate: "2026-05-16",
    startTime: "09:30 AM",
    endTime: "12:00 PM",
    roomNo: "Workshop Hall A",
    maxMarks: 50,
    examType: "Final BTEUP"
  },
  {
    id: "exam-04",
    examName: "Mid-Term Assessment Test 2026",
    branch: "Civil Engineering",
    semester: 2,
    subject: "Applied Mathematics - II",
    subjectCode: "AS-201",
    examDate: "2026-04-10",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    roomNo: "Lecture Hall 3",
    maxMarks: 20,
    examType: "Mid Semester"
  },
  {
    id: "exam-05",
    examName: "Practical / Viva-Voce Examination",
    branch: "Electrical Engineering",
    semester: 4,
    subject: "Electrical Machines - I Lab",
    subjectCode: "EE-402P",
    examDate: "2026-05-24",
    startTime: "09:00 AM",
    endTime: "01:00 PM",
    roomNo: "Electrical Machines Laboratory",
    maxMarks: 50,
    examType: "Practical / Viva"
  }
];

export const INITIAL_RESULTS: StudentResult[] = [
  {
    id: "res-01",
    studentId: "std-01",
    studentName: "Rahul Verma",
    rollNo: "E224412355001",
    enrollmentNo: "E224412001",
    branch: "Computer Science & Engineering",
    semester: 3,
    examSession: "Odd Semester Examination Dec 2025",
    marks: [
      { subjectCode: "CS-301", subjectName: "Applied Mathematics - III", theoryMax: 50, theoryObtained: 44, practicalMax: 0, practicalObtained: 0, totalMax: 50, totalObtained: 44, grade: "A+", gradePoint: 9.0 },
      { subjectCode: "CS-302", subjectName: "Data Structures Using C", theoryMax: 50, theoryObtained: 42, practicalMax: 50, practicalObtained: 46, totalMax: 100, totalObtained: 88, grade: "A+", gradePoint: 9.0 },
      { subjectCode: "CS-303", subjectName: "Digital Electronics", theoryMax: 50, theoryObtained: 39, practicalMax: 30, practicalObtained: 27, totalMax: 80, totalObtained: 66, grade: "A", gradePoint: 8.5 },
      { subjectCode: "CS-304", subjectName: "Web Technology Fundamentals", theoryMax: 50, theoryObtained: 45, practicalMax: 50, practicalObtained: 48, totalMax: 100, totalObtained: 93, grade: "O", gradePoint: 10.0 },
      { subjectCode: "CS-305", subjectName: "Environmental Studies & Disaster Mgmt", theoryMax: 50, theoryObtained: 38, practicalMax: 20, practicalObtained: 18, totalMax: 70, totalObtained: 56, grade: "A", gradePoint: 8.0 },
      { subjectCode: "SCA-300", subjectName: "Student Centered Activities (SCA)", theoryMax: 0, theoryObtained: 0, practicalMax: 30, practicalObtained: 29, totalMax: 30, totalObtained: 29, grade: "O", gradePoint: 10.0 }
    ],
    grandTotalMax: 430,
    grandTotalObtained: 376,
    percentage: 87.44,
    cgpa: 8.92,
    division: "First Division with Distinction",
    status: "PASS"
  },
  {
    id: "res-02",
    studentId: "std-02",
    studentName: "Priya Sharma",
    rollNo: "E224412355002",
    enrollmentNo: "E224412002",
    branch: "Computer Science & Engineering",
    semester: 3,
    examSession: "Odd Semester Examination Dec 2025",
    marks: [
      { subjectCode: "CS-301", subjectName: "Applied Mathematics - III", theoryMax: 50, theoryObtained: 48, practicalMax: 0, practicalObtained: 0, totalMax: 50, totalObtained: 48, grade: "O", gradePoint: 10.0 },
      { subjectCode: "CS-302", subjectName: "Data Structures Using C", theoryMax: 50, theoryObtained: 47, practicalMax: 50, practicalObtained: 49, totalMax: 100, totalObtained: 96, grade: "O", gradePoint: 10.0 },
      { subjectCode: "CS-303", subjectName: "Digital Electronics", theoryMax: 50, theoryObtained: 44, practicalMax: 30, practicalObtained: 28, totalMax: 80, totalObtained: 72, grade: "A+", gradePoint: 9.0 },
      { subjectCode: "CS-304", subjectName: "Web Technology Fundamentals", theoryMax: 50, theoryObtained: 48, practicalMax: 50, practicalObtained: 49, totalMax: 100, totalObtained: 97, grade: "O", gradePoint: 10.0 },
      { subjectCode: "CS-305", subjectName: "Environmental Studies", theoryMax: 50, theoryObtained: 41, practicalMax: 20, practicalObtained: 19, totalMax: 70, totalObtained: 60, grade: "A+", gradePoint: 9.0 },
      { subjectCode: "SCA-300", subjectName: "Student Centered Activities", theoryMax: 0, theoryObtained: 0, practicalMax: 30, practicalObtained: 30, totalMax: 30, totalObtained: 30, grade: "O", gradePoint: 10.0 }
    ],
    grandTotalMax: 430,
    grandTotalObtained: 403,
    percentage: 93.72,
    cgpa: 9.65,
    division: "First Division with Distinction",
    status: "PASS"
  }
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // Monday
  { id: "tt-1", branch: "Computer Science & Engineering", semester: 4, day: "Monday", startTime: "09:30 AM", endTime: "10:30 AM", subject: "Database Management Systems", subjectCode: "CS-402", teacherName: "Dr. Alok Kumar Rai", roomNo: "Room 102", type: "Theory" },
  { id: "tt-2", branch: "Computer Science & Engineering", semester: 4, day: "Monday", startTime: "10:30 AM", endTime: "11:30 AM", subject: "Computer Networks", subjectCode: "CS-401", teacherName: "Er. Pratibha Tiwari", roomNo: "Room 102", type: "Theory" },
  { id: "tt-3", branch: "Computer Science & Engineering", semester: 4, day: "Monday", startTime: "11:30 AM", endTime: "01:30 PM", subject: "DBMS & SQL Practical Lab", subjectCode: "CS-402P", teacherName: "Dr. Alok Kumar Rai", roomNo: "Computer Lab 1", type: "Practical Lab" },
  { id: "tt-4", branch: "Computer Science & Engineering", semester: 4, day: "Monday", startTime: "02:00 PM", endTime: "03:00 PM", subject: "Python Programming & AI Basics", subjectCode: "CS-403", teacherName: "Er. Rajeshwar Nath", roomNo: "Room 102", type: "Theory" },
  
  // Tuesday
  { id: "tt-5", branch: "Computer Science & Engineering", semester: 4, day: "Tuesday", startTime: "09:30 AM", endTime: "10:30 AM", subject: "Operating Systems", subjectCode: "CS-404", teacherName: "Er. Pratibha Tiwari", roomNo: "Room 102", type: "Theory" },
  { id: "tt-6", branch: "Computer Science & Engineering", semester: 4, day: "Tuesday", startTime: "10:30 AM", endTime: "11:30 AM", subject: "Python Programming", subjectCode: "CS-403", teacherName: "Er. Rajeshwar Nath", roomNo: "Room 102", type: "Theory" },
  { id: "tt-7", branch: "Computer Science & Engineering", semester: 4, day: "Tuesday", startTime: "11:30 AM", endTime: "01:30 PM", subject: "Python & AI Practical Lab", subjectCode: "CS-403P", teacherName: "Er. Rajeshwar Nath", roomNo: "Computer Lab 2", type: "Practical Lab" },
  { id: "tt-8", branch: "Computer Science & Engineering", semester: 4, day: "Tuesday", startTime: "02:00 PM", endTime: "03:30 PM", subject: "Energy Conservation & Management", subjectCode: "CS-405", teacherName: "Er. Meenakshi Singh", roomNo: "Room 102", type: "Tutorial" },

  // Wednesday
  { id: "tt-9", branch: "Computer Science & Engineering", semester: 4, day: "Wednesday", startTime: "09:30 AM", endTime: "10:30 AM", subject: "Database Management Systems", subjectCode: "CS-402", teacherName: "Dr. Alok Kumar Rai", roomNo: "Room 102", type: "Theory" },
  { id: "tt-10", branch: "Computer Science & Engineering", semester: 4, day: "Wednesday", startTime: "10:30 AM", endTime: "11:30 AM", subject: "Computer Networks", subjectCode: "CS-401", teacherName: "Er. Pratibha Tiwari", roomNo: "Room 102", type: "Theory" },
  { id: "tt-11", branch: "Computer Science & Engineering", semester: 4, day: "Wednesday", startTime: "11:30 AM", endTime: "01:30 PM", subject: "Hardware & Networking Lab", subjectCode: "CS-401P", teacherName: "Er. Pratibha Tiwari", roomNo: "Network Lab", type: "Practical Lab" },

  // Thursday
  { id: "tt-12", branch: "Computer Science & Engineering", semester: 4, day: "Thursday", startTime: "09:30 AM", endTime: "11:00 AM", subject: "Industrial Exposure & Seminar", subjectCode: "CS-406", teacherName: "Dr. Alok Kumar Rai", roomNo: "Seminar Hall", type: "Tutorial" },
  { id: "tt-13", branch: "Computer Science & Engineering", semester: 4, day: "Thursday", startTime: "11:30 AM", endTime: "12:30 PM", subject: "Operating Systems", subjectCode: "CS-404", teacherName: "Er. Pratibha Tiwari", roomNo: "Room 102", type: "Theory" },

  // Friday
  { id: "tt-14", branch: "Computer Science & Engineering", semester: 4, day: "Friday", startTime: "09:30 AM", endTime: "10:30 AM", subject: "Database Management Systems", subjectCode: "CS-402", teacherName: "Dr. Alok Kumar Rai", roomNo: "Room 102", type: "Theory" },
  { id: "tt-15", branch: "Computer Science & Engineering", semester: 4, day: "Friday", startTime: "10:30 AM", endTime: "11:30 AM", subject: "Communication & Soft Skills", subjectCode: "CS-407", teacherName: "Er. Vinay Pratap Singh", roomNo: "Language Lab", type: "Theory" },
  { id: "tt-16", branch: "Computer Science & Engineering", semester: 4, day: "Friday", startTime: "11:30 AM", endTime: "01:30 PM", subject: "Web Project Workshop", subjectCode: "CS-408P", teacherName: "Er. Pratibha Tiwari", roomNo: "Computer Lab 1", type: "Practical Lab" },

  // Saturday
  { id: "tt-17", branch: "Computer Science & Engineering", semester: 4, day: "Saturday", startTime: "09:30 AM", endTime: "11:30 AM", subject: "Technical Library & Research Hours", subjectCode: "LIB-400", teacherName: "Dr. Alok Kumar Rai", roomNo: "Central Library", type: "Tutorial" },
  { id: "tt-18", branch: "Computer Science & Engineering", semester: 4, day: "Saturday", startTime: "11:30 AM", endTime: "01:00 PM", subject: "Co-curricular & Sports Activities", subjectCode: "SCA-400", teacherName: "Er. Sudhir Kumar Mishra", roomNo: "College Ground", type: "Tutorial" }
];

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: "not-01",
    title: "Mid-Semester Examination Schedule for Even Semester 2025-26",
    content: "All students of 2nd, 4th, and 6th semesters (All Diploma Branches) are hereby informed that the Mid-Semester Assessment Tests will commence from April 10, 2026. The detailed schedule and room allotment are displayed on the departmental notice boards. Attendance in all papers is mandatory.",
    category: "Examination",
    publishDate: "2026-03-28",
    priority: "High",
    targetAudience: "All",
    issuedBy: "Office of the Examination Superintendent",
    referenceNo: "GPB/EXAM/2026/108",
    attachmentName: "Mid_Sem_Exam_Schedule_2026.pdf"
  },
  {
    id: "not-02",
    title: "Final Reminder: Even Semester Fee Submission & Scholarship Verification",
    content: "Students who have not cleared their academic session fees for 2025-26 are instructed to deposit the balance fees via online SBI Collect or college fee counter on or before April 15, 2026 to avoid late fine and admit card detention. UP Post-Matric Scholarship biometric verification is active in Room 105.",
    category: "Fees",
    publishDate: "2026-03-24",
    priority: "High",
    targetAudience: "Students",
    issuedBy: "Accounts Section & Scholarship Nodal Cell",
    referenceNo: "GPB/FEE-SCH/2026/045",
    attachmentName: "Fee_Structure_and_Challan_Details.pdf"
  },
  {
    id: "not-03",
    title: "State-Level Technical Workshop on AI & Cloud Computing",
    content: "The Department of Computer Science & Engineering is organizing a 3-day hands-on workshop on 'Practical Artificial Intelligence & Cloud Technologies' in collaboration with UP Skill Development Mission from April 22 to 24, 2026. Interested 2nd and 3rd year students must register with Dr. Alok Kumar Rai.",
    category: "Events",
    publishDate: "2026-03-20",
    priority: "Medium",
    targetAudience: "All",
    issuedBy: "Department of Computer Science & Engg",
    referenceNo: "GPB/CSE/WRK/2026/012",
    attachmentName: "Workshop_Brochure_AI_2026.pdf"
  },
  {
    id: "not-04",
    title: "Campus Placement Drive for Final Year Mechanical & Electrical Students",
    content: "Tata Motors & L&T Heavy Engineering will be conducting a pool campus placement drive at Government Polytechnic Bansdeeh for 6th-semester students on May 02, 2026. Eligible candidates must verify their resumes with the Training & Placement Officer (TPO) by April 25.",
    category: "Academic",
    publishDate: "2026-03-15",
    priority: "High",
    targetAudience: "Students",
    issuedBy: "Training & Placement Cell",
    referenceNo: "GPB/TPO/2026/089",
    attachmentName: "Placement_Drive_Eligibility_Guidelines.pdf"
  },
  {
    id: "not-05",
    title: "Gazetted Holiday Notice: Ambedkar Jayanti & Mahavir Jayanti",
    content: "The institution will remain closed on April 14, 2026 on account of Dr. B.R. Ambedkar Jayanti and April 21, 2026 on account of Mahavir Jayanti. All administrative offices, lectures, and laboratory sessions will resume on subsequent working days as per regular timetable.",
    category: "Holiday",
    publishDate: "2026-03-10",
    priority: "Low",
    targetAudience: "All",
    issuedBy: "Office of the Principal",
    referenceNo: "GPB/ADMIN/HOL/2026/033",
    attachmentName: "Holiday_Calendar_2026.pdf"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "nt-01",
    title: "Mid-Semester Examination Announced",
    message: "Mid-Sem exams commence from April 10, 2026. Check the examination schedule.",
    type: "info",
    time: "10 mins ago",
    read: false,
    linkView: "examination"
  },
  {
    id: "nt-02",
    title: "Fee Payment Reminder",
    message: "Semester fee payment deadline is April 15, 2026. Please clear pending balances.",
    type: "urgent",
    time: "2 hours ago",
    read: false,
    linkView: "fees"
  },
  {
    id: "nt-03",
    title: "Attendance Alert: Shortage Warning",
    message: "12 students have attendance below 75% in Electrical Engineering. Review report.",
    type: "warning",
    time: "1 day ago",
    read: false,
    linkView: "attendance"
  },
  {
    id: "nt-04",
    title: "New Circular Published",
    message: "State-Level Technical Workshop on AI & Cloud Computing registration open.",
    type: "success",
    time: "2 days ago",
    read: true,
    linkView: "notices"
  }
];

// Helper to generate realistic monthly attendance records for teachers
export const generateInitialTeacherAttendance = (): TeacherDailyAttendance[] => {
  const records: TeacherDailyAttendance[] = [];
  const currentYear = 2026;
  const currentMonth = 7; // August (0-indexed 7)
  const daysInMonth = 31;

  INITIAL_TEACHERS.forEach(teacher => {
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = `2026-08-${String(day).padStart(2, '0')}`;
      const isSunday = date.getDay() === 0;

      let status: 'P' | 'A' | 'L' | 'H' = 'P';
      let inTime = '09:12 AM';
      let outTime = '04:45 PM';

      if (isSunday) {
        status = 'H';
        inTime = '-';
        outTime = '-';
      } else if (day === 15) {
        // Independence day holiday
        status = 'H';
        inTime = '-';
        outTime = '-';
      } else if (day % 11 === 0 && teacher.id === 't-1') {
        status = 'L'; // Approved casual leave
        inTime = '-';
        outTime = '-';
      } else if (day % 19 === 0 && teacher.id === 't-2') {
        status = 'A'; // Absent
        inTime = '-';
        outTime = '-';
      }

      records.push({
        id: `att-${teacher.id}-${dateStr}`,
        teacherId: teacher.id,
        teacherName: teacher.name,
        empCode: teacher.empCode,
        date: dateStr,
        status,
        inTime,
        outTime,
        geoRecord: status === 'P' ? {
          latitude: 25.86472 + (Math.random() - 0.5) * 0.0002,
          longitude: 84.22153 + (Math.random() - 0.5) * 0.0002,
          accuracy: 8.5,
          distanceToCampusMeters: Math.floor(Math.random() * 35) + 5, // 5 to 40 meters (<50m)
          isInsideCampus: true,
          timestamp: `${dateStr}T09:12:00Z`,
          deviceInfo: 'Android / Chrome Mobile (GPB Geofence OK)'
        } : undefined,
        markedBy: 'self_geofenced',
        verifiedByPrincipal: true
      });
    }
  });

  return records;
};

export const INITIAL_TEACHER_ATTENDANCE: TeacherDailyAttendance[] = generateInitialTeacherAttendance();

export const INITIAL_SALARY_DISBURSEMENTS: SalaryDisbursementRecord[] = [
  {
    id: "sal-disb-2026-07-01",
    teacherId: "fac-01",
    teacherName: "Dr. Alok Kumar Rai",
    empCode: "FAC-CSE-01",
    designation: "Head of Department & Associate Professor",
    department: "Computer Science & Engineering",
    month: "2026-07",
    baseSalary: 98500,
    presentDays: 26,
    leaveDays: 1,
    absentDays: 0,
    holidays: 4,
    deductions: 0,
    netPayableAmount: 98500,
    disbursedAmount: 98500,
    disbursementDate: "2026-07-31",
    transactionRef: "TRX-SAL-2026-0731-01",
    status: "Approved_Disbursed",
    collegeAccountDebited: "State Bank of India (A/C: 4018294019284)",
    teacherAccountCredited: {
      bankName: "State Bank of India",
      accountNumber: "30481920491",
      ifscCode: "SBIN0004412"
    },
    approvedBy: "Er. Ramesh Chandra Srivastava (Principal)",
    payslipNumber: "GPB/PAY/2026/07/001",
    remarks: "Full monthly salary disbursed upon 100% verified attendance compliance."
  },
  {
    id: "sal-disb-2026-07-02",
    teacherId: "fac-02",
    teacherName: "Er. Vinay Pratap Singh",
    empCode: "FAC-ME-02",
    designation: "Head of Department & Senior Lecturer",
    department: "Mechanical Engineering (Production)",
    month: "2026-07",
    baseSalary: 92400,
    presentDays: 25,
    leaveDays: 2,
    absentDays: 0,
    holidays: 4,
    deductions: 0,
    netPayableAmount: 92400,
    disbursedAmount: 92400,
    disbursementDate: "2026-07-31",
    transactionRef: "TRX-SAL-2026-0731-02",
    status: "Approved_Disbursed",
    collegeAccountDebited: "State Bank of India (A/C: 4018294019284)",
    teacherAccountCredited: {
      bankName: "Punjab National Bank",
      accountNumber: "1829001500293",
      ifscCode: "PUNB0182900"
    },
    approvedBy: "Er. Ramesh Chandra Srivastava (Principal)",
    payslipNumber: "GPB/PAY/2026/07/002",
    remarks: "Monthly salary credited via NEFT direct institutional treasury gateway."
  }
];


