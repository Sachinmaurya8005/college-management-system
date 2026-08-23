import { apiClient } from './api';
import {
  Facility,
  GalleryItem,
  ImportantLink,
  PublicFeeStructure,
  AboutCollegeData,
  CollegeLocationData
} from '../types';

export const websiteContentService = {
  // Facilities Management
  getFacilities: async (): Promise<Facility[]> => {
    const res = await apiClient.get<Facility[]>('/admin/website/facilities/');
    return res.data;
  },

  createFacility: async (data: Partial<Facility> & { uploaded_photos?: any[] }): Promise<Facility> => {
    const res = await apiClient.post<Facility>('/admin/website/facilities/', data);
    return res.data;
  },

  updateFacility: async (id: number, data: Partial<Facility> & { uploaded_photos?: any[] }): Promise<Facility> => {
    const res = await apiClient.patch<Facility>(`/admin/website/facilities/${id}/`, data);
    return res.data;
  },

  deleteFacility: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/website/facilities/${id}/`);
  },

  // Gallery Management
  getGallery: async (): Promise<GalleryItem[]> => {
    const res = await apiClient.get<GalleryItem[]>('/admin/website/gallery/');
    return res.data;
  },

  createGalleryItem: async (data: Partial<GalleryItem>): Promise<GalleryItem> => {
    const res = await apiClient.post<GalleryItem>('/admin/website/gallery/', data);
    return res.data;
  },

  updateGalleryItem: async (id: number, data: Partial<GalleryItem>): Promise<GalleryItem> => {
    const res = await apiClient.patch<GalleryItem>(`/admin/website/gallery/${id}/`, data);
    return res.data;
  },

  deleteGalleryItem: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/website/gallery/${id}/`);
  },

  // Important Links Management
  getLinks: async (): Promise<ImportantLink[]> => {
    const res = await apiClient.get<ImportantLink[]>('/admin/website/links/');
    return res.data;
  },

  createLink: async (data: Partial<ImportantLink>): Promise<ImportantLink> => {
    const res = await apiClient.post<ImportantLink>('/admin/website/links/', data);
    return res.data;
  },

  updateLink: async (id: number, data: Partial<ImportantLink>): Promise<ImportantLink> => {
    const res = await apiClient.patch<ImportantLink>(`/admin/website/links/${id}/`, data);
    return res.data;
  },

  deleteLink: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/website/links/${id}/`);
  },

  // Public Fee Structure Management
  getPublicFees: async (): Promise<PublicFeeStructure[]> => {
    const res = await apiClient.get<PublicFeeStructure[]>('/admin/website/fees/');
    return res.data;
  },

  createPublicFee: async (data: Partial<PublicFeeStructure>): Promise<PublicFeeStructure> => {
    const res = await apiClient.post<PublicFeeStructure>('/admin/website/fees/', data);
    return res.data;
  },

  updatePublicFee: async (id: number, data: Partial<PublicFeeStructure>): Promise<PublicFeeStructure> => {
    const res = await apiClient.patch<PublicFeeStructure>(`/admin/website/fees/${id}/`, data);
    return res.data;
  },

  deletePublicFee: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/website/fees/${id}/`);
  },

  // About College Management
  getAboutCollege: async (): Promise<AboutCollegeData> => {
    const res = await apiClient.get<AboutCollegeData>('/admin/website/about/');
    return res.data;
  },

  updateAboutCollege: async (data: Partial<AboutCollegeData>): Promise<AboutCollegeData> => {
    const res = await apiClient.patch<AboutCollegeData>('/admin/website/about/', data);
    return res.data;
  },

  // College Location Management
  getLocation: async (): Promise<CollegeLocationData> => {
    const res = await apiClient.get<CollegeLocationData>('/admin/website/location/');
    return res.data;
  },

  updateLocation: async (data: Partial<CollegeLocationData>): Promise<CollegeLocationData> => {
    const res = await apiClient.patch<CollegeLocationData>('/admin/website/location/', data);
    return res.data;
  },

  // Secure Media Upload
  uploadMedia: async (file: File): Promise<{ success: boolean; url: string; file_name: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<{ success: boolean; url: string; file_name: string }>('/media/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }
};
