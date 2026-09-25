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
  ChevronRight,
  QrCode
} from 'lucide-react';
import { CollegeLogo } from '../common/CollegeLogo';

interface PublicFooterProps {
  onNavigate: (route: string) => void;
  onOpenQrModal?: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate, onOpenQrModal }) => {
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
                  GOVERNMENT POLYTECHNIC BANSDIH
                </h3>
                <span className="text-xs text-amber-400 font-bold block">
                  Ballia, Uttar Pradesh (U.P.)
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
                  Bansdih-Ballia Road, Bansdih, Ballia, UP - 277202
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>+91 8005072171 / +91 94150 24510</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>principal.gpbansdih@gmail.com</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <a
                href="https://wa.me/918005072171?text=Hello%20Government%20Polytechnic%20Bansdih%2C%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-xs font-black text-white text-center flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/30 active:scale-95"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.754zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>💬 WhatsApp Us (8005072171)</span>
              </a>
              <button
                onClick={() => onOpenQrModal && onOpenQrModal()}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-xs font-black text-emerald-300 text-center flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>📱 Scan Official College QR (क्यूआर कोड)</span>
              </button>

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
            © {new Date().getFullYear()} Government Polytechnic Bansdih, Ballia. All Rights Reserved. All Rights Reserved.
          </p>
          <p className="text-[11px] text-slate-600">
            Affiliated to Board of Technical Education, Uttar Pradesh (BTEUP) • Approved by All India Council for Technical Education (AICTE), New Delhi.
          </p>
        </div>
      </div>
    </footer>
  );
};
