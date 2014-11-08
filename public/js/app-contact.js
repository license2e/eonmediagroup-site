(function($,window,document,undefined){ 
  
  $("#contact-form").delegate("label.invalid > input", "blur", function(){
    var errorMsgArray = $(this).parent().find('.error-message');
    if(errorMsgArray.length > 0){
      errorMsgArray.fadeOut('fast').stop().remove();
    }
  });
  
  $("#contact-form").submit(function(e){
    e.preventDefault();
    
    var $this = $(this),
        url = $this.attr('action'),
        $loader = $('#contact-form-loader');
        
    // show the loader
    $loader.fadeIn('fast');
    
    $('.titled', $this).each(function(){      
      var title = getTitle($(this));
      if(this.value == title){
        this.value = '';
      }
    });
    
    $(".contact-form-item .required.invalid").removeClass("invalid");
    $(".contact-form-item label .error-msg").remove();
    
    var error = false,
      email_regex = /^[^\.][-\w!#\$%&'\*\+\/=\?\^\`{\|}~\.]+[^\.$]@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/,
      contact_name = $('#contact-name').val(),
      contact_email = $('#contact-email').val();
    
    if(contact_name == ""){
      $('#contact-name').addClass("invalid").parent().append('<span class="error-msg" title="Please fill out your name">x</span>');
      error = true;
    } else {
      $('#contact-name').addClass("valid");
    }
    if(contact_email == ""){
      $('#contact-email').addClass("invalid").parent().append('<span class="error-msg" title="Please fill out your email address">x</span>');
      error = true;
    } else if( !email_regex.test(contact_email) ){
      $('#contact-email').addClass("invalid").parent().append('<span class="error-msg" title="Please enter a valid email address">x</span>');
      error = true;
    } else {
      $('#contact-email').addClass("valid");
    }
    console.log(error);
    if(error == false){
      $.ajax({
        type: "post",
        url: url,
        data: $this.serialize(),
        dataType: 'json',
        success: function(res){
          // hide the loader
          $loader.fadeOut();
          if(res.error){
            // highlight the required fields
            for(i in res.error){
              $("#contact-"+i).addClass("invalid").parent().append('<span class="error-msg" title="'+res.error[i]+'">x</span>');
            }
            $(".contact-form-item .required:not(.invalid)").addClass("valid");
          } else {  
            $(".contact-form-item .required:not(.invalid)").addClass("valid");
            // show the message as successfully sent
            $('#contact-submit').fadeOut();
          }
        }
      });
    } else {
      // hide the loader
      $loader.fadeOut();
    }
    return false;
  });
  
  $("#contact-message").resizable({
  	handles: "s",
  	minHeight: 158
  });
  
  function setTitled(){
    /* * /    
    $('.titled', $("#contact-form")).example(function(){
      var title = getTitle($(this));
      return title;
    });
    /* */
    $('#contact-form .titled').each(function(i){
      var $this = $(this),
          title = getTitle($this);
      $this.val(title);
      $this.on({
        focus: function(e){
          if($this.val() == title){
            $this.val('');
          }
        },
        blur: function(e){
          if($this.val() == ''){
            $this.val(title);
          }
        }
      });
    });
  }
  
  // set the titled form elements
  setTitled();
  
  function getTitle($ele) {
    var title = $ele.attr("placeholder");
    return title;
  }
  
})(jQuery,this,this.document);
