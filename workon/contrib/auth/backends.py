from django.conf import settings
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
UserModel = get_user_model()

class EmailOrUsernameModelBackend(ModelBackend):

    def authenticate(self, request, username=None, password=None, **kwargs):
        user = None
        if '@' in username:
            kwargs = {'email__exact': username}
        else:
            kwargs = {'username__exact': username}
        try:
            user = UserModel.objects.filter(**kwargs).first()
        except UserModel.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a non-existing user (#20760).
            UserModel().set_password(password)
        else:
            if user and user.check_password(password) and self.user_can_authenticate(user):
                return user


class AuthModelBackend(ModelBackend):
    pass
    # def authenticate(self, username=None, password=None):
    #     try:
    #         user = self.\
    #              user_class.objects.get(username=username)
    #         if user.check_password(password):
    #             return user
    #     except self.user_class.DoesNotExist:
    #         return None

    # def get_user(self, user_id):
    #     try:
    #         return self.user_class.objects.get(pk=user_id)
    #     except self.user_class.DoesNotExist:
    #         return None
    # @property
    # def user_class(self):
    #     if not hasattr(self, '_user_class'):
    #         self._user_class = get_model(
    #         *settings.AUTH_USER_MODEL.split('.', 2))
    #         if not self._user_class:
    #             raise ImproperlyConfigured(
    #                       'Could not get custom user model')
    #     return self._user_class