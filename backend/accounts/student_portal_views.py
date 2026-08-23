from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.permissions import IsStudentRole
from students.models import Student, StudentApplication
from students.serializers import StudentSerializer, StudentApplicationSerializer
from attendance.models import AttendanceRecord
from fees.models import FeeRecord, PaymentTransaction
from fees.serializers import FeeRecordSerializer
from examinations.models import StudentResult, SubjectMark
from examinations.serializers import StudentResultSerializer
from timetable.models import TimetableSlot
from timetable.serializers import TimetableSlotSerializer
from notices.models import NoticeItem
from notices.serializers import NoticeItemSerializer


def get_current_student(user):
    """
    Helper to securely find the Student record linked to the authenticated user.
    Uses roll_number or email from user token.
    """
    student = None
    if user.roll_number:
        student = Student.objects.filter(roll_number=user.roll_number).first()
    if not student and user.email:
        student = Student.objects.filter(email=user.email).first()
    if not student and user.username:
        student = Student.objects.filter(roll_number=user.username).first()
    return student


class StudentMyProfileView(APIView):
    """
    Returns the authenticated student's profile.
    Strict privacy: Student A cannot access Student B's data.
    """
    permission_classes = [permissions.IsAuthenticated, IsStudentRole]

    def get(self, request):
        student = get_current_student(request.user)
        if not student:
            return Response(
                {'detail': 'Student profile not found for this account.'},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(StudentSerializer(student).data)


class StudentMyAttendanceView(APIView):
    """
    Returns attendance logs and overall percentage for the logged in student ONLY.
    """
    permission_classes = [permissions.IsAuthenticated, IsStudentRole]

    def get(self, request):
        student = get_current_student(request.user)
        if not student:
            return Response(
                {'detail': 'Student profile not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        records = AttendanceRecord.objects.filter(student=student).select_related('session').order_by('-session__date')
        
        subject_stats = {}
        total_present = 0
        total_lectures = 0

        logs = []
        for r in records:
            subj = r.session.subject
            if subj not in subject_stats:
                subject_stats[subj] = {'present': 0, 'total': 0}
            subject_stats[subj]['total'] += 1
            total_lectures += 1

            if r.status == 'Present':
                subject_stats[subj]['present'] += 1
                total_present += 1

            logs.append({
                'id': r.id,
                'date': str(r.session.date),
                'subject': r.session.subject,
                'teacher': r.session.teacher_name,
                'status': r.status,
                'remarks': r.remarks or ''
            })

        subjects_summary = []
        for subj, counts in subject_stats.items():
            pct = round((counts['present'] / counts['total']) * 100, 1) if counts['total'] > 0 else 0
            subjects_summary.append({
                'subject': subj,
                'present': counts['present'],
                'total': counts['total'],
                'percentage': pct,
                'is_eligible': pct >= 75.0
            })

        overall_pct = round((total_present / total_lectures) * 100, 1) if total_lectures > 0 else student.attendance_percentage

        return Response({
            'student_name': student.full_name,
            'roll_number': student.roll_number,
            'branch': student.branch,
            'semester': student.semester,
            'overall_percentage': overall_pct,
            'is_exam_eligible': overall_pct >= 75.0,
            'total_lectures': total_lectures,
            'total_attended': total_present,
            'subject_wise': subjects_summary,
            'recent_logs': logs[:20]
        })


class StudentMyFeesView(APIView):
    """
    Returns fee balance, structure, and official receipts for the logged in student ONLY.
    """
    permission_classes = [permissions.IsAuthenticated, IsStudentRole]

    def get(self, request):
        student = get_current_student(request.user)
        if not student:
            return Response(
                {'detail': 'Student profile not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        fee_record = FeeRecord.objects.filter(student=student).first()
        if not fee_record:
            return Response({
                'student_name': student.full_name,
                'roll_number': student.roll_number,
                'total_fee': 12450.00,
                'paid_amount': 0.00,
                'pending_amount': 12450.00,
                'status': 'Pending',
                'transactions': []
            })

        return Response(FeeRecordSerializer(fee_record).data)


class StudentMyResultsView(APIView):
    """
    Returns BTEUP marksheets and results for the logged in student ONLY.
    """
    permission_classes = [permissions.IsAuthenticated, IsStudentRole]

    def get(self, request):
        student = get_current_student(request.user)
        if not student:
            return Response(
                {'detail': 'Student profile not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        results = StudentResult.objects.filter(student=student).prefetch_related('subjects')
        if not results.exists():
            return Response({
                'student_name': student.full_name,
                'roll_number': student.roll_number,
                'results': []
            })

        return Response({
            'student_name': student.full_name,
            'roll_number': student.roll_number,
            'enrollment_number': student.enrollment_number,
            'branch': student.branch,
            'semester': student.semester,
            'results': StudentResultSerializer(results, many=True).data
        })


class StudentMyTimetableView(APIView):
    """
    Returns the timetable for the logged in student's branch and semester.
    """
    permission_classes = [permissions.IsAuthenticated, IsStudentRole]

    def get(self, request):
        student = get_current_student(request.user)
        branch = student.branch if student else request.user.branch
        semester = student.semester if student else request.user.semester

        slots = TimetableSlot.objects.filter(branch=branch, semester=semester)
        return Response({
            'branch': branch,
            'semester': semester,
            'slots': TimetableSlotSerializer(slots, many=True).data
        })


class StudentMyApplicationsView(APIView):
    """
    Handles Student Online Application submission and history tracking.
    Strictly attaches authenticated student's identity.
    """
    permission_classes = [permissions.IsAuthenticated, IsStudentRole]

    def get(self, request):
        student = get_current_student(request.user)
        if not student:
            return Response([], status=status.HTTP_200_OK)
        applications = StudentApplication.objects.filter(student=student)
        return Response(StudentApplicationSerializer(applications, many=True).data)

    def post(self, request):
        student = get_current_student(request.user)
        if not student:
            return Response(
                {'detail': 'Student profile not found for this account.'},
                status=status.HTTP_404_NOT_FOUND
            )

        subject = request.data.get('subject', '').strip()
        category = request.data.get('category', 'Personal Information Correction')
        description = request.data.get('description', '').strip()
        attachment_url = request.data.get('attachment_url', '')

        if not subject or not description:
            return Response(
                {'detail': 'Subject and Description are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        app_obj = StudentApplication.objects.create(
            student=student,
            subject=subject,
            category=category,
            description=description,
            attachment_url=attachment_url,
            status='Submitted'
        )

        return Response(StudentApplicationSerializer(app_obj).data, status=status.HTTP_201_CREATED)
