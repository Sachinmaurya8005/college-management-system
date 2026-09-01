import React, { useState, useEffect, useRef } from 'react';
import {
  Building,
  Image as ImageIcon,
  Link2,
  IndianRupee,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  Upload,
  Globe,
  Info,
  X,
  ExternalLink,
  ShieldCheck,
  Award,
  BookOpen,
  Sparkles,
  RefreshCw,
  Navigation,
  Compass,
  Eye,
  Bus,
  Train,
  Camera,
  Layers
} from 'lucide-react';
import { websiteContentService } from '../../../services/websiteContentService';
import { useCollegeData } from '../../../context/CollegeDataContext';
import { useAuth } from '../../../context/AuthContext';
import {
  Facility,
  GalleryItem,
  ImportantLink,
  PublicFeeStructure,
  AboutCollegeData,
  CollegeLocationData
} from '../../../types';
import confetti from 'canvas-confetti';

export const WebsiteContentManager: React.FC = () => {
  const { updateSettings } = useCollegeData();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'facilities' | 'gallery' | 'links' | 'fees' | 'location' | 'about'>('facilities');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Facilities State
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [facilityForm, setFacilityForm] = useState<Partial<Facility>>({
    title: '',
    category: 'Laboratories',
    cover_image: '',
    short_description: '',
    detailed_notes: '',
    equipment_list: [],
    display_order: 0,
    status: 'Published'
  });

  // Gallery State
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({
    title: '',
    description: '',
    image_url: '',
    category: 'Campus',
    date: new Date().toISOString().split('T')[0],
    status: 'Published'
  });

  // Important Links State
  const [links, setLinks] = useState<ImportantLink[]>([]);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkForm, setLinkForm] = useState<Partial<ImportantLink>>({
    title: '',
    description: '',
    url: 'https://',
    category: 'Official Resources',
    is_active: true,
    display_order: 0
  });

  // Public Fees State
  const [fees, setFees] = useState<PublicFeeStructure[]>([]);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [feeForm, setFeeForm] = useState<Partial<PublicFeeStructure>>({
    branch: 'All 3-Year Diploma Programs (Regular)',
    academic_year: '2025-2026',
    fee_type: '',
    amount: 12450,
    notes: 'Government subsidized annual fee.',
    is_published: true,
    display_order: 0
  });

  // About College State
  const [aboutForm, setAboutForm] = useState<AboutCollegeData>({
    college_name: 'Government Polytechnic',
    hindi_name: 'राजकीय पॉलिटेक्निक',
    bteup_code: '4412',
    aicte_approval: 'Approved by AICTE, New Delhi & Affiliated to BTEUP Lucknow',
    history: '',
    vision: '',
    mission: '',
    principal_name: 'Er. Sachin Maurya',
    principal_message: '',
    principal_photo: '',
    achievements: []
  });
  const [newAchievement, setNewAchievement] = useState('');

  // Location State
  const [locationForm, setLocationForm] = useState<CollegeLocationData>({
    address: '',
    district: '',
    state: '',
    pincode: '',
    landmark: '',
    latitude: 25.8647,
    longitude: 84.2185,
    map_embed_url: '',
    map_view_url: '',
    directions_url: '',
    connectivity_bus: '',
    connectivity_train: '',
    contact_phone: '',
    contact_email: ''
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load content
  const loadContent = async () => {
    try {
      const [facRes, galRes, linkRes, feeRes, locRes, aboutRes] = await Promise.allSettled([
        websiteContentService.getFacilities(),
        websiteContentService.getGallery(),
        websiteContentService.getLinks(),
        websiteContentService.getPublicFees(),
        websiteContentService.getLocation(),
        websiteContentService.getAboutCollege()
      ]);
      if (facRes.status === 'fulfilled' && Array.isArray(facRes.value)) setFacilities(facRes.value);
      if (galRes.status === 'fulfilled' && Array.isArray(galRes.value)) setGallery(galRes.value);
      if (linkRes.status === 'fulfilled' && Array.isArray(linkRes.value)) setLinks(linkRes.value);
      if (feeRes.status === 'fulfilled' && Array.isArray(feeRes.value)) setFees(feeRes.value);
      if (locRes.status === 'fulfilled' && locRes.value && typeof locRes.value === 'object') setLocationForm(locRes.value);
      if (aboutRes.status === 'fulfilled' && aboutRes.value && typeof aboutRes.value === 'object') {
        setAboutForm(prev => ({
          ...prev,
          ...aboutRes.value,
          achievements: Array.isArray(aboutRes.value.achievements) ? aboutRes.value.achievements : []
        }));
      }
    } catch (err) {
      console.error('Failed to load website content', err);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  // Save Facility
  const handleSaveFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (facilityForm.id) {
        await websiteContentService.updateFacility(facilityForm.id, facilityForm);
      } else {
        await websiteContentService.createFacility(facilityForm);
      }
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setIsFacilityModalOpen(false);
      loadContent();
    } catch (err) {
      console.error('Failed to save facility', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFacility = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this facility?')) return;
    try {
      await websiteContentService.deleteFacility(id);
      loadContent();
    } catch (err) {
      console.error('Failed to delete facility', err);
    }
  };

  // Save Gallery
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (galleryForm.id) {
        await websiteContentService.updateGalleryItem(galleryForm.id, galleryForm);
      } else {
        await websiteContentService.createGalleryItem(galleryForm);
      }
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setIsGalleryModalOpen(false);
      loadContent();
    } catch (err) {
      console.error('Failed to save gallery item', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (!window.confirm('Delete this gallery photo?')) return;
    try {
      await websiteContentService.deleteGalleryItem(id);
      loadContent();
    } catch (err) {
      console.error('Failed to delete gallery item', err);
    }
  };

  // Save Link
  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkForm.title || !linkForm.url) {
      alert('Please provide link title and URL');
      return;
    }
    setSaving(true);
    try {
      if (linkForm.id) {
        await websiteContentService.updateLink(linkForm.id, linkForm);
      } else {
        await websiteContentService.createLink(linkForm);
      }
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setIsLinkModalOpen(false);
      loadContent();
    } catch (err) {
      console.error('Failed to save link', err);
      alert('Failed to save important link. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLink = async (id: number) => {
    if (!window.confirm('Delete this important link?')) return;
    try {
      await websiteContentService.deleteLink(id);
      loadContent();
    } catch (err) {
      console.error('Failed to delete link', err);
    }
  };

  // Save Public Fee
  const handleSaveFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeForm.fee_type || !feeForm.amount) {
      alert('Please provide Fee Head and Amount');
      return;
    }
    setSaving(true);
    try {
      if (feeForm.id) {
        await websiteContentService.updatePublicFee(feeForm.id, feeForm);
      } else {
        await websiteContentService.createPublicFee(feeForm);
      }
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setIsFeeModalOpen(false);
      loadContent();
    } catch (err) {
      console.error('Failed to save fee structure', err);
      alert('Failed to save fee structure. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFee = async (id: number) => {
    if (!window.confirm('Delete this fee head?')) return;
    try {
      await websiteContentService.deletePublicFee(id);
      loadContent();
    } catch (err) {
      console.error('Failed to delete fee head', err);
    }
  };

  // Save Location
  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await websiteContentService.updateLocation(locationForm);
      await updateSettings({
        address: locationForm.address,
        district: locationForm.district,
        state: locationForm.state,
        pincode: locationForm.pincode,
        phone: locationForm.contact_phone,
        email: locationForm.contact_email
      });
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save location', err);
    } finally {
      setSaving(false);
    }
  };

  // Save About College & Principal
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await websiteContentService.updateAboutCollege(aboutForm);
      await updateSettings({
        collegeName: aboutForm.college_name,
        hindiName: aboutForm.hindi_name,
        principalName: aboutForm.principal_name
      });
      if (user?.role === 'admin') {
        updateUser({
          avatar: aboutForm.principal_photo,
          name: aboutForm.principal_name
        });
      }
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save about info', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = parseFloat(pos.coords.latitude.toFixed(5));
        const lng = parseFloat(pos.coords.longitude.toFixed(5));
        setLocationForm(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          map_embed_url: `https://maps.google.com/maps?q=${lat},${lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`,
          map_view_url: `https://maps.google.com/?q=${lat},${lng}`,
          directions_url: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        }));
      },
      err => {
        alert('Could not detect GPS coordinates: ' + err.message);
      }
    );
  };

  const handleGenerateMapFromAddress = () => {
    const q = encodeURIComponent(`${locationForm.address || 'Government Polytechnic'}, ${locationForm.district || 'Uttar Pradesh'}`);
    setLocationForm(prev => ({
      ...prev,
      map_embed_url: `https://maps.google.com/maps?q=${q}&t=&z=14&ie=UTF8&iwloc=&output=embed`,
      map_view_url: `https://maps.google.com/?q=${q}`,
      directions_url: `https://www.google.com/maps/dir/?api=1&destination=${q}`
    }));
  };

  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAboutForm(prev => ({ ...prev, principal_photo: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950">
            Admin Website Control Panel
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Public Website Content &amp; Media Management
          </h1>
          <p className="text-xs sm:text-sm text-blue-200">
            Edit facilities, photo gallery, external links, public fee schedule, about dossier, and campus location in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
          <Globe className="w-5 h-5 text-amber-400" />
          <span>Real-Time Public Publishing</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'facilities', label: 'Facilities & Labs', icon: Building },
          { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
          { id: 'links', label: 'Important Links', icon: Link2 },
          { id: 'fees', label: 'Public Fees', icon: IndianRupee },
          { id: 'about', label: 'About & Principal', icon: Info },
          { id: 'location', label: 'Location & Map', icon: MapPin },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Facilities Management */}
      {activeTab === 'facilities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Campus Facilities &amp; Labs ({facilities.length})
            </h2>
            <button
              onClick={() => {
                setFacilityForm({
                  title: '',
                  category: 'Laboratories',
                  cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
                  short_description: '',
                  detailed_notes: '',
                  equipment_list: [],
                  display_order: 0,
                  status: 'Published'
                });
                setIsFacilityModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Add New Facility
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map(f => (
              <div
                key={f.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={f.cover_image} alt={f.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white">
                      {f.category}
                    </span>
                    <span className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      f.status === 'Published' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {f.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{f.short_description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setFacilityForm(f);
                      setIsFacilityModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-blue-600 text-xs font-bold flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFacility(f.id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 text-red-600 text-xs font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Gallery Management */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Photo Gallery Archive ({gallery.length})
            </h2>
            <button
              onClick={() => {
                setGalleryForm({
                  title: '',
                  description: '',
                  image_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop',
                  category: 'Campus',
                  date: new Date().toISOString().split('T')[0],
                  status: 'Published'
                });
                setIsGalleryModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Upload Gallery Photo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallery.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-3"
              >
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white">
                    {item.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>
                  <span className="text-[10px] text-slate-400 block">{item.date}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setGalleryForm(item);
                      setIsGalleryModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 text-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteGallery(item.id)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-red-600 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Important Links */}
      {activeTab === 'links' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Official External Links ({links.length})
            </h2>
            <button
              onClick={() => {
                setLinkForm({
                  title: '',
                  description: '',
                  url: 'https://',
                  category: 'Official Resources',
                  is_active: true,
                  display_order: 0
                });
                setIsLinkModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> Add Link
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map(l => (
              <div
                key={l.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                    {l.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{l.title}</h3>
                  <p className="text-xs text-slate-500">{l.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1">
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setLinkForm(l);
                        setIsLinkModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 text-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(l.id)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-red-600 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Public Fees */}
      {activeTab === 'fees' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Public Fee Structure Records ({fees.length})
            </h2>
            <button
              onClick={() => {
                setFeeForm({
                  branch: 'All 3-Year Diploma Programs (Regular)',
                  academic_year: '2025-2026',
                  fee_type: '',
                  amount: 12450,
                  notes: 'Government subsidized annual fee.',
                  is_published: true,
                  display_order: 0
                });
                setIsFeeModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> Add Fee Head
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-6">Fee Head</th>
                  <th className="py-3 px-6">Discipline</th>
                  <th className="py-3 px-6">Year</th>
                  <th className="py-3 px-6 text-right">Amount (₹)</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {fees.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-6 font-bold">{f.fee_type}</td>
                    <td className="py-3.5 px-6">{f.branch}</td>
                    <td className="py-3.5 px-6">{f.academic_year}</td>
                    <td className="py-3.5 px-6 text-right font-mono font-bold">₹{f.amount}</td>
                    <td className="py-3.5 px-6 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {f.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <button
                        onClick={() => {
                          setFeeForm(f);
                          setIsFeeModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 text-blue-600 hover:bg-slate-200"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteFee(f.id)}
                        className="p-1.5 rounded-lg bg-slate-100 text-red-600 hover:bg-slate-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: About College & Principal */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span>Principal Profile, Desk Message &amp; Institutional Dossier</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Changes saved here reflect in real-time on the Public Homepage Principal Desk, About Page, and Portals.
              </p>
            </div>
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4" /> Changes Saved Live!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">College Name (English)</label>
                  <input
                    type="text"
                    value={aboutForm.college_name}
                    onChange={e => setAboutForm({ ...aboutForm, college_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Hindi Title (हिंदी शीर्षक)</label>
                  <input
                    type="text"
                    value={aboutForm.hindi_name}
                    onChange={e => setAboutForm({ ...aboutForm, hindi_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Principal Name *</label>
                  <input
                    type="text"
                    required
                    value={aboutForm.principal_name}
                    onChange={e => setAboutForm({ ...aboutForm, principal_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50/40 dark:bg-blue-950/20 outline-none font-bold text-blue-600 dark:text-blue-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">BTEUP Institute Code</label>
                  <input
                    type="text"
                    value={aboutForm.bteup_code}
                    onChange={e => setAboutForm({ ...aboutForm, bteup_code: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Photo & Avatar Controls */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <span>Principal Photo &amp; Avatar Selection</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoFileUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">Quick Avatar Presets:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { label: 'Academician 1 (Male)', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces' },
                      { label: 'Academician 2 (Male)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces' },
                      { label: 'Academician 3 (Male)', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces' },
                      { label: 'Emblem Logo', url: '/college-logo.svg' }
                    ].map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setAboutForm({ ...aboutForm, principal_photo: preset.url })}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] transition-all ${
                          aboutForm.principal_photo === preset.url
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-5 h-5 rounded-full object-cover" />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Or Enter Custom Photo URL:
                  </label>
                  <input
                    type="url"
                    value={aboutForm.principal_photo}
                    onChange={e => setAboutForm({ ...aboutForm, principal_photo: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-[11px] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Principal Desk Message (प्राचार्य संदेश) *</label>
                <textarea
                  rows={4}
                  required
                  value={aboutForm.principal_message}
                  onChange={e => setAboutForm({ ...aboutForm, principal_message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">College Genesis &amp; Institutional History</label>
                <textarea
                  rows={3}
                  value={aboutForm.history}
                  onChange={e => setAboutForm({ ...aboutForm, history: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Vision Statement</label>
                  <textarea
                    rows={2}
                    value={aboutForm.vision}
                    onChange={e => setAboutForm({ ...aboutForm, vision: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Mission Statement</label>
                  <textarea
                    rows={2}
                    value={aboutForm.mission}
                    onChange={e => setAboutForm({ ...aboutForm, mission: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Live Principal Card Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <Eye className="w-4 h-4" /> Live Public Card Preview
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-polytechnic-950 via-slate-900 to-indigo-950 text-white border border-polytechnic-800 shadow-2xl space-y-4 text-left">
                <div className="flex items-center gap-4">
                  <img
                    src={aboutForm.principal_photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces'}
                    alt="Principal"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400/80 shadow-lg flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces';
                    }}
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                      From the Principal's Desk
                    </span>
                    <h3 className="text-base font-extrabold text-white">
                      {aboutForm.principal_name || 'Er. Sachin Maurya'}
                    </h3>
                    <p className="text-[11px] text-blue-200">
                      Principal &amp; Chief Administrator
                    </p>
                  </div>
                </div>

                <p className="text-xs text-blue-100/90 leading-relaxed italic bg-white/5 p-3.5 rounded-2xl border border-white/10">
                  "{aboutForm.principal_message || 'Technical education is the cornerstone of industrial transformation and self-reliance.'}"
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-white/10 text-[11px] text-slate-400 font-mono">
                  <span>{aboutForm.college_name}</span>
                  <span className="text-amber-400 font-bold">BTEUP: {aboutForm.bteup_code}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Real-Time Website Synchronization</span>
                </div>
                <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                  When you click <strong>"Save About &amp; Principal Dossier"</strong>, this new name and photo will automatically replace the details on the public homepage, about section, and all official receipts.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xl shadow-blue-600/30 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving & Publishing Live...' : 'Save & Publish Principal Profile Live'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 6: Location Settings */}
      {activeTab === 'location' && (
        <form onSubmit={handleSaveLocation} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-500" />
                <span>Campus Location, Coordinates &amp; Interactive Map Manager</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Control the college map, GPS pin coordinates, and transit guides displayed on the Public Website.
              </p>
            </div>
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4" /> Location Saved Live!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form (7 cols) */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Campus Postal Address *
                </label>
                <input
                  type="text"
                  required
                  value={locationForm.address}
                  onChange={e => setLocationForm({ ...locationForm, address: e.target.value })}
                  placeholder="e.g. Government Polytechnic Main Campus, Uttar Pradesh - 277202"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={locationForm.district}
                    onChange={e => setLocationForm({ ...locationForm, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={locationForm.state}
                    onChange={e => setLocationForm({ ...locationForm, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={locationForm.pincode}
                    onChange={e => setLocationForm({ ...locationForm, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono outline-none"
                  />
                </div>
              </div>

              {/* Coordinates & Auto-detect bar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-rose-500" />
                    <span>GPS Coordinates (Lat / Long)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDetectGps}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Detect My Device GPS</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateMapFromAddress}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Generate Map from Address</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.00001"
                      value={locationForm.latitude}
                      onChange={e => setLocationForm({ ...locationForm, latitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.00001"
                      value={locationForm.longitude}
                      onChange={e => setLocationForm({ ...locationForm, longitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Google Maps Embed Iframe URL *
                </label>
                <input
                  type="url"
                  required
                  value={locationForm.map_embed_url}
                  onChange={e => setLocationForm({ ...locationForm, map_embed_url: e.target.value })}
                  placeholder="https://maps.google.com/maps?q=...&output=embed"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Bus className="w-3.5 h-3.5 text-amber-500" />
                    <span>Bus &amp; Road Transit Info</span>
                  </label>
                  <textarea
                    rows={2}
                    value={locationForm.connectivity_bus}
                    onChange={e => setLocationForm({ ...locationForm, connectivity_bus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Train className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Railway Connectivity Info</span>
                  </label>
                  <textarea
                    rows={2}
                    value={locationForm.connectivity_train}
                    onChange={e => setLocationForm({ ...locationForm, connectivity_train: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Official Phone Number</label>
                  <input
                    type="text"
                    value={locationForm.contact_phone}
                    onChange={e => setLocationForm({ ...locationForm, contact_phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Official Email</label>
                  <input
                    type="email"
                    value={locationForm.contact_email}
                    onChange={e => setLocationForm({ ...locationForm, contact_email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Live Embedded Map Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> Live Map Preview
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {locationForm.latitude?.toFixed(4)}, {locationForm.longitude?.toFixed(4)}
                </span>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden space-y-3">
                <div className="h-[280px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative border border-slate-200 dark:border-slate-700">
                  {locationForm.map_embed_url ? (
                    <iframe
                      title="Campus Map Preview"
                      src={locationForm.map_embed_url}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                      <MapPin className="w-8 h-8 text-slate-300" />
                      <span className="text-xs">Enter Embed URL or Click Generate Map</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {locationForm.address || 'Government Polytechnic'}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>{locationForm.district || 'Uttar Pradesh'}, {locationForm.state || 'Uttar Pradesh'}</span>
                    <a
                      href={locationForm.directions_url || `https://maps.google.com/?q=${locationForm.latitude},${locationForm.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Open Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xl shadow-blue-600/30 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving & Publishing Location...' : 'Save & Publish Location Live'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Facility Modal */}
      {isFacilityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {facilityForm.id ? 'Edit Campus Facility' : 'Add Campus Facility'}
              </h2>
              <button onClick={() => setIsFacilityModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveFacility} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div>
                <label className="block font-semibold mb-1">Facility Title *</label>
                <input
                  type="text"
                  required
                  value={facilityForm.title}
                  onChange={e => setFacilityForm({ ...facilityForm, title: e.target.value })}
                  placeholder="e.g. Advanced Computer & IoT Lab"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={facilityForm.category}
                    onChange={e => setFacilityForm({ ...facilityForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="Computer Labs">Computer Labs</option>
                    <option value="Laboratories">Laboratories</option>
                    <option value="Library">Central Library</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Smart Classroom">Smart Classroom</option>
                    <option value="Sports">Sports</option>
                    <option value="Campus">Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={facilityForm.status}
                    onChange={e => setFacilityForm({ ...facilityForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Cover Photo URL *</label>
                <input
                  type="url"
                  required
                  value={facilityForm.cover_image}
                  onChange={e => setFacilityForm({ ...facilityForm, cover_image: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={facilityForm.short_description}
                  onChange={e => setFacilityForm({ ...facilityForm, short_description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Detailed Technical Notes</label>
                <textarea
                  rows={3}
                  value={facilityForm.detailed_notes}
                  onChange={e => setFacilityForm({ ...facilityForm, detailed_notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFacilityModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md"
                >
                  {saving ? 'Saving...' : 'Save Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {galleryForm.id ? 'Edit Photo' : 'Upload Gallery Photo'}
              </h2>
              <button onClick={() => setIsGalleryModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveGallery} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  placeholder="e.g. Annual Technical Exhibition 2026"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={galleryForm.category}
                  onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                >
                  <option value="Campus">Campus</option>
                  <option value="Laboratories">Laboratories</option>
                  <option value="Workshops">Workshops</option>
                  <option value="Events">Events</option>
                  <option value="Sports">Sports</option>
                  <option value="Cultural Activities">Cultural Activities</option>
                  <option value="Classrooms">Classrooms</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Photo Image URL *</label>
                <input
                  type="url"
                  required
                  value={galleryForm.image_url}
                  onChange={e => setGalleryForm({ ...galleryForm, image_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={galleryForm.description}
                  onChange={e => setGalleryForm({ ...galleryForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Important Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {linkForm.id ? 'Edit Important Link' : 'Add Important Link'}
              </h2>
              <button onClick={() => setIsLinkModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveLink} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Link Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Board of Technical Education UP (BTEUP)"
                  value={linkForm.title}
                  onChange={e => setLinkForm({ ...linkForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Target URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://bteup.ac.in"
                  value={linkForm.url}
                  onChange={e => setLinkForm({ ...linkForm, url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={linkForm.category}
                  onChange={e => setLinkForm({ ...linkForm, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                >
                  <option value="Examination & Board">Examination &amp; Board</option>
                  <option value="Technical Education">Technical Education</option>
                  <option value="Admission & Entrance">Admission &amp; Entrance</option>
                  <option value="Scholarship & Welfare">Scholarship &amp; Welfare</option>
                  <option value="Digital Learning">Digital Learning</option>
                  <option value="Official Resources">Official Resources</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Official portal for syllabus and examination marks"
                  value={linkForm.description}
                  onChange={e => setLinkForm({ ...linkForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="link_active"
                  checked={linkForm.is_active}
                  onChange={e => setLinkForm({ ...linkForm, is_active: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <label htmlFor="link_active" className="font-semibold text-slate-700 dark:text-slate-300">
                  Active and visible on public website
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700"
                >
                  {saving ? 'Saving...' : 'Save Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Public Fee Structure Modal */}
      {isFeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {feeForm.id ? 'Edit Public Fee Head' : 'Add Public Fee Head'}
              </h2>
              <button onClick={() => setIsFeeModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveFee} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Fee Head / Component Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Tuition Fee (Subsidized)"
                  value={feeForm.fee_type}
                  onChange={e => setFeeForm({ ...feeForm, fee_type: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Applicable Discipline *</label>
                  <input
                    type="text"
                    required
                    placeholder="All 3-Year Diploma Programs"
                    value={feeForm.branch}
                    onChange={e => setFeeForm({ ...feeForm, branch: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Amount (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="8000"
                    value={feeForm.amount}
                    onChange={e => setFeeForm({ ...feeForm, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Academic Year</label>
                <input
                  type="text"
                  value={feeForm.academic_year}
                  onChange={e => setFeeForm({ ...feeForm, academic_year: e.target.value })}
                  placeholder="2025-2026"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes / Policy Details</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Government subsidized fee, payable at beginning of session"
                  value={feeForm.notes}
                  onChange={e => setFeeForm({ ...feeForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="fee_published"
                  checked={feeForm.is_published}
                  onChange={e => setFeeForm({ ...feeForm, is_published: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <label htmlFor="fee_published" className="font-semibold text-slate-700 dark:text-slate-300">
                  Published and visible on public website
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFeeModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700"
                >
                  {saving ? 'Saving...' : 'Save Fee Head'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
