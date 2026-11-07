from .base import *
import os
import dj_database_url

# ------------------------------
# Sécurité
# ------------------------------
DEBUG = False

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

SECRET_KEY = os.environ.get('SECRET_KEY', '')

CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')

# SSL Server
SECURE_SSL_REDIRECT = True

# Proxy SSL header pour indiquer à Django qu'il est derrière un proxy sécurisé
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Cookies sécurisés pour la session
SESSION_COOKIE_SECURE = True

# Cookies sécurisés pour la protection CSRF
CSRF_COOKIE_SECURE = True

# X-content-type-options
SECURE_CONTENT_TYPE_NOSNIFF = True

# X-frame-options
X_FRAME_OPTIONS = 'DENY'

# Referrer Policy
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

# ------------------------------
# Bases de données
# ------------------------------
DATABASES = {
    'default' : dj_database_url.config(
        conn_max_age=600,
        ssl_require=True
    )
}

# ------------------------------
# Fichiers statiques whitenoise
# ------------------------------
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

SENTRY_DSN = os.environ.get('SENTRY_DSN')

if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[DjangoIntegration()],
        traces_sample_rate=1.0, # Capture 100% des transactions pour le monitoring de perf.
        send_default_pii=True
    )
