from django.db import models

class Course(models.Model):
    course_code = models.CharField(max_length=50, unique=True)
    course_name = models.CharField(max_length=150)
    short_code = models.CharField(max_length=50)
    duration_years = models.IntegerField(default=3)
    total_seats = models.IntegerField(default=60)
    active_students = models.IntegerField(default=55)
    faculty_count = models.IntegerField(default=6)
    hod_name = models.CharField(max_length=150, blank=True)
    labs_count = models.IntegerField(default=4)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=50, default='Active')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.course_name} ({self.course_code})"
