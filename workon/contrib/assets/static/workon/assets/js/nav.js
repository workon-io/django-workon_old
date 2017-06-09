$(document).ready(function(body, pushins, backgrounds, scrolled)
{
    scrolled = false;

    body = $('body');
    pushpinsReset = function(i, self)
    {
        self._offsetTop = $(self).removeClass('pushpinned').offset().top,
        self._offsetHeight = $(self).outerHeight();
        self._offsetWidth = $(self).width('auto').width();
        $(self).width(self._offsetWidth);
    }
    pushins = $('[data-pushpin-nav]').each(pushpinsReset).on('click', function() {

        $('body').stop().animate({ scrollTop: 1 }, 500);
    });
    backgrounds = $('[data-background-absolute]').each(function(i, self)
    {
        self._offsetTop = $(self).css('top', '').offset().top;
    });

    // $('[data-sidenav]').each(function(i, self)
    // {
    //     $(self).sideNav($.extend({ edge: 'left', draggable: true }, $(self).data('sidenav')));
    // });
    $(document).on('click', '[data-nav-top]', function(i, self)
    {
        $('body').stop().animate({ scrollTop: 0 }, 500);
    });

    $(window).on('resize.workon', function()
    {
        pushins.each(pushpinsReset);
        $(window).trigger('scroll.workon');
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
                body.addClass('on-scroll').removeClass('on-top');
                scrolled = true;
            }
        }
        else {
            if(scrolled === true)
            {
                body.removeClass('on-scroll').addClass('on-top');
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
            $(pinned).css('top', Math.min(0, pinned._pushOffset))/*.css('top', pinned._pushOffset)*/.addClass('pushpinned');
        }
        if(prev && next)
        {
            $(prev).css('top',  next._offsetTop - prev._offsetTop - prev._offsetHeight ).removeClass('pushpinned');
        }

        backgrounds.each(function(i, self)
        {
            $(self).css('backgroundPositionY', Math.max(0, self._offsetTop + scrollTop))
        });
    });

    $(window).trigger('scroll.workon');
});

