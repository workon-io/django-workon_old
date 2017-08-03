import re
from django.utils.safestring import mark_safe

__all__ = [
    'HASTAG_RE', 
    'replace_hashtags_with_hrefs', 
    'iter_hashtags',
    'iter_hashtags_at'
]

HASTAG_RE = re.compile(r'(\#([\w\-\_\d]+))')
HASTAG_AT_RE = re.compile(r'(\@([\w\-\_\d]+))')

def replace_hashtags_with_hrefs(text, href='#{hastag}', label='#{hastag}'):
    href = href.format(hastag='\\2')
    label = label.format(hastag='\\2')
    html = HASTAG_RE.sub(f'<a href="{href}">{label}</a>', text)
    return mark_safe(html)


def iter_hashtags(text):
    if text:
        for full_hashtag, hashtag in HASTAG_RE.findall(text):
            yield hashtag

def iter_hashtags_at(text):
    if text:
        for full_hashtag, hashtag in HASTAG_AT_RE.findall(text):
            yield hashtag

def lazy_register(register):

    @register.filter(name='replace_hashtags_with_hrefs')
    def tt_replace_hashtags_with_hrefs(text, *args): return replace_hashtags_with_hrefs(text, *args)
