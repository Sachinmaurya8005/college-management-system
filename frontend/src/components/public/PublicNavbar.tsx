import React, { useState } from 'react';
import {
  Menu,
  X,
  Sun,
  Moon,
  LogIn,
  Home,
  Info,
  BookOpen,
  Users,
  Building,
  Image as ImageIcon,
  IndianRupee,
  Calendar,
  FileText,
  Bell,
  Link2,
  MapPin,
  Shield,
  GraduationCap,
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import { CollegeLogo } from '../common/CollegeLogo';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

interface PublicNavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onReturnToPortal?: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ currentRoute, onNavigate, onReturnToPortal }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NAV_LINKS = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'faculty', label: 'Faculty & Staff', icon: Users },
    { id: 'placements', label: 'TPO Placements', icon: Briefcase },
    { id: 'library', label: 'E-Library', icon: BookOpen },
    { id: 'facilities', label: 'Facilities', icon: Building },
    { id: 'fees', label: 'Fees Info', icon: IndianRupee },
    { id: 'examinations', label: 'Exams', icon: FileText },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'location', label: 'Location & Contact', icon: MapPin },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-polytechnic-950/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-polytechnic-800/80 dark:border-slate-800 text-white shadow-xl transition-colors">
      {/* Top Utility Bar */}
      <div className="bg-gradient-to-r from-polytechnic-900 via-blue-900 to-indigo-950 text-[11px] py-1.5 px-4 sm:px-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-blue-200">
          <span className="font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            BTEUP Inst. Code: <strong className="text-amber-400">4412</strong>
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="hidden sm:inline">Approved by AICTE, New Delhi</span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="hidden md:inline">Govt. of Uttar Pradesh</span>
        </div>

        <div className="flex items-center gap-3 text-blue-200">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Live Real-Time
          </span>
          <span className="text-white/30">•</span>
          <button
            onClick={() => handleNavClick('location')}
            className="hover:text-white flex items-center gap-1 transition-colors"
          >
            <MapPin className="w-3 h-3 text-amber-400" /> Bansdeeh, Ballia (U.P.)
          </button>
          <span className="text-white/30">•</span>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Header Branding & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* College Logo & Title */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="relative">
              <CollegeLogo size="lg" showText={false} className="rounded-xl shadow-lg ring-2 ring-white/20 transition-transform group-hover:scale-105" />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-[9px] font-black text-slate-950 px-1 py-0.2 rounded-full shadow">
                GPB
              </div>
            </div>
            <div className="leading-tight">
              <span className="text-[10px] sm:text-xs font-bold text-amber-400 tracking-wider uppercase block">
                राजकीय पॉलिटेक्निक
              </span>
              <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white group-hover:text-blue-200 transition-colors">
                GOVERNMENT POLYTECHNIC
              </h1>
              <span className="text-[10px] text-blue-200/80 font-medium block">
                Ballia, Uttar Pradesh - 277202
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {NAV_LINKS.slice(0, 8).map(link => {
              const Icon = link.icon;
              const isActive = currentRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span>{link.label}</span>
                </button>
              );
            })}

            {/* Dropdown / More links */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-1">
                <span>More</span>
                <span className="text-[10px]">▼</span>
              </button>
              <div className="absolute right-0 mt-1 w-48 py-2 rounded-2xl bg-polytechnic-950/95 dark:bg-slate-900/95 backdrop-blur-xl border border-polytechnic-800 dark:border-slate-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                {NAV_LINKS.slice(8).map(link => {
                  const Icon = link.icon;
                  const isActive = currentRoute === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className={`w-full px-4 py-2 text-left text-xs font-bold transition-all flex items-center gap-2 ${
                        isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-blue-400" />
                      <span>{link.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Action CTAs: Portal Login or Return to Portal */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <button
                onClick={() => {
                  if (onReturnToPortal) onReturnToPortal();
                  else handleNavClick('login');
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 ring-1 ring-white/20 transition-all flex items-center gap-1.5 active:scale-95"
                title="Return to your authenticated portal dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>
                  {user.role === 'admin'
                    ? '⬅ Principal Portal'
                    : user.role === 'teacher'
                    ? '⬅ Faculty Portal'
                    : '⬅ Student Portal'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-blue-600/30 ring-1 ring-white/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Portal Login</span>
              </button>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="xl:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-polytechnic-950 dark:bg-slate-950 border-t border-polytechnic-800 dark:border-slate-800 px-4 py-4 space-y-1 shadow-2xl max-h-[80vh] overflow-y-auto">
          {NAV_LINKS.map(link => {
            const Icon = link.icon;
            const isActive = currentRoute === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center gap-3 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 text-blue-400" />
                <span>{link.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-white/10 mt-2">
            <button
              onClick={() => handleNavClick('login')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-lg"
            >
              <LogIn className="w-4 h-4" />
              <span>Student / Staff Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
