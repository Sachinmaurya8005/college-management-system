from django.contrib import admin
from .models import (
    Facility,
    FacilityPhoto,
    GalleryItem,
    ImportantLink,
    PublicFeeStructure,
    AboutCollege,
    CollegeLocation
)

class FacilityPhotoInline(admin.TabularInline):
    model = FacilityPhoto
    extra = 1

@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'display_order', 'created_at')
    list_filter = ('category', 'status')
    search_fields = ('title', 'short_description')
    inlines = [FacilityPhotoInline]

@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'date', 'uploaded_by')
    list_filter = ('category', 'status')
    search_fields = ('title', 'description')

@admin.register(ImportantLink)
class ImportantLinkAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'url', 'is_active', 'display_order')
    list_filter = ('category', 'is_active')
    search_fields = ('title', 'description', 'url')

@admin.register(PublicFeeStructure)
class PublicFeeStructureAdmin(admin.ModelAdmin):
    list_display = ('branch', 'fee_type', 'amount', 'academic_year', 'is_published')
    list_filter = ('is_published', 'academic_year')
    search_fields = ('branch', 'fee_type')

@admin.register(AboutCollege)
class AboutCollegeAdmin(admin.ModelAdmin):
    list_display = ('college_name', 'bteup_code', 'principal_name', 'updated_at')

@admin.register(CollegeLocation)
class CollegeLocationAdmin(admin.ModelAdmin):
    list_display = ('address', 'district', 'state', 'pincode', 'contact_phone')
