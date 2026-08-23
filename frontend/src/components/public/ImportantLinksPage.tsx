import React, { useState, useEffect } from 'react';
import {
  Link2,
  ExternalLink,
  Shield,
  BookOpen,
  Award,
  Globe,
  GraduationCap
} from 'lucide-react';
import { publicService } from '../../services/publicService';
import { ImportantLink } from '../../types';

export const ImportantLinksPage: React.FC = () => {
  const [links, setLinks] = useState<ImportantLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await publicService.getImportantLinks();
        setLinks(res);
      } catch (err) {
        console.error('Failed to load important links', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase">
            Official Technical Education Resources
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Important Institutional &amp; Government Links
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 max-w-2xl">
            Direct access to official examination boards, government scholarship portals, technical education councils, and e-learning platforms.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
          <Globe className="w-5 h-5 text-amber-400" />
          <span>Verified Government Portals</span>
        </div>
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map((item, idx) => (
          <a
            key={item.id || idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono">
                  {item.category}
                </span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px] truncate max-w-[200px]">
                {item.url}
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:underline flex items-center gap-1">
                Open Portal →
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
