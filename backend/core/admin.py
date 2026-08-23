from django.contrib import admin
from .models import CollegeSettings

@admin.register(CollegeSettings)
class CollegeSettingsAdmin(admin.ModelAdmin):
    list_display = ['college_name', 'bteup_code', 'aicte_code', 'phone', 'email', 'principal_name']
