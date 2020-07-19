# whyplyaer
一个开源的html5的播放器，使用方式很简单。使用自定义播放进度条来统一各个平台上播放器样式。播放器以16：9的比例显示，横竖屏下都保持此比例。

本项目包含两种实现方式，一种使用 jQuery 实现，一种使用 [web components v1](https://developers.google.com/web/fundamentals/web-components/customelements) 实现(Chrome 需要 54+)。

## 示例

### 使用 jQuery
在使用前要引入 jQuery，同时需要引入 whyun player 的 css 和 js 文件，具体代码可以参见[demo文件](https://github.com/yunnysunny/whyun-player/blob/master/demo/jquery/demo.html)。效果参见 [在线演示地址](http://silian.whyun.com/whyun-player/demo.html)。
### 使用 web components
直接引用 whyun player 的 js 代码即可，其内部会引用所需的 css 文件，具体代码可以参见[这里](https://github.com/yunnysunny/whyun-player/blob/master/demo/webcomponent/demo.html)。

> 不管使用以上哪种方式，如果想支持 PC 上播放 m3u8 ，手动引入 [hls.js](https://github.com/video-dev/hls.js/) 即可。

## API

### jQuery API

#### $.whyun.player(options)

**参数**

- options.parent {String|Dom|jQuery} 当前播放器要展现的父层容器，可以传 dom 选择器、dom 对象或者 jquery 对象
- options.src {String} 当前播放器的视频播放地址
- options.poster {String} 当前播放器的海报地址
- options.debug {Boolean} 是否打印调试日志

#### $.whyun.player.setSrc

**参数**

- src {String} 要更换的播放地址


#### $.whyun.player.setPoster

- poster {String} 要更换的海报地址

### web components API

```html
<whyun-player debug src="" poster=""></whyun-player>
```
由于是使用 web components ，所以属性值可以直接在 DOM 节点上赋值，手动修改节点属性或者在 js 对象中给 `src` `poster` 赋值，都可以立即生效。例如有如下代码：
```html
<whyun-player debug src="原始播放地址" poster="" id="myplayer"></whyun-player>
```
```javascript
document.getElementById('myplayer').src = '要更改的播放地址';//调用完之后可以立即换播放地址
```

## 维护者
[yunnysunny](https://github.com/yunnysunny)

## License

MIT