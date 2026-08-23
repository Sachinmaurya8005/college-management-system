from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FeeRecordViewSet

router = DefaultRouter()
router.register(r'', FeeRecordViewSet, basename='fee')

urlpatterns = [
    path('', include(router.urls)),
]
