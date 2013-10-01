/*
 *  Document   : hmenu.js
 *  Created on : 28-Sept-2013
 *  Author     : Shao Hang He
 *  Description: core Javascript File for hmenu plugin
 */
 
    $.widget( "custom.hmenu", {
      // default options
      options: {
        width : '',
        height : '',
        backgroundColor: '#C0FFFF',
        borderBottom : '4px solid #969696',
        borderRadius : ' 5px 5px 0px 0px',
        margin: '0px 0px 0px 0px',
        itemsFontWeight : 'bold',
        itemsFontSize : '12px',
        itemsPaddingTop: '5px',
        itemsPaddingBottom: '0px',
        itemsPaddingLeft: '5px',
        itemsPaddingRight: '5px',
        activeItemColor: '#969696',
        dropdownItemColor: '#616161',
        dropdownItemOpacity: 1.0,
        data: null,
      },

      global_vars: {
        OnClickCallbacks : new Object(),
        ItemIds : [],
        ItemCounter : 0
      },
      // the constructor
      _create: function() {
        
        var curr = this;

        if(this.options.data !== null)
        {
             this.element.html(this.createList(this.options.data));
        }

        for(var i = 0; i < this.global_vars.ItemIds.length; i++)
        {
            $('#' + this.global_vars.ItemIds[i]).bind( 'click', this.global_vars.OnClickCallbacks[this.global_vars.ItemIds[i]]);
        }

        this.element.addClass( "ui-hmenu" ).disableSelection();
        this._refresh();

      },
 
      // called when created, and later when changing options
      _refresh: function() {
        
        var curr = this;
        curr.element.css( "width", this.options.width);
        curr.element.css( "height", this.options.height);
        curr.element.css( "background", this.options.backgroundColor);
        curr.element.css( "border-bottom", this.options.borderBottom);
        curr.element.css( "font-weight", this.options.itemsFontWeight);
        curr.element.css( "margin", this.options.margin);
        curr.element.css( "font-size", this.options.itemsFontSize);
        curr.element.css( "border-radius", this.options.borderRadius);
        curr.element.css( "padding-top", this.options.itemsPaddingTop);
        curr.element.css( "padding-bottom", this.options.itemsPaddingBottom);
        curr.element.css( "padding-left", this.options.itemsPaddingLeft);
        curr.element.css( "padding-right", this.options.itemsPaddingRight);

        curr.element.find('.ui-active').css("background",  this.options.activeItemColor);
        curr.element.find('ul ul a').css("background", this.options.dropdownItemColor);
        curr.element.find('ul ul a').css("opacity", this.options.dropdownItemOpacity);
        curr.element.find('ul ul').css("border-top-color",  this.options.activeItemColor);

        curr.element.children('ul').children('li').children('a').click(function (){

            curr.element.find('ul li').each(function (){

                $(this).removeClass('ui-active');

            });

            $(this).parent().addClass('ui-active');

        });; 

        // trigger a callback/event
        this._trigger( "change" );
      },
 
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
        // remove generated elements
        this.element.attr('style', '');
        this.element.removeClass( "ui-hmenu" ).enableSelection();

        for(var i = 0; i < this.global_vars.ItemIds.length; i++)
        {
            $('#' + this.global_vars.ItemIds[i]).unbind( 'click' );
        }

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
      },

      createList: function(itemsObject)
      {
           var data = "<ul>";
  
           for(var i in itemsObject)
           {
                data += this.createItem(itemsObject[i]);
           }

           data += "</ul>";
       
           return data;
      },

      createItem: function(item)
      {
            var hasSub  = "";
            var active = "";
            var subContent = "";
            var itemId = 'MeneuItem_' + makeId(10) + this.global_vars.ItemCounter++;
            var data = '<li>' + '<a id = "'+ itemId +'">' + item['label'] + '</a>';

            if(item['subItems'] !== null && !item['active'])
            {
                data = '<li class = "ui-has-sub">' + '<a id = "'+  itemId +'">' + item['label'] + '</a>';       
            }
            else if(item['active'] && item['subItems'] === null)
            {
                data = '<li class = "ui-active">' + '<a id = "'+ itemId +'">' + item['label'] + '</a>';   
            }
            else if( item['active'] && item['subItems'] !== null)
            {
                data = '<li class = "ui-active ui-has-sub">' + '<a id = "'+ itemId +'">' + item['label'] + '</a>';     
            }

            if( $.isFunction(item['onclick']) )
            {
                this.global_vars.OnClickCallbacks[itemId] = item['onclick'];
            }
            else if(typeof item['onclick'] === "string")
            {
                this.global_vars.OnClickCallbacks[itemId] = function (){ window.location.href = item['onclick'];};
            }
            else
            {
                this.global_vars.OnClickCallbacks[itemId] = function (){ return false;};
            }

            this.global_vars.ItemIds.push(itemId);

            if(item['subItems'] !== null)
            {
                data += this.createList(item['subItems']);
            }

            data += "</li>";

            return data;
      }      

    });

    function makeId(num)
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    
        for( var i=0; i < num; i++ )
        {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
    
        return text;
    }

    
