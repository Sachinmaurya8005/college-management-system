import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCollegeData } from '../context/CollegeDataContext';
import { PRINCIPAL_DETAILS } from '../data/mockData';

export interface PrincipalInfo {
  name: string;
  phone: string;
  email: string;
  photoUrl: string;
  designation: string;
  bio?: string;
  qualification?: string;
  experienceYears?: number;
}

export function usePrincipalInfo(): PrincipalInfo {
  const { user } = useAuth();
  const { settings } = useCollegeData();

  const getLatestInfo = (): PrincipalInfo => {
    // 1. Try reading public about storage (persisted by Website Content Manager & Profile Page)
    let publicPhone = '';
    let publicName = '';
    let publicPhoto = '';
    let publicMessage = '';
    try {
      const rawAbout = localStorage.getItem('gpb_public_about');
      if (rawAbout) {
        const parsed = JSON.parse(rawAbout);
        if (parsed?.principal_phone) publicPhone = parsed.principal_phone;
        if (parsed?.principal_name) publicName = parsed.principal_name;
        if (parsed?.principal_photo) publicPhoto = parsed.principal_photo;
        if (parsed?.principal_message) publicMessage = parsed.principal_message;
      }
    } catch (e) {}

    // 2. Direct principal phone key in localStorage
    let directPhone = '';
    try {
      directPhone = localStorage.getItem('gpb_principal_phone') || '';
    } catch (e) {}

    // 3. Admin user profile if logged in or stored in session
    const adminUser = user?.role === 'admin' ? user : null;
    let savedAdmin: any = null;
    try {
      const rawUser = localStorage.getItem('gpb_portal_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (u?.role === 'admin') savedAdmin = u;
      }
    } catch (e) {}
    const activeAdmin = adminUser || savedAdmin;

    // Harmonize fields with prioritizations
    const name = activeAdmin?.name || publicName || settings.principalName || PRINCIPAL_DETAILS.name;
    const phone = directPhone || publicPhone || activeAdmin?.phone || settings.principalPhone || PRINCIPAL_DETAILS.mobile;
    const email = (activeAdmin?.email && activeAdmin.email.includes('@')) ? activeAdmin.email : settings.email || PRINCIPAL_DETAILS.email;
    const photoUrl = activeAdmin?.avatar || publicPhoto || PRINCIPAL_DETAILS.photoUrl;
    const designation = activeAdmin?.designation || PRINCIPAL_DETAILS.designation;
    const bio = publicMessage || activeAdmin?.bio || PRINCIPAL_DETAILS.bio;

    return {
      name,
      phone,
      email,
      photoUrl,
      designation,
      bio,
      qualification: PRINCIPAL_DETAILS.qualification,
      experienceYears: PRINCIPAL_DETAILS.experienceYears
    };
  };

  const [principalInfo, setPrincipalInfo] = useState<PrincipalInfo>(getLatestInfo);

  useEffect(() => {
    setPrincipalInfo(getLatestInfo());

    // Listen for broadcast sync across tabs
    const handleBroadcast = (e: MessageEvent) => {
      if (e.data?.type === 'PUBLIC_CONTENT_UPDATED' || e.data?.type === 'PRINCIPAL_UPDATED') {
        setPrincipalInfo(getLatestInfo());
      }
    };

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel('gpb_realtime_broadcast_channel');
      bc.addEventListener('message', handleBroadcast);
    }

    // Storage event for other tabs/local modifications and custom intra-tab sync
    const handleStorage = () => setPrincipalInfo(getLatestInfo());
    window.addEventListener('storage', handleStorage);
    window.addEventListener('principal-updated', handleStorage);

    return () => {
      if (bc) {
        bc.removeEventListener('message', handleBroadcast);
        bc.close();
      }
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('principal-updated', handleStorage);
    };
  }, [user, settings]);

  return principalInfo;
}
