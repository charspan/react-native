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
      // 初始化权限信息
      rights: props.rights,
      // 隐藏工程列表显示房间列表回调方法
      callbackHide: props.callbackHide
    }
  }
  
  // 绑定上下文 方法二 ()=>{}
  renderRow=(rowData,sectionID, rowID)=> {
      var img = this.state.rights[rowData.id]==undefined ? require('./img/unChecked.png') : require('./img/checked.png');
      return (
        <View>
        
          <View style={styles.row}>
            <TouchableOpacity // 点击勾选当前工程
              style={{flex:1}}
              onPress={()=>{
                if(this.state.rights[rowData.id]==undefined){
                  this.state.rights[rowData.id]='.';
                }else{
                  delete this.state.rights[rowData.id];
                }
                this.setState({
                  rights: this.state.rights
                });
                console.log("子页面right:",this.state.rights);
              }}
            >
              <Image
                style={styles.thumb}
                source={img}
              />
            </TouchableOpacity>
            <TouchableOpacity // 点击查看工程详情
              style={{flex:3}}
              onPress={()=>{
                //console.log("第"+rowID+"行被点击了");
                Alert.alert('工程详情',JSON.stringify(rowData),[{text: '确定'}]);
              }}
            >
              <Text style={{fontSize:16,color:'blue'}}>
                {"编号: "+rowData.id+"  名称: "+rowData.name + "\n备注: " +rowData.remark}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity //点击修改子账号权限信息
              onPress={()=>{
                // 隐藏工程列表显示房间列表
                this.state.callbackHide(rowData.id);//,this.state.rights);
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
