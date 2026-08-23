from rest_framework import serializers
from .models import (
    Facility,
    FacilityPhoto,
    GalleryItem,
    ImportantLink,
    PublicFeeStructure,
    AboutCollege,
    CollegeLocation
)

class FacilityPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacilityPhoto
        fields = ['id', 'facility', 'image_url', 'caption', 'display_order']


class FacilitySerializer(serializers.ModelSerializer):
    photos = FacilityPhotoSerializer(many=True, read_only=True)
    uploaded_photos = serializers.ListField(
        child=serializers.DictField(), write_only=True, required=False
    )

    class Meta:
        model = Facility
        fields = [
            'id', 'title', 'category', 'cover_image', 'short_description',
            'detailed_notes', 'equipment_list', 'display_order', 'status',
            'created_by', 'created_at', 'updated_at', 'photos', 'uploaded_photos'
        ]

    def create(self, validated_data):
        photos_data = validated_data.pop('uploaded_photos', [])
        facility = Facility.objects.create(**validated_data)
        for p in photos_data:
            FacilityPhoto.objects.create(
                facility=facility,
                image_url=p.get('image_url', ''),
                caption=p.get('caption', ''),
                display_order=p.get('display_order', 0)
            )
        return facility

    def update(self, instance, validated_data):
        photos_data = validated_data.pop('uploaded_photos', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if photos_data is not None:
            instance.photos.all().delete()
            for p in photos_data:
                FacilityPhoto.objects.create(
                    facility=instance,
                    image_url=p.get('image_url', ''),
                    caption=p.get('caption', ''),
                    display_order=p.get('display_order', 0)
                )
        return instance


class GalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = '__all__'


class ImportantLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImportantLink
        fields = '__all__'


class PublicFeeStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicFeeStructure
        fields = '__all__'


class AboutCollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutCollege
        fields = '__all__'


class CollegeLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegeLocation
        fields = '__all__'
