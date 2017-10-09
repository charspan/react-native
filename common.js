import React, {Component} from 'React';
import forge from 'node-forge';

export default class common extends Component{

}

export const base_url="http://www.rudolphsmart.com:8080/v2/";

export function getRandomNum(){
	return Math.ceil(Math.random()*999);
}

//导出方法
function reverseString(str){
    return str.split('').reverse().join('');
}

// md5加密
export function md5(str){
    var md = forge.md.md5.create();
    md.update(str);
    var pwdMD5 = md.digest().toHex();
    return pwdMD5;
}

// 加密操作
export function jiami(str){
    str=md5(str);
    var a = str.substring(0, 8);//1
    var b = str.substring(8, 16);//2
    b = reverseString(b);
    var c = str.substring(16, 24);//3
    var d = str.substring(24, 32);//4
    d = reverseString(d);
    return b + a + d + c;
}

export function httpPostJson(url, data, header,callback) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'type' : header.type,
            'account' : header.account,
            'token' : header.token
        },
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((response) => {
        callback(response);
    }).done();
}

export function httpDelete(url, header,callback) {
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'type' : header.type,
            'account' : header.account,
            'token' : header.token
        }
    })
    .then((response) => response.json())
    .then((response) => {
        callback(response);
    }).done();
}

export function httpPut(url, data,header,callback) {
    fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'type' : header.type,
            'account' : header.account,
            'token' : header.token
        },
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((response) => {
        callback(response);
    }).done();
}

export function httpGet(url,params,header,callback){
    if (params) {
        let paramsArray = [];
        //拼接参数
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&')
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    //fetch请求
    fetch(url,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'type' : header.type,
            'account' : header.account,
            'token' : header.token
        }
    })
    .then((response) => response.json())
    .then((response) => {
        callback(response)
    }).done();
}