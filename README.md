JQuery-ui-custom-widgets
========================

*	add-ons for JQuery-UI
*	JSFIDDLE demo examples: http://jsfiddle.net/masterzeroquest/k4wpp/
*	Demo 2 with array structure for data option: http://jsfiddle.net/masterzeroquest/k4wpp/1/

grid.js
-------

*	includes: jquery, jquery-ui, grid.js, grid.css

#### basics structure:

######HTML:
	<div id = "mygrid" ></div>

######JavaScript: 
	var mygrid = $("#mygrid").grid({
                maxItemsPerPage: null,
                data: {
                        schema : [
                        { 
                          label : 'Commands',
                          name : "commands",
                          type : 'checkbox',
                          onclick: null, 
                          actions: {
                          
                          	command1: {
                          	
                          	label: 'Command 1',
                          	callback: function(select_rows){}
                          	
                          	},
                          	command2: {
                          	
                          	label: 'Command 2',
                          	callback: function(select_rows){}
                          	
                          	}
                          
                          },
                          actionsMsg : 'Select a Command',  // default text display for actions dropdown.                 
                        },
                         { 
                          label : 'Col 1',
                          name : "col1",
                          type : 'text',
                          onclick: null, 
                          height : '',
                          width : '',
                          id : true,
                          hidden: true,
                        },
                        { 
                          label : 'Col 2',
                          name : "col2", // column name, similar structure as SQL tables column name.
                          type : 'text', //type can be text, checkbox, radio, image or button. 
                          onclick: function (row){}, //bind a click callback on each row.  
                          height : '', //height and width of the cell
                          width : '', 
                          hidden: false, //if true, this column will be hidde
                          id : false,  // flag this column as ID
                          filterable: true, //enable filters
                          tooltip : true, //enable tooltips, often use with truncate
                          truncate : true //truncate text with CSS ellipsis 
                        },
                        ],
                        records : [
                        
                        {commands: '', col1 : 'sometext', col2 : 'some value'},
                        {commands: '', col1 : 'sometext2', col2 : 'some value2'},
                        {commands: '', col1 : 'sometext3', col2 : 'some value3'},
                        ]

                      }

            });  



hmenu.js
--------

*	includes: jquery, jquery-ui, hmenu.js, hmenu.css

#### apply default options: 

######HTML:
	<div id = "mymenu" >
	<ul>
     	<li class = "active has-sub"><a>item 1</a>
		<ul>
			<li><a>subitem 1</a>
		</ul>
	 </li>
	 <li class = "has-sub"><a>item 2</a>
	 <!-- same thing  -->	
	 </li>
	</ul>
    	</div>


######JavaScript: 
	$('#mymenu').hmenu();

####custom options: 

######HTML:
	<div id = "mymenu" ></div>

######JavaScript: 
	$('#mymenu').hmenu({
	
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
	      data:  {
	                    item1: 
						{
	                       label: 'item 1',
	                       active : true,
	                       subItems: null,
	                       onclick: function (){ alert('heey');},
	                    }, 
	
	                    item2: 
	                    {
						label: 'item 2',
						active : false,
						onclick: function (){ alert('heey2');},
						subItems:  {
										subitem1 : 
										{
											label : 'gg', 
											active: false, 
											subItems: null,
											onclick: function (){ alert('heey3');}
										}, 
										subitem2 : 
										{
											label : 'gg2', 
											active: false, 
											subItems: null, 
											onclick: "http://www.google.ca"
										},								
								   } 
	                    },
	
						item3: 
						{
	                       label: 'item 3',
	                       active : false,
	                       subItems: null,
	                       onclick: function (){ alert($(this).html());},
	                    } 
	               }
	                    
	    });
	    
######The data option also allows to use array instead of object.

	$('#mymenu').hmenu({
	
	      data:  [
	           
	                    {
	                       label: 'item 1',
	                       active : true,
	                       subItems: null,
	                       onclick: function (){ alert('heey');},
	                    }, 
	
	          
	                     {
	                        label: 'item 2',
	                        active : false,
	                        onclick: function (){ alert('heey2');},
	                        subItems:  [
	                                  
	                                     {
	                                        label : 'gg', 
	                                        active: false, 
	                                        subItems: null,
	                                        onclick: function (){   
	                                            alert('heey3');
	                                        }
	                                     }, 
	                                
	                                     {
	                                        label : 'gg2', 
	                                        active: false, 
	                                        subItems: null, 
	                                        onclick: "http://www.google.ca"
	                                     },                              
	                               ]
	                     },
	
	                     
	                     {
	                       label: 'item 3',
	                       active : false,
	                       subItems: null,
	                       onclick: function (){ alert($(this).html());},
	                     } 
	               ]
	
	    });

*Note that the "data" option allows you to give a JSON to populate the menu instead of writing html. If the data is not setted, the widget will look for an html body.
The onclick can either take a string URL or a callback function.*

spoiler.js
----------
*	includes: jquery, jquery-ui, spoiler.js, spoiler.css

####apply default options: 
######HTML:
	<div id = "myspoiler" >
	<span></span><input type = "button" value = "" />
	<div class = "ui-spoiler-hidden"></div>
	</div>

######JavaScript: 
	$('#myspoiler').spoiler();

####custom options: 
######HTML:
	<div id = "myspoiler" ></div>

######JavaScript:
	$('#myspoiler').spoiler({
	
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
		data: {header : '<b>this is header</b>', content : 'this is content'}
	
	});
