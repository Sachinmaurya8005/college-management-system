from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['roll_number', 'full_name', 'branch', 'semester', 'category', 'attendance_percentage', 'fee_status', 'status']
    list_filter = ['branch', 'semester', 'category', 'fee_status', 'status']
    search_fields = ['full_name', 'roll_number', 'enrollment_number', 'email', 'mobile']
