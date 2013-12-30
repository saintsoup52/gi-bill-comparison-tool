/*
 * GIBComparisonTool.js - The GI Bill Comparison Tool Module
 */

var GIBComparisonTool = function () {
  
  // Properties
  ///////////////////////////
  
  // Cumulative post-9/11 active duty service
  var tier,                      // 1..0.4
      serviceDischarge = false;  // Boolean
  // Military service (String)
  var serve;
  // All online classes (Boolean)
  var online;
  
  // Institution data
  var facility_code,
      institution,
      city,
      state,
      country,
      bah,
      poe,
      yr,
      gibill,
      cross,
      grad_rate,
      grad_rate_rank,
      default_rate,
      avg_stu_loan_debt,
      avg_stu_loan_debt_rank,
      indicator_group;
  
  // Constants
  var TFCAP = 19198,
      AVGBAH = 1429,
      BSCAP = 1000,
      TUITIONASSISTCAP = 4500,
      LOWDEFAULTRISK = 0.08,
      MEDDEFAULTRISK = 0.14 ,
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
      GROUP1GRADMED = 39.6,
      GROUP1GRADHIGH = 57.9,
      GROUP2GRADMED = 19.4,
      GROUP2GRADHIGH = 41.9,
      GROUP3GRADMED = 21.4,
      GROUP3GRADHIGH = 41.2,
      GROUP4GRADMED = 0,
      GROUP4GRADHIGH = 0 ,
      GROUP5GRADMED = 0,
      GROUP5GRADHIGH = 0,
      CDRHIGH = 100,
      CDRAVG = 13.4,
      CDRLOW = 0.0 ,
      GROUP1LOANMED = 15006,
      GROUP1LOANHIGH = 20016,
      GROUP2LOANMED = 6891,
      GROUP2LOANHIGH = 12584,
      GROUP3LOANMED = 6836,
      GROUP3LOANHIGH = 9501,
      GROUP4LOANMED = 0,
      GROUP4LOANHIGH = 0 ,
      GROUP5LOANMED = 0,
      GROUP5LOANHIGH = 0,
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
  
  
  // Public Methods
  ///////////////////////////
  
  /*
   * Update benefit information
   */
  var update = function () {
    var val = $('#cumulative-service').val();
    
    if (val == 'service discharge') {
      tier = 1;
      serviceDischarge = true;
    } else {
      tier = parseFloat(val);
    }
    
    online = $('#online').prop('checked');
    
    serve = $('#military-status').val();
    
    var ad = (serve == 'active duty') ? 'yes' : 'no';
  };
  
  
  // Init
  ///////////////////////////
  
  
  // Reveal public methods
  return {
    update: update
  };
  
}();
