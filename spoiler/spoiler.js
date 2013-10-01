    $.widget( "custom.spoiler", {
      // default options
      options: {
        width: 200,
        padding: 10,
        fontSize : 0.8,
        color: "#C0FFFF",
        contentTopMargin: 40,
        headerWidth : 150,
        buttonSize: 0.6,
        toggleSpeed: 'slow',
        toggleEasing: 'swing',
        toggleCallback : null,
        data: null
      },

      global_vars: {
        button_clicks : 0
      },
      // the constructor
      _create: function() {
        
        var curr = this;

        if(this.options.data !== null)
        {
             this.element.html(generateSpoiler(this.options.data));
        }

        this.element.addClass( "ui-spoiler" ).disableSelection();
        this.element.find("span").addClass("ui-spoiler-header");
        this.element.find("input[type=button]").val($('<div/>').html('&#8744;').text()); 
        
        this.element.find("input[type=button]").addClass("ui-spoiler-button").bind( 'click', function (){
            
            if(curr.options.toggleSpeed === null || curr.options.toggleSpeed === undefined)
            {
                $(this).parent().find("div[class=ui-spoiler-hidden]").toggle(curr.options.toggleSpeed, curr.options.toggleEasing);
            }
            else
            {
                $(this).parent().find("div[class=ui-spoiler-hidden]").toggle(curr.options.toggleSpeed, curr.options.toggleEasing, curr.options.toggleCallback);
            }
             
            if(curr.global_vars.button_clicks % 2 === 0)
            {
                //&#8743; is up arrow in html
                $(this).val($('<div/>').html('&#8743;').text());
            }
            else
            {
                 //&#8744; is down arrow in html
                $(this).val($('<div/>').html('&#8744;').text()); 
            }

            curr.global_vars.button_clicks++;
        
        });

        this._refresh();
      },
 
      // called when created, and later when changing options
      _refresh: function() {
        
        var curr = this;
        curr.element.css( "width", this.options.width);
        curr.element.css( "padding", this.options.padding);
        curr.element.css( "font-size", this.options.fontSize + "em");
        curr.element.css( "box-shadow", '3px 3px 15px -3px #282828, inset 0 0 45px 10px ' + this.options.color);

        curr.element.children('.ui-spoiler-hidden').css('margin-top', curr.options.contentTopMargin);
        curr.element.children('.ui-spoiler-header').css('width', curr.options.headerWidth );
        curr.element.children('.ui-spoiler-button').css('font-size', curr.options.buttonSize  + "em" );

        curr.element.find('input[type=button]').button();

        // trigger a callback/event
        this._trigger( "change" );
      },
 
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
        // remove generated elements
        this.element.attr('style', '');
        this.element.removeClass( "ui-spoiler" ).enableSelection();
        this.element.find("span").removeClass("ui-spoiler-header");
        this.element.find("input[type=button]").unbind('click');
      },
 
      // _setOptions is called with a hash of all options that are changing
      // always refresh when changing options
      _setOptions: function() {
        // _super and _superApply handle keeping the right this-context
        this._superApply( arguments );
        this._refresh();
      },
 
      // _setOption is called for each individual option that is changing
      _setOption: function( key, value ) {
        return;
        this._super( key, value );
      }
    });
   
    function generateSpoiler(data)
    {
        var output = "";
        output += '<span>' + data['header']  + '</span><input type = "button" value = "" />';
        output +=  '<div class = "ui-spoiler-hidden">' + data['content'] + '</div>';
        
        return output;
    }

    function sumStringArray(array, delimiter)
    {
    
        var str = "";
    
        if(array.length > 0)
        {
            for(var i in array)
            {
                if(i < array.length - 1)
                {
                    str += array[i] + delimiter;
                }       
            }
        }
    
        return str;
    }