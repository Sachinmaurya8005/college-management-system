from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoticeItemViewSet

router = DefaultRouter()
router.register(r'', NoticeItemViewSet, basename='notice')

urlpatterns = [
    path('', include(router.urls)),
]
