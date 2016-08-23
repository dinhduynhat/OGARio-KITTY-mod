
// ==UserScript==
// @name         OGARio by szymy 2.1 (KITTY mod v2)
// @namespace    ogario.v2
// @version      2.3.1
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

    location.href = "http://agar.io/ogario" + window.location.search + location.hash;
    //return;
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
var currentIP = "0.0.0.0:0";
var currentToken = "";

var previousMode = previousMode = localStorage.getItem("gamemode");

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

    $("#overlays-hud").prepend('<div id="statsInfo" class="main-color" style="display: none;font-size: 13px;margin-top: 3px;float: left;font-weight: 700;background-color: rgba(0, 0, 0, 0.2);padding: 3px;border-radius: 4px;width: 65%;height: 24px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: 85px;position: fixed;pointer-events: auto;color: #ffffff;"><p style="float: left;margin-left: 10px;">Region: <span id="currentRegion"></span></p><p style="float: right;margin-right: 225px;">Servers: <span id="numServers"></span> (<span id="pps"></span> <span data-toggle="tooltip" data-placement="top" data-original-title="Players per server">PPS</span>)</p><p style="margin-left: 245px;">Players: <span id="numPlayers"></span> / <span id="totalPlayers"  data-toggle="tooltip" data-placement="top" data-original-title="Total players online"></span></p></div>'+

                               '<div id="searchHud" class="hud" style="' +
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
                               '<input id="searchInput" class="form-control" title="" placeholder="Enter friend\'s token, IP, leaderboard, name or clan tag..." style="margin-bottom: 10px;float: left;width: 74% !important;text-align: center;">' +
                               '<button id="closeBtn" class="btn btn-copy-token copy-party-token" data-toggle="tooltip" style="color: #ffffff;margin-bottom:10px;width: 10%;" data-placement="right" data-original-title="Close" title=""><span class="glyphicon glyphicon-remove-circle"></span></button>' +
                               '<button id="searchBtn" class="btn btn-copy-token copy-party-token btn-primary" data-toggle="tooltip" data-placement="bottom" data-original-title="Cancel search" style="margin-bottom:10px;width: 15%;"><span id="searchSpan" class="glyphicon glyphicon-search"></span></button></div></div>');

    $("#statsInfo").before('<div id="notes" class="main-color" style="display:none;font-size: 13px;float: left;font-weight: 700;border-radius: 4px;width: 65%;height: 147px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: 400px;position: fixed;pointer-events: auto;color: rgb(255, 255, 255);padding: 10px;background-color: rgba(0, 0, 0, 0.2);"><h5 class="main-color text-center" style="margin-top: 0px;">Save for later</h5>'+
                           '<input id="note1" class="form-control main-color note" style="background: transparent;color: lightgrey;  width: 25%;float:left; border: none; border-bottom: 1px solid; border-color: darkgrey; margin-right: 7px; text-align: center;">'+
                           '<input id="note2" class="form-control main-color note" style="background: transparent; color: lightgrey; width: 24%; float: left; border: none; border-bottom: 1px solid; margin-left: 0px; margin-right: 7px; text-align: center;'+
                           ' border-color: darkgrey;">'+
                           '<input id="note3" class="form-control main-color note" style="'+
                           'background: transparent;'+
                           'color: lightgrey;'+
                           'width: 49%;'+
                           'border: none;'+
                           'border-bottom: 1px solid;'+
                           'margin-left: 10px;'+
                           'text-align: center;'+
                           'border-color: darkgrey;'+
                           '"><input id="note4" class="form-control main-color note" style="'+
                           'background: transparent;'+
                           'color: lightgrey;'+
                           'width: 25%;'+
                           'float: left;'+
                           'border: none;'+
                           'border-bottom: 1px solid;'+
                           'margin-right: 7px;'+
                           'text-align: center;'+
                           'border-color: darkgrey;'+
                           '"><input id="note5" class="form-control main-color note" style="'+
                           'background: transparent;'+
                           'color: lightgrey;'+
                           'width: 24%;'+
                           'float: left;'+
                           'border: none;'+
                           'border-bottom: 1px solid;'+
                           'margin-left: 0px;'+
                           'margin-right: 7px;'+
                           'text-align: center;'+
                           'border-color: darkgrey;'+
                           '"><input id="note6" class="form-control main-color note" style="'+
                           'background: transparent;'+
                           'color: lightgrey;'+
                           'width: 49%;'+
                           'border: none;'+
                           'border-bottom: 1px solid;'+
                           'margin-left: 10px;'+
                           'text-align: center;'+
                           'border-color: darkgrey;'+
                           '"><input id="note7" class="form-control main-color note" style="'+
                           'background: transparent;'+
                           'color: lightgrey;'+
                           'border: none;'+
                           'border-bottom: 1px solid;'+
                           'text-align: center;'+
                           'border-color: darkgrey;'+
                           '"></div>');

    // save notes

    $(".note").keyup(function(event) {
        localStorage.setItem(event.target.id, $(event.target).val());
    });

    $("#searchHud").after('<div id="searchLog" class="main-color" style="font-size: 13px;float: left;font-weight: 700;border-radius: 4px;width: 65%;height: 270px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: -390px;position: fixed;pointer-events: auto;color: rgb(255, 255, 255);padding: 10px;display: none;background-color: rgba(0, 0, 0, 0.2);"><h5 id="logTitle" class="main-color text-center" style="margin-top: 0px;">Leaderboard history</h5>'+
                          '<div id="log" style="font-weight: normal; overflow-x: hidden; overflow-y: auto;height: 90%;">'+

                          '</div></div>');

    $("#leaderboard-hud").append('<div id="leaderboard-menu">'+
                                 '<a id="searchShortcut" class="btn btn-sm btn-info" data-toggle="tooltip" data-placement="bottom" data-original-title="Find learderboard (Backspace)" style="width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-top-color: rgb(141, 201, 64);border-bottom-style: none;border-left-style: none;border: none;margin-top: 0px;" data-original-title="Search leaderboards" title=""><span id="searchSpan" class="glyphicon glyphicon-search"></span></a>'+
                                 '<a id="copyLBBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;/* border: none; */border-left-style: none;border-right-style: none;border-bottom-style: none;border: none;" data-toggle="tooltip" data-placement="top" data-original-title="Copy leaderboard (L)">Copy</a>'+
                                 '<a id="og-reconnect-btn" class="btn btn-info btn-sm icon-loop2" title="" data-toggle="tooltip" data-placement="bottom" data-original-title="Change server (+)" style="'+
                                 'width: 33.3%; text-shadow: 0.3px 0.3px #000000; font-size: small; margin-top: 0px; margin-top: 0px; border: none;"></a>' +
                                 '<div id="dropDown" class="hud" style="position: absolute; pointer-events: auto; width: 33%; height: 60px; left: 67px; padding: 0px; border-radius: 0px;">'+
                                 '<a id="copyTKBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none;/* position: absolute; *//* right: 100px; *//* bottom: -30px; */" data-toggle="tooltip" data-placement="left" data-original-title="Copy token">TK</a>'+
                                 '<a id="copyIPBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy IP address">IP</a>'+
                                 '</div>'+
                                 '<input id="tempCopy" style="display: none;" value="">'+
                                 '</div>');

    $("#searchShortcut, #og-reconnect-btn").mouseenter(function(){
        $("#dropDown").hide();
        $("#copyLBBtn").text("Copy");
    });

    $("#copyLBBtn").mouseenter(function(){
        $("#copyLBBtn").text("LB");
        $("#dropDown").show(100);
    });

    $("#leaderboard-menu").mouseleave(function() {
        $("#dropDown").hide();
        $("#copyLBBtn").text("Copy");
    });


    $("#logTitle").after('<a href="#" style="color: lightgrey;float: right;position: absolute;right: 12px;top: 9px;" class="main-color" onclick="$(\'#log\').html(\'\');" data-toggle="tooltip" data-placement="left" data-original-title="Clear list"><span class="glyphicon glyphicon-ban-circle"></span></a>');

    $('[data-toggle="tooltip"]').tooltip();
    $("#searchBtn").tooltip('disable');

    $("#copyLBBtn").click(function() {
        copy(getLeaderboard());
    });

    $("#copyTKBtn").click(function() {
        copy("http://agar.io/#" + currentToken);
    });

    $("#copyIPBtn").click(function() {
        copy("http://agar.io/?r=" + MC.getRegion() + "&m=" + getGameMode() + "&search=ws://" + currentIP);
    });

    $("#og-reconnect-btn").click(function(){

        hideMenu();
        changeServer();

        if (!$("#searchHud").is(':visible')) {
            delay(200, spectate);
        }
    });

    $("#searchBtn").click(function(){
        var searchString = $("#searchInput").val();
        searchHandler(searchString);
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

        $("#searchInput").focus().select();
    });

    $("#menu-footer-v").before('<div id="modVersion" class="main-color" style="font-size: 13px; margin-top: 3px; float: left; font-weight: 700; background-color: rgba(0, 0, 0, 0.2); padding: 3px; border-radius: 4px;"><a target="_blank" href="https://github.com/KindKitty/OGARio-KITTY-mod" style="color: #ffffff;">KITTY mod v' + modVersion + '</a></div>');

    $("#minimap-sectors").attr("style", "opacity: 0.25;");

    // keybinds

    $(document).keyup(function( event ) {

        if (event.which == 8) { // search
            if ($('input:focus').length == 0) {
                $("#searchShortcut").click();
            }

        } else if(event.which == 187 && !($("input").is(":focus")) && ogario.play == false) { // refresh server

            $("#og-reconnect-btn").click();

        } else if (event.which == 27) { // ESCAPE

            if ($('#searchHud').is(':visible')) {
                hideSearchHud();
            } else {
                showMenu();
            }
        }

    });

    $(document).keydown(function( event ) {
        if (event.which == 81 && ogario.spectate && !($("input").is(":focus"))) { // spectate 'Q' fix
            spectate();
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
            searchHandler(pastedData);
        }
    } );

    $("#searchInput").bind("paste", function(e){
        if (!searching) {
            var pastedData = e.originalEvent.clipboardData.getData('text');
            $("#searchInput").val(pastedData);
            $("#searchInput").select();
            searchHandler(pastedData);
        }
    } );

    //load notes
    $("#note1").val(localStorage.getItem('note1'));
    $("#note2").val(localStorage.getItem('note2'));
    $("#note3").val(localStorage.getItem('note3'));
    $("#note4").val(localStorage.getItem('note4'));
    $("#note5").val(localStorage.getItem('note5'));
    $("#note6").val(localStorage.getItem('note6'));
    $("#note7").val(localStorage.getItem('note7'));

    // listen for server disconnect
    MC.onDisconnect = function(){
        toastr["error"]("Disconnected from server :(").css("width","210px");
        appendSysLog("DISCONNECTED :(");
    };

    // listen for player ban
    MC.onPlayerBanned  = function(){
        toastr["error"]("You were banned :(").css("width","210px");
        appendSysLog("BAN :(");
    };

    $("#region").ready(function() {delay(2000, getInfo);});

    $('body').on('click', '.logEntry', function () {

        document.getElementById('searchInput').value = "http://agar.io/#" + $(this).data('token');
        bumpLog();
        getInfo();
        searchTKHandler($("#searchInput").val());

    });

    $('body').on('click', '.btn-play-shortcut', function () {
        hideSearchHud();
        toastr.clear();
        play();
    });
    $('body').on('click', '.btn-spectate-shortcut', function () {
        hideSearchHud();
        toastr.clear();
        spectate();
    });


    $("#region, #gamemode").change(function(){
        appendLog(getLeaderboard());
    });

    // hide party form
    var url = window.location.href;     // Returns full URL
    if (url.length !== 21) {
        $("#ogario-party").hide();
    }

    $("#gamemode").change(function(){
        if ($("#gamemode").val() == ":party") {
            $("#ogario-party").show();
            $("#joinPartyToken").val("");
        } else {
            $("#ogario-party").hide();
        }
         localStorage.setItem("gamemode", ogario.gameMode);
    });

    $("#region").change(function(){
        localStorage.setItem("location2", MC.getRegion());
    });

    $(document).ajaxComplete(function(event, xhr, settings) {
        //console.log(xhr);
        //console.log(settings);

        if(xhr.responseJSON != null) {
            if (xhr.responseJSON.ip != null && xhr.responseJSON.hasOwnProperty('ip')){
                currentIP = xhr.responseJSON.ip;
            }

            if (xhr.responseJSON.token != null && xhr.responseJSON.hasOwnProperty('token')){
                currentToken = xhr.responseJSON.token;
            }


        }

        if (xhr.status == 200 && settings.url == "http://m.agar.io/getToken") {
            toastr["info"]("Connected :)").css("width","210px");
        }
    });

    $(document).ajaxError(function(event, xhr, settings) {
        //console.log(xhr);
        //console.log(event);
        //console.log(settings);

        if (xhr.status == 404 && settings.url == "http://m.agar.io/getToken") {
            toastr["error"]("Invalid token or server has closed :(").css("width","210px");
            $('#helloContainer').attr('data-party-state', '0');
        }
    });

    // search IP in query
    setTimeout(function() {

         var url = window.location.href;
        var region = getParameterByName("r", url);
        var mode = getParameterByName("m", url);
        var searchStr = getParameterByName("search", url);

        if (url.length == 21) {

            currentToken = url.replace("http://agar.io/#", "");

        } else{
            if (region != null) {

                MC.setRegion(region);
                MC.setGameMode(mode);
            } else {
                // bug fix
                MC.setRegion(localStorage.getItem("location2"));
                MC.setGameMode(previousMode);
            }
        }


        if (searchStr != null && searchStr) {

            if ( searchIPHandler(searchStr)) {
                hideMenu();
                showSearchHud();
                showCancelSearch();
                $("#searchInput").val(searchStr);
            }
        }



    }, 5000);

    // ANNOUNCEMENTS
    toastr["info"]('KITTY mod v'+modVersion+': Direct connect is now possible using tokens agar.io/#XXXX!! Have fun :D');
    toastr["info"]('Don\'t forget to share! </br>My website: <a target="_blank" href="https://github.com/KindKitty/OGARio-KITTY-mod">LINK</a>');

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

