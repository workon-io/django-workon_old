$(document).ready(function(body, pushins, scrolled)
{
    scrolled = false;

    body = $('body');
    pushins = $('[data-pushpin-nav]');

    $('[data-nav-collapse]').each(function(i, self)
    {
        $(self).sideNav($.extend({
            //menuWidth: 300,
            edge: 'left',
            //closeOnClick: true,
            draggable: true
        }, $(self).data('nav-collapse')));
    });
    $(document).on('click', '[data-nav-top]', function(i, self)
    {
        $.smoothScroll(
        {
            direction: 'top',
            offset: 0
        });
    });

    $(window).on('resize.workon', function()
    {
        pushins.each(function(i, self)
        {
            self._offsetTop = $(self).css('top', '').offset().top,
            self._offsetHeight = $(self).css('top', '').outerHeight();
        });
        $(window).trigger('scroll.workon');
    });

    pushins.each(function(i, self)
    {
        self._offsetTop = $(self).css('top', '').offset().top,
        self._offsetHeight = $(self).css('top', '').outerHeight();
    });

    pushins.on('click', function() {
        $.smoothScroll(
        {
            offset: this._offsetTop + 1
        });
    });
    $(window).on('scroll.workon', function(scrollTop, prev, pinned, next)
    {
        var scrollTop = $(this).scrollTop();
        prev = null;
        next = null;
        pinned = null;
        if(scrollTop > 0)
        {
            if(scrolled === false)
            {
                body.addClass('scrolled');
                scrolled = true;
            }
        }
        else {
            if(scrolled === true)
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
});

