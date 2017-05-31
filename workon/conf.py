import os
import sys
from django.apps import AppConfig
from django.conf import settings
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
        self.cache_sass_path = os.path.join(self.cache_path, 'sass')
        self.is_runserver = (len(sys.argv) > 1 and sys.argv[1] == 'runserver')

    def ready(self, *args, **kwargs):
        super().ready(*args, **kwargs)
        config = get_config()

        if not os.path.isdir(self.cache_path):
            os.mkdir(self.cache_path)
        if not os.path.isdir(self.cache_sass_path):
            os.mkdir(self.cache_sass_path)

        self.STYLES = config.get('STYLES', {})
        self.THEMES = config.get('THEMES', {})
        if self.is_runserver and self.STYLES:
            workon.sass.sass_compiler(self)
























