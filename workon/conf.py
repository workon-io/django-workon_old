from django.apps import AppConfig
import workon.utils


class WorkonConfig(AppConfig):

    name = 'workon'

    # def ready(self, *args, **kwargs):

    #     print('WORKON READY')
    #     from django.urls import get_resolver
    #     for p in get_resolver().url_patterns: print('PATTERN', p)

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)

    #     self.app_path = workon.utils.get_project_root()
    #     self.cache_path = os.path.join(self.app_path, self.path_name)
    #     self.cache_sass_path = os.path.join(self.cache_path, 'sass')
    #     self.is_runserver = (len(sys.argv) > 1 and sys.argv[1] == 'runserver')


    # def ready(self, *args, **kwargs):
    #     super().ready(*args, **kwargs)
    #     config = get_config()

    #     if not os.path.isdir(self.cache_path):
    #         os.mkdir(self.cache_path)
    #     if not os.path.isdir(self.cache_sass_path):
    #         os.mkdir(self.cache_sass_path)

    #     self.STYLES = config.get('STYLES', {})
    #     self.THEMES = config.get('THEMES', {})
    #     if self.is_runserver and self.STYLES:
    #         workon.sass.sass_compiler(self)
























