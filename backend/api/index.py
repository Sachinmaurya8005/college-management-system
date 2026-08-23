import os
from django.core.wsgi import get_wsgi_application

# Set settings module for serverless function execution
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Expose WSGI app for Vercel Python Serverless Runtime
app = get_wsgi_application()
