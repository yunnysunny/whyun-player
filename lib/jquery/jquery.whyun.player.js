/**
* @lisence MIT
* @copyright yunnysunny<yunnysunny@gmail.com>
*/
(function ($) {
    function addZero(time) {
        time = parseInt(time, 10);
        return time < 10 ? '0' + time : time;
    }
    function secondsToString(seconds) {
        if (!seconds || seconds === Infinity) {
            return '00:00';
        }
        var h = Math.floor(seconds / 3600);
        var left = seconds % 3600;
        var m = Math.floor(left / 60);
        var s = seconds % 60;
        if (h === 0) {
            return addZero(m) + ':' + addZero(s);
        }
        return addZero(h) + ':'  +addZero(m) + ':' + addZero(s);
    }
    function getPageX(e) {
        if (e.pageX) {
            return e.pageX;
        }
        var event = e.originalEvent;
        if (!event.changedTouches || event.changedTouches.length === 0) {
            return 0;
        }
        var touch = event.changedTouches[event.changedTouches.length - 1];
        return touch.pageX;
    }
    function parseUrl(url) {
        try {
            url = new URL(url);
        } catch(e) {
            //
        }
        
        return url;
    }
    /**
     * 
     * @param {Object} options 
     * @param {String|Dom|jQuery} options.parent 当前播放器要展现的父层容器，可以传dom选择器、dom对象或者jquery对象
     * @param {String} options.src  当前播放器的视频播放地址
     * @param {String} options.poster  当前播放器的海报地址
     * @param {Boolean} options.debug 是否打印调试日志
     */
    function WhyunPlayer(options) {
        var parent = options.parent;
        if (typeof (parent) == 'string') {
            parent = $(parent);
        } else if (parent.nodeType === 1) {
            parent = $(parent);
        }
        this.parent = parent;
        this.src = options.src || '';
        this._videoType = options.videoType;

        this.poster = options.poster || '';
        this.width = options.width || '100%';
        this._debug = options.debug;

        this.id = ('player' + Math.random()).replace('.', '');
        this.attrs = options.attrs || {};
        var canvas = options.canvas;
        if (canvas) {
            this.canvas = canvas;
        }

        var ua = window.navigator.userAgent.toLowerCase();
        this.isIos = (/(iphone|ipad|ipod)/i).test(ua);
        this._isAndroid = (/android/i).test(ua);
        this._isMobile = this.isIos || this._isAndroid;
        this.canUseNativeFullApi = (/(qqbrowser|ucbrowser|micromessenger)/i).test(ua);
        this._shouldUseHlsJsWhenPlayM3u8 = !this._isMobile && window.Hls && Hls.isSupported();
        this._initDom();
        this._addEvent();
    }
    WhyunPlayer.prototype._debugLog = function() {
        if (this._debug) {
            // eslint-disable-next-line no-console
            console.info.apply(console, arguments);
        }
    };
    WhyunPlayer.prototype._isM3u8 = function() {
        var urlObj = parseUrl(this.src) || {};
        var path = (urlObj.pathname || '');
        var isM3u8Now = false;
        if (path.indexOf('.m3u8') !== -1) {
            isM3u8Now = true;
        }
        return isM3u8Now;
    };
    WhyunPlayer.prototype._renderVideo = function() {
        var hls = null;
        var src = this.src;
        var useHlsJs = false;
        var $video = this.$video;
        var video = this._videoDom;

        if (this._isM3u8() && this._shouldUseHlsJsWhenPlayM3u8) {
            useHlsJs = true;
            if (hls) {
                hls.destroy();
            }
            hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED,function() {
                video.play();
            });
        }
        if (!useHlsJs) {
            $video.children('source').attr('src',src);
        }
    };

    WhyunPlayer.prototype._initDom = function () {
        var $parent = this.parent;
        $parent.empty().addClass('video-container');
        var $video = $('<video><source /></video>');
        var attrs = {
            'class': '',
            id: this.id,
            perload:'auto',
            //            autoplay:true,
            'x-webkit-airplay':'allow',
            'webkit-playsinline':true,
            'x5-video-player-type' : 'h5',

            poster: this.poster
        };
        $.extend(attrs,this.attrs);

        $video.attr(attrs);//视频

        $parent.append($video);
        this._videoDom = $video.get(0);
        this.$video = $video;
        this._renderVideo();

        if (this.canvas) {
            var $canvas = $('<canvas></canvas>');
            $parent.append($canvas);
            this.$canvas = $canvas;
            //$video.css({'object-position':'0px 0px'});
        }
        

        if (this.poster) {//海报
            var $poster = $('<img />');
            $poster.attr({
                src:this.poster
            });
            $parent.append($poster);
            $video.hide();
            this.$poster = $poster;
        } else {
            this.$poster = $('none');
        }

        var $playBtn = $('<div class="play-button show"><div class="triangle"></div></div>');
        var $loadingContainer = $('<div class="uil-default-css" style="-webkit-transform:scale(0.4)"></div>');
        for (var i=0;i<12;i++) {
            var n = i * 30;
            $loadingContainer.append($('<div></div>').css({
                '-webkit-transform':'rotate('+n+'deg) translate(0,-60px)',
                transform:'rotate('+n+'deg) translate(0,-60px)'
            }));
        }

        $playBtn.append($loadingContainer);
        $parent.append($playBtn);
        this.$playBtn = $playBtn;

        var $controller = $(this._getControllerHtml());
        $parent.append($controller);
        //$controller.find('.progress-controls').width($controller.width() - $controller.find('.left-controls').width() - $controller.find('.function-controls').width());
        this.$controller = $controller;
    };
    WhyunPlayer.prototype._getControllerHtml = function() {
        //        var player = this._videoDom;
        var html = '<div class="play-controls">' +
            '<div class="left-controls">' +
                '<div class="play-control"></div>' +
            '</div>' +
            '<div class="progress-controls">' +
                '<div class="progress">' +
                    '<div class="all-len"></div>'+
                    '<div class="played"><div class="track" draggable="true"></div></div>' +
                    '<div class="loaded"></div>' +
                '</div>' +

            '</div>' +
            '<div class="function-controls">' +
                '<div class="time-wrap">' +
                    '<span class="time-passed">00:00</span><span>/</span><span class="time-total">00:00</span>' +
                '</div>' +

                '<div class="fullscreen-wrap"><div class="fullscreen-control"></div></div>' +
        //                    '<div class="sound"><a href="#sound">mute</a></div>' +
            '</div>' +
            '</div>';
        return html;
    };
    WhyunPlayer.prototype._addEvent = function () {
        var _self = this;
        var $video = this.$video;
        var player = this._videoDom;
        var $poster = _self.$poster;
        var $playBtn = _self.$playBtn;
        var $controller = _self.$controller;
        var $leftControlArea = $controller.find('.left-controls');
        var $playControl = $leftControlArea.find('.play-control');
        var $played = $controller.find('.played');
        var $progress = $played.parent();
        var $progressController = $progress.parent();
        var $track = $controller.find('.track');
        var $loaded = $controller.find('.loaded');
        var $fullscreenArea = $controller.find('.fullscreen-wrap');

        var $timePassed = $controller.find('.time-passed');
        var $timeTotal = $controller.find('.time-total');
        var INTERVAL_HIDE_CONTROLLER = 10 * 1000;
        var hideControllerTimer = null;
        var trackWidth = $track.width();
        
        var canvas =  null;
        if (this.canvas) {
            canvas = this.$canvas.get(0).getContext('2d');
            player.style['object-position']= '0px 0px';
        }

        function showAndHideController() {
            if (hideControllerTimer) {
                clearTimeout(hideControllerTimer);
            }
            $controller.show();
            hideControllerTimer = setTimeout(function() {
                $controller.hide();
            },INTERVAL_HIDE_CONTROLLER);
        }
        showAndHideController();

        function pauseShow() {
            //            $video.hide();
            //            $poster.show();
            $playBtn.removeClass('loading').show();
            $playControl.removeClass('pause');
        }
        function playShow() {
            $poster.hide();
            $playBtn.addClass('loading');
            if (!this.canvas) {
                $video.show();
            }
            
            player.play();
            $playControl.addClass('pause');
        }

        function getX(e) {
            var pageX = getPageX(e);
            if (!pageX) {
                return -1;
            }
            var parentOffsetLeft = $progress.offset().left;
            //or $(this).offset(); if you really just want the current element's offset
            var relX = pageX - parentOffsetLeft;
            _self._debugLog(e.type,relX);
            return relX;
        }

        function playToGivenPosition(e) {
            if (!player.duration) {
                return;
            }
            var relX = getX(e);
            if (relX === -1) {
                return;
            }
            var percentage = relX / $progress.width();
            player.currentTime =( player.duration * percentage);
            $played.width((percentage * 100) + '%' );
            _self._debugLog(relX, $progressController.width(), percentage, player.duration, player.currentTime);
            // player.play();
        }
        function showLoadedPosition() {
            var buffered = player.buffered;
            if (buffered && buffered.length > 0) {
                var buf = buffered.end(buffered.length - 1);
                var percentage = buf / player.duration;
                if ($progress.width() * percentage > trackWidth) {
                    $loaded.width(percentage * 100 + '%');
                } else {
                    $loaded.width(trackWidth);
                }
            }
        }
        function draw() {
            if(player.paused || player.ended) {
                return false;
            } 
            // First, draw it into the backing canvas
            canvas.drawImage(player,0,0,player.clientWidth,player.clientHeight);
            // Start over!
            setTimeout(function(){ draw(); }, 0);
        }

        $playBtn.click(function() {
            playShow();
        });
        $leftControlArea.click(function() {
            if ($playControl.hasClass('pause')) {//当前操作为暂停
                player.pause();
            } else {//当前操作为播放
                playShow();
            }
        });


        player.addEventListener('error', function() {
            _self._debugLog('emit error events');
            pauseShow();
        }, false);


        player.addEventListener('pause', function() {
            _self._debugLog('emit pause events');
            pauseShow();
        }, false);

        player.addEventListener('timeupdate', function() {
            var currentTime = player.currentTime;
            if (!currentTime) {
                return;
            }
            $poster.hide();
            $playBtn.hide();
            $playControl.addClass('pause');
            if (!_self.canvas) {
                $video.show();
            }
            

            $timePassed.text(secondsToString(currentTime));
            var percentage =( currentTime  / player.duration);

            if ($progress.width() * percentage > trackWidth) {
                $played.width((percentage * 100) + '%');
            } else {
                $played.width(trackWidth);
            }
        }, false);
        player.addEventListener('loadedmetadata',function() {_self._debugLog(player.videoWidth);
            if (player.duration) {
                $timeTotal.text(secondsToString(player.duration));
            }
        });
        player.addEventListener('durationchange', function() {
            if (player.duration) {
                $timeTotal.text(secondsToString(player.duration));
            }
        }, false);
        player.addEventListener('loadeddata',function() {
            showLoadedPosition();
        },false);
        player.addEventListener('canplaythrough',function() {
            showLoadedPosition();
        },false);
        player.addEventListener('progress',function() {
            showLoadedPosition();
        });
        if (this.canvas) {
            player.addEventListener('play',function() {
                draw();
            },false);
        }
        
        $progress.click(function(e){//进度条点击
            playToGivenPosition(e);
        });
        $progress.on('mousedown touchstart',function(e) {
            showAndHideController();
            e.preventDefault();
        });
        $progress.on('mouseup touchend',function(e) {
            playToGivenPosition(e);
        });
        this.parent.on('mouseenter touchstart',function() {//触摸播放器，显示进度条
            showAndHideController();_self._debugLog('player touch');
        });

        $(window).resize(function () {
        });
        $fullscreenArea.click(function() {
            _self._toggleFullScreen();
        });
    };
    WhyunPlayer.prototype._toggleFullScreen = function () {
        if (this.canUseNativeFullApi) {
            this._debugLog('use native full api');
            var elem = this._videoDom;

            if (elem.requestFullscreen) {
                this._debugLog('requestFullscreen');
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                this._debugLog('requestFullscreen2');
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                this._debugLog('requestFullscreen3');
                elem.webkitRequestFullscreen();
            } else if (elem.webkitEnterFullscreen) {
                this._debugLog('webkitEnterFullscreen');
                elem.webkitEnterFullscreen();
            } else {
                this._debugLog('not support full api');
            }
            return;
        }
        var $html = $('html');this._debugLog('use custom full api');
        $html.toggleClass('fullscreen');
    };

    /**
     * @param {String} src 要设置的视频播放地址
     */
    WhyunPlayer.prototype.setSrc = function (src) {
        this.src = src;
        var player = this._videoDom;
        player.pause();
        this.$playBtn.addClass('loading').show();
        this.$video.children('source').attr('src', src);
        player.currentTime = 0;
        this._renderVideo();
        return this;
    };
    /**
     * @param {String} poster 要设置的海报地址
     */
    WhyunPlayer.prototype.setPoster = function(poster) {
        this.$poster.attr('src', poster);
        this.$video.attr('poster', poster);
        return this;
    };
    $.whyun = $.extend($.whyun,{});
    $.whyun.player = function(option) {
        return new WhyunPlayer(option);
    };
})(jQuery);