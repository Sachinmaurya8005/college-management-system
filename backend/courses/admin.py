from django.contrib import admin
from .models import Course

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['course_code', 'course_name', 'short_code', 'duration_years', 'total_seats', 'hod_name', 'status']
    search_fields = ['course_name', 'course_code', 'hod_name']
