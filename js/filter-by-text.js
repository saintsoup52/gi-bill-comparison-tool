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
    
    $(textbox).bind('change keyup', function() {
      // If search field is < 3 chars, show nothing
      if (textbox.val().length < 3) {
        $(select).empty();
        return;
      }
      
      var options = $(select).empty().scrollTop(0).data('options');
      var search = $.trim($(textbox).val());
      var regex = new RegExp(search,'gi');
      var resultHTML = "";
      var results = 0;  // Count the number of results
      
      $.each(options, function (i) {
        var option = options[i];
        if (option.text.match(regex) !== null) {
          if (results < 5) {
            resultHTML += "<option value='"+ option.value +
                        "'>"+ option.text +"</option>";
          }
          results++;
        }
      });
      
      select.innerHTML = resultHTML;
      
      if (selectSingleMatch === true && 
          $(select).children().length === 1) {
        $(select).children().get(0).selected = true;
      }
      
      if ($(select).html() == "") {
        select.innerHTML = "<option value=''>No Results</option>";
      }
    });
    
  });
};
