import React, { Component } from 'react';
import { View,Text,StyleSheet,Alert,Modal} from 'react-native';
import moment from 'moment';
import ButtonItem from '../my_component/ButtonItem';
import {base_url,httpPut,md5, jiami} from '../common';
import TextInputBar from '../my_component/TextInputBar';
import Login from '../login';
import "../GlobalValue";

export default class FourthTab extends Component{

    constructor(props){
        super(props);
        this.state={
            header: props.header,
            password: props.password,
            isChangePasswordShow: false,
            isDeveloper: global.storage.defaultExpires==1000,
        }
    }

    render(){
        return (
            <View style={{flexDirection:'column', flex:1}}>
                <Modal // 修改密码模态窗口
                    visible={this.state.isChangePasswordShow}
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
                                    if(md5(this.changePassword_oldPassword.getValue())!=this.state.password){
                                        Alert.alert('错误提示','原始密码错误,请重试!',[{text: '确定'}]);
                                    }else{
                                        // 新旧密码是否一致
                                        if(md5(this.changePassword_newPassword.getValue())==this.state.password){
                                            Alert.alert('提示','新旧密码一致!',[{text: '确定'}]);
                                        } else{
                                            // 验证两次输入密码是否一致
                                            if(this.changePassword_newPassword.getValue()!=this.changePassword_password.getValue()){
                                                Alert.alert('错误提示','两次输入密码不一致,请重试!',[{text: '确定'}]);
                                            }else{
                                                // 进行网络请求
                                                httpPut(base_url+'client/info',{password: jiami(this.changePassword_password.getValue())},this.state.header,
                                                (res)=>{
                                                    if(res.errorcode==0){
                                                        this.setState({password:md5(this.changePassword_password.getValue())});
                                                        Alert.alert('提示','密码修改成功!',[{text: '确定',onPress: () => {
                                                            this.setState({isChangePasswordShow: false});
                                                        }}]);
                                                    }else{
                                                        Alert.alert('错误提示','密码修改失败,请重试!',[{text: '确定'}]);
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }}/>
                            </View>
                        </View>
                    </View>
                </Modal>
                
                <View style={styles.viewItem}>
                    <ButtonItem label={this.state.isDeveloper?"关闭开发者模式":"启用开发者模式"} 
                    func={()=> {
                        global.clearStorage();
                        if(this.state.isDeveloper){
                            // 删除单个数据
                            global.storage.remove({key: 'defaultExpires',id: this.props.superAccountId});
                            // 缓存时间设置为一天
                            global.storage.defaultExpires=86400000;
                        }else{
                            // 使用key来保存数据。这些数据一般是全局独有的，常常需要调用的。
                            // 除非你手动移除，这些数据会被永久保存，而且默认不会过期。
                            global.storage.save({
                                key: 'defaultExpires',
                                id: this.props.superAccountId,
                                data: 1000,
                                // 如果不指定过期时间，则会使用defaultExpires参数，设为null，则永不过期
                                expires: null
                            });
                            // 缓存设置时间为1秒
                            global.storage.defaultExpires=1000;
                        }
                        this.setState({isDeveloper:!this.state.isDeveloper});
                        Alert.alert('提示',this.state.isDeveloper?'已关闭开发者模式!':'已启用开发者模式!',[{text: '确定'}]);
                    }}/>
                 </View>

                <View style={styles.viewItem}>
                    <ButtonItem label="修改密码" func={()=> this.setState({isChangePasswordShow: true})}/>
                </View>

                <View style={styles.viewItem}>
                    <ButtonItem label="清理缓存" 
                    func={()=> {
                        global.clearStorage();
                        Alert.alert('提示','缓存已被全部清理！',[{text: '确定'}]);
                    }}/>
                </View>

                <View style={styles.viewItem}>
                    <ButtonItem label="退出登录" 
                    func={()=> {
                        Alert.alert('提示','确定要退出吗?',
                            [   
                                {text: '取消'},
                                {text: '确定', 
                                    onPress: () => {
                                        //global.clearStorage();
                                        this.props.navigator.replace({
                                            name: 'Login',
                                            component: Login
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
    viewItem: {
        flex:1,
        padding:30,
        paddingLeft:50,
        flexDirection:'row',
        backgroundColor:'rgba(255,255,255,1)'
    }
});