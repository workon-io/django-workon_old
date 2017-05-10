$(document).ready(function()
{
    $('[data-carousel]').each(function()
    {
        $(this).carousel($(this).data('carousel'));
    });
});