from django.shortcuts import render

__all__ = ['render_content']

def render_content(request, template, context):
    return str(render(request, template, context).content, 'utf-8')