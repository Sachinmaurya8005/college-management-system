from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    PublicHomeOverviewView,
    PublicAboutCollegeView,
    PublicCollegeLocationView,
    PublicFacilityViewSet,
    PublicGalleryViewSet,
    PublicImportantLinkViewSet,
    PublicFeeStructureViewSet,
    PublicCourseViewSet,
    PublicFacultyViewSet,
    PublicNoticeViewSet,
    PublicExamScheduleViewSet,
    PublicTimetableViewSet,
    AdminFacilityViewSet,
    AdminGalleryViewSet,
    AdminImportantLinkViewSet,
    AdminPublicFeeStructureViewSet,
    AdminAboutCollegeView,
    AdminCollegeLocationView,
    MediaUploadView
)
from accounts.student_portal_views import (
    StudentMyProfileView,
    StudentMyAttendanceView,
    StudentMyFeesView,
    StudentMyResultsView,
    StudentMyTimetableView,
    StudentMyApplicationsView
)

public_router = DefaultRouter()
public_router.register(r'facilities', PublicFacilityViewSet, basename='public-facilities')
public_router.register(r'gallery', PublicGalleryViewSet, basename='public-gallery')
public_router.register(r'links', PublicImportantLinkViewSet, basename='public-links')
public_router.register(r'fees', PublicFeeStructureViewSet, basename='public-fees')
public_router.register(r'courses', PublicCourseViewSet, basename='public-courses')
public_router.register(r'faculty', PublicFacultyViewSet, basename='public-faculty')
public_router.register(r'notices', PublicNoticeViewSet, basename='public-notices')
public_router.register(r'examinations', PublicExamScheduleViewSet, basename='public-examinations')
public_router.register(r'timetable', PublicTimetableViewSet, basename='public-timetable')

admin_router = DefaultRouter()
admin_router.register(r'facilities', AdminFacilityViewSet, basename='admin-facilities')
admin_router.register(r'gallery', AdminGalleryViewSet, basename='admin-gallery')
admin_router.register(r'links', AdminImportantLinkViewSet, basename='admin-links')
admin_router.register(r'fees', AdminPublicFeeStructureViewSet, basename='admin-fees')

urlpatterns = [
    # 1. Public Endpoints
    path('public/home/', PublicHomeOverviewView.as_view(), name='public-home'),
    path('public/about/', PublicAboutCollegeView.as_view(), name='public-about'),
    path('public/location/', PublicCollegeLocationView.as_view(), name='public-location'),
    path('public/', include(public_router.urls)),

    # 2. Admin Website Content Management Endpoints
    path('admin/website/about/', AdminAboutCollegeView.as_view(), name='admin-website-about'),
    path('admin/website/location/', AdminCollegeLocationView.as_view(), name='admin-website-location'),
    path('admin/website/', include(admin_router.urls)),

    # 3. Secure Media Upload
    path('media/upload/', MediaUploadView.as_view(), name='media-upload'),

    # 4. Student Self-Service Portal (Strict Privacy)
    path('student-portal/my-profile/', StudentMyProfileView.as_view(), name='student-my-profile'),
    path('student-portal/my-attendance/', StudentMyAttendanceView.as_view(), name='student-my-attendance'),
    path('student-portal/my-fees/', StudentMyFeesView.as_view(), name='student-my-fees'),
    path('student-portal/my-results/', StudentMyResultsView.as_view(), name='student-my-results'),
    path('student-portal/my-timetable/', StudentMyTimetableView.as_view(), name='student-my-timetable'),
    path('student-portal/my-applications/', StudentMyApplicationsView.as_view(), name='student-my-applications'),
]
