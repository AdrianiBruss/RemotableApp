$(function () {
    'use strict';


    // ----------------------------------------------------------------------------------
    var $htmlBody = $('html, body');
    var $window = $(window);
    var height_window = $window.height();
    var hash = '';
    var socket;
    var key = '';

    // --------------------------------------------------
    // Check localStorage

    var local = getLocal();
    var websites = JSON.parse(local);


    // --------------------------------------------------

    function getSecretCode(data) {

        var keyColor = data.split('');

        var colors = ['6C7A89', 'F2784B', 'F9BF3B', '00B16A', '87D37C', '4B77BE', '2C3E50', 'F64747', 'AEA8D3', '674172'];

        var code = '';

        for (var i = 0; i < 4; i++) {

            code += '<span class="case" style="background-color:#' + colors[keyColor[i]] + '"></span>';

        }

        $('#remote-popup')
            .append('<p>Download the app and enter the code : </p>')
            .append(code);

        $('.case').css({
            'width': '30px',
            'height': '30px',
            'display': 'inline-block',
            'margin': '0 5px'
        });

    }

    function putContentOnPopup(msg) {

        $('#remote-popup')
            .append('<p>' + msg + '</p>');

    }

    function hideSecretCode() {
        $('#remote-popup')
            .empty()
            .css('display', 'none');
    }

    function saveSite(sites, hash, key) {

        var site = {};
        site.name = document.URL.split('/')[2];
        site.url = document.URL;
        site.hash = hash;
        site.key = key;
        sites.push(site);

        return sites;

    }

    function getLocal() {
        return localStorage.getItem('remotableSites');
    }

    function setLocal(sites, hash) {
        localStorage.setItem('remotableSites', JSON.stringify(saveSite(sites, hash)));
    }

    function removeLocal(hash){

        var local = JSON.parse(localStorage.remotableSites);

        if (local.length == 1){

            localStorage.removeItem('remotableSites');

        }else{

            for (var i = 0; i < local.length; i++){

                if (hash == local[i].hash){

                    local = local.slice(i+1);
                }

            }
            localStorage.setItem('remotableSites', JSON.stringify(local));

        }

        console.log('item deleted from LocalStorage');

    }

    function connectionToSite(data) {

        socket = io('ws://192.168.20.253:3303');
        //socket = io('ws://192.168.10.16:3303');
        //socket = io('ws://192.168.10.17:3303');

        // --------------------------------------------------
        // En attente de la connexion du mobile
        socket.on('mobileConnectedForDesktop', function (data) {

            if (data.data == "ok") {
                hideSecretCode();

                socket.emit('resizeDesktop', $window.height());

                //stockage dans la base de données
                if (local == null) {
                    // Stockage du site dans le localStorage
                    var sites = [];
                    setLocal(sites, hash, key);
                } else {
                    var local_site = isSiteInLocal();
                    if (local_site.length == 0) {
                        // save site
                        setLocal(websites, hash, key);
                    }

                }
            }
        });

        // --------------------------------------------------
        // change link page
        socket.on('changeLinkDesk', function (data) {
            var origin = $(location).attr('origin');

            //dev
            origin += '/RemotableSite/public/';


            $(location).attr('href', origin + data.link);
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

        // deleted mobile
        socket.on('deleteMobileForDesktop', function(data){

            removeLocal(data.data.hash);

        });

        // Envoie une requete au serveur pour récupérer le hash et le code
        socket.emit('desktopConnection', data, function (data) {

            console.log(data);

            // site supprimé du mobile
            if (data.code == 45){

                //suppression du localStorage
                removeLocal(data.hash);
            }

            // affiche le message dans la fenetre
            putContentOnPopup(data.infos);

            if (data.datas){

                hash = data.datas.hash;
                key = data.datas.key;
                getSecretCode(data.datas.key);
            }

        });

        socket.emit('datasDesktop', data, function(data){



        });

        //$window.on('resize', function(){});


    }

    function isSiteInLocal() {
        if (websites != null) {

            return $.grep(websites, function (e) {
                return e.name == document.URL.split('/')[2];
            });

        } else {

            return null;

        }


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

    function getContext(){

        var data = {};
        var text_links = $('.remote-link-text');
        var video_links = $('.remote-link-video');
        var img_links = $('.remote-link-img');

        data.windowHeight = $window.height();

        data.links = [];

        for (var j=0; j < text_links.length; j++ ){

            var textLinks = {};
            textLinks.type = 'text';
            textLinks.text = text_links.eq(j).html();
            textLinks.position = text_links.eq(j).offset();
            data.links.push(textLinks);
        }

        for (var k=0; k < video_links.length; k++ ){

            var videoLinks = {};
            videoLinks.type = 'text';
            videoLinks.text = video_links.eq(k).html();
            videoLinks.position = video_links.eq(k).offset();
            data.links.push(videoLinks);
        }

        for (var l=0; l < img_links.length; l++ ){

            var imgLinks = {};
            imgLinks.type = 'text';
            imgLinks.text = img_links.eq(l).html();
            imgLinks.position = img_links.eq(l).offset();
            data.links.push(imgLinks);
        }

        return data;


    }

    function getDatas() {

        var data = {};

        // Récupération du menu
        var $menu = $('nav.remote-menu');
        var $link = $('nav.remote-menu > ul > li');
        var menu = [];


        for (var i = 0; i < $link.length; i++) {

            var link = {};
            link.url = $link.eq(i).find('a').attr('href');
            link.name = $link.eq(i).find('a').html();
            menu.push(link);

        }

        data.menu = menu;

        // Récupération du title
        data.title = $(document).find("title").text();

        // Récupération du favicon
        data.favicon = 'favicon.png';

        //Récupération de l'url
        data.url = document.URL;

        data.bodyHeight = $('body').height();

        return data;

    }

    function checkLocal() {


        if (local == null) {

            var data = getDatas();
            $.extend(data, getContext());

            //connexion au serveur
            connectionToSite(data);


        } else {

            console.log('getting from local .. ');
            var result = isSiteInLocal();
            var dataContext = {};

            if (result.length == 1) {
                console.log('already connected with token ' + result[0].hash);

                dataContext.hash = result[0].hash;
                $.extend(dataContext, getContext());

                connectionToSite(dataContext);

            } else {

                console.log('Remotable exists but website not found');

                dataContext.hash = hash;
                $.extend(dataContext, getContext());
                connectionToSite(dataContext);


            }


        }


    }

    function init() {

        var $popup = $('#remote-code a');


        if ( $popup.length > 0){

            // initialisation du script
            console.log('FIRST PAGE SCRIPT');

            // pastille sur le site

            // Display popup
            $popup.on('click', function () {

                $('#remote-popup').css('display', 'block');

                checkLocal();

            });

        }else{

            console.log('OTHER PAGE SCRIPT');

            checkLocal();

        }


        // Close Popup
        $('#remote-popup-close').on('click', function () {
            $('#remote-popup').css('display', 'none');
        });

        // DeleteSite
        $('#remote-popup-delete').on('click', function () {


        });


    }

    // --------------------------------------------------

    init();

});
