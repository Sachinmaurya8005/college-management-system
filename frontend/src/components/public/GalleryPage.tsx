import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Tag,
  Maximize2
} from 'lucide-react';
import { publicService } from '../../services/publicService';
import { GalleryItem } from '../../types';

export const GalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await publicService.getGallery(selectedCategory);
        setGallery(res);
      } catch (err) {
        console.error('Failed to load gallery', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [selectedCategory]);

  const CATEGORIES = [
    'All',
    'Campus',
    'Classrooms',
    'Laboratories',
    'Workshops',
    'Events',
    'Sports',
    'Library',
    'Cultural Activities'
  ];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIdx !== null && gallery.length > 0) {
      setLightboxIdx((lightboxIdx - 1 + gallery.length) % gallery.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIdx !== null && gallery.length > 0) {
      setLightboxIdx((lightboxIdx + 1) % gallery.length);
    }
  };

  const currentItem = lightboxIdx !== null ? gallery[lightboxIdx] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase">
            Campus Life in Pictures
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Institutional Photo &amp; Event Gallery
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 max-w-2xl">
            Explore glimpses of academic life, engineering laboratories, workshops, annual technical fests, and cultural activities.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
          <ImageIcon className="w-5 h-5 text-amber-400" />
          <span>High-Resolution Archives</span>
        </div>
      </div>

      {/* Category Tabs */}
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

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {gallery.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setLightboxIdx(idx)}
            className="group cursor-pointer rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden relative aspect-4/3"
          >
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-400">
                {item.category}
              </span>
              <h3 className="text-xs font-bold leading-snug line-clamp-2">
                {item.title}
              </h3>
              {item.date && (
                <span className="text-[10px] text-blue-200 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {item.date}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Full-Screen Lightbox Modal */}
      {currentItem && (
        <div
          onClick={() => setLightboxIdx(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in select-none"
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxIdx(null)}
            aria-label="Close Lightbox"
            className="absolute top-6 right-6 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous Photo"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            aria-label="Next Photo"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Center Image Container */}
          <div
            onClick={e => e.stopPropagation()}
            className="max-w-4xl w-full max-h-[85vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
          >
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[450px]">
              <img
                src={currentItem.image_url}
                alt={currentItem.title}
                className="max-h-[60vh] sm:max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="p-6 bg-slate-900 text-white space-y-1 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-amber-400">
                  {currentItem.category} • Photo {(lightboxIdx || 0) + 1} of {gallery.length}
                </span>
                {currentItem.date && (
                  <span className="text-xs text-slate-400">Date: {currentItem.date}</span>
                )}
              </div>
              <h2 className="text-base font-bold text-white">
                {currentItem.title}
              </h2>
              {currentItem.description && (
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {currentItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
