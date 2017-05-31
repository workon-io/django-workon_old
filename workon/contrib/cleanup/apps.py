'''
    AppConfig for django-cleanup, prepare the cache and connect signal handlers
'''
from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _
from workon.contrib.cleanup import cache, handlers


class CleanupConfig(AppConfig):
    name = 'workon.contrib.cleanup'
    label = 'workon_cleanup'
    verbose_name = _("File and Image Cleanup")

    def ready(self):
        cache.prepare()
        handlers.connect()