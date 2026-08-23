import React, { useState, useEffect } from 'react';
import {
  Building,
  CheckCircle2,
  Image as ImageIcon,
  ChevronRight,
  X,
  Layers,
  Wrench,
  Cpu,
  BookOpen
} from 'lucide-react';
import { publicService } from '../../services/publicService';
import { Facility } from '../../types';

interface FacilitiesPageProps {
  selectedFacilityModal?: Facility | null;
  onCloseFacilityModal?: () => void;
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalFacility, setActiveModalFacility] = useState<Facility | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await publicService.getFacilities(selectedCategory);
        setFacilities(res);
      } catch (err) {
        console.error('Failed to load facilities', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, [selectedCategory]);

  const CATEGORIES = [
    'All',
    'Computer Labs',
    'Library',
    'Workshops',
    'Laboratories',
    'Smart Classroom',
    'Sports',
    'Campus'
  ];

  const handleOpenModal = (fac: Facility) => {
    setActiveModalFacility(fac);
    setActivePhotoIdx(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase">
            World-Class Infrastructure
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Campus Infrastructure &amp; Technical Laboratories
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 max-w-2xl">
            State-of-the-art engineering laboratories, high-performance computing centers, central library, and industrial workshops.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
          <Building className="w-5 h-5 text-amber-400" />
          <span>AICTE Standard Labs</span>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map(fac => (
          <div
            key={fac.id}
            onClick={() => handleOpenModal(fac)}
            className="group cursor-pointer rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={fac.cover_image}
                alt={fac.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-polytechnic-950/80 text-white backdrop-blur-md">
                {fac.category}
              </span>
              {fac.photos && fac.photos.length > 0 && (
                <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> {fac.photos.length + 1} Photos
                </span>
              )}
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {fac.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mt-1.5">
                  {fac.short_description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Click to inspect</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Multi-Photos &amp; Notes <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Multi-Photo Modal Viewer */}
      {activeModalFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {activeModalFacility.category}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeModalFacility.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveModalFacility(null)}
                aria-label="Close modal"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Photo Showcase & Thumbnail Carousel */}
              <div className="space-y-3">
                {(() => {
                  const allPhotos = [
                    { image_url: activeModalFacility.cover_image, caption: 'Main Overview' },
                    ...(activeModalFacility.photos || [])
                  ];
                  const currentPhoto = allPhotos[activePhotoIdx] || allPhotos[0];

                  return (
                    <>
                      <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-950">
                        <img
                          src={currentPhoto.image_url}
                          alt={currentPhoto.caption || activeModalFacility.title}
                          className="w-full h-full object-contain"
                        />
                        {currentPhoto.caption && (
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-xs font-semibold">
                            {currentPhoto.caption}
                          </div>
                        )}
                      </div>

                      {allPhotos.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                          {allPhotos.map((p, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActivePhotoIdx(idx)}
                              className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                                activePhotoIdx === idx ? 'border-blue-600 ring-2 ring-blue-600/30' : 'border-transparent opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img src={p.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Facility Overview &amp; Specifications
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeModalFacility.detailed_notes || activeModalFacility.short_description}
                </p>
              </div>

              {/* Equipment List */}
              {activeModalFacility.equipment_list && activeModalFacility.equipment_list.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    Key Equipment &amp; Technical Capabilities
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                    {activeModalFacility.equipment_list.map((eq, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{eq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveModalFacility(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md"
              >
                Close Facility View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
