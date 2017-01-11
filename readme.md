# whyun plyaer
一个开源的html5的播放器，使用方式很简单。使用自定义播放进度条来统一各个平台上播放器样式。

## 示例
该播放器需要依赖于jquery，所以在使用前要引入jquery，同时需要引入whyun player的css和js文件，具体代码可以参见[demo文件](https://github.com/yunnysunny/whyun-player/blob/master/demo.html)。


## API

### $.whyun.player(options)
**参数**

- options.parent {String|Dom|jQuery} 当前播放器要展现的父层容器，可以传dom选择器、dom对象或者jquery对象
- options.src {String} 当前播放器的视频播放地址
- options.poster {String} 当前播放器的海报地址

## 维护者
[yunnysunny](https://github.com/yunnysunny)

## License

MIT