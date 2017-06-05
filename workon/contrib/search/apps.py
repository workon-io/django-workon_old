from django.conf import settings
from django.apps import AppConfig

class AuthConfig(AppConfig):
    name = 'workon.contrib.search'
    label = 'workon_search'
    verbose_name = "Search"
