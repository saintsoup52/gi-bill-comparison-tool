// Adapted from: www.lessanvaezi.com/filter-select-list-options

jQuery.fn.filterByText = function(textbox, button, selectSingleMatch) {
  return this.each(function() {
    
    var select = this;
    var html = $(select).html();
    var options = [];
    
    $(select).find('option').each(function () {
      options.push({value: $(this).val(), text: $(this).text()});
    });
    $(select).data('options', options);
    
    $(button).click(function () {
      // If input is empty, restore original HTML
      if (textbox.val() == "") {
        select.innerHTML = html;
        return;
      }
      
      var options = $(select).empty().scrollTop(0).data('options');
      var search = $.trim($(textbox).val());
      var regex = new RegExp(search,'gi');
      var resultHTML = "";
      
      $.each(options, function (i) {
        var option = options[i];
        if (option.text.match(regex) !== null) {
          resultHTML += "<option value='"+ option.value +
                        "'>"+ option.text +"</option>";
        }
      });
      
      select.innerHTML = resultHTML;
      
      if (selectSingleMatch === true && 
          $(select).children().length === 1) {
        $(select).children().get(0).selected = true;
      }
      
      // if ($('#' + $(select).attr('id') + ' option').size() == 0) {
      if ($(select).html() == "") {
        select.innerHTML = "<option value=''>No Results</option>";
      }
    });
    
  });
};
