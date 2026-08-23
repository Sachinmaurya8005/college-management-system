from rest_framework import serializers
from .models import CollegeSettings

class CollegeSettingsSerializer(serializers.ModelSerializer):
    collegeName = serializers.CharField(source='college_name', required=False)
    hindiName = serializers.CharField(source='hindi_name', required=False)
    aicteCode = serializers.CharField(source='aicte_code', required=False)
    bteupCode = serializers.CharField(source='bteup_code', required=False)
    principalName = serializers.CharField(source='principal_name', required=False)
    customLogoUrl = serializers.CharField(source='custom_logo_url', required=False, allow_blank=True)

    class Meta:
        model = CollegeSettings
        fields = [
            'id', 'college_name', 'collegeName', 'hindi_name', 'hindiName',
            'address', 'phone', 'email', 'website', 'aicte_code', 'aicteCode',
            'bteup_code', 'bteupCode', 'principal_name', 'principalName',
            'custom_logo_url', 'customLogoUrl'
        ]
