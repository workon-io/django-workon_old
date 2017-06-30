from django.shortcuts import render
import logging

try:
    import bleach
    has_bleach = True
except:
    has_bleach = False

logger = logging.getLogger()

__all__ = ['render_content', 'sanitize']

def render_content(request, template, context):
    return str(render(request, template, context).content, 'utf-8')

def sanitize(html):
    if not has_bleach:
        logger.warning('Bleach is missing for sanitizing HTML.')
        return html
    else:
        return bleach.clean(html)