//兼容ie低版本console对象
(function() {
	//创建空console对象，避免JS报错
	if (!window.console) {
		window.console = {};
		var console = window.console;

		var funcs = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml',
			'error', 'exception', 'group', 'groupCollapsed', 'groupEnd',
			'info', 'log', 'markTimeline', 'profile', 'profileEnd',
			'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'
		];
		for (var i = 0, l = funcs.length; i < l; i++) {
			var func = funcs[i];
			if (!console[func])
				console[func] = function() {};
		}
	}

	if($(window)[0].frameElement && $(window)[0].frameElement.className.indexOf("tbsIframe") > -1){
	// if($(window)[0].frameElement && $(window)[0].frameElement.contentWindow.document.getElementsByClassName("tbsIframe")[0] == "tbsIframe"){
		$("body").css("margin","0")
	}
	// if(!console.memory)  console.memory = {};
})();
//ie低版本支持classList
if (!("classList" in document.documentElement)) {
	Object.defineProperty(HTMLElement.prototype, 'classList', {
		get: function() {
			var self = this;

			function update(fn) {
				return function(value) {
					var classes = self.className.split(/\s+/g),
						index = classes.indexOf(value);

					fn(classes, index, value);
					self.className = classes.join(" ");
				}
			}

			return {
				add: update(function(classes, index, value) {
					if (!~index) classes.push(value);
				}),

				remove: update(function(classes, index) {
					if (~index) classes.splice(index, 1);
				}),

				toggle: update(function(classes, index, value) {
					if (~index)
						classes.splice(index, 1);
					else
						classes.push(value);
				}),

				contains: function(value) {
					return !!~self.className.split(/\s+/g).indexOf(value);
				},

				item: function(i) {
					return self.className.split(/\s+/g)[i] || null;
				}
			};
		}
	});
}


$(document).ready(function() {
	// ？ 帮助的显示
	$('#helpFont').toggle(function() {
		$('#helpContext').slideDown();
	}, function() {
		$('#helpContext').slideUp();
	})
	//tr按下变色
	$('body').on('mousedown', '.checkTr', function() {

		DX.clickTr($(this));
	})
	//table表格上下左右
	$('body').on('keydown', '.tableEdit', function(e) {

		DX.keyDown($(this), e.keyCode);
	})

	//弹层关闭
	$('.modelShow').click(function() {
		$(this).hide();
	})
	//取消
	$('.modelShow .btnGray').click(function() {
		$(this).parents('.modelShow').find('input').val(''); //置空所有的input
		$('#errmes').text('');
		$(".layui-laydate").remove();
		$(this).parents('.modelShow').hide();
	})
	//弹层阻止冒泡
	$('.modelContant').on('click', function(e) {
		// e.preventDefault();
		// window.event.cancelBubble = true;
		window.event ? window.event.cancelBubble = true : e.stopPropagation();
	})
	//拖动
	DX.drap($('.comDrap'), $(".modal-c"));

});

// 配置接口地址 前边正式服地址 后边本地服务端口
var urlConfig = {
	'user': ['user.dx185.com', ':9001'],
	'eva': ['jh.dx185.com', ':9004'],
	'finance': ['cw.dx185.com', ':9005'],
	'materials': ['wz.dx185.com', ':9003'],
	'mix': ['bhz.dx185.com', ':9002'],
	'proplans': ['ldssc.dx185.com', ':9006'],
	'wbsp': ['wbsp.dx185.com', ':9026'],
	'economy': ['economy.dx185.com', ':9027'],
	'prod': ['prod.dx185.com', ':9023'],
	'hrs': ['rlzy.dx185.com', ':9008'],
	'device': ['sbgl.dx185.com', ':9007'],
	'aq': ['aq.dx185.com', ':9009'],
	'fr': ['fr.dx185.com', ':9010'],
	'factory': ['gjjgc.dx185.com', ':9011'],
	'beamFactory': ['bf.dx185.com', ':9033'],
	'purchase': ['clsg.dx185.com', ':9028'],
	'group': ['jhpj.dx185.com', ':9012'],
	'sbwlt': ['itest.dx185.com', ':9013'],
	'plancount': ['jhjl.dx185.com', ':9014'],
	'oec': ['rsrb.dx185.com', ':9013'],
	'approval': ['fasp.dx185.com', ':9015'],
	'tender': ['tb.dx185.com', ':9017'],
	'office': ['bgs.dx185.com', ':9016'],
	'estimate': ['bqcs.dx185.com', ':9018'],
	'share': ['share.dx185.com', ':9019'],
	'confess': ['jsjd.dx185.com', ':9020'],
	'other': ['hzhb.dx185.com', ':9021'],
	'count': ['ttjs.dx185.com', ':9022'],
	'timenetwork': ['timenetwork.dx185.com', ':9025'],
	'campign': ['campign.dx185.com', ':9031'],
	'algp':['algp.dx185.com',':9900'],
	'award': ['tgjl.dx185.com', ':9034'],
	'aqch': ['aqch.dx185.com', ':9040'],
};


/*
 * 常用函数的封装
 */
