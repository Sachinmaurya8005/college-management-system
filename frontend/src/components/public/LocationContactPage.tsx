import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Navigation,
  Compass,
  Bus,
  Train,
  ExternalLink,
  Shield,
  Clock,
  Building,
  QrCode
} from 'lucide-react';
import { publicService } from '../../services/publicService';
import { CollegeLocationData } from '../../types';
import { CollegeOfficialQrModal } from '../common/CollegeOfficialQrModal';

export const LocationContactPage: React.FC = () => {
  const [location, setLocation] = useState<CollegeLocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await publicService.getCollegeLocation();
        setLocation(res);
      } catch (err) {
        console.error('Failed to load college location', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('gpb_realtime_broadcast_channel');
      bc.onmessage = (event) => {
        if (event.data?.type === 'PUBLIC_CONTENT_UPDATED') {
          fetchLocation();
        }
      };
      return () => {
        bc.close();
      };
    }
  }, []);

  const defaultLocation: CollegeLocationData = {
    address: 'Bansdih - Ballia Road, Near Tehsil & Block Office, Bansdih, Ballia, Uttar Pradesh - 277202',
    district: 'Ballia',
    state: 'Uttar Pradesh',
    pincode: '277202',
    landmark: 'Near Tehsil & Block Office, Bansdih',
    latitude: 25.86472,
    longitude: 84.22153,
    map_embed_url: 'https://maps.google.com/maps?q=25.86472,84.22153&t=&z=14&ie=UTF8&iwloc=&output=embed',
    map_view_url: 'https://maps.google.com/?q=25.86472,84.22153',
    directions_url: 'https://www.google.com/maps/dir/?api=1&destination=25.86472,84.22153',
    connectivity_bus: 'Frequent UPSRTC buses and private shared vehicles available from Ballia Main Bus Stand directly to Bansdih.',
    connectivity_train: 'Ballia Railway Junction (BUI) - 18 km / Bansdih Road Station (BHTR) - 8 km with direct express trains to major cities.',
    contact_phone: '+91 8005072171 / +91 94150 24510',
    contact_email: 'principal.gpbansdih@gmail.com'
  };

  const loc = location || defaultLocation;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase">
            Campus Location &amp; Directions
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            How to Reach Government Polytechnic Bansdih, Ballia
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 max-w-2xl">
            Located in Bansdih, Ballia (Uttar Pradesh). Conveniently accessible via road transit and railway network.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={loc.map_view_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-2xl bg-white text-slate-950 text-xs font-bold shadow-lg hover:bg-blue-50 transition-all flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>View on Map</span>
          </a>
          <a
            href={loc.directions_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
          >
            <Navigation className="w-4 h-4" />
            <span>Get Directions</span>
          </a>
        </div>
      </div>

      {/* Grid: Details & Interactive Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Address & Transit Details (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Postal Address Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              <span>Campus Postal Address</span>
            </h2>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs">
              <strong className="text-slate-900 dark:text-white text-sm block">
                Government Polytechnic
              </strong>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {loc.address}
              </p>
              <div className="pt-2 flex flex-wrap gap-3 text-slate-500 font-mono text-[11px]">
                <span>District: {loc.district}</span>
                <span>•</span>
                <span>Pincode: {loc.pincode}</span>
                <span>•</span>
                <span>Coordinates: {loc.latitude}° N, {loc.longitude}° E</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Phone</span>
                  <strong className="text-slate-800 dark:text-slate-200">{loc.contact_phone}</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Principal Email</span>
                  <strong className="text-slate-800 dark:text-slate-200 truncate block">{loc.contact_email}</strong>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Contact Button */}
            <a
              href="https://wa.me/918005072171?text=Hello%20Government%20Polytechnic%20Bansdih%2C%20I%20have%20an%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.754zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-100 uppercase tracking-wider block font-bold">Direct WhatsApp Helpline</span>
                  <span className="text-sm font-black">+91 8005072171</span>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-white/20 group-hover:bg-white text-white group-hover:text-emerald-700 text-xs font-bold transition-all">
                Send Message →
              </span>
            </a>
          </div>

          {/* Transit & Accessibility Guide */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              <span>Transit &amp; Travel Directions</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Train className="w-4 h-4 text-indigo-600" />
                  <span>By Train / Railway Network</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {loc.connectivity_train}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bus className="w-4 h-4 text-amber-600" />
                  <span>By Road &amp; State Transport Buses</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {loc.connectivity_bus}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Embedded Map (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
            <div className="h-[420px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
              <iframe
                title="Government Polytechnic Map"
                src={loc.map_embed_url}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>

            <div className="pt-4 flex items-center justify-between text-xs px-2">
              <span className="text-slate-500">Polytechnic Campus, Uttar Pradesh - 277202</span>
              <a
                href={loc.directions_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
              >
                Open Google Maps App <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
