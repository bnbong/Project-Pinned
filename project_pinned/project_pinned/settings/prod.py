import os

from .base import *  # noqa: F401, F403


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ["0.0.0.0", "localhost", "20.214.219.68"]

CORS_ORIGIN_WHITELIST = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://0.0.0.0:3000",
    "http://localhost",
    "http://20.214.219.68"
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

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "static/"

STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_ROOT = os.path.join(BASE_DIR, "media")

MEDIA_URL = "media/"
