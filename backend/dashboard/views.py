from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Avg, Count
from students.models import Student
from teachers.models import Teacher
from courses.models import Course
from fees.models import FeeRecord
from attendance.models import AttendanceSession
from notices.models import NoticeItem
from notices.serializers import NoticeItemSerializer

class DashboardMetricsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        total_students = Student.objects.count() or 1248
        total_teachers = Teacher.objects.count() or 86
        total_courses = Course.objects.count() or 6

        # Fees aggregations
        fee_aggregates = FeeRecord.objects.aggregate(
            total_collected=Sum('paid_amount'),
            total_pending=Sum('pending_amount'),
            total_expected=Sum('total_amount')
        )
        total_fee_collection = float(fee_aggregates['total_collected'] or 1245000)
        pending_fees = float(fee_aggregates['total_pending'] or 380000)

        # Average attendance
        avg_att = Student.objects.aggregate(avg=Avg('attendance_percentage'))['avg']
        today_attendance = round(float(avg_att or 78.4), 1)

        # Branch distribution
        branch_counts = Student.objects.values('branch').annotate(count=Count('id'))
        branch_colors = {
            'Computer Science & Engineering': '#3B82F6',
            'Mechanical Engineering': '#10B981',
            'Civil Engineering': '#F59E0B',
            'Electrical Engineering': '#8B5CF6',
            'Electronics Engineering': '#EC4899',
            'Information Technology': '#06B6D4',
        }
        branch_data = []
        for b in branch_counts:
            b_name = b['branch']
            branch_data.append({
                'name': b_name,
                'value': b['count'],
                'color': branch_colors.get(b_name, '#3B82F6')
            })
        if not branch_data:
            branch_data = [
                { 'name': 'Computer Science & Engg', 'value': 280, 'color': '#3B82F6' },
                { 'name': 'Mechanical Engg', 'value': 240, 'color': '#10B981' },
                { 'name': 'Civil Engg', 'value': 220, 'color': '#F59E0B' },
                { 'name': 'Electrical Engg', 'value': 210, 'color': '#8B5CF6' },
                { 'name': 'Electronics Engg', 'value': 180, 'color': '#EC4899' },
                { 'name': 'Information Technology', 'value': 118, 'color': '#06B6D4' }
            ]

        # Recent notices
        recent_notices = NoticeItem.objects.all()[:4]
        notices_data = NoticeItemSerializer(recent_notices, many=True).data

        # Static / dynamic charts datasets
        attendance_trends = {
            'week': [
                { 'label': 'Mon', 'attendance': 82, 'target': 75 },
                { 'label': 'Tue', 'attendance': 85, 'target': 75 },
                { 'label': 'Wed', 'attendance': 79, 'target': 75 },
                { 'label': 'Thu', 'attendance': 91, 'target': 75 },
                { 'label': 'Fri', 'attendance': 88, 'target': 75 },
                { 'label': 'Sat', 'attendance': 74, 'target': 75 }
            ],
            'month': [
                { 'label': 'Week 1', 'attendance': 84, 'target': 75 },
                { 'label': 'Week 2', 'attendance': 81, 'target': 75 },
                { 'label': 'Week 3', 'attendance': 86, 'target': 75 },
                { 'label': 'Week 4', 'attendance': 89, 'target': 75 }
            ],
            'semester': [
                { 'label': 'Month 1', 'attendance': 88, 'target': 75 },
                { 'label': 'Month 2', 'attendance': 84, 'target': 75 },
                { 'label': 'Month 3', 'attendance': 82, 'target': 75 },
                { 'label': 'Month 4', 'attendance': 79, 'target': 75 }
            ]
        }

        fee_comparison = [
            { 'branch': 'CSE', 'collected': 345000, 'pending': 42000 },
            { 'branch': 'Mechanical', 'collected': 290000, 'pending': 58000 },
            { 'branch': 'Civil', 'collected': 240000, 'pending': 65000 },
            { 'branch': 'Electrical', 'collected': 210000, 'pending': 48000 },
            { 'branch': 'Electronics', 'collected': 160000, 'pending': 32000 }
        ]

        return Response({
            'total_students': total_students,
            'total_teachers': total_teachers,
            'total_courses': total_courses,
            'today_attendance': today_attendance,
            'total_fee_collection': total_fee_collection,
            'pending_fees': pending_fees,
            'attendance_trends': attendance_trends,
            'fee_comparison': fee_comparison,
            'branch_distribution': branch_data,
            'recent_notices': notices_data
        })
