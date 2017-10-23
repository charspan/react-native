import React, {Component} from 'react';
import {
    StyleSheet,  
    Text,  
    Image,  
    View,  
    TextInput,
    TouchableHighlight,
    Alert
} from 'react-native';

import {base_url,getRandomNum,jiami,httpPostJson,httpGet} from './common';
import CheckBox from './my_component/CheckBox.js';
import SuperAccountIndex from './superAccount/superAccountIndex';

// 登录界面
export default class login extends Component {

    constructor(props){
        super(props);
        this.state=({
            account: '0579-QQ-12-3-204', // 登录账号,设置默认账号测试用
            password: '123456', // 登录密码,设置默认密码测试用
            accountType: 1, // 登录账号类型, 1 代表超级账号 0 代表子账号,默认为 1
        });
    };

    render() {
        return (
            <View style={{backgroundColor:'#ffffff',flex:1,paddingTop: 150}}>
                {/*logo*/}
                <Image style={styles.style_image} source={require('./img/logo.png')}/>
                {/*账号输入框*/}
                <TextInput
                    style={styles.style_user_input}
                    placeholder='账    号'
                    numberOfLines={1}
                    // autoFocus={true}
                    underlineColorAndroid={'transparent'}
                    textAlign='center'
                    defaultValue={this.state.account}
                    onChangeText={(text) => {
                        this.setState({
                            account: text
                        });
                    }}
                />
                {/*密码输入框*/}
                <TextInput  
                    style={styles.style_pwd_input}
                    placeholder='密    码'  
                    numberOfLines={1}
                    underlineColorAndroid={'transparent'}
                    secureTextEntry={true}
                    textAlign='center'
                    defaultValue={this.state.password}
                    onChangeText={(text) => {
                        this.setState({
                            password: text
                        });
                    }}
                />
                {/*单选列表*/}
                <View style={{marginTop:20,height:20,width:100, marginLeft:100}}>
                    <CheckBox
                        text='  管理员'
                        checked={this.state.accountType==1}
                        textAtBehind={true}
                        onClickFunc={()=>{
                            this.setState({
                                accountType: 1
                            });
                        }}
                    />
                </View>
                <View style={{marginTop:-20,height:20,width:100,marginLeft:200}}>
                    <CheckBox text='  子账号'
                        checked={this.state.accountType==0}
                        textAtBehind={true}
                        onClickFunc={()=>{
                            this.setState({
                                accountType: 0
                            });
                        }}
                    />
                </View>
                {/*登录按钮*/}
                <TouchableHighlight
                    style={styles.style_view_commit}
                    activeOpacity={0.5}
                    underlayColor='#63BFFF'
                    onPress={()=>{
                        // 获取系统时间戳
                        httpGet(base_url+'timestamp/'+this.state.accountType+'/'+this.state.account,{randomCode:getRandomNum()},{},
                        (res0)=>{
                            if(res0.errorcode!=0){
                                Alert.alert('提示','您的账号不存在,请重试!',[{text: '确定'}]);
                                return;
                            }else{
                                // 获取 token
                                httpPostJson(base_url+'tokens/'+ this.state.accountType+'/'+this.state.account,
                                {randomStr:res0.data.randomStr,timestamp:res0.data.timestamp,password:jiami(this.state.password)},{},
                                (res1)=>{
                                    if(res1.errorcode!=0){
                                        Alert.alert('提示','您的密码有误,请重试!',[{text: '确定'}]);
                                        return;
                                    }else{
                                        var header={type:this.state.accountType,account:this.state.account,token:res1.data.token};
                                        // 获取个人信息
                                        httpGet(base_url+'client/info',{},header,
                                        (res2)=>{
                                            if(res2.errorcode!=0){
                                                Alert.alert('提示','验证信息失败,请重试!',[{text: '确定'}]);
                                                return;
                                            }else{
                                                if(this.state.accountType==0){// 子账号
                                                    Alert.alert(
                                                        '子账号页面暂未开放!',
                                                        '您获得的信息是:'+JSON.stringify(res2.data),
                                                        [{text: '确定'}]
                                                    );
                                                }else{// 超级账号
                                                    // 采用替换当前场景
                                                    this.props.navigator.replace({
                                                        name: 'SuperAccountIndex',
                                                        component: SuperAccountIndex,
                                                        params: {
                                                            message: res2.data,
                                                            navigator: this.props.navigator,
                                                            header: header
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }}
                >
                    <View><Text style={{color:'#fff'}}>登录</Text></View>
                </TouchableHighlight>
                {/*底部内容（暂时无用））*/}
                <View style={{flex:1,flexDirection:'row',alignItems:'flex-end',bottom:10}}>
                    <Text style={styles.style_view_unlogin}>无法登录?</Text>  
                    <Text style={styles.style_view_register}>新用户</Text>  
                </View>  
            </View>
        );  
    }  
}  
  
const styles = StyleSheet.create({
    style_image:{
        borderRadius:35,
        height:100,
        width:100,
        marginBottom:40,
        alignSelf:'center',
    },  
    style_user_input:{
        backgroundColor:'#fff',
        height:40,
        borderColor: '#63B8FF', 
        borderBottomWidth: 1,
        marginLeft:10,
        marginRight:10
    },
    style_pwd_input:{
        backgroundColor:'#fff',
        height:40,
        borderColor: '#63B8FF', 
        borderBottomWidth: 1,
        marginLeft:10,
        marginRight:10
    },
    style_view_commit:{
        marginLeft:10,
        marginRight:10,
        marginTop:20,
        backgroundColor:'#63B8FF',
        height:35,
        borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    style_view_unlogin:{
        fontSize:12,
        color:'#63B8FF',
        marginLeft:10,
    },
    style_view_register:{
        fontSize:12,
        color:'#63B8FF',
        marginRight:10,
        alignItems:'flex-end',
        flex:1,
        flexDirection:'row',
        textAlign:'right',
    }
});
