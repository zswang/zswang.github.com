## 黑魔法

### BAE 手动发布代码

```javascript
void function() {
  var appid = String($('.bae-list-body li').attr('id')).replace(/^bae_item_/, '');
  $.get("http://developer.baidu.com/rest/2.0/bae/bce/app/republish?callback=?",
    {
      bae_appid: appid,
      access_token: dev.access_token
    },
    function(data) {
      console.log(JSON.stringify(data));
    }
  );
}();
```
