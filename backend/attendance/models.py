from django.db import models
from students.models import Student

class AttendanceSession(models.Model):
    branch = models.CharField(max_length=150)
    semester = models.IntegerField(default=1)
    subject = models.CharField(max_length=150)
    date = models.DateField()
    present_count = models.IntegerField(default=0)
    absent_count = models.IntegerField(default=0)
    percentage = models.FloatField(default=0.0)
    marked_by = models.CharField(max_length=150, default='Faculty')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-id']

    def __str__(self):
        return f"{self.branch} (Sem-{self.semester}) - {self.subject} on {self.date}"

class AttendanceRecord(models.Model):
    STATUS_CHOICES = (
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
    )
    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name='records')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True, blank=True)
    student_id_str = models.CharField(max_length=50, blank=True)
    student_name = models.CharField(max_length=150)
    roll_number = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present')

    def __str__(self):
        return f"{self.student_name} ({self.roll_number}): {self.status}"
