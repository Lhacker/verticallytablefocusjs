/**
 * apply enable table to vertical focus move on Enter(Shift + Enter).
 */
; (function($, undefined) {

  $.fn.applyVerticalTableFocus = function() {

    var $self = $(this);

    // error check
    if ($self.length <= 0 || !$self.is("table"))
      throw new Error("applyVerticalTableFocus: Invalid selector. please select table element.");

    // add event
    if (canUseOnMethod()) {
      $self.on("keydown", "input:visible,select,textarea", verticalMovementEventHandler);  
    } else {
      $(document).delegate($self.selector + " input:visible,select,textarea", "keydown", verticalMovementEventHandler);  
    }

  };

  // define vertical focus movement function
  var verticalMovementEventHandler = function(e) {
    
    if (e.keyCode !== 13)
      return true;
    
    var $target = $(e.target);
    var $targetCol = $target.closest("td,th");
    var $targetRow = $target.closest("tr");
    var $table = $target.closest("table");
    var $rows = $table.find("tr");
    var $cols = $targetRow.find("td,th");
    //
    var rowLength = $rows.length; 
    var colLength = $cols.length;
    var targetRowIdx = $rows.index($targetRow);
    var targetColIdx = $cols.index($targetCol);
    
    if (e.shiftKey) { // press shift + enter, focus up
       
      // col
      for (var cIdx = targetColIdx; cIdx !== targetColIdx + 1;) {
        
        // row
        for (var rIdx = targetRowIdx; rIdx !== targetRowIdx + 1;) {
          
          // break condition
          if (--rIdx < 0) {
            rIdx = rowLength - 1;
            if (--cIdx < 0)
              cIdx = colLength - 1;
          }
          var $focusableItem = $rows.eq(rIdx).find("td,th").eq(cIdx).find(":focusable").first(); 
          if ($focusableItem.length > 0) {
            $focusableItem.focus();
            e.preventDefault();
            return false;
          }
        
        }

      }

    } else {  // press enter, focus down

      // col
      for (var cIdx = targetColIdx; cIdx !== targetColIdx - 1;) {
        
        // row
        for (var rIdx = targetRowIdx; rIdx !== targetRowIdx - 1;) {
          
          // break condition
          if (++rIdx >= rowLength) {
            rIdx = 0;
            if (++cIdx >= colLength)
              cIdx = 0;
          }
          var $focusableItem = findFocusable($rows.eq(rIdx).find("td,th").eq(cIdx)).first(); 
          if ($focusableItem.length > 0) {
            $focusableItem.focus();
            e.preventDefault();
            return false;
          }
        
        }

      }

    }

  };


  var findFocusable = function($target) {
    return $target
      .find("input,textarea,select,a,button")
      .filter(function() {
        var $self = $(this);
        if ($self.is("a") && $self.attr("href").length <= 0) return false;
        return $self.is(":visible") || $self.attr("tabIndex") >= 0;
      });
  };

  var isjQueryVersionGreaterThanEqual = function(strVersion) {
    var versionArray = $().jquery.split(".");
    var paramVersionArray = strVersion.split(".");
    return parseInt(versionArray[0]) >= parseInt(paramVersionArray[0]) &&
      parseInt(versionArray[1]) >= parseInt(paramVersionArray[1]) &&
      parseInt(versionArray[2]) >= parseInt(paramVersionArray[2]);
  }

  var canUseOnMethod = function() {
    return isjQueryVersionGreaterThanEqual("1.7.0");
  }

})(jQuery);
