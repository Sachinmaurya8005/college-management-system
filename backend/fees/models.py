from django.db import models
from students.models import Student

class FeeRecord(models.Model):
    STATUS_CHOICES = (
        ('Paid', 'Paid'),
        ('Partial', 'Partial'),
        ('Pending', 'Pending'),
    )

    receipt_number = models.CharField(max_length=50, unique=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='fee_records', null=True, blank=True)
    student_id_str = models.CharField(max_length=50, blank=True)
    student_name = models.CharField(max_length=150)
    roll_number = models.CharField(max_length=50)
    branch = models.CharField(max_length=150)
    semester = models.IntegerField(default=1)
    academic_year = models.CharField(max_length=50, default='2025-2026')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=12450.00)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    pending_amount = models.DecimalField(max_digits=10, decimal_places=2, default=12450.00)
    due_date = models.DateField(null=True, blank=True)
    payment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"{self.receipt_number} - {self.student_name} ({self.payment_status})"

class PaymentTransaction(models.Model):
    fee_record = models.ForeignKey(FeeRecord, on_delete=models.CASCADE, related_name='transactions')
    receipt_number = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField(auto_now_add=True)
    payment_mode = models.CharField(max_length=50, default='Online UPI')
    transaction_ref = models.CharField(max_length=100, blank=True)
    remarks = models.CharField(max_length=255, blank=True)
    collected_by = models.CharField(max_length=150, default='Accounts Section, GP Bansdeeh')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.receipt_number}: ₹{self.amount} via {self.payment_mode}"
