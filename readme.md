# whyun plyaer
一个开源的html5的播放器，使用方式很简单：

```javascript
<div id="vc"></div>

<script type="text/javascript" src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.whyun.player.js"></script>
<script>
  var player = $.whyun.player({
        parent:$('#vc'),
        src:'http://video.webmfiles.org/elephants-dream.webm',
        poster:'https://images.pexels.com/photos/241820/pexels-photo-241820.jpeg?w=940&h=650&auto=compress&cs=tinysrgb'
  });
  $('#changeBtn').click(function() {
      player.setSrc($('#videoSrc').val());
  });
</script>

```