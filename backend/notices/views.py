from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import NoticeItem
from .serializers import NoticeItemSerializer
import uuid
import datetime

class NoticeItemViewSet(viewsets.ModelViewSet):
    queryset = NoticeItem.objects.all()
    serializer_class = NoticeItemSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content', 'reference_no', 'issued_by']

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        target_audience = self.request.query_params.get('targetAudience') or self.request.query_params.get('target_audience')
        search = self.request.query_params.get('search')
        is_staff = self.request.query_params.get('is_confidential_staff')

        if is_staff is not None:
            qs = qs.filter(is_confidential_staff=(is_staff.lower() == 'true'))
        if category and category != 'All':
            qs = qs.filter(category=category)
        if target_audience and target_audience != 'All':
            qs = qs.filter(target_audience__in=[target_audience, 'All'])
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(content__icontains=search) |
                Q(reference_no__icontains=search)
            )
        return qs

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def add_comment(self, request, pk=None):
        notice = self.get_object()
        author_name = request.data.get('author_name', 'Faculty Member')
        author_role = request.data.get('author_role', 'teacher')
        comment_text = request.data.get('text', '').strip()

        if not comment_text:
            return Response({'error': 'Comment text cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)

        comments = list(notice.discussion_comments or [])
        new_comment = {
            'id': f"cmt-{uuid.uuid4().hex[:6]}",
            'author_name': author_name,
            'author_role': author_role,
            'text': comment_text,
            'created_at': datetime.datetime.now().strftime('%d %b %Y, %I:%M %p')
        }
        comments.append(new_comment)
        notice.discussion_comments = comments
        notice.save(update_fields=['discussion_comments'])

        return Response({
            'message': 'Comment added successfully',
            'comments': notice.discussion_comments
        }, status=status.HTTP_200_OK)
