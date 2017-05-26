(function ($, noticec, offNotice, notices)
{
    notices = {};
    offNotice = function(notice)
    {
        if(notice) {
            notice.addClass('off').animate({ marginTop: -notice.outerHeight() }, 250);
            setTimeout(function() { delete notices[notice[0].workon_notice_html]; notice.remove(); }, 5000);
        }
    };
    $.fn.notice = function (options, options2, defaults, notice)
    {
        defaults = {
            delay: 3000,
            classes: '',
            removeOthers: false
        };
        var body = $('body');
        if(!noticec) {
            noticec = $('<div class="noticec"></div>').appendTo(body);
        }
        if(typeof options == "object")
        {
            options = $.extend(defaults, options, options2);
        }
        else
        {
            options = $.extend(defaults, {
                content: options
            }, options2);
        }

        var html = '<div class="notice '+options.classes+'">'+options.content+'</div>';
        if(notices[html]) {
            notice = notices[html];
            clearTimeout(notice[0].workon_notice_to);
            notice.removeClass('off').css('margin-top', '');
        }
        else {
            if(options.removeOthers) {
                $.each(notices, function(i, notice) {
                    offNotice(notice);
                });
            }
            notice = $(html).on('click', function(self)
            {
                offNotice(notice);
            });
            notices[html] = notice;
            notice[0].workon_notice_html = html;
            noticec.append(notice);
        }
        if(options.delay && options.delay > 0) {
            notice[0].workon_notice_to = setTimeout(function() { offNotice(notice); }, options.delay);
        }
        else {
            notice[0].workon_notice_to = null;
        }
        notice.addClass('pulse1')
        setTimeout(function() { notice.removeClass('pulse1') }, 2000);
        body.addClass('has-notice');
        return notice;
    };
    $(document).on('click', '[data-notice]', function(e)
    {
        $.fn.notice($(this).data('notice'));
    });
}( jQuery ));
