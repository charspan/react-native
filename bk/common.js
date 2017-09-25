import React, {Component} from 'React';
import forge from 'node-forge';

export default class common extends Component{

}

//导出方法
function reverseString(str){
    return str.split('').reverse().join('');
}

// md5加密
function md5(str){
    var md = forge.md.md5.create();
    md.update(str);
    var pwdMD5 = md.digest().toHex();
    return pwdMD5;
}

// 加密操作
export function jiami(str){
    str=md5(str);
	var a = str.substring(0, 8);//1
	a=reverseString(a);
	var b = str.substring(8, 16);//2
	var c = str.substring(16, 24);//3
	var d = str.substring(24, 32);//4
	d = reverseString(d);
	return b + d + a + c;
}

export function postJson(url, data, header,callback) {
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

export function postJson1(url, data, header,callback) {
    console.log("header1",header.type);
    console.log("header2",header.account);
    console.log("header3",header.token);
    fetch(url, {
        method: 'POST',
        headers: {
            'type' : header.type,
            'account' : header.account,
            'token' : header.token
        }
    })
    .then((response) => {
        callback(response);
    }).done();
}

export function get(url,params,callback){
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
    }).then((response) => {
        callback(response)
    }).done();
}