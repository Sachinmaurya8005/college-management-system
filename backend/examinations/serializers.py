from rest_framework import serializers
from .models import ExamSchedule, StudentResult, SubjectMark

class ExamScheduleSerializer(serializers.ModelSerializer):
    examName = serializers.CharField(source='exam_name', required=False)
    subjectCode = serializers.CharField(source='subject_code', required=False)
    examDate = serializers.DateField(source='exam_date', required=False)
    startTime = serializers.CharField(source='start_time', required=False)
    endTime = serializers.CharField(source='end_time', required=False)
    roomNo = serializers.CharField(source='room_no', required=False)
    maxMarks = serializers.IntegerField(source='max_marks', required=False)
    passingMarks = serializers.IntegerField(source='passing_marks', required=False)
    examType = serializers.CharField(source='exam_type', required=False)

    class Meta:
        model = ExamSchedule
        fields = [
            'id', 'exam_name', 'examName', 'branch', 'semester', 'subject',
            'subject_code', 'subjectCode', 'exam_date', 'examDate', 'start_time',
            'startTime', 'end_time', 'endTime', 'room_no', 'roomNo', 'max_marks',
            'maxMarks', 'passing_marks', 'passingMarks', 'exam_type', 'examType',
            'created_at'
        ]

class SubjectMarkSerializer(serializers.ModelSerializer):
    code = serializers.CharField(source='subject_code', required=False)
    name = serializers.CharField(source='subject_name', required=False)
    theoryMax = serializers.IntegerField(source='theory_max', required=False)
    theoryObtained = serializers.IntegerField(source='theory_obtained', required=False)
    practicalMax = serializers.IntegerField(source='practical_max', required=False)
    practicalObtained = serializers.IntegerField(source='practical_obtained', required=False)
    totalMax = serializers.IntegerField(source='total_max', required=False)
    totalObtained = serializers.IntegerField(source='total_obtained', required=False)

    class Meta:
        model = SubjectMark
        fields = [
            'id', 'subject_code', 'code', 'subject_name', 'name', 'theory_max',
            'theoryMax', 'theory_obtained', 'theoryObtained', 'practical_max',
            'practicalMax', 'practical_obtained', 'practicalObtained', 'total_max',
            'totalMax', 'total_obtained', 'totalObtained', 'grade', 'status'
        ]

class StudentResultSerializer(serializers.ModelSerializer):
    rollNo = serializers.CharField(source='roll_number', required=False)
    studentName = serializers.CharField(source='student_name', required=False)
    academicYear = serializers.CharField(source='academic_year', required=False)
    grandTotalMax = serializers.IntegerField(source='grand_total_max', required=False)
    grandTotalObtained = serializers.IntegerField(source='grand_total_obtained', required=False)
    subjects = SubjectMarkSerializer(many=True, read_only=True)

    class Meta:
        model = StudentResult
        fields = [
            'id', 'roll_number', 'rollNo', 'student_name', 'studentName',
            'branch', 'semester', 'academic_year', 'academicYear',
            'grand_total_max', 'grandTotalMax', 'grand_total_obtained',
            'grandTotalObtained', 'percentage', 'cgpa', 'division', 'status',
            'subjects', 'created_at'
        ]
