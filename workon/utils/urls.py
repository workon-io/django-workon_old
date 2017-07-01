# encoding: utf-8

import re, os, functools
import sys
from urllib.parse import urlparse, urlunparse
from django.conf.urls import url
from django.apps import apps
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.core import urlresolvers
from django.urls import reverse, exceptions
from django.http.request import HttpRequest
from django.core.exceptions import SuspiciousOperation
from workon.utils.cache import memoize

_url_composite = r"""(?i)\b((?:https?:(?:/{1,3}|[a-z0-9%])|[a-z0-9.\-]+[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)/)(?:[^\s()<>{}\[\]]+|\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\))+(?:\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’])|(?:(?<!@)[a-z0-9]+(?:[.\-][a-z0-9]+)*[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)\b/?(?!@)))"""
_url_regex = re.compile(_url_composite)
_url_regex_multiline = re.compile(_url_composite, re.MULTILINE|re.UNICODE)

__all__ = [
    'append_protocol',
    'extract_urls',
    'urls_to_html',
    'extract_urls_to_html',
    'replace_urls_to_href',
    'get_current_site_domain',
    'build_absolute_url',
    'get_current_site',
    'external_url',
    'canonical_url',
    'canonical_url_static',
    'absolute_url',
    'url_signature',
    'default_redirect',
    'ensure_safe_url',
    'route'
]

# def route(arg, query=''):

#     def class_rebuilder(cls):
#         return cls

#     if isinstance(arg, tuple):
#         name = arg[0]
#         args = arg[1]
#         kwargs = arg[2]

#     method_name = name.replace('-', '_').replace(':', '_')
#     def method(self):
#         return reverse(name, args, kwargs)

#     setattr(HttpRequest, method_name, method)
#     return class_rebuilder






from django.contrib.auth.decorators import login_required, user_passes_test

_previous_route_url = None
def route(pattern,
        name,
        attach=HttpRequest,
        attach_attr=None,
        login_required=False,
        passes_test=None,
        view=None,
        view_kwargs={},
        args=(),
        kwargs={},
        fail_as_previous=False
    ):
    global _previous_route_url

    caller_filename = sys._getframe(1).f_code.co_filename

    splitted = caller_filename.rsplit('/views/')
    if len(splitted) > 1:
        caller_filename = f'{splitted[0]}/views/__init__.py'

    pattern = pattern
    if not pattern.endswith('$'):
        pattern = f'{pattern}$'
    url_name  = name.split(':')[-1]
    module = None
    for m in sys.modules.values():
        if m and '__file__' in m.__dict__ and m.__file__.startswith(caller_filename):
            module = m
            break
    if attach:
        def reversor(attached):
            future_args = ( method(attached) for method in args )
            future_kwargs = { attr:method(attached) for attr, method in kwargs.items() }
            print(getattr(attached, f'{attach_attr}_url_previous'))
            if hasattr(attached, f'{attach_attr}_url_previous'):
                try:
                    return reverse(name, args=future_args, kwargs=future_kwargs)
                except exceptions.NoReverseMatch:
                    previous = getattr(attached, f'{attach_attr}_url_previous')
                    future_args = ( method(attached) for method in previous[1] )
                    future_kwargs = { attr:method(attached) for attr, method in previous[2].items() }
                    return reverse(previous[0], args=future_args, kwargs=future_kwargs)
            else:
                return reverse(name, args=future_args, kwargs=future_kwargs)

        attach_attr = name.replace('-', '_').replace(':', '_') if not attach_attr else attach_attr
        setattr(attach, f'{attach_attr}_url' , reversor)
        setattr(attach, f'{attach_attr}_url_previous' , _previous_route_url)

        print('ATTACH ROUTE', f'{attach_attr}_url', name, attach, pattern )
        _previous_route_url = (name, args, kwargs)

    def _wrapper(class_or_method):

        if module:
            if 'urlpatterns' not in module.__dict__:
                module.urlpatterns = []

            if hasattr(class_or_method, 'as_view'):
                view = class_or_method.as_view()
            else:
                view = class_or_method

            # if passes_test:
            #     view = user_passes_test(passes_test)(view)

            # print(pattern, view, url_name)

            module.urlpatterns += [ url(pattern, view, name=url_name ) ]

            # print('PATTERNS', module, module.__dict__.get('urlpatterns'))
            # print('\n')

        return class_or_method

    return _wrapper












def append_protocol(url):
    if url:
        if not (url.startswith('http://') or url.startswith('https://')):
            url = f"http://{url}"
    return url

def extract_urls(text):
    if text is not None:
        urls = []
        for url in _url_regex.findall(text):
            if not url.startswith('//'):
                urls.append(append_protocol(url))

        return list(set(urls))
    else:
        return []

def urls_to_html(urls, reverse=True, target="_blank", hide_protocol=True, classname=None, divider="<br />"):

    urls = [
        u'<a %shref="%s" %s/>%s</a>' % (
            ('target="%s" ' % target) if target else "",
            url,
            ('class="%s" ' % classname) if classname else "",
            (url.replace('https://', '').replace('http://', '') if hide_protocol else url).strip('/')
        ) for url in urls
    ]
    if reverse:
        urls.reverse()
    html = divider.join(urls)
    return html

def extract_urls_to_html(text, **kwargs):
    return urls_to_html(extract_urls(text), **kwargs)


