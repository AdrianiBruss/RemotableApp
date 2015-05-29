$(function(){
    'use strict';

    function randomString()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        for( var i=0; i < 4; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function getSecretCode(){
        $('#code').append('<a href="http://192.168.20.253:3300/public/mobile/">'+secret_key+'</a>');
        //$('#code').append('<a href="http://192.168.10.16:3300/public/mobile/">'+secret_key+'</a>');
    }

    function saveSite(sites, hash){

        var site = {};
        site.url = document.URL;
        site.hash = hash.toString();
        sites.push(site);

        return sites;

    }

    function getLocal(){
        return localStorage.getItem('remotableSites');
    }

    function setLocal(sites, hash){
        localStorage.setItem('remotableSites', JSON.stringify(saveSite(sites, hash)));
    }

    var secret_key = randomString();
    var hash = CryptoJS.SHA512(secret_key);

    var local = getLocal();

    if (local == null){

        console.log('saving to local .. ');

        var sites = [];
        setLocal(sites, hash);

        getSecretCode();


    }else{

        console.log('getting from local .. ');

        var websites = JSON.parse(local);

        var result = $.grep(websites, function(e){
            return e.url == document.URL;
        });

        if (result.length == 1){
            console.log('already connected with token '+result[0].hash);
            hash = result[0].hash;
            // le code n'apparait pas
        }else{

            console.log('Remotable exists but website not found');
            // save site
            setLocal(websites, hash);
            //code
            getSecretCode();

        }


    }

    //var socket = io('ws://192.168.20.253:3303');
    var socket = io('ws://192.168.10.16:3303');

    // Envoie la clé au serveur
    socket.emit('desktopCo', hash);

    // En attente de la connexion du mobile
    socket.on('mobileConnected', function(data){
        if(data.data == "ok"){
            console.log('mobile connected');
        }
    });

    // impements methods that receive data from server and execute them
    socket.on('testDesk', function(data){
        console.log(data);
    });

    // change link page
    socket.on('changeLinkDesk', function(data){
        //console.log($("li.menu-item[data-desk-menu-item='"+data.link+"'] > a"));
        //$("li.menu-item[data-desk-menu-item='"+data.link+"'] > a").trigger('click');
        $(location).attr('href', $("li.menu-item[data-desk-menu-item='"+data.link+"'] > a").attr('href'));
    });

    //slider
    socket.on('swipeDesk', function(data){

        switch (data.direction){
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



    $('#fullpage').fullpage({
        sectionsColor: ['#f2f2f2', '#4BBFC3', '#7BAABE', 'whitesmoke', '#000']
    });



});