var DX = {
	/**
	 * 本地开发ip
	 */
	ip: function() {
		return '192.168.1.249'
	},

	/**
	 * 判断是那个环境
	 */
	switchs: function() {
		var back = 0; //默认开发环境
		var index = window.location.hostname.indexOf("dx185.com");
		var index1 = window.location.hostname.indexOf("itest.dx185.com");
		var index2 = window.location.hostname.indexOf("cz.dx185.com");
		if (index != -1 && index1 == -1 && index2 == -1) { //原始线上
			back = 1;
		} else if (index1 != -1) { //测试
			back = 2;
		}else if (index2 != -1) { //川藏
			back = 3;
		}
		return 0;
	},
	tagIframe: function(url, text, closeFlag) { //头部标签形式打开iframe。url:要打开的子页面路径；text：顶部标签的名字；closeFlag：布尔值，如果true，将会关闭父页面的时候连带子页面一起关掉，如果false，将只关闭父页面。
		if (closeFlag == undefined) {
			closeFlag = true
		}
		if ($(window.parent.document).find('.topnav').length == 0) {
			var hrefurl = '';
			if (this.switchs() == 1) {
				hrefurl = 'https://' + window.location.host + '/' + url;
			} else if (this.switchs() == 2) {
				hrefurl = 'http://' + window.location.host + '/' + url;
			} else {
				hrefurl = 'http://' + window.location.host + '/web/' + url;
			}
			// window.location.href = hrefurl
			window.open(hrefurl)
			return
		}
		var iframeId = self.frameElement.getAttribute('id'); //获取id
		console.log(iframeId)
		$(window.parent.document).find('.removeIframe').remove();
		if (this.isOpen(url, text)) return;
		$(window.parent.document).find('.showFrame').css('display', 'none');

		//添加iframe
		var id = 'iframe' + parseInt(Math.random() * (100000 - 1) + 1);
		if (closeFlag == true) {
			var str = '<iframe  id="' + id + '" class="showFrame"  parent-id="' + iframeId + '"  parent-iframeId="' + iframeId +
				'"  style="border:none;width:100%;" scrolling="auto" frameborder="0" src="' + url + '"  ></iframe>';
		} else {
			var str = '<iframe  id="' + id + '" class="showFrame"  parent-iframeId="' + iframeId +
				'" style="border:none;width:100%;"  scrolling="auto" frameborder="0" src="' + url + '"  ></iframe>';
		}
		if (!text) {
			if (closeFlag == true) {
				var str = '<iframe  id="' + id + '" class="showFrame removeIframe"  parent-id="' + iframeId +
					'"  parent-iframeId="' + iframeId + '"  style="border:none;width:100%;" scrolling="auto" frameborder="0" src="' +
					url + '"  ></iframe>';
			} else {
				var str = '<iframe  id="' + id + '" class="showFrame removeIframe"  parent-iframeId="' + iframeId +
					'"  style="border:none;width:100%;" scrolling="auto" frameborder="0" src="' + url + '"  ></iframe>';
			}
		}
		$(window.parent.document).find('#contDiv').append(str);

		//添加tabbar
		if (text !== null) {
			// $('.topnav').css('display','block');
			if (closeFlag == true) {
				var string = '<li class="active"   data-url="' + url + '" data-id="' + id + '"   parent-iframeId="' + iframeId +
					'"  parent-id="' + iframeId + '" >' + text + ' <span>&times;</span></li>';
			} else {
				var string = '<li class="active"  data-url="' + url + '" data-id="' + id + '"  parent-iframeId="' + iframeId +
					'"   >' + text + ' <span>&times;</span></li>';
			}

			$(window.parent.document).find('#tabnav').children('li').removeClass('active');
			$(window.parent.document).find('#tabnav').append(string);
			//处理宽度问题
			var width = 0;
			if ($(window.parent.document).find('#tabnav li').length > 8) {
				$.each($(window.parent.document).find('#tabnav li'), function(val) {
					width += $(this).outerWidth() + 1;
				})
			}
			if (width) {
				$(window.parent.document).find('#tabnav').css('width', width);
			}
			//处理菜单太多，让当前显示问题
			var width = $(window.parent.document).find('#tabnav').width();
			var wrap = $(window.parent.document).find('.topnav').width();
			if (wrap - width < 68) {
				$(window.parent.document).find('#tabnav').animate({
					'left': wrap - width - 30 + 'px'
				}, 100)
			}
			$(window.parent.document).find('.topnav').show();
		} else {
			$(window.parent.document).find('.topnav').hide();
		}
		this.init(true)
		$(window.parent.document).find('#' + id).show();
	},
	init: function(isHome) {
		if ($('.topnav').css('display') == "none") {
			isHome = true;
		} else {
			isHome = false;
		}
		var winHei = parent.document.body.clientHeight || window.parent.innerHeight
		var toHei = (winHei - parseFloat($("#leftDiv").css("marginTop"))) + "px";
		$(window.parent.document).find("#leftDiv").css("minHeight", toHei);
		var h = isHome ? (68 - 30) : 68;
		$(window.parent.document).find(".showFrame").css("height", winHei - h);
	},
	isOpen: function(url, text) { //判断当前有这个页面就不再打开
		var flag = false;
		$.each($(window.parent.document).find('#tabnav li'), function(val) {
			if ($(this).attr('data-url') == url && $(this).text().indexOf(text) != -1) {
				flag = true;
				$(this).addClass('active').siblings().removeClass('active');
				$(window.parent.document).find('.showFrame').css('display', 'none');
				var id = $(this).attr('data-id');
				$(this).click()
			}
		})
		return flag;
	},
	//标签嵌套的iframe刷新父页面数据方法 fun方法名,方法可穿参数。
	fFiveParent: function(fun) {
		var iframeId = self.frameElement.getAttribute('parent-iframeId'); //获取父页面iframeid
		var javascript
		if (window.top.location.pathname == "/index.html" || window.top.location.pathname == "/web/index.html" || window.top
			.location.pathname == "/") {
			javascript = "window.parent.document.getElementById('" + iframeId + "').contentWindow." + fun;
		}
		try {
			if (fun) { //如果传了方法名就执行传入的方法
				eval(javascript);
			} else { //如果没传就刷新整个父页面
				javascript = "window.parent.document.getElementById('" + iframeId + "').contentWindow.location.reload()";
				eval(javascript);
			}
		} catch (e) {}
	},
	closeSonWindow: function() { //关闭当前打开的标签页面
		if ($(window.parent.document).find('.topnav').length == 0) {
			window.close();
			return
		}
		var parentId = ''
		var iframeId = self.frameElement.getAttribute('id'); //获取id
		$.each($(window.parent.document).find('#tabnav li'), function(val) {
			if ($(this).attr('data-id') == iframeId) {
				parentId = $(this).attr('parent-iframeid') //拿到要关闭的这个子的父id
				$.each($(window.parent.document).find('#tabnav li'), function(value) { //找到父id标签，模拟点击。
					if ($(this).attr('data-id') == parentId) {
						$(this).click()
					}
				})
				$(this).find('span').click()
			}
		})
	},
	/**
	 * 接口请求地址
	 * @param {string} key调用后台服务的第一级目录名
	 */
	domain: function(key) {
		var api = '';
		if (this.switchs() == 1) {
			api = 'https://' + urlConfig[key][0];
		} else if (this.switchs() == 2) {
			api = window.location.protocol + '//itest.dx185.com';
		} else if (this.switchs() == 3) {  //川藏
			api = window.location.protocol + '//cz.dx185.com';
		} else {
			api = 'http://' + this.ip() + urlConfig[key][1];
		}
		return api;
	},
	/**
	 * @param {Object} fid 文件预览
	 */
	preview: function(key, fid) {
		if (this.switchs() == 1) {
			// return 'http://ow365.cn/?i=20302&furl=http://file.dx185.com/' + key + '?fid=' + fid;
			return 'http://ow365.cn/?i=20302&furl=http://file.dx185.com/' + key + '/file/download?fid=' + fid;
		} else if (this.switchs() == 2) {
			// return 'http://ow365.cn/?i=20303&furl=http://itest-file.dx185.com/' + key + '?fid=' + fid;
			return 'http://ow365.cn/?i=24357&furl=http://itest.dx185.com/' + key + '/file/download?fid=' + fid;
		} else if (this.switchs() == 3) {  //川藏
			return 'http://ow365.cn/?i=24358&furl=http://cz.dx185.com/' + key + '/file/download?fid=' + fid;
		} else {
			return 'http://192.168.88.101/?furl=' + this.domain(key) + '/' + key + '/file/download?fid=' + fid;
		}
	},
	/**
	 * @param {Object} url 大哥公司三级树专用，其他人勿动勿动
	 */
	previewRYJ: function(url) {
		var protocol = window.location.protocol;
		if (this.switchs() == 1) {
			return protocol + '//ow365.cn/?i=20302&furl=' + url;
		} else if (this.switchs() == 2) {
			// return 'http://ow365.cn/?i=20303&furl=http://itest-file.dx185.com/' + key + '?fid=' + fid;
			// return 'http://ow365.cn/?i=20303&furl=' + url;
			return protocol + '//ow365.cn/?i=24357&furl=http://itest.dx185.com/' + url;
		} else {
			return protocol + '//192.168.88.101/?furl=' + url;
		}
	},
	/*
	 * 获取token
	 */
	getToken: function() {
		var token = this.getCookie('token');
		var tokens = token ? token : '';
		return tokens;
	},
	/**补零函数(数字前边加0)
	 * @param {Object} num 原数字
	 * @param {Object} n	位数
	 */
	PrefixInteger: function(num, n) {
		return (Array(n).join(0) + num).slice(-n);
	},
	/**打开新窗口
	 * @param {Object} url
	 * @param {Object} param {title,width,height,topWin} topWin true禁止多窗口
	 */
	open: function(url, param) {

		param = param ? param : {};
		var caption = param.title ? param.title : document.title;
		var width = param.width ? param.width : 1100;
		var height = param.height ? param.height : 600;
		var topWin = param.topWin ? param.topWin : false;
		dialog(url, caption, topWin, width, height)
	},
	/**
	 * @param id div的id最外层
	 * @param {Object} url替换页面url
	 * @param {type} isBack 返回原页面
	 */
	replaceUrl: function(id, url, isBack) {
		if (isBack === true) {
			$(window.parent.document).find("#newIframe").fadeOut(300, function() {
				var margin = document.body.getAttribute("margin");
				if(id=='activeFirstPage'){
					margin=0
				}
				$(window.parent.document.body).css('margin', margin + 'px')
				$(window.parent.document).find('#' + id).show();
				$(window.parent.document).find('#newIframe').remove();
			})
		} else {
			var urls = toAbsUrl(url);
			var iframe = window.top.document.createElement('iframe');
			iframe.src = urls;
			iframe.scrolling = "auto";
			iframe.frameborder = "0";
			iframe.id = "newIframe";
			var winHei = document.documentElement.clientHeight || window.innerHeight;
			iframe.style.cssText = "border:none;display:block;width:100%;minWidth: 1100px;height:0px";// + (winHei - 8) + 'px';
			$('#' + id).after(iframe);
			$('#' + id).fadeOut(300, function() {
				$('body').css({
					'margin': 0,
					'overflow': 'auto'
				});
				// $('#newIframe').show();
				if((window.parent && window.parent.location.pathname.indexOf("dxconfig/tabs.html") > -1) || $(window)[0].location.pathname.indexOf("dxconfig/tabs.html") > -1){
					document.getElementById('newIframe').contentWindow.document.body.setAttribute("margin","0");
					document.getElementById('newIframe').contentWindow.document.body.style.margin = "0px";
				}else{
					document.getElementById('newIframe').contentWindow.document.body.setAttribute("margin","16");
					document.getElementById('newIframe').contentWindow.document.body.style.margin = "0 16px";
				}
				iframe.style.cssText = "border:none;display:block;width:100%;minWidth: 1100px;height:"+ (winHei - 8) + "px";
				if(id=='activeFirstPage'){
					iframe.style.cssText = "border:none;display:block;width:100%;minWidth: 1100px;height:"+ winHei + "px";
				}
			})
		}

	},
	/**
	 * 刷新窗口数据 方法名不是默认的话，参数不需要传 传false或null，不传也行
	 * @param {string} f 方法名  字符串
	 * @param p 参数
	 * @param {boolean} isReplace true 的话是替换地址栏的刷新
	 */
	domParent: function(f, p, isReplace) {
		p = p ? p : false;
		f = f || 'vm.reload("' + p + '")';
		var javascript = 'window.parent.' + f;
		if (isReplace !== true) {
			if (window.top.location.pathname == "/index.html" || window.top.location.pathname == "/web/index.html" || window.top
				.location.pathname == "/") {
				var id = $(window.top.document).find('#tabnav li.active').attr('data-id');
				if(window.parent.document.getElementById(id).contentWindow.document.getElementsByClassName('curDisplay').length){
					javascript = "window.parent.document.getElementById('" + id + "').contentWindow.document.getElementsByClassName('curDisplay')[0].contentWindow." + f;
				}else{
					javascript = "window.parent.document.getElementById('" + id + "').contentWindow." + f;
				}
			}
		}


		try {
			eval(javascript);
		} catch (e) {
			//TODO handle the exception
		}


	},
	/**刷新iframe的数据
	 * @param {Object} name 页面名称
	 * @param {string} f 方法名 字符串
	 */
	reloadByIframeId: function(name, f) {
		var id = '';
		var javascript = "";
		if (window.top.location.pathname == "/index.html" || window.top.location.pathname == "/web/index.html" || window.top
			.location.pathname == "/" || window.top.location.pathname == "/dxweb/web/index.html") {
			// var id = $(window.top.document).find('#tabnav li.active').attr('data-id');
			// javascript = "window.parent.document.getElementById('"+id+"').contentWindow."+f;
			$.each($(window.top.document).find('#dialogs iframe'), function(i, val) {
				if ($(this)[0].contentWindow.location.href.indexOf(name) != -1) {
					id = $(this).attr('id');
					return false;
				}
			})
			javascript = "window.parent.document.getElementById('" + id + "').contentWindow." + f;
		} else {
			$.each($('#dialogs iframe'), function(i, val) {
				if ($(this)[0].contentWindow.location.href.indexOf(name) != -1) {
					id = $(this).attr('id');
					return false;
				}
			})
			javascript = "document.getElementById('" + id + "').contentWindow." + f;
		}
		if (id) {
			try {
				eval(javascript);
				// eval('window.frames["'+id+'"].contentWindow.'+f);
			} catch (e) {
				//TODO handle the exception
				console.log(e)
			}
		} else {
			console.warn('未找到目标iframe');
		}


	},

	/* ======================================================== 数据相关 ================================================= */
	/**
	 * 截取文字 超出...
	 * @param {string}  str 字符串
	 * @param {number}  number 截取多少位
	 */
	ellText: function(str, number) {
		var res = str.substr(0, number);

		if (str.length > number) {
			res += '...';
		}
		return res;
	},
	/**
	 * 获取input和select的值 必须有name属性
	 * @param {Object} par 可选
	 */
	getInput: function(par) {
		var obj = {};
		var arr = par ? par.find('input') : $('input');
		var arr1 = par ? par.find('select') : $('select');
		getValue(arr);
		getValue(arr1);

		function getValue(objs) {
			$.each(objs, function(i, val) {
				var name = $(this).attr('name');
				if (!name) {
					return true
				};
				obj[name] = $(this).val();
			})
		}
		return obj;
	},
	/**获取表格中所有input,slect的值
	 * @param {Object} {'class':'.a','names':[],'key':[]}{'class':'.a','names':[],'key':[]} a class名 val属性名 id需要返回的字段
	 */
	getInputs: function(obj) {
		var arr = [];
		var that = this;
		$.each($('.table tbody tr'), function() {
			var json = that.getInput($(this));
			var s = $(this);
			if (obj) {
				for (var i = 0; i < obj.names.length; i++) {
					json[obj.key[i]] = s.find(obj.class).attr(obj.names[i]);
				}
			}
			arr.push(json);
		})
		return arr;
	},
	/**给input赋值
	 * @param {Object} data 数据
	 * @param {type} par 外层包的盒子
	 */
	setInput: function(data, par) {
		var arr = par ? par.find('input') : $('input');
		var arr1 = par ? par.find('select') : $('select');
		setValue(arr);
		setValue(arr1);

		function setValue(objs) {
			$.each(objs, function(i, val) {
				if ($(val).attr('type') == "checkbox" || $(val).attr('type') == "radio") return true;
				var name = $(this).attr('name');
				if (!name) {
					return true
				};
				$(this).val(data[name])
			})
		}
	},
	/** 拿出object需要的数据
	 * @param {Object} arr 数组里面放key[]
	 * @param {Object} obj json对象
	 * @param  默认 false 传需要的字段   true 传不需要的字段
	 */
	getObject: function(arr, obj, flag) {
		obj = $.extend({}, obj);
		var objs = {};
		for (var i = 0; i < arr.length; i++) {
			if (flag) {
				delete obj[arr[i]];
			} else {
				objs[arr[i]] = obj[arr[i]];
			}
		}
		if (flag) {
			return obj;
		} else {
			return objs;
		}

	},
	/**设置默认值
	 * @param {Object} def 默认值
	 * @param {Object} obj json对象
	 * @param {boolen} isNll 默认false 全部设置默认值  true 为空的设置默认值
	 * @param {Object} arr 可选，不需要设置的值
	 */
	setObject: function(def, obj, isNull, arr) {
		obj = $.extend({}, obj);
		for (var key in obj) {
			if (arr != undefined && arr.indexOf(key) != -1) continue;
			if (!isNull) {
				obj[key] = def;
			} else {
				if (this.isNull(obj[key])) {
					obj[key] = def;
				}
			}
		}
		return obj;
	},
	/**换json的key
	 * @param {object} json 数据
	 * @param {Object} obj {key:value}
	 */
	resetKey: function(json, obj) {
		for (var key in obj) {
			if (json[key]) {
				json[obj[key]] = json[key];
				delete json[key];
			}
		}
		return json;
	},
	/**枚举
	 * @param {Object} status 当前的值
	 * @param {Object} data 枚举数据{key:value}
	 * @return {string} 不存在返回null
	 */
	enumData: function(status, data) {
		var value;
		if (data[status]) {
			value = data[status];
		}
		return value;
	},
	/**添加属性值
	 * @param {Object} obj json对象
	 * @param {Object} objs 需要添加的属性{key:value}
	 */
	addObject: function(obj, objs) {
		for (var key in objs) {
			obj[key] = objs[key];
		}
		return obj;
	},
	/**拼接跳转参数
	 * @param {Object} index 序号
	 * @param {obj} objs {key:value}
	 */
	setdParam: function(index, objs) {
		index = index ? index : 1;
		var d = "row_" + index;
		for (var key in objs) {
			d += ';' + key + '_' + objs[key];
		}
		return "d=" + d;
	},
	/**
	 * @param {Object} d 解密d
	 * @param {boolean} bool 默认false 默认加背景 true的话自行处理（特殊情况）有分页选true
	 */
	getdParam: function(d, bool) {
		var arr = d.split(';');
		var json = {};
		for (var i = 0; i < arr.length; i++) {
			var key = arr[i].split('_')[0];
			json[key] = arr[i].split('_')[1];
		}
		// if(!bool){
		// 	$('.table tbody').find('tr').eq(json.row).addClass('trclick');
		// }

		return json;
	},
	/**
	 * @param {Object} obj 分页跳转参数
	 */
	setPage: function(obj, index) {
		var json = {
			'index': $('#page_index').val(),
			'size': $('#page_number').val()
		};
		obj.index = json.index;
		obj.size = json.size;
		index = index ? index : 1;
		return this.setdParam(index, obj);
	},
	/**
	 * 数组去重
	 * @param {Object} arr
	 */
	duplicate: function(arr) {

		var tem = [];
		for (var i = 0; i < arr.length; i++) {
			if (tem.indexOf(arr[i]) == -1) {
				tem.push(arr[i]);
			}
		}
		return tem;
	},
	/** 小数加法运算
	 * @param {Object} num1
	 * @param {Object} num2
	 */
	numAdd: function(arg1, arg2) {
		arg1 = arg1.toString(), arg2 = arg2.toString();
		var arg1Arr = arg1.split("."),
			arg2Arr = arg2.split("."),
			d1 = arg1Arr.length == 2 ? arg1Arr[1] : "",
			d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
		var maxLen = Math.max(d1.length, d2.length);
		var m = Math.pow(10, maxLen);
		var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
		var d = arguments[2];
		return typeof d === "number" ? Number((result).toFixed(d)) : result;
	},
	/** 乘法
	 * @param {Object} arg1
	 * @param {Object} arg2
	 */
	numMul: function(arg1, arg2) {
		arg1 = arg1 ? arg1 : 0;
		arg2 = arg2 ? arg2 : 0;
		var m = 0,
			s1 = arg1.toString(),
			s2 = arg2.toString();
		try {
			m += s1.split(".")[1].length
		} catch (e) {}
		try {
			m += s2.split(".")[1].length
		} catch (e) {}
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
	},
	/** 除法运算
	 * @param {Object} arg1
	 * @param {Object} arg2
	 */
	numAcc: function(arg1, arg2) {
		var t1 = 0,
			t2 = 0,
			r1, r2;


		try {
			t1 = arg1.toString().split(".")[1].length;
		} catch (e) {}
		try {
			t2 = arg2.toString().split(".")[1].length;
		} catch (e) {}

		r1 = Number(arg1.toString().replace(".", ""));
		r2 = Number(arg2.toString().replace(".", ""));
		return (r1 / r2) * Math.pow(10, t2 - t1);

	},
	/**
	 * 科学计数法转换
	 * @param {number} num 需要转换的值
	 */
	toNonExponential: function(num) {
		var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
		// return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
		var result = num.toFixed(Math.max(0, 8));
		if (result == 0) {
			return 0;
		} else {
			return result;
		}
	},
	/**搜索結果高亮展示
	 * @param {string} str搜索的結果
	 * @param {string} rep搜索的條件
	 */
	replaceStr: function(str, rep) {
		var result;
		if (this.isNull(rep)) {
			result = str;
		} else {
			var subStr = new RegExp(rep); //创建正则表达式对象
			var res = '<span style="color:red">' + rep + '</span>';
			result = str.replace(subStr, res);
		}

		return result;
	},
	/* ===================================================== dom操作 ================================================= */

	/**
	 * 表格操作提示
	 * @param {type} str 提示信息
	 */
	optionTitle: function(str) {
		if (str == undefined) str = "操作成功！";
		$('.show_title').remove();
		var str = '<div class="show_title"><p>' + str + '</p></div>';
		$('body').append(str);
		var widthNum = $('.show_title').width() / 2 + 10
		$('.show_title').css('margin-left', -widthNum + 'px')
		var heightNum = $('.show_title').height() / 2 + 10
		$('.show_title').css('margin-top', -heightNum + 'px')
		$('.show_title').fadeIn(300);
		setTimeout(function() {
			$('.show_title').fadeOut(300);
		}, 2500)
	},
	/**tabel 搜索结果高亮
	 * @param {Object} content
	 * @param {Object} obj dom对象
	 */
	toRed: function(content, obj) {
		obj = obj ? obj : $('.table tbody');
		var bodyHtml = obj.html();
		reger = new RegExp("(>|^)([^<]*)(" + content + ")([^>]*<)", "gm");
		reslut = bodyHtml.replace(reger, "$1$2<font color='red'>$3</font>$4");
		obj.html(reslut);
	},
	/**
	 * 没有数据的提示 （注意 选项卡页面 应写下边的table）
	 * @param {type} dom 外层盒子对象
	 * @param {type} flag true是删除
	 */
	noData: function(dom, flag) {
		// if(flag){
		// 	$('.noData').remove();return;
		// }

		// if(!dom){dom=$('.table');}

		// if(!dom.next().hasClass('noData')){
		// 	var html = '<div class="noData"></div>';
		// 	dom.after(html);
		// }

	},
	/**
	 * 表格操作的全选
	 * @param {Object} obj $(this)
	 */
	allSelect: function(obj) { //全选
		if (obj.attr('checked')) {
			$('table td input').prop('checked', true);
		} else {
			$('table td input').prop('checked', false);
		}
		// console.log(values);
	},
	/**
	 *表格数据获取多选值
	 * @param {type} obj dom元素 可选
	 */
	isGo: function(obj) {
		obj = obj ? obj : $('table tbody td input[type="checkbox"]');
		var arr = [];
		$.each(obj, function(i, val) {
			if ($(this).prop('checked')) {
				arr.push($(this).val());
			}
		})
		return arr;
	},
	/** 单行刷新
	 * @param {array} arr 数组 按顺序写['a','b']
	 * @param {Object} data 后台数据 json
	 * @param {Object} obj $('.table tbody').find('tr').eq(2)
	 */
	rowDom: function(arr, data, obj) {
		for (var i = 0; i < arr.length; i++) {
			obj.find('td').eq(i).text(data[arr[i]]);
		}
	},
	/**渲染table
	 * @param {Object} data 数据
	 * @param {type} arr1 需要渲染的字段 按顺序
	 * @param {Object} objs tr需要绑定的属性{key:value}
	 * @param {Object} option 操作栏[{key:'a','value':'删除'}] key为class value为显示的字
	 * @param { bloean} flag 默认false 要序号 true 不要序号
	 * @param {object} enumData [{key:'a',value:{}}] 可选 枚举类型
	 */
	tableDom: function(data, arr1, objs, option, flag, enumData) {
		var html = '';
		if (!enumData) enumData = [];
		for (var i = 0; i < data.length; i++) {
			var s = ""; //绑定属性
			if (objs) {
				for (var keys in objs) {
					s += ' ' + keys + '=' + data[i][objs[keys]] + ' ';
				}
				console.log(s);
			}
			html += '<tr' + s + '>';
			//序号
			if (!flag) {
				html += '<td>' + (i + 1) + '</td>';
			}
			//渲染td
			for (var s = 0; s < arr1.length; s++) {

				for (var g = 0; g < enumData.length; g++) {
					if (arr1[s] == enumData[g].key) {
						html += '<td>' + this.enumData(data[i][arr1[s]], enumData[g].value) + '</td>';
					} else {
						html += '<td>' + data[i][arr1[s]] + '</td>';
					}
				}
				if (enumData.length <= 0) {
					html += '<td>' + data[i][arr1[s]] + '</td>';
				}

			}
			//操作栏
			if (option) {
				var str = "";
				for (var t = 0; t < option.length; t++) {
					str += '<span class="listToDetail ' + option[t].key + '">' + option[t].value + '</span>';
				}
				html += '<td>' + str + '</td>';
			}

			html += '</tr>';
		}

		return html;
	},
	/** tr点击变色 ctrl加点击多选
	 * @param  obj $(this) 当前对象
	 * @param  option [] 子集元素标签 可选
	 */
	clickTr: function(obj, option) {

		var bol = ctrl(); //判断是否按住ctrl

		if (obj.hasClass('trclick') && bol) { //按住ctrl且选中
			obj.removeClass('trclick');
			children(bol, false);
		} else if (obj.hasClass('trclick') && !bol) { //选中了没按住ctrl
			obj.removeClass('trclick');
			obj.siblings('tr').removeClass('trclick');
			children(bol, false);
		} else if (!obj.hasClass('trclick') && bol) { //没选中按住ctrl
			obj.addClass('trclick');
			children(bol, true);
		} else { //没选中没按住ctrl
			obj.addClass('trclick').siblings('tr').removeClass('trclick');
			children(bol, true);
		}

		/**
		 * 判断ctrl 是否按住
		 */
		function ctrl() {
			var ctrl = false;
			if (window.event.ctrlKey) {
				ctrl = window.event.ctrlKey
			}
			return ctrl;
		}
		/**
		 * @param {Object} bol	ctrl是否按住
		 * @param {Object} isAdd 是否添加class
		 */
		function children(bol, isAdd) {
			if (Object.prototype.toString.call(option) === "[object Array]") {
				for (var i = 0; i < option.length; i++) {
					if (!bol) {
						obj.siblings('tr').find(option[i]).removeClass('trclick');
					}
					if (isAdd) {
						obj.find(option[i]).addClass('trclick');
					} else {
						// obj.siblings('tr').find(option[i]).removeClass('trclick')
						obj.find(option[i]).removeClass('trclick');
					}
				}
			}
		}


	},
	/** 点击变色
	 * @param {object} objs tr标签 可选
	 * @param {Object} options 包含的子集元素 可选
	 */
	vueClickTr: function(objs, options) {
		var that = this;
		var obj = objs == undefined ? '.table tbody tr' : objs;
		$('body').on('mousedown', obj, function() {
			var option = options == undefined ? [] : options;

			that.clickTr($(this), option);
		})

	},
	/**checkbox多选
	 * @param {type} obj  传$(this)
	 * @param {type} flag true单选 false全选 默认false
	 */
	checkboxTr: function(obj, flag) {
		var objs = $('table tbody tr input[type=checkbox]');
		if (flag) {
			if (obj.prop('checked')) {
				obj.parents('tr').addClass('trclick')
			} else {
				obj.parents('tr').removeClass('trclick')
			}
		} else {
			if (obj.prop('checked')) {
				objs.parents('tr').addClass('trclick')
			} else {
				objs.parents('tr').removeClass('trclick')
			}
		}

	},

	/** table 操作的时候tr提示
	 * @param {Object} obj 当前tr 操作对象
	 * @param {Object} errmsg 操作失败的提示 可选 对的时候不传
	 */
	option: function(obj, errmsg) {
		if (obj.next().attr('class')) {
			if (obj.next().attr('class').indexOf("option_show") != -1) return;
		}

		var msg = '操作成功！';
		if (errmsg) {
			msg = errmsg;
		}
		var col = obj.find('td').length;
		var rand = this.ran(0, 1000);

		var str = '<td class="option_show' + rand + '" colspan="' + col + '"><div class="option"><p>' + msg +
			'</p></div></td>';
		obj.after(str);

		setTimeout(function() {
			$('.option_show' + rand).find('.option').slideUp(500, function() {
				$('.option_show' + rand).remove();
			})
		}, 2000);
	},

	/* ====================================================== 键盘方法 =============================================== */
	/**table 上下左右
	 * @param {type} obj  当前元素
	 * @param {Object} code 键盘码
	 * @param {string} className 可选 可上下左右的input class
	 */
	keyDown: function(obj, code, className) {

		var index = obj.parent('td').index();
		var cl = className ? className : 'tableEdit';
		if (code == 38) { //上
			event.returnValue = false;
			event.cancel = true;
			$('.table tbody').find('tr').eq(index - 1)
			var u = obj.parents('tr').prev().find('td').eq(index).children().hasClass(cl);
			if (u) {
				obj.parents('tr').prev().find('td').eq(index).children('.' + cl).focus();
			}
		} else if (code == 40) {
			event.returnValue = false;
			event.cancel = true;
			var d = obj.parents('tr').next().find('td').eq(index).children().hasClass(cl);
			if (d) {
				obj.parents('tr').next().find('td').eq(index).children('.' + cl).focus();
			}
		} else if (code == 37) { //左
			var r = obj.parent('td').prev().children().hasClass(cl);
			if (r) {
				console.log(r);
				obj.parent('td').prev().children('.' + cl).focus();
			}
		} else if (code == 39) {
			var l = obj.parent('td').next().children().hasClass(cl);
			if (l) {
				console.log(l);
				obj.parent('td').next().children('.' + cl).focus();
			}
		}
	},
	/**模糊搜索 键盘控制 绑定pid属性
	 * @param {Object} callBack 回调函数
	 * @param {Object} iobj input 对象 可选
	 * @param {Object} obj ul 可选
	 */
	blurry: function(callBack, iobj, obj) {

		var input = iobj ? iobj : $('#checkProject input');
		var li = obj ? obj : $('#checkProject ul');
		if (li.css('display') == 'none') return;

		input.keydown(function(e) {
			var c = li.find('li').hasClass('checkBack');
			var index;
			var length = li.find('li').length;

			if (e.keyCode == 38) { //上
				if (c) {
					index = li.find('li.checkBack').index();

					if (index <= 0) return;
					index -= 1;
					li.find('li').eq(index).addClass('checkBack').siblings().removeClass('checkBack');
				}
			} else if (e.keyCode == 40) { //下
				if (c) {
					index = li.find('li.checkBack').index();
					if (index >= length - 1) return;
					index += 1;
					li.find('li').eq(index).addClass('checkBack').siblings().removeClass('checkBack');
				} else {
					console.log(li);
					li.find('li').eq(0).addClass('checkBack');
				}
			} else if (e.keyCode == 13) {
				var json = {
					'text': li.find('li.checkBack').text(),
					'id': li.find('li.checkBack').attr('pid')
				}
				callBack(json);
			}

		})


	},

	/**项目部模糊搜索 绑定id projects
	 * @param {Object} data 数据源
	 * @param {Object} callBack 回调函数
	 * @param {Object} attr 后台属性 {'att':'id','name':'name'}
	 */
	findPorject: function(data, callBack, contaion, attr, id, index) {
		attr = attr ? attr : {
			'att': 'id',
			'name': 'name'
		};
		var reIndex = index;
		var ele = id ? id : $('#projects');
		var pagx = ele.offset();
		var scrollTop = ele.scrollTop();
		var scrollLeft = ele.scrollLeft();
		contaion = contaion ? contaion : '';
		if ($('#resProject')) {
			$('#resProject').remove();
		}

		var html = '<ul class="res" id="resProject">';
		for (var i = 0; i < data.length; i++) {
			if (index) {
				html += '<li pid="' + data[i][attr['att']] + '">' + (i + 1) + ' <span>' + this.replaceStr(data[i][attr['name']],
					contaion); + '</span></li>';
			} else {

				html += '<li pid="' + data[i][attr['att']] + '">' + this.replaceStr(data[i][attr['name']], contaion); + '</li>';
			}
		}
		html += '</ul>';
		// ele.after(html);
		$('body').append(html);

		$('#resProject').css({
			'top': pagx.top + 30 + scrollTop,
			'left': pagx.left + scrollLeft
		});

		$('#resProject li').click(function() {
			var res = {
				'id': $(this).attr('pid'),
				'name': index ? $(this).children("span").text() : $(this).text()
			};
			callBack(res);
			$('#resProject').remove();
		})


		// var input = iobj ? iobj : $('#checkProject input');
		var li = $('#resProject');
		if (li.css('display') == 'none') return;

		// var eTop = ele.position();
		// document.addEventListener('scroll',function(){
		// 	var scrollTop1 = $(document).scrollTop();
		// 	var scrollLeft1 = $(document).scrollLeft();
		// 	// var pagx = ele.offset();
		// 	console.log(scrollTop1)

		// 	$('#resProject').css({'top':scrollTop1+30+eTop.top,'left':scrollLeft1+eTop.left});
		// })


		$(ele).unbind('keydown');
		$(ele).on("keydown", function(e) {
			var c = li.find('li').hasClass('checkBack');
			var index;
			var length = li.find('li').length;
			index = li.find('li.checkBack').index();
			if (e.keyCode == 38) { //上
				if (c) {
					// index = li.find('li.checkBack').index();

					if (index <= 0) return;
					index -= 1;
					li.find('li').eq(index).addClass('checkBack').siblings().removeClass('checkBack');
				}
			} else if (e.keyCode == 40) { //下
				if (c) {
					// index = li.find('li.checkBack').index();
					if (index >= length - 1) return;
					index += 1;
					li.find('li').eq(index).addClass('checkBack').siblings().removeClass('checkBack');
				} else {
					console.log(li);
					li.find('li').eq(0).addClass('checkBack');
				}
			} else if (e.keyCode == 13) {
				var json = {
					'name': reIndex ? li.find('li.checkBack span').text() : li.find('li.checkBack').text(),
					'id': li.find('li.checkBack').attr('pid')
				}
				callBack(json);
				ele.blur()
				$('#resProject').remove();
			}
		})

	},


	/*****************************************验证类型*********************************************************/
	/**
	 * 验证json对象是否为空
	 * @param {Object} obj数据
	 * @param {array} arr ['a','b'] 不需要验证的
	 * @param {object} json {key:字段名}
	 */
	verJson: function(obj, arr, json) {
		if (!arr) arr = [];
		var flag = true;
		var msg = '验证通过';
		for (var key in obj) {
			if (arr.indexOf(key) != -1) continue;

			if (this.isNull(obj[key])) {
				flag = false;
				if (json[key]) {
					msg = json[key] + '不可为空';
				} else {
					msg = '不可为空';
				}
				break;
			}
		}
		var jsons = {
			'flag': flag,
			'msg': msg
		};
		return jsons;
	},
	/**密码验证
	 * @param {string} string
	 */
	verPassword: function(string) {
		// var d = /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,20})$/;密码验证 包含数字和字母 长度8到20
		if (string.length >= 6 && string.length <= 20) {
			return true;
		}
		// return d.test(string);
		return false;
	},
	/**手机号验证
	 * @param {string} string
	 * @return {boolean}
	 */
	verPhone: function(string) {
		var mobile = /^[1][0-9]{10}$/;
		return mobile.test(string);
	},
	/**座机号码验证
		 * @param {string} string
		 * @return {boolean} 
		 */
		fixedPhone:function(string){
			// /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/
			// /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
			var fp = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
			return fp.test(string);
		},
	/**验证身份证号
	 * @param {Object} string
	 */
	verIdCard: function(string) {
		var cp = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
		return cp.test(string);
	},

	/**验证值为空或者都是空格
	 * @param {Object} str
	 */
	isNull: function(str) {
		if (str == undefined || str == "" || str == null || str == 'undefined') return true;
		var regu = "^[ ]+$";
		var re = new RegExp(regu);
		return re.test(str);
	},
	/**验证是否中文 是 true 否false
	 * @param {string} str 需要验证的字符串
	 */
	isName: function(str) {
		var reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
		return reg.test(str);
	},

	/**验证邮箱格式
	 * @param {Object} email
	 */
	isEmail: function(email) {
		var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
		return reg.test(email);
	},
	/**判断数据类型
	 * @param {Object} elem 需要验证的值
	 */
	type: function(elem) {
		if (elem == null) {
			return elem + '';
		}
		return toString.call(elem).replace(/[\[\]]/g, '').split(' ')[1].toLowerCase();
	},

	/** 判断是否为数字
	 * @param {Object} val需要判断的值
	 */
	isNumber: function(val) {

		var regPos = /^\d+(\.\d+)?$/; //非负浮点数
		var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
		if (regPos.test(val) || regNeg.test(val)) {
			return true;
		} else {
			return false;
		}

	},

	/**判断是否为数字 非负数小数后两位
	 * @param {Object} val
	 */
	floatTwo: function(val) {

		var regPos = /^\d+(\.\d+)?$/; //非负浮点数
		// var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
		if (regPos.test(val)) {
			if (!val.toString().split(".")[1]) {
				return true;
			}
			if (val.toString().split(".")[1].length <= 2) {
				return true;
			} else {
				return false;
			}

		} else {
			return false;
		}

	},
	/**判断是否为数字且小于等于8位(不包括小数点后边的)
	 * @param {Object} val
	 */
	isFloat8: function(val) {

		var regPos = /^\d+(\.\d+)?$/; //非负浮点数
		// var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数

		if (regPos.test(val)) {
			if (val.toString().split(".").length == 2) {
				if (val.toString().split(".")[1].length <= 8) {
					return true;
				}
				return false;
			}
			if (val.toString().split(".").length == 1) {
				return true;
			}
			return false;

		} else {
			return false;
		}

	},
	/**正整数
	 * @param {Object} val需要判断的值
	 */
	isInt: function(val) {
		var reg = /(^[1-9]\d*$)/;
		/*
		”^\\d+$” //非负整数（正整数 + 0）
		“^[0-9]*[1-9][0-9]*$” //正整数
		“^((-\\d+)|(0+))$” //非正整数（负整数 + 0）
		“^-[0-9]*[1-9][0-9]*$” //负整数
		“^-?\\d+$” //整数
		“^\\d+(\\.\\d+)?$” //非负浮点数（正浮点数 + 0）
		“^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$” //正浮点数
		“^((-\\d+(\\.\\d+)?)|(0+(\\.0+)?))$” //非正浮点数（负浮点数 + 0）
		“^(-?\\d+)(\\.\\d+)?$” //浮点数
		*/
		if (reg.test(val)) {
			return true;
		}
		return false;
	},
	/**
	 * 检测是否有特殊字符
	 * @param {string} str:待检测字符串
	 * @return {boolean} 是 true 否false
	 */
	checkStr: function(str) {
		var myReg = /[~!@#$%^&*()/\|,.<>?"'();:_+-=\[\]{}]/;
		// if (myReg.test(str)) {
		// 	return true;
		// }
		return myReg.test(str);
	},



	/********************************************http请求类******************************************************/

	/** 请求函数
	 * @param {type} 默认get
	 * @param {url} 请求地址
	 * @param {param} 请求参数
	 * @param {callBack} 回调函数
	 * @param {change} 按钮变灰 没响应之前不再请求 传递的参数需要到  classList的上一级对象
	 */
	ajax_method: function(obj) {
		// 处理切换项目部的问题
		var pid = getPid(window);
		var proid = this.getCookie('proid');
		if (pid != -1 && proid != undefined && pid != proid) {

			alert('您已切换项目部');
			window.parent.location.reload();
		}



		//验证该接口原因权限的配置
		var purl = obj.url;
		if (this.isNull(purl)) {
			throw new Error("请传入请求地址");
		}
		var power = this.getLocalStorage('power');

		var flag = false; //不需要权限
		var isFlag = false; //是否必填

		if (power && power != 'undefined') {
			if (this.isNull(JSON.parse(power))) return;
			var eq = obj.url.split('/')[1];
			var json = JSON.parse(power);
			if (json[eq]) {

				for (var i = 0; i < json[eq].length; i++) {
					if (json[eq][i].url == obj.url) {
						flag = true;
						if (json[eq][i].requireReason) {
							isFlag = true;
						}
					}
				}
			}
		}

		if (!flag) {
			this.callAjax(obj);
		} else {
			this.cause(isFlag, obj);
		}

		// 递归找pid
		function getPid(w) {
			var model = w.loginName;
			var pid = $(model).attr('pid');
			if (pid) {
				return pid;
			} else {
				if (w.parent && w.parent != w) {
					return getPid(w.parent);
				} else {
					return -1;
				}
			}
		}

	},
	/**回调的ajax
	 * @param {Object} obj
	 */
	callAjax: function(obj) {
		var that = this;

		// 异步对象
		var ajax = new XMLHttpRequest();
		var method = obj.type ? obj.type.toUpperCase() : "GET";
		var key = obj.url.split('/');

		var url = this.domain(key[1]) + obj.url;

		var param = obj.param || {};
		// param.sysBussinessId = param.sysBussinessId || that.getBussid();
		var tabSrc = $('body', window.top.document).find('#contDiv').find('#'+$('body', window.top.document).find('#tabnav').find('.active').attr('data-id')+'').attr('src')
		if(tabSrc){    //拿到当前亮着的tab的页面
			var tabSrcindex=tabSrc.lastIndexOf("?");
			tabSrc=tabSrc.substring(0,tabSrcindex);
			if(tabSrc == 'dxconfig/tabs.html'){
				if(!obj.tabFlag){
					param.sysBussinessId = $('body', window.top.document).find('#contDiv').find('#'+$('body', window.top.document).find('#tabnav').find('.active').attr('data-id')+'')[0].contentWindow.document.getElementsByClassName('is-active')[0].getAttribute('tabid')
				}else{
					param.sysBussinessId = obj.tabFlag
				}
			}else{
				param.sysBussinessId = $('body', window.top.document).find('#tabnav').find('.active').attr('page-id') || ''
			}
		}
		var success = obj.callBack;
		var errorCall = obj.errorCall;
		if (obj.change) { //按钮变灰

			var thats = obj.change;

			if (thats.classList.contains('clickChangeColor')) return;
			thats.classList.add('clickChangeColor');
		}

		var data = this.formatParams(param);
		// get 跟post  需要分别写不同的代码
		if (method == 'GET') {
			if (data) {
				// 如果有值
				url += '?';
				url += data;
			}
			// 设置 方法 以及 url
			ajax.open(method, url);
			ajax.send();
		} else {
			ajax.open(method, url);
			var body = obj.data;
			if (body) {
				ajax.setRequestHeader("Token", this.getToken());
				ajax.setRequestHeader("Content-type", "application/json");
				ajax.send(JSON.stringify(body));
			} else {
				// 需要设置请求报文
				ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				if (data) {
					ajax.send(data);
				} else {
					ajax.send();
				}
			}
		}

		// 注册事件
		ajax.onreadystatechange = function() {
			// 在事件中 获取数据 并修改界面显示
			if (ajax.readyState == 4 && ajax.status == 200) {
				if (obj.change) {
					thats.classList.remove('clickChangeColor');
				}
				var returnData = null;
				try {
					returnData = JSON.parse(ajax.responseText)
				} catch (d) {}
				if (returnData) {
					if (returnData.code == 100 || returnData.code == 101) {
						that.noToken();
					} else if (returnData.code == 200 || returnData.code == 401 || returnData.code == 412 || returnData.code == 415 ||
						returnData.code == 408 || returnData.code == 409) {
						success(returnData);
					} else {
						if (returnData.code == 201) return;
						if(errorCall){
							errorCall(returnData);
						}
						that.showMessage(returnData);
					}
				} else {
					success(-1); //hongtai特殊情况
				}
			}
		}
	},
	showMessage: function(res) {
		var message = '操作失败'
		if (typeof res.data == "object") {
			message = res.msg;
		} else if (res.data == "") {
			message = res.msg;
		} else {
			message = res.data;
		}

		// if (message.length >= 40 || message == "") {
		// 	message = '操作失败';
		// }
		if (message == "") {
			message = '操作失败';
		}
		this.optionTitle(message);
	},
	noToken: function() {
		var one = '';
		var urlPath = window.location.pathname;
		if (urlPath.split('/')[1] == "web") {
			one = '/web';

		}

		var href = one + '/hr/login.html';
		if (urlPath.split('/')[1] == "windowForm") {
			href = one + '/windowForm/loginWindowForm.html';
		}

		if (window.parent == window) {
			window.location.href = href;
		} else {
			window.top.location.href = href;
		}

	},

	setToken: function(token) {
		this.setCookie('token', token, 1);
	},
	//格式化参数{}
	formatParams: function(data) {
		var arr = [];

		for (var name in data) {
			arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
		}


		var token = this.getToken();
		// var daxi = that.getDX();
		arr.push('Token=' + token);
		// arr.push('DX='+daxi);
		arr.push(('v=' + Math.random()).replace('.', ''));

		return arr.join('&');
	},
	/**上传文件
	 * @param {Object} obj
	 * id 选中文件id
	 * url 上传地址
	 * phone 可选电话
	 * year 年 可选
	 * callBack 回调函数
	 * param 参数
	 */
	uplaodFile: function(obj, param) {
		var key = obj.url.split('/');
		var url = this.domain(key[1]) + obj.url;

		var file = document.getElementById(obj.id).files[0];
		var files = document.getElementById(obj.id).files;
		// var img = "<img src='/static/img/gif.gif' style='position: absolute;left: 48%;top: 45%;' />";
		// img += "<div style='backgrade'></div>";
		var model = window.parent.showModel;
		$(model).css('display', 'block');

		var formData = new FormData();
		formData.append('file', file);
		if (obj.multiple){
			for (var i=0;i<files.length;i++){
				formData.append('fileArr', files[i]);
			}
		}
		if (obj.phone) {
			formData.append('phone', obj.phone);
		}
		if (obj.year) {
			formData.append('year_quarter', obj.year);
		}
		if (param) {
			for (var s in param) {
				formData.append(s, param[s]);
			}
		}
		// var DX = this.getDX();
		var token = this.getToken();
		// formData.append('DX', DX);
		formData.append('Token', token);

		var req = new XMLHttpRequest();
		// req.withCredentials = true;
		req.open("post", url, true);

		req.onload = function() {
			$(model).css('display', 'none');
			var red = JSON.parse(req.responseText);
			if (red.code != '200') {
				var message = red.msg == "" ? '上传失败' : red.msg;
				alert(message);
			}
			obj.callBack(red);
		}

		req.send(formData);
	},
	/**上传文件(其他服务器,自定义上传地址)
	 * @param {Object} obj
	 * id 选中文件id
	 * url 上传地址
	 * phone 可选电话
	 * year 年 可选
	 * callBack 回调函数
	 * param 参数
	 */
	uplaodFileToOtherEcs: function(obj, param) {
		var key = obj.url.split('/');
		// var url = this.domain(key[1]) + obj.url;
		var url = obj.baseUrl + obj.url;
		var file = document.getElementById(obj.id).files[0];
		// var img = "<img src='/static/img/gif.gif' style='position: absolute;left: 48%;top: 45%;' />";
		// img += "<div style='backgrade'></div>";
		var model = window.parent.showModel;
		$(model).css('display', 'block');

		var formData = new FormData();
		formData.append('file', file);
		if (obj.phone) {
			formData.append('phone', obj.phone);
		}
		if (obj.year) {
			formData.append('year_quarter', obj.year);
		}
		if (param) {
			for (var s in param) {
				formData.append(s, param[s]);
			}
		}
		// var DX = this.getDX();
		var token = this.getToken();
		// formData.append('DX', DX);
		formData.append('Token', token);

		var req = new XMLHttpRequest();
		// req.withCredentials = true;
		req.open("post", url, true);

		req.onload = function() {
			$(model).css('display', 'none');
			var red = JSON.parse(req.responseText);
			if (red.code != '200') {
				var message = red.msg == "" ? '上传失败' : red.msg;
				alert(message);
			}
			obj.callBack(red);
		}

		req.send(formData);
	},

	/**
	 * @param {url} 请求路劲
	 * @param {type} 默认get
	 * @param {id} 选中文件的domId
	 * @param {callBack} 回调函数
	 * @param {change} 选择文件按钮dom
	 */

	multiFileUpload: function(obj, change) {
		var key = obj.url.split('/');
		var url = this.domain(key[1]) + obj.url;
		obj.filesKey = obj.filesKey || "file";

		// var file = document.getElementById(obj.id).files[0];
		var model = window.parent.showModel;
		$(model).css('display', 'block');

		var formData = new FormData();

		var files = document.getElementById(obj.id).files;
		for (var i = 0; i < files.length; i++) {
			formData.append(obj.filesKey, files[i]);
		}
		// formData.append('file', file);
		if (obj.param) {
			for (var s in obj.param) {
				formData.append(s, param[s]);
			}
		}
		// var DX = this.getDX();
		var token = this.getToken();
		// formData.append('DX', DX);
		formData.append('Token', token);

		var req = new XMLHttpRequest();
		// req.withCredentials = true;
		req.open("post", url, true);

		req.onload = function() {
			$(model).css('display', 'none');
			var red = JSON.parse(req.responseText);
			if (red.code != '200') {
				var message = red.msg == "" ? '上传失败' : red.msg;
				alert(message);
			}
			if (change) {
				change.classList.remove('clickChangeColor');
			}
			obj.callBack(red);
		}
		if (change) {
			// change.
			if (!change.classList.contains('clickChangeColor')) {
				change.classList.add('clickChangeColor');
			}
		}
		req.send(formData);
	},
	/********************************************cookie******************************************************/

	/**
	 * 设置cookie
	 * @param key存储的key val对应的值 time存储时间（单位天）
	 */
	setCookie: function(key, val, time) {
		var date = new Date();
		var expiresDays = time;
		date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000);
		// console.log(key+"  v"+val+' t'+date);
		document.cookie = key + "=" + val + ";expires=" + date.toGMTString() + ";path=/";
	},
	/*获取cookie
	 * @param key存储的key
	 */
	getCookie: function(key) {
		var getCookie = document.cookie.replace(/[ ]/g, ""); //获取cookie，并且将获得的cookie格式化，去掉空格字符
		var arrCookie = getCookie.split(";")
		var tips; //声明变量tips
		for (var i = 0; i < arrCookie.length; i++) {
			var arr = arrCookie[i].split("=");
			if (key == arr[0]) {
				tips = arr[1];
				break;
			}
		}
		return tips;
	},
	/*删除cookie方法
	 * param key cookie的key
	 */
	deleteCookie: function(key) {
		var date = new Date();
		date.setTime(date.getTime() - 10000);
		document.cookie = key + "=v; expires =" + date.toGMTString() + ";path=/";
	},
	/*
	 * 获取jsessionid(java)
	 */
	getSessionId: function() {
		var c_name = 'JSESSIONID';
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=");
			if (c_start != -1) {
				c_start = c_start + c_name.length + 1;
				c_end = document.cookie.indexOf(";", c_start);
				if (c_end == -1) c_end = document.cookie.length;
				return unescape(document.cookie.substring(c_start, c_end));
			}
		}
	},

	/********************************************功能型******************************************************/

	/*清除字符串中的所有空格
	 * param string
	 * return string
	 */
	trim: function(str) {
		// 去除所有空格:
		str = str.replace(/\s+/g, "");
		// 去除两头空格:
		// str   =   str.replace(/^\s+|\s+$/g,"");
		// 去除左空格：
		// str=str.replace( /^\s*/, '');
		// 去除右空格：
		// str=str.replace(/(\s*$)/g, "");
		return str;
	},
	/*随机数 生成[n,m]的随机整数
	 * param n m 整数
	 */
	ran: function(n, m) {
		return parseInt(Math.random() * (m - n) + n);
	},
	/*解析json字符串
	 * param json字符串
	 * return json 传参错误会抛异常
	 */
	parseJson: function(str) {
		try {
			return JSON.parse(str);
		} catch (e) {
			return eval('(' + str + ')');
		}
	},
	/* 13位时间戳转日期
	 * param nS 13时间戳 不传默认当前
	 * f 分割符
	 * flag 是否不要小时 默认要
	 * return 时间格式
	 */
	getLocalTime: function(nS, f, flag) {
		if (!f) {
			f = "/";
		}
		//return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ');
		var date = new Date();
		if (nS) {
			date = new Date(nS);
		}
		var Y = date.getFullYear() + f;
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + f;
		var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
		var h = date.getHours() + ':';
		var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ' ';
		//var s = date.getSeconds();
		if (flag == undefined || flag == false) {
			return Y + M + D + h + m;
		} else {
			return Y + M + D;
		}

	},
	/**
	 * 获取上一个月
	 */
	getPreMonth: function(type) {
		var date = new Date;
		var year = date.getFullYear();
		var month = date.getMonth();
		if (month == 0) {
			year = year - 1;
			month = 12;
		}
		return year + '-' + (month > 9 ? month : ('0' + month));
	},
	/**
	 * 根据当前日期获取上个月的日期
	 */
	lastMonthDate: function() {
		var Nowdate = new Date();
		var year = Nowdate.getFullYear();
		var month = Nowdate.getMonth() + 1;
		var day = Nowdate.getDate();
		//每个月的最后一天日期（为了使用月份便于查找，数组第一位设为0）
		var daysInMonth = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
		if (month == 1) {
			year = Nowdate.getFullYear() - 1;
			month = 12;
		} else {
			month = month - 1;
		}
		//若是闰年，二月最后一天是29号
		if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
			daysInMonth[2] = 29;
		}
		if (daysInMonth[month] < day) {
			day = daysInMonth[month];
		}
		if (day < 10) {
			day = "0" + day;
		}
		if (month < 10) {
			month = "0" + month;
		}
		var date = year + "-" + month + "-" + day;
		return date;
	},
	/**
	 * 千分位显示 常用于价格
	 * @param {Number} num
	 */
	toThousands: function(num) {
		return parseFloat(num).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:\.))/g, "$1,");
	},
	/**
	 * @param {Object} userAgent 获取ie版本 传userAgent字符串，用来判断其他浏览器的版本
	 */
	IETester: function(userAgent) {
		var UA = userAgent || navigator.userAgent;
		if (/msie/i.test(UA)) {
			return UA.match(/msie (\d+\.\d+)/i)[1];
		} else if (~UA.toLowerCase().indexOf('trident') && ~UA.indexOf('rv')) {
			return UA.match(/rv:(\d+\.\d+)/)[1];
		}
		return false;
	},
	/**
	 * 判断是安卓还是ios
	 * @return {number} 0 安卓 1 ios 2其他
	 */
	h5userAgent: function() {
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

		if (isAndroid) {
			return 0;
		} else if (isiOS) {
			return 1;
		} else {
			return 2;
		}
	},

	/**计时函数
	 * @param {Object} callback 回调函数
	 * @param {Object} time 轮询时间 单位s秒
	 */
	setInterval: function(callBack, time) {
		callBack();
		setInterval(callBack, time * 1000);
	},
	/**
	 * 关闭弹窗
	 */
	closeModal: function() {
		var url = window.location.href;
		// if(window.parent != window){
		window.parent.closePre(url);
		// }else{
		// 	closePre(url);
		// }
	},
	/********************************************其他******************************************************/

	/*
	 * 跳转函数
	 * @param
	 * url 跳转地址
	 * param 参数 string(a=1&b=5)
	 */
	toUrl: function(url, param) {
		window.location.href = url + "?" + param;
	},
	/* 获取网址的get参数
	 * @param string 参数名
	 * return 参数值 不存在反回null
	 */
	getParam: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.href.substr(window.location.href.indexOf(window.location.pathname) + window.location.pathname
			.length + 1).match(reg);
		if (r != null) return (r[2]);
		return null;
	},
	/*
	 * 获取存储LocalStorage
	 * parm string name
	 */
	getLocalStorage: function(name) {
		if (!window.localStorage) {
			alert("浏览器不支持localstorage");
		} else {
			var storage = window.localStorage;
			//第二种方法读取
			return storage[name];
		}
	},
	/*
	 * 存储LocalStorage
	 * @param string name value
	 */
	setLocalStorage: function(name, value) {
		if (!window.localStorage) {
			alert("浏览器不支持localstorage");
			return false;
		} else {
			var storage = window.localStorage;
			//写入a字段
			storage[name] = value;

		}
	},
	/*
	 * 删除LocalStorage
	 * @param {string} name key
	 */
	delLocalStorage: function(name) {
		var storage = window.localStorage;
		storage.removeItem(name);
		//  storage.clear();清除所有
	},
	/*
	 * 打印
	 * @page {size: auto;margin: 0mm;} 打印内容{margin-top: 20mm;margin-left: 15mm;}
	 * 不需要打印的加样式@media print {.noprint{display: none;}
	 */
	print: function() {

		if (!!window.ActiveXObject || "ActiveXObject" in window) { //是否ie
			//设置网页打印的页眉页脚为空
			var hkey_root, hkey_path, hkey_key;
			hkey_root = "HKEY_CURRENT_USER";
			hkey_path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";

			try {
				var RegWsh = new ActiveXObject("WScript.Shell")
				hkey_key = "header"
				RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "")
				hkey_key = "footer"
				RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "")
			} catch (e) {}
		}

		// bdhtml = window.document.body.innerHTML; //获取当前页的html代码
		// sprnstr = "<!--startprint-->"; //设置打印开始区域
		// eprnstr = "<!--endprint-->"; //设置打印结束区域
		// prnhtml = bdhtml.substring(bdhtml.indexOf(sprnstr) + 18); //从开始代码向后取html
		// prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr)); //从结束代码向前取html
		// // prnhtml = prnhtml.replace('&amp;','&');
		// window.document.body.innerHTML = prnhtml;

		window.print();
		// location.reload();
	},
	/*
	 * @param {Object} options
	 * url下载地址
	 * download下载文件名
	 */
	DownLoadFile: function(options) {
		var a = document.createElement('a');

		// var DX = this.getDX();
		var token = this.getToken();

		var key = options.url.split('/');

		// a.href = this.domain(key[1]) + options.url+'&DX='+DX+'&Token='+token;
		a.href = this.domain(key[1]) + options.url + '&Token=' + token;
		document.body.appendChild(a);
		if (options.download) {
			a.download = options.download;
		}


		a.click();
		document.body.removeChild(a);
	},
	/**
	 * 原因填写
	 * @param 是否必填
	 * @param {json} obj请求参数
	 */
	cause: function(flag, obj) {
		var that = this;
		var html =
			'<div class="modalShadow comCause"><div class="modal-c"><div class="modalTitle clearfix"><div class="fl">填写原因</div>';
		html += '</div><div class="modalContant scroll" style="min-height: 150px;">';
		html +=
			'<textarea  placeholder="请填写原因" style="width: 440px;height: 100px;margin-top: 15px; margin-left: 15px;resize: none;border: 1px solid #ccc;line-height: 20px;text-indent: 20px;"></textarea></div>';
		html += '<ul class="bottom"><li class="fr btnGray ml20">取消</li><li class="fr btnBlue">保存</li></ul></div></div>';

		$('body').append(html);

		// var json={'flag':false,data:{'cause':''}};
		$('.comCause .btnGray').click(function() {
			$('.comCause').remove();
		})

		$('.comCause .btnBlue').click(function() {
			// json.flag=true;
			// json.data.cause=$('.comCause textarea').val();
			var data = $('.comCause textarea').val();
			if (flag) {
				if (that.isNull(data)) {
					that.optionTitle('请填写原因');
					return;
				}
			}
			if (!obj.param) {
				obj.param = {};
			}
			obj.param.message = data;
			that.callAjax(obj);
			$('.comCause').remove();
		})
	},
	/**
	 * @param {Object} dom对象  标题  modalTitle
	 * doms  弹窗盒子  modal-c
	 */
	drap: function(dom, doms) {
		var disX = 0;
		var disY = 0;

		dom.on('mousedown', function(ev) {
			disX = ev.pageX - $(this).offset().left;
			disY = ev.pageY - $(this).offset().top;
			doms.css('position', 'relative');

			// $(this).css('cursor','move');
			var that = $(this);
			$(document).on('mousemove', function(ev) {
				// if(ev.target.nodeName.toLowerCase() === 'input'){ //如果目标元素是input则跳出滑动事件
				//     return false;
				// }
				// that.css('cursor','move');
				// that.css('margin','0');
				var iL = ev.pageX - disX;
				var iT = ev.pageY - disY;
				// dom.outerWidth()
				var maxL = $(document).width() - doms.outerWidth();
				var maxT = $(document).height() - doms.outerHeight();
				console.log(iT, maxT);
				iL = iL < 0 ? 0 : iL;
				iL = iL > maxL ? maxL : iL;
				iT = iT < 0 ? 0 : iT;
				iT = iT > maxT ? maxT : iT;
				doms.css({
					'margin': '0px',
					'left': iL,
					'top': iT
				});
				// doms.css('left',iL);
				// doms.css('top', iT);
				return false;
			})

			$(document).bind('mouseup', function(ev) {
				$(this).off('mousedown');
				$(this).off('mousemove');
				// that.css('cursor','auto');
				// doms.css('position','');
				// that.css('cursor','auto');
				return false;
			});
			//
		});
	},
	//获取当前bussid
	getBussid: function() {
		if (window == window.parent) {
			return this.getParam("userOpenId") ? this.getParam("userOpenId") : '';
		} else {
			if (window.pOpenId != undefined) {
				return window.pOpenId ? window.pOpenId : '';
			} else {
				return window.parent.pOpenId ? window.parent.pOpenId : '';
			}
		}
	},
};



