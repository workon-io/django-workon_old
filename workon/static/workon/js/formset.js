/**
* Django formset helper
*/
(function($) {
    "use strict";

    var pluginName = 'formset';

    /**
    * Wraps up a formset, allowing adding, and removing forms
    */
    var Formset = function(el, options) {
        var _this = this;

        //Defaults:
        this.opts = $.extend({}, Formset.defaults, options);

        this.$formset = $(el);
        this.$emptyForm = this.$formset.find(this.opts.emptyForm);
        this.$body = this.$formset.find(this.opts.body);
        this.$add = this.$formset.find(this.opts.add);

        this.formsetPrefix = $(el).data('formset-prefix');

        // Bind to the `Add form` button
        this.addForm = $.proxy(this, 'addForm');
        this.$add.click(this.addForm);

        // Bind receiver to `contrib_formset_added` and `contrib_formset_deleted` events
        this.$formset.on('contrib_formset_added contrib_formset_deleted', this.opts.form, $.proxy(this, 'checkMaxForms'));

        // Set up the existing forms
        this.$forms().each(function(i, form) {
            var $form = $(form);
            _this.bindForm($(this), i);
        });

        // Store a reference to this in the formset element
        this.$formset.data(pluginName, this);

        var extras = ['animateForms'];
        $.each(extras, function(i, extra) {
            if ((extra in _this.opts) && (_this.opts[extra])) {
                _this[extra]();
            }
        });
    };

    Formset.defaults = {
        form: '[data-formset-form]',
        emptyForm: 'script[type=form-template][data-formset-empty-form]',
        body: '[data-formset-body]',
        add: '[data-formset-add]',
        deleteButton: '[data-formset-delete-button]',
        hasMaxFormsClass: 'has-max-forms',
        animateForms: false
    };

    Formset.prototype.addForm = function() {
        // Don't proceed if the number of maximum forms has been reached
        if (this.hasMaxForms()) {
            throw new Error("MAX_NUM_FORMS reached");
        }

        var newIndex = this.totalFormCount();
        this.$managementForm('TOTAL_FORMS').val(newIndex + 1);

        var newFormHtml = this.$emptyForm.html()
            .replace(new RegExp('__prefix__', 'g'), newIndex)
            .replace(new RegExp('<\\\\/script>', 'g'), '</script>');

        var $newFormFragment = $($.parseHTML(newFormHtml, this.$body.document, true));
        this.$body.append($newFormFragment);

        var $newForm = $newFormFragment.filter(this.opts.form);
        this.bindForm($newForm, newIndex);

        return $newForm;
    };

    /**
    * Attach any events needed to a new form
    */
    Formset.prototype.bindForm = function($form, index)
    {
        var prefix = this.formsetPrefix + '-' + index;
        $form.data(pluginName + '__formPrefix', prefix);

        var $delete = $form.find('[name=' + prefix + '-DELETE]');

        /** contrib CHECKBOX CROSS INTEGRATION **/
        $form.find('label[for$="DELETE"] .contrib-checkbox').addClass('red');

        var onChangeDelete = function()
        {
            if ($delete.is(':checked'))
            {
                $form.addClass('formset-form-deleted')
                $form.attr('data-formset-form-deleted', '');
                // Remove required property and pattern attribute to allow submit, back it up to data field
                $form.find(':required').data(pluginName + '-required-field', true).prop('required', false);
                $form.find('input[pattern]').each(function()
                {
                    var pattern = $(this).attr('pattern');
                    $(this).data(pluginName + '-field-pattern', pattern).removeAttr('pattern');
                });
                $form.trigger('contrib_formset_deleted');
            }
            else
            {
                $form.removeClass('formset-form-deleted')
                $form.removeAttr('data-formset-form-deleted');
                // Restore required property and pattern attributes from data field
                $form.find('*').filter(function() {
                    return $(this).data(pluginName + '-required-field') === true;
                }).prop('required', true);
                $form.find('input').each(function() {
                    var pattern = $(this).data(pluginName + '-field-pattern');
                    if (pattern) {
                        $(this).attr('pattern', pattern);
                    }
                });
                $form.trigger('contrib_formset_added');
            }
        }

        // Trigger `contrib_formset_added` / `contrib_formset_deleted` events when delete checkbox value changes
        $delete.change(onChangeDelete);

        // This will trigger `contrib_formset_added` for newly created forms.
        // It will also trigger `contrib_formset_added` or `contrib_formset_deleted` for all forms when
        // the Formset is first created.
        // setTimeout so the caller can register events before the events are
        // triggered, during initialisation.
        window.setTimeout(onChangeDelete);

        // Delete the form if the delete button is pressed
        var $deleteButton = $form.find(this.opts.deleteButton);
        $deleteButton.bind('click', function()
        {
            $delete.prop('checked', true).change();
        });
    };

    Formset.prototype.$forms = function() {
        return this.$body.find(this.opts.form);
    };
    Formset.prototype.$managementForm = function(name) {
        return this.$formset.find('[name=' + this.formsetPrefix + '-' + name + ']');
    };

    Formset.prototype.totalFormCount = function() {
        return this.$forms().length;
    };

    Formset.prototype.deletedFormCount = function() {
        return this.$forms().filter('[data-formset-form-deleted]').length;
    };

    Formset.prototype.activeFormCount = function() {
        return this.totalFormCount() - this.deletedFormCount();
    };

    Formset.prototype.hasMaxForms = function() {
        var maxForms = parseInt(this.$managementForm('MAX_NUM_FORMS').val(), 10) || 1000;
        return this.activeFormCount() >= maxForms;
    };

    Formset.prototype.checkMaxForms = function() {
        if (this.hasMaxForms())
        {
            this.$formset.addClass(this.opts.hasMaxFormsClass);
            this.$add.attr('disabled', 'disabled');
        }
        else
        {
            this.$formset.removeClass(this.opts.hasMaxFormsClass);
            this.$add.removeAttr('disabled');
        }
    };

    Formset.prototype.animateForms = function()
    {
        this.$formset.on('contrib_formset_added', this.opts.form, function()
        {
            var $form = $(this);
            $form.slideUp(0);
            $form.slideDown();
        }).on('contrib_formset_deleted', this.opts.form, function()
        {
            var $form = $(this);
            $form.slideUp();
        });
        this.$forms().filter('[data-formset-form-deleted]').slideUp(0);
    };

    Formset.getOrCreate = function(el, options) {
        var rev = $(el).data(pluginName);
        if (!rev) {
            rev = new Formset(el, options);
        }

        return rev;
    };

    $.fn[pluginName] = function()
    {
        var options, fn, args;
        // Create a new Formset for each element
        if (arguments.length === 0 || (arguments.length === 1 && $.type(arguments[0]) != 'string')) {
            options = arguments[0];
            return this.each(function() {
                return Formset.getOrCreate(this, options);
            });
        }

        // Call a function on each Formset in the selector
        fn = arguments[0];
        args = $.makeArray(arguments).slice(1);

        if (fn in Formset) {
            // Call the Formset class method if it exists
            args.unshift(this);
            return Formset[fn].apply(Formset, args);
        } else {
            throw new Error("Unknown function call " + fn + " for $.fn.formset");
        }
    };
})(jQuery);

// $(document).ready(function() {

//     $('[data-formset]').each(function(id, $emptyform, $formset, get_form_total, update_form_total, $marker) {

//         $formset = $(this);
//         id = $formset.data('formset');
//         get_form_total = function() {
//             return $('[data-formset-form='+id+']').length;
//         }
//         update_form_total = function() {
//             $('#id_'+id+'-TOTAL_FORMS').val(get_form_total());
//         }
//         $marker = $('<div></div>').hide();
//         var $lastemptyform = $('[data-formset-form-empty='+id+']').eq(-1);
//         $lastemptyform.after($marker);
//         $emptyform = $lastemptyform.clone().removeAttr('data-formset-form-empty');
//         $('[data-formset-form-empty='+id+']').remove();
//         update_form_total();

//         $('[data-formset-form-add='+id+']').click(function() {
//             var html = $emptyform.html();
//             var reg = new RegExp(id+'-(\\d+)-', 'gi');
//             html = html.replace(reg, id+'-'+get_form_total()+'-');
//             var $newform = $emptyform.clone().html(html);
//             $marker.before($newform.show());
//             update_form_total();
//         });
//     });

// });