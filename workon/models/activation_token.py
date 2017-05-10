from django.conf import settings
from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
import workon.utils

__all__ = ['ActivationToken']

class ActivationToken(models.Model):

    created_date = models.DateTimeField('Créé le', auto_now_add=True)
    updated_date = models.DateTimeField('Modifié le', auto_now=True, db_index=True)

    email = models.EmailField('Adresse email', max_length=254, db_index=True)
    token = models.CharField('Token d\'activation', max_length=64, unique=True, db_index=True)
    is_used = models.BooleanField(u'Utilisé ?', default=False)
    expiration_date = models.DateTimeField('date d\'expiration', blank=True, null=True, db_index=True)
    activation_date = models.DateTimeField('date d\'activation', blank=True, null=True)

    class Meta:
        abstract = True
        unique_together = (('email', 'token'),)
        verbose_name = 'Clé d\'activation'
        verbose_name_plural = 'Clés d\'activation'
        ordering = ('created_date', 'activation_date',)

    def save(self, **kwargs):
        if not self.token:
            self.token = workon.utils.random_token(extra=[self.email])
        super(ActivationToken, self).save(**kwargs)

    def activate_user(self, **kwargs):
        user = workon.utils.get_or_create_user(self.email, **kwargs)
        if user:
            user.is_active = True
            user.save()
            self.is_used = user.has_usable_password()
            self.activation_date = timezone.now()
            self.save()
            return user
        return None

    def authenticate_user(self, request, user, remember=False, backend=None):
        return workon.utils.authenticate_user(request, user, remember=remember, backend=backend)
