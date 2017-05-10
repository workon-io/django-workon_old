from django.apps import AppConfig
from django.conf import settings
import os
import workon.utils
import workon.sass


def get_config():
    return getattr(settings, 'WORKON', {})

class WorkonConfig(AppConfig):

    name = 'workon'
    path_name = ".workon"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.app_path = workon.utils.get_project_root()
        self.cache_path = os.path.join(self.app_path, self.path_name)
        self.sass_path = os.path.join(self.cache_path, 'sass')
        self.locker_path = os.path.join(self.sass_path, 'compiler.lock')


    def ready(self, *args, **kwargs):
        super().ready(*args, **kwargs)

        if not os.path.isdir(self.cache_path):
            os.mkdir(self.cache_path)
        if not os.path.isdir(self.sass_path):
            os.mkdir(self.sass_path)

        config = get_config()
        self.STYLES = config.get('STYLES', {})
        self.THEMES = config.get('THEMES', {})
        if self.STYLES:
            workon.sass.sass_compiler(self)
























