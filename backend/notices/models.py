from django.db import models

class NoticeItem(models.Model):
    CATEGORY_CHOICES = (
        ('Examination', 'Examination'),
        ('Fees', 'Fees'),
        ('Events', 'Events'),
        ('Academic', 'Academic'),
        ('Holiday', 'Holiday'),
        ('General', 'General'),
    )
    PRIORITY_CHOICES = (
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    )
    AUDIENCE_CHOICES = (
        ('All', 'All'),
        ('Students', 'Students'),
        ('Teachers', 'Teachers'),
    )

    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='General')
    publish_date = models.DateField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')
    target_audience = models.CharField(max_length=20, choices=AUDIENCE_CHOICES, default='All')
    issued_by = models.CharField(max_length=150, default='Office of the Principal')
    reference_no = models.CharField(max_length=100, default='GPB/ADMIN/2026/101')
    attachment_name = models.CharField(max_length=255, blank=True)
    is_confidential_staff = models.BooleanField(default=False)
    discussion_comments = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-publish_date', '-id']

    def __str__(self):
        return f"{self.title} ({self.category})"
