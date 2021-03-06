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
} from'react-native';
import {base_accountmanager_url,httpPostJson} from '../common';
import TextInputBar from '../my_component/TextInputBar';
import ButtonItem from '../my_component/ButtonItem';

export default class ProjectList extends Component{
  
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
      callbackShowRooms: props.callbackShowRooms
    }
  }
  
  // 绑定上下文 方法二 ()=>{}
  renderRow=(rowData,sectionID, rowID)=> {
      var img = this.state.rights[rowData.id]==undefined ? require('../img/unChecked.png') : require('../img/checked.png');
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
                this.state.callbackShowRooms(rowData.id);
              }}
            >
              <Image style={styles.thumb} source={require('../img/power.png')} />
            </TouchableOpacity>
          </View>
          <View style={{height:2,backgroundColor:'white'}} />
        </View>
      );
  }
  
  render() {
    return (
      <ListView
        removeClippedSubviews={true}
        enableEmptySections = {true}
        dataSource={this.state.dataSource.cloneWithRows(this.state.projects)}
        renderRow={this.renderRow}
        showsVerticalScrollIndicator={false}
        initialListSize={4}
        pageSize={1}
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
    width: 40,
    height: 40
  },
});
