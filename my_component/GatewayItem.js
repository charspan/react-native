import React, { Component } from 'react';
import { View,Text,TouchableOpacity,Modal,Image,StyleSheet } from 'react-native';
import "../GlobalValue";

export default class GatewayItem extends Component{
    constructor(props){
        super(props);
        this.state={
            isChecked: false, // 是否被选中
            readThreadId: -1, // 循环读取的“线程号”
        }
        // 每100毫秒读取自己是否被选中，进而修改UI
        var readThreadId = setInterval(()=>{
            global.storage.load({
                key: 'currentBinding', // 当前选中的绑定关系
                id: props.subAccountId, // 以当前子账号的编号作为id
                // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                autoSync: false,
              }).then(defaultBinding => {
                // 如果找到数据，则在then方法中返回
                // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
                // 只能在then这个方法内继续处理ret数据而不能在then以外处理,也没有办法“变成”同步返回
                // 也可以使用“看似”同步的async/await语法
                if(defaultBinding.id==props.item.id){
                    this.setState({isChecked:true});
                }else{
                    this.setState({isChecked:false});
                }
              }).catch(err => {
                this.setState({isChecked:false});
              });
              this.setState({
                readThreadId: readThreadId
              });
        },100);
        
    }

    // 当组件要被从界面上移除的时候清除setInterval
    componentWillUnmount(){
        clearInterval(this.state.readThreadId);
    }
    
    render(){
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={()=>{
                    // 利用本地缓存的方式，实现通知父组件当前选中的网关信息
                    global.storage.save({
                        key: 'currentBinding',
                        id: this.props.subAccountId,
                        data: this.props.item,
                        // 如果不指定过期时间，则会使用defaultExpires参数，设为null，则永不过期
                        expires: null
                    });
                    // 设置被选中
                    this.setState({isChecked:true});
                }}
            >
                
                <View style={this.state.isChecked?styles.checked:styles.unchecked}>
                    <View style={{flex:4,justifyContent:"center",}}>
                        <Text style={styles.gatewayTxt}>账号: {this.props.item.account}</Text>
                        <Text style={styles.gatewayTxt}>昵称: {this.props.item.superRelatedName}</Text>
                        <Text style={styles.gatewayTxt}>设备号: {this.props.item.serialNumber}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:"center"}}>
                        <Image 
                            style={styles.img}
                            source={this.state.isChecked?require('./img/checkbox_enabled.png'):require('./img/checkbox_disabled.png')}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    gatewayTxt: {
        fontSize:20,
        color: "white"
    },
    img: {
        width: 35,
        height: 35,
        alignSelf: 'center'
    },
    checked: {
        padding:10,
        marginBottom:5,
        flexDirection:"row",
        backgroundColor:"#ff2fd8",        
    },
    unchecked: {
        padding:10,
        marginBottom:5,
        flexDirection:"row",
        backgroundColor:"#da2eff99",  
    }
});