function changeServer() {
    MC.setGameMode(ogario.gameMode);
    MC.reconnect();
    appendLog(getLeaderboard());
}

function isValidIpAndPort(input) {
    var parts = input.split(":");
    var ip = parts[0].split(".");
    var port = parts[1];
    return validateNum(port, 1, 65535) &&
        ip.length == 4 &&
        ip.every(function (segment) {
        return validateNum(segment, 0, 255);
    });
}

function validateNum(input, min, max) {
    var num = +input;
    return num >= min && num <= max && input === num.toString();
}

function joinToken(token) {

    $("#joinPartyToken").val(token);
    $("#join-party-btn").click();
    $("#joinPartyToken").val("");
    $("#gamemode").val("");
    currentToken = token;
}

function searchHandler(searchStr){

    searchStr = searchStr.trim();

    if (searchIPHandler(searchStr)) {
        // is an IP
    } else if (searchTKHandler(searchStr)) {
        // is a token
    } else {
        searchPlayer(searchStr);
    }

}

function searchTKHandler(searchStr) {
    searchStr = searchStr.trim();

    if (searchStr.startsWith("http://agar.io/#")) {
        joinToken(searchStr.replace("http://agar.io/#", ""));
    } else if (searchStr.startsWith("agar.io/#")) {
        joinToken(searchStr.replace("agar.io/#", ""));
    } else {
        return false;
    }
    return true;

}

