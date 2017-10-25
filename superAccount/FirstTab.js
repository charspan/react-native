import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableOpacity,
  Alert,
  Modal
} from'react-native';
import {base_url,httpDelete} from '../common';
import TextInputBar from '../my_component/TextInputBar';
import ButtonItem from '../my_component/ButtonItem';

export default class FirstTab extends Component{

    constructor(props){     
      super(props);
      // 绑定上下文 方法1
      //this.renderRow=this.renderRow.bind(this);
      this.state={
        // 接收 http 请求头
        header: props.header,
        // 设置listview
        dataSource: new ListView.DataSource({
          rowHasChanged:(r1,r2)=>r1!==r2
        }),
        // 获取子账号绑定关系列表
        data: props.subAccounts?props.subAccounts:[],
      }
    }

    // 从数组中移除某个元素
    removeByValue(arr, val) {
      for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
          arr.splice(i, 1);
          break;
        }
      }
    }

    // 父组件 ref 调用: 新增子账号绑定关系 & 自动弹出新增子账号绑定关系的编辑权限界面
    addValue(data){
      this.state.data.push(data);
      this.setState({
        data: this.state.data
      });
      this.props.callbackShowProjects(this.state.data.length-1,data);
    }

    // 父组件 ref 调用: 验证新增的子账号是否已经存在
    hasSameValue(account){
      for(var i=0;i<this.state.data.length;i++){
        if(this.state.data[i].account==account){
          return true;
        }
      }
      return false;
    }

    // 父组件 ref 调用: 修改某行数据
    editValue(rowID , rowData , newSubRectiveName){
      rowData.subRelatedName=newSubRectiveName;
      this.state.data.splice(rowID,1,rowData);
      this.setState({
        data: this.state.data
      });
    }

    // 父组件 ref 调用: 更新子账号权限
    updateRights(rowID , rowData , rights){
      rowData.rightJson=rights;
      this.state.data.splice(rowID,1,rowData);
      this.setState({
        data: this.state.data
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
                  this.props.callbackShowSubAccountDetail(rowData);
                }}
              >
                <Text style={{fontSize:16,color:'blue'}}>
                  {"昵称: "+rowData.subRelatedName + "\n账号: " +rowData.account}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity //点击修改子账号权限信息
                onPress={()=>{
                  this.props.callbackShowProjects(rowID,rowData);
                }}
              >
                <Image style={styles.thumb} source={require('../img/power.png')} />
              </TouchableOpacity>

              <TouchableOpacity // 点击修改子账号绑定关系相对昵称
                onPress={()=>{
                  this.props.callbackShowSubAccountEdit(rowID,rowData);
                }}
              >
                <Image style={styles.thumb} source={require('../img/edit.png')} />
              </TouchableOpacity>

              <TouchableOpacity // 点击删除子账号绑定关系
                onPress={()=>{
                  Alert.alert('提示','确定要删除与子账号"'+rowData.account+'"的绑定关系吗?',
                    [
                      {text: '取消'},
                      {text: '确定', onPress: () => {
                        httpDelete(base_url+'relative/'+rowData.id,this.state.header,
                        (res)=>{
                          if(res.errorcode==0){
                            this.removeByValue(this.state.data,rowData);
                            this.setState({data: this.state.data});
                          }else{
                            Alert.alert('错误提示','删除子账号绑定关系失败,请重试!',[{text: '确定'}]);
                          }
                        });
                      }},
                    ]
                  );
                }}
              >
                <Image style={styles.thumb} source={require('../img/trash.png')} />
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
          dataSource={this.state.dataSource.cloneWithRows(this.state.data)}
          renderRow={this.renderRow}
          showsVerticalScrollIndicator={false}
          initialListSize={7}
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
    height: 40,
    marginLeft: 10
  },
});
