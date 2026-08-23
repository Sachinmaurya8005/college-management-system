import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Shield,
  GraduationCap,
  Globe,
  Award,
  ChevronRight
} from 'lucide-react';
import { CollegeLogo } from '../common/CollegeLogo';

interface PublicFooterProps {
  onNavigate: (route: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-polytechnic-950 dark:bg-slate-950 text-slate-300 border-t border-polytechnic-800 dark:border-slate-800 pt-14 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Institutional Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CollegeLogo size="md" showText={false} className="rounded-xl shadow-lg" />
              <div>
                <h3 className="text-sm font-extrabold text-white tracking-tight">
                  GOVERNMENT POLYTECHNIC
                </h3>
                <span className="text-xs text-amber-400 font-bold block">
                  Bansdeeh, Ballia (U.P.)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Flagship Government Polytechnic Institute dedicated to imparting quality technical education, hands-on workshop training, and career empowerment in Uttar Pradesh.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-polytechnic-900 border border-polytechnic-700 text-amber-400 font-bold">
                BTEUP Code: 4412
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-polytechnic-900 border border-polytechnic-700 text-blue-300 font-bold">
                AICTE Approved
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-polytechnic-800 pb-2">
              Public Sections
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'about', label: 'About College & History' },
                { id: 'courses', label: 'Diploma Engineering Branches' },
                { id: 'faculty', label: 'Faculty Directory' },
                { id: 'facilities', label: 'Campus Facilities & Labs' },
                { id: 'gallery', label: 'Photo & Event Gallery' },
                { id: 'fees', label: 'Official Fee Structure' },
                { id: 'notices', label: 'Public Notice Board' },
              ].map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      onNavigate(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-blue-500" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Official Technical Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-polytechnic-800 pb-2">
              Official Portals
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'BTEUP Examination Portal', url: 'https://bteup.ac.in' },
                { label: 'AICTE Official Portal', url: 'https://www.aicte-india.org' },
                { label: 'JEECUP Polytechnic Admissions', url: 'https://jeecup.admissions.nic.in' },
                { label: 'UP State Scholarship Portal', url: 'https://scholarship.up.gov.in' },
                { label: 'URISE Student Portal UP', url: 'https://urise.up.gov.in' },
                { label: 'Technical Education Dept. UP', url: 'http://dte.up.gov.in' },
              ].map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Campus Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-polytechnic-800 pb-2">
              Campus Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  Near Bansdeeh Road Railway Station, Bansdeeh, Ballia, Uttar Pradesh - 277202
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>+91 94150 24510 / +91 5498 290124</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>principal.gpbansdeeh@gmail.com</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onNavigate('location');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2 px-3 rounded-xl bg-polytechnic-900 hover:bg-polytechnic-800 border border-polytechnic-700 text-xs font-bold text-white text-center flex items-center justify-center gap-1.5 transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>View Campus on Map &amp; Directions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 border-t border-polytechnic-800/80 dark:border-slate-800 text-center text-xs text-slate-500 space-y-2">
          <p>
            © {new Date().getFullYear()} Government Polytechnic, Uttar Pradesh. All Rights Reserved.
          </p>
          <p className="text-[11px] text-slate-600">
            Affiliated to Board of Technical Education, Uttar Pradesh (BTEUP) • Approved by All India Council for Technical Education (AICTE), New Delhi.
          </p>
        </div>
      </div>
    </footer>
  );
};