// 线上重写 console
if (DX.switchs() ==1 ) {
	console.log = function() {};
}

function eve(event) {
	return event || window.event;
}

function WinSize(win) {
	if (win == undefined || win == null) {
		win = window;
	}
	var winHei = win.document.documentElement.clientHeight || win.innerHeight;
	var winWid = win.document.documentElement.clientWidth || win.innerWidth;
	return {
		width: winWid,
		height: winHei
	};
}
//open dialog window
//var parms = { url: "", caption: "", topWin: false, width: 660, height: 390 };
//function dialog(parms = parms) {

//}
/**
 * @method
 * @param {url} 要打开的窗口地址
 * @param { caption } 窗口标题
 * @param {topWin} 窗口是否最顶对话框，用黑色背景显示，禁止多窗口
 * @param {width} 窗口的宽度，像素值
 * @param {height} 窗口的高度，像素值
 * @description 打开小窗口
 */
function dialog(url, caption, topWin, width, height) {
	if (url == undefined || url == null) {
		url = "";
	}
	if (caption == undefined || caption == null) {
		caption = "";
	}
	if (topWin == undefined || topWin == null) {
		topWin = false;
	}
	if (width == undefined || width == null) {
		width = 660;
	}
	if (height == undefined || height == null) {
		height = 390;
	}

	var aUrl = toAbsUrl(url);
	if (self == top) {
		var mSize0 = maxSize(window, width, height);
		openwin(aUrl, caption, topWin, mSize0.width, mSize0.height);
	} else {
		var mSize1 = maxSize(top.window, width, height);
		top.window.openwin(aUrl, caption, topWin, mSize1.width, mSize1.height);
	}
}

