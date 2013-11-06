/*
 *  Document   : grid.js
 *  Created on : 28-Oct-2013
 *  Author     : Shao Hang He
 *  Description: core Javascript File for grid plugin
 */

    $.widget( "custom.grid", {
      // default options
      options: {
        maxItemsPerPage:null,
        refresh : null,
        data: null
      },
 
      // the constructor
      _create: function() {
        
        var curr = this;
        var cdata = curr.options.data;
        curr.element.data('setting_button_clicks', 0);
        curr.element.data('numPages', 1);

        //make an id for the current element if it does not have one
        if(curr.element.attr('id') == "" || curr.element.attr('id') === undefined || curr.element.attr('id') === null)
        {
          curr.element.attr('id', 'grid-' + _makeId(10));
        }

        //build html of the grid 
        if(cdata !== null)
        {
          this.element.html(this._buildGrid(cdata));
        }
        
        for(var i in cdata['schema'])
        {
          if(cdata['schema'][i]['filterable'])
          {
            //filtering with existing data (dropdown menu)
            $('#'+ curr.element.attr('id') + '_unique_filter_' + cdata['schema'][i]['name']).change({field_index: i}, function (e){

              var match_rows = [];

              $('#'+ curr.element.attr('id') + '_unique_filter_custom_' + cdata['schema'][e.data.field_index]['name']).val("");

              $("#" + curr.element.attr('id') + ' .ui-grid-unmatch_rows').each(function (){

                $(this).removeClass('ui-grid-unmatch_rows');

              });

              for(var j = 0; j < cdata['records'].length; j++)
              {
                var elementId = "#" + curr.element.attr('id') + cdata['schema'][e.data.field_index]['name'] + '_' + j;

                for(var k in cdata['schema'])
                {

                  var curr_filter_val = $('#'+ curr.element.attr('id') + '_unique_filter_' + cdata['schema'][k]['name']).val();

                  if(curr_filter_val == "")
                  {
                    //skip null value ""
                    continue;
                  }

                  if(cdata['schema'][k]['filterable'] && cdata['records'][j][cdata['schema'][k]['name']] !=  curr_filter_val)
                  {
                    //unmatch items
                    var item_row = $(elementId).closest('tr');

                    if(!item_row.hasClass('ui-grid-unmatch_rows'))
                    {
                      item_row.addClass('ui-grid-unmatch_rows');
                    }

                  } 

                }             
              }                                                  

              //refresh to page 1
              curr._refreshPages();

            }); 

            //filtering with query
            $('#'+ curr.element.attr('id') + '_unique_filter_custom_' + cdata['schema'][i]['name']).keyup({field_index: i}, function (e){

              var match_rows = [];

              $('#'+ curr.element.attr('id') + '_unique_filter_' + cdata['schema'][e.data.field_index]['name']).val("");

              $("#" + curr.element.attr('id') + ' .ui-grid-unmatch_rows').each(function (){

                $(this).removeClass('ui-grid-unmatch_rows');

              });

              for(var j = 0; j < cdata['records'].length; j++)
              {
                var elementId = "#" + curr.element.attr('id') + cdata['schema'][e.data.field_index]['name'] + '_' + j;

                for(var k in cdata['schema'])
                {

                  var curr_filter_val = $('#'+ curr.element.attr('id') + '_unique_filter_custom_' + cdata['schema'][k]['name']).val();

                  if(curr_filter_val == "")
                  {
                    //skip null value ""
                    continue;
                  }

                  var cell_data =  cdata['records'][j][cdata['schema'][k]['name']];

                  if( cdata['schema'][k]['filterable'] && cell_data.indexOf(curr_filter_val) === -1 && curr_filter_val.indexOf(cell_data) === -1)
                  {
                    //unmatch items
                    var item_row = $(elementId).closest('tr');
                    
                    if(!item_row.hasClass('ui-grid-unmatch_rows'))
                    {
                      item_row.addClass('ui-grid-unmatch_rows');
                    }

                  } 

                }             
              }    

              //refresh to page 1
              curr._refreshPages();

            });

          }
          //end filterable settings

          //actions is only for checkbox/radio button fields
          if($.isPlainObject(cdata['schema'][i]['actions']) && !$.isEmptyObject(cdata['schema'][i]['actions']))
          {
            $('#' + curr.element.attr('id') + '_' + cdata['schema'][i]['name'] + '_action_dropdown').change({field_index: i},function (e){

              var currObj = $(this);

              if(currObj.val() == "")
              {
                return;
              } 

              var currActionKey = $(this).val();
              var actionFunc = cdata['schema'][e.data.field_index]['actions'][currActionKey]['callback'];

              if($.isFunction(actionFunc))
              {
                var elementClass = curr.element.attr('id') + $(this).data('name');
                var checkedItems = [];

                for(var counter = 0; counter < cdata['records'].length; counter++ )
                {
                  //index with element id    
                  var elementId = "#" + curr.element.attr('id') + cdata['schema'][e.data.field_index]['name'] + '_' + counter;
                  var currRow =  $(elementId).closest('tr');

                  if($(elementId).prop('checked'))
                  {
                    checkedItems.push(cdata['records'][counter]);
                  }  

                }
        
                actionFunc(checkedItems);
              }

              //reset the option dropdown after 3 seconds
              setTimeout(function(){ currObj.val(""); }, 3000); 
            });
          }

          //bind the click callback!
          for(var j = 0; j < cdata['records'].length; j++)
          {
            //index with element id    
            var elementId = "#" + curr.element.attr('id') + cdata['schema'][i]['name'] + '_' + j;

            if(!this._isNullOrEmpty(cdata['schema'][i]['width']))
            {
              var width = parseInt(cdata['schema'][i]['width']);

              $(elementId).width(width);

              if(cdata['schema'][i]['truncate'])
              {
                $(elementId).addClass('ui-grid-truncate');
              }

            }

            if(!this._isNullOrEmpty(cdata['schema'][i]['height']))
            {
              var height = parseInt(cdata['schema'][i]['height']);

              $(elementId).height(height);

              if(cdata['schema'][i]['truncate'])
              {
                $(elementId).addClass('ui-grid-truncate');
              }

            }

            //pass in the current row to the click callback
            if($.isFunction(cdata['schema'][i]['onclick']))
            {                
              $(elementId).click({elementId : elementId, row: cdata['records'][j]},cdata['schema'][i]['onclick']); 
            }

            if(cdata['schema'][i]['tooltip'])
            {        
              $(elementId).parent().hover(function (e){ $(this).children('.ui-grid-tooltip').toggle('slow', 'swing');} );
            }
          } 
                  
        } 

        //toggle filter setting column
        $('.'+ curr.element.attr('id') + '_setting_column').click(function (){

          $('#'+ curr.element.attr('id') + '_setting_panel_' + $(this).data('col-name')).toggle('slow', 'swing');

          if($(this).data('setting-button-clicks') % 2 === 0)
          {
              //&#8743; is up arrow in html
              $(this).val($('<div/>').html('&#8743;').text());
          }
          else
          {
               //&#8744; is down arrow in html
              $(this).val($('<div/>').html('&#8744;').text()); 
          }
         
          var newNum = $(this).data('setting-button-clicks') + 1;      
          $(this).data('setting-button-clicks', newNum);

        });

         //bind events to the paging controls
        if(curr.options.maxItemsPerPage !== null)
        { 
          $('#'+ curr.element.attr('id') + '_pages').change(function (){

            curr._gotoPage($(this).val());

          });

          $('#'+ curr.element.attr('id') + '_prev_page').click(function (){

            var currPage = $('#'+ curr.element.attr('id') + '_pages').val();

            if(--currPage > 0)
            {
              $('#'+ curr.element.attr('id') + '_pages').val(currPage);
              curr._gotoPage(currPage);
            }
            
          });

          $('#'+ curr.element.attr('id') + '_next_page').click(function (){

            var currPage = $('#'+ curr.element.attr('id') + '_pages').val();

            if(++currPage <= curr.element.data('numPages'))
            {
              $('#'+ curr.element.attr('id') + '_pages').val(currPage);
              curr._gotoPage(currPage);
            }

          });

        }

        //check all the element on current page!! =D
        $('#' + curr.element.attr('id') + ' .master_checkbox').click(function (){

          var elementClass = curr.element.attr('id') + $(this).data('name');

          if(this.checked)
          {
            $('.' + elementClass).each(function (index, value){

              var item_row = $(this).closest('tr');

              if(!item_row.hasClass('ui-grid-unmatch_rows') && !item_row.hasClass('ui-grid-not_curr_page_rows'))
              {
                $(this).prop('checked', true);
              }

            });
          }
          else
          {
            $('.' + elementClass).each(function (index, value){

              var item_row = $(this).closest('tr');

                if(!item_row.hasClass('ui-grid-unmatch_rows') && !item_row.hasClass('ui-grid-not_curr_page_rows'))
                {
                  $(this).prop('checked', false);
                }
            });
          }
        });

        //initialize to page one 
        if(curr.options.maxItemsPerPage !== null)
        {
          curr._gotoPage(1);
        } 

        //refresh set up: the return data 
        if(curr.options.refresh !== null)
        {
          $('#' + curr.element.attr('id') + '_refresh').click(function (){

            $.ajax({
              type: curr.options.refresh['type'],
              url: curr.options.refresh['url'],
              data: curr.options.refresh['data'],
              dataType: "json",
              success: function(data) {

                curr.options.data['records'] = data;
                curr._refreshData();    

              },
                error: function (xhr, ajaxOptions, thrownError) {
              
                  alert(xhr.responseText);

              }
            });
          });
        }
    
        this.element.addClass( "ui-grid" ).disableSelection();
        $('input[type=button]').button();
        //this._refresh();
      },

      _refresh: function() {

      },
 
      // called when created, and later when changing options
      _refreshData: function() {
        
        var curr = this;
        var id_column_name = null;
        var itemsObject = this.options.data;
       
        //query for the first item that is labeled as id
        for(var i in itemsObject['schema'])
        {
          if(itemsObject['schema'][i]['id'])
          {
            id_column_name = itemsObject['schema'][i]['name'];
            break;
          } 
        }
        
        if(id_column_name === null)
        {
          alert("No coln is defined as id!");
          
        }

        //foreach row, try to find the appropriete data to overwrite
        $("#" + curr.element.attr('id') + " .ui-grid-record_row").each(function (index, value) {

          var keyVal = $(this).data('id-col-val');

          for(var j in itemsObject['records'])
          {
            if(itemsObject['records'][j][id_column_name] == keyVal)
            {
              for(var k in itemsObject['schema'])
              {
                var type = itemsObject['schema'][k]['type'];
                var elementName = itemsObject['schema'][k]['name'];
                var elementId = "#" + curr.element.attr('id') + elementName + '_' + index;

                switch(type)
                {
                   case 'text': 
        
                      $(elementId).html(itemsObject['records'][j][elementName]);
                      $(elementId).next().html(itemsObject['records'][j][elementName]); 

                   break;

                   case 'checkbox':          
                   break;

                   case 'radio':                  
                   break;

                   case 'image': 

                      $(elementId).attr('src', itemsObject['records'][j][elementName]);
                      $(elementId).next().html(itemsObject['records'][j][elementName]); 

                   break;

                   case 'button':

                      $(elementId).val(itemsObject['records'][j][elementName]);
                      $(elementId).next().html(itemsObject['records'][j][elementName]); 

                   break;

                   default:
                   //text
                      $(elementId).html(itemsObject['records'][j][elementName]);
                      $(elementId).next().html(itemsObject['records'][j][elementName]); 
                }
              }
              break;
            }
          }
          
        });

        // i a callback/event
        this._trigger( "change" );
      },
 
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
        // remove generated elements
       
      },
 
      // _setOptions is called with a hash of all options that are changing
      // always refresh when changing options
      _setOptions: function(options) {
        // _super and _superApply handle keeping the right this-context
        //this._superApply( arguments );
        /*for(var opt in options)
        {
          this._setOption(opt, options[opt]);
        }*/
        //this._refresh();
      },
 
      // _setOption is called for each individual option that is changing
      _setOption: function( key, value ) {
        //this._super( key, value ); 
        this.options[ key ] = value;
        this._refresh();
      },

      getData: function ()
      {
          return  this.options.data;
      },

      setData: function (data)
      {
         this.options.data = data;
         console.log(this.options.data);
         this._refreshData();
      },

      _buildGrid: function (itemsObject){

        var gridhtml = "<table><tr>";
        var curr = this;
        var numVisibleItems = 0;

        var id_column_name = null;

        for(var i in itemsObject['schema'])
        {
          if(itemsObject['schema'][i]['id'])
          {
            id_column_name = itemsObject['schema'][i]['name'];
            break;
          } 
        }

        for(var i in itemsObject['schema'])
        {

          var global_control = '';

          if(itemsObject['schema'][i]['type'] == 'checkbox')
          {
            global_control = '<input type = "checkbox" data-name = "'+ itemsObject['schema'][i]['name']+ '" class = "master_checkbox"  /> ';
          } 

          if(itemsObject['schema'][i]['hidden'])
          {
            continue;
          }

          if(itemsObject['schema'][i]['filterable'] || ($.isPlainObject(itemsObject['schema'][i]['actions']) && !$.isEmptyObject(itemsObject['schema'][i]['actions'])))
          {
            gridhtml += '<th>' + global_control + itemsObject['schema'][i]['label'] + ' <input type = "button" data-setting-button-clicks = "0" data-col-name = "'+ itemsObject['schema'][i]['name'] +'" class = "'+ curr.element.attr('id') + '_setting_column grid-ui-icon" value ="&#8744;"/>';
          }
          else
          {
            gridhtml += '<th>' +  global_control + itemsObject['schema'][i]['label'];
          }

          gridhtml += '<div id = "'+ curr.element.attr('id') + '_setting_panel_' + itemsObject['schema'][i]['name'] + '" class = "ui-grid-col-setting" >';

          //implement filtering form here
          if(itemsObject['schema'][i]['filterable'])
          {
            var items = [];
      
            $.each(itemsObject['records'], function( index, value ) {
               items.push(value[itemsObject['schema'][i]['name']]);                          
            });

            items = this._unique(items);
            gridhtml += '<select id = "'+ curr.element.attr('id') + '_unique_filter_' + itemsObject['schema'][i]['name'] + '">';
            gridhtml += '<option value=""> Please select a value </option>';

            for(var index in items)
            {
              gridhtml += '<option value="'+ items[index] +'">' + items[index] + '</option>';
            }

            gridhtml += '</select><br />';

            gridhtml += '<input type = "text" id = "'+ curr.element.attr('id') + '_unique_filter_custom_' + itemsObject['schema'][i]['name'] + '" value = "" placeholder = "Type to query..." />';

          } 

          if($.isPlainObject(itemsObject['schema'][i]['actions']) && !$.isEmptyObject(itemsObject['schema'][i]['actions']))
          {
            //actions can be apply to checkboxes and radio button
            var actions = '<select id = "'+ curr.element.attr('id') + '_' + itemsObject['schema'][i]['name'] + '_action_dropdown">';
            actions += '<option value = "">select an action</option>';

            for(var action in itemsObject['schema'][i]['actions'])
            {
              actions += '<option value = "'+ action +'">' + itemsObject['schema'][i]['actions'][action]['label'] +'</option>';
            }

            actions += '</select>';

            gridhtml += actions;
          }

          gridhtml += '</div>';
          gridhtml += '</th>';

          numVisibleItems++;  

        } 

        gridhtml += "</tr>";

        for(var row in itemsObject['records'])
        {
            
            var rowIdVal = ""; 

            if(id_column_name !== null)
            {
                rowIdVal = itemsObject['records'][row][id_column_name]
            }

            gridhtml += '<tr class = "ui-grid-record_row" data-row-id = "' + row + '" data-id-col-val = "'+ rowIdVal +'">';

          
            for(var j in itemsObject['schema'])
            {
                var schema = itemsObject['schema'][j];
                var fieldName = itemsObject['schema'][j]['name'];
                var elementId = curr.element.attr('id') + schema['name'] + '_' + row;
                var elementClass = curr.element.attr('id') + schema['name'];

                if(schema['hidden'])
                {
                  continue;
                }

                gridhtml += "<td>";
          
                switch(schema['type'])
                {
                   case 'text': 
            
                      gridhtml += '<span id = "'+ elementId + '">'+ itemsObject['records'][row][fieldName] + '</span>'; 

                   break;

                   case 'checkbox': 

                      gridhtml += '<input type = "checkbox"  id = "'+ elementId + '" class = "' + elementClass + '" value = "" />'; 
 
                   break;

                   case 'radio': 

                      gridhtml += '<input type = "radio" name = "' + curr.element.attr('id') + schema['name'] + '"  id = "'+ elementId + '"  value = "" />'; 

                   break;

                   case 'image': 

                      gridhtml += '<img id = "'+ elementId + '" src = "' + itemsObject['records'][row][fieldName] + '" />';

                   break;

                   case 'button':

                      gridhtml += '<input type = "button" id = "'+ elementId + '" value = "'+itemsObject['records'][row][fieldName]+'" />'; 

                   break;

                   default:
                   //text
                      gridhtml += '<span id = "'+ elementId + '">'+ itemsObject['records'][row][fieldName] + '</span>'; 
                }

                gridhtml += '<div class = "ui-grid-tooltip">';
                gridhtml += itemsObject['records'][row][fieldName];
                gridhtml += '</div>';

                gridhtml += "</td>";
            }

            gridhtml += "</tr>";
        }

        if(curr.options.maxItemsPerPage !== null)
        {
          var max = parseInt(curr.options.maxItemsPerPage,10);
          var numRows = itemsObject['records'].length - $('.ui-grid-unmatch_rows').size();
          var numPages = Math.ceil(numRows/max);

          curr.element.data('numPages', numPages);
          gridhtml += '<tr><td colspan = "'+ numVisibleItems +'">';
          gridhtml += '<span id = "' + curr.element.attr('id') + '_pages_control" style = "float: left;">';
          gridhtml += '<input type ="button" id = "' + curr.element.attr('id') + '_prev_page" class = "grid-ui-icon" value = "<" />';
          gridhtml += 'Page: ';
          gridhtml += '<select id = "' + curr.element.attr('id') + '_pages">';

          for(var p = 1; p <= numPages; p++)
          {
            gridhtml += '<option value = "'+ p +'">' + p + '</option>';
          }

          gridhtml += '</select>';
          gridhtml += '<input type ="button" id = "' + curr.element.attr('id') + '_next_page" class = "grid-ui-icon" value = ">" />';

          if(curr.options.refresh !== null)
          {
            gridhtml += '<input type ="button" id = "' + curr.element.attr('id') + '_refresh" class = "grid-ui-icon" value = "R" />';
          }

          gridhtml += '</span>';
          gridhtml += '<span id = "' + curr.element.attr('id') + '_page_description" style = "float: right;">';        
          gridhtml += '</span>';
          gridhtml += "</td></tr>";
        }

        gridhtml += "</table>";

        return gridhtml;

      },

      _gotoPage: function (pageNum){
        //id = "' + curr.element.attr('id') + '_page_description" 
        //display the selected page            
        var curr = this;
        var numPagesToHideInFront = (pageNum - 1) * curr.options.maxItemsPerPage;
        var frontRowCounter = 0;
        var currRowCounter = 0;
        var numRows = curr.options.data['records'].length - $('.ui-grid-unmatch_rows').size();
      

        if (curr.options.maxItemsPerPage === null)
        {
          return;
        }   

        $('#' +  curr.element.attr('id') + ' .ui-grid-record_row').each(function (index, value){

          $(this).removeClass('ui-grid-not_curr_page_rows');

          if(!$(this).hasClass('ui-grid-unmatch_rows') && frontRowCounter < numPagesToHideInFront)
          {
            $(this).addClass('ui-grid-not_curr_page_rows');
            frontRowCounter++;
          }
          else if(!$(this).hasClass('ui-grid-unmatch_rows') && currRowCounter < curr.options.maxItemsPerPage)
          {
            $(this).removeClass('ui-grid-not_curr_page_rows');
            currRowCounter++;
          }
          else
          {
            $(this).addClass('ui-grid-not_curr_page_rows');
          }

        });

        var subtotal = frontRowCounter++ + currRowCounter;
        var page_description = frontRowCounter + '-' + subtotal + ' of ' + numRows;

        if(numRows > 0)
        {
          $("#" + curr.element.attr('id') + '_page_description').html(page_description);
        }
        else
        {
          $("#" + curr.element.attr('id') + '_page_description').html('nothing to display');
        }
        
      },

      _refreshPages: function(){

        var curr = this;
        var max = parseInt(curr.options.maxItemsPerPage,10);
        var numPages = Math.ceil((curr.options.data['records'].length - $('.ui-grid-unmatch_rows').size())/max);

        curr._gotoPage(1);
        var newOptions = "";

        for(var opt = 1; opt <= numPages; opt++)
        {
          newOptions += '<option value = "'+ opt +'">' + opt + '</option>';
        }

        $('#'+ curr.element.attr('id') + '_pages').html(newOptions);
        curr.element.data('numPages', numPages);

      },

      _unique: function (list) {
        var result = [];
        $.each(list, function(i, element) {
          if ($.inArray(element, result) == -1) result.push(element);
        });
        return result;
      },

      _makeId: function(num)
      {
          var text = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      
          for( var i=0; i < num; i++ )
          {
              text += possible.charAt(Math.floor(Math.random() * possible.length));
          }
      
          return text;
      },

      _isNullOrEmpty: function(val)
      {
          return (val === undefined || val === null || val.length == 0);
      },         
    });
   
   
