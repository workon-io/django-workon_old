(function($, modal, modalo)
{
    // $(document).ready(function(){
    //         // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    //         $('[data-modal]').modal();
    //     });

    $(document).on('click', '[data-modal]', function(e, trigger, target, body)
    {
        trigger = $(this);
        target = trigger.data('modal');
        var target_lower = target.toLowerCase();
        body = $('body');
        if(target[0] == '#')
        {
            //$('body').addClass('has-modal')
            $(trigger).modal({ complete: complete,ready: ready });
            $(trigger).modal('open');
        }
        else if(target_lower.endsWith('.png') || target_lower.endsWith('.jpg') || target_lower.endsWith('.gif'))
        {
            //$('body').addClass('has-modal')
            $(trigger).modal({ complete: complete,ready: ready });
            $(trigger).modal('open');
        }
        else
        {
            if(!modalo) {
                modalo = $('<div class="modalo loading"></div>').appendTo(body).click(function(e)
                {
                    if($(e.target).is(modalo))
                    {
                        body.removeClass('has-modal');
                    }
                });
            }
            body.addClass('has-modal');
            $.get(target, function(data)
            {
                modalo.html(data);
                body.addClass('has-modal');
            });
        }
    });
})(jQuery);