(function (global, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function ($) {
            return factory($, global, global.document, global.Math);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'), global, global.document, global.Math);
    } else {
        factory(jQuery, global, global.document, global.Math);
    }
})(typeof window !== 'undefined' ? window : this, function ($, window, document, Math, undefined) {
    'use strict';

    var $window = $(window);
    var $document = $(document);

    $.fn.remoteSite = function (options) {

        var $htmlBody = $('html, body');
        var $body = $('body');


        var HASH, SOCKET, KEY;


        var RS = $.fn.remoteSite;

        var OPTIONS = $.extend({

            //navigation
            menu: false,
            prevSliderButton: false,
            nextSliderButton: false

        }, options);


        // -------------------------------------------------------------------
        // emit to server the next section binded
        RS.changeSection = function (nextIndex) {

            if (SOCKET != undefined) {
                SOCKET.emit('changeSection', nextIndex);
            }

        };


        // -------------------------------------------------------------------


        var $REMOTE_BUTTON = $('<div id="remote-button"><a href="#">Remote</a></div>');
        var $REMOTE_POPUP = $('<div id="remote-popup"><span id="remote-popup-close">close</span></div>');

        var LOCAL = getLocal();
        var LOCAL_SITES = JSON.parse(LOCAL);



        // -------------------------------------------------------------------

        // Append Popup on body
        $body.append($REMOTE_BUTTON);
        $body.append($REMOTE_POPUP);


        // Open popup
        $REMOTE_BUTTON.on('click', function () {
            $REMOTE_POPUP.css('display', 'block');
            $REMOTE_BUTTON.css('display', 'none');
        });

        // Close Popup
        $('span#remote-popup-close').on('click', function () {
            removePopup();
            $REMOTE_BUTTON.css('display', 'block');
        });



        // -------------------------------------------------------------------
        // Functions


        // -------------------------------------------------------------------
        // LocalStorage

        //get LocalStorage
        function getLocal() {
            return localStorage.remoteSites;
        }

        //set to LocalStorage
        function setLocal(sites, hash) {
            localStorage.setItem('remoteSites', JSON.stringify(saveSite(sites, hash)));
        }

        // remove from LocalStorage
        function removeLocal(hash) {

            var local = JSON.parse(localStorage.remoteSites);
            if (local.length == 1) {
                localStorage.removeItem('remoteSites');

            } else {

                for (var i = 0; i < local.length; i++) {
                    if (hash == local[i].hash) {
                        local = local.slice(i + 1);
                    }

                }
                localStorage.setItem('remoteSites', JSON.stringify(local));

            }

        }

        // Check if site exists on LocalStorage
        function isInLocal() {
            if (LOCAL_SITES != null) {
                return $.grep(LOCAL_SITES, function (e) {
                    return e.name == document.URL.split('/')[2];
                });
            } else {
                return null;
            }

        }

        // Set an object which will set on LocalStorage
        function saveSite(sites, hash, key) {

            var site = {};
            site.name = document.URL.split('/')[2];
            site.url = document.URL;
            site.hash = hash;
            site.key = key;
            sites.push(site);

            return sites;

        }

        // -------------------------------------------------------------------
        // Popup

        // Remove popup
        function removePopup(){
            $REMOTE_POPUP.empty().css('display', 'none');
        }

        // Set popup message
        function setPopup(msg) {
            $REMOTE_POPUP.append('<p>' + msg + '</p>');

        }

        // Get the secret code and put it on popup
        function getPopupCode(data) {

            var keyColor = data.split('');
            var colors = ['6C7A89', 'F2784B', 'F9BF3B', '00B16A', '87D37C', '4B77BE', '2C3E50', 'F64747', 'AEA8D3', '674172'];
            var code = '';

            for (var i = 0; i < 4; i++) {
                code += '<span class="case" style="background-color:#' + colors[keyColor[i]] + '"></span>';

            }
            $REMOTE_POPUP.append('<p>Download the app and enter the code : </p>').append(code);

        }


        // -------------------------------------------------------------------
        // Data from website

        function getData() {

            var data = {};
            data.title = $(document).find("title").text();
            data.favicon = 'favicon.png';
            data.url = document.URL;

            return data;

        }







    }


});