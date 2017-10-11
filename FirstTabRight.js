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
      projects: [],
      // 设置本地缓存
      storage : new Storage({
        // 最大容量，默认值1000条数据循环存储
        size: 1000,
        // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
        // 如果不指定则数据只会保存在内存中，重启后即丢失
        storageBackend: AsyncStorage,
        // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
        defaultExpires: 1000 * 3600 * 24,
        // 读写时在内存中缓存数据。默认启用。
        enableCache: true,
        // 如果storage中没有相应数据，或数据已过期，
        // 则会调用相应的sync方法，无缝返回最新数据。
        // sync方法的具体说明会在后文提到
        // 你可以在构造函数这里就写好sync的方法
        // 或是在任何时候，直接对storage.sync进行赋值修改
        // 或是写到另一个文件里，这里require引入
       // sync: require('你可以另外写一个文件专门处理sync')  
      })
    }

    // 先从缓存中读取工程列表,如果没有则进行网络请求
    this.state.storage.load({
      key: 'loginState',
      // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
      autoSync: true,
      // syncInBackground(默认为true)意味着如果数据过期，
      // 在调用sync方法的同时先返回已经过期的数据。
      // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
      syncInBackground: true,
      // 你还可以给sync方法传递额外的参数
      syncParams: {
        extraFetchOptions: {
          // 各种参数
        },
        someFlag: true,
      },
    }).then(ret => {
      // 如果找到数据，则在then方法中返回
      // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
      // 你只能在then这个方法内继续处理ret数据
      // 而不能在then以外处理
      // 也没有办法“变成”同步返回
      // 你也可以使用“看似”同步的async/await语法
      // console.log("缓存中的工程列表: "+JSON.stringify(ret.projects));
      this.setState({
        projects: ret.projects
      });
      console.log("缓存工程个数:"+this.state.projects.length);
    }).catch(err => {

console.log(err);
      if(this.state.projects.length==0){
        httpPostJson(
          base_url+"UIDesigner/"+this.state.superAccountId+"/projects",
          {},
          this.state.header,
          (res)=>{
            console.log("网络请求工程列表");
            if(res.errorcode==0){
              this.setState({
                projects: res.data.projectList
              });
              //console.log(JSON.stringify(res));
              // 使用key来保存数据。这些数据一般是全局独有的，常常需要调用的。
              // 除非你手动移除，这些数据会被永久保存，而且默认不会过期。
              this.state.storage.save({
                key: 'loginState',  // 注意:请不要在key中使用_下划线符号!
                data: {
                  projects: res.data.projectList
                },
                // 如果不指定过期时间，则会使用defaultExpires参数
                // 如果设为null，则永不过期
                expires: 1000 * 3600
              });
            }
          }
        );
      }

      //如果没有找到数据且没有sync方法，
      //或者有其他异常，则在catch中返回
      // console.warn(err.message);
      switch (err.name) {
        case 'NotFoundError':
            // TODO;
            break;
          case 'ExpiredError':
              // TODO
            break;
      }
    });
  }
  
  // 绑定上下文 方法二 ()=>{}
  renderRow=(rowData,sectionID, rowID)=> {
      return (
        <View>
          <View style={styles.row}>
            <TouchableOpacity // 点击查看子账号详情
              style={{flex:1}}
              onPress={()=>{
                console.log("第"+rowID+"行被点击了");
              }}
            >
              <Text style={{fontSize:16,color:'blue'}}>
                {"编号: "+rowData.id+"  名称: "+rowData.name + "\n备注: " +rowData.remark}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity //点击修改子账号权限信息
              onPress={()=>{
                console.log('点击查看房间信息'+rowID);
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
