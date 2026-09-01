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
  Building
} from 'lucide-react';
import { publicService } from '../../services/publicService';
import { CollegeLocationData } from '../../types';

export const LocationContactPage: React.FC = () => {
  const [location, setLocation] = useState<CollegeLocationData | null>(null);
  const [loading, setLoading] = useState(true);

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
    address: 'Campus Main Road, Uttar Pradesh - 277202',
    district: 'Main District',
    state: 'Uttar Pradesh',
    pincode: '277202',
    landmark: 'State Highway 1, Polytechnic Campus',
    latitude: 25.8647,
    longitude: 84.2185,
    map_embed_url: 'https://maps.google.com/maps?q=Uttar+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed',
    map_view_url: 'https://maps.google.com/?q=25.8647,84.2185',
    directions_url: 'https://maps.google.com',
    connectivity_bus: 'Frequent UPSRTC buses and private shared vehicles available from City Bus Stand.',
    connectivity_train: 'Nearest Railway Station with direct express trains to major cities.',
    contact_phone: '+91 94150 24510 / +91 5498 290124',
    contact_email: 'principal.polytechnic@gmail.com'
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
            How to Reach Government Polytechnic
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 max-w-2xl">
            Located in Uttar Pradesh. Conveniently accessible via road transit and railway network.
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