def replace_urls_to_href(text, target="_blank", hide_protocol=True):

    text = _url_regex_multiline.sub(r'<a href="http://\1" %s rel="nofollow">\1</a>' % (
        ('target="%s" ' % target) if target else ""
    ), text)
    text = text.replace('http://http', 'http')
    # Replace email to mailto
    # urls = re.compile(r"([\w\-\.]+@(\w[\w\-]+\.)+[\w\-]+)", re.MULTILINE|re.UNICODE)
    # value = urls.sub(r'<a href="mailto:\1">\1</a>', value)
    return text

# urlfinder = re.compile("([0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}|((news|telnet|nttp|file|http|ftp|https)://)|(www|ftp)[-A-Za-z0-9]*\\.)[-A-Za-z0-9\\.]+):[0-9]*)?/[-A-Za-z0-9_\\$\\.\\+\\!\\*\\(\\),;:@&=\\?/~\\#\\%]*[^]'\\.}>\\),\\\"]")

# def urlify2(value):
#     return urlfinder.sub(r'<a href="\1">\1</a>', value)

def get_current_site_domain(request=None):
    if not request:
        try:
            from django.contrib.sites.models import Site
            domain = Site.objects.get_current().domain
        except:
            domain = getattr(settings, 'PROJECT_DOMAIN', '')
    else:
        domain = get_current_site().domain
    return domain

def build_absolute_url(url="", request=None):
    domain = get_current_site_domain(request=request)
    return "{0}://{1}{2}".format(
        getattr(settings, "DEFAULT_HTTP_PROTOCOL", "http"),
        domain.split('//')[-1],
        url
    ).strip('/')


@memoize
def get_current_site(request=None):
    if request:
        return get_current_site(request)
    else:
        from django.contrib.sites.models import Site
        if not hasattr(settings, 'SITE_ID'):
            return Site.objects.first()
        else:
            return Site.objects.get(id=settings.SITE_ID)

def external_url(url):
    if not url.startswith('http://') or not url.startswith('https://'):
        return "http://%s" % url
    return url


def canonical_url(url, domain_check=False):
    """
    Ensure that the url contains the `http://mysite.com` part,
    particularly for requests made on the local dev server
    """

    current_site = get_current_site()
    if not url.startswith('http'):
        url = "http://%s" % os.path.join(current_site.domain, url.lstrip('/'))

    if domain_check:
        url_parts = URL(url)
        current_site_parts = URL(URL().domain(current_site.domain).as_string())
        if url_parts.subdomains()[-2:] != current_site_parts.subdomains()[-2:]:
            raise ValueError("Suspicious domain '%s' that differs from the "
                "current Site one '%s'" % (url_parts.domain(), current_site_parts.domain()))

    return url

def absolute_url(*args, **kwargs):
    return canonical_url(*args, **kwargs)

def canonical_url_static(url, domain_check=False):# False because of S3
    """
    Ensure that the url contains the `http://mysite.com/STATIC_URL` part,
    particularly for requests made on the local dev server
    """
    if url.startswith('http'):
        return url
    return canonical_url( os.path.join(settings.STATIC_URL, url), domain_check)


def url_signature(resolver_match):
    """
    Convert
        a `django.core.urlresolvers.ResolverMatch` instance
        usually retrieved from a `django.core.urlresolvers.resolve` call
    To
        'namespace:view_name'

    that `django.core.urlresolvers.reverse` can use
    """
    signature = resolver_match.url_name
    if resolver_match.namespace:
        signature = "%s:%s" % (resolver_match.namespace, signature)
    return signature


def default_redirect(request, fallback_url, **kwargs):
    redirect_field_name = kwargs.get("redirect_field_name", "next")
    next_url = request.POST.get(redirect_field_name, request.GET.get(redirect_field_name))
    if not next_url:
        # try the session if available
        if hasattr(request, "session"):
            session_key_value = kwargs.get("session_key_value", "redirect_to")
            if session_key_value in request.session:
                next_url = request.session[session_key_value]
                del request.session[session_key_value]
    is_safe = functools.partial(
        ensure_safe_url,
        allowed_protocols=kwargs.get("allowed_protocols"),
        allowed_host=request.get_host()
    )
    if next_url and is_safe(next_url):
        return next_url
    else:
        try:
            fallback_url = urlresolvers.reverse(fallback_url)
        except urlresolvers.NoReverseMatch:
            if callable(fallback_url):
                raise
            if "/" not in fallback_url and "." not in fallback_url:
                raise
        # assert the fallback URL is safe to return to caller. if it is
        # determined unsafe then raise an exception as the fallback value comes
        # from the a source the developer choose.
        is_safe(fallback_url, raise_on_fail=True)
        return fallback_url


def ensure_safe_url(url, allowed_protocols=None, allowed_host=None, raise_on_fail=False):
    if allowed_protocols is None:
        allowed_protocols = ["http", "https"]
    parsed = urlparse(url)
    # perform security checks to ensure no malicious intent
    # (i.e., an XSS attack with a data URL)
    safe = True
    if parsed.scheme and parsed.scheme not in allowed_protocols:
        if raise_on_fail:
            raise SuspiciousOperation("Unsafe redirect to URL with protocol '{0}'".format(parsed.scheme))
        safe = False
    if allowed_host and parsed.netloc and parsed.netloc != allowed_host:
        if raise_on_fail:
            raise SuspiciousOperation("Unsafe redirect to URL not matching host '{0}'".format(allowed_host))
        safe = False
    return safe
