$(function () {
    'use strict';

    // --------------------------------------------------

    var socket;

    function randomString() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        for (var i = 0; i < 4; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function getSecretCode() {
        $('#code').append('<a href="http://192.168.20.253:3300/public/mobile/">Enter the code : ' + secret_key + '</a>');
        //$('#code').append('<a href="http://192.168.10.16:3300/public/mobile/">'+secret_key+'</a>');
    }

    function hideSecretCode() {
        $('#code').remove();
    }

    function saveSite(sites, hash) {

        var site = {};
        site.name = document.URL.split('/')[2];
        site.url = document.URL;
        site.hash = hash;
        sites.push(site);

        return sites;

    }

    function getLocal() {
        return localStorage.getItem('remotableSites');
    }

    function setLocal(sites, hash) {
        console.log('saving to local .. ');
        localStorage.setItem('remotableSites', JSON.stringify(saveSite(sites, hash)));
    }

    function connectionToSite(data) {


        //socket = io('ws://192.168.20.253:3303');
        //socket = io('ws://192.168.1.17:3303');
        //socket = io('ws://remotableserver-cloudbruss.rhcloud.com');
        //socket = io('ws://ancient-bayou-6152.herokuapp.com/');
        socket = io('ws://192.168.10.16:3303');

        // Envoie la clé au serveur
        socket.emit('desktopCo', data, function (data) {
            console.log(data);
        });

    }

    function isSiteInLocal() {
        return $.grep(websites, function (e) {
            return e.name == document.URL.split('/')[2];
        });

    }

    function windowScroll(dir) {

        var pos = $window.scrollTop();

        if (dir == 'up') {

            //console.log($window.scrollTop());
            //$window.scrollTop(pos - 20);
            scrollBody(pos - height_window);

        } else if (dir == 'down') {

            //console.log($window.scrollTop());
            //$window.scrollTop(pos + 20);
            scrollBody(pos + height_window);

        }

    }

    function scrollBody(target) {
        $htmlBody.animate({
            scrollTop: target
        }, 500);
        return false;
    }


    function getDatas(){

        var data = {};

        // Récupération du menu
        var $menu = $('li.menu-item');
        var $link = $('li.menu-item > a');
        var menu = [];

        for (var i = 0; i<$menu.length; i++ ){

            var link = {};
            link.url = $link.eq(i).attr('href');
            link.name = $link.eq(i).html();
            menu.push(link);

        }

        data.menu = menu;

        // Récupération du title
        data.title = $(document).find("title").text();

        // Récupération du favicon
        data.favicon = 'favicon.png';

        //Récupération de l'url
        data.url = document.URL;

        data.hash = hash;

        data.add = true;

        return data;

    }



    // ----------------------------------------------------------------------------------
    var $htmlBody = $('html, body');
    var $window = $(window);
    var height_window = $window.height();
    var secret_key = randomString();
    var hash = CryptoJS.SHA512(secret_key).toString();

    // --------------------------------------------------
    // Check localStorage

    var local = getLocal();
    var websites = JSON.parse(local);


    if (local == null) {

        var data = getDatas();

        //connexion au serveur
        connectionToSite(data);

        // le code apparait
        getSecretCode();


    } else {

        console.log('getting from local .. ');
        var result = isSiteInLocal();
        var dataHash = {};

        if (result.length == 1) {
            console.log('already connected with token ' + result[0].hash);

            dataHash.hash = result[0].hash;
            connectionToSite(dataHash);

        } else {

            console.log('Remotable exists but website not found');

            dataHash.hash = hash;
            connectionToSite(dataHash);

            //code
            getSecretCode();

        }


    }


    // --------------------------------------------------

    // En attente de la connexion du mobile
    socket.on('mobileConnectedForDesktop', function (data) {

        if (data.data == "ok") {
            console.log('mobile connected');
            hideSecretCode();

            //stockage dans la base de données
            if (local == null) {
                // Stockage du site dans le localStorage
                var sites = [];
                setLocal(sites, hash);
            } else {
                var local_site = isSiteInLocal();
                if (local_site.length == 0) {
                    // save site
                    setLocal(websites, hash);
                }

            }
        }
    });


    // --------------------------------------------------


    // --------------------------------------------------

    // change link page
    socket.on('changeLinkDesk', function (data) {
        $(location).attr('href', data.link);
    });

    //slider
    socket.on('swipeDesk', function (data) {

        switch (data.direction) {
            case 'prev':

                break;
            case 'next':

                break;
            case 'up':
                windowScroll('up');
                break;
            case 'down':
                windowScroll('down');
                break;

        }

    });


});
