from django.apps import AppConfig
from django.conf import settings
import os
import workon.utils
import workon.sass


def get_config():
    return getattr(settings, 'WORKON', {})

class WorkonConfig(AppConfig):

    name = 'workon'
    workon_path_name = ".workon"

    def __init__(self, app_name, app_module):
        super().__init__(app_name, app_module)

        self.app_path = workon.utils.get_project_root()
        self.workon_path = os.path.join(self.app_path, self.workon_path_name)
        self.workon_sass_path = os.path.join(self.workon_path, 'sass')

    def ready(self):
        super().ready()

        if not os.path.isdir(self.workon_path):
            os.mkdir(self.workon_path)
        if not os.path.isdir(self.workon_sass_path):
            os.mkdir(self.workon_sass_path)

        config = get_config()
        self.STYLES = config.get('STYLES', {})
        if self.STYLES:
            workon.sass.sass_compiler(self)



























