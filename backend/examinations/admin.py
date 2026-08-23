from django.contrib import admin
from .models import ExamSchedule, StudentResult, SubjectMark

class SubjectMarkInline(admin.TabularInline):
    model = SubjectMark
    extra = 0

@admin.register(ExamSchedule)
class ExamScheduleAdmin(admin.ModelAdmin):
    list_display = ['exam_name', 'branch', 'semester', 'subject', 'exam_date', 'start_time', 'room_no']
    list_filter = ['branch', 'semester', 'exam_date']
    search_fields = ['exam_name', 'subject', 'room_no']

@admin.register(StudentResult)
class StudentResultAdmin(admin.ModelAdmin):
    list_display = ['roll_number', 'student_name', 'branch', 'semester', 'percentage', 'cgpa', 'division', 'status']
    list_filter = ['branch', 'semester', 'status']
    search_fields = ['roll_number', 'student_name']
    inlines = [SubjectMarkInline]
