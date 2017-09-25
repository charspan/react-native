/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';  
import {  
    AppRegistry,  
    StyleSheet,  
    Text,  
    Image,  
    View,  
    TextInput,
    TouchableHighlight,
    Alert
} from 'react-native';

import common, {jiami,postJson} from './common';
import ModalDropdown from 'react-native-modal-dropdown';
import main from './main';
  
export default class login extends Component {

    static account='';
    static navigator=''
    constructor(props){
        super(props);
        this.state=({
            type: 1,
           // account: '',
            password: '',
            token: ''
        });
        // console.log(this.props);
        // console.log(this.props.navigator);
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
                    autoFocus={true}
                    underlineColorAndroid={'transparent'}
                    textAlign='center'
                    defaultValue='future0005'
                    onChangeText={(text) => {
                        login.account=text
                        // this.setState({
                        //     account: text
                        // });
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
                <TouchableHighlight
                 // <Text>账号类型</Text>
                // <ModalDropdown options={['超级账号', '子账号']}/>
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
                        // Alert.alert(
                        //     '提示',
                        //     '您输入的账号是:'+this.account+"\n"+'您输入的密码是:'+this.password+"\n",
                        //     [
                        //         {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        //         {text: '确定', onPress: () => console.log('OK Pressed')},
                        //     ]
                        // );
                        //console.log(' PWD '+jiami(this.password));
                        var json=new Object();
                            json.type=this.state.type;
                            json.account=login.account;
                            json.password=jiami(this.state.password);
                        
                        postJson('http://www.rudolphsmartt.com:8080/UIDesigner/authAction_getToken.do',json,{},function (res) {
                            //console.log(res);
                            if(res.errorcode==0){
                                console.log("获取有token成功",res);
                                //console.log(res.data.token);
                                var json1=new Object();
                                json1.type=1;
                                // json1.account=this.state.account;
                               // console.log("account "+login.account);
                                json1.account=login.account;
                                json1.token=res.data.token;
                                postJson('http://www.rudolphsmartt.com:8080/UIDesigner/authAction_getSelfInfo.do',{},json1,function (res1) {
                                    console.log(res1) ;
                                    if(res1.errorcode==0){
                                        console.log("获取有自身信息成功",res1);
                                        // login.navigator.replace({
                                        //     scene: main
                                        // });
                                        // 
                                        login.navigator.replace({
                                            name:'SecondPageComonent',
                                            component:main,
                                            params:{
                                                message: res1.data.nickname,
                                                getResult:function(myMessage){
                                                    console.log(myMessage);
                                                }
                                            }
                                        });
                            
                                    }
                                });
                            }
                        });
                        // console.log('state ',this.state.account);
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