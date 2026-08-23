from rest_framework import serializers
from .models import AttendanceSession, AttendanceRecord

class AttendanceRecordSerializer(serializers.ModelSerializer):
    studentId = serializers.CharField(source='student_id_str', required=False)
    studentName = serializers.CharField(source='student_name', required=False)
    rollNo = serializers.CharField(source='roll_number', required=False)

    class Meta:
        model = AttendanceRecord
        fields = ['id', 'studentId', 'studentName', 'rollNo', 'status']

class AttendanceSessionSerializer(serializers.ModelSerializer):
    records = AttendanceRecordSerializer(many=True, required=False)
    presentCount = serializers.IntegerField(source='present_count', required=False)
    absentCount = serializers.IntegerField(source='absent_count', required=False)
    markedBy = serializers.CharField(source='marked_by', required=False)

    class Meta:
        model = AttendanceSession
        fields = [
            'id', 'date', 'branch', 'semester', 'subject',
            'records', 'present_count', 'presentCount', 'absent_count',
            'absentCount', 'percentage', 'marked_by', 'markedBy', 'created_at'
        ]

    def create(self, validated_data):
        records_data = validated_data.pop('records', [])
        session = AttendanceSession.objects.create(**validated_data)
        for r_data in records_data:
            AttendanceRecord.objects.create(
                session=session,
                student_id_str=r_data.get('student_id_str', ''),
                student_name=r_data.get('student_name', ''),
                roll_number=r_data.get('roll_number', ''),
                status=r_data.get('status', 'present')
            )
        return session
