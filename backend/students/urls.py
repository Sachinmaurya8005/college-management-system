from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, StudentApplicationViewSet, StaffApprovalRequestViewSet

router = DefaultRouter()
router.register(r'applications', StudentApplicationViewSet, basename='student-applications')
router.register(r'approval-requests', StaffApprovalRequestViewSet, basename='staff-approval-requests')
router.register(r'', StudentViewSet, basename='student')

urlpatterns = [
    path('', include(router.urls)),
]
