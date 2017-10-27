import React, { Component } from 'react';
import { View,ScrollView,ListView,Modal,Text,Image,StyleSheet,TouchableOpacity,Alert } from 'react-native';
import TextInputBar from '../my_component/TextInputBar';
import ButtonItem from '../my_component/ButtonItem';
import GatewayItem from '../my_component/GatewayItem';
import "../GlobalValue";
import {base_accountmanager_url,base_uidesigner_url,httpPostJson} from "../common"

export default class subAccountIndex extends Component{

    constructor(props){
        super(props);
        this.state={
            message: props.message,
            header: props.header,
            navigator: props.navigator,
            /**
             * defaultBinding存储结构
            {
                "id": 6, // 关系编号
                "superAccountId" : 1,  // 超级账号编号
                "serialNumber":"B0:22:CC:ED:34:93", // 网关序列号
                "account": "superAccount", // 超级账号的账号
                "superRelatedName": "超级账号", // 设置的备注
                "createTime": "2017-04-27 17:36:51.0" // 绑定时间
            }
             */
            defaultBinding: {}, // 默认绑定网关信息
            currentBinding: {}, // 当前使用的绑定网关信息
            isGatewayShow: false, // 是否显示选择默认网关
            projectList: [], // 工程列表
            // 设置listview
            dataSource : new ListView.DataSource({
                rowHasChanged:(r1,r2)=>r1!==r2
            }),
            isOpenProjectOptionShow: false, // 是否显示打开工程选项
            currentProject: {}, // 当前所处工程信息
            isRoomListShow: false, // 是否已经选中工程并打开
        }
        // 读取默认网关，设置默认网关和当前网关
        global.storage.load({
            key: 'defaultBinding',
            id: props.message.subAccount.id,
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false,
          }).then(binding => {
            // 读取默认网关，设置默认网关和当前网关
            this.setState({
                defaultBinding: binding,
                currentBinding: binding
            });
            // 达到此处证明默认网关已经被设置
            // 尝试读取默认工程，设置当前工程
            global.storage.load({
                key: 'defaultProject',
                id: props.message.subAccount.id,
                // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                autoSync: false,
              }).then(project => {
                  // 如果能找到默认的工程,直接打开工程
                  this.setState({
                      currentProject: project,
                      isRoomListShow: true
                  });
                  console.log("默认工程",this.state.currentProject);

              }).catch(err => {
                // 读取不到默认工程，则加载工程列表,让用户选择工程
                this.loadDefaultProjectList();
              });
          }).catch(err => {
            if(props.message.bindings.length==0){
                Alert.alert('错误','当前子账号不可用!',[{text: '确定'}]);
            }else if(props.message.bindings.length==1){ // 当前子账号只绑定了一个网关，那么默认就是那一个网关
                this.setState({
                    defaultBinding: props.message.bindings[0],
                    currentBinding: props.message.bindings[0]
                });
                // 加载工程列表
                this.loadDefaultProjectList();
            }else{
                this.setState({
                    isGatewayShow: true
                });
            }
          });
    }

    // 渲染网关列表
    renderGatewayItem=(item)=>{
        return <GatewayItem key={item.id} item={item} subAccountId={this.props.message.subAccount.id}/>;
    }

