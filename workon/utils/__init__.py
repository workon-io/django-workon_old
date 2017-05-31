from workon.utils.cache import *
from workon.utils.color import *
from workon.utils.crypt import *
from workon.utils.date import *
from workon.utils.debug import *
from workon.utils.email import *
from workon.utils.embed import *
from workon.utils.geo import *
from workon.utils.html import *
from workon.utils.image import *
from workon.utils.price import *
from workon.utils.file import *
from workon.utils.number import *
from workon.utils.opengraph import *
from workon.utils.pagination import *
from workon.utils.phone import *
from workon.utils.string import *
from workon.utils.urls import *
from workon.utils.ip_address import *
from workon.utils.user import *
from workon.utils.logs import *
# from workon.tree.utils import *
from django.conf import settings

from workon.contrib.auth.utils import *
from workon.contrib.tree.utils import *

def get_project_title(default=""):
    for attr in ['PROJECT_NAME', 'APP_NAME', 'BASE_DIR', 'SITE_NAME', 'SITE_ROOT']:
        if hasattr(settings, attr):
            return getattr(settings, attr).capitalize()
    return default

def get_project_root(default=""):
    for attr in ['BASE_DIR', 'DJANGO_ROOT', 'SITE_ROOT']:
        if hasattr(settings, attr):
            return getattr(settings, attr)
    return default
