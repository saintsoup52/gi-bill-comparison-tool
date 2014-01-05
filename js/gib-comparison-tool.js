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
    military_status: "",
    spouse_active_duty: false,
    facility_code: "",
    online: false
  };
  
  // The current institution
  var institution = {};
  
  // Calculated values
  var calculated = {
    tier: 0.0,
    service_discharge: false,
    institution_type: "",
    location: "",
    tuition_fees: "",
    housing_allowance: "",
    book_stipend: ""
  };
  
  // Constants
  var TFCAP = 19198,
      AVGBAH = 1429,
      BSCAP = 1000,
      TUITIONASSISTCAP = 4500,
      GROUP1GRADMED = 34.4,
      GROUP1GRADHIGH = 56,
      GROUP2GRADMED = 12.3,
      GROUP2GRADHIGH = 31,
      GROUP3GRADMED = 30.7,
      GROUP3GRADHIGH = 62.1,
      GROUP4GRADMED = 0,
      GROUP4GRADHIGH = 0 ,
      GROUP5GRADMED = 62.4,
      GROUP5GRADHIGH = 77,
      GROUP1GRADRANKHIGH = 620,
      GROUP1GRADRANKMED = 1247,
      GROUP1GRADRANKMAX = 1873,
      GROUP2GRADRANKHIGH = 304,
      GROUP2GRADRANKMED = 881,
      GROUP2GRADRANKMAX = 1318,
      GROUP3GRADRANKHIGH = 247,
      GROUP3GRADRANKMED = 420,
      GROUP3GRADRANKMAX = 539,
      GROUP4GRADRANKHIGH = 0,
      GROUP4GRADRANKMED = 0,
      GROUP4GRADRANKMAX = 0,
      GROUP5GRADRANKHIGH = 0,
      GROUP5GRADRANKMED = 0,
      GROUP5GRADRANKMAX = 0,
      CDRHIGH = 100,
      CDRAVG = 13.6,
      CDRLOW = 0.0 ,
      GROUP1LOANMED = 16081,
      GROUP1LOANHIGH = 21216,
      GROUP2LOANMED = 7184,
      GROUP2LOANHIGH = 13834,
      GROUP3LOANMED = 8034,
      GROUP3LOANHIGH = 9500,
      GROUP4LOANMED = 5000,
      GROUP4LOANHIGH = 12167,
      GROUP5LOANMED = 7321,
      GROUP5LOANHIGH = 9500,
      GROUP1LOANRANKMED = 724,
      GROUP1LOANRANKHIGH = 1394,
      GROUP1LOANRANKMAX = 2067,
      GROUP2LOANRANKMED = 541,
      GROUP2LOANRANKHIGH = 1009,
      GROUP2LOANRANKMAX = 1464,
      GROUP3LOANRANKMED = 277,
      GROUP3LOANRANKHIGH = 459,
      GROUP3LOANRANKMAX = 836,
      GROUP4LOANRANKMED = 0,
      GROUP4LOANRANKHIGH = 0,
      GROUP4LOANRANKMAX = 0,
      GROUP5LOANRANKMED = 0,
      GROUP5LOANRANKHIGH = 0,
      GROUP5LOANRANKMAX = 0;
  
  // Colors
  var lightBlue  = '#94bac9',
      mediumBlue = '#1d7893',
      darkBlue   = '#004974',
      darkGray   = '#494949';
  
  
  // Private Methods
  ///////////////////////////
  
  /*
   * Get user data from the form
   */
  var getFormData = function () {
    formData.cumulative_service = $('#cumulative-service').val();
    formData.military_status = $('#military-status').val();
    formData.spouse_active_duty = $('#spouse-active-duty-yes').prop('checked');
    formData.facility_code = $('#institution-select').val();
    formData.online = $('#online-yes').prop('checked');
  };
  
  
  /*
   * Find the selected institution
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
      calculated.tuition_fees = "" + Math.round((calculated.tier * 100)) +
                                "% of instate tuition";
    } else {
      calculated.tuition_fees = "$" + Math.round((TFCAP * calculated.tier)) +
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
      calculated.housing_allowance = "$" + Math.round(calculated.tier * institution.bah)
    } else if (formData.online) {
      calculated.housing_allowance = "$" + Math.round((calculated.tier * AVGBAH) / 2) +
                                     " / month (full time)";
    } else if (institution.country != "USA") {
      calculated.housing_allowance = "$" + Math.round(calculated.tier * AVGBAH) +
                                     " / month (full time)";
    } else {
      calculated.housing_allowance = "$" + Math.round(calculated.tier * institution.bah) +
                                     " / month (full time)";
    }
  };
  
  
  /*
   * Calculate the book stipend
   */
  var getBookStipend = function () {
    calculated.book_stipend = "$" + Math.round(calculated.tier * BSCAP) + " / year";
  };
  
  
  /*
   * Draw the graduation rate
   */
  var drawGraduationRate = function () {
    var canvas = Raphael('graduation-rates-chart', 300, 100);
    
    var indent = 30;
    var w = 80;
    var h = 30;
    var y = 69;
    
    var font = 'Arial, Helvetica, sans-serif';
    var xText = indent + 40;
    var yText = y + 15;
    
    canvas.add([
      // Temp outline
      {
        stroke: 'none',
        fill: '#e6e6e6',
        type: 'rect',
        x: 0,
        y: 0,
        width: 300,
        height: 100
      },
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
      // Low text
      {
        type: 'text',
        text: 'LOW',
        x: xText,
        y: yText,
        'font-family': font,
        'font-size': 12,
        fill: '#fff'
      },
      // Medium text
      {
        type: 'text',
        text: 'MEDIUM',
        x: xText + w,
        y: yText,
        'font-family': font,
        'font-size': 12,
        fill: '#fff'
      },
      // High text
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

    // Arrow
    var arrow = canvas.path('M0,0 L16,0 L8,10 L0,0');
    arrow.attr({
      fill: darkGray,
      stroke: 'none'
    });
    var range = {
      start: indent - 8,
      end: indent - 8 + (w * 3)
    }
    arrow.translate(range.start, y - 13);

    // Label
    var percent = '98.7%';
    // var xLabel = 35;
    var xLabel = range.start + 8;
    var label = canvas.text(xLabel, 46, percent);
    label.attr({
      'font-family': font,
      'font-size': 16,
      fill: darkGray
    });
  };
  
  
  /*
   * Draw the loan default rates chart
   */
  var drawLoanDefaultRates = function () {
    var canvas = Raphael('loan-default-rates-chart', 300, 200);
    var font = 'Arial, Helvetica, sans-serif';
    var y = 75;
    
    canvas.add([
      // Temp outline
      {
        stroke: 'none',
        fill: '#e6e6e6',
        type: 'rect',
        x: 0,
        y: 0,
        width: 300,
        height: 200
      },
      // Bottom bar
      {
        type: 'rect',
        x: 25,
        y: y + 70,
        width: 250,
        height: 4,
        fill: darkGray,
        stroke: 'none'
      },
      // This school bar
      {
        type: 'rect',
        x: 50,
        y: y + 60,   // 70 - val
        width: 50,
        height: 10,  // val
        fill: mediumBlue,
        stroke: 'none'
      },
      // National average bar
      {
        type: 'rect',
        x: 200,
        y: y - 5,
        width: 50,
        height: 75,
        fill: darkGray,
        stroke: 'none'
      },
      // This school text
      {
        type: 'text',
        text: 'THIS SCHOOL',
        x: 100 - 20,
        y: y + 85,
        'font-family': font,
        'font-size': 12,
        fill: darkGray
      },
      // National average text
      {
        type: 'text',
        text: 'NATIONAL AVERAGE',
        x: 200 + 20,
        y: y + 85,
        'font-family': font,
        'font-size': 12,
        fill: darkGray
      },
      // This school percentage
      {
        type: 'text',
        text: '13.4%',
        x: 100 - 20,
        y: y + 102,
        'font-family': font,
        'font-size': 16,
        fill: darkGray
      },
      // National average percentage
      {
        type: 'text',
        text: '13.4%',
        x: 200 + 20,
        y: y + 102,
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
    var canvas = Raphael('median-borrowing-chart', 300, 150);
    var font = 'Arial, Helvetica, sans-serif';
    
    canvas.add([
      // Temp outline
      {
        stroke: 'none',
        fill: '#e6e6e6',
        type: 'rect',
        x: 0,
        y: 0,
        width: 300,
        height: 150
      },
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
      // Small gray circle
      {
        type: 'path',
        path: wedgePath(150, 120, 180, 360, 15),
        fill: darkGray,
        stroke: 'none'
      },
      // Amount text
      {
        type: 'text',
        text: '$7,700',
        x: 150,
        y: 135,
        'font-family': font,
        'font-weight': 'bold',
        'font-size': 18,
        fill: darkGray
      }
    ]);
    
    // TODO: Draw the arrow thingy
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
    
    return 'M'+x+' '+y+' L'+x1+' '+y1+' A'+r+' '+r+' 0 0 1 '+x2+' '+y2 +' z';
  }
  
  
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
      $('#institution').html(institution.institution);
      $('#location').html(calculated.location);
      $('#type').html(calculated.institution_type);
      $('#tuition-fees').html(calculated.tuition_fees);
      $('#housing-allowance').html(calculated.housing_allowance);
      $('#book-stipend').html(calculated.book_stipend);
      
      $('#poe').html(institution.poe ? "Yes" : "No");
      $('#yr').html(institution.yr ? "Yes" : "No");
      $('#gibill').html(institution.gibill ? institution.gibill : 0);
      $('#grad_rate').html(institution.grad_rate ? institution.grad_rate : "NR");
      $('#default_rate').html(institution.default_rate ? institution.default_rate : "NR");
      $('#avg_stu_loan_debt').html(institution.avg_stu_loan_debt ? institution.avg_stu_loan_debt : "NR");
      
      // More information about school link
      $('navigatorlink').html(
        "<p><a href='http://nces.ed.gov/collegenavigator/?id=" +
        institution.cross +
        "' target='newtab'>More information about your school</a></p>");
    });
  };
  
  
  // Init
  ///////////////////////////
  
  $(document).ready(function () {
    $('#institution-select').hide();
    
    // Bind event handlers to form elements
    $('#cumulative-service, #military-status, #institution-select, ' +
      '#spouse-active-duty-yes, #spouse-active-duty-no, ' +
      '#online-yes, #online-no').on('change', function () {
      GIBComparisonTool.update();
    });
    
    // Load institution data
    $.getJSON("api/institutions.json", function(data) {
      institutions = data;
      var html = "";
      
      for (var i = 0; i < institutions.length; i++) {
        html += "<option value='"+ institutions[i][0] +"'>"+ institutions[i][1] +"</option>";
      }
      
      // Use native DOM API for speed, instead of jQuery's .append()
      document.getElementById('institution-select').innerHTML = html;
      
      $('#institution-select').filterByText($('#institution-search'), $('#button-search'));
      $('#institution-select').empty();
      $('#institution-select').show();
    });
  });
  
  // Testing drawing functions
  drawGraduationRate();
  drawLoanDefaultRates();
  drawMedianBorrowingChart();
  
  
  // Reveal public methods
  return {
    update: update
  };
  
}();
