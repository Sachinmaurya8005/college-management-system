import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Building,
  Image as ImageIcon,
  FileText,
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  Shield,
  GraduationCap,
  Award,
  ChevronRight,
  Bell,
  ExternalLink,
  Users,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  Compass
} from 'lucide-react';
import { publicService } from '../../services/publicService';
import { PublicHomePayload, Facility, GalleryItem } from '../../types';
import { CollegeLogo } from '../common/CollegeLogo';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onOpenLightbox?: (item: GalleryItem) => void;
  onOpenFacilityModal?: (facility: Facility) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenLightbox,
  onOpenFacilityModal
}) => {
  const [data, setData] = useState<PublicHomePayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await publicService.getHomeOverview();
        setData(res);
      } catch (err) {
        console.error('Failed to load public home overview', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const latestNotices = data?.latest_notices || [];
  const courses = data?.courses || [];
  const facilities = data?.featured_facilities || [];
  const gallery = data?.gallery_preview || [];
  const exams = data?.upcoming_exams || [];
  const links = data?.important_links || [];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Flash Announcements / Ticker Bar */}
      <div className="bg-amber-500/10 dark:bg-amber-950/40 border-b border-amber-500/20 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-xs">
          <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black uppercase text-[10px] flex items-center gap-1 flex-shrink-0">
            <Bell className="w-3 h-3" /> Latest Circulars
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="truncate text-slate-800 dark:text-amber-200 font-medium">
              {latestNotices.length > 0 ? (
                <span>
                  📢 <strong className="font-bold">{latestNotices[0].title}</strong> — {latestNotices[0].content.slice(0, 100)}...
                </span>
              ) : (
                <span>BTEUP Even Semester 2026 Examination Schedule &amp; Fee Verification Circulars Active.</span>
              )}
            </div>
          </div>
          <button
            onClick={() => onNavigate('notices')}
            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 flex-shrink-0"
          >
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-polytechnic-950 via-polytechnic-900 to-blue-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-polytechnic-800">
          {/* Background overlay graphics */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Hero Text & Badges */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>BTEUP Institutional Code: 4412 • AICTE Approved</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-blue-300 block">
                  Department of Technical Education, Uttar Pradesh
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  GOVERNMENT POLYTECHNIC <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                    BANSDEEH, BALLIA
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-blue-200/90 max-w-xl font-normal leading-relaxed">
                  Empowering Purvanchal youth with world-class 3-year diploma engineering programs, industry-standard laboratories, and technical competence under the Board of Technical Education, Uttar Pradesh.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
                <button
                  onClick={() => onNavigate('courses')}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xl shadow-blue-600/40 transition-all flex items-center gap-2 active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Diploma Courses</span>
                </button>

                <button
                  onClick={() => onNavigate('login')}
                  className="px-6 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 active:scale-95"
                >
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <span>Student &amp; Staff Portal</span>
                </button>
              </div>

              {/* Quick Highlight Stats */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/10 text-center lg:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">6</div>
                  <div className="text-[11px] text-blue-200">Diploma Branches</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">100%</div>
                  <div className="text-[11px] text-blue-200">Govt. Subsidized</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">360+</div>
                  <div className="text-[11px] text-blue-200">Annual Intake</div>
                </div>
              </div>
            </div>

            {/* Right Col: Principal Message Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-3xl bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4 text-left">
                <div className="flex items-center gap-4">
                  <img
                    src={data?.principal_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces'}
                    alt="Principal"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400/60 shadow-lg flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                      From the Principal's Desk
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-white">
                      {data?.principal_name || 'Er. R. C. Srivastava'}
                    </h3>
                    <p className="text-[11px] text-blue-200">
                      Principal &amp; Chief Administrator
                    </p>
                  </div>
                </div>

                <p className="text-xs text-blue-100/90 leading-relaxed italic">
                  "{data?.principal_message || 'Our mission is to foster technical excellence, practical workshop competence, and disciplined leadership in every diploma engineer.'}"
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                  <button
                    onClick={() => onNavigate('about')}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                  >
                    Read Full Message <ChevronRight className="w-3 h-3" />
                  </button>
                  <span className="text-[10px] text-blue-300">Government Polytechnic, Ballia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Diploma Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" /> Academic Offerings
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              AICTE-Approved Diploma Engineering Programs
            </h2>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
          >
            View All Courses &amp; Eligibility <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 6).map(course => (
            <div
              key={course.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold">
                    {course.code}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Duration: 3 Years
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {course.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Approved Intake: <strong className="text-slate-800 dark:text-slate-200">{course.totalSeats} Seats</strong>
                </span>
                <button
                  onClick={() => onNavigate('courses')}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Campus Facilities Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-polytechnic-950 text-white shadow-2xl border border-slate-800 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Building className="w-4 h-4" /> Infrastructure &amp; Labs
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Modern Campus Facilities
              </h2>
            </div>
            <button
              onClick={() => onNavigate('facilities')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Explore All Facilities <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.slice(0, 4).map(fac => (
              <div
                key={fac.id}
                onClick={() => onOpenFacilityModal && onOpenFacilityModal(fac)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-blue-500 transition-all flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={fac.cover_image}
                    alt={fac.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-polytechnic-950/80 text-white backdrop-blur-md">
                    {fac.category}
                  </span>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                      {fac.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {fac.short_description}
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] font-bold text-blue-400 flex items-center gap-1">
                    <span>View Photos &amp; Equipment</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Photo Gallery Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              <ImageIcon className="w-4 h-4" /> Campus Life &amp; Events
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Photo &amp; Event Gallery
            </h2>
          </div>
          <button
            onClick={() => onNavigate('gallery')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
          >
            Open Full Gallery <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {gallery.slice(0, 6).map(item => (
            <div
              key={item.id}
              onClick={() => onOpenLightbox && onOpenLightbox(item)}
              className="group cursor-pointer rounded-2xl overflow-hidden relative aspect-square bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-800"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end text-white">
                <span className="text-[9px] font-bold text-amber-400 uppercase">{item.category}</span>
                <p className="text-[10px] font-semibold truncate">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Upcoming Examinations & Important Links Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Upcoming Board Exams */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-500" />
                <span>BTEUP Examination Updates</span>
              </h3>
              <button
                onClick={() => onNavigate('examinations')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Scheme
              </button>
            </div>

            <div className="space-y-3">
              {exams.length > 0 ? (
                exams.slice(0, 3).map(ex => (
                  <div
                    key={ex.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <strong className="text-slate-900 dark:text-white font-bold block">
                        {ex.subject} ({ex.subjectCode})
                      </strong>
                      <span className="text-slate-500">
                        {ex.branch} • Semester {ex.semester}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold font-mono">
                        {ex.examDate}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{ex.startTime}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No active examination notices at this moment.</p>
              )}
            </div>
          </div>

          {/* Right: Important Technical Education Links */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-600" />
                <span>Official External Portals</span>
              </h3>
              <button
                onClick={() => onNavigate('important-links')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                All Links
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {links.slice(0, 4).map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:border-blue-500 transition-all flex items-center justify-between text-xs group"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {link.title}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Campus Location & Contact Snippet */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-polytechnic-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" /> Campus Location &amp; Directions
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Visit Government Polytechnic
            </h2>
            <p className="text-xs text-blue-200 max-w-xl">
              Near Bansdeeh Road Railway Station, Bansdeeh, Ballia, Uttar Pradesh - 277202. Accessible by rail and road.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('location')}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-blue-50 text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>View Map &amp; Transit Info</span>
            </button>
            <a
              href="https://www.google.com/maps/dir//Bansdeeh+Ballia+Uttar+Pradesh+277202"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
