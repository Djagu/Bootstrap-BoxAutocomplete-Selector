
      (function ( $ ) {
 

      function toLiteral(str) {
          var dict = {'\b': 'b', '\t': 't', '\n': 'n', '\v': 'v', '\f': 'f', '\r': 'r'};
          return str.replace(/([\\'"\b\t\n\v\f\r])/g, function ($0, $1) {
              return '\\' + (dict[$1] || $1);
          });
        }

        $.fn.boxautocomplete = function( options ) {

          var settings = $.extend({
            data: [],
            dataUrl: false,
            valueFormat: 'text', // text|json
            delemiter: ";",
            hideInput: true,
            search: false,
            searchPlaceholder: "Search for an element...",
            searchButtonText: "Clear",
            searchMin: 1,
            getItem: function(dataItem, valueFormat){
                var item = '<li class="list-group-item">\
                <span class="ba-name"></span>\
                <button type="button" class="btn btn-default btn-sm pull-right ba-add"><i class="fa fa-arrow-right"></i></button>\
                <button type="button" class="btn btn-default btn-sm pull-left ba-remove hide"><i class="fa fa-times"></i></button>\
                <div class="clearfix"></div>\
              </li>';
              var jItem = $(item);
              jItem.find('.ba-name').html(dataItem.name);
              if (valueFormat == "json")
                jItem.attr('data-ba-value', JSON.stringify(dataItem));
              else
                jItem.attr('data-ba-value', dataItem.value);

              return jItem;
            },
            updateInput: function(jInput, valueFormat){
              if (jInput !== undefined)
              {
                jInput.val('');
                jInput.attr('value', '');
                var items = jInput.closest('.ba-box-autocomplete').find('.ba-selected-items .list-group-item');
                var itemSelected = [];
                items.each(function(index){
                  if (valueFormat == "json")
                  {
                    console.log("Pushing = " + $(this).attr('data-ba-value'));
                      itemSelected.push(jQuery.parseJSON($(this).attr('data-ba-value')));
                      // We put it in the val for the last item
                      if (items.length == (index + 1))
                      {
                        console.log("Stringiggg >> " + JSON.stringify(itemSelected));
                        jInput.val(JSON.stringify(itemSelected));
                      }
                  }
                  else
                    jInput.val(jInput.val() + settings.delemiter + $(this).attr('data-ba-value'));
                });
                jInput.attr('value', jInput.val());
              }
            },
            updateDataList: function(data){

            },
            searchFilterBy: function(itemsContainer, filter){
                
                if (itemsContainer !== undefined)
                {
                  console.log("Begin to search...");
                  itemsContainer.find('.list-group-item').each(function(){
                    if($(this).find('.ba-name').eq(0).text().toLowerCase().indexOf(filter.toLowerCase()) != -1)
                    {
                        console.log("Fuond ");
                        $(this).show(); 
                    }
                    else
                    {
                      $(this).hide(); 
                    }
                  });
                }
            }
          }, options );



          var readyDataLaunch = function(el)
          {
              // For each input on which we would like to put the box autocomplete
              var selectedContainer;
          var availableContainer;
          var i;
          el.each(function(){
            if (settings.hideInput === true)
              $(this).hide();
            $(this).wrap('<div class="row ba-box-autocomplete"></div>');
            $(this).before('<div class="col-md-6"><ul class="list-group ba-available-items"></ul></div>');
            $(this).before('<div class="col-md-6"><ul class="list-group ba-selected-items"></ul></div>');
            availableContainer = $(this).parent().find('.ba-available-items');
            // Search functionnality
            if (settings.search === true)
            {
              availableContainer.prepend($('<div class="input-group"><input type="text" class="form-control ba-search" placeholder="'+ settings.searchPlaceholder +'"><span class="input-group-btn"><button class="btn btn-default ba-search-clear" type="button">' + settings.searchButtonText + '</button></span></div>'));
              var searchInput = availableContainer.find('input.ba-search');

              availableContainer.find('.ba-search-clear').click(function(e){
                  e.preventDefault();
                  searchInput.val("");
                  settings.searchFilterBy($(this).closest(".ba-available-items"), "");
              });

              searchInput.keyup(function(e){
                if ($(this).val().length >= settings.searchMin)
                {
                  settings.searchFilterBy($(this).closest('.ba-available-items'), $(this).val());
                  console.log("Filter by = " + $(this).val());
                }
                else
                {
                  // Reset data list
                  settings.searchFilterBy($(this).closest(".ba-available-items"), "");
                }
              });
            
            }
            var item;
            var input = $(this);
            var selected;
              for (i in settings.data)
              {
                  item = settings.getItem(settings.data[i], settings.valueFormat);
                  // Attaching click event
                  item.find('.ba-add').off('click').click(function(e){
                      e.preventDefault();
                      $(this).toggleClass('hide');
                      var k = $(this).closest('.list-group-item');
                      k.find('.ba-remove').toggleClass('hide');
                      selected = $(this).closest('.ba-box-autocomplete').find('.ba-selected-items');
                      selected.scrollTop(selected[0].scrollHeight + 50);
                      k.appendTo(selected);
                      settings.updateInput(input, settings.valueFormat);
                  });
                  item.find('.ba-remove').off('click').click(function(e){
                      e.preventDefault();
                      $(this).toggleClass('hide');
                      var k = $(this).closest('.list-group-item');
                      k.find('.ba-add').toggleClass('hide');
                      k.appendTo($(this).closest('.ba-box-autocomplete').find('.ba-available-items'));
                      settings.updateInput(input, settings.valueFormat);
                  });
                  availableContainer.append(item);
              }
          });
          };
      
          // Getting the DATA if the dataUrl is set
          if (settings.dataUrl !== false)
          {
            var that = this;
            settings.data = [];
              $.get(settings.dataUrl).then(function(data){
                  settings.data = jQuery.parseJSON(data);
                  readyDataLaunch(that);
              });
          }
          else
          {
            readyDataLaunch(this);
          }


        
          return this;
      };
 
    }( jQuery ));