    // 加载当前选中网关 && 加载工程列表 && 根据是否设置为默认来设置默认绑定网关信息
    loadDefaultBinding=(isAlways)=>{
        // 读取选中的网关信息
        global.storage.load({
            key: 'currentBinding',
            id: this.props.message.subAccount.id,
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false,
        }).then(binding => {
            // 设置当前选中网关，隐藏选择网关列表
            this.setState({
                currentBinding: binding,
                isGatewayShow: false
            });
            // 换个网关但是没换默认网关 或者 为设置默认网关情况
            if(this.state.currentBinding.id!=this.state.defaultBinding.id){
                this.setState({
                    currentProject: {}, // 默认绑定网关都已经换了，所以默认工程不得不换
                    isRoomListShow: false, // 隐藏房间列表并显示工程列表
                });
                console.log("网关仅打开一次");
                // 加载工程列表
                this.loadDefaultProjectList();  
            }else{// 读取默认工程
                global.storage.load({
                    key: 'defaultProject',
                    id: this.props.message.subAccount.id,
                    // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                    autoSync: false,
                  }).then(project => {
                      // 如果能找到默认的工程,直接打开工程
                      this.setState({
                          currentProject: project,
                          isRoomListShow: true
                      });
                      console.log("切换回来 读取默认工程",this.state.currentProject);
                  }).catch(err => {
                    // 读取不到默认工程，则加载工程列表,让用户选择工程
                    this.setState({
                        isRoomListShow: false
                    });
                    this.loadDefaultProjectList();
                  });
            }
            // 将当前选中的绑定网关信息设置为默认绑定网关
            if(isAlways){
                // 要用值区做比较，不能用对象，因为对象存储地址不一样！：{}！={}
                // 为何可以这么做？因为
                // 1. 第一次设置的时候 defaultBinding 值为{}肯定与 currentBinding 不相等，
                //        实质是undefined与currentBinding比较,
                //        只是多做了一次 currentProject: {}设置操作，刚好第一次设置currentProject就应该是{}
                // 2. 在多次设置的时候 defaultBinding与currentBinding都不为空，
                //    可以做正常逻辑比较（不相同才需要更换缓存网关，重新加载工程列表）
                if(this.state.currentBinding.id!=this.state.defaultBinding.id){
                    // 利用本地缓存的方式，实现通知父组件选中的网关信息
                    global.storage.save({
                        key: 'defaultBinding',
                        id: this.props.message.subAccount.id,
                        data: this.state.currentBinding,
                        // 如果不指定过期时间，则会使用defaultExpires参数，设为null，则永不过期
                        expires: null
                    });
                    // 不要忘记删除默认工程缓存
                    global.storage.remove({key:'defaultProject',id:this.props.message.subAccount.id});
                    this.setState({
                        defaultBinding: this.state.currentBinding,
                        currentProject: {}, // 默认绑定网关都已经换了，所以默认工程不得不换
                        isRoomListShow: false, // 隐藏房间列表并显示工程列表
                    });
                    // 加载工程列表
                    this.loadDefaultProjectList();   
                }
            }
        }).catch(err => {
            Alert.alert('提示','请选择一个绑定网关!',[{text: '确定'}]);
        });
        // 这里不删除当前选择的网关，下次可以显示当前选中的网关
        //global.storage.remove({key:'currentBinding',id:this.props.message.subAccount.id});
    }

    // 加载工程列表
    loadDefaultProjectList=()=>{
        httpPostJson(base_accountmanager_url+"/UIDesigner/"+this.state.currentBinding.superAccountId+"/projects",{},this.props.header,(res)=>{
          //  console.log(res.data.projectList);
            this.setState({
                projectList: res.data.projectList
            });
        })
    }

    /**
     * 渲染工程列表每一行
     * 
     * rowData格式：
     * {
     *  "id":289, // 工程编号
     *  "name":"测试新建控件",
     *  "remark":"新建控件需带上图标名称",
     *  "isCollect":0,
     *  "img":"18/289/1.jpg",
     *  "phoneImgName":null
     * }
     */
    renderRow=(rowData,sectionID, rowID)=> {
    // console.log(JSON.stringify(rowData));
        return (
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                    style={{flex:2,}}
                    onPress={()=>{
                        // 默认网关是否已经选中（没选中默认网关的情况下不能设置默认工程）且 当前的网关必须等于默认网关 才能选择默认工程
                        if(this.state.defaultBinding.id!=undefined&&this.state.defaultBinding.id==this.state.currentBinding.id){
                            this.setState({
                                currentProject: rowData,
                                isOpenProjectOptionShow: true
                            });
                        }else{
                            // 直接进入,当前选中的工程
                            console.log("没选中默认网关的情况下不能设置默认工程，所以直接打开");
                            this.setState({
                                currentProject: rowData
                            });
                        }
                    }}
                >
                    <View style={{flex:1,flexDirection:'row'}}>
                        <Image source={rowData.phoneImgName==null||rowData.phoneImgName=='emptyImg'?require('../img/logo.png'):{uri: base_uidesigner_url+rowData.phoneImgName}} style={{width:60,height:60,marginLeft:10,margin:10}}/>
                        <View style={{ justifyContent:'center'}}>
                            <Text style={{marginTop:5, fontSize:17,width:180}} numberOfLines={1}>名称:{rowData.name}</Text>
                            <Text style={{marginBottom:5, fontSize:13, color:'green',width:180}} numberOfLines={1}>备注:{rowData.remark}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                    <Image
                        style={{width: 35,height: 35,alignSelf:'center'}}
                        source={require('../img/unChecked.png')}
                    />
                    <Image
                        style={{width: 35,height: 35,alignSelf:'center'}}
                        source={require('../img/unChecked.png')}
                    />
                </View>
            </View>
        );
    }

