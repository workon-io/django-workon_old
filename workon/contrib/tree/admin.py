# encoding: utf-8

from functools import update_wrapper

from django.core.exceptions import PermissionDenied, SuspiciousOperation
from django.core.urlresolvers import reverse
from django.http import JsonResponse
from django.template.response import TemplateResponse
from django.contrib import admin
from django.contrib.admin.options import csrf_protect_m
from django.contrib.admin.views.main import ChangeList
from django.conf.urls import url
from django.contrib.admin.utils import unquote, quote
from django.contrib.admin.options import IS_POPUP_VAR
from django.db import transaction
from django import forms

from . import utils

class TreeAdminMixin(object):
    tree_auto_open = 0
    tree_load_on_demand = 1
    trigger_save_after_move = False

    # Autoescape the tree data; default is True
    autoescape = True

    # useContextMenu option for the tree; default is False
    use_context_menu = False

    change_list_template = 'contrib/tree/grid_view.html'
    change_tree_template=  'contrib/tree/change_list.html'

    @csrf_protect_m
    def changelist_view(self, request, extra_context=None):
        request.current_app = self.admin_site.name
        is_popup = IS_POPUP_VAR in request.GET
        if is_popup:
            return super(TreeAdminMixin, self).changelist_view(request, extra_context=extra_context)

        if not self.has_change_permission(request, None):
            raise PermissionDenied()

        change_list = self.get_change_list_for_tree(request)

        context = dict(
            title=change_list.title,
            app_label=self.model._meta.app_label,
            model_name=utils.get_model_name(self.model),
            cl=change_list,
            media=self.media,
            has_add_permission=self.has_add_permission(request),
            tree_auto_open=utils.get_javascript_value(self.tree_auto_open),
            tree_json_url=self.get_admin_url('tree_json'),
            grid_url=self.get_admin_url('grid'),
            autoescape=utils.get_javascript_value(self.autoescape),
            use_context_menu=utils.get_javascript_value(self.use_context_menu)
        )
        if extra_context:
            context.update(extra_context)

        django_version = utils.get_short_django_version()

        if django_version == (1, 7):
            context.update(self.admin_site.each_context())
        elif django_version >= (1, 8):
            context.update(self.admin_site.each_context(request))

        return TemplateResponse(
            request,
            self.change_tree_template,
            context
        )

    def get_urls(self):
        def wrap(view):
            def wrapper(*args, **kwargs):
                return self.admin_site.admin_view(view)(*args, **kwargs)
            return update_wrapper(wrapper, view)

        urlpatterns = super(TreeAdminMixin, self).get_urls()

        def add_url(regex, url_name, view):
            # Prepend url to list so it has preference before 'change' url
            urlpatterns.insert(
                0,
                url(
                    regex,
                    wrap(view),
                    name='%s_%s_%s' % (
                        self.model._meta.app_label,
                        utils.get_model_name(self.model),
                        url_name
                    )
                )
            )

        add_url(r'^(.+)/move/$', 'move', self.move_view)
        add_url(r'^tree_json/$', 'tree_json', self.tree_json_view)
        add_url(r'^grid/$', 'grid', self.grid_view)
        return urlpatterns



    class Media:

        js = (
            'contrib/vendors/jquery-cookie/jquery.cookie.js',
            'contrib/vendors/jqtree/tree.jquery.js',
            'contrib/tree/change_list.js',
        )

        css = dict(
            all=(
                'contrib/vendors/jqtree/jqtree.css',
                'contrib/tree/change_list.css',
            )
        )

        # return forms.Media(js=js, css=css)

    @csrf_protect_m
    @transaction.atomic()
    def move_view(self, request, object_id):
        request.current_app = self.admin_site.name
        instance = self.get_object(request, unquote(object_id))

        if not self.has_change_permission(request, instance):
            raise PermissionDenied()

        if request.method != 'POST':
            raise SuspiciousOperation()

        target_id = request.POST['target_id']
        position = request.POST['position']
        target_instance = self.get_object(request, target_id)

        self.do_move(instance, position, target_instance)

        return JsonResponse(
            dict(success=True)
        )

    def do_move(self, instance, position, target_instance):
        if position == 'before':
            instance.move_to(target_instance, 'left')
        elif position == 'after':
            instance.move_to(target_instance, 'right')
        elif position == 'inside':
            instance.move_to(target_instance)
        else:
            raise Exception('Unknown position')

        if self.trigger_save_after_move:
            instance.save()

    def get_change_list_for_tree(self, request):
        request.current_app = self.admin_site.name
        kwargs = dict(
            request=request,
            model=self.model,
            list_display=(),
            list_display_links=(),
            list_filter=(),
            date_hierarchy=None,
            search_fields=(),
            list_select_related=(),
            list_per_page=100,
            list_editable=(),
            model_admin=self,
            list_max_show_all=200,
        )

        return ChangeList(**kwargs)

    def get_admin_url(self, name, args=None):
        opts = self.model._meta
        url_name = 'admin:%s_%s_%s' % (opts.app_label, utils.get_model_name(self.model), name)

        return reverse(
            url_name,
            args=args,
            current_app=self.admin_site.name
        )

    def get_tree_data(self, qs, max_level):
        pk_attname = self.model._meta.pk.attname

        def handle_create_node(instance, node_info):
            pk = quote(getattr(instance, pk_attname))

            node_info.update(
                url=self.get_admin_url('change', (quote(pk),)),
                move_url=self.get_admin_url('move', (quote(pk),))
            )

        return utils.get_tree_from_queryset(qs, handle_create_node, max_level)

    def tree_json_view(self, request):
        request.current_app = self.admin_site.name
        node_id = request.GET.get('node')

        if node_id:
            node = self.model.objects.get(pk=node_id)
            max_level = node.level + 1
        else:
            max_level = self.tree_load_on_demand

        qs = utils.get_tree_queryset(
            model=self.model,
            node_id=node_id,
            max_level=max_level,
        )

        qs = self.filter_tree_queryset(qs)

        tree_data = self.get_tree_data(qs, max_level)

        # Set safe to False because the data is a list instead of a dict
        return JsonResponse(tree_data, safe=False)

    def grid_view(self, request, extra_context=None):
        request.current_app = self.admin_site.name
        context = dict(tree_url=self.get_admin_url('changelist'))
        if extra_context:
            context.update(extra_context)
        return super(TreeAdminMixin, self).changelist_view(request,context)

    def filter_tree_queryset(self, queryset):
        """
        Override 'filter_tree_queryset' to filter the queryset for the tree.
        """
        return queryset


class TreeAdmin(TreeAdminMixin, admin.ModelAdmin):
    pass