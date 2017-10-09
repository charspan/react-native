import React, { Component } from 'react';
import { View,Text,StyleSheet,Alert,Modal} from 'react-native';
import moment from 'moment';
import ButtonItem from './my_component/ButtonItem';
import {base_url,httpPut,md5, jiami} from './common';
import TextInputBar from './my_component/TextInputBar';
import login from './login';

export default class FourthTab extends Component{

    constructor(props){
        super(props);
        this.state={
            header: props.header,
            password: props.password,
            navigator: props.navigator,
            isChangePasswordShow: false
        }
        console.log(props.password);
        console.log(props.navigator);
    }

    render(){
        return (
            <View style={{flexDirection:'column', flex:1,marginTop:100}}>
            <Modal // 修改个人信息模态窗口
                visible={this.state.isChangePasswordShow}
                //从下面向上滑动 slide
                //慢慢显示 fade
                animationType = {'slide'}
                //是否透明默认是不透明 false
                transparent = {true}
                //关闭时调用
                onRequestClose={()=>{}}
            >
                <View style={{flex:1,justifyContent: 'center',backgroundColor:'rgba(0,0,0,0.8)'}}>
                <View style={{padding:15,height:250, backgroundColor:'rgba(255,255,255,1)'}}>
                    <TextInputBar name="原始密码" txtHide="请输入原始密码" ref={node=>this.changePassword_oldPassword=node}/>
                    <TextInputBar name="新密码" txtHide="请输入新密码" ispassword={true} ref={node=>this.changePassword_newPassword=node}/>
                    <TextInputBar name="确认密码" txtHide="请再次输入新密码" ispassword={true} ref={node=>this.changePassword_password=node}/>
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <ButtonItem label="取 消" func={()=> this.setState({isChangePasswordShow: false})}/>
                    <ButtonItem label="提 交"
                        func={()=>{
                            // 验证原始密码是否正确
                            if(md5(this.changePassword_oldPassword.getValue())==this.state.password){
                                if(md5(this.changePassword_newPassword.getValue())==this.state.password){
                                    Alert.alert('提示','新旧密码一致!',[{text: '确定'}]);
                                } else{
                                    // 验证两次输入密码是否一致
                                    if(this.changePassword_newPassword.getValue()==this.changePassword_password.getValue()){
                                        // 进行网络请求
                                        httpPut(base_url+'client/info',
                                            {password: jiami(this.changePassword_password.getValue())},
                                            this.state.header,
                                            (res)=>{
                                                if(res.errorcode==0){
                                                    this.setState({password:md5(this.changePassword_password.getValue())});
                                                    Alert.alert('提示','密码修改成功!',[{text: '确定',onPress: () => {
                                                        this.setState({isChangePasswordShow: false});
                                                    }}]);
                                                }else{
                                                    Alert.alert('错误提示','密码修改失败,请重试!',[{text: '确定'}]);
                                                }
                                            }
                                        );
                                    } else{
                                        Alert.alert('错误提示','两次输入密码不一致,请重试!',[{text: '确定'}]);
                                    }
                                }
                            } else{
                                Alert.alert('错误提示','原始密码错误,请重试!',[{text: '确定'}]);
                            }
                        }}
                    />
                    </View>
                </View>
                </View>
            </Modal>
                <View style={{flexDirection:'row',flex:1,alignSelf:'center',justifyContent: 'flex-end', padding:40,paddingLeft:50, backgroundColor:'rgba(255,255,255,1)'}}>
                    <ButtonItem label="修改密码" func={()=> this.setState({isChangePasswordShow: true})}/>
                </View>
                <View style={{flexDirection:'row',flex:1,alignSelf:'center',justifyContent: 'flex-end', padding:40,paddingLeft:50, backgroundColor:'rgba(255,255,255,1)'}}>
                    <ButtonItem label="退出登录" func={()=> {
                        Alert.alert(
                            '提示',
                            '确定要退出吗?',
                            [
                                {text: '取消', onPress: () => {}, style: 'cancel'},
                                {text: '确定', 
                                    onPress: () => {
                                        this.state.navigator.replace({
                                            name: 'login',
                                            component: login
                                        });
                                    }
                                },
                            ]
                        );
                    }}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
});
