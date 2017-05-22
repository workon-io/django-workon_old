import json
from django.conf import settings
from django import forms
from django.core.exceptions import ValidationError
from django.utils.html import conditional_escape, format_html, html_safe, escape
from django.utils.encoding import force_text, smart_text
from django.forms.utils import flatatt, to_current_timezone
from django.utils.safestring import mark_safe
from django.utils import six
from itertools import chain
from collections import OrderedDict

class TreeModelChoiceIterator(forms.models.ModelChoiceIterator):

    def choice(self, obj):
        # tree_id = getattr(obj, getattr(self.queryset.model._meta, 'tree_id_atrr', 'tree_id'), 0)
        # left = getattr(obj, getattr(self.queryset.model._meta, 'left_atrr', 'lft'), 0)
        parent_id = getattr(obj, 'parent_id', None)
        level = getattr(obj, getattr(self.queryset.model._meta, 'level_attr', 'level'), 1)
        return super(TreeModelChoiceIterator, self).choice(obj) + (parent_id, level)

class TreeSelect(forms.SelectMultiple):

    template_name = "workon/forms/widgets/tree.html"

    # def render_options(self, selected_choices):
    #     # Normalize to strings.
    #     selected_choices = set(force_text(v) for v in selected_choices)
    #     output = []
    #     for choice in self.choices:

    #         if len(choice) < 3:
    #             choice = choice + (None, 0, )
    #         option_value, option_label, parent_id, level = choice

    #         if isinstance(option_label, (list, tuple)):
    #             output.append(format_html('<optgroup label="{}">', force_text(option_value)))
    #             for option in option_label:
    #                 output.append(self.render_option(selected_choices))
    #             output.append('</optgroup>')
    #         else:
    #             output.append(self.render_option(selected_choices))
    #     return '\n'.join(output)

    # def render(self, name, value, attrs=None, choices=()):

    #     if value is None:
    #         value = []

    #     tree = []
    #     for choice in chain(self.choices, choices):

    #         if len(choice) < 3:
    #             choice = choice + (None, 0, )
    #         id, label, parent_id, level = choice
    #         # print(id, label, parent_id, level)
    #         if id:
    #             node = {
    #                 'id'          : str(id), #required
    #                 'parent'      : str(parent_id) if level > 1 else '#', #required
    #                 'text'        : label, #node text
    #                 'icon'       : None, #string for custom
    #                 'state'       : {
    #                     'opened'    : True, #is the node open
    #                     'disabled'  : False, #is the node disabled
    #                     'selected'  : id in value, #is the node selected
    #                 },
    #                 # 'li_attr'     : {}, #attributes for the generated LI node
    #                 # 'a_attr'      : {}, #attributes for the generated A node
    #             }
    #             tree.append(node)
    #     tree = json.dumps(tree)

    #     final_attrs = self.build_attrs(attrs)
    #     output = [format_html('<select class="hidden" multiple="multiple"{}>', flatatt(final_attrs))]
    #     options = self.render_options(value)
    #     if options:
    #         output.append(options)
    #     output.append('</select>')


    #     output += [
    #         f'''<div id="id_tree_{name}" class="contrib-tree-input" ></div>''',
    #         f''' <script type="text/javascript">
    #                 console.log({tree})
    #                 $('#id_tree_{name}').jstree(''',
    #         '''    {
    #                     "plugins" : [ "wholerow", "checkbox" ],
    #                     'core' : {''',
    #         f'''           'data' : {tree}''',
    #         '''         }
    #                 }).on('changed.jstree', function (e, data) {
    #             var i, j, r = [];
    #             for(i = 0, j = data.selected.length; i < j; i++) {
    #               r.push(data.instance.get_node(data.selected[i]).id);
    #             }''',
    #         f'''    $('#id_{name}').val(r).trigger('change');''',
    #          ''' });
    #             </script>'''
    #     ]
    #    return mark_safe('\n'.join(output))


class TreeModelChoiceField(forms.ModelMultipleChoiceField):
    widget = TreeSelect

    # def label_from_instance(self, obj):
    #     level = getattr(obj, getattr(self.queryset.model._meta, 'level_attr', 'level'), 0)
    #     return u'%s %s' % (level, smart_text(obj))

    # def _get_choices(self):
    #     if hasattr(self, '_choices'):
    #         return self._choices
    #     return TreeModelChoiceIterator(self)

    # choices = property(_get_choices, forms.ChoiceField._set_choices)


    # def clean(self, value):

    #     value = super(TreeModelChoiceField, self).clean(value)

    #     if self.required and not value:
    #         raise ValidationError(self.error_messages['required'], code='required')
    #     elif not self.required and not value:
    #         return None

    #     if value and not value.is_leaf_node():
    #         raise ValidationError(u"Vous devez sélectionner une catégorie", code='list')
    #     else:
    #         return value