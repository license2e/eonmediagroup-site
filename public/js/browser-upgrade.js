var BrowserDetect = {
    init: function() {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function(data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                return data[i].identity;
            }
            else if (dataProp)
            return data[i].identity;
        }
    },
    searchVersion: function(dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [{
        string: navigator.userAgent,
        subString: "Chrome",
        identity: "Chrome"
    },
    {
        string: navigator.userAgent,
        subString: "MSIE",
        identity: "Internet Explorer",
        versionSearch: "MSIE"
    },
    {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
    },
    {
        string: navigator.vendor,
        subString: "Apple",
        identity: "Safari"
    },
    {
        prop: window.opera,
        identity: "Opera",
        versionSearch: "Version"
    },
    {
        string: navigator.userAgent,
        subString: "OmniWeb",
        versionSearch: "OmniWeb/",
        identity: "OmniWeb"
    },
    {
        string: navigator.vendor,
        subString: "iCab",
        identity: "iCab"
    },
    {
        string: navigator.vendor,
        subString: "KDE",
        identity: "Konqueror"
    },
    {
        string: navigator.vendor,
        subString: "Camino",
        identity: "Camino"
    },
    {
        string: navigator.userAgent,
        subString: "Netscape",
        identity: "Netscape"
    },
    {
        string: navigator.userAgent,
        subString: "Gecko",
        identity: "Mozilla",
        versionSearch: "rv"
    },
    {
        string: navigator.userAgent,
        subString: "Mozilla",
        identity: "Netscape",
        versionSearch: "Mozilla"
    }],
    dataOS: [{
        string: navigator.platform,
        subString: "Win",
        identity: "Windows"
    },
    {
        string: navigator.platform,
        subString: "Mac",
        identity: "Mac"
    },
    {
        string: navigator.platform,
        subString: "Linux",
        identity: "Linux"
    }]
};
BrowserDetect.init();
var UpdateYourBrowserInit = function() {
    var asn_resize = null;
    $(document).ready(function() {
        asn_resize = function() {
            if ($('#asn-warning').width() < 600) {
                $('#asn-outofdate').hide();
            }
            else if ($('#asn-warning').width() < 790) {
                $('#asn-outofdate').show().html('!');
            }
            else {
                $('#asn-outofdate').show().html('Your browser is out of date! ');
            }
        }
        if (
          ((BrowserDetect.browser == "Internet Explorer") && (parseInt(BrowserDetect.version) < 9)) 
          || ((BrowserDetect.browser == "Chrome") && (parseInt(BrowserDetect.version) < 18)) 
          || ((BrowserDetect.browser == "Opera") && (parseInt(BrowserDetect.version) < 10)) 
          || ((BrowserDetect.browser == "Safari") && (parseInt(BrowserDetect.version) < 5)) 
          || ((BrowserDetect.browser == "Firefox") && (parseInt(BrowserDetect.version) < 13))
        )
        {
            $('body').remove('#asn-warning');
            $('body').prepend("<div id=\"asn-warning\" style=\"position:absolute; display:none; left: 0px; border-bottom: solid 1px #DFDDCB; top:0px; margin: 0px; padding: 10px 0px; width: 100%; z-index: 99999; color: #6F6D5B; font-size: 10pt; padding: 0; background: #FFFCDF; font-family 'Trebuchet MS', Arial, Helvetica, sans-serif; text-align: left;\"><a href=\"http://www.updateyourbrowser.net/\" style=\"color: #4F4D3B; text-decoration: none; font: normal 9pt/14px 'Trebuchet MS', Arial, Helvetica; padding-right: 30px; display: block;\" target=\"_blank\"><span id=\"asn-outofdate\" style=\"display: block;  color: #fff; float: left; padding: 10px 18px 10px 8px; background: #bd695b url('http://www.updateyourbrowser.net/_static/imagens/arrow.gif') no-repeat right -2px; \">Your browser is out of date! </span><span style=\"display: block; padding: 10px 10px; float: left;\">You're using an old version of  <strong>" + BrowserDetect.browser + "</strong>. For the best experience,  please <span style=\"text-decoration: underline;\">update your browser</span>.</span></a> <a href=\"javascript://\" id=\"asn-close\" style=\"position: absolute; text-decoration: none; width: 14px; border: none; padding: 3px; top: 8px; right: 14px; color: #4F4D3B; height: 14px; font: normal 8pt/14px 'Trebuchet MS', Arial, Helvetica; background-image: url('http://www.updateyourbrowser.net/_static/imagens/close_03.gif');\"></a></div>");
            $('#asn-warning').fadeIn(1000);
            $('#asn-close').click(function() {
                $('#asn-warning').fadeOut(400);
            });
            $('#asn-warning a').mouseover(function() {
                $(this).css('color', '#8F8D7B');
            });
            $('#asn-warning a').mouseout(function() {
                $(this).css('color', '#4F4D3B');
            });
            if ((BrowserDetect.browser == "Internet Explorer") && (parseInt(BrowserDetect.version) <= 6)) {} else {
                $('#asn-warning').css('position', 'fixed');
            }
            asn_resize();
        }
    });
    $(window).on({
      "resize.asn": function(){asn_resize()}
    });
}
UpdateYourBrowserInit();