# encoding: utf-8

from django.contrib import admin

from .models import ActivationToken

@admin.register(ActivationToken)
class ActivationTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'is_used', 'actived_at', 'expire_at', 'created_at', 'updated_at')
    search_fields = ('token', 'activation_date', 'created_date' )
    list_filter = ('is_used', )

    def get_readonly_fields(self, *args, **kwargs):
        fields = [f.name for f in self.model._meta.fields]
        return fields

