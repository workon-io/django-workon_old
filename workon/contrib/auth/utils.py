from django.utils import timezone
import workon.utils

__all__ = [
    "get_activation_token",
    "get_valid_activation_token",
    "create_activation_token",
]


def get_activation_token(token, is_used=False):
    from .models import ActivationToken
    try:
        return ActivationToken.objects.get(token=token, is_used=is_used)
    except:
        return None

def get_valid_activation_token(email, is_used=False):
    from .models import ActivationToken
    email = workon.utils.is_valid_email(email)
    if email:
        return ActivationToken.objects.filter(
            email=email,
            is_used=is_used,
            expiration_date__gt=timezone.now()
        ).first()
    return None

def create_activation_token(email, expiration_date=None):
    from .models import ActivationToken
    email = workon.utils.is_valid_email(email)
    if email:
        activation_token, created = ActivationToken.objects.get_or_create(
            email=email,
            is_used=False,
        )
        activation_token.expiration_date = expiration_date
        activation_token.save()
        return activation_token
    return None
