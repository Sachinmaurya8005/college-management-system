import React from 'react';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

interface PublicLayoutProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onReturnToPortal?: () => void;
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  currentRoute,
  onNavigate,
  onReturnToPortal,
  children
}) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Authenticated User Top Bar: Quick Portal Access */}
      {isAuthenticated && user && (
        <div className="bg-gradient-to-r from-polytechnic-950 via-slate-900 to-polytechnic-900 text-white text-xs py-2 px-4 sm:px-8 border-b border-white/10 flex items-center justify-between shadow-md sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">
              Viewing Public Web as{' '}
              <strong className="text-amber-400 font-bold">{user.name}</strong>{' '}
              <span className="hidden sm:inline text-slate-400">
                ({user.role === 'admin' ? 'Principal & Chief Administrator' : user.role === 'teacher' ? 'Faculty Member' : 'Student'})
              </span>
            </span>
          </div>

          <button
            onClick={() => onReturnToPortal && onReturnToPortal()}
            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              वापस {user.role === 'admin' ? 'प्रिंसिपल' : user.role === 'teacher' ? 'शिक्षक' : 'छात्र'} पोर्टल पर जाएँ
            </span>
          </button>
        </div>
      )}

      {/* Public Navigation Bar */}
      <PublicNavbar
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        onReturnToPortal={onReturnToPortal}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Public Footer */}
      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
};
