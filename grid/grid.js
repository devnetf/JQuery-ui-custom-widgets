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
        data: null
      },
 
      // the constructor
      _create: function() {
        
        var curr = this;
        var cdata = curr.options.data;
        curr.element.data('setting_button_clicks', 0);
        curr.element.data('numPages', 1);
  
        if(cdata !== null)
        {
          this.element.html(this.buildGrid(cdata));
        }
        
        for(var i in this.options.data['schema'])
        {
          if(cdata['schema'][i]['filterable'])
          {

            //filtering with existing data
            $('#'+ curr.element.attr('id') + '_unique_filter_' + cdata['schema'][i]['name']).change({field_index: i},function (e){

                //rebuild the grid with the filter result or hide the non-match rows

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
              curr.refreshPages();

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
              curr.refreshPages();

            });

          }
          //end filterable settings

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

              setTimeout(function(){ currObj.val(""); }, 3000); 

            });

          }

          //bind the click callback!
          for(var j = 0; j < cdata['records'].length; j++ )
          {
            //index with element id    
            var elementId = "#" + curr.element.attr('id') + cdata['schema'][i]['name'] + '_' + j;

            if($.isFunction(cdata['schema'][i]['onclick']))
            {                
              $(elementId).click({elementId : elementId, row: cdata['records'][j]},cdata['schema'][i]['onclick']); 
            }

            if($.isFunction(cdata['schema'][i]['onhover']))
            {      
              //to be implement...          
              //$(elementId).click({elementId : elementId, row: this.options.data['records'][j]},this.options.data['schema'][i]['onclick']); 
            }
          } 
                  
        } 

        //toggle filter setting column
        $('.'+ curr.element.attr('id') + '_filterable_column').click(function (){

          $('#'+ curr.element.attr('id') + '_filter_setting').toggle();

          if(curr.element.data('setting_button_clicks') % 2 === 0)
          {
              //&#8743; is up arrow in html
              $('.'+ curr.element.attr('id') + '_filterable_column').val($('<div/>').html('&#8743;').text());
          }
          else
          {
               //&#8744; is down arrow in html
              $('.'+ curr.element.attr('id') + '_filterable_column').val($('<div/>').html('&#8744;').text()); 
          }

          curr.element.data('setting_button_clicks', curr.element.data('setting_button_clicks') + 1);

        });

        if(curr.options.maxItemsPerPage !== null)
        {
          //bind events to the paging controls 
          $('#'+ curr.element.attr('id') + '_pages').change(function (){

            curr.gotoPage($(this).val());

          });

          $('#'+ curr.element.attr('id') + '_prev_page').click(function (){

            var currPage = $('#'+ curr.element.attr('id') + '_pages').val();

            if(--currPage > 0)
            {
              $('#'+ curr.element.attr('id') + '_pages').val(currPage);
              curr.gotoPage(currPage);
            }
            
          });

          $('#'+ curr.element.attr('id') + '_next_page').click(function (){

            var currPage = $('#'+ curr.element.attr('id') + '_pages').val();

            if(++currPage <= curr.element.data('numPages'))
            {
              $('#'+ curr.element.attr('id') + '_pages').val(currPage);
              curr.gotoPage(currPage);
            }

          });

        }

        //check all!! =D
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

        if(curr.options.maxItemsPerPage !== null)
        {
         curr.gotoPage(1);
        } 

        this.element.addClass( "ui-grid" ).disableSelection();
        this._refresh();
      },
 
      // called when created, and later when changing options
      _refresh: function() {
        
        var curr = this;
        
        $('input[type=button]').button();
        // trigger a callback/event
        this._trigger( "change" );
      },
 
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
        // remove generated elements
       
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
        this._super( key, value ); 
        return;
      },

      buildGrid: function (itemsObject){

        var gridhtml = "<table><tr>";
        var curr = this;
        var numVisibleItems = 0;

        for( var i in itemsObject['schema'])
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
            gridhtml += '<th>' + global_control + itemsObject['schema'][i]['label'] + ' <input type = "button" class = "'+ curr.element.attr('id') + '_filterable_column grid-ui-icon" value ="&#8744;"/>' + '</th>';
          }
          else
          {
            gridhtml += '<th>' +  global_control + itemsObject['schema'][i]['label'] + '</th>';
          }

          numVisibleItems++;  

        } 

        gridhtml += "</tr>";
        gridhtml += '<tr id = "'+ curr.element.attr('id') + '_filter_setting" style = "display:none;">';

        for( var i in itemsObject['schema'])
        {

          if(itemsObject['schema'][i]['hidden'])
          {
            continue;
          }

          gridhtml += "<td>";

          //implement filtering form here
          if(itemsObject['schema'][i]['filterable'])
          {
            var items = [];
      
            $.each(itemsObject['records'], function( index, value ) {
               items.push(value[itemsObject['schema'][i]['name']]);                          
            });

            items = this.unique(items);
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

          gridhtml += "</td>";
        }

        gridhtml += "</tr>";

        for(var row in itemsObject['records'])
        {

            gridhtml += '<tr class = "ui-grid-record_row">';

          
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

                      gridhtml += '<img width = "' + schema['width'] + '" height = "' + schema['height'] + '" id = "'+ elementId + '" src = "' + itemsObject['records'][row][j] + '" />';

                   break;

                   case 'button':

                      gridhtml += '<input type = "button" id = "'+ elementId + '" value = "'+itemsObject['records'][row][fieldName]+'" />'; 

                   break;

                   default:
                   //text
                      gridhtml += '<span id = "'+ elementId + '">'+ itemsObject['records'][row][fieldName] + '</span>'; 
                }

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
          gridhtml += '</span>';
          gridhtml += '<span id = "' + curr.element.attr('id') + '_page_description" style = "float: right;">';        
          gridhtml += '</span>';
          gridhtml += "</td></tr>";
        }

        gridhtml += "</table>";

        return gridhtml;

      },

      gotoPage: function (pageNum){
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

      refreshPages: function(){

        var curr = this;
        var max = parseInt(curr.options.maxItemsPerPage,10);
        var numPages = Math.ceil((curr.options.data['records'].length - $('.ui-grid-unmatch_rows').size())/max);

        curr.gotoPage(1);
        var newOptions = "";

        for(var opt = 1; opt <= numPages; opt++)
        {
          newOptions += '<option value = "'+ opt +'">' + opt + '</option>';
        }

        $('#'+ curr.element.attr('id') + '_pages').html(newOptions);
        curr.element.data('numPages', numPages);

      },

      unique: function (list) {
        var result = [];
        $.each(list, function(i, element) {
          if ($.inArray(element, result) == -1) result.push(element);
        });
        return result;
      }
    });
   
   
