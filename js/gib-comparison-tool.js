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
   * More Information About School Link
   */
  document.getElementById("navigatorlink").innerHTML = "<p><a href=\"http://nces.ed.gov/collegenavigator/?id=" + institution.cross + "\" target=\"newtab\" >More information about your school</a></p>";  

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
  
  
  // Reveal public methods
  return {
    update: update
  };
  
}();
