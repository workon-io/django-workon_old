import re
import os
import random
from django import forms
from django import template
from django.template import Context
from django.template.loader import get_template
from django.conf import settings
from math import floor
from urllib.parse import urlparse, urlencode, parse_qs, urlsplit, urlunsplit
from django.utils.safestring import mark_safe
from django.templatetags.static import static as original_static
from django.core.files.storage import get_storage_class, FileSystemStorage
import workon.utils

register = template.Library()


@register.filter(name='range')
def range_filter(x):
    return range(x)

@register.filter
def jsonify(obj):
    return workon.utils.jsonify(obj)

@register.filter
def startswith(str, compare):
    return str.startswith(compare)

if "compressor" in settings.INSTALLED_APPS:
    @register.tag
    def compress(parser, token):
        from compressor.templatetags.compress import compress
        return compress(parser, token)
else:
    @register.to_end_tag
    def compress(parsed, context, token):
        return parsed

@register.filter
def from_settings(name):
    return getattr(settings, name, "")

@register.simple_tag
def settings_value(name):
    return getattr(settings, name, "")
















PACKAGES_JS = {
    'materialize': [
        'workon/js/jquery.js',
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
        'workon/js/jquery.js',
    ] + [
        f'workon/js/workon/date_picker/{name}' for name in sorted(os.listdir(os.path.join(os.path.dirname(__file__), '../static/workon/js/workon/date_picker/'))) if name.endswith('.js')
    ] + [
        f'workon/js/workon/{name}' for name in sorted(os.listdir(os.path.join(os.path.dirname(__file__), '../static/workon/js/workon/'))) if name.endswith('.js')
    ],
}

@register.inclusion_tag('workon/js.html')
def workon_js(*names, **kwargs):
    global_async = kwargs.get('async', False)
    internals = ''
    externals = ''
    if not names:
        names = PACKAGES_JS.keys()
    packages = []
    for name in names:
        paths = PACKAGES_JS.get(name)
        if paths:
            if isinstance(paths, list):
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
            internals += f'<script type="text/javascript" src="{original_static(path)}" {"async" if async or global_async else ""}></script>'
    return {
        'externals': mark_safe(externals),
        'internals': mark_safe(internals)
    }


PACKAGES_CSS = {
    'materialize-icons': [
        'https://fonts.googleapis.com/icon?family=Material+Icons',
    ],
}

@register.inclusion_tag('workon/css.html')
def workon_css(*names):
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
            internals += f'<link type="text/css" rel="stylesheet"  href="{original_static(path)}" media="screen,projection" />'
    return {
        'externals': mark_safe(externals),
        'internals': mark_safe(internals)
    }



















#################### URLS
@register.filter
def absolute_url(url):
    return workon.utils.canonical_url(url)

@register.filter
def static(url):
    return original_static(url)

@register.filter
def external_url(url):
    return workon.utils.append_protocol(url)

@register.filter
def absolute_static(url):
    return absolute_url(original_static(url))

@register.filter
def static_image(url):
    storage_class = get_storage_class(settings.STATICFILES_STORAGE)
    storage = storage_class()
    image = ImageFile(storage.open(url))
    image.storage = storage
    return image, image.url

@register.filter
def replace_urls_to_href(text):
    return mark_safe(workon.utils.replace_urls_to_href(text))

@register.simple_tag()
def url_replace_param(url, param_name, param_value):

    scheme, netloc, path, query_string, fragment = urlsplit(url)
    query_params = parse_qs(query_string)

    query_params[param_name] = [param_value]
    new_query_string = urlencode(query_params, doseq=True)

    return mark_safe(urlunsplit((scheme, netloc, path, new_query_string, fragment)))
#################### END URLS








