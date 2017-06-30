# -*- coding: utf-8 -*-
"""
Shared memory across multiple machines to the heavy AJAX lookups.

Select2 uses django.core.cache_ to share fields across
multiple threads and even machines.

Select2 uses the cache backend defined in the setting
``SELECT2_CACHE_BACKEND`` [default=``default``].

It is advised to always setup a separate cache server for Select2.

.. _django.core.cache: https://docs.djangoproject.com/en/dev/topics/cache/
"""
from __future__ import absolute_import, unicode_literals

from django.core.cache import caches

from . import conf as settings

__all__ = ('cache', )

cache = caches[settings.SELECT2_CACHE_BACKEND]
