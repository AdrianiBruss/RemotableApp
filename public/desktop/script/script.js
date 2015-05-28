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

    var secret_key = randomString();
    var hash = CryptoJS.SHA512(secret_key);

    var socket = io('ws://192.168.20.253:3303');
    //var socket = io('ws://192.168.10.17:3303');

    console.log(hash.words[0]);

    socket.emit('setKey', hash.words[0]);


    // impements methods that receive data from server and execute them
    socket.on('testDesk', function(data){
        console.log(data);
    });

    //$('#code').append('<a href="http://192.168.10.17:9000/mobileView/' + secret_key + '">Check for mobile</a>');
    $('#code').append('<a href="http://192.168.20.253:3300/public/mobile/">Enter the code : '+secret_key+'</a>');

});
