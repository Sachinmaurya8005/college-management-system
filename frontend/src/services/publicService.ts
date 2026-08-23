import { apiClient } from './api';
import {
  PublicHomePayload,
  AboutCollegeData,
  CollegeLocationData,
  Facility,
  GalleryItem,
  ImportantLink,
  PublicFeeStructure,
  Course,
  NoticeItem,
  ExamSchedule,
  TimetableSlot
} from '../types';

export const publicService = {
  getHomeOverview: async (): Promise<PublicHomePayload> => {
    const res = await apiClient.get<PublicHomePayload>('/public/home/');
    return res.data;
  },

  getAboutCollege: async (): Promise<AboutCollegeData> => {
    const res = await apiClient.get<AboutCollegeData>('/public/about/');
    return res.data;
  },

  getCollegeLocation: async (): Promise<CollegeLocationData> => {
    const res = await apiClient.get<CollegeLocationData>('/public/location/');
    return res.data;
  },

  getFacilities: async (category?: string): Promise<Facility[]> => {
    const params = category && category !== 'All' ? { category } : {};
    const res = await apiClient.get<Facility[]>('/public/facilities/', { params });
    return res.data;
  },

  getGallery: async (category?: string): Promise<GalleryItem[]> => {
    const params = category && category !== 'All' ? { category } : {};
    const res = await apiClient.get<GalleryItem[]>('/public/gallery/', { params });
    return res.data;
  },

  getImportantLinks: async (): Promise<ImportantLink[]> => {
    const res = await apiClient.get<ImportantLink[]>('/public/links/');
    return res.data;
  },

  getPublicFees: async (): Promise<PublicFeeStructure[]> => {
    const res = await apiClient.get<PublicFeeStructure[]>('/public/fees/');
    return res.data;
  },

  getPublicCourses: async (): Promise<Course[]> => {
    const res = await apiClient.get<Course[]>('/public/courses/');
    return res.data;
  },

  getPublicFaculty: async (department?: string): Promise<any[]> => {
    const params = department && department !== 'All' ? { department } : {};
    const res = await apiClient.get<any[]>('/public/faculty/', { params });
    return res.data;
  },

  getPublicNotices: async (category?: string): Promise<NoticeItem[]> => {
    const params = category && category !== 'All' ? { category } : {};
    const res = await apiClient.get<NoticeItem[]>('/public/notices/', { params });
    return res.data;
  },

  getPublicExamSchedules: async (): Promise<ExamSchedule[]> => {
    const res = await apiClient.get<ExamSchedule[]>('/public/examinations/');
    return res.data;
  },

  getPublicTimetable: async (params?: { branch?: string; semester?: number; day?: string }): Promise<TimetableSlot[]> => {
    const res = await apiClient.get<TimetableSlot[]>('/public/timetable/', { params });
    return res.data;
  }
};
