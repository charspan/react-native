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
                console.log('点击查看房间列表信息'+rowID);
                httpPostJson(base_url+"UIDesigner/"+this.state.superAccountId+"/"+rowData.id+"/rooms",{},this.state.header,
                (res)=>{
                  console.log(res);
                  Alert.alert('房间列表详情',JSON.stringify(res.data),[{text: '确定'}]);
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
