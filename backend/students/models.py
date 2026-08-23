from django.db import models
import uuid

class Student(models.Model):
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Suspended', 'Suspended'),
        ('Alumni', 'Alumni'),
    )
    CATEGORY_CHOICES = (
        ('General', 'General'),
        ('OBC', 'OBC'),
        ('SC', 'SC'),
        ('ST', 'ST'),
        ('EWS', 'EWS'),
    )
    FEE_STATUS_CHOICES = (
        ('Paid', 'Paid'),
        ('Partial', 'Partial'),
        ('Pending', 'Pending'),
    )

    student_id = models.CharField(max_length=50, blank=True)
    roll_number = models.CharField(max_length=50, unique=True)
    enrollment_number = models.CharField(max_length=50, blank=True)
    full_name = models.CharField(max_length=150)
    father_name = models.CharField(max_length=150, blank=True)
    mother_name = models.CharField(max_length=150, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='Male')
    mobile = models.CharField(max_length=25, blank=True)
    email = models.EmailField(max_length=150, blank=True)
    address = models.TextField(blank=True)
    branch = models.CharField(max_length=150)
    semester = models.IntegerField(default=1)
    admission_year = models.IntegerField(default=2023)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='General')
    blood_group = models.CharField(max_length=10, blank=True, default='B+')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    photo_url = models.URLField(max_length=500, blank=True)
    attendance_percentage = models.FloatField(default=85.0)
    fee_status = models.CharField(max_length=20, choices=FEE_STATUS_CHOICES, default='Pending')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-id']

    def save(self, *args, **kwargs):
        if not self.student_id:
            self.student_id = f"std-{self.roll_number[-4:] if len(self.roll_number)>=4 else '001'}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} ({self.roll_number}) - {self.branch}"


class StudentApplication(models.Model):
    CATEGORY_CHOICES = (
        ('Personal Information Correction', 'Personal Information Correction'),
        ('Name Correction Request', 'Name Correction Request'),
        ('Attendance Issue', 'Attendance Issue'),
        ('Fee / Payment Issue', 'Fee / Payment Issue'),
        ('Examination & Result Issue', 'Examination & Result Issue'),
        ('Document / Certificate Request', 'Document / Certificate Request'),
        ('Hostel / Mess Request', 'Hostel / Mess Request'),
        ('Other Grievance / Problem', 'Other Grievance / Problem'),
    )

    STATUS_CHOICES = (
        ('Submitted', 'Submitted'),
        ('Under Review', 'Under Review'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Resolved', 'Resolved'),
    )

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='applications', null=True, blank=True)
    application_no = models.CharField(max_length=50, unique=True, blank=True)
    sender_name = models.CharField(max_length=150, blank=True)
    sender_role = models.CharField(max_length=50, default='student')
    sender_email = models.CharField(max_length=150, blank=True)
    recipient_role = models.CharField(max_length=50, default='principal')
    recipient_name = models.CharField(max_length=150, default='Er. R. C. Srivastava (Principal)')
    recipient_email = models.CharField(max_length=150, default='principal.gpbansdeeh@gmail.com')
    subject = models.CharField(max_length=255)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='Personal Information Correction')
    description = models.TextField()
    attachment_url = models.URLField(max_length=500, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Submitted')
    staff_response = models.TextField(blank=True)
    reviewed_by = models.CharField(max_length=150, blank=True)
    submission_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Student & Staff Application'
        verbose_name_plural = 'Student & Staff Applications'

    def save(self, *args, **kwargs):
        if not self.application_no:
            self.application_no = f"APP-2026-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.application_no} - {self.student.full_name} ({self.status})"


class StaffApprovalRequest(models.Model):
    REQUEST_TYPE_CHOICES = (
        ('NEW_STUDENT', 'New Student Registration'),
        ('FEE_UPDATE', 'Fee Payment / Status Update'),
        ('STUDENT_UPDATE', 'Student Information Update'),
        ('ATTENDANCE_UPDATE', 'Attendance Adjustment'),
    )
    STATUS_CHOICES = (
        ('Pending', 'Pending Admin Approval'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    )

    request_no = models.CharField(max_length=50, unique=True, blank=True)
    request_type = models.CharField(max_length=50, choices=REQUEST_TYPE_CHOICES, default='FEE_UPDATE')
    submitted_by_name = models.CharField(max_length=150, default='Faculty Member')
    submitted_by_email = models.CharField(max_length=150, blank=True)
    
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True, related_name='approval_requests')
    student_name = models.CharField(max_length=150)
    roll_number = models.CharField(max_length=50, blank=True)
    branch = models.CharField(max_length=150, blank=True)
    semester = models.IntegerField(default=1)

    payload = models.JSONField(default=dict, blank=True)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    admin_remarks = models.TextField(blank=True)
    reviewed_by = models.CharField(max_length=150, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Staff Approval Request'
        verbose_name_plural = 'Staff Approval Requests'

    def save(self, *args, **kwargs):
        if not self.request_no:
            self.request_no = f"REQ-2026-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.request_no} - {self.request_type} for {self.student_name} ({self.status})"

