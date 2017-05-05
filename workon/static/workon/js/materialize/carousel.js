$(document).ready(function()
{
    $('[data-carousel]').each(function()
    {
        $(this).carousel($.extend({
            fullWidth: true
        }, $(this).data('carousel')));
    })
    // $('body > header .carousel')
    // $('main .carousel').carousel({
    //     // shift: 10,
    //     // dist : -15,
    //     // padding: 20,
    //     // interval: 200
    // });
});