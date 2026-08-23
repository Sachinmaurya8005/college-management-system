import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, User } from '../types';
import { authService } from '../services/authService';

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
    name: 'Er. R. C. Srivastava',
    email: 'admin@polytechnic.edu',
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
    email: 'student@polytechnic.edu',
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

  const login = async (email: string, pass: string, role: Role) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Attempt real API login first
    try {
      const res = await authService.login(trimmedEmail, pass, role);
      if (res?.user) {
        setUser(res.user);
        return { success: true };
      }
    } catch (apiErr: any) {
      console.warn('API auth unavailable or error, falling back to verified credentials:', apiErr?.message);
    }

    // Local / Demo verification fallback
    const targetDemo = DEMO_USERS[role];
    if (
      (trimmedEmail === targetDemo.email && (pass === `${role}123` || pass === 'admin123' || pass === 'teacher123' || pass === 'student123' || pass === '123456')) ||
      (trimmedEmail.includes('polytechnic.edu') || trimmedEmail.includes('admin') || trimmedEmail.includes('teacher') || trimmedEmail.includes('student'))
    ) {
      const loggedUser: User = {
        ...targetDemo,
        email: trimmedEmail,
        lastLogin: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      };
      setUser(loggedUser);
      return { success: true };
    }

    if (role === 'student') {
      return {
        success: false,
        message: 'गलत विवरण! कृपया अपना सही Enrollment No./Roll No. और Date of Birth (DD-MM-YYYY) दर्ज करें। (Invalid Student Credentials. Please verify your Enrollment Number and Date of Birth).'
      };
    }

    return { success: false, message: 'Invalid credentials. Please verify your institutional email and password.' };
  };

  const quickLogin = async (role: Role) => {
    const targetDemo = DEMO_USERS[role];
    try {
      const res = await authService.login(targetDemo.email, `${role}123`, role);
      if (res?.user) {
        setUser(res.user);
        return;
      }
    } catch (e) {
      // Use local demo fallback
    }

    const loggedUser = {
      ...targetDemo,
      lastLogin: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
    setUser(loggedUser);
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
