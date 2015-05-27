$(function(){
    'use strict';

    var secret_key = "AFK9";

    var socket = io('ws://192.168.10.17:3303');

    socket.emit('setKey', secret_key);

    socket.on('scroll', function(data){

        console.log(data);

    });

    $('#code').append('<a href="http://192.168.10.17:9000/mobileView/' + secret_key + '">Check for mobile</a>');

});
