from django.contrib import admin
from .models import NoticeItem

@admin.register(NoticeItem)
class NoticeItemAdmin(admin.ModelAdmin):
    list_display = ['reference_no', 'title', 'category', 'priority', 'target_audience', 'publish_date', 'issued_by']
    list_filter = ['category', 'priority', 'target_audience', 'publish_date']
    search_fields = ['title', 'content', 'reference_no']