function maxSize(win, width, height) {
	var wSize = WinSize(win);
	if (width > wSize.width - 30) {
		width = wSize.width - 30;
	}
	if (height > wSize.height - 30) {
		height = wSize.height - 30;
	}
	return {
		width: width,
		height: height
	};
}

function toAbsUrl(url) {
	var a = document.createElement('a');
	a.href = url;
	return a.href;
}

function openwin(url, caption, topWin, width, height) {
	if (url == undefined || url == null) {
		url = "";
	}
	if (caption == undefined || caption == null) {
		caption = "";
	}
	if (topWin == undefined || topWin == null) {
		topWin = false;
	}
	if (width == undefined || width == null) {
		width = 660;
	}
	if (height == undefined || height == null) {
		height = 390;
	}

	if (window.opener != null && $("#dialogDiv").length == 0) {
		var diadiv = $(document.createElement("div"));
		$(diadiv).attr("id", "dialogDiv");
		diadiv.html(window.opener.window.document.getElementById("dialogDiv").innerHTML);
		$("body").append(diadiv);
		$("#dialogs").html("");
	}
	var exist = false;
	$("#dialogs").find("iframe").each(function() {
		if ($(this).attr("src") == url) {
			var dialog = $(this).parents(".winDialog");
			if (dialog.attr("data-hide") == "1") {
				norWin(dialog.find(".winMin"));
			}
			dialog.css("z-index", getIndex());
			exist = true;
			return false;
		}
	});
	if (exist) {
		return;
	}
	var dom = $("#templet").children().first();
	var div = $(document.createElement("div"));
	div.addClass("winDialog");
	var wSize = WinSize();
	var toTop = (wSize.height - height) / 3;
	if (toTop < 10) {
		toTop = 10;
	}
	var zIndex = getIndex();
	div.css({
		width: width,
		height: height,
		left: (wSize.width - width) / 2,
		top: toTop,
		zIndex: zIndex,
		display: "none"
	});

	div.html(dom.html());
	div.find(".winText").html(caption);
	div.find(".winContent").css({
		width: width - 2,
		height: height
	});
	div.find("iframe").css({
		height: height - 26
	});
	div.find("iframe").attr("src", url);

	var iframId = 'openIframe' + DX.ran(0, 100000);
	div.find("iframe").attr("id", iframId);
	$("#dialogs").append(div);
	if (topWin) {
		resizeBack();
		$("#backGound").css({
			zIndex: zIndex - 1
		});
		$("#backGound").fadeIn("fast");
		div.find(".winMin").hide();
	}
	div.fadeIn("fast");
}