    render(){
        return (
            <View style={{flex:1,flexDirection:"column",padding:10}}>
                <Modal // 选择网关模态窗口
                    visible={this.state.isGatewayShow}
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
                                <ButtonItem label="仅打开一次" func={()=>{this.loadDefaultBinding(false);}}/>
                                <ButtonItem label="设置为默认" func={()=>{this.loadDefaultBinding(true);}}/>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal // 打开工程选项
                    visible={this.state.isOpenProjectOptionShow}
                    //是否透明默认是不透明 false
                    transparent = {true}
                    //关闭时调用
                    onRequestClose={()=>{}}
                >
                    <View style={{flex:1,justifyContent: 'center',backgroundColor:'rgba(0,0,0,0.8)'}}>
                        <View style={{padding:15,height:300, backgroundColor:'#FFBFFF'}}>
                            <Text style={{justifyContent:'center',alignSelf:'center',fontSize:24,color:'white',padding:5}}>工程详细信息</Text>
                            <Text style={{fontSize:20,color:'white',padding:10}}>编号: {this.state.currentProject.id}</Text>
                            <Text style={{fontSize:20,color:'white',padding:10}}>名称: {this.state.currentProject.name}</Text>
                            <Text style={{fontSize:20,color:'white',padding:10}}>备注: {this.state.currentProject.remark==""?"无":this.state.currentProject.remark}</Text>
                            <Text style={{fontSize:20,color:'white',padding:10}}>是否收藏: {this.state.currentProject.isCollect==1?"是":"否"}</Text>
                            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:10}}>
                                <ButtonItem label="仅打开一次" func={()=>{
                                  console.log("一次性工程",this.state.currentProject);
                                  this.setState({
                                        isRoomListShow:true,
                                        isOpenProjectOptionShow: false
                                    });
                                }}/>
                                <ButtonItem label="设置为默认" func={()=>{
                                     // 利用本地缓存的方式，实现通知父组件选中的网关信息
                                    global.storage.save({
                                        key: 'defaultProject',
                                        id: this.props.message.subAccount.id,
                                        data: this.state.currentProject,
                                        // 如果不指定过期时间，则会使用defaultExpires参数，设为null，则永不过期
                                        expires: null
                                    });
                                    this.setState({
                                        isOpenProjectOptionShow: false,
                                        isRoomListShow:true
                                    });
                                }}/>
                            </View>
                        </View>
                    </View>
                </Modal>

                <View style={{flexDirection:'column', justifyContent: 'center',height:50,backgroundColor:'red'}}>
                    <Text style={{fontSize:20}} onPress={()=>this.setState({isGatewayShow: true})}>默认网关：{this.state.defaultBinding.id}</Text>
                    <Text style={{fontSize:20}} onPress={()=>this.setState({isGatewayShow: true})}>当前网关：{this.state.currentBinding.id}</Text>
                </View>
                {/* 工程列表 */}
                { 
                    !this.state.isRoomListShow?(
                        <View style={{justifyContent: 'center',flex:1}}>
                            <Text style={{justifyContent:'center',alignSelf:'center',fontSize:24,padding:5}}>工程列表</Text>
                            <ListView
                                removeClippedSubviews={true}
                                enableEmptySections={true}
                                dataSource={this.state.dataSource.cloneWithRows(this.state.projectList)}
                                renderRow={this.renderRow}
                                showsVerticalScrollIndicator={false}
                                initialListSize={4}
                                pageSize={1}
                            />
                        </View>
                    ) : (
                        
                        <Text stye={{color:"white",fontSize:20}}
                            onpress={()=>{
                                console.log("当前网关",this.state.currentBinding);
                                console.log("当前工程",this.state.currentProject);
                            }}
                        >我已经确认当前的网关和当前的工程，现在可以展示房间了</Text>
                    )
                }
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
    },
});
