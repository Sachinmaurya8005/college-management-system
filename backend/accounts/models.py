from django.db import models
from django.contrib.auth.models import AbstractUser

class UserRole(models.TextChoices):
    ADMIN = 'admin', 'Admin'
    TEACHER = 'teacher', 'Teacher'
    STUDENT = 'student', 'Student'

class User(AbstractUser):
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.ADMIN)
    phone = models.CharField(max_length=20, blank=True, default='')
    designation = models.CharField(max_length=150, blank=True, default='')
    department = models.CharField(max_length=150, blank=True, default='')
    roll_number = models.CharField(max_length=50, blank=True, default='')
    branch = models.CharField(max_length=150, blank=True, default='')
    semester = models.IntegerField(null=True, blank=True)
    avatar_url = models.URLField(max_length=500, blank=True, default='')

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