function searchIPHandler(searchStr) {
    searchStr = searchStr.trim();

    if (isValidIpAndPort(searchStr)) {
        findIP(searchStr);
    } else if (isValidIpAndPort(searchStr.replace("ws://", ""))) {
        findIP(searchStr.replace("ws://", ""));
    } else if (isValidIpAndPort(searchStr.replace("agar.io/?search=ws://", ""))) {
        findIP(searchStr.replace("agar.io/?search=ws://", ""));
    } else if (isValidIpAndPort(searchStr.replace("http://agar.io/?search=ws://", ""))) {
        findIP(searchStr.replace("http://agar.io/?search=ws://", ""));
    } else if (getParameterByName("search", searchStr)) {

        var region = getParameterByName("r", searchStr);
        var mode = getParameterByName("m", searchStr);
        var ip = getParameterByName("search", searchStr);

        if (region) {
            MC.setRegion(region);
            getInfo();
        }
        MC.setGameMode(mode);

        findIP(ip.replace("ws://", ""));

    } else {
        return false;
    }
    return true;
}

function findIP(searchIP) {

    if (!searching) {

        if($.trim(searchIP) == ''){

        } else {
            showCancelSearch();

            searching = true;

            var interval = 1800;
            var maxTries = 30;
            var numTries = 0;

            var numAttempts = 0;
            var maxAttempts = 2;

            toastr["success"]("Searching IP \'ws://" + searchIP + "\'...").css("width","210px");

            numTries++;

            if (currentIP == searchIP) {
                searching = false;
                hideCancelSearch();
                //hideSearchHud();
                toastr["info"]('Leaderboard found!</br> <button class="btn btn-sm btn-primary btn-play btn-play-shortcut" style="margin-top: 10px;border-color: darkblue;">PLAY</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" style="width: 100%;margin-top: 10px;">SPECTATE</button>', "", {timeOut: 20000, extendedTimeOut: 20000}).css("width","210px");
                //showMenu();
            } else {

                changeServer();

                timerId = setInterval(function(){

                    if (MC.isConnecting() == false || numAttempts == maxAttempts) {
                        numAttempts = 0;
                        //console.log("MC.isConnecting(): " + MC.isConnecting());

                        numTries++;
                        toastr["success"]("Search: " + numTries + "\/" + maxTries).css("width","210px");
                        if (numTries >= maxTries) {
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            toastr["error"]("The leaderboard was not found. Keep trying...").css("width","210px");
                        }
                        if (currentIP == searchIP) {
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            //hideSearchHud();
                            toastr["info"]('Leaderboard found!</br> <button class="btn btn-sm btn-primary btn-play btn-play-shortcut" style="margin-top: 10px;border-color: darkblue;">PLAY</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" style="width: 100%;margin-top: 10px;">SPECTATE</button>', "", {timeOut: 20000, extendedTimeOut: 20000}).css("width","210px");
                            //showMenu();
                        } else {
                            //console.log("MC.isConnecting(): " + MC.isConnecting());
                            changeServer();
                        }
                    } else {
                        numAttempts++;
                        //console.log("numAttempts: " + numAttempts);
                    }
                }, interval);

            }
        }
    } else {
        clearInterval(timerId);
        searching = false;
        hideCancelSearch();
        toastr["error"]("Search was canceled!").css("width","210px");
    }
}


