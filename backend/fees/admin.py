from django.contrib import admin
from .models import FeeRecord, PaymentTransaction

class PaymentTransactionInline(admin.TabularInline):
    model = PaymentTransaction
    extra = 0

@admin.register(FeeRecord)
class FeeRecordAdmin(admin.ModelAdmin):
    list_display = ['receipt_number', 'student_name', 'roll_number', 'branch', 'semester', 'total_amount', 'paid_amount', 'pending_amount', 'payment_status']
    list_filter = ['payment_status', 'branch', 'semester', 'academic_year']
    search_fields = ['receipt_number', 'student_name', 'roll_number']
    inlines = [PaymentTransactionInline]
