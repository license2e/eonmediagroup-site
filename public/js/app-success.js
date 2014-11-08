(function($,window,document,undefined){ 
  
  $('.success-nav-control a.current, .success-nav-control a.next').each(function(i){
    var $this = $(this),
      href = $this.attr("href"),
      moveTo = $(href).offset().top;
    
    $this.on({
      "click.success": function(e){
        e.preventDefault();
        EMG.ui.executeScrollTo(moveTo, href);
        return false;
      }
    });
  });
  
  if(window.location.hash && window.location.hash != undefined){
    var initialHash = window.location.hash.toString();
    var $intialMoveEle = $(initialHash);
    if($intialMoveEle.length > 0){
      var moveTo = $intialMoveEle.offset().top;
      EMG.ui.executeScrollTo(moveTo, initialHash);
    }
  }
  
})(jQuery,this,this.document);
