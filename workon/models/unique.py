from django.db import models

__all__ = ['Unique']

class Unique(models.Model):

    class Meta:
        abstract = True

    @classmethod
    def get(cls):
        instance = cls._meta.default_manager.first()
        if not instance:
            instance = cls()
        return instance

    def save(self, *args, **kwargs):
        previous = self._meta.default_manager.first()
        if previous:
            self.pk = previous.pk
        super().save(*args, **kwargs)
