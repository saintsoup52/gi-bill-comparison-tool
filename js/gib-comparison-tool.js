/*
 * gib-comparison-tool.js - The GI Bill Comparison Tool Module
 */

var GIBComparisonTool = function () {
  
  // Properties
  ///////////////////////////
  
  // All institutions (names and facility codes)
  var institutions = [];
  
  // User form data
  var formData = {
    cumulative_service: "",
    military_status:    "",
    spouse_active_duty: false,
    facility_code:      "",
    online:             false
  };
  
  // The current institution
  var institution = {};
  
  // Calculated values
  var calculated = {
    tier:              0.0,
    service_discharge: false,
    institution_type:  "",
    location:          "",
    tuition_fees:      "",
    housing_allowance: "",
    book_stipend:      ""
  };
  
  // Constants
  var TFCAP  = 19198,
      AVGBAH = 1429,
      BSCAP  = 1000,
      TUITIONASSISTCAP = 4500,
      GROUP1GRADMED  = 34.4,
      GROUP1GRADHIGH = 56,
      GROUP2GRADMED  = 12.3,
      GROUP2GRADHIGH = 31,
      GROUP3GRADMED  = 30.7,
      GROUP3GRADHIGH = 62.1,
      GROUP4GRADMED  = 0,
      GROUP4GRADHIGH = 0,
      GROUP5GRADMED  = 62.4,
      GROUP5GRADHIGH = 77,
      GROUP1GRADRANKHIGH = 620,
      GROUP1GRADRANKMED  = 1247,
      GROUP1GRADRANKMAX  = 1873,
      GROUP2GRADRANKHIGH = 304,
      GROUP2GRADRANKMED  = 881,
      GROUP2GRADRANKMAX  = 1318,
      GROUP3GRADRANKHIGH = 247,
      GROUP3GRADRANKMED  = 420,
      GROUP3GRADRANKMAX  = 539,
      GROUP4GRADRANKHIGH = 0,
      GROUP4GRADRANKMED  = 0,
      GROUP4GRADRANKMAX  = 0,
      GROUP5GRADRANKHIGH = 0,
      GROUP5GRADRANKMED  = 0,
      GROUP5GRADRANKMAX  = 0,
      CDRHIGH = 100,
      CDRAVG  = 13.6,
      CDRLOW  = 0,
      GROUP1LOANMED  = 16081,
      GROUP1LOANHIGH = 21216,
      GROUP2LOANMED  = 7184,
      GROUP2LOANHIGH = 13834,
      GROUP3LOANMED  = 8034,
      GROUP3LOANHIGH = 9500,
      GROUP4LOANMED  = 5000,
      GROUP4LOANHIGH = 12167,
      GROUP5LOANMED  = 7321,
      GROUP5LOANHIGH = 9500,
      GROUP1LOANRANKMED  = 724,
      GROUP1LOANRANKHIGH = 1394,
      GROUP1LOANRANKMAX  = 2067,
      GROUP2LOANRANKMED  = 541,
      GROUP2LOANRANKHIGH = 1009,
      GROUP2LOANRANKMAX  = 1464,
      GROUP3LOANRANKMED  = 277,
      GROUP3LOANRANKHIGH = 459,
      GROUP3LOANRANKMAX  = 836,
      GROUP4LOANRANKMED  = 0,
      GROUP4LOANRANKHIGH = 0,
      GROUP4LOANRANKMAX  = 0,
      GROUP5LOANRANKMED  = 0,
      GROUP5LOANRANKHIGH = 0,
      GROUP5LOANRANKMAX  = 0;
  
  // Colors and styles
  var lightBlue  = '#94bac9',
      mediumBlue = '#1d7893',
      darkBlue   = '#004974',
      darkGray   = '#494949',
      font       = 'Arial, Helvetica, sans-serif';
  
  
  // Private Methods
  ///////////////////////////
  
  /*
   * Get user data from the form
   */
  var getFormData = function () {
    formData.cumulative_service = $('#cumulative-service').val();
    formData.military_status    = $('#military-status').val();
    formData.spouse_active_duty = $('#spouse-active-duty-yes').prop('checked');
    formData.online             = $('#online-yes').prop('checked');
    
    if (formData.military_status == "spouse") {
      $('#spouse-active-duty-form').show();
    } else {
      $('#spouse-active-duty-form').hide();
    }
  };
  
  
  /*
   * TODO: Remove this function – no longer used by tool
   *   Searches all institution names for matching text
   */
  var search = function (text, maxResults) {
    var regex = new RegExp(text,'gi');
    var matches = 0;
    var results = [];
    
    $.each(institutions, function (i) {
      var obj = institutions[i];
      if (obj.name.match(regex) !== null) {
        if (matches < maxResults) {
          results.push(obj);
        }
        matches++;
      }
    });
     
    return results;
  };
  
  
  /*
   * Get data for selected institution
   */
  var getInstitution = function (facility_code, callback) {
    var url = "api/" + facility_code.substr(0, 3) + "/" + facility_code + ".json";
    
    $.getJSON(url, function(data) {
      institution = data;
      callback();
    });
  };
  
  
  /*
   * Format location of the institution
   */
  var formatLocation = function () {
    if (institution.country != "USA") {
      calculated.location = "" + institution.city + ", "
                               + institution.country;
    } else {
      calculated.location = "" + institution.city + ", "
                               + institution.state;
    }
  };
  
  
  /*
   * Formats currency in USD
   */
  var formatCurrency = function (num) {
    var str = num.toString();
    if (str.length > 3) {
       return "$" + str.slice(0, -3) + "," + str.slice(-3);
    } else {
      return "$" + str;
    }
  };
  
  
  /*
   * Determine the type of institution
   */
  var getInstitutionType = function () {
    if (institution.facility_code[1] == "0") {
      calculated.institution_type = "OJT / Apprenticeship";
    } else if (institution.country != "USA") {
      calculated.institution_type = "Foreign";
    } else {
      switch (institution.facility_code[0]) {
        case '1':
          calculated.institution_type = "Public School";
          break;
        case '2':
          calculated.institution_type = "For Profit School";
          break;
        case '3':
          calculated.institution_type = "Private School";
          break;
      }
    }
  };
  
  
  /*
   * Calculate the tier
   */
  var getTier = function () {
    if (formData.cumulative_service == "service discharge") {
      calculated.tier = 1;
      calculated.service_discharge = true;
    } else {
      calculated.tier = parseFloat(formData.cumulative_service);
    }
  };
  
  
  /*
   * Calculates the tuition and fees
   */
  var getTuitionFees = function () {
    if (calculated.institution_type == "OJT / Apprenticeship") {
      calculated.tuition_fees = "";
    } else if ((calculated.institution_type == "Public School") &&
               (institution.country == "USA")) {
      calculated.tuition_fees = formatCurrency(Math.round(calculated.tier * 100)) +
                                "% of instate tuition";
    } else {
      calculated.tuition_fees = formatCurrency(Math.round(TFCAP * calculated.tier)) +
                                " / year (up to)";
    }
  };
  
  
  /*
   * Calculate the housing allowance
   */
  var getHousingAllowance = function () {
    if (formData.military_status == "active duty") {
      calculated.housing_allowance = "$0 / month";
    } else if ((formData.military_status == "spouse") &&
                formData.spouse_active_duty) {
      calculated.housing_allowance = "$0 / month";
    } else if (calculated.institution_type == "OJT / Apprenticeship") {
      calculated.housing_allowance = formatCurrency(Math.round(calculated.tier * institution.bah));
    } else if (formData.online) {
      calculated.housing_allowance = formatCurrency(Math.round((calculated.tier * AVGBAH) / 2)) +
                                     " / month (full time)";
    } else if (institution.country != "USA") {
      calculated.housing_allowance = formatCurrency(Math.round(calculated.tier * AVGBAH)) +
                                     " / month (full time)";
    } else {
      calculated.housing_allowance = formatCurrency(Math.round(calculated.tier * institution.bah)) +
                                     " / month (full time)";
    }
  };
  
  
  /*
   * Calculate the book stipend
   */
  var getBookStipend = function () {
    calculated.book_stipend = formatCurrency(Math.round(calculated.tier * BSCAP)) + " / year";
  };
  
  
  /*
   * Draw the graduation rate chart
   */
  var drawGraduationRate = function () {
    var gradMed, gradHigh, 
        gradRankMax, gradRankMed, gradRankHigh,
        tier;
    
    switch (institution.indicator_group) {
      case 1:
        gradMed  = GROUP1GRADMED;
        gradHigh = GROUP1GRADHIGH;
        gradRankMax  = GROUP1GRADRANKMAX;
        gradRankMed  = GROUP1GRADRANKMED;
        gradRankHigh = GROUP1GRADRANKHIGH;
        break;
      case 2:
        gradMed  = GROUP2GRADMED;
        gradHigh = GROUP2GRADHIGH;
        gradRankMax  = GROUP2GRADRANKMAX;
        gradRankMed  = GROUP2GRADRANKMED;
        gradRankHigh = GROUP2GRADRANKHIGH;
        break;
      case 3:
        gradMed  = GROUP3GRADMED;
        gradHigh = GROUP3GRADHIGH;
        gradRankMax  = GROUP3GRADRANKMAX;
        gradRankMed  = GROUP3GRADRANKMED;
        gradRankHigh = GROUP3GRADRANKHIGH;
        break;
      case 5:
        gradMed  = GROUP5GRADMED;
        gradHigh = GROUP5GRADHIGH;
        gradRankMax  = GROUP5GRADRANKMAX;
        gradRankMed  = GROUP5GRADRANKMED;
        gradRankHigh = GROUP5GRADRANKHIGH;
        break;
    }
    
    if (institution.grad_rate >= gradHigh) {
      tier = 'high';
    } else if (institution.grad_rate >= gradMed) {
      tier = 'medium';
    } else {
      tier = 'low';
    }
    
    var pt = institution.grad_rate_rank,
        el, ui, pos;
    
    var indent = 30,
        w = 80,
        h = 30,
        y = 69;
    
    var xText = indent + 40;
    var yText = y + 15;
    
    switch (tier) {
      case 'high':
        el = { min: gradRankHigh, max: 1 };
        ui = { min: 190, max: 190 + w };
        pos = mapPt(pt, el, ui);
        break;
      case 'medium':
        el = { min: gradRankMed, max: gradRankHigh };
        ui = { min: 110, max: 110 + w };
        pos = mapPt(pt, el, ui);
        break;
      case 'low':
        el = { min: gradRankMax, max: gradRankMed };
        ui = { min: 30, max: 30 + w };
        pos = mapPt(pt, el, ui);
        break;
    }
    
    $('#graduation-rates-chart').empty();
    var canvas = Raphael('graduation-rates-chart', 300, 100);
    
    // Draw static elements
    canvas.add([
      // Low rect
      {
        type: 'rect',
        x: indent,
        y: y,
        width: w,
        height: h,
        fill: lightBlue,
        stroke: '#000'
      },
      // Medium rect
      {
        type: 'rect',
        x: indent + w,
        y: y,
        width: w,
        height: h,
        fill: mediumBlue,
        stroke: '#000'
      },
      // High rect
      {
        type: 'rect',
        x: indent + (w * 2),
        y: y,
        width: w,
        height: h,
        fill: darkBlue,
        stroke: '#000'
      },
      // "LOW" text
      {
        type: 'text',
        text: 'LOW',
        x: xText,
        y: yText,
        'font-family': font,
        'font-size': 12,
        fill: '#fff'
      },
      // "MEDIUM" text
      {
        type: 'text',
        text: 'MEDIUM',
        x: xText + w,
        y: yText,
        'font-family': font,
        'font-size': 12,
        fill: '#fff'
      },
      // "HIGH" text
      {
        type: 'text',
        text: 'HIGH',
        x: xText + (w * 2),
        y: yText,
        'font-family': font,
        'font-size': 12,
        fill: '#fff'
      }
    ]);
    
    // Draw dynamic elements
    
    // Arrow
    var arrow = canvas.path('M0,0 L16,0 L8,10 L0,0');
    arrow.attr({
      fill: darkGray,
      stroke: 'none'
    });
    arrow.translate(pos - 8, y - 13);

    // Percentage
    var percentage = canvas.text(pos, 46, institution.grad_rate + "%");
    percentage.attr({
      'font-family': font,
      'font-size': 16,
      fill: darkGray
    });
  };
  
  
  /*
   * Draw the loan default rates chart
   */
  var drawLoanDefaultRates = function () {
    $('#loan-default-rates-chart').empty();
    
    var canvas = Raphael('loan-default-rates-chart', 300, 200);
    
    var schoolBarHeight = (institution.default_rate / 100) * 145,
        nationalBarHeight = (CDRAVG / 100) * 145;
    
    canvas.add([
      // Bottom horizontal bar
      {
        type: 'rect',
        x: 25,
        y: 145,
        width: 250,
        height: 4,
        fill: darkGray,
        stroke: 'none'
      },
      // "THIS SCHOOL" text
      {
        type: 'text',
        text: 'THIS SCHOOL',
        x: 88,
        y: 160,
        'font-family': font,
        'font-size': 12,
        fill: darkGray
      },
      // "NATIONAL AVERAGE" text
      {
        type: 'text',
        text: 'NATIONAL AVERAGE',
        x: 220,
        y: 160,
        'font-family': font,
        'font-size': 12,
        fill: darkGray
      },
      // This school bar
      {
        type: 'rect',
        x: 50,
        y: 145 - schoolBarHeight,
        width: 75,
        height: schoolBarHeight,
        fill: mediumBlue,
        stroke: 'none'
      },
      // This school percentage
      {
        type: 'text',
        text: institution.default_rate + "%",
        x: 90,
        y: 177,
        'font-family': font,
        'font-size': 16,
        fill: darkGray
      },
      // National average bar
      {
        type: 'rect',
        x: 175,
        y: 145 - nationalBarHeight,
        width: 75,
        height: nationalBarHeight,
        fill: darkGray,
        stroke: 'none'
      },
      // National average percentage
      {
        type: 'text',
        text: CDRAVG + "%",
        x: 215,
        y: 177,
        'font-family': font,
        'font-size': 16,
        fill: darkGray
      }
    ]);
  };
  
  
  /*
   * Draw the median borrowing chart
   */
  var drawMedianBorrowingChart = function () {
    var loanMed, loanHigh, 
        loanRankMax, loanRankMed, loanRankHigh,
        tier;
    
    switch (institution.indicator_group) {
      case 1:
        loanMed  = GROUP1LOANMED;
        loanHigh = GROUP1LOANHIGH;
        loanRankMax  = GROUP1LOANRANKMAX;
        loanRankMed  = GROUP1LOANRANKMED;
        loanRankHigh = GROUP1LOANRANKHIGH;
        break;
      case 2:
        loanMed  = GROUP2LOANMED;
        loanHigh = GROUP2LOANHIGH;
        loanRankMax  = GROUP2LOANRANKMAX;
        loanRankMed  = GROUP2LOANRANKMED;
        loanRankHigh = GROUP2LOANRANKHIGH;
        break;
      case 3:
        loanMed  = GROUP3LOANMED;
        loanHigh = GROUP3LOANHIGH;
        loanRankMax  = GROUP3LOANRANKMAX;
        loanRankMed  = GROUP3LOANRANKMED;
        loanRankHigh = GROUP3LOANRANKHIGH;
        break;
      case 5:
        loanMed  = GROUP5LOANMED;
        loanHigh = GROUP5LOANHIGH;
        loanRankMax  = GROUP5LOANRANKMAX;
        loanRankMed  = GROUP5LOANRANKMED;
        loanRankHigh = GROUP5LOANRANKHIGH;
        break;
    }
    
    if (institution.avg_stu_loan_debt >= loanHigh) {
      tier = 'high';
    } else if (institution.avg_stu_loan_debt >= loanMed) {
      tier = 'medium';
    } else {
      tier = 'low';
    }
    
    var pt = institution.avg_stu_loan_debt_rank,
        el, ui, pos;
    
    switch (tier) {
      case 'high':
        el = { min: loanRankHigh, max: loanRankMax };
        ui = { min: 120, max: 180 };
        pos = mapPt(pt, el, ui);
        break;
      case 'medium':
        el = { min: loanRankMed, max: loanRankHigh };
        ui = { min: 60, max: 120 };
        pos = mapPt(pt, el, ui);
        break;
      case 'low':
        el = { min: 1, max: loanRankMed };
        ui = { min: 0, max: 60 };
        pos = mapPt(pt, el, ui);
        break;
    }
    
    $('#median-borrowing-chart').empty();
    var canvas = Raphael('median-borrowing-chart', 300, 150);
    
    canvas.add([
      // Low wedge
      {
        type: 'path',
        path: wedgePath(150, 120, 180, 240, 100),
        fill: lightBlue,
        stroke: 'none'
      },
      // Medium wedge
      {
        type: 'path',
        path: wedgePath(150, 120, 240, 300, 100),
        fill: mediumBlue,
        stroke: 'none'
      },
      // High wedge
      {
        type: 'path',
        path: wedgePath(150, 120, 300, 360, 100),
        fill: darkBlue,
        stroke: 'none'
      },
      // "LOW" text
      {
        type: 'text',
        text: 'LOW',
        x: 85,
        y: 85,
        'font-family': font,
        'font-size': 12,
        fill: '#fff'
      },
      // "MEDIUM" text
      {
        type: 'text',
        text: 'MEDIUM',
        x: 150,
        y: 50,
        'font-family': font,
        'font-size': 12,
        fill: '#fff'
      },
      // "HIGH" text
      {
        type: 'text',
        text: 'HIGH',
        x: 215,
        y: 85,
        'font-family': font,
        'font-size': 12,
        fill: '#fff'
      },
      // Amount text
      {
        type: 'text',
        text: formatCurrency(institution.avg_stu_loan_debt),
        x: 150,
        y: 135,
        'font-family': font,
        'font-weight': 'bold',
        'font-size': 18,
        fill: darkGray
      }
    ]);
    
    // Arrow
    var arrow = canvas.path('M25,0 L25,10 L-25,5 L25,0');
    arrow.attr({
      fill: '#fff',
      stroke: '#fff',
      'stroke-width': 2
    });
    arrow.transform('t125,110');
    
    // Calculate rotation point
    var arrowBox = arrow.getBBox();
    var xRotatePoint = arrowBox.x + arrowBox.width;
    var yRotatePoint = arrowBox.y + arrowBox.height / 2;
    arrow.transform(arrow.attr('transform')+'t'+(arrowBox.height / 2)+',0'+
                    'R'+pos+','+xRotatePoint+','+yRotatePoint);
    
    // Small gray circle
    canvas.add([{
      type: 'path',
      path: wedgePath(150, 120, 180, 360, 15),
      fill: darkGray,
      stroke: 'none'
    }]);
  };
  
  
  /*
   * Creates an SVG wedge path
   * Adapted from: stackoverflow.com/questions/13092979/svg-javascript-pie-wedge-generator
   */
  var wedgePath = function (x, y, startAngle, endAngle, r) {
    var x1 = x + r * Math.cos(Math.PI * startAngle / 180),
        y1 = y + r * Math.sin(Math.PI * startAngle / 180),
        x2 = x + r * Math.cos(Math.PI * endAngle / 180),
        y2 = y + r * Math.sin(Math.PI * endAngle / 180);
    
    return 'M'+x+' '+y+' L'+x1+' '+y1+' A'+r+' '+r+' 0 0 1 '+x2+' '+y2+' z';
  }
  
  
  /*
   * Maps a point to an underlying pixel grid
   * Parameters:
   *   pt  Number
   *   el  Object  { min: Number, max: Number }
   *   ui  Object  { min: Number, max: Number }
   */
  var mapPt = function(pt, el, ui) {
    return (pt - el.min) * ((ui.max - ui.min) / (el.max - el.min)) + ui.min;
  };
  
  
  // Public Methods
  ///////////////////////////
  
  /*
   * Update benefit information
   */
  var update = function () {
    // Get user data from the form
    getFormData();
    
    // An institution must be selected to proceed
    if (!formData.facility_code) { return; }
    
    if (formData.facility_code == institution.facility_code) {
      // TODO: Just do an update with existing institution, no $.getJSON call
    }
    
    // Lookup the current institution
    getInstitution(formData.facility_code, function () {
      
      // Calculate values
      formatLocation();
      getInstitutionType();
      getTier();
      getTuitionFees();
      getHousingAllowance();
      getBookStipend();
      
      // Write results to the page
      $('#benefit-estimator table').removeClass('inactive');
      $('#institution').html(institution.institution);
      $('#location').html(calculated.location);
      $('#type').html(calculated.institution_type);
      $('#tuition-fees').html(calculated.tuition_fees);
      $('#housing-allowance').html(calculated.housing_allowance);
      $('#book-stipend').html(calculated.book_stipend);
      
      $('#poe').html(institution.poe ? 'Yes' : 'No');
      $('#yr').html(institution.yr ? 'Yes' : 'No');
      $('#gibill').html(institution.gibill ? institution.gibill : 0);
      
      if (calculated.institution_type == "OJT / Apprenticeship") {
        $('#online-classes').hide();
        $('#school-indicators').hide();
      } else if (institution.indicator_group == null ||
                 institution.indicator_group == 4) {
        // Don't display charts only, say "not reported"
        $('#school-indicators').show();
        $('#graduation-rates-chart').html('<p>Not Reported</p>');
        $('#loan-default-rates-chart').html('<p>Not Reported</p>');
        $('#median-borrowing-chart').html('<p>Not Reported</p>');
      } else {
        $('#online-classes').show();
        $('#school-indicators').show();
        // Draw the charts
        if (institution.grad_rate) {
          drawGraduationRate();
        } else {
          $('#graduation-rates-chart').html('<p>Not Reported</p>');
        }
        drawLoanDefaultRates();
        drawMedianBorrowingChart();
      }
      
      // More information about school link
      $('#navigator-link').html(
        "<p><a href='http://nces.ed.gov/collegenavigator/?id=" +
        institution.cross +
        "' target='newtab'>More information about your school &rsaquo;&rsaquo;</a></p>");
    });
  };
  
  
  // Init
  ///////////////////////////
  
  $(document).ready(function () {
    
    // Bind event handlers to form elements
    $('#cumulative-service, #military-status, ' +
      '#spouse-active-duty-yes, #spouse-active-duty-no, ' +
      '#online-yes, #online-no').on('change', function () {
      GIBComparisonTool.update();
    });
    
    // Hide elements on load
    $('#spouse-active-duty-form').hide();
    $('#institution-select').hide();
    $('#veteran-indicators').hide();
    $('#school-indicators').hide();
    $('#employment').hide();
    
    // Load institution data
    $.getJSON("api/institutions.json", function (data) {
      
      for (var i = 0; i < data.length; i++) {
        institutions.push({ value: data[i][0], label: data[i][1] });
      }
      
      $('#institution-search').autocomplete({
        minLength: 3,
        source: function (request, response) {
          var results = $.ui.autocomplete.filter(institutions, request.term);
          response(results.slice(0, 150));
        },
        select: function (event, ui) {
          event.preventDefault();
          $('#institution-search').val(ui.item.label);
          formData.facility_code = ui.item.value;
          GIBComparisonTool.update();
          $('#veteran-indicators').show();
          $('#school-indicators').show();
          $('#employment').show();
        },
        focus: function (event, ui) {
          event.preventDefault();
          $('#institution-search').val(ui.item.label);
        }
      });
      
    });
  });
  
  
  // Reveal public methods
  return {
    update: update
  };
  
}();
