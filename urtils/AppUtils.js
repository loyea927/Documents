var browser = {
	versions: function() {
		var u = navigator.userAgent,
			app = navigator.appVersion;
		return { //移动终端浏览器版本信息
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
			iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
		};
	}(),
	language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

let Device = (function() {
	let u = navigator.userAgent;
	let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	if (isAndroid) {
		return 0;
	} else if (isiOS) {
		return 1;
	} else {
		return 2;
	}
})();
export default {
	/**
	 * 格式化参数
	 * @param data
	 * @returns {string}
	 */
	formatParams: function(data) {
		let arr = [];

		for (let name in data) {
			arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
		}

		arr.push(('v=' + Math.random()).replace('.', ''));

		return arr.join('&');
	},
	/**
	 * 判断是安卓还是ios
	 * @return {number} 0 安卓 1 ios 2其他
	 */
	h5userAgent: function() {
		return Device;
	},
	/**
	 * 获取token
	 */
	getToken: function() {
		var token = '';
		// var wx = (function() {  //判断是否是微信
		// 	return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
		// })();
		// if (!this.APP() || wx) { //开发环境或者微信端
		// 	token = this.getCookie('token');
		// 	return token;
		// }else{
		// 	if (browser.versions.android || browser.versions.ios) {
		// 		token = window.prompt("getAppToken");
		// 		return token;
		// 	} else {
		// 		token = this.getParam('token');
		// 		return token || '';
		// 	}
		// }

		// let token = '';
		var wx = (function() {  //判断是否是微信
			return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
		})();
		if (wx) {
			// alert(111);
			token = this.getCookie('token');
			return token;
		}else if(this.environmental() === 0){
			// alert(222);
			return sessionStorage.getItem('Token');
		}else{
			// alert(333);
			try {
				token = window.prompt("getAppToken");
			} catch (e) {
				console.log('获取token');
			}
		}
		return token;
	},
	/**
	 * app横屏
	 */
	horizontalScreen() {
		this.jsCallApp('setHorizontalScreen');
	},
	/**
	 * app竖屏
	 */
	portraitScreen() {
		this.jsCallApp('setPortraitScreen');
	},
	/**
	 * 刷新上一层webview
	 * @param 首页tabbar的下标
	 */
	preReload(value = 1) {
		this.jsCallApp('refreshUrl', value + '');
	},
	/**
	 * 去app登录页面
	 */
	toAppLogin: function() {


		this.jsCallApp('toAppLogin');
	},
	/**
	 * 返回app首页
	 */
	toAppIndex: function(value = 0) {

		this.jsCallApp('backIndex', value + "");
	},
	/**
	 * @param {Object} url 下载地址
	 */
	appDownload: function(url) {
		this.jsCallApp('downLoadScript', url);
	},
	/**
	 * @param {Object} type 调用app相机 视频
	 */
	appCamera: function(value) {
		this.jsCallApp('getAppCamera');
	},
	/**调用app方法
	 * @param {Object} f 方法名
	 * @param {Object} p 参数
	 */
	jsCallApp(f, p) {
		let javscript = "";
		if (Device == 0) { //安卓
			let param = p ? '("' + p + '")' : '()';
			javscript = "window.android." + f + param;
		} else if (Device == 1) {
			p = p ? p : null;
			javscript = "window.webkit.messageHandlers." + f + ".postMessage('" + p + "')";
		} else {
			console.log('调用' + f);
		}
		if (javscript) {
			try {
				console.log(javscript);
				eval(javscript);
			} catch (e) {
				//TODO handle the exception
			}
		}
	},
	/**
	 * 给app写入token
	 */
	setAppToken: function(token) {
		this.jsCallApp('setAppToken', token);
	},
	/**
	 * @param {Object} fid 文件预览
	 */
	preview: function(key, fid) {
		if (process.env.NODE_ENV === 'production') {
			if (process.env.VUE_APP_FLAG === 'pro') { //正式
				var index = window.location.hostname.indexOf("dx185.com");
				var index2 = window.location.hostname.indexOf("cz.dx185.com");
				if (index != -1 && index2 == -1) { //原始线上
					return 'https://ow365.cn/?i=20302&furl=' + encodeURIComponent('http://file.dx185.com/' + key +
						'/file/download?fid=' + fid);
				}else if (index2 != -1) { //川藏
					return 'https://ow365.cn/?i=24358&furl=' + encodeURIComponent('http://cz.dx185.com/' + key +
						'/file/download?fid=' + fid);
				}
			} else {  //测试
				return 'https://ow365.cn/?i=24357&furl=' + encodeURIComponent('http://itest.dx185.com/' + key +
					'/file/download?fid=' + fid);
			}
		} else { //开发环境
			return 'https://ow365.cn/?i=24357&furl=' + encodeURIComponent('http://itest.dx185.com/' + key +
				'/file/download?fid=' + fid);
		}
		
	},
	/**验证值为空或者都是空格
	 * @param {Object} str
	 */
	isNull: function(str) {
		if (str == undefined || str == "" || str == null) return true;
		let regu = "^[ ]+$";
		let re = new RegExp(regu);
		return re.test(str);
	},
	/**
	 * 判断环境
	 * @return {number} 0 本地开发环境 1线上 2测试
	 */
	environmental() {
		if (process.env.NODE_ENV === 'production') {
			if (process.env.VUE_APP_FLAG === 'pro') { //正式环境
				return 1;
			} else { //测试
				return 2;
			}
		} else { //开发环境
			return 0
		}
	},

	getDecvie() {
		return Device
	},
	/* 13位时间戳转日期
	 * param nS 13时间戳 不传默认当前
	 * f 分割符
	 * flag 是否不要小时 默认要
	 * return 时间格式
	 */
	getLocalTime(nS, f, flag) {
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
	/* 获取网址的get参数
	 * @param string 参数名
	 * return 参数值 不存在反回null
	 */
	getParam: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.href.substr(window.location.href.indexOf("?")+1).match(reg);
		if (r != null) return (r[2]);
		return null;
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
	getCookie(key) {
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
	setCookie(key, val, time) {
	    var date = new Date();
	    var expiresDays = time;
	    date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000);
	    // console.log(key+"  v"+val+' t'+date);
	    document.cookie = key + "=" + val + ";expires=" + date.toGMTString() + ";path=/";
	},
}
