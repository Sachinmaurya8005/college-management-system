from django.contrib import admin
from .models import TimetableSlot

@admin.register(TimetableSlot)
class TimetableSlotAdmin(admin.ModelAdmin):
    list_display = ['day', 'start_time', 'end_time', 'subject', 'teacher_name', 'branch', 'semester', 'room_no', 'slot_type']
    list_filter = ['day', 'branch', 'semester', 'slot_type']
    search_fields = ['subject', 'teacher_name', 'room_no']
