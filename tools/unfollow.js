void function () {

	/**
	 * 专杀微博恶俗营销
	 * 使用步骤：
	 *	1 将本文件内容复制到剪贴板
	 *  2 使用Chrome在网页中打开新浪微博，确定在登陆状态
	 *  3 打开控制台（Windows:F12，Mac:alt+command+J）
	 *  4 将剪贴板的内容粘贴到控制台输入框中，回车执行 
	 * @author http://weibo.com/zswang
	 */

    /**
     * 格式化函数
     * @param {String} template 模板
     * @param {Object} json 数据项
     */
    function format(template, json){
        return template.replace(/#\{(.*?)\}/g, function(all, key){
            return json && (key in json) ? json[key] : "";
        });
    }

    /**
     * 执行http请求
     * @param {String} url 链接地址
     * @param {String} data 请求的数据,如果存在则是POST方法，否则是GET
     * @param {Functions} callback(err, text) 回调
     */
    function requestHttp(url, data, callback) {
        var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState != 4) {
                return;
            }
            var error = null, text = null;
            if (xmlhttp.status == 200) {
                text = xmlhttp.responseText;
            } else if (parseInt(xmlhttp.status) > 300) {
                error = xmlhttp.status;
            } else {
                return;
            }
            if (callback) {
                callback(error, text);
            }
        }
        xmlhttp.open(data != null ? "POST" : "GET", url, true);
        if (data != null) {
        	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // 表单方式提交
        }
        xmlhttp.send(data);
    }

    var configs = {
        page_id: "1005051654592030",
        time: +new Date
    };

    // 获取我关注的人中有哪些人关注了TA
    var followUrl = format("http://weibo.com/p/#{page_id}/follow?relate=second_follow&mod=secondfollowmore&_t=FM_#{time}", configs);
    var items = [];
    requestHttp(followUrl, null, function(err, text) {
        if (err) {
            console.log("err: %s", err);
            return;
        }
        // 找到关注人列表内容
        text.replace(/<ul class=\\"cnfList\\"[^>]*>([\s\S]*?)<\\\/ul>/, function(all, context) {
            context.replace(/<li\s+class=\\"clearfix S_line1\\"\s+action-type=\\"itemClick\\"\s+action-data=\\"uid=(\d+)&fnick=([^&=]*)&sex=(\w+)\\"[^>]*>/g, 
                function(all, uid, fnick, sex) {
                	items.push({
                		uid: uid,
                		fnick: fnick,
                		sex: sex
                	});
                }
            );
        });
        
        //items = [{ uid: "<马甲ID>", fnick: "马甲" }]; // debug

		unfollow();
	});

	var msg = [];
    var currIndex = 0;
	var unfollowDataTemplate = "\
refer_sort=relationManage&\
location=myfollow&\
refer_flag=unfollow&\
uid=#{uid}&\
_t=0";

	/**
	 * 取消关注
	 */
    function unfollow() {
    	var item = items[currIndex++];
    	if (!item) {
    		msg.push('取消关注完成.');
    		alert(msg.join('\n'));
    		return;
    	}
    	requestHttp(
    		format("http://weibo.com/aj/f/unfollow?_wv=5&__rnd=#{0}", [+new Date]),
    		format(unfollowDataTemplate, item),
    		function(err, text) {
    			if (/\b100000\b/.test(text)) {
    				msg.push(format('取消{fnick}关注成功.', item));
    			} else {
    				msg.push(format('取消{fnick}关注失败.', item));
    			}
    			unfollow();
    		}
		);
    }

}();