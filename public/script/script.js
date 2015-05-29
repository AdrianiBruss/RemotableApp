$(function () {
    'use strict';

    // --------------------------------------------------

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

    function connectionToSite(hash){

        //var socket = io('ws://192.168.20.253:3303');
        socket = io('ws://192.168.10.16:3303');

        // Envoie la clé au serveur
        socket.emit('desktopCo', hash, function (data) {
            if(data == 'desktopConnected'){
                console.log('desktop connected');
            }
        });

    }


    // --------------------------------------------------

    var secret_key = randomString();
    var hash = CryptoJS.SHA512(secret_key).toString();
    var socket;

    // --------------------------------------------------
    // Check localStorage

    var local = getLocal();

    if (local == null) {

        // connexion au serveur
        connectionToSite(hash);
        // le code apparait
        getSecretCode();
        // Stockage du site dans le localStorage
        var sites = [];
        setLocal(sites, hash);


    } else {

        console.log('getting from local .. ');

        var websites = JSON.parse(local);

        var result = $.grep(websites, function (e) {
            return e.name == document.URL.split('/')[2];
        });

        if (result.length == 1) {
            console.log('already connected with token ' + result[0].hash);
            connectionToSite(result[0].hash);
        } else {

            console.log('Remotable exists but website not found');

            connectionToSite(hash);
            // save site
            setLocal(websites, hash);
            //code
            getSecretCode();

        }


    }


    // --------------------------------------------------



    // En attente de la connexion du mobile
    socket.on('mobileConnected', function (data) {
        if (data.data == "ok") {
            console.log('mobile connected');
            hideSecretCode();
        }
    });


    // change link page
    socket.on('changeLinkDesk', function (data) {
        $(location).attr('href', $("li.menu-item[data-desk-menu-item='" + data.link + "'] > a").attr('href'));
    });

    //slider
    socket.on('swipeDesk', function (data) {

        switch (data.direction) {
            case 'prev':
                $.fn.fullpage.moveSlideLeft();
                break;
            case 'next':
                $.fn.fullpage.moveSlideRight();
                break;
            case 'up':
                $.fn.fullpage.moveSectionUp();
                break;
            case 'down':
                $.fn.fullpage.moveSectionDown();
                break;

        }

    });


});