#################### THUMBNAIL
if "sorl.thumbnail" in settings.INSTALLED_APPS:
    from sorl.thumbnail.templatetags.thumbnail import ThumbnailNode
    from django.templatetags.static import static
    from django.contrib.staticfiles.storage import staticfiles_storage
    from django.contrib.staticfiles import finders
    from django.utils.six import text_type
    from sorl.thumbnail.shortcuts import get_thumbnail
    from sorl.thumbnail.images import ImageFile, DummyImageFile

    class StaticThumbnailNode(ThumbnailNode):

        def _render(self, context):
            file_ = self.file_.resolve(context)
            geometry = self.geometry.resolve(context)
            options = {}
            for key, expr in self.options:
                noresolve = {'True': True, 'False': False, 'None': None}
                value = noresolve.get(text_type(expr), expr.resolve(context))
                if key == 'options':
                    options.update(value)
                else:
                    options[key] = value
            thumbnail = workon.utils.thumbnail_static(file_, geometry, **options)


            if not thumbnail or (isinstance(thumbnail, DummyImageFile) and self.nodelist_empty):
                if self.nodelist_empty:
                    return self.nodelist_empty.render(context)
                else:
                    return ''

            if self.as_var:
                context.push()
                context[self.as_var] = thumbnail
                output = self.nodelist_file.render(context)
                context.pop()
            else:
                output = thumbnail.url

            return output

    @register.tag
    def thumbnail(parser, token):
        return ThumbnailNode(parser, token)

    @register.tag
    def thumbnail_static(parser, token):
        return StaticThumbnailNode(parser, token)
else:
    @register.to_end_tag
    def thumbnail(parser, token):
        return parsed

    @register.to_end_tag
    def thumbnail_static(parsed, context, token):
        return parsed
#################### END THUMBNAIL





#################### METASDATA
@register.inclusion_tag('_link_metadata.html')
def social_link_metadata(html):
    return {
        'id': "link-metadata-%s" % random.randint(1,100),
        'html': html,
    }
#################### END METASDATA











#################### METAS
def _setup_metas_dict(parser):
    try:
        parser._metas
    except AttributeError:
        parser._metas = {}

class DefineMetaNode(template.Node):
    def __init__(self, name, nodelist, args):
        self.name = name
        self.nodelist = nodelist
        self.args = args

    def render(self, context):
        ## empty string - {% meta %} tag does no output
        return ''

@register.tag(name="meta")
def do_meta(parser, token):

    try:
        args = token.split_contents()
        tag_name, meta_name, args = args[0], args[1], args[2:]
    except IndexError as e:
        raise template.TemplateSyntaxError("'%s' tag requires at least one argument (macro name)" % token.contents.split()[0])
    # TODO: check that 'args' are all simple strings ([a-zA-Z0-9_]+)
    r_valid_arg_name = re.compile(r'^[a-zA-Z0-9_]+$')
    for arg in args:
        if not r_valid_arg_name.match(arg):
            raise template.TemplateSyntaxError("Argument '%s' to macro '%s' contains illegal characters. Only alphanumeric characters and '_' are allowed." % (arg, macro_name))
    nodelist = parser.parse(('endmeta', ))
    parser.delete_first_token()

    ## Metadata of each macro are stored in a new attribute
    ## of 'parser' class. That way we can access it later
    ## in the template when processing 'usemacro' tags.
    _setup_metas_dict(parser)
    if not meta_name in parser._metas:
        parser._metas[meta_name] = DefineMetaNode(meta_name, nodelist, args)
    return parser._metas[meta_name]

class UseMetaNode(template.Node):
    def __init__(self, meta, filter_expressions, truncate=None):
        self.nodelist = meta.nodelist
        self.args = meta.args
        self.filter_expressions = filter_expressions
        self.truncate = truncate
    def render(self, context):
        for (arg, fe) in [(self.args[i], self.filter_expressions[i]) for i in range(len(self.args))]:
            context[arg] = fe.resolve(context)
        return self.nodelist.render(context).strip()

class NoopNode(template.Node):
    def render(self, context):
        return ''

@register.tag(name="usemeta")
def do_usemeta(parser, token, truncate=None):
    try:
        args = token.split_contents()
        tag_name, meta_name, values = args[0], args[1], args[2:]
    except IndexError as e:
        raise template.TemplateSyntaxError("'%s' tag requires at least one argument (macro name)" % token.contents.split()[0])
    try:
        meta = parser._metas[meta_name]
    except (AttributeError, KeyError):
        return NoopNode()
        raise template.TemplateSyntaxError("Macro '%s' is not defined" % meta_name)


    if (len(values) != len(meta.args)):
        raise template.TemplateSyntaxError("Macro '%s' was declared with %d parameters and used with %d parameter" % (
            meta_name,
            len(meta.args),
            len(values))
        )
    filter_expressions = []
    for val in values:
        if (val[0] == "'" or val[0] == '"') and (val[0] != val[-1]):
            raise template.TemplateSyntaxError("Non-terminated string argument: %s" % val[1:])
        filter_expressions.append(FilterExpression(val, parser))
    return UseMetaNode(meta, filter_expressions, truncate)
