import React, {Component} from 'React';
import forge from 'node-forge';

// 请求基地址
export const base_url="http://www.rudolphsmart.com:8080/v2/";

// 获取1~999随机正整数
export function getRandomNum(){
	return Math.ceil(Math.random()*999);
}

// 翻转字符串，如“abc”翻转位“cba”
function reverseString(str){
    return str.split('').reverse().join('');
}

// md5加密
export function md5(str){
    var md = forge.md.md5.create();
    md.update(str);
    return md.digest().toHex();
}

// 自定义加密操作
export function jiami(str){
    str=md5(str);
    return reverseString(str.substring(8, 16)) + str.substring(0, 8) + reverseString(str.substring(24, 32)) + str.substring(16, 24);
}

// http post方法 发生接送数据
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

// http delete方法
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

// http put方法
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

// http get方法
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
        callback(response);
    }).done();
}