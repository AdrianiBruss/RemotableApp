$(function(){
    'use strict';

    // connecter au port
    //var socket = io('ws://192.168.10.17:3303');
    var socket = io('ws://192.168.20.253:3303');

    var data = {
        "user"      : 'Adrien',
        "message"   : null,
        "id"        : socket.id
    };

    $('#test').on('click', function(){

        console.log('click');
        socket.emit('test', Math.floor((Math.random() * 10) + 1));
        //$.post("/postest", { message: 'message posted ! ' });

    });

    var key;

    $('#submit').on('click', function(){

        console.log($('#input').val());
        key = CryptoJS.SHA512($('#input').val());

        socket.emit('mobileCo', key.words[0]);

    })


});
