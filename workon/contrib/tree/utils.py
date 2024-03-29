import json
from django.utils import six
import django

__all__ = []

def get_filtered_selection_from_tree(tree, selection=[], include_level=-1, exclude_parent=True, final_selection=None, filter={}, exclude={}):

    # print 'get_filtered_selection TREE', tree
    if selection is None:
        return []

    if isinstance(selection, six.string_types):
        selection = selection.split(',')

    _selection = []
    for s in selection:
        s = str(s).strip()
        if s != "":
            _selection.append(int(s))


    _final_selection = final_selection if final_selection else {}
    root_empty = True

    if isinstance(tree, list):
        parent_id = None
        children = tree

    else:
        parent_id = tree.get('id')
        children = tree.get('children', [])

    for child in children:
        if child.get('id') in _selection:
            _final_selection[child.get('id')] = child
            root_empty = False

            if exclude_parent and parent_id and _final_selection.get(parent_id):
                del _final_selection[parent_id]

            get_filtered_selection_from_tree(child, selection, include_level=include_level, exclude_parent=exclude_parent, final_selection=_final_selection, filter=filter, exclude=exclude)

    if include_level and root_empty:
        for child in children:
            _final_selection[child.get('id')] = child
            if include_level >= 1 or include_level == -1:
                get_filtered_selection_from_tree(child, selection, include_level=include_level-1, exclude_parent=exclude_parent, final_selection=_final_selection, filter=filter, exclude=exclude)

    return _final_selection.keys()

def get_tree_from_queryset(queryset, on_create_node=None, max_level=None, min_level=None, with_instance=False):
    """
    Return tree data that is suitable for jqTree.
    The queryset must be sorted by 'tree_id' and 'left' fields.
    """
    pk_attname = queryset.model._meta.pk.attname

    def serialize_id(pk):
        if isinstance(pk, six.integer_types + six.string_types):
            return pk
        else:
            # Nb. special case for uuid field
            return str(pk)

    # Result tree
    tree = []

    # Dict of all nodes; used for building the tree
    # - key is node id
    # - value is node info (label, id)
    node_dict = dict()

    for instance in queryset:
        if min_level is None:
            min_level = instance.level

        pk = getattr(instance, pk_attname)
        node_info = dict(
            label=six.text_type(instance),
            id=serialize_id(pk),
            parent_id=getattr(instance, 'parent_%s' % pk_attname)
        )
        if with_instance:
           node_info['instance'] = instance
        if on_create_node:
            on_create_node(instance, node_info)

        if max_level is not None and not instance.is_leaf_node():
            # If there is a maximum level and this node has children, then initially set property 'load_on_demand' to true.
            node_info['load_on_demand'] = True

        if instance.level == min_level:
            # This is the lowest level. Skip finding a parent.
            # Add node to the tree
            tree.append(node_info)
        else:
            # NB: Use parent.pk instead of parent_id for consistent values for uuid
            parent_id = instance.parent_id#getattr(instance.parent, pk_attname)

            # Get parent from node dict
            parent_info = node_dict.get(parent_id)

            # Check for corner case: parent is deleted.
            if parent_info:
                if 'children' not in parent_info:
                    parent_info['children'] = []

                # Add node to the tree
                parent_info['children'].append(node_info)

                # If there is a maximum level, then reset property 'load_on_demand' for parent
                if max_level is not None:
                    parent_info['load_on_demand'] = False

        # Update node dict
        node_dict[pk] = node_info

    return tree


def get_tree_queryset(model, node_id=None, max_level=None, include_root=True):
    if node_id:
        node = model.objects.get(pk=node_id)
        max_level = node.level + 1
        qs = node.get_descendants().filter(level__lte=max_level)
    else:
        qs = model._default_manager.all()

        if max_level is True:
            max_level = 1

        if isinstance(max_level, int) and max_level is not False:
            qs = qs.filter(level__lte=max_level)

        if not include_root:
            qs = qs.exclude(level=0)

    return qs.order_by('tree_id', 'lft')


def get_javascript_value(value):
    """
    Get javascript value for python value.
    >>> get_javascript_value(True)
    true
    >>> get_javascript_value(10)
    10
    """
    if isinstance(value, bool):
        if value:
            return 'true'
        else:
            return 'false'
    else:
        return json.dumps(value)


def get_short_django_version():
    """
    Get first two numbers of Django version.
    E.g. (1, 8)
    """
    return django.VERSION[0:2]


def get_model_name(model):
    """
    Get the name of a Django model
    >>> get_model_name(Country)
    country
    """
    return model._meta.model_name