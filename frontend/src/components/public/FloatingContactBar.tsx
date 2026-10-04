import React from 'react';
import { WhatsAppFloatingWidget } from './WhatsAppFloatingWidget';
import { AICampusAssistant } from '../common/AICampusAssistant';

interface FloatingContactBarProps {
  onNavigate?: (view: string) => void;
}

export const FloatingContactBar: React.FC<FloatingContactBarProps> = ({ onNavigate }) => {
  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-[9999] flex flex-col items-center gap-3.5 no-print">
      {/* 1. Green Circular WhatsApp Button (Top) - Contact 8005072171 */}
      <WhatsAppFloatingWidget phoneNumber="8005072171" />

      {/* 2. Blue Circular Message / Chat Assistant Button (Bottom) */}
      <AICampusAssistant onNavigate={onNavigate} />
    </div>
  );
};
