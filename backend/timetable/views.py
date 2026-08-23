from rest_framework import viewsets, permissions
from .models import TimetableSlot
from .serializers import TimetableSlotSerializer

class TimetableSlotViewSet(viewsets.ModelViewSet):
    queryset = TimetableSlot.objects.all()
    serializer_class = TimetableSlotSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        branch = self.request.query_params.get('branch')
        semester = self.request.query_params.get('semester')
        day = self.request.query_params.get('day')

        if branch and branch != 'All':
            qs = qs.filter(branch__icontains=branch)
        if semester and semester != 'All':
            qs = qs.filter(semester=semester)
        if day and day != 'All':
            qs = qs.filter(day=day)
        return qs
