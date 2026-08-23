from rest_framework import serializers
from .models import NoticeItem

class NoticeItemSerializer(serializers.ModelSerializer):
    publishDate = serializers.DateField(source='publish_date', required=False)
    targetAudience = serializers.CharField(source='target_audience', required=False)
    issuedBy = serializers.CharField(source='issued_by', required=False)
    referenceNo = serializers.CharField(source='reference_no', required=False)
    attachmentName = serializers.CharField(source='attachment_name', required=False, allow_blank=True)

    class Meta:
        model = NoticeItem
        fields = [
            'id', 'title', 'content', 'category', 'publish_date', 'publishDate',
            'priority', 'target_audience', 'targetAudience', 'issued_by',
            'issuedBy', 'reference_no', 'referenceNo', 'attachment_name',
            'attachmentName', 'is_confidential_staff', 'discussion_comments',
            'created_at', 'updated_at'
        ]
