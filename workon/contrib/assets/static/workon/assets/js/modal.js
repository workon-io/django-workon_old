(function($, modal, open, modalo, content, oldContainer, addClose)
{
    // $(document).ready(function(){
    //         // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    //         $('[data-modal]').modal();
    //     });

    $.fn.modalDefaults = {
        closeOnClick: true
    }

    $.fn.modalAddClose = function() {
        if( !this.find('>[data-modal-close]').length )
        {
            this.prepend('<a class="modal-close" data-modal-close><i class="icon">close</i></a>');
        }
    }

    open = function(options, trigger, target, content, body)
    {
        body = $('body');
        if(!modalo) {
            modalo = $('<div class="modal-back"></div>').appendTo(body).click(function(e)
            {
                if($.fn.modalDefaults.closeOnClick && $(e.target).is(modalo))
                {
                    body.removeClass('has-modal loading');
                }
            });
        }
        var target_lower = target.toLowerCase();
        if(target[0] == '#')
        {
            content = $(target);
            oldContainer = content.parent();
            content.modalAddClose();
            modalo.empty().append(content);
            body.addClass('has-modal');
            Materialize.updateTextFields();
        }
        else if(target_lower.endsWith('.png') || target_lower.endsWith('.jpg') || target_lower.endsWith('.gif'))
        {

            modalo.empty().append('<img class="modal large" src="'+target+'"/>');
            body.addClass('has-modal');
            //$('body').addClass('has-modal')
            // $(trigger).modal({ complete: complete,ready: ready });
            // $(trigger).modal('open');
        }
        else
        {
            oldContainer = null;
            modalo.empty();
            body.addClass('has-modal loading');
            $.get(target, function(data)
            {
                content = $(data);
                content.modalAddClose();
                modalo.html(content);
                body.addClass('has-modal').removeClass('loading');
                Materialize.updateTextFields();
                $('select').material_select();
                $('textarea').autoGrow();
            });
        }
    }

    $.fn.modal = function(options, trigger, target, body)
    {
        if(options == "open")
        {
            trigger = $(this);
            options = trigger.data('modal');
            target = trigger.data('modal');
            open(options, trigger, target);
        }
        else if(options == "close")
        {
            if(oldContainer && content)
            {
                oldContainer.prepend(content);
                oldContainer = null;
            }
            if(content)
            {
                content = null;
            }
            $('body').removeClass('has-modal');
        }
        else {
            open(options, null, options);
        }

    }

    $(document).on('click', '[data-modal]', function(e) { $(this).modal('open'); });
    $(document).on('click', '[data-modal-close]', function(e) { $(this).modal('close'); });
})(jQuery);