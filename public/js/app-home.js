(function($,window,document,undefined){ 
  
  $homeContent = $('#home-content-container');
  $homeContentText = $('#home-content-text');
  
  $('#find-out-more-link').click(function(e){
    e.preventDefault();
    var hiddenHeight = 57;
    var htmlWidth = $('html').width();
    if(htmlWidth >= 520 && htmlWidth <= 959){
      hiddenHeight = 155;
    } else if(htmlWidth > 959 && htmlWidth <= 1003){
      hiddenHeight = 132;
    } else if(htmlWidth > 1003){
      hiddenHeight = 101;
    }
    $this = $(this);
    if($this.data('open') != true){
      $this.data('open', true);
      $('#find-out-more-link,#find-out-more-text').addClass('clicked');
      $homeContent.animate({height: $homeContentText.outerHeight(true)+'px'});
    } else {
      $this.data('open', false);
      $('#find-out-more-link,#find-out-more-text').removeClass('clicked');
      $homeContent.animate({height: hiddenHeight+'px'});
    }
    return false;
  });
  
})(jQuery,this,this.document);