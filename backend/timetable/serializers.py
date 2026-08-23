from rest_framework import serializers
from .models import TimetableSlot

class TimetableSlotSerializer(serializers.ModelSerializer):
    startTime = serializers.CharField(source='start_time', required=False)
    endTime = serializers.CharField(source='end_time', required=False)
    subjectCode = serializers.CharField(source='subject_code', required=False, allow_blank=True)
    teacherName = serializers.CharField(source='teacher_name', required=False)
    roomNo = serializers.CharField(source='room_no', required=False)
    type = serializers.CharField(source='slot_type', required=False)

    class Meta:
        model = TimetableSlot
        fields = [
            'id', 'branch', 'semester', 'day', 'start_time', 'startTime',
            'end_time', 'endTime', 'subject', 'subject_code', 'subjectCode',
            'teacher_name', 'teacherName', 'room_no', 'roomNo', 'slot_type',
            'type', 'created_at'
        ]
