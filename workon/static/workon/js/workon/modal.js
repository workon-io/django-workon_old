$(document).ready(function() {
    $('.materialize-textarea').trigger('autoresize');
});

$(document).on('click', '.materialize-textarea', function(e, trigger, target)
{
    $(this).trigger('autoresize');
});

$(document).on('click', '[data-modal]', function(e, trigger, target)
{


    trigger = $(this);
    target = trigger.data('modal');
    $.get(target, function(data) {

        data = $(data).appendTo('body');
        data.modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .5, // Opacity of modal background
            inDuration: 300, // Transition in duration
            outDuration: 200, // Transition out duration
            startingTop: '4%', // Starting top style attribute
            complete: function()
            {
                Materialize.updateTextFields();
            },
            ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
                //alert("Ready");
                Materialize.updateTextFields();
                modal.find('.materialize-textarea').each(function () {
                    var $textarea = $(this);
                    $textarea.data("original-height", $textarea.height());
                    $textarea.data("previous-length", $textarea.val().length);
                    $textarea.trigger('autoresize');
                });
            },
        });
        data.modal('open');
    })

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