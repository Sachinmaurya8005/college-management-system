from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AttendanceSession, AttendanceRecord
from .serializers import AttendanceSessionSerializer
from students.models import Student

class AttendanceSessionViewSet(viewsets.ModelViewSet):
    queryset = AttendanceSession.objects.all()
    serializer_class = AttendanceSessionSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        branch = self.request.query_params.get('branch')
        semester = self.request.query_params.get('semester')
        date_param = self.request.query_params.get('date')

        if branch and branch != 'All':
            qs = qs.filter(branch__icontains=branch)
        if semester and semester != 'All':
            qs = qs.filter(semester=semester)
        if date_param:
            qs = qs.filter(date=date_param)
        return qs

    @action(detail=False, methods=['post'], url_path='mark')
    def mark_attendance(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            session = serializer.save()

            # Update student attendance percentages
            records_data = request.data.get('records', [])
            for r in records_data:
                r_roll = r.get('rollNo') or r.get('roll_number')
                r_status = r.get('status', 'present')
                if r_roll:
                    try:
                        std = Student.objects.get(roll_number=r_roll)
                        cur_att = std.attendance_percentage
                        if r_status == 'present':
                            std.attendance_percentage = min(100.0, cur_att + 1.0)
                        else:
                            std.attendance_percentage = max(30.0, cur_att - 2.0)
                        std.save()
                    except Student.DoesNotExist:
                        pass

            return Response(AttendanceSessionSerializer(session).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