function searchPlayer(searchString) {
    if (!searching) {

        if($.trim(searchString) == ''){

        } else {

            showCancelSearch();

            searching = true;

            //var interval = 2500;
            var interval = 1800;
            var maxTries = 30;
            var numTries = 0;
            var minNamesFound = 3;

            var numAttempts = 0;
            var maxAttempts = 2;

            toastr["success"]("Searching \'" + searchString + "\'...").css("width","210px");

            var leaderboard = getLeaderboard();
            var names = searchString.split(/[1-9]\.\s|10\.\s/g).filter(function(el) {return el.length != 0;});
            //console.log(leaderboard);

            var numNames = names.length;
            //console.log("Number of names: " + numNames);

            var found = false;
            numTries++;
            toastr["success"]("Search: " + numTries + "\/" + maxTries).css("width","210px");

            if (numNames == 1) {
                found = foundName(leaderboard, searchString);
            } else if (numNames > 1) {
                found =  foundNames(leaderboard, names, minNamesFound);
            }

            if (found) {
                searching = false;
                hideCancelSearch();
                //hideSearchHud();
                toastr["info"]('Leaderboard found!</br> <button class="btn btn-sm btn-primary btn-play btn-play-shortcut" style="margin-top: 10px;border-color: darkblue;">PLAY</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" style="width: 100%;margin-top: 10px;">SPECTATE</button>', "", {timeOut: 20000, extendedTimeOut: 20000}).css("width","210px");
                //showMenu();
            } else {
                changeServer();

                // start timer

                timerId = setInterval(function(){

                    if (MC.isConnecting() == false || numAttempts == maxAttempts) {
                        numAttempts = 0;
                        //console.log("MC.isConnecting(): " + MC.isConnecting());
                        leaderboard = $(ogario.leaderboardHTML).text();

                        //console.log(leaderboard);
                        //console.log("Number of names: " + numNames);

                        if (numNames == 1) {
                            found = foundName(leaderboard, searchString);
                        } else if (numNames > 1) {
                            found =  foundNames(leaderboard, names, minNamesFound);
                        }
                        numTries++;
                        toastr["success"]("Search: " + numTries + "\/" + maxTries).css("width","210px");
                        if (numTries >= maxTries) {
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            toastr["error"]("The leaderboard was not found. Keep trying...").css("width","210px");
                        }
                        if (found) {
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            //hideSearchHud();
                            toastr["info"]('Leaderboard found!</br> <button class="btn btn-sm btn-primary btn-play btn-play-shortcut" style="margin-top: 10px;border-color: darkblue;">PLAY</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" style="width: 100%;margin-top: 10px;">SPECTATE</button>', "", {timeOut: 20000, extendedTimeOut: 20000}).css("width","210px");
                            //showMenu();
                        } else {
                            //console.log("MC.isConnecting(): " + MC.isConnecting());
                            changeServer();
                        }
                    } else {
                        numAttempts++;
                        //console.log("numAttempts: " + numAttempts);
                    }
                }, interval);
            }


        }

    } else {
        clearInterval(timerId);
        searching = false;
        hideCancelSearch();
        toastr["error"]("Search was canceled!").css("width","210px");
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

    //console.log("found: " + countFound);
    return (countFound >= minNamesFound) ? true : false;
}

//

function copy(text) {

    $("#tempCopy").val(text);
    $("#tempCopy").show();
    $("#tempCopy").select();
    document.execCommand('copy');
    $("#tempCopy").hide();
    $("#tempCopy").val("");
}

function showSearchHud() {
    getInfo();
    $("#backgroundFade").fadeIn();
    $("#notes").fadeIn();
    $("#statsInfo").fadeIn();
    $("#searchHud").fadeIn();
    $("#searchLog").fadeIn();

}

function hideSearchHud(){
    $("#searchHud").fadeOut();
    $("#backgroundFade").fadeOut();
    $("#notes").fadeOut();
    $("#statsInfo").fadeOut();
    $("#searchLog").fadeOut();
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

function getLeaderboard() {
    return $(ogario.leaderboardHTML).text();
}

function getGameMode(){
    return $("#gamemode").val();
}


function bumpLog() {
    $("#log").animate({scrollTop: 0}, "slow");
}

function getInfo() {
    $.ajax({ type: "GET", url: "http://m.agar.io/info",
            datatype: "json",
            success: function(info){
                $("#currentRegion").html(MC.getRegion());
                var regions = info.regions;
                var currentRegion;
                for (var key in regions) {
                    if (key == MC.getRegion()) {
                        currentRegion = regions[key];break;
                    }
                }
                //console.log(info);
                $("#numPlayers").html(kFormatter(currentRegion.numPlayers));
                $("#totalPlayers").html(kFormatter(info.totals.numPlayers));
                $("#numServers").html(currentRegion.numRealms);
                $("#pps").html(Math.round(currentRegion.avgPlayersPerRealm));
            }});}

function kFormatter(num) {return num > 999 ? (num/1000).toFixed(1) + "k" : num;}

function clearNotifications() {
    toastr.clear();
}

function play(){
    $('*[data-itr="page_play"]').click();
}

function spectate(){
    $('*[data-itr="page_spectate"]').click();
}

function appendLog(message) {
    var region = MC.getRegion();
    $("#log").prepend('<p style="display: none;white-space: nowrap;margin-bottom: 10px;">'+
                      '<span class="main-color">' + region.substring(0, 2)  + '</span> &nbsp;'+
                      '<a href="javascript:void(0);" class="logEntry" data-token="'+currentToken+'" style="color: lightgrey; font-size: 14px;">' + message + '</a></p>');

    $("#log p").first().show(100);
    bumpLog();
}

function appendSysLog(message) {
    $("#log").prepend('<p style="display: none;white-space: nowrap;margin-bottom: 10px;">'+
                      '<span class="main-color">' + message  + '</span></p>');

    $("#log p").first().show(100);
    bumpLog();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getQueryVariable(variable, url)
{
    var query = url.substring(1);
    var vars = query.split("&amp;");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == name){return pair[1];}
    }
    return(false);
}


