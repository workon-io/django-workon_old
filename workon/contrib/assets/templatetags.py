import os
from django.utils.safestring import mark_safe
from django.templatetags.static import static

__all__ = ['lazy_register']

def lazy_register(register):

    PACKAGES_JS = {
        'materialize': [
            'workon/js/jquery.js',
            'workon/js/jquery-ui.js',
            'workon/js/materialize/materialize.js',
            'workon/js/materialize/nav.js',
            'workon/js/materialize/modal.js',
            'workon/js/materialize/scroll.js',
            'workon/js/materialize/carousel.js',
            'workon/js/materialize/form.js',
            'workon/js/materialize/search.js',
            'workon/js/materialize/tree.js',
            'workon/js/materialize/tabs.js',
        ],
        'workon': [
            'workon/assets/js/vendors/jquery.js',
            'workon/assets/js/vendors/jquery-ui.js',
        ] + [
            f'workon/assets/js/{name}' for name in sorted(os.listdir(os.path.join(os.path.dirname(__file__), 'static/workon/assets/js/'))) if name.endswith('.js')
        ],
    }

    @register.inclusion_tag('workon/assets/javascripts.html')
    def javascripts(*names, **kwargs):
        global_async = kwargs.get('async', False)
        internals = ''
        externals = ''
        if not names:
            names = PACKAGES_JS.keys()
        packages = []
        for name in names:
            paths = PACKAGES_JS.get(name)
            if paths:
                if paths == "workon-gmaps":
                    packages.append(f'https://maps.googleapis.com/maps/api/js?libraries=geometry,places&v=3.exp&key={settings.WORKON_GOOGLE_JS_API_KEY}')
                elif isinstance(paths, list):
                    packages += paths
                else:
                    packages.append(paths)
            else:
                packages.append(name)
        for path in packages:
            async = False
            if path.startswith('http') or path.startswith('//'):
                externals += f'<script type="text/javascript" src="{path}"" {"async" if async or global_async else ""}></script>'
            else:
                internals += f'<script type="text/javascript" src="{static(path)}" {"async" if async or global_async else ""}></script>'
        return {
            'externals': mark_safe(externals),
            'internals': mark_safe(internals)
        }

    PACKAGES_CSS = {
        'materialize-icons': [
            'https://fonts.googleapis.com/icon?family=Material+Icons',
        ],
    }
    @register.inclusion_tag('workon/assets/stylesheets.html')
    def stylesheets(*names):
        internals = ''
        externals = ''
        if not names:
            names = PACKAGES_CSS.keys()
        packages = []
        for name in names:
            paths = PACKAGES_CSS.get(name)
            if paths:
                if isinstance(paths, list):
                    packages += paths
                else:
                    packages.append(paths)
            else:
                packages.append(name)
        for path in packages:
            if path.startswith('http') or path.startswith('//'):
                externals += f'<link type="text/css" rel="stylesheet"  href="{path}" media="screen,projection" />'
            else:
                internals += f'<link type="text/css" rel="stylesheet"  href="{static(path)}" media="screen,projection" />'
        return {
            'externals': mark_safe(externals),
            'internals': mark_safe(internals)
        }

    @register.inclusion_tag('workon/assets/messages.html')
    def messages(messages):
        return {
            'messages': messages
        }