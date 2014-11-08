// setup the console vars
var console = window.console || {
  log:function(){},
  warn:function(){},
  error:function(){}
};
// setup the EMG namespace
var EMG = EMG || {
  version: "1.0.0",
  ns: function (namespaces) {
		var names = namespaces.split('.'), len, ns = EMG, i;
		if (names[0].toUpperCase() == 'EMG') {
			names.splice(0,1);
		}
		len = names.length;
		for (i = 0; i < len; i++) {
			( !ns[names[i]] && (ns[names[i]] = {}) );
			ns = ns[names[i]];
		}
	},
};

(function($,window,document,undefined){ 
  // check if the browser cant support svgs
  var nosvg = false;
  //if(!document.createElementNS && !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect){
  if(BrowserDetect != undefined){
    if (
      ((BrowserDetect.browser == "Internet Explorer") && (parseInt(BrowserDetect.version) < 9)) 
      || ((BrowserDetect.browser == "Chrome") && (parseInt(BrowserDetect.version) < 18)) 
      || ((BrowserDetect.browser == "Opera")) 
      || ((BrowserDetect.browser == "Safari") && (parseInt(BrowserDetect.version) < 5)) 
      || ((BrowserDetect.browser == "Firefox") && (parseInt(BrowserDetect.version) < 13))
      || ((BrowserDetect.browser != "Internet Explorer" && BrowserDetect.browser != "Chrome" && BrowserDetect.browser != "Opera" && BrowserDetect.browser != "Safari" && BrowserDetect.browser != "Firefox"))
    )
    {
      nosvg=true;$("body").addClass('nosvg');
    }
  }
  //}

  // font resizer setup function
  function setupFontResize(){
    // resize the font based on width
    var resize_font_kompressor = .0625; // 20px based on the 320px width
    var resize_font_min = 20; // 20px based on the 320px width
    var resize_font_max = 60; // 60px based on the 2048px width
    var resizeFont = function(){
      var fontSize = ($('html').width()*resize_font_kompressor);
      if(fontSize < resize_font_min){
        fontSize = resize_font_min;
      } else if(fontSize > resize_font_max){
        fontSize = resize_font_max;
      }
      fontSize = parseInt(fontSize);
      $('body').css({fontSize: fontSize+"px"});
    }
    $(window).on({
      "resize.font": function(){resizeFont()}
    });
    resizeFont();
  }
  // setup the font resizer script
  setupFontResize();
  
  // pre load images function
  function preLoadAndCacheImages(imgPaths) {
  	var imageObj = new Image();
    var $imgPreloader = $("<div class='img-pre-loader'/>");
    $imgPreloader.css({ "display" : "none" }).appendTo("body");
  	if (typeof imgPaths == 'string') {
  	  var tempImgPath = imgPaths;
      imgPaths = [tempImgPath];
  	}
		for (var index=0; index<imgPaths.length; index++) {
		  var imgPath = imgPaths[index];
		  if(nosvg){
		    imgPath = imgPath.replace(/svg/g,'png');
		  }
		  $imgPreloader.append('<img src="'+imgPath+'">');
		}
  };
  
  main_images = [
    //'/css/images/svg/emg-services-n.svg',
    //'/css/images/svg/emg-success-n.svg',
    //'/css/images/svg/emg-contact-n.svg',
    //'/css/images/svg/up-button-n.svg',
    //'/css/images/svg/down-button-n.svg',
    //'/css/images/svg/contact-us-n.svg',
    //'/css/images/svg/top-button-n.svg',
    //'/css/images/svg/plus-button-n.svg',
    //'/css/images/svg/x-button-n.svg',
    //'/css/images/svg/send-your-message-n.svg',
    
    '/css/images/svg/emg-services-h.svg',
    '/css/images/svg/emg-success-h.svg',
    '/css/images/svg/emg-contact-h.svg',
    '/css/images/svg/emg-services-a.svg',
    '/css/images/svg/emg-success-a.svg',
    '/css/images/svg/emg-contact-a.svg',
    '/css/images/svg/emg-logo-h.svg',
    
    '/css/images/svg/separating-line.svg',
    
    '/css/images/svg/up-button-h.svg',
    '/css/images/svg/down-button-h.svg',
    '/css/images/svg/contact-us-h.svg',
    '/css/images/svg/top-button-h.svg',
    '/css/images/svg/plus-button-h.svg',
    '/css/images/svg/x-button-h.svg',
    '/css/images/svg/send-your-message-h.svg',
    
    '/case-studies/svg/results-aha-1400.svg',
    '/case-studies/svg/results-rc-28.283.svg',
    '/case-studies/svg/results-rca-14.svg',
    '/case-studies/svg/results-rca-3.svg',
    '/case-studies/svg/results-rca-523.svg',
    
  ];
  
  supporting_images = [
    '/css/images/png/2px-divider.png',
    '/css/images/loader.gif',
  ]
  
  preLoadAndCacheImages(main_images);
  preLoadAndCacheImages(supporting_images);
  
  EMG.ns("ui");
  EMG.ui = {
    executeScrollTo: function(top, href){
      $('html,body').animate({scrollTop: top+"px"},1200,'easeInOutQuad');
      /* * /
      if(window.location.hash != href){
        window.location.hash = href;
      }
      /* */
    },
  };
  
  var $topLink = $('#top-link'),
    topLinkHref = $topLink.attr("href"),
    topLinkMoveTo = $(topLinkHref).offset().top;
  
  $topLink.on({
    "click.top": function(e){
      e.preventDefault();
      EMG.ui.executeScrollTo(topLinkMoveTo, topLinkHref);
      return false;
    }
  });
  
})(jQuery,this,this.document);