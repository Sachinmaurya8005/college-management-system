from rest_framework import serializers
from .models import Student, StudentApplication, StaffApprovalRequest

class StudentSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='full_name', required=False)
    rollNo = serializers.CharField(source='roll_number', required=False)
    enrollmentNo = serializers.CharField(source='enrollment_number', required=False, allow_blank=True)
    fatherName = serializers.CharField(source='father_name', required=False, allow_blank=True)
    motherName = serializers.CharField(source='mother_name', required=False, allow_blank=True)
    dob = serializers.DateField(source='date_of_birth', required=False, allow_null=True)
    bloodGroup = serializers.CharField(source='blood_group', required=False, allow_blank=True)
    admissionYear = serializers.IntegerField(source='admission_year', required=False)
    photoUrl = serializers.CharField(source='photo_url', required=False, allow_blank=True)
    attendancePercentage = serializers.FloatField(source='attendance_percentage', required=False)
    feeStatus = serializers.CharField(source='fee_status', required=False)

    class Meta:
        model = Student
        fields = [
            'id', 'student_id', 'full_name', 'name', 'roll_number', 'rollNo',
            'enrollment_number', 'enrollmentNo', 'father_name', 'fatherName',
            'mother_name', 'motherName', 'date_of_birth', 'dob', 'gender',
            'mobile', 'email', 'address', 'branch', 'semester', 'admission_year',
            'admissionYear', 'category', 'blood_group', 'bloodGroup', 'status',
            'photo_url', 'photoUrl', 'attendance_percentage', 'attendancePercentage',
            'fee_status', 'feeStatus', 'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        if not validated_data.get('student_id'):
            roll = validated_data.get('roll_number', '')
            validated_data['student_id'] = f"std-{roll[-4:] if len(roll)>=4 else '001'}"
        return super().create(validated_data)


class StudentApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    roll_number = serializers.CharField(source='student.roll_number', read_only=True)
    enrollment_number = serializers.CharField(source='student.enrollment_number', read_only=True)
    branch = serializers.CharField(source='student.branch', read_only=True)
    semester = serializers.IntegerField(source='student.semester', read_only=True)

    class Meta:
        model = StudentApplication
        fields = [
            'id', 'application_no', 'student', 'student_name', 'roll_number',
            'enrollment_number', 'branch', 'semester', 'sender_name', 'sender_role',
            'sender_email', 'recipient_role', 'recipient_name', 'recipient_email',
            'subject', 'category', 'description', 'attachment_url', 'status',
            'staff_response', 'reviewed_by', 'submission_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'application_no', 'submission_date', 'created_at', 'updated_at']


class StaffApprovalRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffApprovalRequest
        fields = '__all__'
        read_only_fields = ['id', 'request_no', 'created_at', 'updated_at']

