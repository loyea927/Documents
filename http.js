// import axios from 'axios'
import urtil from './urtil'
import {getApi} from "../api/index.js"
import store from '../store/index'
// import {Toast} from 'vant'
// import router from '../router/index.js'
// let paramObj=[];
axios.defaults.timeout = 10000;
let isloading = 0;
axios.interceptors.request.use((config) => {
		if(isloading == 0 ){
      isloading = setTimeout(function(){
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
        });
        store.commit('showLoading');
      },500);			
		}
    return config
})


axios.interceptors.response.use((resp) => {
    if(isloading > 0){       
        clearTimeout(isloading)
        isloading = 0;        
    }
    store.commit('hideLoading');
    Toast.clear();
	if(resp.data.code){
		if (resp.data.code == 100) {//去app登录
		    if (process.env.NODE_ENV === "production") {
		        urtil.toAppLogin();
		    } else {
		        // router.replace({path: '/login'})
		        vm.$toast('请重新登录');
		        vm.$router.replace({path:"/login"});
		    }
		} else if (resp.data.code == 101) {//刷新token
		
		    // store.commit('updateReload',true);
		     vm.$toast('登录异常');
		    setTimeout(function () {
		        urtil.toAppIndex();
		        // vm.$router.replace({path:"/login"})
		    }, 1000);
		}else if (resp.data.code != 200) {
		    // let title = resp.data.msg;
		    // if (title === "" || title.length >= 30) {
		    //     resp.data.msg = '操作失败！'
		    // }
		     vm.$toast(resp.data.msg);
		}
	}
    console.log(resp)
    return Promise.resolve(resp.data)
}, (e) => {
    // console.log(e)
    store.commit('hideLoading')
    return Promise.reject(e)

})


//获取token
function getToken() {
    // if (process.env.NODE_ENV != 'production') {//本地环境取参数
    //     return sessionStorage.getItem('Token');
    // } else {
        return urtil.getToken();
    // }
}

function get(url, param) {
    let purl = getApi(url)
    if (!param) param = {}
    param.Token = getToken()
    return axios.get(purl, {params: param})
}

function post(url, param) {
    let purl = getApi(url)
    if (!param) param = {}
    param.Token = getToken()
    let configs = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    };
    let params = urtil.formatParams(param);
    return axios.post(purl, params, configs)
}
function bodypost(url, param) {
    let purl = getApi(url)
    if (!param) param = {}
    param.Token = getToken()
    let configs = {
        headers: {'Content-Type': 'application/json;charset=utf-8'}
    };
    let params = urtil.formatParams(param);
    return axios.post(purl, params, configs)
}
function postForJson(url, param) {
    let purl = getApi(url)
    if (!param) param = {}
    let configs = {
        headers: {'Content-Type': 'application/json','Token': getToken()}
    };
    let params = JSON.stringify(param);
    return axios.post(purl, params, configs)
}

function uploadFile(url, file) {
    let forms = new FormData()
    let configs = {
        headers: {'Content-Type': 'multipart/form-data'}
    };
    let send = '';
    if (file.target) {
        send = file.target.files[0];
    } else {
        send = file;
    }
	console.log(send)
    forms.append('file', send)
    forms.append('Token', getToken())
    let purl = getApi(url)
    return axios.post(purl, forms, configs)
}

function uploadeMessage(url, pram) {
    let forms = new FormData()
    let configs = {
        headers: {'Content-Type': 'multipart/form-data'}
    };
    let send = '';
    for(var keys in pram.pram){
		forms.append(keys,pram.pram[keys])
	}
    forms.append('Token', getToken())
    let purl = getApi(url)
    return axios.post(purl, forms, configs)
}


/**
 * 
 * @param {*} url 
 * @param {*} arg 
 * @param {*} fileList file对象数组
 */
function uploadFileAndArgs(url,obj){//图片和参数一起提交
	let forms = new FormData();

	let configs = {
		headers:{'Content-Type':'multipart/form-data'}
	};
	//图片流数组
	if(obj.fileList.length){
		for(var i=0;i<obj.fileList.length;i++){
			if(obj.fileList[i].file){
				forms.append('files',obj.fileList[i].file)
			}
		}
	}
	
	//参数数组
	for(var keys in obj.arg){
		forms.append(keys,obj.arg[keys])
	}
	forms.append('Token',getToken())
	let purl = getApi(url)
	return  axios.post(purl,forms ,configs)
}
function uploadFileAndArg(url,obj){//图片和参数一起提交
	let forms = new FormData();

	let configs = {
		headers:{'Content-Type':'multipart/form-data'}
	};
	//图片流数组
	if(obj.fileList.length){
		for(var i=0;i<obj.fileList.length;i++){
			if(obj.fileList[i].file){
				forms.append('file',obj.fileList[i].file)
			}
		}
	}
	
	//参数数组
	for(var keys in obj.arg){
		forms.append(keys,obj.arg[keys])
	}
	forms.append('Token',getToken())
	let purl = getApi(url)
	return  axios.post(purl,forms ,configs)
}
export default {
    get: get,
    post: post,
    postForJson: postForJson,
    uploadFile: uploadFile,
    uploadFileAndArgs:uploadFileAndArgs,
    uploadFileAndArg:uploadFileAndArg,
    uploadeMessage:uploadeMessage,
	bodypost:bodypost
}



