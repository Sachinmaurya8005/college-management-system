from django.db import models
from students.models import Student

class ExamSchedule(models.Model):
    exam_name = models.CharField(max_length=150)
    branch = models.CharField(max_length=150)
    semester = models.IntegerField(default=1)
    subject = models.CharField(max_length=150)
    subject_code = models.CharField(max_length=50)
    exam_date = models.DateField()
    start_time = models.CharField(max_length=20, default='09:30 AM')
    end_time = models.CharField(max_length=20, default='12:30 PM')
    room_no = models.CharField(max_length=50, default='Hall A-102')
    max_marks = models.IntegerField(default=50)
    passing_marks = models.IntegerField(default=17)
    exam_type = models.CharField(max_length=50, default='Theory')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['exam_date', 'start_time']

    def __str__(self):
        return f"{self.exam_name}: {self.subject} ({self.exam_date})"

class StudentResult(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='results', null=True, blank=True)
    roll_number = models.CharField(max_length=50)
    student_name = models.CharField(max_length=150)
    branch = models.CharField(max_length=150)
    semester = models.IntegerField(default=4)
    academic_year = models.CharField(max_length=50, default='2025-2026')
    grand_total_max = models.IntegerField(default=700)
    grand_total_obtained = models.IntegerField(default=585)
    percentage = models.FloatField(default=83.57)
    cgpa = models.FloatField(default=8.5)
    division = models.CharField(max_length=50, default='First Division with Honours')
    status = models.CharField(max_length=50, default='PASSED')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student_name} ({self.roll_number}) - Sem {self.semester}: {self.status}"

class SubjectMark(models.Model):
    result = models.ForeignKey(StudentResult, on_delete=models.CASCADE, related_name='subjects')
    subject_code = models.CharField(max_length=50)
    subject_name = models.CharField(max_length=150)
    theory_max = models.IntegerField(default=50)
    theory_obtained = models.IntegerField(default=42)
    practical_max = models.IntegerField(default=50)
    practical_obtained = models.IntegerField(default=45)
    total_max = models.IntegerField(default=100)
    total_obtained = models.IntegerField(default=87)
    grade = models.CharField(max_length=10, default='A+')
    status = models.CharField(max_length=20, default='PASS')

    def __str__(self):
        return f"{self.subject_name} ({self.subject_code}): {self.total_obtained}/{self.total_max}"
