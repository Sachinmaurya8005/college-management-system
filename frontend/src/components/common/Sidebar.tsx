import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CheckSquare,
  CreditCard,
  Award,
  Calendar,
  BellRing,
  BookOpen,
  FileBarChart,
  Settings,
  UserCheck,
  LogOut,
  X,
  ChevronRight,
  FileText,
  Globe,
  Compass,
  ShieldCheck,
  Briefcase,
  BookMarked,
  IndianRupee
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CollegeLogo } from './CollegeLogo';
import { Role } from '../../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onGoToPublicWebsite?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: Role[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'student'] },
  { id: 'content-manager', label: 'Public Web Management', icon: Globe, roles: ['admin'], badge: 'Admin' },
  { id: 'payroll', label: 'Staff Payroll & Bank Disbursal', icon: IndianRupee, roles: ['admin'], badge: 'Bank' },
  { id: 'my-salary', label: 'Salary & Payslips (मेरी सैलरी)', icon: IndianRupee, roles: ['teacher'], badge: 'Confidential' },
  { id: 'approvals', label: 'Change Approvals', icon: ShieldCheck, roles: ['admin', 'teacher'], badge: 'Queue' },
  { id: 'students', label: 'Students', icon: Users, roles: ['admin', 'teacher'] },
  { id: 'teachers', label: 'Faculty & Staff', icon: GraduationCap, roles: ['admin'] },
  { id: 'placements', label: 'TPO Placements', icon: Briefcase, roles: ['admin', 'teacher', 'student'], badge: 'Hot' },
  { id: 'library', label: 'Digital Library', icon: BookMarked, roles: ['admin', 'teacher', 'student'] },
  { id: 'attendance', label: 'Attendance', icon: CheckSquare, roles: ['admin', 'teacher', 'student'] },
  { id: 'fees', label: 'Fees Management', icon: CreditCard, roles: ['admin', 'teacher', 'student'] },
  { id: 'notices', label: 'Notice Board', icon: BellRing, roles: ['admin', 'teacher', 'student'], badge: 'New' },
  { id: 'examination', label: 'Examination & Results', icon: Award, roles: ['admin', 'student'] },
  { id: 'timetable', label: 'Timetable', icon: Calendar, roles: ['admin', 'student'] },
  { id: 'applications', label: 'Official Applications', icon: FileText, roles: ['admin', 'teacher', 'student'], badge: 'Live' },
  { id: 'courses', label: 'Branches & Courses', icon: BookOpen, roles: ['admin'] },
  { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart, roles: ['admin'] },
  { id: 'settings', label: 'College Settings', icon: Settings, roles: ['admin'] },
  { id: 'profile', label: 'My Profile', icon: UserCheck, roles: ['admin', 'teacher', 'student'] }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpen,
  onClose,
  onGoToPublicWebsite
}) => {
  const { user, logout } = useAuth();
  const userRole = user?.role || 'admin';

  const accessibleItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  const handleNavClick = (viewId: string) => {
    if (viewId === 'view-public-web') {
      if (onGoToPublicWebsite) {
        onGoToPublicWebsite();
      } else {
        onNavigate('view-public-web');
      }
      if (window.innerWidth < 1024) {
        onClose();
      }
      return;
    }
    onNavigate(viewId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-72 bg-gradient-to-b from-polytechnic-900 via-polytechnic-950 to-slate-950 text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800 shadow-2xl lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } no-print`}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <CollegeLogo size="sm" textColor="light" subtitle={true} showText={true} />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Portal Indicator */}
        <div className="px-5 py-2.5 bg-white/5 border-b border-white/5 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 font-medium">Role: </span>
            <span className="capitalize font-bold text-amber-400 tracking-wider">
              {userRole} Mode
            </span>
          </div>

          {userRole === 'admin' && onGoToPublicWebsite && (
            <button
              onClick={onGoToPublicWebsite}
              className="text-[11px] text-blue-300 hover:text-white font-bold flex items-center gap-1 hover:underline"
            >
              <Compass className="w-3.5 h-3.5" /> Public Web
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {accessibleItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded-full bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* User Mini Profile & Logout in Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20 space-y-2">
          <div className="flex items-center gap-3 mb-1 px-1">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'}
              alt={user?.name || 'User'}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/40"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.designation || user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/5 hover:border-red-500/30 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
