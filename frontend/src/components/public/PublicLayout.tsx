import React from 'react';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { FloatingContactBar } from './FloatingContactBar';

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
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">

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
      <PublicFooter
        onNavigate={onNavigate}
      />

      {/* 24/7 Intelligent Floating WhatsApp & AI Campus Assistant Helpdesk on Public Website */}
      <FloatingContactBar onNavigate={onNavigate} />
    </div>
  );
};
