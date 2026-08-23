from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Student, StudentApplication, StaffApprovalRequest
from .serializers import StudentSerializer, StudentApplicationSerializer, StaffApprovalRequestSerializer
from accounts.permissions import IsAdminOrTeacher
from accounts.models import User
from fees.models import FeeRecord, PaymentTransaction
from datetime import date
import uuid

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['full_name', 'roll_number', 'enrollment_number', 'email', 'mobile', 'branch']

    def get_queryset(self):
        queryset = super().get_queryset()
        branch = self.request.query_params.get('branch')
        semester = self.request.query_params.get('semester')
        status_param = self.request.query_params.get('status')
        search = self.request.query_params.get('search')

        if branch and branch != 'All':
            queryset = queryset.filter(branch__icontains=branch)
        if semester and semester != 'All':
            queryset = queryset.filter(semester=semester)
        if status_param and status_param != 'All':
            queryset = queryset.filter(status=status_param)
        if search:
            queryset = queryset.filter(
                Q(full_name__icontains=search) |
                Q(roll_number__icontains=search) |
                Q(enrollment_number__icontains=search) |
                Q(email__icontains=search) |
                Q(mobile__icontains=search)
            )
        return queryset


class StudentApplicationViewSet(viewsets.ModelViewSet):
    """
    Staff / Admin panel to view, review, respond, and resolve student applications & grievances.
    """
    queryset = StudentApplication.objects.all()
    serializer_class = StudentApplicationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        category = self.request.query_params.get('category')
        if status_param and status_param != 'All':
            qs = qs.filter(status=status_param)
        if category and category != 'All':
            qs = qs.filter(category=category)
        return qs

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        app_obj = self.get_object()
        new_status = request.data.get('status')
        response_text = request.data.get('staff_response', '')
        reviewer = request.data.get('reviewed_by', getattr(request.user, 'first_name', 'Authorized Staff'))

        if new_status:
            app_obj.status = new_status
        if response_text:
            app_obj.staff_response = response_text
        if reviewer:
            app_obj.reviewed_by = reviewer
        app_obj.save()

        # If personal info correction was approved and student updates provided, update student record
        corrected_name = request.data.get('corrected_name')
        if corrected_name and new_status in ('Approved', 'Resolved'):
            app_obj.student.full_name = corrected_name
            app_obj.student.save()

        return Response(StudentApplicationSerializer(app_obj).data)


class StaffApprovalRequestViewSet(viewsets.ModelViewSet):
    """
    Teacher and Admin workflow for student additions and fee updates.
    Teachers submit requests that enter 'Pending' status.
    Admin reviews and approves/rejects them.
    Upon approval, updates are applied directly to the database.
    """
    queryset = StaffApprovalRequest.objects.all()
    serializer_class = StaffApprovalRequestSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        req_type = self.request.query_params.get('request_type')
        if status_param and status_param != 'All':
            qs = qs.filter(status=status_param)
        if req_type and req_type != 'All':
            qs = qs.filter(request_type=req_type)
        return qs

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        submitted_by = user.get_full_name() or user.username if user else 'Faculty Member'
        email = user.email if user else ''
        serializer.save(submitted_by_name=submitted_by, submitted_by_email=email)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        req_obj = self.get_object()
        reviewer = getattr(request.user, 'first_name', 'Principal / Admin')
        remarks = request.data.get('admin_remarks', 'Approved by Admin.')

        payload = req_obj.payload or {}

        # 1. Handle New Student Registration Approval
        if req_obj.request_type == 'NEW_STUDENT':
            roll = payload.get('roll_number', req_obj.roll_number)
            full_name = payload.get('full_name', req_obj.student_name)
            enrollment = payload.get('enrollment_number', '')
            branch = payload.get('branch', req_obj.branch)
            semester = int(payload.get('semester', req_obj.semester or 1))
            dob = payload.get('date_of_birth')

            std, _ = Student.objects.get_or_create(
                roll_number=roll,
                defaults={
                    'full_name': full_name,
                    'enrollment_number': enrollment,
                    'branch': branch,
                    'semester': semester,
                    'date_of_birth': dob,
                    'father_name': payload.get('father_name', ''),
                    'mother_name': payload.get('mother_name', ''),
                    'mobile': payload.get('mobile', ''),
                    'email': payload.get('email', f"{roll.lower()}@student.polytechnic.edu"),
                    'address': payload.get('address', 'Ballia, Uttar Pradesh'),
                    'fee_status': payload.get('fee_status', 'Pending'),
                    'admission_year': int(payload.get('admission_year', 2024)),
                    'status': 'Active'
                }
            )
            req_obj.student = std

            # Create User Account for the student so they can log in
            user_obj, created = User.objects.get_or_create(
                username=roll,
                defaults={
                    'email': std.email,
                    'first_name': full_name,
                    'role': 'student',
                    'roll_number': roll,
                    'branch': branch,
                    'semester': semester
                }
            )
            if created:
                user_obj.set_password(dob if dob else 'student123')
                user_obj.save()

            # Create Fee Record
            FeeRecord.objects.get_or_create(
                roll_number=roll,
                defaults={
                    'receipt_number': f"REC-2026-{uuid.uuid4().hex[:6].upper()}",
                    'student': std,
                    'student_name': full_name,
                    'branch': branch,
                    'semester': semester,
                    'total_amount': 12650.00,
                    'paid_amount': 12650.00 if std.fee_status == 'Paid' else 0.00,
                    'pending_amount': 0.00 if std.fee_status == 'Paid' else 12650.00,
                    'payment_status': std.fee_status
                }
            )

        # 2. Handle Fee Update Approval
        elif req_obj.request_type == 'FEE_UPDATE':
            roll = req_obj.roll_number or payload.get('roll_number')
            new_fee_status = payload.get('fee_status', 'Paid')
            paid_amount = float(payload.get('paid_amount', 12650))
            std = req_obj.student or Student.objects.filter(roll_number=roll).first()

            if std:
                std.fee_status = new_fee_status
                std.save()

                fee_rec = FeeRecord.objects.filter(student=std).first()
                if not fee_rec:
                    fee_rec = FeeRecord.objects.filter(roll_number=roll).first()

                if fee_rec:
                    fee_rec.paid_amount = paid_amount
                    fee_rec.pending_amount = max(0.0, float(fee_rec.total_amount) - paid_amount)
                    fee_rec.payment_status = new_fee_status
                    fee_rec.save()

                    PaymentTransaction.objects.create(
                        fee_record=fee_rec,
                        receipt_number=fee_rec.receipt_number,
                        amount=paid_amount,
                        payment_mode=payload.get('payment_mode', 'Online UPI / Bank'),
                        transaction_ref=payload.get('transaction_ref', f"TXN-{uuid.uuid4().hex[:8].upper()}"),
                        remarks=payload.get('remarks', 'Teacher collection approved by Admin.'),
                        collected_by=req_obj.submitted_by_name
                    )

        req_obj.status = 'Approved'
        req_obj.admin_remarks = remarks
        req_obj.reviewed_by = reviewer
        req_obj.save()

        return Response(StaffApprovalRequestSerializer(req_obj).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        req_obj = self.get_object()
        reviewer = getattr(request.user, 'first_name', 'Principal / Admin')
        remarks = request.data.get('admin_remarks', 'Request rejected by Admin.')

        req_obj.status = 'Rejected'
        req_obj.admin_remarks = remarks
        req_obj.reviewed_by = reviewer
        req_obj.save()

        return Response(StaffApprovalRequestSerializer(req_obj).data)
