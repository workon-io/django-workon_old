# encoding: utf-8
from django.views import generic

__all__ = ['Save']


class Save(generic.UpdateView):

    def get_object(self, *args, **kwargs):
        if hasattr(self, '_object'):
            return getattr(self, '_object')
        self.created = False
        try:
            self.object = super(Save, self).get_object()
        except AttributeError:
            self.object = self.model()
            self.created = True

        setattr(self, '_object', self.object)
        return self.object
