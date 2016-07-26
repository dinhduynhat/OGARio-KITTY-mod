
// ==UserScript==
// @name         OGARio by szymy 2.0 (KITTY mod v2)
// @namespace    ogario.v2
// @version      2.0.7
// @description  OGARio - KITTY mod v2
// @author       szymy and KITTY (mod only)
// @match        http://agar.io/*
// @updateURL    https://raw.githubusercontent.com/KindKitty/OGARio-KITTY-mod/master/js/OGARio%20-%20KITTY%20mod.user.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// ==/UserScript==

// Copyright © 2016 ogario.ovh

if (location.host == "agar.io" && location.pathname == "/") {
    location.href = "http://agar.io/ogario" + location.hash;
    return;
}

var ogarioJS = '<script src="http://ogario.ovh/download/v2/ogario.v2.js" charset="utf-8"></script>';
var ogarioSniffJS = '<script src="http://ogario.ovh/download/v2/ogario.v2.sniff.js"></script>';
var ogarioCSS = '<link href="http://ogario.ovh/download/v2/ogario.v2.css" rel="stylesheet"></link>';
var cpickerJS = '<script src="http://ogario.ovh/download/v2/dep/bootstrap-colorpicker.min.js"></script>';
var cpickerCSS = '<link href="http://ogario.ovh/download/v2/dep/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrJS = '<script src="http://ogario.ovh/download/v2/dep/toastr.min.js" charset="utf-8"></script>';
var toastrCSS = '<link href="http://ogario.ovh/download/v2/dep/toastr.min.css" rel="stylesheet"></link>';

//var customCSS = '<link href="http://localhost/ogario/lol.css" rel="stylesheet"></link>';

