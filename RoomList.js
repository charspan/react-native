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

export default class RoomList extends Component{
  
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
      // 获取工程编号
      projectId: props.projectId,
      // 初始化工程列表
      rooms: props.rooms,
      // 初始化子账号权限信息
      rights: props.rights
    }
  }

  renderRow=(rowData,sectionID, rowID)=> {
    var img
    if(this.state.rights[this.state.projectId]==undefined){
      img=require('./img/unChecked.png');
    } else {
      img = this.state.rights[this.state.projectId].indexOf(rowData.id)==-1 ? require('./img/unChecked.png') : require('./img/checked.png');
    }
    return (
      <View>
        <View style={styles.row}>
          <TouchableOpacity // 点击勾选当前房间
            style={{flex:1}}
            onPress={()=>{
              if(this.state.rights[this.state.projectId]==undefined){
                this.state.rights[this.state.projectId]='.'+rowData.id+'.';
              }else{
                if(this.state.rights[this.state.projectId].indexOf(rowData.id)==-1){
                  this.state.rights[this.state.projectId]+=rowData.id+'.';
                }else{
                  this.state.rights[this.state.projectId]=this.state.rights[this.state.projectId].replace(rowData.id+'.','');
                }
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
          <TouchableOpacity // 点击查看房间详情
            style={{flex:3}}
            onPress={()=>{
              //console.log("第"+rowID+"行被点击了");
              Alert.alert('房间详情',JSON.stringify(rowData),[{text: '确定'}]);
            }}
          >
            <Text style={{fontSize:18,color:'blue'}}>
              {"编号: "+rowData.id+"  名称: "+rowData.name}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{height:2,backgroundColor:'white'}} />
      </View>
    );
  }
  
  render() {
    return (
      <ListView
        dataSource={this.state.dataSource.cloneWithRows(this.state.rooms)}
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
