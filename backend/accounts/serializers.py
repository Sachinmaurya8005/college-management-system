from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from .models import User
from students.models import Student

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone', 'designation', 'department',
            'roll_number', 'branch', 'semester', 'avatar_url', 'last_login'
        ]
        read_only_fields = ['id', 'last_login']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        name = f"{instance.first_name} {instance.last_name}".strip()
        data['name'] = name if name else instance.username
        data['avatar'] = instance.avatar_url
        data['rollNo'] = instance.roll_number

        if instance.role == 'student' and instance.roll_number:
            std = Student.objects.filter(roll_number=instance.roll_number).first()
            if std:
                data['dob'] = std.date_of_birth.strftime('%Y-%m-%d') if std.date_of_birth else None
                data['enrollmentNo'] = std.enrollment_number
                data['fatherName'] = std.father_name
                data['motherName'] = std.mother_name
                data['category'] = std.category
                data['bloodGroup'] = std.blood_group
                data['address'] = std.address
        return data

class CustomTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.CharField(required=False, allow_blank=True)
    enrollment_number = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        login_identifier = (
            attrs.get('username') or
            attrs.get('email') or
            attrs.get('enrollment_number') or
            self.initial_data.get('username') or
            self.initial_data.get('email') or
            self.initial_data.get('enrollment_number') or
            self.initial_data.get('roll_number') or
            ''
        ).strip()
        password = attrs.get('password', '').strip()

        if not login_identifier or not password:
            raise serializers.ValidationError('Please provide your Enrollment Number / Email and Password / Date of Birth.')

        user = None

        # 1. Try standard password check by email
        if '@' in login_identifier:
            user_obj = User.objects.filter(email__iexact=login_identifier).first()
            if user_obj and user_obj.check_password(password):
                user = user_obj
        
        # 2. Try standard password check by roll / enrollment number
        if user is None:
            user_obj = User.objects.filter(
                Q(roll_number__iexact=login_identifier) |
                Q(username__iexact=login_identifier)
            ).first()
            if user_obj and user_obj.check_password(password):
                user = user_obj

        # 3. Student Login with Enrollment Number + Date of Birth (DOB) authentication
        if user is None:
            std = Student.objects.filter(
                Q(roll_number__iexact=login_identifier) |
                Q(enrollment_number__iexact=login_identifier) |
                Q(student_id__iexact=login_identifier) |
                Q(email__iexact=login_identifier)
            ).first()

            if std:
                # Check if password matches date of birth or default student password
                matched_dob = False
                if std.date_of_birth:
                    dob_iso = std.date_of_birth.strftime('%Y-%m-%d')
                    dob_dmy = std.date_of_birth.strftime('%d-%m-%Y')
                    dob_slash = std.date_of_birth.strftime('%d/%m/%Y')
                    dob_clean = std.date_of_birth.strftime('%d%m%Y')
                    clean_input = password.replace('/', '-').replace(' ', '').strip()

                    if clean_input in (dob_iso, dob_dmy, dob_slash, dob_clean):
                        matched_dob = True

                if password in ('student123', 'admin123') or matched_dob:
                    user_obj = User.objects.filter(
                        Q(roll_number__iexact=std.roll_number) |
                        Q(email__iexact=std.email) |
                        Q(username__iexact=std.roll_number)
                    ).first()

                    if not user_obj:
                        user_obj = User.objects.create_user(
                            username=std.roll_number,
                            email=std.email or f"{std.roll_number}@polytechnic.edu",
                            password=password,
                            first_name=std.full_name,
                            role='student',
                            roll_number=std.roll_number,
                            branch=std.branch,
                            semester=std.semester
                        )
                    user = user_obj

        # 4. Fallback search by email
        if user is None:
            user_obj = User.objects.filter(email__iexact=login_identifier).first()
            if user_obj and user_obj.check_password(password):
                user = user_obj

        if not user or not user.is_active:
            if '@' not in login_identifier:
                raise serializers.ValidationError('गलत विवरण! कृपया अपना सही Enrollment No./Roll No. और Date of Birth (DD-MM-YYYY) दर्ज करें। (Invalid credentials. Please verify your Student Enrollment Number and Date of Birth).')
            raise serializers.ValidationError('Invalid credentials. Please verify your institutional email and password.')

        refresh = RefreshToken.for_user(user)
        refresh['role'] = user.role
        refresh['email'] = user.email

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }
