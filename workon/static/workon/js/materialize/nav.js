$(document).ready(function(body, pushins, scrolled)
{
    scrolled = false;

    body = $('boby');
    pushins = $('[data-pushpin-nav]');

    $('[data-nav-collapse]').each(function(i, self)
    {
        $(self).sideNav($.extend({
            //menuWidth: 300,
            edge: 'left',
            closeOnClick: true,
            draggable: true
        }, $(self).data('nav-collapse')));
    });

    $(window).on('resize.workon', function()
    {
        pushins.each(function(i, self)
        {
            self._offsetTop = $(self).offset().top,
            self._offsetHeight = $(self).outerHeight();
        });
    });

    pushins.on('click', function() {
        $.smoothScroll(
        {
            scrollTarget: $(this),
            offset: 1
        });
        return false;
    });
    $(window).on('scroll.workon', function(scrollTop, prev, pinned, next)
    {
        var scrollTop = $(this).scrollTop();
        prev = null;
        next = null;
        pinned = null;
        if(scrollTop >= 0) {
            if(!scrolled)
            {
                body.addClass('scrolled');
                scrolled = true;
            }
        }
        else {
            if(!scrolled)
            {
                body.removeClass('scrolled');
                scrolled = false;
            }
        }
        pushins.each(function(i, self)
        {
            var diff1 = scrollTop - this._offsetTop;
            var diff2 = pinned ?  diff1 + pinned._offsetHeight : diff1;

            if(diff2 > 0)
            {
                if(pinned) {
                    prev = pinned;
                    pinned = null;
                    next = this;
                }
            }
            if(diff1 > 0)
            {
                pinned = this;
                pinned._pushOffset = diff1;
            }
            else {
                $(this).css('top', '').removeClass('pushpinned');
            }
        });
        if(pinned)
        {
            $(pinned).css('top', pinned._pushOffset).addClass('pushpinned');
        }
        if(prev && next)
        {
            $(prev).css('top',  next._offsetTop - prev._offsetTop - prev._offsetHeight );
        }
    });

    $(window).trigger('scroll.workon');
    $(window).trigger('resize.workon');
});