function getIndex() { //to max zindex
	var idx = 510;
	$("#dialogs").children().each(function() {
		var zIdx = parseInt($(this).css("zIndex"));
		idx = Math.max(idx, zIdx);
	});
	return idx + 2; //hold a background
}
//move window
var owin = {
	win: null,
	x: 0,
	y: 0,
	top: 0,
	left: 0
};

function mosDown(who, ev) {
	ev = eve(ev);
	owin.win = $(who).parent();
	owin.x = ev.clientX;
	owin.y = ev.clientY;
	owin.top = parseInt(owin.win.css("top"));
	owin.left = parseInt(owin.win.css("left"));
	owin.win.css({
		zIndex: getIndex(),
		opacity: 0.9
	});
	$(".showFrame").css("pointerEvents", "none");

	// $('#'+$('#tabnav li.active').attr('data-id')).css("pointerEvents", "none");
	$("#dialogs").find("iframe").css("pointerEvents", "none"); //all
}

function mosUp() {
	$(".showFrame").css("pointerEvents", "");
	// $('#'+$('#tabnav li.active').attr('data-id')).css("pointerEvents", "");
	owin.win.css("opacity", 1);
	$("#dialogs").find("iframe").css("pointerEvents", ""); //all
	owin.win = null;
	owin.x = 0;
	owin.y = 0;
	owin.top = 0;
	owin.left = 0;
}
var MdisX, MdisY, MmoveX, MmoveY, ML, MT, MstarX, MstarY, MstarXEnd, MstarYEnd;
$('body').on('touchstart', '.captionModal', function(event) {
	MdisX = event.originalEvent.touches[0].pageX - $(this).parent('.captionModalDialog').offset().left;
	MdisY = event.originalEvent.touches[0].pageY - $(this).parent('.captionModalDialog').offset().top;
	//手指按下时的坐标
	MstarX = event.originalEvent.touches[0].pageX;
	MstarY = event.originalEvent.touches[0].pageY;
	$(this).parent('.captionModalDialog').css({
		zIndex: getIndex(),
		opacity: 0.9
	});
})
$('body').on('touchmove', '.captionModal', function(event) {
	ML = event.originalEvent.touches[0].pageX - MdisX;
	MT = event.originalEvent.touches[0].pageY - MdisY;
	//移动时 当前位置与起始位置之间的差值
	MstarXEnd = event.originalEvent.touches[0].pageX - MstarX;
	MstarYEnd = event.originalEvent.touches[0].pageY - MstarY;
	if (ML < 0) { //限制拖拽的X范围，不能拖出屏幕
		ML = 0;
	} else if (ML > document.documentElement.clientWidth - this.offsetWidth) {
		ML = document.documentElement.clientWidth - this.offsetWidth;
	}
	if (MT < 0) { //限制拖拽的Y范围，不能拖出屏幕
		MT = 0;
	} else if (MT > document.documentElement.clientHeight - this.offsetHeight) {
		MT = document.documentElement.clientHeight - this.offsetHeight;
	}
	MmoveX = ML;
	MmoveY = MT;
	$(this).parent('.captionModalDialog').css('left', MmoveX + 'px')
	$(this).parent('.captionModalDialog').css('top', MmoveY + 'px')
})
$('body').on('touchend', '.captionModal', function(event) {
	$(this).parent('.captionModalDialog').css("opacity", 1);
})
$(document).mousemove(function(ev) {
	if (owin.win == null) {
		return;
	}
	ev = eve(ev);
	var pos = {
		x: ev.clientX,
		y: ev.clientY
	};
	owin.top += pos.y - owin.y;
	owin.left += pos.x - owin.x;
	owin.x = pos.x;
	owin.y = pos.y;
	$(owin.win).css({
		"top": owin.top,
		"left": owin.left
	});
	$(owin.win).attr({
		"data-bottom": WinSize().height - owin.top
	});
});
//close window
// function closeWin(who) {
//     var dialog = $(who).parents(".winDialog");
//     dialog.fadeOut("fast", function () {
//         dialog.remove();
//     });
//     $("#backGound").hide();
// }
//top view background
function hideBack() {
	var zIndex = parseInt($("#backGound").css("zIndex"));
	$("#dialogs").children().each(function() {
		var nWin = $(this);
		if (parseInt(nWin.css("zIndex")) > zIndex) {
			closeWin($(this).find(".winClose"));
		}
	});
}

