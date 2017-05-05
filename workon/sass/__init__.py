
import os
import subprocess
import threading
import tempfile

def sass_compiler(config):

    workon_sass_path = os.path.abspath(os.path.join(os.path.dirname(__file__)))

    for output, components in config.STYLES.items():
        name = os.path.basename(output)
        sass_file = open(f'{config.workon_sass_path}/{name}.scss', 'w+b')
        sass = f'''@charset "UTF-8";'''
        for c in components:
            c = os.path.join(f'{config.app_path}/', c)
            c = c.replace(f'{config.app_path}/workon/', f'{workon_sass_path}/')
            sass += f'\n@import "{c}";'
        sass_file.write(bytes(sass, 'utf-8'))

    for file in os.listdir(config.workon_sass_path):
        if file.endswith('.lock'):
            return
    sass_compiler = SassCompiler(config)
    sass_compiler.daemon = True
    sass_compiler.start()
    # sass_compiler.join()
    #print(sass_file.read())


class SassCompiler(threading.Thread):
    def __init__(self, config):
        self.config = config
        threading.Thread.__init__(self)

    def run(self):
        file = tempfile.NamedTemporaryFile(dir=self.config.workon_sass_path, suffix='.lock')
        workon_path = self.config.workon_path
        subprocess.call([
            "sass",
            "-r", "sass-globbing",
            "--watch",
            "--load-path", f"{self.config.app_path}",
            f"{self.config.workon_sass_path}:{self.config.app_path}/assets/css/",
            "--style", "compressed"
        ])

    # b.wait()
    # while True:
    #     connection = make_connection()
    #     process_client_connection(connection)
