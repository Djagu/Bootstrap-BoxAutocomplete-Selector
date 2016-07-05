/*!
 * Bootstrap BoxAutocomplete Selector v0.1.0 (https://github.com/Djagu/bootstrap-boxautocomplete-selector.git)
 *
 * Copyright 2016 bootstrap-boxautocomplete-selector
 * Licensed under MIT 
 */
(function ( $ ) {

    $.fn.boxautocomplete = function( options ) {

        var settings = $.extend({
            data: [], // data
            dataUrl: false, // ajax url to fetch data, used instead of data
            valueFormat: 'text', // text|json
            delemiter: ";", // for the TEXT format
            hideInput: true, //
            search: false,
            searchPlaceholder: "Search for an element...",
            searchButtonText: "Clear",
            searchMin: 1,
            uniqueValue: true,
            withAmount: false,
            amountPositive: true,
            amountStep: 1,
            amountInit: 1,
            withCategory: false,
            allCategories: false,
            allCategoriesText: "All",
            getItem: function(dataItem, valueFormat, withAmount){
                var item = '<li class="list-group-item">\
                <span class="ba-name"></span>\
                <div class="btn-group ba-amount pull-right hide">\
                </div>\
                <button type="button" class="btn btn-primary btn-sm pull-right ba-add"><i class="fa fa-arrow-right"></i></button>\
                <button type="button" class="btn btn-primary btn-sm pull-left ba-remove hide"><i class="fa fa-times"></i></button>\
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

                if (withAmount === true)
                {
                    var withAmountTemplate = '<button type="button" class="btn btn-default btn-sm ba-amount-minus"><i class="fa fa-arrow-left"></i></button>\
                        <button type="button" class="btn btn-default btn-sm disabled ba-amount-value" disabled>0</button>\
                        <button type="button" class="btn btn-default btn-sm ba-amount-plus"><i class="fa fa-arrow-right"></i></button>';
                    jItem.find('.ba-amount').append(withAmountTemplate);

                    jItem.find('.ba-amount-value').text(dataItem.amount);
                }

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
                            itemSelected.push(jQuery.parseJSON($(this).attr('data-ba-value')));
                            // We put it in the val for the last item
                            if (items.length == (index + 1))
                            {
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
            searchFilterBy: function(itemsContainer, filter, category){

                var baItem;
                if (itemsContainer !== undefined)
                {
                    itemsContainer.find('.list-group-item').each(function(){
                        baItem = jQuery.parseJSON($(this).attr('data-ba-value'));

                        if(
                            (baItem.name.toLowerCase().indexOf(filter.toLowerCase()) != -1) &&
                            (category === undefined || category === "all" || baItem.category === undefined || (category !== undefined && baItem.category !== undefined && category === baItem.category))
                        )
                        {
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

            var max = 1;
            var l;
            var cContainer;
            if (iContainer === undefined)
            {
                max = ba.length;
            }
            var items = [];
            // Si on n'accepte que des valeurs uniques
            if (settings.uniqueValue === true)
            {
                if (iData === undefined || iData.value === undefined || ba.isValueInData(iData.value))
                {
                    return items;
                }
            }
            if (settings.withAmount === true && iData.amount === undefined)
            {
                iData.amount = settings.amountInit;
            }

            for (l = 0; l < max; l++)
            {
                if (iContainer === undefined)
                {
                    cContainer = ba.eq(l).parent().find('.ba-available-items');
                }
                else
                {
                    cContainer = iContainer;
                }
                var item = settings.getItem(iData, settings.valueFormat, settings.withAmount);
                // Attaching click event
                $(document).on('click', '.ba-add', {
                    'currentAddButton': item.find('.ba-add').eq(0),
                    'cContainer': cContainer,
                    settings: settings
                }, function(e){
                    e.preventDefault();
                    if ($(this).closest('.ba-box-autocomplete').attr('data-ba-uid') !== e.data.currentAddButton.closest('.ba-box-autocomplete').attr('data-ba-uid'))
                    {
                        return false;
                    }
                    if ($(this).hasClass('hide'))
                        return false;
                    e.stopImmediatePropagation();
                    $(this).toggleClass('hide');
                    var k = $(this).closest('.list-group-item');
                    k.find('.ba-remove').toggleClass('hide');
                    k.find('.ba-amount').toggleClass('hide');
                    var selected = $(this).closest('.ba-box-autocomplete').find('.ba-selected-items');
                    selected.scrollTop(selected[0].scrollHeight + 50);
                    k.appendTo(selected);
                    e.data.settings.updateInput($(this).closest('.ba-box-autocomplete').find('input:not(.ba-search)'), e.data.settings.valueFormat);
                });

                $(document).on('click', '.ba-remove', {
                    'currentRemoveButton': item.find('.ba-remove').eq(0),
                    'cContainer': cContainer,
                    settings: settings
                },  function(e){
                    e.preventDefault();
                    if ($(this).closest('.ba-box-autocomplete').attr('data-ba-uid') !== e.data.currentRemoveButton.closest('.ba-box-autocomplete').attr('data-ba-uid'))
                    {
                        return false;
                    }
                    e.stopImmediatePropagation();
                    if ($(this).hasClass('hide'))
                        return false;
                    $(this).toggleClass('hide');
                    var k = $(this).closest('.list-group-item');
                    k.find('.ba-add').toggleClass('hide');
                    k.find('.ba-amount').toggleClass('hide');
                    k.appendTo($(this).closest('.ba-box-autocomplete').find('.ba-available-items'));
                    e.data.settings.updateInput($(this).closest('.ba-box-autocomplete').find('input:not(.ba-search)'), e.data.settings.valueFormat);
                });



                $(document).on('click', '.ba-amount-minus', {
                    'currentButton': item.find('.ba-amount-minus').eq(0),
                    'cContainer': cContainer,
                    settings: settings
                }, function(e){
                    e.preventDefault();
                    if ($(this).closest('.ba-box-autocomplete').attr('data-ba-uid') !== e.data.currentButton.closest('.ba-box-autocomplete').attr('data-ba-uid'))
                    {
                        return false;
                    }
                    e.stopImmediatePropagation();

                    var itemData = $.parseJSON($(this).closest('.list-group-item').attr('data-ba-value'));
                    itemData.amount = parseInt(itemData.amount) - parseInt(e.data.settings.amountStep);
                    if (e.data.settings.amountPositive === true && itemData.amount <= 0)
                    {
                        itemData.amount = 1;
                        $(this).closest('.list-group-item').find('.ba-remove').click();
                        return true;
                    }
                
                    
                    // Saving the new data of the item
                    $(this).closest('.list-group-item').attr('data-ba-value', JSON.stringify(itemData));
                    $(this).closest('.ba-amount').find('.ba-amount-value').text(itemData.amount);
                    e.data.settings.updateInput($(this).closest('.ba-box-autocomplete').find('input:not(.ba-search)'), e.data.settings.valueFormat);
                });


                $(document).on('click', '.ba-amount-plus', {
                    'currentButton': item.find('.ba-amount-plus').eq(0),
                    'cContainer': cContainer,
                    settings: settings
                }, function(e){
                    e.preventDefault();
                    if ($(this).closest('.ba-box-autocomplete').attr('data-ba-uid') !== e.data.currentButton.closest('.ba-box-autocomplete').attr('data-ba-uid'))
                    {
                        return false;
                    }
                    e.stopImmediatePropagation();

                    var itemData = $.parseJSON($(this).closest('.list-group-item').attr('data-ba-value'));
                    itemData.amount = parseInt(itemData.amount) + parseInt(e.data.settings.amountStep);
                    
                    // Saving the new data of the item
                    $(this).closest('.list-group-item').attr('data-ba-value', JSON.stringify(itemData));
                    $(this).closest('.ba-amount').find('.ba-amount-value').text(itemData.amount);
                    e.data.settings.updateInput($(this).closest('.ba-box-autocomplete').find('input:not(.ba-search)'), e.data.settings.valueFormat);
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
            var i, j;
            var inputValue;
            var baCategories = [];

            var getCategorySelectValue = function(container)
            {
                var selectCategoryEl = container.find('.ba-select-category');
                if (selectCategoryEl !== undefined && selectCategoryEl.length > 0)
                {
                    return selectCategoryEl.val();
                }
                return "";
            };

            el.each(function(){

                // Avoid to be initialised many times
                if ($(this).attr('data-ba') === "1")
                    return true;
                else
                    $(this).attr('data-ba', "1");

                // Begin
                if (settings.hideInput === true)
                    $(this).hide();
                $(this).wrap('<div class="row ba-box-autocomplete"></div>');
                $(this).before('<div class="col-md-6"><ul class="list-group ba-available-items"></ul></div>');
                $(this).before('<div class="col-md-6"><ul class="list-group ba-selected-items"></ul></div>');
                $(this).closest('.ba-box-autocomplete').attr('data-ba-uid', Math.random());
                availableContainer = $(this).parent().find('.ba-available-items');

                // Append the items that can appear in the input value by default
                inputValue = $(this).attr('value');
                if (inputValue !== undefined && settings.valueFormat == "json" && inputValue.length > 0)
                {
                    inputValue = $.parseJSON(inputValue);
                    for (i in inputValue)
                    {
                        var found = false;
                        for (j in settings.data)
                        {
                            if (settings.data[j].value == inputValue[i].value)
                            {
                                settings.data[j].baSelected = true;
                                found = true;
                                break;
                            }
                        }
                        if (found === false)
                        {
                            inputValue[i].baSelected = true;
                            settings.data.push(inputValue[i]);
                        }
                    }
                }



                // Search functionnality
                if (settings.search === true)
                {
                    availableContainer.prepend($('<div class="input-group"><input type="text" class="form-control ba-search" placeholder="'+ settings.searchPlaceholder +'"><span class="input-group-btn"><button class="btn btn-default ba-search-clear" type="button">' + settings.searchButtonText + '</button></span></div>'));
                    var searchInput = availableContainer.find('input.ba-search');

                    $(document).on('click', '.ba-search-clear', {
                        'currentClearButton': searchInput,
                        'settings': settings
                    }, function(e){
                        e.preventDefault();
                        if ($(this).closest('.ba-box-autocomplete').attr('data-ba-uid') !== e.data.currentClearButton.closest('.ba-box-autocomplete').attr('data-ba-uid'))
                        {
                            return false;
                        }
                        e.stopImmediatePropagation();
                        $(this).closest('.ba-box-autocomplete').find('input.ba-search').val("");
                        //$(this).attr("value", "")
                        e.data.settings.searchFilterBy($(this).closest(".ba-available-items"), "", getCategorySelectValue($(this).closest(".ba-available-items")));
                    });

                    $(document).on('keyup', 'input.ba-search', {
                        'currentInput': searchInput,
                        'settings': settings
                    }, function(e){
                        if ($(this).closest('.ba-box-autocomplete').attr('data-ba-uid') !== e.data.currentInput.closest('.ba-box-autocomplete').attr('data-ba-uid'))
                        {
                            return false;
                        }
                        e.stopImmediatePropagation();
                        if ($(this).val().length >= e.data.settings.searchMin)
                        {
                            e.data.settings.searchFilterBy($(this).closest('.ba-available-items'), $(this).val(), getCategorySelectValue($(this).closest(".ba-available-items")));
                        }
                        else
                        {
                            // Reset data list
                            e.data.settings.searchFilterBy($(this).closest(".ba-available-items"), "", getCategorySelectValue($(this).closest(".ba-available-items")));
                        }
                    });
                }
                var items;
                for (i in settings.data)
                {
                    if (settings.withCategory === true)
                    {
                        if (settings.data[i].category !== undefined)
                        {
                            if (baCategories.indexOf(settings.data[i].category) == -1)
                            {
                                baCategories.push(settings.data[i].category);
                            }
                        }
                    }

                    items = ba.addDataItem(settings.data[i], availableContainer);
                    if (settings.data[i].baSelected === true)
                    {
                        var j;
                        for (j in items)
                        {
                            items[j].find('.ba-add').click();
                        }
                    }
                }

                // If category handling is requested
                if (settings.withCategory === true && baCategories.length > 0)
                {
                    var baCategoryContainer = $("<select class='ba-select-category form-control'></select>");
                    for (i in baCategories)
                    {
                        baCategoryContainer.append('<option value="' + baCategories[i] + '">' + baCategories[i].charAt(0).toUpperCase() + baCategories[i].slice(1) + '</option>');
                    }
                    if (settings.allCategories === true)
                    {
                        baCategoryContainer.prepend('<option value="all" selected=selected>' + settings.allCategoriesText + '</option>');
                    }
                    availableContainer.prepend(baCategoryContainer);



                    $(document).on('change', '.ba-select-category', {
                        currentSelectCategory: baCategoryContainer,
                        settings: settings
                    }, function(e){
                        var baCBox = $(this).closest('.ba-box-autocomplete');
                        var inputToSearch = "";
                        var categoryToSearch = "all";
                        if (baCBox.attr('data-ba-uid') !== e.data.currentSelectCategory.closest('.ba-box-autocomplete').attr('data-ba-uid'))
                        {
                            return false;
                        }
                        e.stopImmediatePropagation();

                        
                        if (settings.search === true)
                        {
                            inputToSearch = baCBox.find('input.ba-search').val();
                            if (inputToSearch.length < e.data.settings.searchMin)
                            {
                                inputToSearch = "";
                            }
                        }
                        categoryToSearch = $(this).val();
                        e.data.settings.searchFilterBy($(this).closest(".ba-available-items"), inputToSearch, categoryToSearch);
                    });
                    
                    // To sort by categories
                    baCategoryContainer.change();
                }
            });

            //Clear the data var
            settings.data = [];
        };

        // Getting the DATA if the dataUrl is set
        if (settings.dataUrl !== false)
        {
            var that = this;
            settings.data = [];
            $.get(settings.dataUrl).then(function(data){
                settings.data = $.parseJSON(data);
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
