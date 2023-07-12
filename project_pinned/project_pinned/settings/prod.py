import os

from .base import *  # noqa: F401, F403


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

CORS_ALLOW_CREDENTIALS = True

CSRF_COOKIE_SECURE = True
CSRF_TRUSTED_ORIGINS = ['https://mypinnedlandmark.bnbong.tk']

# SESSION_COOKIE_SECURE = True

ALLOWED_HOSTS = ["0.0.0.0", "localhost", "mypinnedlandmark.bnbong.tk"]

INSTALLED_APPS += [
    'storages',
]

CORS_ORIGIN_WHITELIST = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://0.0.0.0:3000",
    "http://localhost",
    "https://mypinnedlandmark.bnbong.tk"
]

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "pinned_db",
        "USER": os.getenv("PROD_DB_USER"),
        "PASSWORD": os.getenv("PROD_DB_USER_PASSWORD"),
        "HOST": os.getenv("PROD_DB_HOST"),
        "PORT": "5432",
    }
}

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "redis://redis:6379",
    }
}

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME")
AWS_REGION = 'ap-southeast-2'
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_S3_CUSTOM_DOMAIN = f's3.{AWS_REGION}.amazonaws.com/{AWS_STORAGE_BUCKET_NAME}'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "static/"

STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_ROOT = os.path.join(BASE_DIR, "media")

MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/'
