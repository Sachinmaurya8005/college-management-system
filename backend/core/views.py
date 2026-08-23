from rest_framework import views, permissions, status
from rest_framework.response import Response
from .models import CollegeSettings
from .serializers import CollegeSettingsSerializer

class CollegeSettingsView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        settings_obj, _ = CollegeSettings.objects.get_or_create(id=1)
        return Response(CollegeSettingsSerializer(settings_obj).data)

    def patch(self, request):
        settings_obj, _ = CollegeSettings.objects.get_or_create(id=1)
        serializer = CollegeSettingsSerializer(settings_obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
