import os
import sys
from django.apps import AppConfig, apps
from django.conf import settings
from workon.contrib.assets.sass_compiler import sass_compiler
import workon.utils

def get_config():
    return getattr(settings, 'WORKON', {})

class AssetsConfig(AppConfig):
    name = 'workon.contrib.assets'
    label = 'workon_assets'
    verbose_name = "Workon assets"
    path_name = ".workon-sass"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.app_path = workon.utils.get_project_root()
        self.cache_path = os.path.join(self.app_path, self.path_name)
        self.is_runserver = (len(sys.argv) > 1 and sys.argv[1] == 'runserver')


    def ready(self, *args, **kwargs):
        super().ready(*args, **kwargs)
        config = get_config()

        if not os.path.isdir(self.cache_path):
            os.mkdir(self.cache_path)

        self.STYLES = config.get('STYLES', {})
        self.THEMES = config.get('THEMES', {})
        if self.is_runserver and self.STYLES:
            sass_compiler(self)
