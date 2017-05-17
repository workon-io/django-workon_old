import datetime
import hashlib
from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.validators import MaxLengthValidator
from django.dispatch import receiver
from django.utils import timezone
from django.utils import formats
from django.contrib.auth.models import AbstractUser, AbstractBaseUser, User as BaseUser, UserManager, PermissionsMixin
from sorl.thumbnail import get_thumbnail
import workon.utils
import workon.fields

__all__ = ['User']

class User(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(_('Email'), unique=True, db_index=True)
    username = models.CharField(_('username'), blank=True, null=True, max_length=254, db_index=True)
    first_name = models.CharField(_('first name'), max_length=254, blank=True, null=True, db_index=True)
    last_name = models.CharField(_('last name'), max_length=254, blank=True, null=True, db_index=True)
    phone_number = models.CharField(u'Téléphone', max_length=254, blank=True, null=True)
    avatar = workon.fields.ImageField(u"Photo de profil", blank=True, null=True,
        upload_to=workon.utils.unique_filename("user/avatar/%Y/%m/", original_filename_field='avatar_filename')
    )

    is_staff = models.BooleanField(_('staff status'), default=False, help_text='Designates whether the user can log into this admin site.')
    is_active = models.BooleanField(_('active'), default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.')

    # is_connection_email_sent = models.BooleanField(u'Email de connexion envoyé', default=False)
    is_fake = models.BooleanField('Fake', default=False)
    is_never_login = models.BooleanField('Ne s\'est jamais connecté', default=True)
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    public_key = models.CharField(_(u"Clé publique"), max_length=64, unique=True, db_index=True, null=True)
    private_key = models.CharField(_(u"Clé privée"), max_length=64, unique=True, db_index=True, null=True)

    is_activation_email_sent = models.BooleanField("Email d'activation envoyé ?", default=False)
    current_url = models.CharField("Url en cours", max_length=1000, null=True, blank=True, db_index=True)

    is_visible_phone_number = models.BooleanField(u"Numéro de téléphone visible sur le site (Contact annonce etc..)", default=True)
    short_description = models.TextField(u"Quelques mots à propos de vous...", validators=[MaxLengthValidator(200)], blank=True, null=True)

    PRESENCE_OFF, PRESENCE_ON, PRESENCE_BUSY, PRESENCE_IDLE, PRESENCE_AWAY = (
        'OFF', 'ON', 'BUSY', 'IDLE', 'AWAY'
    )
    PRESENCE_CHOICES = (
        (PRESENCE_OFF, u"off"),
        (PRESENCE_ON, u"on"),
        (PRESENCE_BUSY, u"busy"),
        (PRESENCE_IDLE, u"idle"),
        (PRESENCE_AWAY, u"away"),
    )
    presence = models.CharField(u'Présence', max_length=30, default=PRESENCE_OFF)
    last_seen_at = models.DateTimeField(u'Dernière fois vue', null=True, blank=True)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    DEFAULT_AVATAR_URL = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&amp;f=y"

    class Meta(AbstractUser.Meta):
        abstract = True
        swappable = 'AUTH_USER_MODEL'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def authenticate(self, request, remember=False, backend=None):
        return workon.utils.authenticate_user(request, self, remember=remember, backend=backend)

    def activate(self):
        if not self.is_active:
            self.is_active = True
            self.save()

    # IMPORTANT override since 1.10 stupid normalize username (email=username problem)
    def clean(self):
        self.username = self.normalize_username(self.username)

    def to_json(self, **kwargs):
        data = {
            'presence': self.presence,
            'username': self.get_full_name(),
            'name_initials': self.get_name_initials(),
            'last_seen_at': formats.date_format(self.last_seen_at) if self.last_seen_at else None,
            'human_last_seen_at': formats.date_format(self.last_seen_at, "SHORT_DATETIME_FORMAT") if self.last_seen_at else None,
            'avatar_url': self.get_avatar_url(),
            'id': self.pk,
        }
        data.update(**kwargs)
        return data


    def set_last_seen_at_flag(self):
        if self.presence == User.PRESENCE_OFF and self.last_seen_at and self.last_seen_at > yesterday:
            self.last_seen_at_flag = self.last_seen_at

    def set_last_seen_at_flag(self):
        if self.presence == User.PRESENCE_OFF and self.last_seen_at:
            yesterday = timezone.now() - datetime.timedelta(days=1)
            if self.last_seen_at > yesterday:
                self.last_seen_at_flag = self.last_seen_at


    def set_public_key(self, hash_func=hashlib.sha256):
        self.public_key = self.generate_random_token()

    def set_private_key(self, hash_func=hashlib.sha256):
        self.private_key = self.generate_random_token()

    def generate_random_token(self, hash_func=hashlib.sha256):
        return contrib.utils.random_token(extra=[self.id if self.id else self.email, self.email])

    def get_username(self):
        "Return the identifying username for this User"
        return self.get_username_or_email()

    def get_username_or_email(self):
        return self.username if self.username else self.email.split('@')[0]

    def get_short_name(self):
        "Returns the short name for the user."
        if not self.first_name:
            if self.username:
                return self.username.strip()
            else:
                return self.email.split('@')[0].strip()
        return self.first_name

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        if not self.first_name and not self.last_name:
            if self.username:
                return self.username.strip()
            else:
                return self.email.strip()
        names = []
        if self.first_name:
            names.append(self.first_name)
        if self.last_name:
            names.append(self.last_name)
        full_name = " ".join(names)
        return full_name.strip()

    def get_name_initials(self, *args, **kwargs):
        if self.first_name and self.last_name:
            return self.first_name[0]+self.last_name[0]
        else:
            return self.username[0:1]
    @property
    def name_initials(self):
        return self.get_name_initials()

    def get_avatar_small(self):
        return self.get_avatar_url(size=40)

    def get_avatar_medium(self):
        return self.get_avatar_url(size=150)

    def get_avatar_large(self):
        return self.get_avatar_url(size=500)

    def get_avatar_url(self, size=200, default=DEFAULT_AVATAR_URL):
        if self.avatar:
            if get_thumbnail:
                return get_thumbnail(self.avatar, '%sx%s' % (size,size), crop='center', format="PNG", quality=99).url
            else:
                return self.avatar.url
        else:
            return self.DEFAULT_AVATAR_URL
            return None#"/static/front/images/logo_small.png"
            gravatar_url = "https://www.gravatar.com/avatar/" + hashlib.md5(self.email.lower()).hexdigest() + "?"
            gravatar_url += urllib.urlencode({'d':default, 's':str(size)})
            return gravatar_url





