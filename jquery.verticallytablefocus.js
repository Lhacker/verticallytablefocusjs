/**
 * apply enable table to vertical focus move on Enter(Shift + Enter).
 */
; (function($, undefined) {

  $.fn.applyVerticalTableFocus = function() {

    var $self = $(this);

    if ($self.length <= 0 || !$self.is("table"))
      throw new Error("applyVerticalTableFocus: Invalid selector. please select table element.");

    // define vertical focus movement function
    var eventHandler = function(e) {
      
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
            var $focusableItem = $rows.eq(rIdx).find("td,th").eq(cIdx).find(":focusable").first(); 
            if ($focusableItem.length > 0) {
              $focusableItem.focus();
              e.preventDefault();
              return false;
            }
          
          }

        }

      }

    };

    // add event
    $self.on("keydown", "input:visible,select,textarea", eventHandler);  

  };

})(jQuery);
