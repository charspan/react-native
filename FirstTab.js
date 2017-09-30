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
import {base_url,httpDelete} from './common';
import TextInputBar from './my_component/TextInputBar';
import ButtonItem from './my_component/ButtonItem';

export default class FirstTab extends Component{

    constructor(props){     
      super(props);
      // 方法1
      //this._renderRow=this._renderRow.bind(this);
      //console.log(props.subAccounts);
      var ds= new ListView.DataSource({
        rowHasChanged:(r1,r2)=>r1!==r2
      });
      this.state={
        header: props.header,
        dataSource : ds,
        data: props.subAccounts?props.subAccounts:[],
        isSubAccountEditShow: false
      }
    }

    removeByValue(arr, val) {
      for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
          arr.splice(i, 1);
          break;
        }
      }
    }

    // 父组件 ref 调用: 新增子账号绑定关系
    addValue(data){
      //console.log('新增',data);
      this.state.data.push(data);
      this.setState({
        data: this.state.data
      });
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

    // 方法二 ()=>{}
    renderRow=(rowData,sectionID, rowID)=> {
        return (
            <View style={styles.row}>
              <Modal // 修改子账号绑定关系模态窗口
                visible={this.state.isSubAccountEditShow}
                //从下面向上滑动 slide
                //慢慢显示 fade
                animationType = {'slide'}
                //是否透明默认是不透明 false
                transparent = {true}
                //关闭时调用
                onRequestClose={()=> console.log("onRequestClose")}
              >
                <View style={{flex:1,justifyContent: 'center',backgroundColor:'rgba(0,0,0,0.8)'}}>
                  <View style={{padding:15,height:150, backgroundColor:'rgba(255,255,255,1)'}}>
                    <TextInputBar name="昵称" txtHide="请输入对方昵称呼" ref={node1=>this.editSubAccount_relativeName=node1}/>
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                      <ButtonItem label="取 消" func={()=> this.setState({isSubAccountEditShow: false})}/>
                      <ButtonItem label="提 交" 
                        func={()=>{
                          console.log(this.editSubAccount_relativeName.getValue());
                          rowData.subRelatedName=this.editSubAccount_relativeName.getValue();
                          this.state.data.splice(rowID,1,rowData);
                          this.setState({
                            data: this.state.data
                          });
                        }}
                      />
                    </View>
                  </View>
                </View>
              </Modal>
              <Text // 点击查看子账号详情
                style={{flex:1,fontSize:16,color:'blue',}}
                onPress={()=>{
                  this.props.callback(rowData);
                }}
              >
                {"昵称: "+rowData.subRelatedName + "\n账号: " +rowData.account}
              </Text>
              <TouchableOpacity //点击修改子账号权限信息
                onPress={()=>{
                }}
              >
                <Image style={styles.thumb} source={require('./img/power.png')}  />
              </TouchableOpacity>
              <TouchableOpacity // 点击修改子账号绑定关系相对昵称
                onPress={()=>{
                  this.setState({isSubAccountEditShow: true});
                }}
              >
                <Image style={styles.thumb} source={require('./img/edit.jpg')} />
              </TouchableOpacity>
              <TouchableOpacity // 点击删除子账号绑定关系
                onPress={()=>{
                  Alert.alert(
                    '提示',
                    '确定要删除子账号"'+rowData.account+'"吗?',
                    [
                      {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: '确定', onPress: () => {
                        httpDelete(base_url+'relative/'+rowData.id,this.state.header,
                          (res)=>{
                            if(res.errorcode==0){
                              this.removeByValue(this.state.data,rowData);
                              this.setState({
                                data: this.state.data
                              });
                            }else{
                              Alert.alert('错误提示','删除子账号失败,请重试!',[{text: '确定'}]);
                            }
                          }
                        );
                      }},
                    ]
                  );
                }}
              >
                <Image style={styles.thumb} source={require('./img/trash.jpg')}  />
              </TouchableOpacity>
            </View>
          );
    }
   
    render() {
      return (
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(this.state.data)}
          renderRow={this.renderRow}
          isSubAccountEditShowsVerticalScrollIndicator={false}
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
