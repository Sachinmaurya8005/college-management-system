from rest_framework import serializers
from .models import Teacher

class TeacherSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='full_name', required=False)
    empCode = serializers.CharField(source='emp_code', required=False)
    photoUrl = serializers.CharField(source='photo_url', required=False, allow_blank=True)
    joiningDate = serializers.DateField(source='joining_date', required=False, allow_null=True)
    experienceYears = serializers.IntegerField(source='experience_years', required=False)
    dob = serializers.DateField(source='date_of_birth', required=False, allow_null=True)
    payScale = serializers.CharField(source='pay_scale', required=False, allow_blank=True)
    promotionStatus = serializers.CharField(source='promotion_status', required=False, allow_blank=True)
    bloodGroup = serializers.CharField(source='blood_group', required=False, allow_blank=True)
    staffType = serializers.CharField(source='staff_type', required=False, allow_blank=True)
    workDescription = serializers.CharField(source='work_description', required=False, allow_blank=True)

    class Meta:
        model = Teacher
        fields = [
            'id', 'teacher_id', 'emp_code', 'empCode', 'full_name', 'name',
            'photo_url', 'photoUrl', 'department', 'designation', 'qualification',
            'email', 'mobile', 'joining_date', 'joiningDate', 'subjects',
            'experience_years', 'experienceYears', 'status',
            'age', 'dob', 'date_of_birth', 'gender', 'salary', 'payScale', 'pay_scale',
            'promotionStatus', 'promotion_status', 'address', 'bloodGroup', 'blood_group',
            'staffType', 'staff_type', 'workDescription', 'work_description',
            'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        if not validated_data.get('teacher_id'):
            emp = validated_data.get('emp_code', '')
            validated_data['teacher_id'] = f"fac-{emp[-2:] if len(emp)>=2 else '01'}"
        return super().create(validated_data)
