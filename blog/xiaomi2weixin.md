今天碰到一个问题：
一个效果在小米上不能正常显示背景图
跟踪发现，是由于 CSS 压缩后的代码，小米微信浏览器不能识别导致
具体参见代码：

```css
.mask {
  background:url(../img/arrow.png) no-repeat;
  background-size:19.5px;
}
```

->

```css
.mask {
  background:url(../img/arrow.png) 0 0/19.5px no-repeat;
}
```
