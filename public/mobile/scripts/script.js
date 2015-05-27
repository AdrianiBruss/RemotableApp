$(function(){
    'use strict';

    // connecter au port
    var socket = io('ws://192.168.10.17:3303');

    var data = {
        "user"      : 'Adrien',
        "message"   : null,
        "id"        : socket.id
    };

    $('#test').on('click', function(){

        console.log('click');
        //socket.emit('test', data);
        $.post("/postest", { message: 'message posted ! ' });

    });


});
