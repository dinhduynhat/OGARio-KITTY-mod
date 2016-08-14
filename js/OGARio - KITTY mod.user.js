
// ==UserScript==
// @name         OGARio by szymy 2.1 (KITTY mod v2)
// @namespace    ogario.v2
// @version      2.0.13
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

var ogarioJS = '<script src="http://ogario.ovh/download/v21/ogario.v2.js" charset="utf-8"></script>';
var ogarioSniffJS = '<script src="http://ogario.ovh/download/v21/ogario.v2.sniff.js"></script>';
var ogarioCSS = '<link href="http://ogario.ovh/download/v21/ogario.v2.css" rel="stylesheet"></link>';
var cpickerJS = '<script src="http://ogario.ovh/download/v2/dep/bootstrap-colorpicker.min.js"></script>';
var cpickerCSS = '<link href="http://ogario.ovh/download/v2/dep/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrJS = '<script src="http://ogario.ovh/download/v2/dep/toastr.min.js" charset="utf-8"></script>';
var toastrCSS = '<link href="http://ogario.ovh/download/v2/dep/toastr.min.css" rel="stylesheet"></link>';

function inject(page) {
    var _page = page.replace("</head>", cpickerCSS + toastrCSS + ogarioCSS + cpickerJS + toastrJS + ogarioSniffJS + "</head>");
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

/**********
* KITTY mod
**********/

var modVersion = GM_info.script.version;

setTimeout(function(){

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
    $("#join-party-btn").attr('data-toggle', "tooltip").prop('title', "Join party");

    $("#og-reconnect-btn").remove();

    $("#join-party-btn").attr("style", "width: 49% !important; float: right;");

    //backgroud div
    $("body").prepend('<div id="backgroundFade" style="' +
                      'width: 100%;' +
                      'height: 100%;' +
                      'position: absolute;' +
                      'background: black;' +
                      'z-index: 100;' +
                      'opacity: 0.6;' +
                      'display: none;' +
                      '"></div>');

    $("#overlays").css("z-index",100);

    $("#overlays-hud").prepend('<div id="searchHud" class="hud" style="' +
                               'width: 65%;' +
                               'height: 60px;' +
                               'z-index: 15;' +
                               '#display: block;' +
                               'margin: auto;' +
                               'top: 0;' +
                               'right: 0;' +
                               'left: 0;' +
                               'bottom: 0;' +
                               'position: fixed;">' +
                               '<div id="" style="margin-top: 10px;">' +
                               '<input id="searchInput" class="form-control" title="" placeholder="Enter friend\'s leaderboard, name or clan tag..." style="margin-bottom: 10px;float: left;width: 74% !important;text-align: center;">' +
                               '<button id="closeBtn" class="btn btn-copy-token copy-party-token" data-toggle="tooltip" style="color: #ffffff;margin-bottom:10px;width: 10%;" data-placement="right" data-original-title="Close" title=""><span class="glyphicon glyphicon-remove-circle"></span></button>' +
                               '<button id="searchBtn" class="btn btn-copy-token copy-party-token btn-primary" data-toggle="tooltip" data-placement="bottom" data-original-title="Cancel search" style="margin-bottom:10px;width: 15%;"><span id="searchSpan" class="glyphicon glyphicon-search"></span></button></div></div>');

    $("#leaderboard-hud").append('<div id="leaderboard-menu">'+
                                 '<a id="searchShortcut" class="btn btn-sm btn-info" data-toggle="tooltip" data-placement="bottom" data-original-title="Find learderboard (Backspace)"style="width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-top-color: rgb(141, 201, 64);border-bottom-style: none;border-left-style: none;border: none;margin-top: 0px;" data-original-title="Search leaderboards" title=""><span id="searchSpan" class="glyphicon glyphicon-search"></span></a>'+
                                 '<a id="copyLeaderboardBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;/* border-top-color: rgb(141, 201, 64); *//* border: none; */border-left-style: none;border-right-style: none;border-bottom-style: none;border: none;/* margin-top: 0px; */">Copy</a>'+
                                 '<a id="og-reconnect-btn" class="btn btn-info btn-sm icon-loop2" title="" data-toggle="tooltip" data-placement="bottom" data-original-title="Change server (+)" style="'+
                                 'width: 33.3%;'+
                                 'text-shadow: 0.3px 0.3px #000000;' +
                                 'font-size: small;' +
                                 'margin-top: 0px;' +
                                 'margin-top: 0px;' +
                                 'border: none;' +
                                 '"></a><input id="tempCopy" style="display: none;" value="">'+
                                 '</div>');

    $('[data-toggle="tooltip"]').tooltip();
    $("#searchBtn").tooltip('disable');

    $("#copyLeaderboardBtn").click(function() {
        copyLeaderboard();
    });

    $("#og-reconnect-btn").click(function(){

        changeServer();
        if (ogario.spectate == true) {
            hideSearchHud();
            spectateWithDelay();
        }
    });

    $("#searchBtn").click(function(){
        var searchString = $("#searchInput").val().trim();
        searchPlayer(searchString);
    });
    $("#searchInput").keyup(function(event){
        if(event.keyCode == 13){
            $("#searchBtn").click();
        }
    });

    $("#closeBtn").click(function() {
        hideSearchHud();
    });
    $("#searchShortcut").click(function() {
        hideMenu();
        showSearchHud();
        var lstfocus=$("#searchInput");
        $("body").click(function(){
            if ($(':focus').is("input")    ){
                lstfocus= $(':focus');
            }
            lstfocus.focus();
        });
        $("#searchInput").focus().select();
    });

    $("#menu-footer-v").before('<div id="modVersion" class="main-color" style="margin-top: 3px;float:left;font-weight: 700;"><a target="_blank" href="https://github.com/KindKitty/OGARio-KITTY-mod" style="color: #ffffff;">KITTY mod</a> v' + modVersion + '</div>');

    $("#minimap-sectors").attr("style", "opacity: 0.25;");

    $(".btn-donate").remove();
    $("#version").after('<a href="http://bit.ly/2ay9T4Z" class="btn-donate" target="_blank" style="float: right;">DONATE by click [AD]</a>');

    // fast table switch + spectate


    $(document).keyup(function( event ) {
        if (event.which == 8) {
            if ($('input:focus').length == 0) {
                $("#searchShortcut").click();
            }

        } else if(event.which == 187 && !($("input").is(":focus"))) {
            hideSearchHud();
            changeServer();
            spectateWithDelay();
        }
    });

    $(document).keyup(function( event ) {

        if (event.which == 27) {
            if ($('#searchHud').is(':visible')) {
                hideSearchHud();
            } else {
                showMenu();
            }
        }
    });


    $("#time-hud").attr("style", "top: 290px !important;");

    // fix time

    if($("#showTime").is(':checked')) {
        $("#time-hud").show();
    } else {
        $("#time-hud").hide();
    }

    // fix leaderboard buttons
    $("#leaderboard-menu").css("pointer-events", "auto");
    $("#searchHud").css("pointer-events", "auto");

    // fix stats text size
    $('[id="statsText"]').css("font-size", "medium");


    // detect paste
    $(document).bind("paste", function(e){
        if (!searching && !($("input").is(":focus"))) {
            var pastedData = e.originalEvent.clipboardData.getData('text');
            hideMenu();
            showSearchHud();
            $("#searchInput").val(pastedData);
            $("#searchInput").select();
            searchPlayer(pastedData);
        }
    } );

    $("#searchInput").bind("paste", function(e){
        if (!searching) {
            var pastedData = e.originalEvent.clipboardData.getData('text');
            $("#searchInput").val(pastedData);
            $("#searchInput").select();
            searchPlayer(pastedData);
        }
    } );

    // ANNOUNCEMENTS
    toastr["info"]('KITTY mod v'+modVersion+': You can now auto search by pasting anywhere on agar! Have fun :D');
    toastr["info"]('My website: <a target="_blank" href="https://github.com/KindKitty/OGARio-KITTY-mod">LINK</a>');

    console.log("lala: "+jQuery._data( "#leaderboard-positions", "events" ));

}, 5000);


var searching;
var timerId;

function delay(time, func) {
    setTimeout(function(){ func(); }, time);
}

function spectate() {
    hideMenu();
    $(".btn-spectate").click();
}

function spectateWithDelay() {
    delay(1000, spectate);
}

function changeServer() {
    //MC.refreshRegionInfo();
    MC.reconnect();
}

function searchPlayer(searchString) {
    if (!searching) {

        if($.trim($("#searchInput").val()) == ''){

        } else {
            //console.log("MC.isConnecting(): " + MC.isConnecting());
            showCancelSearch();

            searching = true;

            //var interval = 2500;
            var interval = 1800;
            var maxTries = 30;
            var numTries = 0;
            var minNamesFound = 3;

            var numAttempts = 0;
            var maxAttempts = 2;

            toastr["success"]("Searching \'" + searchString + "\'...");

            var leaderboard = $(ogario.leaderboardHTML).text();
            var names = searchString.split(/[1-9]\.\s|10\.\s/g).filter(function(el) {return el.length != 0;});
            console.log(leaderboard);

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
                hideSearchHud();
                toastr["info"]("Leaderboard found!");
                showMenu();
            } else {
                changeServer();

                // start timer

                timerId = setInterval(function(){

                    if (MC.isConnecting() == false || numAttempts == maxAttempts) {
                        numAttempts = 0;
                        console.log("MC.isConnecting(): " + MC.isConnecting());
                        leaderboard = $(ogario.leaderboardHTML).text();

                        console.log(leaderboard);
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
                            toastr["error"]("The leaderboard was not found. Keep trying...");
                        }
                        if (found) {
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            hideSearchHud();
                            toastr["info"]("Leaderboard found!");
                            showMenu();
                        } else {
                            //console.log("MC.isConnecting(): " + MC.isConnecting());
                            changeServer();
                        }
                    } else {
                        numAttempts++;
                        console.log("numAttempts: " + numAttempts);
                    }
                }, interval);
            }


        }

    } else {
        clearInterval(timerId);
        searching = false;
        hideCancelSearch();
        toastr["error"]("Search was canceled by user!");
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

function showSearchHud() {
    $("#backgroundFade").fadeIn();
    $("#searchHud").fadeIn();
}

function hideSearchHud(){
    $("#searchHud").fadeOut();
    $("#backgroundFade").fadeOut();
}

function showCancelSearch() {
    $("#searchSpan").removeClass("glyphicon-search").addClass("glyphicon-ban-circle");
    $("#searchBtn").removeClass("btn-primary").addClass("btn-danger");
    $("#searchBtn").tooltip('enable');
    $("#searchBtn").tooltip('show');
}

function hideCancelSearch() {
    $("#searchSpan").removeClass("glyphicon-ban-circle").addClass("glyphicon-search");
    $("#searchBtn").removeClass("btn-danger").addClass("btn-primary");
    $("#searchBtn").tooltip('hide');
    $("#searchBtn").tooltip('disable');
}

function showMenu() {
    $("#overlays").css("left", "0");
    $("#overlays").show();

    $('a[href="#main-panel"]').click();
}

function hideMenu() {
    $("#overlays").css("left", "-999em");
}




