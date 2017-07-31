from django.shortcuts import render
from workon.contrib.html import html2text
from bs4 import BeautifulSoup

__all__ = ['render_content', 'sanitize', 'html2text']


def render_content(request, template, context):
    return str(render(request, template, context).content, 'utf-8')

def sanitize(html):
    if not has_bleach:
        logger.warning('Bleach is missing for sanitizing HTML.')
        return html
    else:
        return bleach.clean(html)

def html2text(html):
    soup = BeautifulSoup(html, "lxml")
    return soup.get_text()

# def strip_tags(value):
#     "Returns the given HTML with all tags stripped"
#     return re.sub(r'<[^>]*?>', '', value)

# def strip_entities(value):
#     "Returns the given HTML with all entities (&something;) stripped"
#     return re.sub(r'&(?:\w+|#\d);', '', value)