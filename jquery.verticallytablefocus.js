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
    if ($.isFunction($.fn.on)) {
      $self.on("keydown", "input:visible,select", verticalMovementEventHandler);  
    } else {
      var selector = $self.selector + " input:visible, " + $self.selector + " select";
      $(document).delegate(selector, "keydown", verticalMovementEventHandler);  
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
       
      for (var cIdx = targetColIdx, rIdx = targetRowIdx;;) {
          
        // break condition
        if (--rIdx < 0) {
          rIdx = rowLength - 1;
          if (--cIdx < 0)
            cIdx = colLength - 1;
        }

        // end condition
        if (rIdx === targetRowIdx && cIdx === targetColIdx)
          return true;

        var $focusableItem = findFocusable($rows.eq(rIdx).find("td,th").eq(cIdx)).first(); 
        if ($focusableItem.length > 0) {
          $focusableItem.focus();
          e.preventDefault();
          return true;
        }
        
      }

    } else {  // press enter, focus down
       
      for (var cIdx = targetColIdx, rIdx = targetRowIdx;;) {
          
        // break condition
        if (++rIdx >= rowLength) {
          rIdx = 0;
          if (++cIdx >= colLength)
            cIdx = 0;
        }

        // end condition
        if (rIdx === targetRowIdx && cIdx === targetColIdx)
          return true;

        var $focusableItem = findFocusable($rows.eq(rIdx).find("td,th").eq(cIdx)).first(); 
        if ($focusableItem.length > 0) {
          $focusableItem.focus();
          e.preventDefault();
          return true;
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

})(jQuery);
