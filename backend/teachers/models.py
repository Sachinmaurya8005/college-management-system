from django.db import models

class Teacher(models.Model):
    teacher_id = models.CharField(max_length=50, blank=True)
    emp_code = models.CharField(max_length=50, unique=True)
    full_name = models.CharField(max_length=150)
    photo_url = models.URLField(max_length=500, blank=True)
    department = models.CharField(max_length=150)
    designation = models.CharField(max_length=150)
    qualification = models.CharField(max_length=150)
    email = models.EmailField(max_length=150)
    mobile = models.CharField(max_length=25)
    joining_date = models.DateField(null=True, blank=True)
    subjects = models.JSONField(default=list, blank=True)
    experience_years = models.IntegerField(default=5)
    status = models.CharField(max_length=20, default='Active')

    # Enhanced Staff & Faculty Fields for Principal & Institution
    age = models.IntegerField(default=38, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, default='Male')
    salary = models.DecimalField(max_digits=12, decimal_places=2, default=78500.00)
    pay_scale = models.CharField(max_length=100, default='7th CPC Level 10 (₹56,100 - ₹1,77,500)')
    promotion_status = models.CharField(max_length=255, default='Regular Confirmed • Eligible for Next CAS Review')
    address = models.TextField(default='Government Polytechnic Campus Staff Quarters, Bansdeeh, Ballia (U.P.) - 277202')
    blood_group = models.CharField(max_length=10, default='B+')
    staff_type = models.CharField(max_length=50, default='Teaching Faculty')
    work_description = models.TextField(blank=True, default='Conducts theory lectures & lab practical sessions, manages departmental laboratory.')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-id']

    def save(self, *args, **kwargs):
        if not self.teacher_id:
            self.teacher_id = f"fac-{self.emp_code[-3:].lower() if len(self.emp_code)>=3 else '01'}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} ({self.emp_code}) - {self.department}"
