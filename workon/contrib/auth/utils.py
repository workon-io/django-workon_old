from django.conf import settings
from django.contrib import auth
from django.contrib.auth import get_user_model
from django.utils import timezone
from workon.contrib.auth import conf
import workon.utils

__all__ = [
    "authenticate_user",
    "get_activation_token",
    "get_valid_activation_token",
    "create_activation_token",
]

def authenticate_user(request, user, remember=True, backend=None, expiry=60 * 60 * 24 * 365 * 10):
    if user:
        if not hasattr(user, 'backend'):
            if backend:
                user.backend = backend
            elif hasattr(settings, 'AUTHENTICATION_BACKENDS') and len(settings.AUTHENTICATION_BACKENDS):
                user.backend = settings.AUTHENTICATION_BACKENDS[0]
            else:
                user.backend = 'django.contrib.auth.backends.ModelBackend'
        if request.user.is_authenticated():
            auth.logout(request)
        auth.login(request, user)
        request.session.set_expiry(expiry if remember else 0)
        return True
    else:
        return False

def get_activation_token(token, is_used=False):
    from workon.contrib.auth.models import ActivationToken
    try:
        return ActivationToken.objects.get(token=token, is_used=is_used)
    except ActivationToken.DoesNotExist:
        return None

def get_valid_activation_token(user, is_used=False):
    from workon.contrib.auth.models import ActivationToken
    return ActivationToken.objects.filter(
        user=user,
        is_used=is_used,
        expire_at__gt=timezone.now()
    ).first()

def create_activation_token(user, expiration_date=None):
    from workon.contrib.auth.models import ActivationToken
    activation_token, created = ActivationToken.objects.get_or_create(
        user=user,
        is_used=False
    )
    activation_token.expiration_date = expiration_date
    activation_token.save()
    return activation_token
