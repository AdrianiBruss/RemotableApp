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
    var BASE_URL = $(location).attr('href').split('#')[0];

    $.fn.remoteSite = function (options) {

        var $htmlBody = $('html, body');
        var $body = $('body');

        var HASH, SOCKET, KEY, WEBSITES, CONNECTION_STATE = false;

        // sections
        var SECTION_DEFAULT_NAME = '.section';
        var FN_SECTION_SELECTOR = '.fp-section';

        // text buttons
        var TEXT_BUTTONS = '.remote-text-item';

        // video items
        var VIDEO_ITEMS = '.remote-video-item';

        // images items
        var IMG_ITEMS = '.remote-element-link';

        // infos item
        var INFO_ITEMS = '.remote-info-item';

        var RS = $.fn.remoteSite;

        var OPTIONS = $.extend({

            //navigation
            menu: false, // menuId
            sliderDraggable: [],
            sectionsName: false,
            slideShowIds: [],
            swipeSection: function(){},
            changeOrientation: function(){},
            galleryRemote: function(){},
            sliderDraggableRemote: function(){},
            videoRemote: function(){},
            buttonRemote: function(){}

        }, options);


        // -------------------------------------------------------------------
        // emit to server the next section binded
        RS.changeSection = function (nextIndex) {

            if (SOCKET != undefined) {
                SOCKET.emit('changeSection', nextIndex);
            }

        };


        // -------------------------------------------------------------------


        var $REMOTE_BUTTON = $('<div id="remote-button"></div>');
        var $REMOTE_POPUP = $('<div id="remote-overlay"><div id="remote-popup"><span id="remote-popup-close"></span><div id="popup-container"></div></div></div>');

        var LOCAL = getLocal();
        var LOCAL_SITES = LOCAL ? JSON.parse(LOCAL) : '';

        // -------------------------------------------------------------------

        // Append Popup on body
        $body.append($REMOTE_BUTTON);
        $body.append($REMOTE_POPUP);


        // Open popup
        $REMOTE_BUTTON.on('click', function () {
            openPopup();
            if (!CONNECTION_STATE){
                init();
            }else{
                setPopup('You\'re already connected');
            }
        });

        // Close Popup
        $('span#remote-popup-close').on('click', function () {
            closePopup();
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
                    return e.name == document.URL.split('#')[0];
                });
            } else {
                return null;
            }

        }

        // Set an object which will set on LocalStorage
        function saveSite(sites, hash, key) {

            var site = {};
            site.name = document.URL.split('#')[0];
            site.url = document.URL;
            site.hash = hash;
            site.key = key;
            sites.push(site);

            return sites;

        }

        // -------------------------------------------------------------------
        // Popup

        function openPopup() {
            $REMOTE_POPUP.css('display', 'block');
            $REMOTE_BUTTON.css('display', 'none');
        }

        function closePopup() {
            removePopup();
            $REMOTE_BUTTON.css('display', 'block');
        }

        // Remove popup
        function removePopup() {
            $REMOTE_POPUP.find('#popup-container').empty();
            $REMOTE_POPUP.css('display', 'none');
        }

        // Set popup message
        function setPopup(msg) {
            $REMOTE_POPUP.find('#popup-container').append('<p>' + msg + '</p>');
            openPopup();
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

        // Return title, favicon and URL from website
        function getData() {

            var data = {};
            data.title = $(document).find("title").text();
            data.favicon = 'favicon.png';
            data.name = document.URL.split('#')[0];

            return data;

        }


        function getContext() {

            var data = {};

            var $text_links = $(TEXT_BUTTONS);
            var $video_items = $(VIDEO_ITEMS);
            var $img_items = $(IMG_ITEMS);
            var gallery_items = OPTIONS.slideShowIds;
            var slider_draggable = OPTIONS.sliderDraggable;
            var $menuItems = $(OPTIONS.menu).find('li');
            var $textItems = $(INFO_ITEMS);
            var menu = [];

            // menu
            $.each($menuItems, function (key, value) {
                var link = {};
                link.url = BASE_URL + $menuItems.eq(key).find('a').attr('href');
                link.name = link.url.split('#')[1];
                //link.name = $menuItems.eq(key).find('a').html();
                menu.push(link);

            });

            data.menu = menu;
            data.nbSections = $(OPTIONS.sectionsName).length;

            data.layout = [];
            for (var item = 0; item < data.nbSections; item++) {
                data.layout.push([]);
            }


            // Galleries
            for (var i = 0; i < gallery_items.length; i++) {

                var imgGallery = {};
                imgGallery.type = 'Gallery';
                imgGallery.text = 'Landscape to see the gallery';
                imgGallery.rotate = 'true';
                imgGallery.section = $('' + gallery_items[i] + '').closest(OPTIONS.sectionsName).index() + 1;
                data.layout[imgGallery.section - 1].push(imgGallery);

            }


            // Text buttons
            $.each($text_links, function (key, value) {

                var textLinks = {};
                textLinks.type = 'link';
                textLinks.text = $text_links.eq(key).text();
                textLinks.url = $text_links.eq(key).attr('href');
                textLinks.rotate = 'false';
                textLinks.section = $text_links.eq(key).closest(OPTIONS.sectionsName).index() + 1;
                data.layout[textLinks.section - 1].push(textLinks);

            });


            // Videos
            $.each($video_items, function (key, value) {

                var videoLinks = {};
                videoLinks.type = 'video';
                videoLinks.text = 'landscape to play tha video';
                videoLinks.rotate = 'true';
                videoLinks.section = $video_items.eq(key).closest(OPTIONS.sectionsName).index() + 1;
                data.layout[videoLinks.section - 1].push(videoLinks);

            });


            // $slider_draggable
            for (var j = 0; j < slider_draggable.length; j++) {

                var sliderDraggable = {};
                sliderDraggable.type = 'DraggableSlider';
                sliderDraggable.text = 'landscape to drag the slider';
                sliderDraggable.rotate = 'true';
                sliderDraggable.section = $('' + slider_draggable[j] + '').closest(OPTIONS.sectionsName).index() + 1;
                data.layout[sliderDraggable.section - 1].push(sliderDraggable);

            }

            // Images
            $.each($img_items, function (key, value) {

                var imgLinks = {};
                imgLinks.type = 'link';
                imgLinks.text = $img_items.eq(key).text();
                imgLinks.rotate = 'false';
                imgLinks.section = $img_items.eq(key).closest(OPTIONS.sectionsName).index() + 1;
                data.layout[imgLinks.section - 1].push(imgLinks);

            });

            $.each($textItems, function (key, value) {

                var textInfo = {};
                textInfo.type = 'info';
                textInfo.text = $textItems.eq(key).attr('data-remote-text');
                textInfo.rotate = 'false';
                textInfo.section = $textItems.eq(key).closest(OPTIONS.sectionsName).index() + 1;
                data.layout[textInfo.section - 1].push(textInfo);

            });

            return data;


        }

        // -------------------------------------------------------------------
        // Connection to server

        function setConnection(data) {

            SOCKET = io('ws://remote-cloudbruss.rhcloud.com:8000');
            //socket = io('ws://192.168.20.253:3303');
            //socket = io('ws://192.168.10.16:3303');
            //socket = io('ws://192.168.10.17:3303');

            // --------------------------------------------------


            // -------------------------
            // Events sent by the mobile
            // -------------------------

            // --------------------------------------------------
            // Waiting for mobile connection

            SOCKET.on('mobileConnectedForDesktop', function (data) {

                if (data.data == "ok") {

                    CONNECTION_STATE = true;
                    closePopup();
                    $REMOTE_BUTTON.css('display', 'none');

                    $.fn.fullpage.moveTo(1);

                    // storage on localStorage
                    if (LOCAL == null) {
                        var sites = [];
                        setLocal(sites, HASH, KEY);
                    } else {
                        var local_site = isInLocal();
                        if (local_site.length == 0) {
                            // save site
                            setLocal(LOCAL_SITES, HASH, KEY);
                        }

                    }
                }
            });

            // --------------------------------------------------
            // Change section button or menu

            SOCKET.on('changeLinkDesk', function (data) {
                $(location).attr('href', data.link);
            });

            // --------------------------------------------------
            // Swipe mobile
            SOCKET.on('swipeDesk', function (data) {

                // return the direction the mobile swiped
                // up, down, left, right
                OPTIONS.swipeSection.call(data);

            });

            // --------------------------------------------------
            // Delete site from mobile
            SOCKET.on('deleteMobileForDesktop', function (data) {
                removeLocal(data.data.hash);
            });

            // --------------------------------------------------
            // Delete site from mobile
            SOCKET.on('changeOrientationDesk', function (data) {
                OPTIONS.changeOrientation.call(data);
            });

            // --------------------------------------------------
            // Delete site from mobile
            SOCKET.on('galleryRemoteDesk', function (data) {
                OPTIONS.galleryRemote.call(data);
            });

            // --------------------------------------------------
            // Delete site from mobile
            SOCKET.on('videoRemoteDesk', function (data) {
                OPTIONS.videoRemote.call(data);
            });

            // --------------------------------------------------
            // Delete site from mobile
            SOCKET.on('sliderDraggableDesk', function (data) {
                OPTIONS.sliderDraggableRemote.call(data);
            });
            // --------------------------------------------------

            // --------------------------------------------------
            // Delete site from mobile
            SOCKET.on('buttonRemoteDesk', function (data) {
                OPTIONS.buttonRemote.call(data);
            });
            // --------------------------------------------------

            // -------------------------
            // Events sent the library
            // -------------------------

            // --------------------------------------------------
            // Send a emit to server to get an hashed key for pairing
            SOCKET.emit('desktopConnection', data, function (data) {

                // Site code 45 == site deleted from mobile app
                if (data.code == 45) {
                    // remove from LocalStorage
                    removeLocal(data.hash);
                }

                // Display messages info into popup
                setPopup(data.infos);

                if (data.datas) {

                    HASH = data.datas.hash;
                    KEY = data.datas.key;
                    getPopupCode(data.datas.key);
                }

            });

            // --------------------------------------------------
            // Send an emit to post data to server
            SOCKET.emit('datasDesktop', data, function (data) {
            });

        }


        // -------------------------------------------------------------------
        // init function

        function init() {

            if (LOCAL == null) {

                var data = getData();
                $.extend(data, getContext());

                setConnection(data);

            } else {

                var result = isInLocal();
                var dataContext = {};

                if (result.length == 1) {
                    console.log('already connected with token ' + result[0].hash);

                    dataContext.hash = result[0].hash;
                    $.extend(dataContext, getContext());

                    setConnection(dataContext);

                } else {

                    dataContext.hash = HASH;
                    $.extend(dataContext, getContext());

                    setConnection(dataContext);


                }


            }

        }


    }


});