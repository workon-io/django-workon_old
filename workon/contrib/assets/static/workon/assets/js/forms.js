(function ($, modalFormSelector, formSelector, isDict, isArray)
{
    isArray = function(obj) {
        return typeof(obj) == "object" && Object.prototype.toString.call( obj ) === '[object Array]'
    }
    isDict = function(obj) {
        return typeof(obj) == "object" && Object.prototype.toString.call( obj ) !== '[object Array]'
    }

    modalFormSelector = '[data-modal-form]'
    formSelector = '[data-form]'

    $.fn.ajaxResponse = function(data, form, cb)
    {
        if(typeof(data) == "object")
        {
            if(data.remove)
            {
                if(isArray(data.remove)) { for(var i in data.remove) { $(data.remove[i]).remove(); } }
                if(isDict(data.remove)) { for(var id in data.remove) { $(id).remove(); } }
                else { $(data.remove).remove(); }
            }
            if(data.replace)
            {
                if(isArray(data.replace))
                {
                    for(var i in data.replace)
                    {
                        var elm = $(data.replace[i]);
                        var old = $('#'+elm.attr('id'));
                        if(old.length)
                        {
                            old.replaceWith(elm);
                        }
                    }
                }
                else if(isDict(data.replace))
                {
                    for(var id in data.replace)
                    {
                        var old = $('#'+id);
                        if(old.length)
                        {
                            old.replaceWith($(data.replace[id]));
                        }
                    }
                }
                else {
                    var $elm = $(data.replace)
                    if($elm.attr('id'))
                    {
                        $('#'+$elm.attr('id')).replaceWith($elm);
                    }
                }
            }
            if(data.replaceInner)
            {
                if(isArray(data.replaceInner))
                {
                    for(var i in data.replaceInner)
                    {
                        var elm = $(data.replaceInner[i]);
                        var old = $('#'+elm.attr('id'));
                        if(old.length)
                        {
                            old.html(elm.html());
                        }
                    }
                }
                else if(isDict(data.replaceInner))
                {
                    for(var id in data.replaceInner)
                    {
                        var old = $('#'+id);
                        if(old.length)
                        {
                            old.html($(data.replaceInner[id]).html());
                        }
                    }
                }
                else {
                    var $elm = $(data.replaceInner)
                    if($elm.attr('id'))
                    {
                        $('#'+$elm.attr('id')).html($elm.html());
                    }
                }
            }
            if(data.permanotice)
            {

                if(isDict(data.permanotice)) { $.fn.notice(data.permanotice, { delay:0 }); }
                else if(isArray(data.permanotice)) { for(var id in data.permanotice) { $.fn.notice(data.permanotice[id], { delay:0 });  } }
                else { $.fn.notice(data.notice, { delay:0 }); }
            }
            if(data.notice)
            {
                if(isDict(data.notice)) { $.fn.notice(data.notice); }
                else if(isArray(data.notice)) { for(var i in data.notice) { $.fn.notice(data.notice[i]); } }
                else { $.fn.notice(data.notice); }
            }
            if(data.replaceModal)
            {
                data.leaveModal = true;
                $(modalFormSelector).replaceWith(data.replaceModal).modalAddClose();
            }
            if(data.redirectModal)
            {
                $(modalFormSelector).addClass('loading')
                data.leaveModal = true;
                $.get(data.redirectModal, function(data)
                {
                    $(modalFormSelector).replaceWith(data).modalAddClose();
                })
            }
            if(data.redirect)
            {
                document.location.href = data.redirect;
                return;
            }
            if(!data.leaveModal)
            {
                $(modalFormSelector).modal('close');
            }
            if(data.callback)
            {
                window[data.callback](data);
                $(modalFormSelector).modal('close');
                return;
            }
        }
        else
        {
            var $data = $(data);
            if($data.is(modalFormSelector))
            {
                $(modalFormSelector).html($data.html()).modalAddClose();
            }
            else if($data.is(formSelector) && form)
            {
                form.html($data.html());
            }
            else if($data.attr('id'))
            {
                $('#'+$data.attr('id')).replaceWith($data);
                $(modalFormSelector).modal('close');
            }
            else {
                var nd = document.open("text/html", "replace");
                nd.write(data);
                nd.close();
            }
        }
        Materialize.updateTextFields();
        $('[data-slick]').trigger('mouseenter');
        $('[data-select]').material_select();
        $('[data-tree]').workonTree();
    }
    $(document).on('click', '[data-ajax-href]', function(e)
    {
      var target = $(this).data('ajax-href');
      var options = {
          type: "GET",
          url: target,
          success: function(data) { $.fn.ajaxResponse(data); }
      };
      $.ajax(options);
      e.stopPropagation();
      return false;
    });
    $(document).on('click', '[data-post-href]', function(e)
    {
      var target = $(this).data('post-href');
      var options = {
          type: "POST",
          data: $(this).data('post-data'),
          url: target,
          success: function(data) { $.fn.ajaxResponse(data); }
      };
      $.ajax(options);
      e.stopPropagation();
      return false;
    });
    $(document).ready(function()
    {
      $('[data-ajax-loadin]').each(function(i, self)
      {
          console.log(self)
          self = $(this);
          var target = self.data('ajax-loadin');
          var options = {
              type: "GET",
              url: target,
              success: function(data) {
                self.prepend(data);
                self.removeClass('loading');
              }
          };
          $.ajax(options);
      });
    });

    $(document).on('submit', formSelector + ', '+modalFormSelector, function(e, form)
    {
        form = $(this);
        form.addClass('loading');
        method = form.attr('method')
        var options = {
            type: method ? method : 'POST',
            url: form.attr('action'),
            success: function(data)
            {
                $.fn.ajaxResponse(data, form);
                form.removeClass('loading');
            }
        };
        if(form.attr('enctype') == 'multipart/form-data')
        {
            var formData = new FormData(form[0]);
            options.data = formData;
            options.contentType = false;
            options.processData = false;

            if(form[0].additionnalFormData) {
                for(var i in form[0].additionnalFormData) 
                {                    
                    options.data.append(i, form[0].additionnalFormData[i]);
                }
                form[0].additionnalFormData = null;
            }
        }
        else
        {
            options.data = form.serializeArray();
            if(form[0].additionnalFormData) {
                for(var i in form[0].additionnalFormData) 
                {                    
                    options.data.push({ 'name': i, 'value': form[0].additionnalFormData[i] });
                }
                form[0].additionnalFormData = null;
            }
        }
        console.log(options);
        $.ajax(options);
        e.stopPropagation();
        return false;
    });

    $(document).on('click', 
      formSelector + ' [type="submit"][name], '+modalFormSelector + ' [type="submit"][name]', 
      function(e, form)
    {
        data = {}
        data[$(this).attr('name')] = $(this).val();
        this.form.additionnalFormData = data
        // $(this.form).submit();
    });





    $(document).on('change', '[data-search-form] input, [data-search-form] select, [data-search-form] textarea', function(e, form)
    {
        $(this.form).submit();
    });
    $(document).on('keyup', '[data-search-form] input[type="text"]', function(form)
    {
        form = this.form
        clearTimeout(form.submit_timeout);
        form.submit_timeout = setTimeout(function() { $(form).submit(); }, 500);
    });
    $(document).on('submit', '[data-search-form]', function(e, form, target)
    {
        form = $(this);
        target = $('#'+form.data('search-form'))
        var data = $(this).serializeArray();
        // data['csrfmiddlewaretoken'] = null;

        query = $(this).serialize();

        History.pushState({}, null, "?"+query);
        // if (history.pushState) {
        //     var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + $(this).serialize();
        //     window.history.pushState({path:newurl},'',newurl);
        // };
        //form.addLoading();
        //data.push({ name:"ajax", value:"1", name:"page", value:page });
        target.addClass('loading');
        $.get(form.attr('action'), data, function(data)
        {
            $.fn.ajaxResponse(data);
            target.removeClass('loading');
        });
        e.stopPropagation();
        return false;
    });











      $(document).ready(function()
      {


          var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';
          $(document).on('change', input_selector, function ()
          {
              if($(this).val().length !== 0 || $(this).attr('placeholder') !== undefined)
              {
                  $(this).siblings('label').addClass('active');
              }
              //validate_field($(this));
          });
          // $(document).on('click', '[type="checkbox"]+label', function ()
          // {

          // });

      $('select').material_select();


      // Function to update labels of text fields
      Materialize.updateTextFields = function() {
        var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';
        $(input_selector).each(function(index, element) {
          var $this = $(this);
          if ($(element).val().length > 0 || element.autofocus || $this.attr('placeholder') !== undefined) {
            $this.siblings('label').addClass('active');
          } else if ($(element)[0].validity) {
            $this.siblings('label').toggleClass('active', $(element)[0].validity.badInput === true);
          } else {
            $this.siblings('label').removeClass('active');
          }
        });
      };

      // Text based inputs
      var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';

      // Add active if form auto complete
      $(document).on('change', input_selector, function () {
        if($(this).val().length !== 0 || $(this).attr('placeholder') !== undefined) {
          $(this).siblings('label').addClass('active');
        }
        validate_field($(this));
      });

      // Add active if input element has been pre-populated on document ready
      $(document).ready(function() {
        Materialize.updateTextFields();
      });

      // HTML DOM FORM RESET handling
      $(document).on('reset', function(e) {
        var formReset = $(e.target);
        if (formReset.is('form')) {
          formReset.find(input_selector).removeClass('valid').removeClass('invalid');
          formReset.find(input_selector).each(function () {
            if ($(this).attr('value') === '') {
              $(this).siblings('label').removeClass('active');
            }
          });

          // Reset select
          formReset.find('select.initialized').each(function () {
            var reset_text = formReset.find('option[selected]').text();
            formReset.siblings('input.select-dropdown').val(reset_text);
          });
        }
      });

      // Add active when element has focus
      $(document).on('focus', input_selector, function () {
        $(this).siblings('label, .prefix').addClass('active');
      });

      $(document).on('blur', input_selector, function () {
        var $inputElement = $(this);
        var selector = ".prefix";

        if ($inputElement.val().length === 0 && $inputElement[0].validity.badInput !== true && $inputElement.attr('placeholder') === undefined) {
          selector += ", label";
        }

        $inputElement.siblings(selector).removeClass('active');

        validate_field($inputElement);
      });

      window.validate_field = function(object) {
        var hasLength = object.attr('data-length') !== undefined;
        var lenAttr = parseInt(object.attr('data-length'));
        var len = object.val().length;

        if (object.val().length === 0 && object[0].validity.badInput === false) {
          if (object.hasClass('validate')) {
            object.removeClass('valid');
            object.removeClass('invalid');
          }
        }
        else {
          if (object.hasClass('validate')) {
            // Check for character counter attributes
            if ((object.is(':valid') && hasLength && (len <= lenAttr)) || (object.is(':valid') && !hasLength)) {
              object.removeClass('invalid');
              object.addClass('valid');
            }
            else {
              object.removeClass('valid');
              object.addClass('invalid');
            }
          }
        }
      };

      // Radio and Checkbox focus class
      var radio_checkbox = 'input[type=radio], input[type=checkbox]';
      $(document).on('keyup.radio', radio_checkbox, function(e) {
        // TAB, check if tabbing to radio or checkbox.
        if (e.which === 9) {
          $(this).addClass('tabbed');
          var $this = $(this);
          $this.one('blur', function(e) {

            $(this).removeClass('tabbed');
          });
          return;
        }
      });



      // File Input Path
      $(document).on('change', '.file-field input[type="file"]', function () {
        var file_field = $(this).closest('.file-field');
        var path_input = file_field.find('input.file-path');
        var files      = $(this)[0].files;
        var file_names = [];
        for (var i = 0; i < files.length; i++) {
          file_names.push(files[i].name);
        }
        path_input.val(file_names.join(", "));
        path_input.trigger('change');
      });

      /****************
      *  Range Input  *
      ****************/

      var range_type = 'input[type=range]';
      var range_mousedown = false;
      var left;

      $(range_type).each(function () {
        var thumb = $('<span class="thumb"><span class="value"></span></span>');
        $(this).after(thumb);
      });

      var showRangeBubble = function(thumb) {
        var paddingLeft = parseInt(thumb.parent().css('padding-left'));
        var marginLeft = (-7 + paddingLeft) + 'px';
        thumb.velocity({ height: "30px", width: "30px", top: "-30px", marginLeft: marginLeft}, { duration: 300, easing: 'easeOutExpo' });
      };

      var calcRangeOffset = function(range) {
        var width = range.width() - 15;
        var max = parseFloat(range.attr('max'));
        var min = parseFloat(range.attr('min'));
        var percent = (parseFloat(range.val()) - min) / (max - min);
        return percent * width;
      }

      var range_wrapper = '.range-field';
      $(document).on('change', range_type, function(e) {
        var thumb = $(this).siblings('.thumb');
        thumb.find('.value').html($(this).val());

        if (!thumb.hasClass('active')) {
          showRangeBubble(thumb);
        }

        var offsetLeft = calcRangeOffset($(this));
        thumb.addClass('active').css('left', offsetLeft);
      });

      $(document).on('mousedown touchstart', range_type, function(e) {
        var thumb = $(this).siblings('.thumb');

        // If thumb indicator does not exist yet, create it
        if (thumb.length <= 0) {
          thumb = $('<span class="thumb"><span class="value"></span></span>');
          $(this).after(thumb);
        }

        // Set indicator value
        thumb.find('.value').html($(this).val());

        range_mousedown = true;
        $(this).addClass('active');

        if (!thumb.hasClass('active')) {
          showRangeBubble(thumb);
        }

        if (e.type !== 'input') {
          var offsetLeft = calcRangeOffset($(this));
          thumb.addClass('active').css('left', offsetLeft);
        }
      });

      $(document).on('mouseup touchend', range_wrapper, function() {
        range_mousedown = false;
        $(this).removeClass('active');
      });

      $(document).on('input mousemove touchmove', range_wrapper, function(e) {
        var thumb = $(this).children('.thumb');
        var left;
        var input = $(this).find(range_type);

        if (range_mousedown) {
          if (!thumb.hasClass('active')) {
            showRangeBubble(thumb);
          }

          var offsetLeft = calcRangeOffset(input);
          thumb.addClass('active').css('left', offsetLeft);
          thumb.find('.value').html(thumb.siblings(range_type).val());
        }
      });

      $(document).on('mouseout touchleave', range_wrapper, function() {
        if (!range_mousedown) {

          var thumb = $(this).children('.thumb');
          var paddingLeft = parseInt($(this).css('padding-left'));
          var marginLeft = (7 + paddingLeft) + 'px';

          if (thumb.hasClass('active')) {
            thumb.velocity({ height: '0', width: '0', top: '10px', marginLeft: marginLeft}, { duration: 100 });
          }
          thumb.removeClass('active');
        }
      });

      /**************************
       * Auto complete plugin  *
       *************************/
      $.fn.autocomplete = function (options) {
        // Defaults
        var defaults = {
          data: {},
          limit: Infinity,
          onAutocomplete: null,
          minLength: 1
        };

        options = $.extend(defaults, options);

        return this.each(function() {
          var $input = $(this);
          var data = options.data,
              count = 0,
              activeIndex = -1,
              oldVal,
              $inputDiv = $input.closest('.input-field'); // Div to append on

          // Check if data isn't empty
          if (!$.isEmptyObject(data)) {
            var $autocomplete = $('<ul class="autocomplete-content dropdown-content"></ul>');
            var $oldAutocomplete;

            // Append autocomplete element.
            // Prevent double structure init.
            if ($inputDiv.length) {
              $oldAutocomplete = $inputDiv.children('.autocomplete-content.dropdown-content').first();
              if (!$oldAutocomplete.length) {
                $inputDiv.append($autocomplete); // Set ul in body
              }
            } else {
              $oldAutocomplete = $input.next('.autocomplete-content.dropdown-content');
              if (!$oldAutocomplete.length) {
                $input.after($autocomplete);
              }
            }
            if ($oldAutocomplete.length) {
              $autocomplete = $oldAutocomplete;
            }

            // Highlight partial match.
            var highlight = function(string, $el) {
              var img = $el.find('img');
              var matchStart = $el.text().toLowerCase().indexOf("" + string.toLowerCase() + ""),
                  matchEnd = matchStart + string.length - 1,
                  beforeMatch = $el.text().slice(0, matchStart),
                  matchText = $el.text().slice(matchStart, matchEnd + 1),
                  afterMatch = $el.text().slice(matchEnd + 1);
              $el.html("<span>" + beforeMatch + "<span class='highlight'>" + matchText + "</span>" + afterMatch + "</span>");
              if (img.length) {
                $el.prepend(img);
              }
            };

            // Reset current element position
            var resetCurrentElement = function() {
              activeIndex = -1;
              $autocomplete.find('.active').removeClass('active');
            }

            // Remove autocomplete elements
            var removeAutocomplete = function() {
              $autocomplete.empty();
              resetCurrentElement();
              oldVal = undefined;
            };

            $input.off('blur.autocomplete').on('blur.autocomplete', function() {
              removeAutocomplete();
            });

            // Perform search
            $input.off('keyup.autocomplete focus.autocomplete').on('keyup.autocomplete focus.autocomplete', function (e) {
              // Reset count.
              count = 0;
              var val = $input.val().toLowerCase();

              // Don't capture enter or arrow key usage.
              if (e.which === 13 ||
                  e.which === 38 ||
                  e.which === 40) {
                return;
              }


              // Check if the input isn't empty
              if (oldVal !== val) {
                removeAutocomplete();

                if (val.length >= options.minLength) {
                  for(var key in data) {
                    if (data.hasOwnProperty(key) &&
                        key.toLowerCase().indexOf(val) !== -1 &&
                        key.toLowerCase() !== val) {
                      // Break if past limit
                      if (count >= options.limit) {
                        break;
                      }

                      var autocompleteOption = $('<li></li>');
                      if (!!data[key]) {
                        autocompleteOption.append('<img src="'+ data[key] +'" class="right circle"><span>'+ key +'</span>');
                      } else {
                        autocompleteOption.append('<span>'+ key +'</span>');
                      }

                      $autocomplete.append(autocompleteOption);
                      highlight(val, autocompleteOption);
                      count++;
                    }
                  }
                }
              }

              // Update oldVal
              oldVal = val;
            });

            $input.off('keydown.autocomplete').on('keydown.autocomplete', function (e) {
              // Arrow keys and enter key usage
              var keyCode = e.which,
                  liElement,
                  numItems = $autocomplete.children('li').length,
                  $active = $autocomplete.children('.active').first();

              // select element on Enter
              if (keyCode === 13 && activeIndex >= 0) {
                liElement = $autocomplete.children('li').eq(activeIndex);
                if (liElement.length) {
                  liElement.trigger('mousedown.autocomplete');
                  e.preventDefault();
                }
                return;
              }

              // Capture up and down key
              if ( keyCode === 38 || keyCode === 40 ) {
                e.preventDefault();

                if (keyCode === 38 &&
                    activeIndex > 0) {
                  activeIndex--;
                }

                if (keyCode === 40 &&
                    activeIndex < (numItems - 1)) {
                  activeIndex++;
                }

                $active.removeClass('active');
                if (activeIndex >= 0) {
                  $autocomplete.children('li').eq(activeIndex).addClass('active');
                }
              }
            });

            // Set input value
            $autocomplete.on('mousedown.autocomplete touchstart.autocomplete', 'li', function () {
              var text = $(this).text().trim();
              $input.val(text);
              $input.trigger('change');
              removeAutocomplete();

              // Handle onAutocomplete callback.
              if (typeof(options.onAutocomplete) === "function") {
                options.onAutocomplete.call(this, text);
              }
            });
          }
        });
      };

    }); // End of $(document).ready

    /*******************
     *  Select Plugin  *
     ******************/

  $.fn.material_select = function (callback) {
    $(this).each(function(){
      var $select = $(this);

      if ($select.hasClass('browser-default')) {
        return; // Continue to next (return false breaks out of entire loop)
      }

      var multiple = $select.attr('multiple') ? true : false,
          lastID = $select.data('select-id'); // Tear down structure if Select needs to be rebuilt

      if (lastID) {
        $select.parent().find('span.caret').remove();
        $select.parent().find('input').remove();

        $select.unwrap();
        $('ul#select-options-'+lastID).remove();
      }

      // If destroying the select, remove the selelct-id and reset it to it's uninitialized state.
      if(callback === 'destroy') {
        $select.data('select-id', null).removeClass('initialized');
        return;
      }

      var uniqueID = Materialize.guid();
      $select.data('select-id', uniqueID);
      var wrapper = $('<div class="select-wrapper"></div>');
      wrapper.addClass($select.attr('class'));
      var options = $('<ul id="select-options-' + uniqueID +'" class="dropdown-content select-dropdown ' + (multiple ? 'multiple-select-dropdown' : '') + '"></ul>'),
          selectChildren = $select.children('option, optgroup'),
          valuesSelected = [],
          optionsHover = false;

      var label = $select.find('option:selected').html() || $select.find('option:first').html() || "";

      // Function that renders and appends the option taking into
      // account type and possible image icon.
      var appendOptionWithIcon = function(select, option, type) {
        // Add disabled attr if disabled
        var disabledClass = (option.is(':disabled')) ? 'disabled ' : '';
        var optgroupClass = (type === 'optgroup-option') ? 'optgroup-option ' : '';
        var multipleCheckbox = multiple ? '<input type="checkbox"' + disabledClass + '/><label></label>' : '';

        // add icons
        var icon_url = option.data('icon');
        var classes = option.attr('class');
        if (!!icon_url) {
          var classString = '';
          if (!!classes) classString = ' class="' + classes + '"';

          // Check for multiple type.
          options.append($('<li class="' + disabledClass + optgroupClass + '"><img alt="" src="' + icon_url + '"' + classString + '><span>' + multipleCheckbox + option.html() + '</span></li>'));
          return true;
        }

        // Check for multiple type.
        options.append($('<li class="' + disabledClass + optgroupClass + '"><span>' + multipleCheckbox + option.html() + '</span></li>'));
      };

      /* Create dropdown structure. */
      if (selectChildren.length) {
        selectChildren.each(function() {
          if ($(this).is('option')) {
            // Direct descendant option.
            if (multiple) {
              appendOptionWithIcon($select, $(this), 'multiple');

            } else {
              appendOptionWithIcon($select, $(this));
            }
          } else if ($(this).is('optgroup')) {
            // Optgroup.
            var selectOptions = $(this).children('option');
            options.append($('<li class="optgroup"><span>' + $(this).attr('label') + '</span></li>'));

            selectOptions.each(function() {
              appendOptionWithIcon($select, $(this), 'optgroup-option');
            });
          }
        });
      }

      options.find('li:not(.optgroup)').each(function (i) {
        $(this)[multiple?'click':'mousedown'](function (e) {
          // Check if option element is disabled
          if (!$(this).hasClass('disabled') && !$(this).hasClass('optgroup')) {
            var selected = true;

            if (multiple) {
              $('input[type="checkbox"]', this).prop('checked', function(i, v) { return !v; });
              selected = toggleEntryFromArray(valuesSelected, i, $select);
              $newSelect.trigger('focus');
            } else {
              options.find('li').removeClass('active');
              $(this).toggleClass('active');
              $newSelect.val($(this).text());
            }

            activateOption(options, $(this));
            $select.find('option').eq(i).prop('selected', selected);
            // Trigger onchange() event
            $select.trigger('change');
            if (typeof callback !== 'undefined') callback();
          }

          e.stopPropagation();
        });
      });

      // Wrap Elements
      $select.wrap(wrapper);
      // Add Select Display Element
      var dropdownIcon = $('<span class="caret">&#9660;</span>');
      if ($select.is(':disabled'))
        dropdownIcon.addClass('disabled');

      // escape double quotes
      var sanitizedLabelHtml = label.replace(/"/g, '&quot;');

      var $newSelect = $('<input type="text" class="select-dropdown" readonly="true" ' + (($select.is(':disabled')) ? 'disabled' : '') + ' data-activates="select-options-' + uniqueID +'" value="'+ sanitizedLabelHtml +'"/>');
      $select.before($newSelect);
      $newSelect.before(dropdownIcon);

      $newSelect.after(options);
      // Check if section element is disabled
      if (!$select.is(':disabled')) {
        $newSelect.dropdown({'hover': false});
      }

      // Copy tabindex
      if ($select.attr('tabindex')) {
        $($newSelect[0]).attr('tabindex', $select.attr('tabindex'));
      }

      $select.addClass('initialized');

      $newSelect.on({
        'focus': function (){
          if ($('ul.select-dropdown').not(options[0]).is(':visible')) {
            $('input.select-dropdown').trigger('close');
          }
          if (!options.is(':visible')) {
            $(this).trigger('open', ['focus']);
            var label = $(this).val();
            if (multiple && label.indexOf(',') >= 0) {
              label = label.split(',')[0];
            }

            var selectedOption = options.find('li').filter(function() {
              return $(this).text().toLowerCase() === label.toLowerCase();
            })[0];
            activateOption(options, selectedOption, true);
          }
        },
        'click': function (e){
          e.stopPropagation();
        }
      });

      $newSelect.on('blur', function() {
        if (!multiple) {
          $(this).trigger('close');
        }
        options.find('li.selected').removeClass('selected');
      });

      options.hover(function() {
        optionsHover = true;
      }, function () {
        optionsHover = false;
      });

      $(window).on({
        'click': function () {
          multiple && (optionsHover || $newSelect.trigger('close'));
        }
      });

      // Add initial multiple selections.
      if (multiple) {
        $select.find("option:selected:not(:disabled)").each(function () {
          var index = $(this).index();

          toggleEntryFromArray(valuesSelected, index, $select);
          options.find("li").eq(index).find(":checkbox").prop("checked", true);
        });
      }

      /**
       * Make option as selected and scroll to selected position
       * @param {jQuery} collection  Select options jQuery element
       * @param {Element} newOption  element of the new option
       * @param {Boolean} firstActivation  If on first activation of select
       */
      var activateOption = function(collection, newOption, firstActivation) {
        if (newOption) {
          collection.find('li.selected').removeClass('selected');
          var option = $(newOption);
          option.addClass('selected');
          if (!multiple || !!firstActivation) {
            options.scrollTo(option);
          }
        }
      };

      // Allow user to search by typing
      // this array is cleared after 1 second
      var filterQuery = [],
          onKeyDown = function(e){
            // TAB - switch to another input
            if(e.which == 9){
              $newSelect.trigger('close');
              return;
            }

            // ARROW DOWN WHEN SELECT IS CLOSED - open select options
            if(e.which == 40 && !options.is(':visible')){
              $newSelect.trigger('open');
              return;
            }

            // ENTER WHEN SELECT IS CLOSED - submit form
            if(e.which == 13 && !options.is(':visible')){
              return;
            }

            e.preventDefault();

            // CASE WHEN USER TYPE LETTERS
            var letter = String.fromCharCode(e.which).toLowerCase(),
                nonLetters = [9,13,27,38,40];
            if (letter && (nonLetters.indexOf(e.which) === -1)) {
              filterQuery.push(letter);

              var string = filterQuery.join(''),
                  newOption = options.find('li').filter(function() {
                    return $(this).text().toLowerCase().indexOf(string) === 0;
                  })[0];

              if (newOption) {
                activateOption(options, newOption);
              }
            }

            // ENTER - select option and close when select options are opened
            if (e.which == 13) {
              var activeOption = options.find('li.selected:not(.disabled)')[0];
              if(activeOption){
                $(activeOption).trigger('click');
                if (!multiple) {
                  $newSelect.trigger('close');
                }
              }
            }

            // ARROW DOWN - move to next not disabled option
            if (e.which == 40) {
              if (options.find('li.selected').length) {
                newOption = options.find('li.selected').next('li:not(.disabled)')[0];
              } else {
                newOption = options.find('li:not(.disabled)')[0];
              }
              activateOption(options, newOption);
            }

            // ESC - close options
            if (e.which == 27) {
              $newSelect.trigger('close');
            }

            // ARROW UP - move to previous not disabled option
            if (e.which == 38) {
              newOption = options.find('li.selected').prev('li:not(.disabled)')[0];
              if(newOption)
                activateOption(options, newOption);
            }

            // Automaticaly clean filter query so user can search again by starting letters
            setTimeout(function(){ filterQuery = []; }, 1000);
          };

      $newSelect.on('keydown', onKeyDown);
    });

    function toggleEntryFromArray(entriesArray, entryIndex, select) {
      var index = entriesArray.indexOf(entryIndex),
          notAdded = index === -1;

      if (notAdded) {
        entriesArray.push(entryIndex);
      } else {
        entriesArray.splice(index, 1);
      }

      select.siblings('ul.dropdown-content').find('li:not(.optgroup)').eq(entryIndex).toggleClass('active');

      // use notAdded instead of true (to detect if the option is selected or not)
      select.find('option').eq(entryIndex).prop('selected', notAdded);
      setValueToInput(entriesArray, select);

      return notAdded;
    }

    function setValueToInput(entriesArray, select) {
      var value = '';

      for (var i = 0, count = entriesArray.length; i < count; i++) {
        var text = select.find('option').eq(entriesArray[i]).text();

        i === 0 ? value += text : value += ', ' + text;
      }

      if (value === '') {
        value = select.find('option:disabled').eq(0).text();
      }

      select.siblings('input.select-dropdown').val(value);
    }
  };

}( jQuery ));