function resizeBack() {
	var wSize = WinSize();
	$("#backGound").css({
		height: wSize.height,
		width: wSize.width
	});
}
//min window
function chgWin(who) {
	var dialog = $(who).parents(".winDialog");
	if (dialog.attr("data-hide") == "1") {
		norWin(who);
	} else {
		minWin(who);
	}
}

function minWin(who) {
	var dialog = $(who).parents(".winDialog");
	dialog.find(".winRightback").hide();
	dialog.find(".winLeft").hide();
	dialog.find(".winContent").hide();
	dialog.find(".winText").css({
		width: 72,
		textAlign: "left",
		marginLeft: 8
	});
	var oriVal = parseInt(dialog.css("top")) + "," + parseInt(dialog.css("left")) + "," + dialog.width() + "," + dialog.height();
	dialog.attr("data-val", oriVal);

	var toPos = {
		top: 0,
		left: 0
	};
	var winHei = WinSize().height;
	//to min last min pos
	var minPosVal = dialog.attr("data-minpos");
	if (minPosVal != undefined) {
		var minPos = minPosVal.split(',');
		toPos.top = parseInt(minPos[0]);
		toPos.left = parseInt(minPos[1]);
	} else {
		var mPos = getMinPos();
		toPos.top = mPos.top; //winHei - 30;
		toPos.left = mPos.left; //getLeft();
	}


	dialog.animate({
		width: 180,
		height: 23,
		left: toPos.left,
		top: toPos.top
	}, function() {
		$(who).css("backgroundPositionX", 0);
		dialog.attr({
			"data-hide": "1",
			"data-bottom": winHei - toPos.top
		});
	});
}

