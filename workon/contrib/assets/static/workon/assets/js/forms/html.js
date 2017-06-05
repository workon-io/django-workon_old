(function ($)
{
    function workon_load_html_input($input, config, id)
    {
        if($input[0].workon_load_html_input_loaded)
        {
            return;
        }
        if ($input.parents('.empty-form').length == 0 &&
            $input.parents('.form-__prefix__').length == 0)
        {
            $input[0].workon_load_html_input_loaded = true;
            config = $input.data('html_input');
            if(!config.apply_format)
            {
                config.apply_format = 'html'
            }
            if(config.type == "tinymce")
            {
                var tinymce_config = config['settings'];
                id = tinymce_config['elements'];
                if(id.match(/__prefix__/i)) {
                    id = $input.attr('id');
                    tinymce_config['elements'] = id
                }

                if (tinymce.editors[id])
                {
                    tinymce.editors[id].destroy()
                }
                if (!tinymce.editors[id])
                {
                    tinymce_config.setup = function(editor)
                    {
                        editor.on('change', function(e)
                        {
                            if(config.placeholder && !config.settings.placeholder_disabled)
                            {
                                var content = editor.getContent({ format : config.apply_format });
                                var content_text = $.trim(editor.getContent({ format : 'text' }).replace(/^\s+|\s+$/g, ''));
                                if(config.apply_format == "text")
                                {
                                    content = $.trim(content.replace('&nbsp;', ''))
                                }

                                // if(config.inline)
                                // {
                                    placeholder = editor.getElement().getAttribute("placeholder");
                                    if (typeof placeholder !== 'undefined' && placeholder !== false && content_text == placeholder)
                                    {
                                        return;
                                    }
                                    $input.html(content).change();
                                // }
                            }
                        });
                        editor.on('change', function (e) {
                            editor.save();
                        });
                        // editor.on('submit', function(e)
                        // {
                        //     var content = editor.getContent({ format : config.apply_format });
                        //     var content_text = $.trim(editor.getContent({ format : 'text' }).replace(/^\s+|\s+$/g, ''));
                        //     if(config.apply_format == "text")
                        //     {
                        //         content = $.trim(content.replace('&nbsp;', ''))
                        //     }
                        //     placeholder = editor.getElement().getAttribute("placeholder");
                        //     if (typeof placeholder !== 'undefined' && placeholder !== false && content_text == placeholder)
                        //     {
                        //         return;
                        //     }
                        //     $input.html(content).change();
                        // });
                        editor.on('init', function(e, placeholder)
                        {
                            var textarea = editor.getElement();
                            $(editor.editorContainer).before(textarea);
                            textarea.style.display = "";
                            if(config.placeholder && !config.settings.placeholder_disabled)
                            {
                                placeholder = textarea.getAttribute("placeholder");
                                if (typeof placeholder !== 'undefined' && placeholder !== false)
                                {
                                    //var label = new Label;
                                    function onFocus()
                                    {
                                        var content = editor.getContent({ format : 'text' }).replace(/^\s+|\s+$/g, '');
                                        if(content == '' || content == placeholder)
                                        {
                                            editor.focus();
                                            editor.setContent('');
                                            tinymce.setActive(editor);
                                            editor.focus();
                                            editor.execCommand('mceFocus', false, id);
                                            $(editor.getElement()).click();
                                        }
                                    }

                                    function onBlur()
                                    {
                                        var content = editor.getContent({ format : 'text' }).replace(/^\s+|\s+$/g, '');
                                        if(content == '')
                                        {
                                            var placeholder_html = '<span style="font-style:italic;color:grey;" class="workon-html_input-placeholder">'+placeholder+'</span>'
                                            editor.setContent(placeholder_html);
                                            editor.getElement().innerHTML = placeholder_html
                                        }
                                    }
                                    //tinymce.DOM.bind(label.el, 'click', onFocus);
                                    editor.on('focus', onFocus);
                                    editor.on('blur', onBlur);
                                    onBlur();
                                }
                            }

                        });
                    }
                    var instance = tinymce.init(tinymce_config);
                }
            }
        }
    }

    $(function ()
    {
        $('[data-html_input]').each(function(i, self)
        {
            workon_load_html_input($(self));
        });

        $(document).on('mouseup', function(self)    {
            setTimeout(function()
            {
                // We have to wait until the inline is added
                $('[data-html_input]').each(function(i, self)
                {
                    workon_load_html_input($(self));
                });
            }, 250);
        });

    });

}(jQuery));
// }
// if(typeof tinymce == 'undefined' )
// {
//     var script = document.createElement('script');
//     script.src = "//tinymce.cachefly.net/4.2/tinymce.min.js";
//     var head = document.getElementsByTagName('head')[0], done = false;
//     script.onload = script.onreadystatechange = function()
//     {
//         if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete'))
//         {
//             done = true
//             // callback function provided as param
//             workon_load_html_input();
//             console.log('load')
//             script.onload = script.onreadystatechange = null;
//             head.removeChild(script);
//         };
//     };
//     head.appendChild(script);
// }
// else
// {
//     workon_load_html_input();
// }