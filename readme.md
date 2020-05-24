# whyplyaer
一个开源的html5的播放器，使用方式很简单。使用自定义播放进度条来统一各个平台上播放器样式。播放器以16：9的比例显示，横竖屏下都保持此比例。

## 示例
该播放器需要依赖于jquery，所以在使用前要引入jquery，同时需要引入whyun player的css和js文件，具体代码可以参见[demo文件](https://github.com/yunnysunny/whyun-player/blob/master/demo.html)。效果参见 [在线演示地址](http://silian.whyun.com/whyun-player/demo.html)。


## API

### $.whyun.player(options)
**参数**

- options.parent {String|Dom|jQuery} 当前播放器要展现的父层容器，可以传 dom 选择器、dom 对象或者 jquery 对象
- options.src {String} 当前播放器的视频播放地址
- options.poster {String} 当前播放器的海报地址
- options.debug {Boolean} 是否打印调试日志

### PC 上播放 m3u8

默认情况下，在 PC 上无法播放 m3u8 文件，可以引入 [Hls.js](https://github.com/video-dev/hls.js) 来解决这个问题。只要在引入 whyplayer 之前引入 Hls.js 即可，具体可以参见 [demo文件](https://github.com/yunnysunny/whyun-player/blob/master/demo.html)。

## 维护者
[yunnysunny](https://github.com/yunnysunny)

## License

MIT