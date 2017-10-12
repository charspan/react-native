import React, {Component} from 'react';
import Storage from 'react-native-storage';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  AsyncStorage
} from'react-native';
import {base_url,httpPostJson} from './common';
import TextInputBar from './my_component/TextInputBar';
import ButtonItem from './my_component/ButtonItem';
import "./GlobalValue";

export default class FirstTabRight extends Component{
  
  constructor(props){    
    super(props);
    this.state={
      // 接收 http 请求头
      header: props.header,
      // 接收超级账号编号
      superAccountId: props.superAccountId,
      // 设置listview
      dataSource : new ListView.DataSource({
        rowHasChanged:(r1,r2)=>r1!==r2
      }),
      // 初始化工程列表
      projects: props.projects,
      // 初始化房间列表
      rooms: []
    }

    // 设置及时同步数据函数
    global.storage.sync = {
      storageRooms(params){
        console.log("params",params);
        httpPostJson(base_url+"UIDesigner/"+params.syncParams.superAccountId+"/"+params.syncParams.projectId+"/rooms",{},params.syncParams.header,
        (res)=>{
          console.log("网络请求房间列表",res)
          if(res.errorcode==0){
            global.storage.save({
              key: 'storageRooms',  // 注意:请不要在key中使用_下划线符号!
              id: params.syncParams.projectId,
              data: res.data.roomList,
              // 如果不指定过期时间，则会使用defaultExpires参数
              // 如果设为null，则永不过期
              expires: 1000 * 3600 * 0.25  // 15分钟 用户可设置
            });
            // 成功则调用resolve
            params.resolve && params.resolve(res.data.roomList);
          }else{
            // 失败则调用reject
            params.reject && params.reject(new Error('data parse error'));    
          }
        });
      }
    }

  }
  
  // 绑定上下文 方法二 ()=>{}
  renderRow=(rowData,sectionID, rowID)=> {
      return (
        <View>
          <View style={styles.row}>
            <TouchableOpacity // 点击查看工程详情
              style={{flex:1}}
              onPress={()=>{
                console.log("第"+rowID+"行被点击了");
                Alert.alert('工程详情',JSON.stringify(rowData),[{text: '确定'}]);
              }}
            >
              <Text style={{fontSize:16,color:'blue'}}>
                {"编号: "+rowData.id+"  名称: "+rowData.name + "\n备注: " +rowData.remark}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity //点击修改子账号权限信息
              onPress={()=>{
                // 先从缓存中读取工程列表,如果没有则进行网络请求
                global.storage.load({
                  key: 'storageRooms',
                  id: rowData.id,
                  // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                  autoSync: true,
                  // syncInBackground(默认为true)意味着如果数据过期，
                  // 在调用sync方法的同时先返回已经过期的数据。
                  // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
                  syncInBackground: false,
                  // 你还可以给sync方法传递额外的参数
                  syncParams: {// 当找不到缓存数据的时候自动调用方法的参数
                      superAccountId: this.state.superAccountId,
                      projectId: rowData.id,
                      header: this.state.header
                  },
                }).then( rooms => {
                  // 如果找到数据，则在then方法中返回
                  // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
                  // 你只能在then这个方法内继续处理 rooms 数据,而不能在then以外处理,也没有办法“变成”同步返回
                  // 你也可以使用“看似”同步的async/await语法
                  console.log("rooms",rooms);
                  this.setState({
                    rooms: rooms
                  });
                }).catch(err => {
                  //如果没有找到数据且没有sync方法,或者有其他异常，则在catch中返回
                  switch (err.name) {
                    case 'NotFoundError':
                      // TODO;
                    break;
                    case 'ExpiredError':
                      // TODO
                    break;
                  }
                });
              }}
            >
              <Image style={styles.thumb} source={require('./img/power.png')} />
            </TouchableOpacity>
          </View>
          <View style={{height:2,backgroundColor:'white'}} />
        </View>
      );
  }
  
  render() {
    return (
      <ListView
        dataSource={this.state.dataSource.cloneWithRows(this.state.projects)}
        renderRow={this.renderRow}
        isSubAccountEditShowsVerticalScrollIndicator={false}
        enableEmptySections = {true}
      />
    );
  }
}

var styles =StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
    alignItems: 'center'
  },
  thumb: {
    width: 50,
    height: 50,
    borderRadius: 10
  },
});
