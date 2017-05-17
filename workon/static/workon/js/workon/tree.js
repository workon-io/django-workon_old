$.fn.workonTree = function(index, self, options, _li)
{
    self = $(this);
    options = self.data('tree');
    _li = self.find('li').each(function(i, li)
    {
        li = $(li);
        var id = 'tree_' + index + '_' + li.attr('id');
        var html = li.html()//.empty()
        var label = li.find('label').eq(0);
        if(!label.length) {
            label = $('<label></label>').prependTo(li);
        }
        label.attr('for', id);
        li.prepend($('<input type="checkbox" id="'+id+'" />').change(function(selected, values)
        {
            values = []
            selected = []
            self.find('input:checked').each(function()
            {
                selected.push($(this).parent());
                values.push($(this).find('label').text())
            })
            $(this).trigger('changed.tree', {
                selected: selected,
                values: values,
            });
        }));
        ul = li.find('> ul');
        if(ul.length) {
            ul.before('<i class="material-icons">play_arrow</i>');
            li.addClass('tree-contains')
        }
        //li.append('')
    });
}
$(document).ready(function()
{
    $('[data-tree]').each(function(i, tree)
    {
        $(tree).workonTree(i);
    });
})