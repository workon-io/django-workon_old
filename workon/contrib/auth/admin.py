# import datetime
# import operator
# from django.contrib import admin
# from django.db import models
# from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# from django.utils.functional import curry
# from django.conf import settings
# from django.contrib import admin
# from django.contrib.admin.models import LogEntry, ADDITION, CHANGE, DELETION
# from django.contrib.contenttypes.models import ContentType
# from django.core.urlresolvers import reverse, NoReverseMatch
# from django.utils.encoding import force_text
# from django.utils.html import escape
# from django.utils.translation import ugettext_lazy as _
# from django.contrib.auth import get_user_model

# from .models import ActivationToken

# User = get_user_model()

# @admin.register(ActivationToken)
# class ActivationTokenAdmin(admin.ModelAdmin):
#     list_display = ('user', 'token', 'is_used', 'actived_at', 'expire_at', 'created_at', 'updated_at')
#     search_fields = ('token', 'activation_date', 'created_date' )
#     list_filter = ('is_used', )

#     def get_readonly_fields(self, *args, **kwargs):
#         fields = [f.name for f in self.model._meta.fields]
#         return fields



# class PresenceFilter(admin.SimpleListFilter):
#     title = u"Présence"
#     parameter_name = 'presence'
#     def lookups(self, request, model_admin):
#         lookups = [(None, '*')] + [
#             (value, label) for value, label in User.PRESENCE_CHOICES
#         ]
#         return lookups
#     def queryset(self, request, queryset):
#         val = self.value()
#         if val:
#             return queryset.filter(presence=val).distinct()


# @admin.register(User)
# class UserAdmin(BaseUserAdmin):


#     class Media:
#         js = ( settings.STATIC_URL + "user/js/admin.js", )

#     #UserAdmin.list_display +
#     list_display = (
#         'email',
#         'first_name',
#         'last_name',
#         'is_active',
#         'is_staff',
#         'is_fake',
#         'is_superuser',
#         # 'events_count',
#         # 'groups_count',
#         # 'ads_count',
#         'is_activation_email_sent',
#         # 'last_seen_at',
#         'date_joined',
#         'connect',
#     )

#     def last_seen_at(self, obj):
#         return obj.last_seen_at
#     last_seen_at.admin_order_field = "-last_seen_at"


#     def connect(self, obj):
#         return ("""<a href="%s">S'authentifier</a>""" % "")#obj.get_absolute_superuser_connect_url())
#     connect.allow_tags = True

#     list_filter = BaseUserAdmin.list_filter + (
#         #PresenceFilter,
#         # 'profile__signup_source',
#         # 'profile__register_from',
#         # 'profile__registeration_platform'
#     )
#     ordering = ("-date_joined",)


#     def get_queryset(self, *args, **kwargs):
#         queryset = super(UserAdmin, self).get_queryset( *args, **kwargs)
#         return queryset

#     actions = ['' ]


#     # def events_count(self, model_instance):
#     #     return model_instance.owned_events.count()

#     # def ads_count(self, model_instance):
#     #     return model_instance.owned_ads.count()

#     # def groups_count(self, model_instance):
#     #     return model_instance.owned_groups.count()


#     def email(self, obj):
#         return obj.email
#     email.short_description = "Email"

#     # def send_activation_email(self, obj):
#     #     if not obj.is_active:
#     #         return u"""<a href="%s">Envoyer</a>""" % reverse('user:send-activation-email', kwargs={ 'user_id': obj.pk })
#     #     return ""
#     # send_activation_email.short_description = u"Mail d'activation"
#     # send_activation_email.allow_tags = True


#     # fieldsets = (
#     #     ('Information personnelle', {
#     #         'classes': ('contrib-tab contrib-tab-infos',),
#     #         'fields': ('first_name', 'last_name', 'email') #, 'display_filters')
#     #     }),
#     # )

#     fieldsets = (
#         (None, {
#             'classes': ('contrib-tab contrib-tab-login',),
#             'fields': ('email', 'password', 'is_activation_email_sent', 'last_login', 'date_joined')
#         }),
#         (_(u'Personal info'), {
#             'classes': ('contrib-tab contrib-tab-infos',),
#             'fields': ('first_name', 'last_name', 'username', 'phone_number', 'avatar')
#         }),
#         (_(u'Permissions'), {
#             'classes': ('contrib-tab contrib-tab-perms',),
#             'fields': ('is_active', 'is_staff', 'is_superuser',
#                                        'groups', 'user_permissions')
#         }),
#     )
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('email', 'password1', 'password2'),
#         }),
#     )

#     inlines = (
#         # CustomerProfileInline,
#         # UserSettingsInline,
#     )

#     contrib_form_tabs = (
#         ('login', u"Login"),
#         ('infos', u"Informations"),
#         ('perms', u"Permissions"),
#         # ('settings', u"Paramètres"),
#         # ('profile', u"Profile"),
#         # ('content', u"Contenus"),
#     )