function getMinPos() {
	var toLeft = 8;
	var minSize = {
		width: 180,
		height: 26
	};
	var line1 = new Array();
	var line2 = new Array();
	var wSize = WinSize();
	$("#dialogs").children().each(function() {
		var nWin = $(this);
		if (nWin.attr("data-hide") == "1") {
			var nTop = parseInt(nWin.css("top"));
			if (nTop > wSize.height - (minSize.height + 8 + 2)) { //line 1，2px offset
				var nNum1 = Math.floor(parseInt(nWin.css("left")) / (minSize.width + 10));
				line1.push(nNum1);
			} else if (nTop > wSize.height - (minSize.height + 8 + 2) * 2) { //line 2，2px offset
				var nNum2 = Math.floor(parseInt(nWin.css("left")) / (minSize.width + 10));
				line2.push(nNum2);
			}
		}
	});
	var minPos = {
		top: 0,
		left: 0
	};
	var maxCount = Math.floor(wSize.width / (minSize.width + 10));
	//line 1
	for (var i = 0; i < maxCount; i++) {
		if (line1.indexOf(i) < 0) {
			minPos.top = wSize.height - (minSize.height + 8);
			minPos.left = (minSize.width + 10) * i;
			return minPos;
		}
	}
	for (var j = 0; j < maxCount; j++) {
		if (line2.indexOf(j) < 0) {
			minPos.top = wSize.height - (minSize.height + 8) * 2;
			minPos.left = (minSize.width + 10) * j;
			return minPos;
		}
	}
	//too many，set in line2 last position（right）
	minPos.top = wSize.height - (minSize.height + 8) * 3;
	minPos.left = 0;
	return minPos;
}
//normal window
function norWin(who) {
	var dialog = $(who).parents(".winDialog");
	//remeber min position
	if (dialog.attr("data-hide") == "1") {
		dialog.attr("data-minpos", parseInt(dialog.css("top")) + "," + parseInt(dialog.css("left")));
	}
	var oriVal = dialog.attr("data-val").split(",");
	var toVal = {
		top: parseInt(oriVal[0]),
		left: parseInt(oriVal[1]),
		width: parseInt(oriVal[2]),
		height: parseInt(oriVal[3])
	};
	dialog.animate({
		width: toVal.width,
		height: toVal.height,
		left: toVal.left,
		top: toVal.top
	}, function() {
		$(who).css("backgroundPositionX", -38);
		dialog.find(".winRightback").show();
		dialog.find(".winLeft").show();
		dialog.find(".winText").css({
			width: "100%",
			textAlign: "center",
			marginLeft: ""
		});
		dialog.find(".winContent").fadeIn();
		if ($("#backGound").css("display") == "none") {
			dialog.find(".winMin").show();
		}
		dialog.find(".winContent").css({
			width: toVal.width - 2,
			height: toVal.height - 30
		});
		dialog.find("iframe").css({
			height: toVal.height - 30
		});
		dialog.attr({
			"data-hide": "0",
			"data-max": "0"
		});
	});
}
//max window
function maxWin(who) {
	var dialog = $(who).parents(".winDialog");
	var oriVal = parseInt(dialog.css("top")) + "," + parseInt(dialog.css("left")) + "," + dialog.width() + "," + dialog.height();
	dialog.attr("data-val", oriVal);
	var wSize = WinSize();
	var winHei = WinSize().height;
	var toHei = winHei - 36;
	dialog.animate({
		width: wSize.width - 12,
		height: wSize.height - 12,
		left: 6,
		top: 6
	}, function() {
		dialog.attr({
			"data-max": "1"
		});
		dialog.find(".winMin").hide();
		dialog.find(".winContent").css({
			width: wSize.width - 12 - 2,
			height: wSize.height - 12 - 30
		});
		dialog.find("iframe").css({
			height: wSize.height - 12 - 30
		});
	});
}
//double click caption
function dbClik(who) {
	var dialog = $(who).parents(".winDialog");
	if (dialog.attr("data-hide") == "1") {
		norWin(dialog.find(".winMin"));
	} else if (dialog.attr("data-max") == "1") {
		norWin(dialog.find(".winMin"));
	} else {
		maxWin(who);
	}
}

