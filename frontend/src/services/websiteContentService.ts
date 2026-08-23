import { apiClient } from './api';
import {
  Facility,
  GalleryItem,
  ImportantLink,
  PublicFeeStructure,
  AboutCollegeData,
  CollegeLocationData
} from '../types';
import {
  DEFAULT_FACILITIES,
  DEFAULT_GALLERY,
  DEFAULT_LINKS,
  DEFAULT_FEES,
  DEFAULT_ABOUT,
  DEFAULT_LOCATION
} from './publicService';

function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`gpb_public_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) return parsed;
    }
  } catch (e) {}
  return fallback;
}

function setStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`gpb_public_${key}`, JSON.stringify(data));
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('gpb_realtime_broadcast_channel');
      bc.postMessage({ type: 'PUBLIC_CONTENT_UPDATED', key });
      bc.close();
    }
  } catch (e) {}
}

export const websiteContentService = {
  // -------------------------------------------------------------
  // 1. Facilities Management
  // -------------------------------------------------------------
  getFacilities: async (): Promise<Facility[]> => {
    try {
      const res = await apiClient.get<Facility[]>('/admin/website/facilities/');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setStorage('facilities', res.data);
        return res.data;
      }
    } catch (e) {}
    return getStorage<Facility[]>('facilities', DEFAULT_FACILITIES);
  },

  createFacility: async (data: Partial<Facility>): Promise<Facility> => {
    const items = getStorage<Facility[]>('facilities', DEFAULT_FACILITIES);
    const newFacility: Facility = {
      id: Date.now(),
      title: data.title || 'New Facility Lab',
      category: data.category || 'Laboratories',
      cover_image: data.cover_image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&fit=crop',
      short_description: data.short_description || '',
      detailed_notes: data.detailed_notes || '',
      equipment_list: Array.isArray(data.equipment_list) ? data.equipment_list : [],
      display_order: Number(data.display_order) || items.length + 1,
      status: data.status || 'Published'
    };
    const updated = [newFacility, ...items];
    setStorage('facilities', updated);

    try {
      await apiClient.post('/admin/website/facilities/', newFacility);
    } catch (e) {}

    return newFacility;
  },

  updateFacility: async (id: number, data: Partial<Facility>): Promise<Facility> => {
    const items = getStorage<Facility[]>('facilities', DEFAULT_FACILITIES);
    const index = items.findIndex(f => f.id === id);
    let updatedFacility: Facility = { ...items[index], ...data };
    if (index !== -1) {
      items[index] = updatedFacility;
    } else {
      items.unshift(updatedFacility);
    }
    setStorage('facilities', items);

    try {
      await apiClient.patch(`/admin/website/facilities/${id}/`, data);
    } catch (e) {}

    return updatedFacility;
  },

  deleteFacility: async (id: number): Promise<void> => {
    const items = getStorage<Facility[]>('facilities', DEFAULT_FACILITIES);
    const filtered = items.filter(f => f.id !== id);
    setStorage('facilities', filtered);

    try {
      await apiClient.delete(`/admin/website/facilities/${id}/`);
    } catch (e) {}
  },

  // -------------------------------------------------------------
  // 2. Gallery Management
  // -------------------------------------------------------------
  getGallery: async (): Promise<GalleryItem[]> => {
    try {
      const res = await apiClient.get<GalleryItem[]>('/admin/website/gallery/');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setStorage('gallery', res.data);
        return res.data;
      }
    } catch (e) {}
    return getStorage<GalleryItem[]>('gallery', DEFAULT_GALLERY);
  },

  createGalleryItem: async (data: Partial<GalleryItem>): Promise<GalleryItem> => {
    const items = getStorage<GalleryItem[]>('gallery', DEFAULT_GALLERY);
    const newItem: GalleryItem = {
      id: Date.now(),
      title: data.title || 'Campus Event Photo',
      description: data.description || '',
      image_url: data.image_url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop',
      category: data.category || 'Campus',
      date: data.date || new Date().toISOString().split('T')[0],
      status: data.status || 'Published'
    };
    const updated = [newItem, ...items];
    setStorage('gallery', updated);

    try {
      await apiClient.post('/admin/website/gallery/', newItem);
    } catch (e) {}

    return newItem;
  },

  updateGalleryItem: async (id: number, data: Partial<GalleryItem>): Promise<GalleryItem> => {
    const items = getStorage<GalleryItem[]>('gallery', DEFAULT_GALLERY);
    const index = items.findIndex(g => g.id === id);
    let updatedItem: GalleryItem = { ...items[index], ...data };
    if (index !== -1) {
      items[index] = updatedItem;
    } else {
      items.unshift(updatedItem);
    }
    setStorage('gallery', items);

    try {
      await apiClient.patch(`/admin/website/gallery/${id}/`, data);
    } catch (e) {}

    return updatedItem;
  },

  deleteGalleryItem: async (id: number): Promise<void> => {
    const items = getStorage<GalleryItem[]>('gallery', DEFAULT_GALLERY);
    const filtered = items.filter(g => g.id !== id);
    setStorage('gallery', filtered);

    try {
      await apiClient.delete(`/admin/website/gallery/${id}/`);
    } catch (e) {}
  },

  // -------------------------------------------------------------
  // 3. Important Links Management
  // -------------------------------------------------------------
  getLinks: async (): Promise<ImportantLink[]> => {
    try {
      const res = await apiClient.get<ImportantLink[]>('/admin/website/links/');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setStorage('links', res.data);
        return res.data;
      }
    } catch (e) {}
    return getStorage<ImportantLink[]>('links', DEFAULT_LINKS);
  },

  createLink: async (data: Partial<ImportantLink>): Promise<ImportantLink> => {
    const items = getStorage<ImportantLink[]>('links', DEFAULT_LINKS);
    const newLink: ImportantLink = {
      id: Date.now(),
      title: data.title || 'Official Portal Link',
      description: data.description || '',
      url: data.url || 'https://',
      category: data.category || 'Official Resources',
      is_active: data.is_active !== undefined ? data.is_active : true,
      display_order: Number(data.display_order) || items.length + 1
    };
    const updated = [newLink, ...items];
    setStorage('links', updated);

    try {
      await apiClient.post('/admin/website/links/', newLink);
    } catch (e) {}

    return newLink;
  },

  updateLink: async (id: number, data: Partial<ImportantLink>): Promise<ImportantLink> => {
    const items = getStorage<ImportantLink[]>('links', DEFAULT_LINKS);
    const index = items.findIndex(l => l.id === id);
    let updatedLink: ImportantLink = { ...items[index], ...data };
    if (index !== -1) {
      items[index] = updatedLink;
    } else {
      items.unshift(updatedLink);
    }
    setStorage('links', items);

    try {
      await apiClient.patch(`/admin/website/links/${id}/`, data);
    } catch (e) {}

    return updatedLink;
  },

  deleteLink: async (id: number): Promise<void> => {
    const items = getStorage<ImportantLink[]>('links', DEFAULT_LINKS);
    const filtered = items.filter(l => l.id !== id);
    setStorage('links', filtered);

    try {
      await apiClient.delete(`/admin/website/links/${id}/`);
    } catch (e) {}
  },

  // -------------------------------------------------------------
  // 4. Public Fee Structure Management
  // -------------------------------------------------------------
  getPublicFees: async (): Promise<PublicFeeStructure[]> => {
    try {
      const res = await apiClient.get<PublicFeeStructure[]>('/admin/website/fees/');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setStorage('fees', res.data);
        return res.data;
      }
    } catch (e) {}
    return getStorage<PublicFeeStructure[]>('fees', DEFAULT_FEES);
  },

  createPublicFee: async (data: Partial<PublicFeeStructure>): Promise<PublicFeeStructure> => {
    const items = getStorage<PublicFeeStructure[]>('fees', DEFAULT_FEES);
    const newFee: PublicFeeStructure = {
      id: Date.now(),
      branch: data.branch || 'All Diploma Branches',
      academic_year: data.academic_year || '2025-2026',
      fee_type: data.fee_type || 'Annual Institutional Fee',
      amount: Number(data.amount) || 10000,
      notes: data.notes || '',
      is_published: data.is_published !== undefined ? data.is_published : true,
      display_order: Number(data.display_order) || items.length + 1
    };
    const updated = [newFee, ...items];
    setStorage('fees', updated);

    try {
      await apiClient.post('/admin/website/fees/', newFee);
    } catch (e) {}

    return newFee;
  },

  updatePublicFee: async (id: number, data: Partial<PublicFeeStructure>): Promise<PublicFeeStructure> => {
    const items = getStorage<PublicFeeStructure[]>('fees', DEFAULT_FEES);
    const index = items.findIndex(f => f.id === id);
    let updatedFee: PublicFeeStructure = { ...items[index], ...data };
    if (index !== -1) {
      items[index] = updatedFee;
    } else {
      items.unshift(updatedFee);
    }
    setStorage('fees', items);

    try {
      await apiClient.patch(`/admin/website/fees/${id}/`, data);
    } catch (e) {}

    return updatedFee;
  },

  deletePublicFee: async (id: number): Promise<void> => {
    const items = getStorage<PublicFeeStructure[]>('fees', DEFAULT_FEES);
    const filtered = items.filter(f => f.id !== id);
    setStorage('fees', filtered);

    try {
      await apiClient.delete(`/admin/website/fees/${id}/`);
    } catch (e) {}
  },

  // -------------------------------------------------------------
  // 5. About College Management
  // -------------------------------------------------------------
  getAboutCollege: async (): Promise<AboutCollegeData> => {
    try {
      const res = await apiClient.get<AboutCollegeData>('/admin/website/about/');
      if (res.data && res.data.college_name) {
        setStorage('about', res.data);
        return res.data;
      }
    } catch (e) {}
    return getStorage<AboutCollegeData>('about', DEFAULT_ABOUT);
  },

  updateAboutCollege: async (data: Partial<AboutCollegeData>): Promise<AboutCollegeData> => {
    const current = getStorage<AboutCollegeData>('about', DEFAULT_ABOUT);
    const updated = { ...current, ...data };
    setStorage('about', updated);

    try {
      await apiClient.patch('/admin/website/about/', data);
    } catch (e) {}

    return updated;
  },

  // -------------------------------------------------------------
  // 6. College Location Management
  // -------------------------------------------------------------
  getLocation: async (): Promise<CollegeLocationData> => {
    try {
      const res = await apiClient.get<CollegeLocationData>('/admin/website/location/');
      if (res.data && res.data.address) {
        setStorage('location', res.data);
        return res.data;
      }
    } catch (e) {}
    return getStorage<CollegeLocationData>('location', DEFAULT_LOCATION);
  },

  updateLocation: async (data: Partial<CollegeLocationData>): Promise<CollegeLocationData> => {
    const current = getStorage<CollegeLocationData>('location', DEFAULT_LOCATION);
    const updated = { ...current, ...data };
    setStorage('location', updated);

    try {
      await apiClient.patch('/admin/website/location/', data);
    } catch (e) {}

    return updated;
  },

  // -------------------------------------------------------------
  // 7. Secure Media Upload
  // -------------------------------------------------------------
  uploadMedia: async (file: File): Promise<{ success: boolean; url: string; file_name: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.post<{ success: boolean; url: string; file_name: string }>('/media/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (e) {
      // Local object URL fallback
      const objectUrl = URL.createObjectURL(file);
      return {
        success: true,
        url: objectUrl,
        file_name: file.name
      };
    }
  }
};