#################### END METAS

























#################### BOOTSTRAP3
@register.filter
def materialize(element, label_cols={}, icon=None, label=None):
    if not label_cols:
        label_cols = 's12'

    markup_classes = {'label': label_cols, 'value': '', 'single_value': ''}
    return materialize_render(element, markup_classes)

@register.simple_tag
def field(element, col=None, icon=None, label=None):
    return render_field(element)

@register.simple_tag
def form(element, col=None, icon=None, label=None):
    return render_form(element)

def add_input_classes(field):
    if not is_checkbox(field) and not is_multiple_checkbox(field) and not is_radio(field) \
        and not is_file(field):
        field_classes = field.field.widget.attrs.get('class', '')
        if getattr(settings, 'MATERIALIZECSS_VALIDATION', True):
            field_classes += ' validate'
        if field.errors:
            field_classes+= ' invalid'
        field.field.widget.attrs['class'] = field_classes

        if hasattr(field.field, 'max_length'):
            field.field.widget.attrs['data-length'] = field.field.max_length

    if is_select(field):
        field.field.widget.attrs['data-select'] = '-'


def render_field(element):
    element_type = element.__class__.__name__.lower()

    if element_type == 'boundfield':
        add_input_classes(element)
        template = get_template("workon/forms/field.html")
        context = {'field': element}
        return template.render(context)

def render_form(element):
    has_management = getattr(element, 'management_form', None)
    if has_management:
        for form in element.forms:
            for field in form.visible_fields():
                add_input_classes(field)

        template = get_template("workon/forms/formset.html")
        context = {'formset': element, 'classes': markup_classes}
    else:
        for field in element.visible_fields():
            add_input_classes(field)

        template = get_template("workon/forms/form.html")
        context = {'form': element}

    return template.render(context)


@register.filter
def is_checkbox(field):
    return isinstance(field.field.widget, forms.CheckboxInput)

@register.filter
def is_textarea(field):
    return isinstance(field.field.widget, forms.Textarea)


@register.filter
def is_multiple_checkbox(field):
    return isinstance(field.field.widget, forms.CheckboxSelectMultiple)


@register.filter
def is_radio(field):
    return isinstance(field.field.widget, forms.RadioSelect)

@register.filter
def is_date_input(field):
    return isinstance(field.field.widget, forms.DateInput)


@register.filter
def is_file(field):
    return isinstance(field.field.widget, forms.FileInput)


@register.filter
def is_select(field):
    return isinstance(field.field.widget, forms.Select)


@register.filter
def is_checkbox_select_multiple(field):
    return isinstance(field.field.widget, forms.CheckboxSelectMultiple)
################ END BOOTSTRAP 3




################ FLOW
# @register.inclusion_tag('contrib/flow/_init.html', takes_context=True)
# def flow_init(context, auto_connect=False):
#     request = context['request']
#     protocol = request.is_secure() and 'wss://' or 'ws://'
#     heartbeat_msg = settings..FLOW_WS_HEARTBEAT and '"{0}"'.format(settings..FLOW_WS_HEARTBEAT) or 'null'
#     context.update({
#         'STATIC_URL': settings.STATIC_URL,
#         'FLOW_AUTO_CONNECT': auto_connect,
#         'FLOW_WS_HEARTBEAT': mark_safe(heartbeat_msg),
#         'FLOW_WS_URI': protocol + request.get_host() + flow_settings.FLOW_WS_URL,
#         'FLOW_WS_ENABLED': flow_settings.FLOW_WS_ENABLED,
#         'FLOW_DEBUG': flow_settings.FLOW_DEBUG,
#         'FLOW_ACTIVITY_DELAY': flow_settings.FLOW_ACTIVITY_DELAY,
#         'FLOW_INITIAL_URL': flow_settings.FLOW_INITIAL_URL,
#         'FLOW_DISCONNECTED_ENABLED': flow_settings.FLOW_DISCONNECTED_ENABLED,
#     })
#     return context

################ END FLOW




