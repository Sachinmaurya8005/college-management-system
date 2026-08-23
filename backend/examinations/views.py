from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ExamSchedule, StudentResult
from .serializers import ExamScheduleSerializer, StudentResultSerializer

class ExamScheduleViewSet(viewsets.ModelViewSet):
    queryset = ExamSchedule.objects.all()
    serializer_class = ExamScheduleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        branch = self.request.query_params.get('branch')
        semester = self.request.query_params.get('semester')

        if branch and branch != 'All':
            qs = qs.filter(branch__icontains=branch)
        if semester and semester != 'All':
            qs = qs.filter(semester=semester)
        return qs

class StudentResultViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StudentResult.objects.all()
    serializer_class = StudentResultSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        roll_no = self.request.query_params.get('rollNo') or self.request.query_params.get('roll_number')
        if roll_no:
            qs = qs.filter(roll_number=roll_no)
        return qs

    @action(detail=True, methods=['get'], url_path='marksheet')
    def get_marksheet(self, request, pk=None):
        result = self.get_object()
        return Response(StudentResultSerializer(result).data)
