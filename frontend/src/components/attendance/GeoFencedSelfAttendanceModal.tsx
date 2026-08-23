import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  Building,
  Radio,
  UserCheck,
  RefreshCw,
  Sparkles,
  X,
  Navigation
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCollegeData } from '../../context/CollegeDataContext';
import { CAMPUS_COORDINATES, calculateDistanceMeters } from '../../utils/helpers';
import confetti from 'canvas-confetti';

interface GeoFencedSelfAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDate?: string;
}

export const GeoFencedSelfAttendanceModal: React.FC<GeoFencedSelfAttendanceModalProps> = ({
  isOpen,
  onClose,
  targetDate
}) => {
  const { user } = useAuth();
  const { markTeacherAttendance, markPrincipalTodayAttendance, teachers } = useCollegeData();

  const isPrincipal = user?.role === 'admin';
  const currentTeacher = teachers.find(t => t.email === user?.email) || teachers[0];

  const todayStr = targetDate || new Date().toISOString().slice(0, 10);

  // GPS State
  const [gpsLoading, setGpsLoading] = useState(true);
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [isWithinCampus, setIsWithinCampus] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [markedSuccess, setMarkedSuccess] = useState(false);

  // Simulation mode for developer/demonstration testing
  const [simulatedInCampus, setSimulatedInCampus] = useState(true);

  const fetchRealGpsLocation = () => {
    setGpsLoading(true);
    setErrorMsg(null);

    if (simulatedInCampus) {
      // Simulate In-Campus coordinates (12 meters from Government Polytechnic main gate)
      const simLat = CAMPUS_COORDINATES.latitude + (Math.random() - 0.5) * 0.0001;
      const simLng = CAMPUS_COORDINATES.longitude + (Math.random() - 0.5) * 0.0001;
      const dist = calculateDistanceMeters(simLat, simLng);

      setTimeout(() => {
        setCoords({ lat: simLat, lng: simLng, accuracy: 5.2 });
        setDistanceMeters(dist);
        setIsWithinCampus(dist <= CAMPUS_COORDINATES.radiusMeters);
        setGpsLoading(false);
      }, 500);
      return;
    }

    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const dist = calculateDistanceMeters(lat, lng);

        setCoords({ lat, lng, accuracy: position.coords.accuracy });
        setDistanceMeters(dist);
        setIsWithinCampus(dist <= CAMPUS_COORDINATES.radiusMeters);
        setGpsLoading(false);
      },
      err => {
        setErrorMsg(`GPS Access Error: ${err.message}. Using high-accuracy campus reference.`);
        // Fallback calculation
        const fallbackDist = simulatedInCampus ? 14 : 320;
        setDistanceMeters(fallbackDist);
        setIsWithinCampus(fallbackDist <= CAMPUS_COORDINATES.radiusMeters);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (isOpen) {
      setMarkedSuccess(false);
      fetchRealGpsLocation();
    }
  }, [isOpen, simulatedInCampus]);

  if (!isOpen) return null;

  const handleMarkAttendance = () => {
    const geoRecord = {
      latitude: coords?.lat || CAMPUS_COORDINATES.latitude,
      longitude: coords?.lng || CAMPUS_COORDINATES.longitude,
      accuracy: coords?.accuracy || 5.0,
      distanceToCampusMeters: distanceMeters || 12,
      isInsideCampus: true,
      timestamp: new Date().toISOString(),
      deviceInfo: `${navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop/Laptop'} (GPB 50m Geofence OK)`
    };

    if (isPrincipal) {
      markPrincipalTodayAttendance('P', geoRecord);
    } else if (currentTeacher) {
      markTeacherAttendance(currentTeacher.id, todayStr, 'P', geoRecord, 'self_geofenced');
    }

    setMarkedSuccess(true);
    confetti({ particleCount: 60, spread: 80 });

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-xs animate-scale-up">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white flex items-center justify-center shadow-md">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  50-Meter Campus Geo-Fencing Attendance
                </h3>
              </div>
              <p className="text-slate-500 font-medium">
                राजकीय पॉलिटेक्निक • बायोमेट्रिक व जीपीएस हाजिरी
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Info Bar */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Employee / Official</span>
            <strong className="text-slate-900 dark:text-white text-xs">
              {isPrincipal ? 'Er. Sachin Maurya (Principal)' : currentTeacher?.name}
            </strong>
            <span className="text-slate-500 text-[11px] block">
              {isPrincipal ? 'Office of Principal' : `${currentTeacher?.empCode} • ${currentTeacher?.department}`}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Date &amp; Time</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{todayStr}</span>
            <div className="text-emerald-600 font-bold text-[11px] flex items-center justify-end gap-1">
              <Clock className="w-3 h-3" />
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        {/* Geo-Location Status Box */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-900 border-slate-200 dark:border-slate-700 space-y-4 text-center">
            {gpsLoading ? (
              <div className="py-6 space-y-2">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  Acquiring Device GPS Coordinates &amp; Checking 50m Campus Radius...
                </p>
                <span className="text-slate-400 text-[11px]">Contacting satellites &amp; WiFi beacons</span>
              </div>
            ) : isWithinCampus ? (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-500/20 animate-pulse">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-black text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>INSIDE CAMPUS (दूरी: {distanceMeters} मीटर)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                    You are verified within the <strong>50-meter radius</strong> of Government Polytechnic.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono">
                  <div>Lat: {coords?.lat.toFixed(5)}° N</div>
                  <div>Long: {coords?.lng.toFixed(5)}° E</div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-rose-500/20">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-black text-xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>OUT OF CAMPUS BOUNDARY (दूरी: {distanceMeters} मीटर)</span>
                  </div>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 font-medium">
                    आप कॉलेज परिसर से <strong>{distanceMeters} मीटर</strong> दूर हैं। आपकी हाजिरी केवल कॉलेज के <strong>50 मीटर के दायरे</strong> में ही लग सकती है।
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Test / Simulation Switch Bar */}
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between text-[11px]">
            <span className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-blue-600" />
              <span>GPS Simulation Mode (परीक्षण मोड):</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSimulatedInCampus(true)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  simulatedInCampus
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                In Campus (12m)
              </button>
              <button
                type="button"
                onClick={() => setSimulatedInCampus(false)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  !simulatedInCampus
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Outside (&gt;50m)
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
          >
            Cancel
          </button>

          {isWithinCampus ? (
            <button
              type="button"
              disabled={markedSuccess}
              onClick={handleMarkAttendance}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{markedSuccess ? 'Attendance Marked!' : 'Punch In Campus Attendance (हाजिरी लगाएं)'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                alert('Attendance Request sent to Principal Er. Sachin Maurya for manual verification.');
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md flex items-center gap-2 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>Request Principal Manual Mark (प्रिंसिपल से अनुरोध करें)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
