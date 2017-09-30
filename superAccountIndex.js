import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from './my_component/TabBar';
import FirstTab from './FirstTab';

export default class superAccountIndex extends Component {

  static navigator;
  constructor(props){
    super(props);
    this.state = {
      message: props.message,
      modalVisible: false,
      subAccountDetail: {},
      refAddValue: {}
    };
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
            <TouchableOpacity
              onPress={()=>{
                this.refAddValue.addValue({id: 15, account: "13656696339", subRelatedName: "宋大神", createTime: "2017-06-28 17:49:37.0", subAccountId: 13});
              }}
            >
              <Image style={{
                width: 40,
                height: 40,
                borderRadius: 10
              }} source={require('./img/plus.png')} />
            </TouchableOpacity>
          </View>
          <Modal
              visible={this.state.modalVisible}
              //从下面向上滑动 slide
              //慢慢显示 fade
              animationType = {'slide'}
              //是否透明默认是不透明 false
              transparent = {true}
              //关闭时调用
              onRequestClose={()=> console.log("onRequestClose")}
          >
            <TouchableWithoutFeedback onPress={()=> this.setState({modalVisible: false})}>
              <View style={{flexDirection:'row', flex:1,backgroundColor:'rgba(0,200,200,0.8)'}}>
                <View style={{flex:1,alignSelf:'center',justifyContent: 'center', padding:40,paddingLeft:50, backgroundColor:'rgba(0,200,200,0.8)'}}>
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
          <FirstTab subAccounts={this.state.message.bindings} 
                    callback={(subAccountDetail)=>{
                      this.setState({
                        modalVisible: true,
                        subAccountDetail: subAccountDetail
                      });
                    }}
                    ref={refAddValue=>this.refAddValue=refAddValue}
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
