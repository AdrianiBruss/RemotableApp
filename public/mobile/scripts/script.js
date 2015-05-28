$(function(){
    'use strict';

    // connecter au port
    var socket = io('ws://192.168.10.16:3303');
    //var socket = io('ws://192.168.20.253:3303');

    var data = {
        "user"      : 'Adrien',
        "message"   : null,
        "id"        : socket.id
    };

    $('#test').on('click', function(){

        console.log('click');
        socket.emit('test', Math.floor((Math.random() * 10) + 1));
        //$.post("/postest", { message: Math.floor((Math.random() * 10) + 1) });

    });

    var key;

    $('#submit').on('click', function(){

        // encrypte la clé en sha512
        key = CryptoJS.SHA512($('#input').val());
        // envoie la clé au serveur
        socket.emit('mobileCo', key.words[0]);

    });

    $('#connected').css('color', 'red');

    // en attente de la connexion du mobile
    socket.on('mobileConnected', function(res){

        // le mobile est connecté au serveur
        if(res.data == 'ok'){
            $('#connected').css('color', 'green');
        }

    })


});
