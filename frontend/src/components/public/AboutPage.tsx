import React, { useState, useEffect } from 'react';
import {
  Building,
  Award,
  CheckCircle2,
  Shield,
  Target,
  Eye,
  BookOpen,
  GraduationCap,
  Users,
  MapPin,
  Clock
} from 'lucide-react';
import { publicService } from '../../services/publicService';
import { AboutCollegeData } from '../../types';
import { CollegeLogo } from '../common/CollegeLogo';

export const AboutPage: React.FC = () => {
  const [about, setAbout] = useState<AboutCollegeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await publicService.getAboutCollege();
        setAbout(res);
      } catch (err) {
        console.error('Failed to load about college data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Banner Header */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
        <CollegeLogo size="lg" showText={false} className="rounded-2xl shadow-xl ring-4 ring-white/20 flex-shrink-0" />
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase">
            Affiliated to BTEUP Code: {about?.bteup_code || '4412'} • AICTE Approved
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            About Government Polytechnic Bansdeeh, Ballia
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 max-w-3xl">
            Established by the Government of Uttar Pradesh to foster world-class technical education, industrial excellence, and career development.
          </p>
        </div>
      </div>

      {/* Main Grid: History & Vision/Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: History & Institutional Profile (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              <span>History &amp; Genesis</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {about?.history ||
                'Government Polytechnic Bansdeeh, Ballia was established in Uttar Pradesh as a flagship government polytechnic institution to deliver world-class technical education, industrial vocational skills, and career opportunities to youth across the Purvanchal region. Since its inception, the institute has maintained high standards of academic rigor, practical workshop training, and successful industry placements under the Board of Technical Education, Uttar Pradesh.'}
            </p>
          </div>

          {/* Vision & Mission Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Our Vision
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {about?.vision ||
                  'To be a premier technical institute in Northern India empowering diploma engineers with deep technical competence, innovative mindset, ethical stewardship, and community impact.'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Our Mission
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {about?.mission ||
                  'Provide industry-aligned curriculum, world-class laboratory infrastructure, dedicated faculty mentorship, and holistic skill development for aspiring diploma technicians.'}
              </p>
            </div>
          </div>

          {/* Key Achievements */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Key Institutional Achievements</span>
            </h2>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              {(about?.achievements || [
                '100% AICTE Approval & BTEUP Code 4412 Accreditation',
                'Over 85% placement rate across leading core engineering & IT firms',
                'State-of-the-art Computer Labs & Modern Production Workshops',
                'Active MOUs with prominent regional manufacturing & IT industries'
              ]).map((ach, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{ach}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Principal's Message & Official Dossier (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-polytechnic-950 to-slate-900 text-white border border-polytechnic-800 shadow-xl space-y-5">
            <div className="text-center space-y-3">
              <img
                src={about?.principal_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces'}
                alt="Principal"
                className="w-32 h-32 rounded-3xl object-cover ring-4 ring-amber-400/50 shadow-2xl mx-auto"
              />
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                  Principal &amp; Head of Institution
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  {about?.principal_name || 'Er. R. C. Srivastava'}
                </h3>
                <p className="text-xs text-blue-300">
                  Government Polytechnic Bansdeeh, Ballia
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-blue-100/90 leading-relaxed italic space-y-2">
              <p>
                "{about?.principal_message ||
                  'Welcome to Government Polytechnic Bansdeeh, Ballia. Our institution is dedicated to building robust technical foundation, practical engineering skills, and career opportunities for our diploma students under BTEUP curriculum.'}"
              </p>
              <p>
                "We emphasize discipline, hands-on laboratory experimentation, and industry alignment to prepare technicians who drive India's infrastructure and technology development."
              </p>
            </div>

            <div className="pt-2 text-center text-xs text-slate-400 font-mono">
              BTEUP Code: 4412 • AICTE Permanent ID: 1-3328491021
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
