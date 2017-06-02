from django.conf import settings
from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
import workon.utils

__all__ = ['ActivationToken']

class ActivationToken(models.Model):

    created_at = models.DateTimeField('Créé le', auto_now_add=True)
    updated_at = models.DateTimeField('Modifié le', auto_now=True, db_index=True)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=u'Utilisateur', db_index=True)

    token = models.CharField('Token d\'activation', max_length=64, db_index=True)
    is_used = models.BooleanField(u'Utilisé ?', default=False)
    expire_at = models.DateTimeField('Expire le', blank=True, null=True, db_index=True)
    actived_at = models.DateTimeField('Activé le', blank=True, null=True)

    class Meta:
        unique_together = (('user', 'token'),)
        verbose_name = 'Clé d\'activation'
        verbose_name_plural = 'Clés d\'activation'
        ordering = ('created_at', 'actived_at',)

    def save(self, **kwargs):
        if self.user or self.email:
            if not self.token:
                self.token = workon.utils.random_token(extra=[self.email])
            super(ActivationToken, self).save(**kwargs)

    def activate_user(self, **kwargs):
        self.user.is_active = True
        self.user.save()
        self.is_used = user.has_usable_password()
        self.actived_at = timezone.now()
        self.save()
        return user

    def authenticate_user(self, request, user, remember=False, backend=None):
        return workon.utils.authenticate_user(request, user, remember=remember, backend=backend)

    @models.permalink
    def get_absolute_url(self):
        return ('workon:auth-activate', (self.token, ), {})



