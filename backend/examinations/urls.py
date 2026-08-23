from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExamScheduleViewSet, StudentResultViewSet

router = DefaultRouter()
router.register(r'schedules', ExamScheduleViewSet, basename='examschedule')
router.register(r'results', StudentResultViewSet, basename='studentresult')

urlpatterns = [
    path('', include(router.urls)),
]
