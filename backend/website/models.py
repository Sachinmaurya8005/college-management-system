from django.db import models

class ContentStatus(models.TextChoices):
    DRAFT = 'Draft', 'Draft'
    PUBLISHED = 'Published', 'Published'

class Facility(models.Model):
    CATEGORY_CHOICES = (
        ('Laboratories', 'Laboratories'),
        ('Smart Classroom', 'Smart Classroom'),
        ('Library', 'Central Library'),
        ('Workshops', 'Workshops'),
        ('Computer Labs', 'Computer Labs'),
        ('Sports', 'Sports & Gymnasium'),
        ('Campus', 'Campus Infrastructure'),
        ('Hostel', 'Hostel & Mess'),
        ('Other', 'Other Facilities'),
    )

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Laboratories')
    cover_image = models.URLField(max_length=500, blank=True)
    short_description = models.CharField(max_length=300)
    detailed_notes = models.TextField(blank=True)
    equipment_list = models.JSONField(default=list, blank=True)
    display_order = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=ContentStatus.choices, default=ContentStatus.PUBLISHED)
    created_by = models.CharField(max_length=150, default='Administration')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-id']
        verbose_name = 'Campus Facility'
        verbose_name_plural = 'Campus Facilities'

    def __str__(self):
        return f"{self.title} ({self.category}) - {self.status}"


class FacilityPhoto(models.Model):
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='photos')
    image_url = models.URLField(max_length=500)
    caption = models.CharField(max_length=255, blank=True)
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'id']

    def __str__(self):
        return f"Photo for {self.facility.title} - {self.caption or self.image_url}"


class GalleryItem(models.Model):
    CATEGORY_CHOICES = (
        ('Campus', 'Campus'),
        ('Classrooms', 'Classrooms'),
        ('Laboratories', 'Laboratories'),
        ('Workshops', 'Workshops'),
        ('Events', 'Events'),
        ('Sports', 'Sports'),
        ('Library', 'Library'),
        ('Cultural Activities', 'Cultural Activities'),
        ('Other', 'Other'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image_url = models.URLField(max_length=500)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Campus')
    date = models.DateField(null=True, blank=True)
    uploaded_by = models.CharField(max_length=150, default='College Media Cell')
    status = models.CharField(max_length=20, choices=ContentStatus.choices, default=ContentStatus.PUBLISHED)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-id']
        verbose_name = 'Gallery Photo'
        verbose_name_plural = 'Gallery Photos'

    def __str__(self):
        return f"{self.title} ({self.category})"


class ImportantLink(models.Model):
    CATEGORY_CHOICES = (
        ('Technical Education', 'Technical Education'),
        ('Examination & Board', 'Examination & Board'),
        ('Scholarship & Welfare', 'Scholarship & Welfare'),
        ('Admission & Entrance', 'Admission & Entrance'),
        ('Digital Learning', 'Digital Learning'),
        ('Official Resources', 'Official Resources'),
    )

    title = models.CharField(max_length=200)
    description = models.CharField(max_length=300, blank=True)
    url = models.URLField(max_length=500)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Official Resources')
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'id']

    def __str__(self):
        return f"{self.title} ({self.category})"


class PublicFeeStructure(models.Model):
    branch = models.CharField(max_length=150, default='All Engineering Diploma Branches')
    academic_year = models.CharField(max_length=50, default='2025-2026')
    fee_type = models.CharField(max_length=150, default='Tuition & Registration Fee')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=12450.00)
    notes = models.TextField(blank=True, default='Subject to UP State Government & BTEUP guidelines.')
    effective_date = models.DateField(null=True, blank=True)
    is_published = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'id']
        verbose_name = 'Public Fee Structure'
        verbose_name_plural = 'Public Fee Structures'

    def __str__(self):
        return f"{self.branch} - {self.fee_type} (₹{self.amount})"


class AboutCollege(models.Model):
    college_name = models.CharField(max_length=255, default='Government Polytechnic Bansdeeh, Ballia')
    bteup_code = models.CharField(max_length=50, default='4412')
    aicte_approval = models.CharField(max_length=150, default='Approved by AICTE, New Delhi')
    history = models.TextField(default='Government Polytechnic Bansdeeh, Ballia was established by the Government of Uttar Pradesh to impart quality technical education and foster industrial competencies in rural and semi-urban youth of Purvanchal.')
    vision = models.TextField(default='To be a premier technical institute in Uttar Pradesh fostering innovative diploma engineers with sound technical skills, professional ethics, and societal dedication.')
    mission = models.TextField(default='Provide state-of-the-art laboratory infrastructure, industry-aligned diploma training, and holistic personal development for aspiring diploma technicians.')
    principal_name = models.CharField(max_length=150, default='Er. R. C. Srivastava')
    principal_message = models.TextField(default='Welcome to Government Polytechnic Bansdeeh, Ballia. Our institution is dedicated to building robust technical foundation, practical engineering skills, and career opportunities for our diploma students under BTEUP curriculum.')
    principal_photo = models.URLField(max_length=500, default='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces')
    achievements = models.JSONField(default=list, blank=True)
    key_highlights = models.JSONField(default=list, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'About College Information'
        verbose_name_plural = 'About College Information'

    def __str__(self):
        return f"About {self.college_name}"


class CollegeLocation(models.Model):
    address = models.CharField(max_length=300, default='Near Bansdeeh Road Railway Station, Bansdeeh, Ballia, Uttar Pradesh - 277202')
    district = models.CharField(max_length=100, default='Ballia')
    state = models.CharField(max_length=100, default='Uttar Pradesh')
    pincode = models.CharField(max_length=20, default='277202')
    landmark = models.CharField(max_length=200, default='Near Bansdeeh Road, State Highway 1')
    latitude = models.FloatField(default=25.8647)
    longitude = models.FloatField(default=84.2185)
    map_embed_url = models.URLField(max_length=1000, default='https://maps.google.com/maps?q=Bansdeeh,Ballia,Uttar+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed')
    map_view_url = models.URLField(max_length=1000, default='https://maps.google.com/?q=25.8647,84.2185')
    directions_url = models.URLField(max_length=1000, default='https://www.google.com/maps/dir//Bansdeeh+Ballia+Uttar+Pradesh+277202')
    connectivity_bus = models.CharField(max_length=300, default='Regular UPSRTC and local buses from Ballia City Bus Stand (18 km) and Bansdeeh Market (3 km).')
    connectivity_train = models.CharField(max_length=300, default='Nearest Railway Stations: Bansdeeh Road (BUI) - 4 km, Ballia Junction (BUI) - 19 km.')
    contact_phone = models.CharField(max_length=50, default='+91 94150 24510')
    contact_email = models.EmailField(default='principal.gpbansdeeh@gmail.com')

    class Meta:
        verbose_name = 'College Location & Coordinates'
        verbose_name_plural = 'College Location & Coordinates'

    def __str__(self):
        return f"{self.address} ({self.district})"
