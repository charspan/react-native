import React, { Component } from 'react';
import { View,Text,StyleSheet } from 'react-native';
import moment from 'moment';

export default class SecondTab extends Component{

    constructor(props){
        super(props);
        this.state={
            gatewayInfo: props.gateway,
            showMore:props.ok?props.ok: false,
            showOrHide: '更多...'
        }
    }

    change(){
        this.setState({
            showMore: true
        });
    }

    render(){
        var moreInfo=this.state.showMore ? <View>
            <Text style={{alignSelf:'flex-start',fontSize:18}}>创建人:  {this.state.gatewayInfo.createAccount+"\n"}</Text>
            <Text style={{alignSelf:'flex-start',fontSize:18}}>创建时间:  {moment(this.state.gatewayInfo.createTime).format("YYYY-MM-DD HH:mm:ss")+"\n"}</Text>
            <Text style={{alignSelf:'flex-start',fontSize:18}}>出厂昵称:  {this.state.gatewayInfo.defaultName+"\n"}</Text>
            <Text style={{alignSelf:'flex-start',fontSize:18}}>昵称:  {this.state.gatewayInfo.nickname+"\n"}</Text>
            <Text style={{alignSelf:'flex-start',fontSize:18}}>token:  {this.state.gatewayInfo.token==null?"":this.state.gatewayInfo.token+"\n"}</Text>
            <Text style={{alignSelf:'flex-start',fontSize:18}}>token 过期时间:  {this.state.gatewayInfo.expiresTime==null?"":moment(this.state.gatewayInfo.expiresTime).format("YYYY-MM-DD HH:mm:ss")+"\n"}</Text>
        </View> : null;
        return (
            <View style={{flexDirection:'row', flex:1,backgroundColor:'rgba(0,0,0,0.8)'}}>
                <View style={{flex:1,alignSelf:'center',justifyContent: 'center', padding:40,paddingLeft:50, backgroundColor:'rgba(255,255,255,1)'}}>
                    <Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold'}}>网关详细信息{"\n"}</Text>
                    <Text style={{alignSelf:'flex-start',fontSize:18}}>编号:  {this.state.gatewayInfo.id+"\n"}</Text>
                    <Text style={{alignSelf:'flex-start',fontSize:18}}>序列号:  {this.state.gatewayInfo.serialNumber+"\n"}</Text>
                    <Text style={{alignSelf:'flex-start',fontSize:18}}>版本更新时间:  {moment(this.state.gatewayInfo.lastHttpOnlineTime).format("YYYY-MM-DD HH:mm:ss")+"\n"}</Text>
                    <Text style={{alignSelf:'flex-start',fontSize:18}}>udp 连接时间:  {moment(this.state.gatewayInfo.lastUdpOnlineTime).format("YYYY-MM-DD HH:mm:ss")+"\n"}</Text>
                    <Text style={{alignSelf:'flex-start',fontSize:18}}>tcp 连接时间:  {moment(this.state.gatewayInfo.lastTcpOnlineTime).format("YYYY-MM-DD HH:mm:ss")+"\n"}</Text>
                    <Text style={{alignSelf:'flex-start',fontSize:18}}>状态:  {this.state.gatewayInfo.usable==0?'可用\t\t':'不可用\t\t'}版本:  {this.state.gatewayInfo.version+"\n"}</Text>
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
