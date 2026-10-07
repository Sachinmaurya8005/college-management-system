from rest_framework import serializers
from .models import Teacher

class TeacherSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=False)
    emp_code = serializers.CharField(required=False)
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

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'name' in data and not data.get('full_name'):
            data['full_name'] = data['name']
        if 'empCode' in data and not data.get('emp_code'):
            data['emp_code'] = data['empCode']
        if 'photoUrl' in data and not data.get('photo_url'):
            data['photo_url'] = data['photoUrl']
        if 'joiningDate' in data and not data.get('joining_date'):
            data['joining_date'] = data['joiningDate']
        if 'experienceYears' in data and not data.get('experience_years'):
            data['experience_years'] = data['experienceYears']
        if 'dob' in data and not data.get('date_of_birth'):
            data['date_of_birth'] = data['dob']
        if 'bloodGroup' in data and not data.get('blood_group'):
            data['blood_group'] = data['bloodGroup']
        if 'staffType' in data and not data.get('staff_type'):
            data['staff_type'] = data['staffType']
        if 'workDescription' in data and not data.get('work_description'):
            data['work_description'] = data['workDescription']
        if 'payScale' in data and not data.get('pay_scale'):
            data['pay_scale'] = data['payScale']
        if 'promotionStatus' in data and not data.get('promotion_status'):
            data['promotion_status'] = data['promotionStatus']
        if 'email' in data and not data['email']:
            data['email'] = ''
        return super().to_internal_value(data)

    def create(self, validated_data):
        if not validated_data.get('teacher_id'):
            emp = validated_data.get('emp_code', '')
            validated_data['teacher_id'] = f"fac-{emp[-2:] if len(emp)>=2 else '01'}"
        return super().create(validated_data)
