// $(document).ready(function(){
//     // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
//     $('[data-modal]').modal();
//   });

$(document).on('click', '[data-modal]', function(e, trigger, target, ready, complete)
{


    trigger = $(this);
    target = trigger.data('modal');
    var target_lower = target.toLowerCase();
    ready = function(modal, trigger)
    {
        //$('body').addClass('has-modal')
        $(modal).on('click', '[data-modal-close]', function() {
            $(modal).modal('close');
        });
        $('.modal-overlay').empty().append(
            $('<a class="modal-close" data-modal-close><i class="material-icons">close</i></a>')
                .css('margin-left', ( $(modal).width() / 2  ) )
        )
    }
    complete = function()
    {
        $('body').removeClass('has-modal')
    }
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
        $('body').addClass('has-modal')
        $.get(target, function(data, modal)
        {
            modal = $(data).appendTo('body');
            modal.modal({
                dismissible: true, // Modal can be dismissed by clicking outside of the modal
                opacity: .9, // Opacity of modal background
                inDuration: 300, // Transition in duration
                outDuration: 200, // Transition out duration
                startingTop: '4%', // Starting top style attribute
                complete: function() {
                    complete();
                    modal.remove();
                },
                ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
                    //alert("Ready");
                    ready(modal, trigger);
                    Materialize.updateTextFields();
                    modal.find('.materialize-textarea').each(function () {
                        var $textarea = $(this);
                        $textarea.data("original-height", $textarea.height());
                        $textarea.data("previous-length", $textarea.val().length);
                        $textarea.trigger('autoresize');
                    });
                },
            });
            modal.modal('open');
        });
    }

    // var modal = $('<div class="modal bottom-sheet"><div class="preloader-wrapper  active"><div class="modal-content">\
    //   <div class="spinner-layer spinner-blue">\
    //     <div class="circle-clipper left">\
    //       <div class="circle"></div>\
    //     </div><div class="gap-patch">\
    //       <div class="circle"></div>\
    //     </div><div class="circle-clipper right">\
    //       <div class="circle"></div>\
    //     </div>\
    //   </div></div></div>')

    // modal.modal({
    //     dismissible: true, // Modal can be dismissed by clicking outside of the modal
    //     opacity: .5, // Opacity of modal background
    //     inDuration: 300, // Transition in duration
    //     outDuration: 200, // Transition out duration
    //     startingTop: '4%', // Starting top style attribute
    //     endingTop: '10%', // Ending top style attribute
    //     ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
    //         //alert("Ready");
    //         console.log(modal, trigger);
    //     },
    //     complete: function() {

    //     } // Callback for Modal close
    // }).modal('open');
});