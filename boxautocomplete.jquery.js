/*!
 * Bootstrap BoxAutocomplete Selector v0.1.0 (https://github.com/Djagu/bootstrap-boxautocomplete-selector.git)
 *
 * Copyright 2013-2014 bootstrap-boxautocomplete-selector
 * Licensed under MIT (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)
 */
      (function ( $ ) {

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
            uniqueValue: true,
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
              {
                var dataClone = jQuery.extend(true, {}, dataItem);
                delete dataClone.baSelected;
                jItem.attr('data-ba-value', JSON.stringify(dataClone));
              }
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


          var ba = this;

          this.isValueInData = function(value)
          {
            var found = false;
            var params;
              this.each(function(index){
                var cItems = $(this).closest('.ba-box-autocomplete').find('.ba-available-items .list-group-item');
                var cItems2 = $(this).closest('.ba-box-autocomplete').find('.ba-selected-items .list-group-item');
                cItems.add(cItems2);
                cItems.each(function(){
                  params = jQuery.parseJSON($(this).attr('data-ba-value'));
                  if ((settings.valueFormat == "json" && params.value == value) || (settings.valueFormat == "text" && params == value))
                  {
                      found = true;
                      return true;
                  }
                });
                if (found == true)
                  return true;
              });
              return found;
          };

          this.addDataItem = function(iData, iContainer){

              console.log("Add data item function...");
              var max = 1;
              var l;
              var cContainer;
              if (iContainer === undefined)
              {
                  max = ba.length;
              }
              console.log("Max = " + max);
              var items = [];
              // Si on n'accepte que des valeurs uniques
              if (settings.uniqueValue === true)
              {
                console.log("Values must be uniques...");
                  if (iData === undefined || iData.value === undefined || ba.isValueInData(iData.value))
                  {
                    console.log("Return in unique data item..");
                    console.log("Concerned data = " + iData.value);
                      return items;
                  }
              }
              for (l = 0; l < max; l++)
              {
                  if (iContainer === undefined)
                  {
                    cContainer = ba.eq(l).parent().find('.ba-available-items');
                    console.log("container = " + cContainer);
                  }
                  else
                  {
                    cContainer = iContainer;
                  }
                  var item = settings.getItem(iData, settings.valueFormat);
                    // Attaching click event
                    console.log("item buttons length = " + item.find('.ba-add').length);
                  item.find('.ba-add').off('click').click(function(e){
                  e.preventDefault();
                  $(this).toggleClass('hide');
                  var k = $(this).closest('.list-group-item');
                  k.find('.ba-remove').toggleClass('hide');
                  selected = $(this).closest('.ba-box-autocomplete').find('.ba-selected-items');
                  selected.scrollTop(selected[0].scrollHeight + 50);
                  k.appendTo(selected);
                  settings.updateInput(cContainer.closest('.ba-box-autocomplete').find('input:not(.ba-search)'), settings.valueFormat);
                  });
                  item.find('.ba-remove').off('click').click(function(e){
                      e.preventDefault();
                      $(this).toggleClass('hide');
                      var k = $(this).closest('.list-group-item');
                      k.find('.ba-add').toggleClass('hide');
                      k.appendTo($(this).closest('.ba-box-autocomplete').find('.ba-available-items'));
                      settings.updateInput(cContainer.closest('.ba-box-autocomplete').find('input:not(.ba-search)'), settings.valueFormat);
                  });
                  cContainer.append(item);
                  items.push(item);
              }
              return items;
            };

            this.addSelectedItem = function(item)
            {
                var ret = ba.addDataItem(item);
                for (var r in ret)
                {
                    ret[r].find('.ba-add').click();
                }
            };


          var readyDataLaunch = function(el)
          {
              // For each input on which we would like to put the box autocomplete
              var selectedContainer;
              var availableContainer;
              var i;
              var inputValue
          el.each(function(){
            if (settings.hideInput === true)
              $(this).hide();
            $(this).wrap('<div class="row ba-box-autocomplete"></div>');
            $(this).before('<div class="col-md-6"><ul class="list-group ba-available-items"></ul></div>');
            $(this).before('<div class="col-md-6"><ul class="list-group ba-selected-items"></ul></div>');
            availableContainer = $(this).parent().find('.ba-available-items');

            // Append the items that can appear in the input value by default
            inputValue = $(this).attr('value');
            if (inputValue !== undefined && inputValue.length > 0)
            {
              inputValue = $.parseJSON(inputValue);
              for (i in inputValue)
              {
                inputValue[i].baSelected = true;
                settings.data.push(inputValue[i]);
              }
            }

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
            var items;
            for (i in settings.data)
            {
                items = ba.addDataItem(settings.data[i], availableContainer);
                if (settings.data[i].baSelected == true)
                {
                  var j;
                  for (j in items)
                  {
                    items[j].find('.ba-add').click();
                  }
                }
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
