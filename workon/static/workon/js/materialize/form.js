// $(document).ready(function(){
//     $('ul.tabs').tabs({
//         swipeable: true
//     });
// });

$.fn.ajaxResponse = function(data, cb)
{
    if(typeof(data) == "object")
    {
        if(data.notify) {
            data.toast = data.notify;
        }
        if(data.callback)
        {
            window[data.callback](data);
            $('[data-modal-form]').modal('close');
            return
        }
        if(data.redirect)
        {
            document.location.href = data.redirect;
            return
        }
        if(data.replace)
        {
            if(typeof(data.replace) == "object")
            {
                for(var id in data.replace)
                {
                    var old = $('#'+id);
                    if(old.length)
                    {
                        old.replaceWith($(data.replace[id]));
                    }
                }
            }
            else {
                var $elm = $(data.replace)
                if($elm.attr('id'))
                {
                    $('#'+$elm.attr('id')).replaceWith($elm);
                }
            }
        }
        if(data.toast)
        {
            if(typeof(data.toast) == "object")
            {
                Materialize.toast(data.toast.title, 3000, data.toast.type ? data.toast.type : 'green');
            }
            else {
                Materialize.toast(data.toast, 3000, 'green');
            }
        }
        $('[data-modal-form]').modal('close');
    }
    else
    {
        var $data = $(data);
        if($data.is('[data-modal-form]'))
        {
            $('[data-modal-form]').html($data.html());
        }
        else if($data.attr('id'))
        {
            $('#'+$data.attr('id')).replaceWith($data);
            $('[data-modal-form]').modal('close');
        }
        else {
            var nd = document.open("text/html", "replace");
            nd.write(data);
            nd.close();
        }
    }
}

$(document).on('submit', '[data-modal-form]', function(e, form)
{
    form = $(this);
    form.addClass('loading');
    var options = {
        type: "POST",
        url: form.attr('action'),
        success: function(data)
        {
            $.fn.ajaxResponse(data);
            form.removeClass('loading');
        }
    };
    if(form.attr('enctype') == 'multipart/form-data')
    {
        var formData = new FormData(form[0]);
        options.data = formData;
        options.contentType = false;
        options.processData = false;
    }
    else
    {
        options.data = form.serializeArray();
    }
    $.post(options);
    e.stopPropagation();
    return false;
});