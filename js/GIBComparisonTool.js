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
