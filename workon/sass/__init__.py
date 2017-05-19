
import os
import time
import subprocess
from multiprocessing import Process
import tempfile
import psutil
import glob
import re
import inspect
import signal
import logging
import collections
from django.conf import settings
from django.utils.module_loading import import_module, import_string

try:
    from watchdog.observers import Observer
    from watchdog.events import LoggingEventHandler, FileSystemEventHandler
    class EventHandler(FileSystemEventHandler):

        def __init__(self, watcher, *args, **kwargs):
            self.watcher = watcher
            super().__init__( *args, **kwargs)

        def on_any_event(self, event):
            self.watcher.process_changes(event)
    WATCHDOG_FOUND = True
except:
    WATCHDOG_FOUND = False

def sass_compiler(config):
    if not WATCHDOG_FOUND:
        return
    for proc in psutil.process_iter():
        if proc.name() == "sass":
            proc.kill()

    p = Process(name='workon_sass_compiler', target=sass_watch, args=(config,))
    p.start()

def sass_watch(config):

    watcher = Watcher(config=config)
    watcher.lock_and_watch()



class Watcher(object):
    handler = None
    command = None
    blocked = False
    stout_prefix = 'sass'
    configs = []

    def __init__(self, config=None, *args, **kwargs):
        self.config = config
        self.sass_path = os.path.abspath(os.path.join(os.path.dirname(__file__)))
        self.cache_path = config.cache_path
        self.cache_sass_path = config.cache_sass_path
        self.lock_path = f'{self.cache_sass_path}/sass_compiler.lock'
        self.observer = Observer()
        self.event_handler = EventHandler(self)
        # self.notifier.max_user_watches=16384
        paths = self.get_watched_paths()
        for appname, path in paths:
            self.observer.schedule(self.event_handler, path, recursive=True)
            self.print_head('Watching \033[94m%s\033[0m' % (appname))
        self.process()

    def is_single(self): return not os.path.isfile(self.lock_path)

    def lock_and_watch(self):
        if self.is_single():
            open(self.lock_path, 'w+b')
            self.watch()


    def process(self):
        config = self.config

        for output, components in collections.OrderedDict(config.STYLES).items():
            file_name = os.path.basename(output)
            file_path = f'{self.cache_sass_path}/{file_name}.scss'
            sass_file = open(file_path, 'w+b')
            sass = f'''@charset "UTF-8";'''
            sass += f'\n@import "{self.sass_path}/mixins";'
            for c in components:

                if c == "materialize" or c == "workon":
                    path = f'{self.sass_path}/{c}'
                    variables_path = f'{self.cache_sass_path}/_{c}_variables.scss'
                    variables_file = open(variables_path, 'w+b')
                    variables = str(open(f'{self.sass_path}/{c}/components/_variables.scss', 'r+b').read(), 'utf-8')
                    variables_settings = collections.OrderedDict(config.THEMES.get(f'{c}', {}).get('variables'))
                    cursor = -1
                    for name, value in variables_settings.items():
                        reg = re.compile(r'\${}\:(.*)\;'.format(name))
                        m = reg.search(variables)
                        if m:
                            injection = f'${name}: {value} !default;'
                            variables = re.sub(reg, injection, variables)
                            cursor = m.end() + ( len(injection) - len(m.group()) )
                        else:
                            injection = f'\n${name}: {value};\n'
                            variables = variables[:cursor+1] + injection + variables[cursor+1:]
                    variables_file.write(bytes(variables, 'utf-8'))
                    variables_file.close()
                    line = str(open(f'{path}/_{c}.scss', 'r+b').read(), 'utf-8')
                    line = line.replace('components/variables', f'{self.cache_path}/sass/{c}_variables')
                    line = line.replace('components/', f'{path}/components/')
                    sass += line
                    sass += f'\n@import "{self.sass_path}/{c}/forms";'
                    sass += f'\n@import "{self.sass_path}/{c}/contrib";'

                elif c == "workon-backend":
                    sass += f'\n@import "{self.sass_path}/workon/backend";'

                else:
                    files = []
                    c = os.path.join(f'{config.app_path}/', c)
                    if c[-1] == "*":
                        for file in glob.glob(c):
                            files.append(file)
                    else:
                        files.append(f'{c}')
                    for file in files:
                        sass += f'\n@import "{file}";'

            sass_file.write(bytes(sass, 'utf-8'))
            sass_file.close()
            cmd = [
                "sass",
                "--load-path", f"{self.config.app_path}",
                f"{file_path}:{self.config.app_path}/assets/css/{file_name}.css",
                "--style", "compressed"
            ]
            self.print_head(f'Compiling \033[94m{" ".join(cmd)}\033[0m')
            subprocess.call(cmd)

    def process_changes(self, event):
        if not event.src_path.startswith(self.cache_path):
            if event.src_path.endswith('.scss'):
                self.process()


    def get_watched_paths(self, recursive=True):
        app_paths = []

        project_path = self.config.app_path
        if os.path.exists(project_path):
            app_paths.append((project_path, project_path))

        for path in settings.STATICFILES_DIRS:
            styl_path = path
            if os.path.exists(styl_path):
                app_paths.append((styl_path, styl_path))

        for appname in settings.INSTALLED_APPS:
            try:
                try:
                    app = import_string(appname)
                except:
                    app = import_module(appname)
                if inspect.ismodule(app):
                    pass

                elif inspect.isclass(app):
                    app = import_module(app.name)
                else:
                    raise Exception

                #styl_path = os.path.join(os.path.dirname(app.__file__), 'styl')
                styl_path = os.path.dirname(app.__file__)
                if os.path.exists(styl_path):
                    app_paths.append((appname, styl_path))
            except Exception as e:
                self.print_error(f'Failed to import {appname} ({e})')

        if recursive:
            for path in app_paths:
                for path2 in app_paths:
                    if path[1] != path2[1] and path2[1].startswith(path[1]):
                        app_paths.remove(path2)
        return app_paths

    def sigterm(self, signum, frame):
        try:
            self.observer.stop()
            self.observer.join()
            os.remove(self.lock_path)
        except:
            pass
        exit(0)

    def watch(self, paths=[]):
        signal.signal(signal.SIGTERM, self.sigterm)
        signal.signal(signal.SIGINT , self.sigterm)
        logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
        self.observer.start()
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt as e:
            self.observer.stop()
        self.observer.join()

    def print_r(self, pattern, str):
        output = pattern % (self.stout_prefix, str)
        if self.command:
            try:
                self.command.stdout.write(output)
            except:
                self.command.stdout.write(output.decode('utf8', 'ignore'))
            self.command.stdout.flush()
        else:
            print(output)

    def print_head(self, str):
        self.print_r("\033[95m[%s]\033[0m %s", str)

    def print_process(self, str):
        self.print_r("\033[95m[%s]\033[0m \033[93m%s\033[0m", str)

    def print_success(self, str):
        self.print_r("\033[95m[%s]\033[0m \033[92m%s\033[0m", str)

    def print_error(self, str):
        self.print_r("\033[95m[%s]\033[0m \033[91m%s\033[0m", str)

    def getext(filename):
        "Get the file extension."
        return os.path.splitext(filename)[-1].lower()