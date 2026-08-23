from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='course_name', required=False)
    code = serializers.CharField(source='course_code', required=False)
    shortCode = serializers.CharField(source='short_code', required=False)
    durationYears = serializers.IntegerField(source='duration_years', required=False)
    totalSeats = serializers.IntegerField(source='total_seats', required=False)
    activeStudents = serializers.IntegerField(source='active_students', required=False)
    facultyCount = serializers.IntegerField(source='faculty_count', required=False)
    hodName = serializers.CharField(source='hod_name', required=False, allow_blank=True)
    labsCount = serializers.IntegerField(source='labs_count', required=False)

    class Meta:
        model = Course
        fields = [
            'id', 'course_code', 'code', 'course_name', 'name', 'short_code',
            'shortCode', 'duration_years', 'durationYears', 'total_seats',
            'totalSeats', 'active_students', 'activeStudents', 'faculty_count',
            'facultyCount', 'hod_name', 'hodName', 'labs_count', 'labsCount',
            'description', 'status', 'created_at', 'updated_at'
        ]
