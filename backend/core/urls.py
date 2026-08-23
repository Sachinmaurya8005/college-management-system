from django.urls import path
from .views import CollegeSettingsView

urlpatterns = [
    path('', CollegeSettingsView.as_view(), name='college_settings'),
]
