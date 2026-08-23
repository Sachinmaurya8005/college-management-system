from django.contrib import admin
from .models import Teacher

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ['emp_code', 'full_name', 'department', 'designation', 'qualification', 'email', 'mobile', 'status']
    list_filter = ['department', 'status']
    search_fields = ['full_name', 'emp_code', 'email', 'department']
