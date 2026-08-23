from django.contrib import admin
from .models import AttendanceSession, AttendanceRecord

class AttendanceRecordInline(admin.TabularInline):
    model = AttendanceRecord
    extra = 0

@admin.register(AttendanceSession)
class AttendanceSessionAdmin(admin.ModelAdmin):
    list_display = ['date', 'branch', 'semester', 'subject', 'present_count', 'absent_count', 'percentage', 'marked_by']
    list_filter = ['branch', 'semester', 'date']
    search_fields = ['subject', 'marked_by']
    inlines = [AttendanceRecordInline]
