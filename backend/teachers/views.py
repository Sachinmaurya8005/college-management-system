from rest_framework import viewsets, permissions, filters
from django.db.models import Q
from .models import Teacher
from .serializers import TeacherSerializer

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['full_name', 'emp_code', 'department', 'email', 'mobile']

    def get_queryset(self):
        queryset = super().get_queryset()
        department = self.request.query_params.get('department')
        search = self.request.query_params.get('search')

        if department and department != 'All':
            queryset = queryset.filter(department__icontains=department)
        if search:
            queryset = queryset.filter(
                Q(full_name__icontains=search) |
                Q(emp_code__icontains=search) |
                Q(department__icontains=search) |
                Q(email__icontains=search)
            )
        return queryset
