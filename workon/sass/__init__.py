
import os
import subprocess
import threading
import tempfile
import psutil
import glob
import re

def sass_compiler(config):


    for proc in psutil.process_iter():
        if proc.name() == "sass":
            proc.kill()

    sass_path = os.path.abspath(os.path.join(os.path.dirname(__file__)))
    cache_path = config.cache_path

    for output, components in config.STYLES.items():
        name = os.path.basename(output)
        sass_file = open(f'{config.sass_path}/{name}.scss', 'w+b')
        sass = f'''@charset "UTF-8";'''
        sass += f'\n@import "{sass_path}/workon/workon";'
        for c in components:

            if c == "materialize":
                path = f'{sass_path}/materialize'
                variables_path = f'{cache_path}/sass/_materialize_variables.scss'
                variables_file = open(variables_path, 'w+b')
                variables = str(open(f'{sass_path}/materialize/components/_variables.scss', 'r+b').read(), 'utf-8')
                variables_settings = config.THEMES.get('materialize', {}).get('variables')
                for name, value in variables_settings.items():
                    reg = re.compile(r'\${}\:(.*)\;'.format(name))
                    if reg.search(variables):
                        variables = re.sub(reg, f'${name}: {value} !default;', variables)
                    else:
                        variables += f'\n${name}: {value} !default;'
                variables_file.write(bytes(variables, 'utf-8'))
                line = str(open(f'{path}/_materialize.scss', 'r+b').read(), 'utf-8')
                line = line.replace('components/variables', f'{cache_path}/sass/materialize_variables')
                line = line.replace('components/', f'{path}/components/')
                sass += line
                sass += f'\n@import "{sass_path}/materialize/forms";'

            elif c == "materialize-backend":
                sass += f'\n@import "{sass_path}/materialize/backend";'

            elif c == "slick":
                sass += f'\n@import "{sass_path}/workon/slick";'

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

    sass_compiler = SassCompiler(config)
    sass_compiler.daemon = True
    sass_compiler.start()


class SassCompiler(threading.Thread):
    def __init__(self, config):
        self.config = config
        threading.Thread.__init__(self)

    def run(self):
        cmd = [
            "sass",
            "--watch",
            "--load-path", f"{self.config.app_path}",
            f"{self.config.sass_path}:{self.config.app_path}/assets/css/",
            "--style", "compressed"
        ]
        print(" ".join(cmd))
        subprocess.call(cmd)

    # b.wait()
    # while True:
    #     connection = make_connection()
    #     process_client_connection(connection)
