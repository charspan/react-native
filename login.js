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
//npm start -- --reset-cache
import {base_url,getRandomNum,jiami,httpPostJson,httpGet} from './common';
import CheckBox from './my_component/CheckBox.js';
import superAccountIndex from './superAccountIndex';
  
export default class login extends Component {

    static account='future0005';
    static type=1;
    static navigator;
    constructor(props){
        super(props);
        this.state=({
            password: '123456',
            accountType: true
        });
        login.navigator=this.props.navigator;
    };
    render() {  
        return (  
            <View style={{backgroundColor:'#ffffff',flex:1,paddingTop: 150}}>  
                <Image 
                    style={styles.style_image}
                    source={require('./img/1.png')}/>  
                <TextInput
                    style={styles.style_user_input}
                    placeholder='账号'
                    numberOfLines={1}
                    // autoFocus={true}
                    underlineColorAndroid={'transparent'}
                    textAlign='center'
                    defaultValue='future0005'
                    onChangeText={(text) => {
                        login.account=text
                    }}
                />  
                <View style={{height:1,backgroundColor:'#f4f4f4'}}/>
                <TextInput  
                    style={styles.style_pwd_input}
                    placeholder='密码'  
                    numberOfLines={1}
                    underlineColorAndroid={'transparent'}
                    secureTextEntry={true}
                    textAlign='center'
                    defaultValue='123456'
                    onChangeText={(text) => {
                        this.setState({
                            password: text
                        });
                    }}
                />
                <View style={{height:1,backgroundColor:'#f4f4f4'}}/>
                <View style={{marginTop:20,height:20,width:100, marginLeft:100}}>
                    <CheckBox
                            text='  管理员'
                            checked={this.state.accountType}
                            textAtBehind={true}
                            func={()=>{
                                this.setState({
                                    accountType: true
                                });
                            }}
                    />
                </View>
                <View style={{marginTop:-20,height:20,width:100,marginLeft:200}}>
                    <CheckBox text='  子账号'
                            checked={!this.state.accountType}
                            textAtBehind={true}
                            func={()=>{
                                this.setState({
                                    accountType: false
                                });
                            }}
                    />
                </View>
                <TouchableHighlight
                    style={styles.style_view_commit}
                    activeOpacity={0.5}
                    underlayColor='#63BFFF'
                    onHideUnderlay={()=>{
                        this.setState({text:'衬底被隐藏'})
                    }}
                    onShowUnderlay={()=>{
                        this.setState({text:'衬底显示'})
                    }}
                    onPress={()=>{
                        login.type=this.state.accountType?1:0;
                        // 获取系统时间戳
                        httpGet(base_url+'timestamp/'+login.type+'/'+login.account,{randomCode : getRandomNum()},{},(res0)=>{
                            //console.log('获取系统时间戳',res0);
                            if(res0.errorcode==0){
                                console.log("randomStr",res0.data.randomStr);
                                console.log("timestamp",res0.data.timestamp);
                                // 获取 token
                                httpPostJson(
                                    base_url+'tokens/'+ login.type+'/'+login.account,
                                    {randomStr:res0.data.randomStr,timestamp:res0.data.timestamp,password:jiami(this.state.password)},
                                    {},
                                    (res1)=>{
                                        //console.log('获取 token',res1);
                                        if(res1.errorcode==0){
                                            console.log('token',res1.data.token);
                                            console.log('expiresTime',res1.data.expiresTime);
                                            // 获取个人信息
                                            httpGet(
                                                base_url+'client/info',
                                                {},
                                                {type:login.type,account:login.account,token:res1.data.token},
                                                (res2)=>{
                                                    console.log('selfInfo',res2);
                                                    if(res2.errorcode==0){
                                                        if(login.accountType==0){// 子账号

                                                        }else{// 超级账号
                                                            // 采用替换当前场景
                                                            login.navigator.replace({
                                                                name: 'superAccountIndex',
                                                                component: superAccountIndex,
                                                                params:{
                                                                    message: res2.data,
                                                                    navigator: login.navigator,
                                                                    header: {type: login.type,account: login.account,token: res1.data.token}
                                                                }
                                                            });
                                                        }
                                                    }else{
                                                        Alert.alert(
                                                            '提示',
                                                            '验证信息失败',
                                                            [
                                                                {text: '确定', onPress: () => console.log('OK Pressed')},
                                                            ]
                                                        );
                                                    }
                                                }
                                            );
                                        }else{
                                            Alert.alert(
                                                '提示',
                                                '您的密码有误',
                                                [
                                                    {text: '确定', onPress: () => console.log('OK Pressed')},
                                                ]
                                            );
                                        }
                                    }
                                );
                            }else{
                                Alert.alert(
                                    '提示',
                                    '您的账号不存在',
                                    [
                                        {text: '确定', onPress: () => console.log('OK Pressed')},
                                    ]
                                );
                            }
                        });
                    }}
                >
                    <View>
                        <Text style={{color:'#fff'}}>
                            登录  
                        </Text>  
                    </View>
                </TouchableHighlight>
                <View style={{flex:1,flexDirection:'row',alignItems: 'flex-end',bottom:10}}>
                    <Text style={styles.style_view_unlogin}>  
                        无法登录?
                    </Text>  
                    <Text style={styles.style_view_register}>  
                    新用户  
                    </Text>  
                </View>  
            </View>
        );  
    }  
}  
  
const styles =StyleSheet.create({
    style_image:{  
        borderRadius:35,  
        height:100,  
        width:100,  
        marginTop:10,  
        alignSelf:'center',  
    },  
    style_user_input:{   
        backgroundColor:'#fff',  
        marginTop:10,  
        height:35,  
    },  
    style_pwd_input:{   
        backgroundColor:'#fff',  
        height:35,  
    },  
    style_view_commit:{   
        marginTop:15,  
        marginLeft:10,  
        marginRight:10,  
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