//resize window then move minWindow
window.onresize = function() {
	if (window.self != window.top) {
		window.top.moveMinwin();
		window.top.resizeBack()
	} else {
		moveMinwin();
		resizeBack()
	}

};

function moveMinwin() {
	var winHei = WinSize().height;
	$("#dialogs").children().each(function() {
		var nWin = $(this);
		if (nWin.attr("data-hide") == "1") {
			var nBottom = parseInt(nWin.attr("data-bottom"));
			$(this).css("top", winHei - nBottom);
		}
	});
}


//close window
function closeWin(who) {
	var dialog = $(who).parents(".winDialog");
	//    if(isJq){
	// 	dialog = who.parents('.winDialog');
	// }
	dialog.fadeOut("fast", function() {
		dialog.remove();
	});
	$("#backGound").hide();
}


function closePre(url) {

	for (var i = 0; i < document.getElementsByTagName('iframe').length; i++) {

		if (document.getElementsByTagName('iframe')[i].contentWindow.location.href == url) {
			closeWin(document.getElementsByTagName('iframe')[i]);
		}

	}
}


/**
 * @param {Object} dom 弹窗最外层的jq元素
 * @param {type} param 参数{title:'窗口',width:800,height:400,}
 * ondblclick=\"dbClik(this)\"
 */
function jqModal(dom, param) {
	var data = jqInit(param);
	var strVar = "";

	strVar += "<div class='jqueryModal'>";
	strVar += "	        <div>";
	strVar += "	            <div  class=\"winDialog\"  data-val=\"0,0,0,0\" style=" + data.style + "  data-max=1 >";
	strVar +=
		"	                <div id=\"caption\" class=\"winCaption\" style=\"border-top: 1px solid #c1e1ff;border-bottom: 1px solid #c1e1ff;\" onmousedown=\"mosDown(this,event)\" onmouseup=\"mosUp()\" >";
	strVar += "	                    <div class=\"winLeft\">...<\/div>";
	strVar += "	                    <div class=\"winText\">" + data.title + "<\/div>";
	strVar += "	                    <div class=\"winRightback\"><\/div>";
	// strVar += "	                    <div class=\"winMin\" onclick=\"chgWin(this)\"><\/div>";
	strVar += "	                    <div class=\"winClose\" onclick=\"jqcloseWin(this)\"><\/div>";
	strVar += "	                <\/div>";
	strVar += "	                <hr class=\"winLine\" \/>";
	// strVar += "	                <div class=\"winContent\">";
	// strVar += "	                    <iframe name=\"iFrame\" style=\"border:none;width:100%;\" scrolling=\"auto\" frameborder=\"0\" src=\"\" ><\/iframe>";
	// strVar += "	                <\/div>";
	strVar += dom.prop("outerHTML");
	strVar += "	            <\/div>";
	strVar += "	        <\/div>";
	strVar += "	        <div>";
	strVar += "	        <\/div>";
	strVar +=
		"	        <div  id='backGound' style=\"width:100%;height:100%;background-color:#494949;opacity:0.6;position:absolute;top:0;left:0\" ><\/div>";
	strVar += "	    <\/div>";

	$('body').append(strVar);

	dom.css('display', 'block');
}

function jqInit(param) {
	var json = {
		title: '窗口',
		width: 800,
		height: 400,
	}
	if (param.title) {
		json.title = param.title;
	}

	if (param.width) {
		json.width = param.width;
	}

	if (param.height) {
		json.height = param.height;
	}

	var size = WinSize();
	var top = (size.height - json.height) / 2;
	var left = (size.width - json.width) / 2;
	if (top > 80) top = 80;
	json.style = 'top:' + top + 'px;left:' + left + 'px;width:' + json.width + 'px;height:' + json.height + 'px';
	return json;
}

function jqcloseWin(who) {
	var dialog = $(who).parents(".winDialog");
	//    if(isJq){
	// 	dialog = who.parents('.winDialog');
	// }
	dialog.fadeOut("fast", function() {
		dialog.parents('.jqueryModal').remove();
	});

}
