// (function ($)
// {
//     $.fn.selectLazy = function(wrapper, rd_input, input, li, ul)
//     {
//         wrapper = this;
//         if(wrapper[0].selectLazy_active) { return; }
//         wrapper[0].selectLazy_active = true;
//         select = $(wrapper).find('select');
//         rd_input = $(wrapper).find('input').eq(0);

//         ul = $(wrapper).find('ul');
//         li = $('<li>');
//         input = $('<input />');
//         ul.prepend(li.append(input));

//         input.on('keyup', function() {
//             $.get(
//                 select.data('ajax--url'),
//                 {
//                     'term': input.val(),
//                     'field_id': select.data('field_id')
//                 },
//                 function(data) {
//                     console.log(data)
//                     ul.find('li').not(li).remove();
//                     for(var i in data.results)
//                     {
//                         ul.append($('<li><span>'+data.results[i].text+'</span></li>').clikc(function() {

//                             select.trigger('change');
//                         }));

//                     }
//                 }
//             );
//         });
//         rd_input.on('focus', function() {
//             input.focus()
//         });
//     };
//     $(document).on('mouseenter', '[data-select-lazy]', function()
//     {
//         console.log(this)
//        $(this).selectLazy();

//     })
// }(jQuery));

