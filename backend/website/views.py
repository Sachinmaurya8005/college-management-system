import os
import uuid
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from accounts.permissions import IsAdminRole, IsAdminOrTeacher
from .models import (
    Facility,
    FacilityPhoto,
    GalleryItem,
    ImportantLink,
    PublicFeeStructure,
    AboutCollege,
    CollegeLocation
)
from .serializers import (
    FacilitySerializer,
    FacilityPhotoSerializer,
    GalleryItemSerializer,
    ImportantLinkSerializer,
    PublicFeeStructureSerializer,
    AboutCollegeSerializer,
    CollegeLocationSerializer
)
from courses.models import Course
from courses.serializers import CourseSerializer
from teachers.models import Teacher
from teachers.serializers import TeacherSerializer
from notices.models import NoticeItem
from notices.serializers import NoticeItemSerializer
from examinations.models import ExamSchedule
from examinations.serializers import ExamScheduleSerializer
from timetable.models import TimetableSlot
from timetable.serializers import TimetableSlotSerializer


# -------------------------------------------------------------
# 1. PUBLIC READ-ONLY APIS (NO AUTHENTICATION REQUIRED)
# -------------------------------------------------------------

class PublicHomeOverviewView(APIView):
    """
    Public aggregated homepage payload:
    Announcements, branch previews, facility previews, gallery highlights, exam alerts, links
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        about = AboutCollege.objects.first()
        location = CollegeLocation.objects.first()
        notices = NoticeItem.objects.all()[:5]
        courses = Course.objects.all()[:6]
        facilities = Facility.objects.filter(status='Published')[:4]
        gallery = GalleryItem.objects.filter(status='Published')[:6]
        exams = ExamSchedule.objects.all()[:4]
        links = ImportantLink.objects.filter(is_active=True)[:8]
        public_fees = PublicFeeStructure.objects.filter(is_published=True)

        return Response({
            'college_name': about.college_name if about else 'Government Polytechnic Bansdeeh, Ballia',
            'bteup_code': about.bteup_code if about else '4412',
            'aicte_approval': about.aicte_approval if about else 'Approved by AICTE, New Delhi',
            'principal_name': about.principal_name if about else 'Er. R. C. Srivastava',
            'principal_message': about.principal_message if about else '',
            'principal_photo': about.principal_photo if about else '',
            'history_snippet': (about.history[:200] + '...') if about and about.history else '',
            'location': CollegeLocationSerializer(location).data if location else None,
            'latest_notices': NoticeItemSerializer(notices, many=True).data,
            'courses': CourseSerializer(courses, many=True).data,
            'featured_facilities': FacilitySerializer(facilities, many=True).data,
            'gallery_preview': GalleryItemSerializer(gallery, many=True).data,
            'upcoming_exams': ExamScheduleSerializer(exams, many=True).data,
            'important_links': ImportantLinkSerializer(links, many=True).data,
            'public_fees': PublicFeeStructureSerializer(public_fees, many=True).data,
        })


class PublicAboutCollegeView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        about = AboutCollege.objects.first()
        if not about:
            about = AboutCollege.objects.create()
        return Response(AboutCollegeSerializer(about).data)


class PublicCollegeLocationView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        location = CollegeLocation.objects.first()
        if not location:
            location = CollegeLocation.objects.create()
        return Response(CollegeLocationSerializer(location).data)


class PublicFacilityViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = FacilitySerializer

    def get_queryset(self):
        qs = Facility.objects.filter(status='Published')
        category = self.request.query_params.get('category')
        if category and category != 'All':
            qs = qs.filter(category=category)
        return qs


class PublicGalleryViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = GalleryItemSerializer

    def get_queryset(self):
        qs = GalleryItem.objects.filter(status='Published')
        category = self.request.query_params.get('category')
        if category and category != 'All':
            qs = qs.filter(category=category)
        return qs


class PublicImportantLinkViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = ImportantLinkSerializer

    def get_queryset(self):
        return ImportantLink.objects.filter(is_active=True)


class PublicFeeStructureViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = PublicFeeStructureSerializer

    def get_queryset(self):
        return PublicFeeStructure.objects.filter(is_published=True)


class PublicCourseViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = CourseSerializer
    queryset = Course.objects.all()


class PublicFacultyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public faculty directory: Only public-approved fields are exposed.
    No private mobile or personal address is returned to public visitors.
    """
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        teachers = Teacher.objects.filter(status='Active')
        dept = request.query_params.get('department')
        if dept and dept != 'All':
            teachers = teachers.filter(department=dept)

        data = []
        for t in teachers:
            data.append({
                'id': t.id,
                'name': t.full_name,
                'department': t.department,
                'designation': t.designation,
                'qualification': t.qualification,
                'photo_url': t.photo_url,
                'subjects': t.subjects,
                'experience_years': t.experience_years,
                'public_email': t.email if getattr(t, 'email', None) else '',
            })
        return Response(data)


class PublicNoticeViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = NoticeItemSerializer

    def get_queryset(self):
        qs = NoticeItem.objects.all()
        category = self.request.query_params.get('category')
        if category and category != 'All':
            qs = qs.filter(category=category)
        return qs


class PublicExamScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = ExamScheduleSerializer
    queryset = ExamSchedule.objects.all()


class PublicTimetableViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = TimetableSlotSerializer

    def get_queryset(self):
        qs = TimetableSlot.objects.all()
        branch = self.request.query_params.get('branch')
        semester = self.request.query_params.get('semester')
        day = self.request.query_params.get('day')
        if branch:
            qs = qs.filter(branch=branch)
        if semester:
            qs = qs.filter(semester=semester)
        if day and day != 'All':
            qs = qs.filter(day=day)
        return qs


# -------------------------------------------------------------
# 2. ADMIN WEBSITE CONTENT MANAGEMENT APIS (AUTH REQUIRED)
# -------------------------------------------------------------

class AdminFacilityViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrTeacher]
    serializer_class = FacilitySerializer
    queryset = Facility.objects.all()


class AdminGalleryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrTeacher]
    serializer_class = GalleryItemSerializer
    queryset = GalleryItem.objects.all()


class AdminImportantLinkViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminRole]
    serializer_class = ImportantLinkSerializer
    queryset = ImportantLink.objects.all()


class AdminPublicFeeStructureViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminRole]
    serializer_class = PublicFeeStructureSerializer
    queryset = PublicFeeStructure.objects.all()


class AdminAboutCollegeView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        about = AboutCollege.objects.first()
        if not about:
            about = AboutCollege.objects.create()
        return Response(AboutCollegeSerializer(about).data)

    def patch(self, request):
        about = AboutCollege.objects.first()
        if not about:
            about = AboutCollege.objects.create()
        serializer = AboutCollegeSerializer(about, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminCollegeLocationView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        loc = CollegeLocation.objects.first()
        if not loc:
            loc = CollegeLocation.objects.create()
        return Response(CollegeLocationSerializer(loc).data)

    def patch(self, request):
        loc = CollegeLocation.objects.first()
        if not loc:
            loc = CollegeLocation.objects.create()
        serializer = CollegeLocationSerializer(loc, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------------------------------------
# 3. SECURE MEDIA UPLOAD API
# -------------------------------------------------------------

class MediaUploadView(APIView):
    """
    Secure file and photo upload handler.
    Validates file format, restricts size to 5MB, generates uuid safe names,
    saves in Django media storage, and returns the accessible URL.
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

    def post(self, request):
        file_obj = request.FILES.get('file') or request.FILES.get('image')
        if not file_obj:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate file size
        if file_obj.size > self.MAX_FILE_SIZE:
            return Response({'error': 'File size exceeds maximum limit of 5MB'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate content type
        content_type = getattr(file_obj, 'content_type', '')
        if content_type not in self.ALLOWED_IMAGE_TYPES and not file_obj.name.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg')):
            return Response({'error': 'Invalid file format. Only JPEG, PNG, WebP, GIF, and SVG images are allowed.'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate unique filename
        ext = os.path.splitext(file_obj.name)[1].lower()
        if not ext:
            ext = '.jpg'
        unique_filename = f"uploads/{uuid.uuid4().hex}{ext}"

        # Save using default storage
        file_path = default_storage.save(unique_filename, file_obj)
        media_url = f"{settings.MEDIA_URL}{file_path}"
        absolute_url = request.build_absolute_uri(media_url)

        return Response({
            'success': True,
            'file_name': file_obj.name,
            'url': absolute_url,
            'relative_url': media_url,
            'size': file_obj.size
        }, status=status.HTTP_201_CREATED)
