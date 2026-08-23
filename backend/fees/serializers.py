from rest_framework import serializers
from .models import FeeRecord, PaymentTransaction

class PaymentTransactionSerializer(serializers.ModelSerializer):
    receiptNo = serializers.CharField(source='receipt_number', required=False)
    paymentDate = serializers.DateField(source='payment_date', required=False)
    paymentMode = serializers.CharField(source='payment_mode', required=False)
    transactionRef = serializers.CharField(source='transaction_ref', required=False, allow_blank=True)
    collectedBy = serializers.CharField(source='collected_by', required=False)

    class Meta:
        model = PaymentTransaction
        fields = [
            'id', 'receipt_number', 'receiptNo', 'amount', 'payment_date',
            'paymentDate', 'payment_mode', 'paymentMode', 'transaction_ref',
            'transactionRef', 'remarks', 'collected_by', 'collectedBy', 'created_at'
        ]

class FeeRecordSerializer(serializers.ModelSerializer):
    receiptNo = serializers.CharField(source='receipt_number', required=False)
    studentId = serializers.CharField(source='student_id_str', required=False)
    studentName = serializers.CharField(source='student_name', required=False)
    rollNo = serializers.CharField(source='roll_number', required=False)
    academicYear = serializers.CharField(source='academic_year', required=False)
    totalFee = serializers.FloatField(source='total_amount', required=False)
    paidAmount = serializers.FloatField(source='paid_amount', required=False)
    pendingAmount = serializers.FloatField(source='pending_amount', required=False)
    dueDate = serializers.DateField(source='due_date', required=False, allow_null=True)
    paymentStatus = serializers.CharField(source='payment_status', required=False)
    transactions = PaymentTransactionSerializer(many=True, read_only=True)

    class Meta:
        model = FeeRecord
        fields = [
            'id', 'receipt_number', 'receiptNo', 'student_id_str', 'studentId',
            'student_name', 'studentName', 'roll_number', 'rollNo', 'branch',
            'semester', 'academic_year', 'academicYear', 'total_amount', 'totalFee',
            'paid_amount', 'paidAmount', 'pending_amount', 'pendingAmount',
            'due_date', 'dueDate', 'payment_status', 'paymentStatus',
            'transactions', 'created_at', 'updated_at'
        ]
