import React, { Component } from 'react';
import { View,ScrollView,Modal,Text,Image,StyleSheet,TouchableOpacity,Alert } from 'react-native';
import TextInputBar from '../my_component/TextInputBar';
import ButtonItem from '../my_component/ButtonItem';
import GatewayItem from '../my_component/GatewayItem';
import "../GlobalValue";

export default class subAccountIndex extends Component{

    constructor(props){
        super(props);
        this.state={
            message: props.message,
            header: props.header,
            navigator: props.navigator,
            defaultBinding: {}, // 当前绑定关系对象
            isGatewayShow: false, // 是否显示选择默认网关
        }
        // console.log(props);
        // console.log(props.message.bindings);
        global.storage.load({
            key: 'defaultBinding',
            id: props.message.subAccount.id,
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false,
          }).then(defaultBinding => {
            // 如果找到数据，则在then方法中返回
            // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
            // 只能在then这个方法内继续处理ret数据而不能在then以外处理,也没有办法“变成”同步返回
            // 也可以使用“看似”同步的async/await语法
            this.setState({
                defaultBinding: defaultBinding
            });
          }).catch(err => {
            if(props.message.bindings.length==0){
                Alert.alert('错误','当前子账号不可用!',[{text: '确定'}]);
            }else if(props.message.bindings.length==1){
                this.setState({
                    defaultBinding: defaultBinding
                });
            }else{
                this.setState({
                    isGatewayShow: true
                });
            }
          });
    }

    renderGatewayItem=(item)=>{
        return <GatewayItem key={item.id} item={item} subAccountId={this.props.message.subAccount.id}/>;
    }

    render(){
        return (
            <View style={{flexDirection:"column",padding:10,backgroundColor:"#da2ed8",}}>
                <Modal // 修改个人信息模态窗口
                    visible={this.state.isGatewayShow}
                    animationType = "fade"
                    //是否透明默认是不透明 false
                    transparent = {true}
                    //关闭时调用
                    onRequestClose={()=>{}}
                >
                    <View style={{flex:1,justifyContent: 'center',backgroundColor:'rgba(0,0,0,0.8)'}}>
                        <View style={{padding:15,height:300, backgroundColor:'#FFBFFF'}}>
                            <Text style={{justifyContent:'center',alignSelf:'center',fontSize:24,color:'white',padding:5}}>智能网关列表</Text>
                            <ScrollView keyboardDismissMode={'on-drag'}>
                                {this.props.message.bindings.map(item=>this.renderGatewayItem(item))}
                            </ScrollView>
                            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:10}}>
                                <ButtonItem label="仅打开一次" 
                                func={()=> {
                                    // 读取选中的网关信息
                                    global.storage.load({
                                        key: 'defaultBinding',
                                        id: this.props.message.subAccount.id,
                                        // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                                        autoSync: false,
                                      }).then(defaultBinding => {
                                        // 如果找到数据，则在then方法中返回
                                        // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
                                        // 只能在then这个方法内继续处理ret数据而不能在then以外处理,也没有办法“变成”同步返回
                                        // 也可以使用“看似”同步的async/await语法
                                        this.setState({
                                            defaultBinding: defaultBinding
                                        });
                                        console.log(this.state.defaultBinding);
                                        // 隐藏网关选中列表
                                        this.setState({isGatewayShow: false});
                                      }).catch(err => {
                                        Alert.alert('错误','请选择一个绑定网关!',[{text: '确定'}]);
                                      });
                                      console.log(this.state.defaultBinding);
                                      // 移除本地的选中网关信息
                                      global.storage.remove({key:'defaultBinding',id:this.props.message.subAccount.id});
                                }}/>
                                <ButtonItem label="设置为默认" 
                                func={()=>{
                                   // 读取选中的网关信息
                                   global.storage.load({
                                        key: 'defaultBinding',
                                        id: this.props.message.subAccount.id,
                                        // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                                        autoSync: false,
                                    }).then(defaultBinding => {
                                        // 如果找到数据，则在then方法中返回
                                        // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
                                        // 只能在then这个方法内继续处理ret数据而不能在then以外处理,也没有办法“变成”同步返回
                                        // 也可以使用“看似”同步的async/await语法
                                        this.setState({
                                            defaultBinding: defaultBinding
                                        });
                                        console.log(this.state.defaultBinding);
                                        // 隐藏网关选中列表
                                        this.setState({isGatewayShow: false});
                                    }).catch(err => {
                                        Alert.alert('错误','请选择一个绑定网关!',[{text: '确定'}]);
                                    });
                                }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={{justifyContent: 'center',height:100}}>
                    <Text onPress={()=> this.setState({isGatewayShow: true})}>显示显示显示显示显示显示显示显示显示显示</Text>
                </View>
                <Text onPress={()=> this.setState({isGatewayShow: true})}>{JSON.stringify(this.state.defaultBinding)}</Text>
            </View>
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
    }
});
