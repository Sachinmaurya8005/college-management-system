from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from decimal import Decimal
import random
from .models import FeeRecord, PaymentTransaction
from .serializers import FeeRecordSerializer, PaymentTransactionSerializer
from students.models import Student

class FeeRecordViewSet(viewsets.ModelViewSet):
    queryset = FeeRecord.objects.all()
    serializer_class = FeeRecordSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        semester = self.request.query_params.get('semester')
        search = self.request.query_params.get('search')

        if status_param and status_param != 'All':
            qs = qs.filter(payment_status=status_param)
        if semester and semester != 'All':
            qs = qs.filter(semester=semester)
        if search:
            qs = qs.filter(
                models.Q(student_name__icontains=search) |
                models.Q(roll_number__icontains=search) |
                models.Q(receipt_number__icontains=search)
            )
        return qs

    @action(detail=True, methods=['post'], url_path='pay')
    def record_payment(self, request, pk=None):
        fee_record = self.get_object()
        amount_val = request.data.get('amount')
        if not amount_val:
            return Response({'error': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)

        amount = Decimal(str(amount_val))
        receipt_num = f"GPB/FEE/2026/{random.randint(10000, 99999)}"

        tx = PaymentTransaction.objects.create(
            fee_record=fee_record,
            receipt_number=receipt_num,
            amount=amount,
            payment_mode=request.data.get('paymentMode') or request.data.get('payment_mode') or 'Online UPI',
            transaction_ref=request.data.get('transactionRef') or request.data.get('transaction_ref') or f"TXN/{random.randint(100000, 999999)}",
            remarks=request.data.get('remarks', 'Semester Tuition & Exam Fee'),
            collected_by=request.data.get('collectedBy') or request.data.get('collected_by') or 'Accounts Section, GP Bansdeeh'
        )

        fee_record.paid_amount += amount
        fee_record.pending_amount = max(Decimal('0.00'), fee_record.total_amount - fee_record.paid_amount)
        if fee_record.pending_amount == Decimal('0.00'):
            fee_record.payment_status = 'Paid'
        elif fee_record.paid_amount > Decimal('0.00'):
            fee_record.payment_status = 'Partial'
        else:
            fee_record.payment_status = 'Pending'
        fee_record.save()

        # Update student fee_status
        if fee_record.roll_number:
            try:
                std = Student.objects.get(roll_number=fee_record.roll_number)
                std.fee_status = fee_record.payment_status
                std.save()
            except Student.DoesNotExist:
                pass

        return Response({
            'fee': FeeRecordSerializer(fee_record).data,
            'transaction': PaymentTransactionSerializer(tx).data
        }, status=status.HTTP_200_OK)
