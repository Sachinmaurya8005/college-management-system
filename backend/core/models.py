from django.db import models

class CollegeSettings(models.Model):
    college_name = models.CharField(max_length=255, default='Government Polytechnic Bansdeeh, Ballia')
    hindi_name = models.CharField(max_length=255, default='राजकीय पॉलिटेक्निक बांसडीह, बलिया')
    address = models.TextField(default='Bansdeeh, Ballia, Uttar Pradesh - 277202')
    phone = models.CharField(max_length=50, default='+91 5498 290124')
    email = models.EmailField(default='principal.gpbansdeeh@gmail.com')
    website = models.CharField(max_length=255, default='https://gpbansdeeh.ac.in')
    aicte_code = models.CharField(max_length=50, default='1-3328491021')
    bteup_code = models.CharField(max_length=50, default='4412')
    principal_name = models.CharField(max_length=150, default='Er. R. C. Srivastava')
    custom_logo_url = models.CharField(max_length=500, blank=True, default='')

    def __str__(self):
        return self.college_name
