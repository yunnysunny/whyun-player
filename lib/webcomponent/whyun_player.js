(function () {
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
        return addZero(h) + ':' + addZero(m) + ':' + addZero(s);
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
        } catch (e) {
            //
        }

        return url;
    }
    function addListenerMulti(element, eventNames, listener) {
        var events = eventNames.split(' ');
        for (var i = 0, iLen = events.length; i < iLen; i++) {
            element.addEventListener(events[i], listener, false);
        }
    }
    function setWidth(dom, width) {
        var value = '';
        if (typeof (width) === 'number') {
            value = width + 'px';
        } else if (typeof (width) === 'string') {
            if (isNaN(Number(width))) {
                value = width;
            } else {
                value = width + 'px';
            }
        } else {
            // eslint-disable-next-line no-console
            console.error('错误的宽度', width, dom);
        }
        return dom.style.width = value;
    }
    function getStyle(el, styleProp) {
        var defaultView = (el.ownerDocument || document).defaultView;
        // W3C standard way:
        // sanitize property name to css notation
        // (hypen separated words eg. font-Size)
        styleProp = styleProp.replace(/([A-Z])/g, '-$1').toLowerCase();
        return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
       
    }
    HTMLElement.prototype.show = function (display) {
        this.style.display = display || '';
    };
    HTMLElement.prototype.hide = function () {
        this.style.display = 'none';
    };
    const template = `
    <link rel="stylesheet" type="text/css" href="../../css/jquery.ohwit.player.css" />
    <div class="video-container">
        
        <video x-webkit-airplay webkit-playsinline x5-video-player-type="h5" perload="auto">
            <source />
        </video>
        <div class="play-button show" id="js-play-button">
            <div class="triangle"></div>
            <div class="uil-default-css" style="transform:scale(0.4)"></div>
        </div>
        <div class="play-controls" id="js-play-controls">
            <div class="left-controls">
                <div class="play-control"></div>
            </div>
            <div class="progress-controls">
                <div class="progress">
                    <div class="all-len"></div>
                    <div class="played"><div class="track" draggable="true"></div></div>
                    <div class="loaded"></div>
                </div>

            </div>
            <div class="function-controls">
                <div class="time-wrap">
                    <span class="time-passed">00:00</span><span>/</span><span class="time-total">00:00</span>
                </div>
                <div class="fullscreen-wrap">
                    <div class="fullscreen-control"></div>
                </div>
                <!--div class="sound"><a href="#sound">mute</a></div-->
            </div>
        </div>
    </div>
    `;
    /**
     * @class WhyunPlayer
     * @extends HTMLElement
     */
    class WhyunPlayer extends HTMLElement {
        constructor() {
            super();

            const root = this.attachShadow({ mode: 'open'/*, delegatesFocus: true*/ });
            root.innerHTML = template;
            this._root = root;
            this.src = this.getAttribute('src');
            this.poster = this.getAttribute('poster') || '';
            this._debug = this.hasAttribute('debug') || false;

            var ua = window.navigator.userAgent.toLowerCase();
            var _isIos = (/(iphone|ipad|ipod)/i).test(ua);
            var _isAndroid = (/android/i).test(ua);
            this._isMobile = _isIos || _isAndroid;
            this._canUseNativeFullApi = (/(qqbrowser|ucbrowser|micromessenger)/i).test(ua);
            this._shouldUseHlsJsWhenPlayM3u8 = !this._isMobile && window.Hls && Hls.isSupported();
            this._hls = null;
        }

        _isM3u8(link) {
            var urlObj = parseUrl(link) || {};
            var path = (urlObj.pathname || '');
            var isM3u8Now = false;
            if (path.indexOf('.m3u8') !== -1) {
                isM3u8Now = true;
            }
            return isM3u8Now;
        }
        /**
         * @param {String} link
         */
        set src(link) {
            if (this._isM3u8(link) && this._shouldUseHlsJsWhenPlayM3u8) {
                let hls = this._hls;
                if (hls) {
                    hls.destroy();
                }
                this._hls = hls = new Hls();
                hls.loadSource(link);
                const video = this._root.querySelector('video');
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED,function() {
                    video.play();
                });
            } else {
                this._root.querySelector('source').setAttribute('src', link);
            }

            
        }
        /**
         * @param {String} link
         */
        set poster(link) {
            const video = this._root.querySelector('video');
            if (!link) {
                return video.removeAttribute('poster');
            }
            video.setAttribute('poster', link);
        }

        connectedCallback() {
            //元素每次插入到 DOM 时都会调用。用于运行安装代码，例如获取资源或渲染。一般来说，您应将工作延迟至合适时机执行。
            // console.log('connectedCallback');
            const _this = this;
            this._root.querySelector('link').addEventListener('load',function() {
                _this._addEvent();
            }, false);
            
        }
        static get observedAttributes() {
            return ['src', 'poster'];
        }
        
        attributeChangedCallback(attrName, oldVal, newVal) {
            //如果有人对您的元素调用 el.setAttribute(...)，浏览器将立即调用 attributeChangedCallback()。
            if (attrName === 'src') {
                this.src = newVal;
            } else if (attrName === 'poster') {
                this.poster = newVal;
            }
            this._debugLog(attrName, oldVal, newVal);
        }
        disconnectedCallback() {
            // 从 DOM 中移除元素（例如用户调用 el.remove()）后，您会立即收到 disconnectedCallback()
        }
        _debugLog() {
            if (this._debug) {
                // eslint-disable-next-line no-console
                console.info.apply(console, arguments);
            }
        }
        _addEvent() {
            var _self = this;
            var root = this._root;
            var player = root.querySelector('video');
            // var $poster = _self.$poster;
            var playBtn = root.querySelector('#js-play-button');
            var $controller = root.querySelector('#js-play-controls');
            var $leftControlArea = $controller.querySelector('.left-controls');
            var $playControl = $leftControlArea.querySelector('.play-control');
            var $played = $controller.querySelector('.played');
            var $progress = $controller.querySelector('.progress');
            // var $progressController = $controller.querySelector('.progress-controls');
            var $track = $controller.querySelector('.track');
            var $loaded = $controller.querySelector('.loaded');
            var $fullscreenArea = $controller.querySelector('.fullscreen-wrap');

            var $timePassed = $controller.querySelector('.time-passed');
            var $timeTotal = $controller.querySelector('.time-total');
            var INTERVAL_HIDE_CONTROLLER = 10 * 1000;
            var hideControllerTimer = null;
            var trackWidth = parseInt(getStyle($track, 'width'), 10);
            var progressWidth = $progress.offsetWidth;
            // var canvas =  null;
            // if (this.canvas) {
            //     canvas = this.$canvas.get(0).getContext('2d');
            //     player.style['object-position']= '0px 0px';
            // }

            function showAndHideController() {
                if (hideControllerTimer) {
                    clearTimeout(hideControllerTimer);
                }
                $controller.style.visibility = 'visible';
                hideControllerTimer = setTimeout(function () {
                    $controller.style.visibility = 'hidden';
                }, INTERVAL_HIDE_CONTROLLER);
            }
            showAndHideController();

            function pauseShow() {
                //            $video.hide();
                //            $poster.show();
                playBtn.classList.remove('loading'); 
                playBtn.show();
                $playControl.classList.remove('pause');
            }
            function playShow() {
                // $poster.hide();
                playBtn.classList.add('loading');
                // if (!this.canvas) {
                //     $video.show();
                // }

                player.play();
                $playControl.classList.add('pause');
            }

            function getX(e) {
                var pageX = getPageX(e);
                if (!pageX) {
                    return -1;
                }
                var parentOffsetLeft = $progress.offsetLeft;
                //or $(this).offset(); if you really just want the current element's offset
                var relX = pageX - parentOffsetLeft;
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
                var percentage = relX / progressWidth;
                player.currentTime = (player.duration * percentage);
                setWidth($played, (percentage * 100) + '%');
                _self._debugLog('playToGivenPosition', relX, progressWidth, percentage, player.duration, player.currentTime);
                // player.play();
            }
            function showLoadedPosition() {
                const buffered = player.buffered;
                if (buffered && buffered.length > 0) {
                    var buf = buffered.end(buffered.length - 1);
                    var percentage = buf / player.duration;
                    if (progressWidth * percentage > trackWidth) {
                        setWidth($loaded, percentage * 100 + '%');
                    }
                }
            }
            // function draw() {
            //     if(player.paused || player.ended) {
            //         return false;
            //     } 
            //     // First, draw it into the backing canvas
            //     canvas.drawImage(player,0,0,player.clientWidth,player.clientHeight);
            //     // Start over!
            //     setTimeout(function(){ draw(); }, 0);
            // }

            playBtn.addEventListener('click', function () {
                playShow();
            }, false);
            $leftControlArea.addEventListener('click', function () {
                if ($playControl.classList.contains('pause')) {//当前操作为暂停
                    player.pause();
                } else {//当前操作为播放
                    playShow();
                }
            }, false);


            player.addEventListener('error', function () {
                _self._debugLog('emit error events');
                pauseShow();
            }, false);


            player.addEventListener('pause', function () {
                _self._debugLog('emit pause events');
                pauseShow();
            }, false);

            player.addEventListener('timeupdate', function () {
                var currentTime = player.currentTime;
                if (!currentTime) {
                    return;
                }
                // $poster.hide();
                playBtn.hide();
                $playControl.classList.add('pause');
                // if (!_self.canvas) {
                //     $video.show();
                // }


                $timePassed.innerText = (secondsToString(currentTime));
                var percentage = (currentTime / player.duration);
                if (progressWidth * percentage > trackWidth) {
                    setWidth($played, (percentage * 100) + '%');
                } else {
                    setWidth($played, trackWidth);
                }
            }, false);
            player.addEventListener('loadedmetadata', function () {
                if (player.duration) {
                    $timeTotal.innerText = (secondsToString(player.duration));
                }
            });
            player.addEventListener('durationchange', function () {
                if (player.duration) {
                    $timeTotal.innerText = (secondsToString(player.duration));
                }
            }, false);
            player.addEventListener('loadeddata', function () {
                showLoadedPosition();
            }, false);
            player.addEventListener('canplaythrough', function () {
                showLoadedPosition();
            }, false);
            player.addEventListener('progress', function () {
                showLoadedPosition();
            });
            // if (this.canvas) {
            //     player.addEventListener('play',function() {
            //         draw();
            //     },false);
            // }

            $progress.addEventListener('click', function (e) {//进度条点击
                playToGivenPosition(e);
            });
            addListenerMulti($progress, 'mousedown touchstart', function (e) {
                showAndHideController();
                e.preventDefault();
            });
            addListenerMulti($progress, 'mouseup touchend', function (e) {
                playToGivenPosition(e);
            });
            addListenerMulti(this, 'mouseenter touchstart', function () {//触摸播放器，显示进度条
                showAndHideController(); _self._debugLog('player touch');
            });

            window.addEventListener('resize',function() {
                progressWidth = $progress.offsetWidth;
            }, false);
            $fullscreenArea.addEventListener('click', function () {
                _self._toggleFullScreen();
            }, false);
        }
    }
    customElements.define('whyun-player', WhyunPlayer);
})();