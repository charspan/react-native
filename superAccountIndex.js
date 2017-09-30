import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from './my_component/TabBar';
import TextInputBar from './my_component/TextInputBar';
import ButtonItem from './my_component/ButtonItem';
import FirstTab from './FirstTab';
import {base_url,httpPostJson} from './common';
import moment from 'moment';

export default class superAccountIndex extends Component {

  static navigator;
  constructor(props){
    super(props);
    this.state = {
      message: props.message,
      header: props.header,
      isSubAccountDetailShow: false,
      subAccountDetail: {},
      isSubAccountAddShow: false,
      newSubAccount_account: '',
      newSubAccount_relativeName: ''
    };
    console.log(props.header);
    superAccountIndex.navigator=props.navigator;
   // console.log(this.state.message);
  }

  render() {
    return (
      <ScrollableTabView
        style={{marginTop: 20, }}
        initialPage={0}
        renderTabBar={() => <TabBar tabNames={['子账号','网关','个人','设置']} tabIcons={['ios-people','ios-paper','ios-body','ios-apps']}/>}
        tabBarPosition='bottom'
      >
        <View tabLabel="ios-people" style={styles.firstTab}>
          <View style={styles.card}>
            <Text style={{fontSize:30}}>子账号管理</Text>
            <TouchableOpacity // 点击显示新增子账号绑定关系模态窗口
              onPress={()=>{
                this.setState({
                  isSubAccountAddShow: true
                });
              }}
            >
              <Image style={{
                width: 40,
                height: 40,
                borderRadius: 10
              }} source={require('./img/plus.png')} />
            </TouchableOpacity>
          </View>
          <Modal // 新增子账号绑定关系模态窗口
            visible={this.state.isSubAccountAddShow}
            //从下面向上滑动 slide
            //慢慢显示 fade
            animationType = {'slide'}
            //是否透明默认是不透明 false
            transparent = {true}
            //关闭时调用
            onRequestClose={()=> console.log("onRequestClose")}
          >
            <View style={{flex:1,justifyContent: 'center',backgroundColor:'rgba(0,0,0,0.8)'}}>
              <View style={{padding:15,height:250, backgroundColor:'rgba(255,255,255,1)'}}>
                <TextInputBar name="账号" txtHide="请输入手机号" ref={node=>this.newSubAccount_account=node}/>
                <TextInputBar name="昵称" txtHide="请输入对方昵称呼" ref={node=>this.newSubAccount_relativeName=node}/>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <ButtonItem label="取 消" func={()=> this.setState({isSubAccountAddShow: false})}/>
                  <ButtonItem label="提 交" 
                    func={()=>{
                      // 获取输入信息
                      this.state.newSubAccount_account=this.newSubAccount_account.getValue();
                      this.state.newSubAccount_relativeName=this.newSubAccount_relativeName.getValue();
                      // console.log(this.state.newSubAccount_account);
                      // console.log(this.state.newSubAccount_relativeName);
                      // 验证子账号格式是否正确
                      // ...
                      // 验证子账号是否存在
                      if(this.firstTabRef.hasSameValue(this.state.newSubAccount_account)){
                        Alert.alert('错误提示','该子账号已经存在!',[{text: '确定'}]);
                      } else {
                        // 进行网络请求
                        httpPostJson(base_url+'relative',
                          {account: this.state.newSubAccount_account,subRelatedName: this.state.newSubAccount_relativeName},
                          this.state.header,
                          (res)=>{
                            console.log(res)
                            if(res.errorcode==0){
                              this.firstTabRef.addValue({id: res.data.id, account: this.state.newSubAccount_account, subRelatedName: this.state.newSubAccount_relativeName, createTime: moment().format('YYYY-MM-DD HH:mm:ss'), subAccountId:res.data.subAccountId});
                              this.setState({isSubAccountAddShow: false});
                            }else{
                              Alert.alert('错误提示','新增子账号失败,请重试!',[{text: '确定'}]);
                            }
                          }
                        )
                      }
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <Modal //子账号绑定关系详情模态窗口
            visible={this.state.isSubAccountDetailShow}
            //从下面向上滑动 slide
            //慢慢显示 fade
            animationType = {'slide'}
            //是否透明默认是不透明 false
            transparent = {true}
            //关闭时调用
            onRequestClose={()=> console.log("onRequestClose")}
          >
            <TouchableWithoutFeedback onPress={()=> this.setState({isSubAccountDetailShow: false})}>
              <View style={{flexDirection:'row', flex:1,backgroundColor:'rgba(0,0,0,0.8)'}}>
                <View style={{flex:1,alignSelf:'center',justifyContent: 'center', padding:40,paddingLeft:50, backgroundColor:'rgba(255,255,255,1)'}}>
                  <Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold'}}>子账号详细信息{"\n"}</Text>
                  <Text style={{alignSelf:'flex-start',fontSize:18}}>关系编号:  {this.state.subAccountDetail.id+"\n"}</Text>
                  <Text style={{alignSelf:'flex-start',fontSize:18}}>昵称:  {this.state.subAccountDetail.subRelatedName+"\n"}</Text>
                  <Text style={{alignSelf:'flex-start',fontSize:18}}>账号:  {this.state.subAccountDetail.account+"\n"}</Text>
                  <Text style={{alignSelf:'flex-start',fontSize:18}}>账号编号:  {this.state.subAccountDetail.subAccountId+"\n"}</Text>
                  <Text style={{alignSelf:'flex-start',fontSize:18}}>创建时间:  {(this.state.subAccountDetail.createTime+"").replace('.0','')}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <FirstTab 
            subAccounts={this.state.message.bindings} 
            callback={(subAccountDetail)=>{
              this.setState({
                isSubAccountDetailShow: true,
                subAccountDetail: subAccountDetail
              });
            }}
            header={this.state.header}
            ref={firstTabRef=>this.firstTabRef=firstTabRef}
          />
        </View>
        <ScrollView tabLabel="ios-paper" style={styles.tabView}>
          <View style={styles.card}>
            <Text>Friends</Text>
          </View>
        </ScrollView>
        <ScrollView tabLabel="ios-body" style={styles.tabView}>
          <View style={styles.card}>
            <Text>Messenger</Text>
          </View>
        </ScrollView>
        <ScrollView tabLabel="ios-apps" style={styles.tabView}>
          <View style={styles.card}>
            <Text>Notifications</Text>
          </View>
        </ScrollView>
      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  firstTab: {
    flex: 1,// 少了它安卓就无法下拉
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  card: {
    //flexDirection: 'column',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    height: 100,
    padding: 15,
    alignItems:'center',
    justifyContent: 'center',
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});