function inject(page) {
    var _page = page.replace("</head>", cpickerCSS + toastrCSS + ogarioCSS + cpickerJS + toastrJS + ogarioSniffJS + "</head>");
    //var _page = page.replace("</head>", cpickerCSS + toastrCSS + ogarioCSS + customCSS + cpickerJS + toastrJS + ogarioSniffJS + "</head>");
    _page = _page.replace(/<script.*?>[\s]*?.*?window\.NREUM[\s\S]*?<\/script>/, "");
    _page = _page.replace(/<script.*?src=".*?agario\.core\.js.*?><\/script>/, "");
    _page = _page.replace("</body>", ogarioJS + "</body>");
    return _page;
}

window.stop();
document.documentElement.innerHTML = "";
GM_xmlhttpRequest({
    method : "GET",
    url : "http://agar.io/",
    onload : function(e) {
        var doc = inject(e.responseText);
        document.open();
        document.write(doc);
        document.close();
    }
});

// KITTY mod
var modVersion = GM_info.script.version;

setTimeout(function(){ //do what you need here

    var aTags = document.getElementsByTagName("button");
    var searchText = "Spectate";
    var found;

    var first = true;
    for (var i = 0; i < aTags.length; i++) {
        if (aTags[i].textContent == searchText) {
            found = aTags[i];
            break;
        }
    }
    $(found).html('<span class="glyphicon glyphicon-globe"></span>');
    $(found).prop('title', searchText);
    $(found).attr('data-toggle', "tooltip");

    aTags = document.getElementsByTagName("button");
    searchText = "Logout";

    for (i = 0; i < aTags.length; i++) {
        if (aTags[i].textContent == searchText) {
            found = aTags[i];
            break;
        }
    }
    $(found).html('<span class="glyphicon glyphicon-off"></span>');
    $(found).prop('title', searchText);
    $(found).attr('data-toggle', "tooltip");

    aTags = document.getElementsByTagName("button");
    searchText = "Copy";

    for (i = 0; i < aTags.length; i++) {
        if (aTags[i].textContent == searchText) {
            found = aTags[i];
            break;
        }
    }
    $(found).removeClass("btn-info").addClass("btn-link");


    $("#create-party-btn").html('<span class="glyphicon glyphicon-plus"></span>');
    $("#create-party-btn").prop('title', "Create party");
    $("#create-party-btn").attr('data-toggle', "tooltip");

    $("#join-party-btn").html('<span class="glyphicon glyphicon-save"></span>');
    $("#join-party-btn").prop('title', "Join party");
    $("#join-party-btn").attr('data-toggle', "tooltip");

    $("#og-reconnect-btn").prop('title', "Change server");
    $("#og-reconnect-btn").attr('data-toggle', "tooltip");

    $("#og-reconnect-btn").remove();

    $("#join-party-btn").attr("style", "width: 49% !important; float: right;");
    $( "#ogario-party" ).before('<div id="ogario-party">'+
                                '<input id="searchInput" class="form-control" data-placement="bottom" data-toggle="tooltip" title="You can also paste full leaderboard list here!" placeholder="Find player(s) or clan tag">'+
                                '<button id="searchBtn" class="btn btn-copy-token copy-party-token btn-primary" data-toggle="tooltip" style="margin-bottom:10px;" data-original-title="" title="Search leaderboards">'+
                                '<span id="searchSpan" class="glyphicon glyphicon-search"></span>'+
                                '</button></div>');
    //<button id="pasteBtn" class="btn btn-copy-token copy-party-token btn-link" style="margin-bottom: 10px;width:55px;float:left;" data-original-title="" title="Paste"><span class="glyphicon glyphicon-magnet"></span></button>
    $("#searchBtn").click(function(){searchPlayer();});
    $("#searchInput").keyup(function(event){
        if(event.keyCode == 13){
            $("#searchBtn").click();
        }
    });

    $("#searchInput").attr('style', 'margin-bottom: 10px; float: left; width: 65% !important');


    $("#overlays").removeAttr('style');
    $("#overlays").attr('style', 'position: absolute; left: 0; right: 0; top: 0; bottom: 0; z-index: 100;');

    $("#leaderboard-hud").append('<a id="searchBtn2" class="btn btn-sm disabled" data-toggle="tooltip" data-placement="bottom" data-original-title="Find learderboard"style="width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-top-color: rgb(141, 201, 64);border-bottom-style: none;border-left-style: none;border: none;margin-top: 0px;" data-original-title="Search leaderboards" title=""><span id="searchSpan" class="glyphicon glyphicon-search"></span></a>'+
                                 '<a id="copyLeaderboardBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;/* border-top-color: rgb(141, 201, 64); *//* border: none; */border-left-style: none;border-right-style: none;border-bottom-style: none;border: none;/* margin-top: 0px; */">Copy</a>'+
                                 '<a id="og-reconnect-btn" class="btn btn-info btn-sm icon-loop2" title="" data-toggle="tooltip" data-placement="bottom" data-original-title="Change server" style="'+
                                 'width: 33.3%;'+
                                 'text-shadow: 0.3px 0.3px #000000;'+
                                 'font-size: small;'+
                                 'margin-top: 0px;'+
                                 'margin-top: 0px;'+
                                 'border: none;'+
                                 '"></a><input id="tempCopy" style="display: none;" value="">');

    $('[data-toggle="tooltip"]').tooltip();

    $("#copyLeaderboardBtn").click(function() {
        copyLeaderboard();
    });

    $("#og-reconnect-btn").click(function(){

        changeServer();
        if (ogario.spectate == true) {
            spectate();
            spectateWithDelay();
            spectate();
        }
    });

    //$("#copyLeaderboardBtn").attr("style",'width: 50%;text-shadow: 0.3px 0.3px #000000; font-size: small; margin-top: 0px;border-top-color: '+$(".main-color").css("color")+';border-bottom-style: none; border-left-style: none;border-right-style: none; margin-top: 5px;');

    $("#version").before('<div id="modVersion" class="main-color" style="float:left;margin-top:10px;font-weight: 700;">KITTY mod v' + modVersion + '</div>');

    $("#minimap-sectors").attr("style", "opacity: 0.25;");

    // fast table switch + spectate

    $(document).keypress(function( event ) {
        if (event.which == 39) {
            changeServer();
            spectate();
            spectateWithDelay();
        }
    });


    $("#time-hud").attr("style", "top: 290px !important;");

    // fix time

    if($("#showTime").is(':checked')) {
        $("#time-hud").show();
    } else {
        $("#time-hud").hide();
    }



}, 5000);


var searching;
var timerId;

function spectate() {
    $(".btn-spectate").click();
}

function spectateWithDelay() {
    var delay = 1000;
    setTimeout(function() {
        spectate();
    }, delay);
}

function changeServer() {
    MC.reconnect();
}

function searchPlayer() {

    if (!searching) {



        var searchString = $("#searchInput").val().trim();
        if($.trim($("#searchInput").val()) == ''){

        } else {

            showCancelSearch();

            searching = true;

            var interval = 2500;
            var maxTries = 15;
            var numTries = 0;
            var minNamesFound = 2;

            toastr["success"]("Searching \'" + searchString + "\'...");

            var leaderboard = $(ogario.leaderboardHTML).text();
            var names = searchString.split(/[1-9]\.\s|10\.\s/g).filter(function(el) {return el.length != 0;});
            console.log(names);

            var numNames = names.length;
            console.log("Number of names: " + numNames);

            var found = false;
            numTries++;
            toastr["success"]("Search: " + numTries + "\/" + maxTries);

            if (numNames == 1) {
                found = foundName(leaderboard, searchString);
            } else if (numNames > 1) {
                found =  foundNames(leaderboard, names, minNamesFound);
            }

            if (found) {
                searching = false;
                hideCancelSearch();
                toastr["info"]("Player \'" + searchString + "\' found!");
            } else {
                changeServer();

                // start timer

                timerId = setInterval(function(){

                    leaderboard = $(ogario.leaderboardHTML).text();

                    console.log(names);
                    console.log("Number of names: " + numNames);

                    if (numNames == 1) {
                        found = foundName(leaderboard, searchString);
                    } else if (numNames > 1) {
                        found =  foundNames(leaderboard, names, minNamesFound);
                    }
                    numTries++;
                    toastr["success"]("Search: " + numTries + "\/" + maxTries);
                    if (numTries >= maxTries) {
                        clearInterval(timerId);
                        searching = false;
                        hideCancelSearch();
                        toastr["error"]("Player \'" + searchString + "\' not found. Search again!");
                    }
                    if (found) {
                        clearInterval(timerId);
                        searching = false;
                        hideCancelSearch();
                        toastr["info"]("Player \'" + searchString + "\' found!");
                    } else {
                        changeServer();
                    }

                }, interval);
            }


        }

    } else {
        var r = confirm("Stop searching?");
        if (r == true) {
            clearInterval(timerId);
            searching = false;
            hideCancelSearch();
            toastr["error"]("Search was canceled by user!");
        }
    }
}

function foundName(leaderboard, name) {
    return leaderboard.includes(name);
}

function foundNames(leaderboard, names, minNamesFound) {

    var numNames = names.length;
    var countFound = 0;
    var found = false;

    for (var i = 0; i < numNames; i++){
        found = foundName(leaderboard, names[i]);
        if (found) {countFound++;}
    }

    //if (countFound >= minNamesFound) {alert(countFound);}

    console.log("found: " + countFound);    
    return (countFound >= minNamesFound) ? true : false;
}

//

function copyLeaderboard() {

    $("#tempCopy").val($(ogario.leaderboardHTML).text());
    $("#tempCopy").show();
    $("#tempCopy").select();
    document.execCommand('copy');
    $("#tempCopy").hide();
    $("#tempCopy").val("");
}

function showCancelSearch() {
    $("#searchSpan").removeClass("glyphicon-search").addClass("glyphicon-ban-circle");
    $("#searchBtn").removeClass("btn-primary").addClass("btn-danger");
}

function hideCancelSearch() {
    $("#searchSpan").removeClass("glyphicon-ban-circle").addClass("glyphicon-search");
    $("#searchBtn").removeClass("btn-danger").addClass("btn-primary");
}

