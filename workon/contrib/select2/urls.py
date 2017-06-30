# -*- coding: utf-8 -*-

from __future__ import absolute_import, unicode_literals

from django.conf.urls import url

from .views import AutoResponseView

urlpatterns = [
    url(r"^fields/auto.json$",
        AutoResponseView.as_view(), name="select2-field-json"),
]
