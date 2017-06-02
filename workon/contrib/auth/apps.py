from django.conf import settings
from django.apps import AppConfig
from workon.contrib.auth import conf

class AuthConfig(AppConfig):
    name = 'workon.contrib.auth'
    label = 'workon_auth'
    verbose_name = "Authentification"

    def ready(self, *args, **kwargs):
        super().ready(*args, **kwargs)

        self.settings = getattr(getattr(settings, 'WORKON', {}), 'AUTH', {})
        self.set_conf('ACTIVATION_MESSAGE')
        self.set_conf('ACTIVATION_FALLBACK_URL')

    def set_conf(self, name):
        setattr(conf, name,
            self.settings.get(name, getattr(settings, f'WORKON_AUTH_{name}', getattr(conf, name)))
        )
