var XT = {};

(function(my){
	if ($.browser.msie && $.browser.version == "6.0") {//解决ie6下面图片闪烁问题，参考文案：http://blog.163.com/service80@126/blog/static/16193603020103982751579/
		try {
			document.execCommand("BackgroundImageCache", !1, !0);
		} catch (err) {}
	}

	(function(){//使得console.log不报错。
	    if (!window.console) {
	        var dummy = function(){};
	        window.console = {
	            log: dummy,
	            info: dummy,
	            debug: dummy,
	            profile: dummy
	        };
	    }
	    //in case ie8, ie8 only has console.log 
	    'info debug profile dir'.split(' ').forEach(function(item){
	       if(!console[item]){
	           console[item] = console.log;
	       }
	    });
	})();

	$.extend(my, {
		/**
		 * 注册命名空间
		 * <code>
		 * XT.nameSpace('util.Cookie') 注册一个cookie空间到XT内
		 * </code>
		 * @param name {String} 模块名称
		 */
		 //注册命名空间 
		nameSpace: function(name) {
			var _LIST = name.split("."),
				_MOD = this

			for (var i = 0; i < _LIST.length; i++) {
				_MOD[_LIST[i]] = _MOD[_LIST[i]] || {};
				_MOD = _MOD[_LIST[i]];
			}
			return _MOD;
		}
	});

})(XT);

(function(my){

	/**
		* 将url转化成为一个对象
		* <code>
		* XT.util.queryurl(url)
		* </code>
		* @param url {String} 为网址URL（必填）
		* return 和window.location同样的参数
		* 
	**/
	function classObj(url){
		var a =  document.createElement('a');
	    a.href = url;
	    return {
	        source: url,
	        protocol: a.protocol.replace(':',''),
	        host: a.hostname,
	        port: a.port,
	        query: a.search,
	        params: (function(){
	            var ret = {},
	                seg = a.search.replace(/^\?/,'').split('&'),
	                len = seg.length, i = 0, s;
	            for (;i<len;i++) {
	                if (!seg[i]) { continue; }
	                s = seg[i].split('=');
	                ret[s[0]] = s[1];
	            }
	            return ret;
	        })(),
	        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
	        hash: a.hash.replace('#',''),
	        path: a.pathname.replace(/^([^\/])/,'/$1'),
	        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
	        segments: a.pathname.replace(/^\//,'').split('/')
	    };
	}

	my.nameSpace('util').queryurl = classObj;//注册命名空间
	

})(XT);

(function(my){

	var classObj = {
		getCookie: function(a) {
			a = document.cookie.match(RegExp("(^| )" + a + "=([^;]+?)(;|$)"));
			if (a != null) return unescape(a[2]);
			return "";
		},
		setCookie: function(name, value, options) {
			function isNonEmptyString(s) {
		        return typeof s === 'string' && s !== '';
		    }
	        if (!isNonEmptyString(name)) {
	            throw new TypeError('Cookie name must be a non-empty string');
	        }
	        options = options || {};

	        var expires = options['expires'];
	        var domain = options['domain'];
	        var path = options['path'];
	        value = escape(String(value));

	        var text = name + '=' + value;

	        // expires
	        var date = expires;
	        if (typeof date === 'number') {
	            date = new Date();
	            date.setDate(date.getDate() + expires);
	        }
	        if (date instanceof Date) {
	            text += '; expires=' + date.toUTCString();
	        }

	        // domain
	        if (isNonEmptyString(domain)) {
	            text += '; domain=' + domain;
	        }

	        // path
	        if (isNonEmptyString(path)) {
	            text += '; path=' + path;
	        }

	        // secure
	        if (options['secure']) {
	            text += '; secure';
	        }

	        document.cookie = text;
	        return text;
		},
		delCookie: function(name) { //为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
			var date = new Date();
			date.setTime(date.getTime() - 10000);
			document.cookie = name + "=a; expires=" + date.toGMTString();
		}
	}

	my.nameSpace('util').cookie = classObj;//注册命名空间
	

})(XT);


(function(my){

/**
	 * 图片头数据加载就绪事件 - 更快获取图片尺寸
	 * @param	{String}	图片路径
	 * @param	{Function}	尺寸就绪
	 * @param	{Function}	加载完毕 (可选)
	 * @param	{Function}	加载错误 (可选)
	 * @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
			alert('size ready: width=' + this.width + '; height=' + this.height);
		});
	 */
	var imgReady = (function () {
		var list = [], intervalId = null,

		// 用来执行队列
		tick = function () {
			var i = 0;
			for (; i < list.length; i++) {
				list[i].end ? list.splice(i--, 1) : list[i]();
			};
			!list.length && stop();
		},

		// 停止所有定时器队列
		stop = function () {
			clearInterval(intervalId);
			intervalId = null;
		};

		return function (url, ready, load, error) {
			var onready, width, height, newWidth, newHeight,
				img = new Image();
			
			img.src = url;

			// 如果图片被缓存，则直接返回缓存数据
			if (img.complete) {
				ready.call(img);
				load && load.call(img);
				return;
			};
			
			width = img.width;
			height = img.height;
			
			// 加载错误后的事件
			img.onerror = function () {
				error && error.call(img);
				onready.end = true;
				img = img.onload = img.onerror = null;
			};
			
			// 图片尺寸就绪
			onready = function () {
				newWidth = img.width;
				newHeight = img.height;
				if (newWidth !== width || newHeight !== height ||
					// 如果图片已经在其他地方加载可使用面积检测
					newWidth * newHeight > 1024
				) {
					ready.call(img);
					onready.end = true;
				};
			};
			onready();
			
			// 完全加载完毕的事件
			img.onload = function () {
				// onload在定时器时间差范围内可能比onready快
				// 这里进行检查并保证onready优先执行
				!onready.end && onready();
			
				load && load.call(img);
				
				// IE gif动画会循环执行onload，置空onload即可
				img = img.onload = img.onerror = null;
			};

			// 加入队列中定期执行
			if (!onready.end) {
				list.push(onready);
				// 无论何时只允许出现一个定时器，减少浏览器性能损耗
				if (intervalId === null) intervalId = setInterval(tick, 40);
			};
		};
	})();

	my.nameSpace('util').imgReady = imgReady;//注册命名空间
	

})(XT);



(function(my){

 	function classObj(input, maxLen, tempnum, isnumber){//截取字

			var timer = null;
			input = $(input);
			tempnum = $(tempnum);
			input.bind("keyup",function(){
				var $this =$(this)
				clearTimeout(timer);
				timer = setTimeout(function(){
						sbstr($this);
				},100)
				
			})
			
			var sbstr = function(ele){
				var str = ele.val().substr(0, maxLen);
				
				if(ele.val().length > maxLen && !isnumber){
					ele.val(str);
				}

				if(isnumber) {
					ele.val(str.replace(/[^\d\.]/g,''));
				}
				
				tempnum && tempnum.text(maxLen - str.length);
			}	
		}

	my.nameSpace('widget').areaLimit = classObj;//注册命名空间
	

})(XT);



