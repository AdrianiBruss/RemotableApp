$(function(){
    'use strict';

    var secret_key = "AFK9";

    var socket = io('ws://192.168.20.253:3303');
    //var socket = io('ws://192.168.10.17:3303');

    socket.emit('setKey', secret_key);


    // impements methods that receive data from server and execute them
    socket.on('testDesk', function(data){
        console.log(data);
    });

    //$('#code').append('<a href="http://192.168.10.17:9000/mobileView/' + secret_key + '">Check for mobile</a>');
    $('#code').append('<a href="http://192.168.20.253:9000/mobileView/' + secret_key + '">Check for mobile</a>');

});
