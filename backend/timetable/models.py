from django.db import models

class TimetableSlot(models.Model):
    DAY_CHOICES = (
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
    )
    TYPE_CHOICES = (
        ('Theory', 'Theory'),
        ('Practical', 'Practical'),
        ('Tutorial', 'Tutorial'),
    )

    branch = models.CharField(max_length=150)
    semester = models.IntegerField(default=1)
    day = models.CharField(max_length=20, choices=DAY_CHOICES)
    start_time = models.CharField(max_length=20)
    end_time = models.CharField(max_length=20)
    subject = models.CharField(max_length=150)
    subject_code = models.CharField(max_length=50, blank=True)
    teacher_name = models.CharField(max_length=150)
    room_no = models.CharField(max_length=50)
    slot_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='Theory')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['day', 'start_time']

    def __str__(self):
        return f"{self.day} {self.start_time}-{self.end_time}: {self.subject} ({self.branch} Sem {self.semester})"
