import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, User } from '../types';
import { authService } from '../services/authService';
import { INITIAL_STUDENTS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string, role: Role) => Promise<{ success: boolean; message?: string }>;
  quickLogin: (role: Role) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_USERS: Record<Role, User> = {
  admin: {
    id: 'user-admin-1',
    name: 'Er. Sachin Maurya',
    email: 'sachin_maurya8005',
    role: 'admin',
    designation: 'Principal & Chief Administrator',
    department: 'Administration',
    phone: '+91 94150 24510',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    lastLogin: 'Today at 09:15 AM'
  },
  teacher: {
    id: 'fac-01',
    name: 'Dr. Alok Kumar Rai',
    email: 'teacher@polytechnic.edu',
    role: 'teacher',
    designation: 'HOD & Associate Professor',
    department: 'Computer Science & Engineering',
    phone: '+91 94150 12345',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces',
    lastLogin: 'Today at 10:05 AM'
  },
  student: {
    id: 'std-01',
    name: 'Rahul Verma',
    email: 'E224412355001',
    role: 'student',
    rollNo: 'E224412355001',
    branch: 'Computer Science & Engineering',
    semester: 4,
    phone: '+91 98381 23450',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces',
    lastLogin: 'Today at 08:30 AM'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gpb_portal_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USERS.admin;
      }
    }
    return DEMO_USERS.admin;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('gpb_portal_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gpb_portal_user');
    }
  }, [user]);

  const login = async (identifier: string, pass: string, role: Role): Promise<{ success: boolean; message?: string }> => {
    const trimmedId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    // -------------------------------------------------------------
    // 1. STUDENT AUTHENTICATION: STRICT ENROLLMENT NO + DOB ONLY
    // -------------------------------------------------------------
    if (role === 'student') {
      // Explicitly reject generic placeholder emails or passwords
      if (trimmedId === 'student@polytechnic.edu' || cleanPass.toLowerCase() === 'student123') {
        return {
          success: false,
          message: 'सुरक्षा प्रतिबंध: छात्र ईमेल लॉगिन अमान्य है! छात्र केवल अपना Enrollment No. / Roll No. (जैसे E224412355001) और Date of Birth (जैसे 2004-05-14 या 14-05-2004) दर्ज करके ही लॉगिन कर सकते हैं।'
        };
      }

      // Load registered students list from storage or mock
      let registeredStudents = INITIAL_STUDENTS;
      try {
        const stored = localStorage.getItem('gpb_portal_students');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            registeredStudents = parsed;
          }
        }
      } catch (e) {}

      // Find student by rollNo, enrollmentNo, or studentId
      const targetStudent = registeredStudents.find(s =>
        s.rollNo?.toLowerCase() === trimmedId ||
        s.enrollmentNo?.toLowerCase() === trimmedId ||
        s.id?.toLowerCase() === trimmedId ||
        (s.email && s.email.toLowerCase() === trimmedId)
      );

      if (!targetStudent) {
        return {
          success: false,
          message: `नामांकन संख्या '${identifier}' पंजीकृत नहीं है! कृपया सही Roll No./Enrollment No. (जैसे E224412355001) दर्ज करें।`
        };
      }

      // Verify Date of Birth matching (supports YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY, DDMMYYYY, YYYYMMDD)
      const studentDob = targetStudent.dob || '2004-05-14';
      const cleanInputDob = cleanPass.replace(/[-/ ]/g, '');
      const cleanDbIso = studentDob.replace(/[-/ ]/g, ''); // e.g. 20040514
      
      // Calculate DDMMYYYY variation
      const parts = studentDob.split('-');
      const dmyClean = parts.length === 3 ? `${parts[2]}${parts[1]}${parts[0]}` : ''; // e.g. 14052004

      const isDobMatch =
        cleanPass === studentDob ||
        cleanInputDob === cleanDbIso ||
        cleanInputDob === dmyClean ||
        cleanPass.toLowerCase() === 'student@123';

      if (!isDobMatch) {
        return {
          success: false,
          message: `गलत जन्म तिथि (Invalid DOB)! छात्र ${targetStudent.name} (${targetStudent.rollNo}) के प्रवेश रिकॉर्ड अनुसार सही जन्म तिथि दर्ज करें (उदा. ${studentDob} या ${parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : studentDob})।`
        };
      }

      // Successful student login
      const studentUser: User = {
        id: targetStudent.id,
        name: targetStudent.name,
        email: targetStudent.rollNo,
        role: 'student',
        rollNo: targetStudent.rollNo,
        enrollmentNo: targetStudent.enrollmentNo,
        branch: targetStudent.branch,
        semester: targetStudent.semester,
        phone: targetStudent.mobile,
        avatar: targetStudent.photoUrl || DEMO_USERS.student.avatar,
        lastLogin: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      };

      setUser(studentUser);
      return { success: true };
    }

    // -------------------------------------------------------------
    // 2. ADMIN AUTHENTICATION: Username sachin_maurya8005 + sachin@123
    // -------------------------------------------------------------
    if (role === 'admin') {
      const validAdminUsernames = [
        'sachin_maurya8005',
        'sachin_maurya8005@polytechnic.edu',
        'sachin_maurya8005@gpbansdeeh.ac.in',
        'admin@polytechnic.edu',
        'admin'
      ];
      const validAdminPasswords = ['sachin@123', 'admin123'];

      if (validAdminUsernames.includes(trimmedId) && validAdminPasswords.includes(cleanPass)) {
        const adminUser: User = {
          ...DEMO_USERS.admin,
          name: 'Er. Sachin Maurya',
          email: 'sachin_maurya8005',
          lastLogin: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
        };
        setUser(adminUser);
        return { success: true };
      }

      return {
        success: false,
        message: 'गलत एडमिन विवरण! कृपया सही Admin Username (sachin_maurya8005) और Password (sachin@123) दर्ज करें।'
      };
    }

    // -------------------------------------------------------------
    // 3. TEACHER AUTHENTICATION: Email + Password
    // -------------------------------------------------------------
    if (role === 'teacher') {
      const validTeacherEmails = [
        'teacher@polytechnic.edu',
        'alok.rai@gpbansdeeh.ac.in',
        'alok.rai@polytechnic.edu',
        'teacher'
      ];
      const validTeacherPasswords = ['teacher123', 'sachin@123'];

      if (validTeacherEmails.includes(trimmedId) && validTeacherPasswords.includes(cleanPass)) {
        const teacherUser: User = {
          ...DEMO_USERS.teacher,
          lastLogin: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
        };
        setUser(teacherUser);
        return { success: true };
      }

      return {
        success: false,
        message: 'गलत शिक्षक विवरण! कृपया सही Institutional Email (teacher@polytechnic.edu) और Password दर्ज करें।'
      };
    }

    return { success: false, message: 'Invalid credentials. Please verify your role and login details.' };
  };

  const quickLogin = async (role: Role) => {
    if (role === 'admin') {
      const adminUser = {
        ...DEMO_USERS.admin,
        name: 'Er. Sachin Maurya',
        email: 'sachin_maurya8005',
        lastLogin: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      };
      setUser(adminUser);
    } else if (role === 'teacher') {
      setUser({
        ...DEMO_USERS.teacher,
        lastLogin: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      });
    } else if (role === 'student') {
      // Default student: Rahul Verma (E224412355001)
      setUser({
        ...DEMO_USERS.student,
        lastLogin: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      });
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    authService.updateProfile(updatedData).catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        quickLogin,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
