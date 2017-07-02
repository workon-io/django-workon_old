from django import forms

class TreeModelChoiceIterator(forms.models.ModelChoiceIterator):

    def choice(self, obj):
        parent_id = getattr(obj, 'parent_id', None)
        level = getattr(obj, getattr(self.queryset.model._meta, 'level_attr', 'level'), 1)
        return super().choice(obj) + (parent_id, level)

class TreeSelect(forms.SelectMultiple):

    template_name = "workon/forms/widgets/_treeselect.html"

    def get_context(self, name, value, attrs):
        by_ids = {}
        print(value)
        test_selected = lambda o: None
        if value:
            if isinstance(value, list):
                test_selected = lambda o: o in value
            else:
                test_selected = lambda o: o == value

        for choice in self.choices:
            by_ids[choice[0]] = {
                'items': [],
                'is_selected': test_selected(choice[0]),
                'label': choice[1],
                'parent_id': choice[2],
                'level': choice[3],
                'value': choice[0]
            }
        tree = {}
        for pk, item in by_ids.items():
            if item['parent_id']:
                by_ids[item['parent_id']]['items'].append(item)
                if item['is_selected']:
                    by_ids[item['parent_id']]['is_selected'] = True

            else:
                tree[pk] = item

        context = {
            'tree': tree.values(),
            'is_hidden': self.is_hidden,
            'name': name,
            'required': self.is_required,
            'value': self.format_value(value),
            'attrs': self.build_attrs(self.attrs, attrs),
            'template_name': self.template_name,
        }
        return context


class TreeModelChoiceField(forms.ModelMultipleChoiceField):
    widget = TreeSelect
    iterator = TreeModelChoiceIterator
