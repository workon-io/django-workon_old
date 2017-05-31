from django.conf import settings
from django.contrib import auth
from django.contrib.auth import get_user_model
import workon.utils

__all__ = [
    "authenticate_user",
    "get_user_or_none",
    "get_or_create_user"
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

def get_user_or_none(email):
    email = workon.utils.is_valid_email(email)
    if email:
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return None
    return None


def get_or_create_user(expiration_date=None, set_names_from_email=False,
                        password=None, save=True, **kwargs):
    User = get_user_model()
    attr_name = User.USERNAME_FIELD
    unique_field = kwargs.get(attr_name, None)
    if attr_name == "email":
        unique_field = workon.utils.is_valid_email(unique_field)
    if unique_field:
        try:
            user = User.objects.get(**{f'{attr_name}__iexact': unique_field })
            user._created = False
        except User.DoesNotExist:
            kwargs[attr_name] = unique_field
            user = User(
                **kwargs
                # expiration_date = expiration_date
            )
            if password:
                user.set_password(password)
            else:
                user.set_unusable_password()
            if set_names_from_email:

                if attr_name == "email" and not user.username:
                    user.username = email.split('@')[0][0:254]

                if not user.first_name and not user.last_name:
                    user_names = user.username.split('.', 2)
                    if len(user_names) == 2:
                        user.first_name = ''.join([i for i in user_names[0].capitalize() if not i.isdigit()])
                        user.last_name = ''.join([i for i in user_names[1].capitalize() if not i.isdigit()])
                    else:
                        user.first_name = ''.join([i for i in user_names[0].capitalize() if not i.isdigit()])
            if save:
                user.save()
            user._created = True
        return user
    else:
        return None

