import React, { Component } from 'react';
import { View,Text,StyleSheet } from 'react-native';
import moment from 'moment';

export default class ThirdTab extends Component{

    constructor(props){
        super(props);
        this.state={
            superAccount: props.superAccount,
            nickname: props.superAccount.nickname,
            mobile: props.superAccount.mobile,
            showMore: false,
            showOrHide: '更多...'
        }
    }

    // 父组件 ref 调用: 修改昵称和手机号显示
    update(nickname,mobile){
        this.setState({
            nickname: nickname,
            mobile: mobile
        });
    }

    render(){
        var moreInfo=this.state.showMore ? <View>
            <Text style={{alignSelf:'flex-start',fontSize:18}}>创建人:  {this.state.superAccount.createAccount+"\n"}</Text>
            <Text style={{alignSelf:'flex-start',fontSize:18}}>创建时间:  {moment(this.state.superAccount.createTime).format("YYYY-MM-DD HH:mm:ss")+"\n"}</Text>
            <Text style={{alignSelf:'flex-start',fontSize:18}}>出厂昵称:  {this.state.superAccount.defaultName+"\n"}</Text>
            <Text style={{alignSelf:'flex-start',fontSize:18}}>token:  {this.state.superAccount.token+"\n"}</Text>
            <Text style={{alignSelf:'flex-start',fontSize:18}}>token 过期时间:  {moment(this.state.superAccount.expiresTime).format("YYYY-MM-DD HH:mm:ss")+"\n"}</Text>
        </View> : null;
        return (
            <View style={{flexDirection:'row', flex:1,backgroundColor:'rgba(0,0,0,0.8)'}}>
                <View style={{flex:1,alignSelf:'center',justifyContent: 'center', padding:40,paddingLeft:50, backgroundColor:'rgba(255,255,255,1)'}}>
                    <Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold'}}>个人详细信息{"\n"}</Text>
                    <Text style={{alignSelf:'flex-start',fontSize:18}}>编号:  {this.state.superAccount.id+"\n"}</Text>
                    <Text style={{alignSelf:'flex-start',fontSize:18}}>昵称:  {this.state.nickname+"\n"}</Text>
                    <Text style={{alignSelf:'flex-start',fontSize:18}}>手机号:  {this.state.mobile+"\n"}</Text>
                    <Text style={{alignSelf:'flex-start',fontSize:18}}>账号:  {this.state.superAccount.account+"\n"}</Text>
                    <Text style={{alignSelf:'flex-start',fontSize:18}}>最后登录:  {moment(this.state.superAccount.lastHttpOnlineTime).format("YYYY-MM-DD HH:mm:ss")+"\n"}</Text>
                    <Text style={{alignSelf:'flex-start',fontSize:18}}>状态:  {this.state.superAccount.usable==0?'可用':'不可用'}</Text>
                    <Text style={{padding: 3,backgroundColor:'rgba(0,0,255,0.5)',alignSelf: 'flex-end',fontSize:16}} onPress={()=>{
                        this.setState({
                            showMore: !this.state.showMore,
                            showOrHide: this.state.showMore?'更多...':'隐藏...'
                        });
                        this.props.scroll(this.state.showMore);
                    }}>{this.state.showOrHide}</Text>
                    {moreInfo}
                </View>
            </View>
        );
    }
}
