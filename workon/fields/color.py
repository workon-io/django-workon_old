# -*- coding: utf-8 -*-

from django.db import models
from django import forms
from django.utils.text import capfirst

from ..forms import ColorField as ColorFormField, ColorInput


class ColorField(models.CharField):
    """
    A text field made to accept hexadecimal color value (#FFFFFF)
    with a color picker widget.
    """
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 7
        super(ColorField, self).__init__(*args, **kwargs)

    def formfield(self, **kwargs):
        kwargs['widget'] = ColorInput
        return super(ColorField, self).formfield(**kwargs)

