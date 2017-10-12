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
import FirstTabRight from './FirstTabRight';
import {base_url,httpPostJson,httpPut} from './common';
import moment from 'moment';
import SecondTab from './SecondTab';
import ThirdTab from './ThirdTab';
import FourthTab from './FourthTab';
import "./GlobalValue";

export default class superAccountIndex extends Component {

  static navigator;
  constructor(props){
    super(props);
    this.state = {
      message: props.message, // 超级账号登录后获取的 data 信息
      header: props.header, // http 请求头部信息
      isSubAccountDetailShow: false, // 是否显示当前子账号详细信息
      isSubAccountRightEditShow: false, // 是否显示子账号权限编辑界面
      subAccountDetail: {}, // 子账号详细信息
      isSubAccountAddShow: false, // 是否显示新增子账号界面
      newSubAccount_account: '', // 新增子账号的子账号
      newSubAccount_relativeName: '', // 新增子账号相对昵称
      isSubAccountEditShow: false, // 是否显示编辑子账号界面
      rowIDEdit: -1, // 当前编辑的子账号行号
      rowDataEdit: {}, // 当前编辑子账号的详细信息
      isPersonalEditShow: false, //是否显示修改个人信息
      personalEdit_nickname: '', // 编辑个人昵称
      personalEdit_mobile: '', //编辑个人手机号
      projects: [], // 工程列表
    };
    superAccountIndex.navigator=props.navigator;
    //console.log(global.storage);
  }

  render() {
    return (
      <ScrollableTabView
        style={{marginTop: 20, backgroundColor:'rgba(255,255,255,1)'}}
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
              <Image 
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10
                }}
                source={require('./img/plus.png')}
              />
            </TouchableOpacity>
          </View>
          <Modal // 新增子账号绑定关系模态窗口
            visible={this.state.isSubAccountAddShow}
            //从下面向上滑动 slide
            //慢慢显示 fade
            animationType = {global.animationType}
            //是否透明默认是不透明 false
            transparent = {true}
            //关闭时调用
            onRequestClose={()=>{}}
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
                      // 验证子账号格式是否正确
                      // ...暂时不做任何验证...
                      // 验证子账号是否存在
                      if(this.firstTabRef.hasSameValue(this.state.newSubAccount_account)){
                        Alert.alert('错误提示','该子账号已经存在!',[{text: '确定'}]);
                      } else {
                        // 进行网络请求
                        httpPostJson(base_url+'relative',
                          {account: this.state.newSubAccount_account,subRelatedName: this.state.newSubAccount_relativeName},
                          this.state.header,
                          (res)=>{
                            if(res.errorcode==0){
                              this.firstTabRef.addValue({id: res.data.id, account: this.state.newSubAccount_account, subRelatedName: this.state.newSubAccount_relativeName, createTime: moment().format('YYYY-MM-DD HH:mm:ss'), subAccountId:res.data.subAccountId});
                              this.setState({isSubAccountAddShow: false});
                              // 跳转出权限配置界面...
                              // code in block
                            }else{
                              Alert.alert('错误提示','新增子账号失败,请重试!',[{text: '确定'}]);
                            }
                          }
                        );
                      }
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <Modal // 修改子账号绑定关系模态窗口
            visible={this.state.isSubAccountEditShow}
            //从下面向上滑动 slide
            //慢慢显示 fade
            animationType = {global.animationType}
            //是否透明默认是不透明 false
            transparent = {true}
            //关闭时调用
            onRequestClose={()=>{}}
          >
            <View style={{flex:1,justifyContent: 'center',backgroundColor:'rgba(0,0,0,0.8)'}}>
              <View style={{padding:15,height:150, backgroundColor:'rgba(255,255,255,1)'}}>
                <TextInputBar name="昵称" txtHide={this.state.rowDataEdit.subRelatedName} ref={node=>this.editSubAccount_relativeName=node}/>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <ButtonItem label="取 消" func={()=> this.setState({isSubAccountEditShow: false})}/>
                  <ButtonItem label="提 交" 
                    func={()=>{
                      httpPut(base_url+'relative/'+this.state.rowDataEdit.id,
                        {subRelatedName: this.editSubAccount_relativeName.getValue()},
                        this.state.header,
                        (res)=>{
                          if(res.errorcode==0){
                            this.firstTabRef.editValue(this.state.rowIDEdit,this.state.rowDataEdit,this.editSubAccount_relativeName.getValue());
                            this.setState({isSubAccountEditShow: false})
                          }else{
                            Alert.alert('错误提示','修改子账号失败,请重试!',[{text: '确定'}]);
                          }
                        }
                      );
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
            animationType = {global.animationType}
            //是否透明默认是不透明 false
            transparent = {true}
            //关闭时调用
            onRequestClose={()=>{}}
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
          <Modal // 修改子账号权限模态窗口
            visible={this.state.isSubAccountRightEditShow}
            //从下面向上滑动 slide
            //慢慢显示 fade
            animationType = {global.animationType}
            //是否透明默认是不透明 false
            transparent = {true}
            //关闭时调用
            onRequestClose={()=>{}}
          >
            <View style={{flex:1,justifyContent: 'center',backgroundColor:'rgba(0,0,0,0.8)'}}>
              <View style={{padding:20,height:400, backgroundColor:'rgba(255,255,255,1)'}}>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize:24,marginBottom:10}}>工程列表</Text>
                </View>
                <FirstTabRight
                  subAccounts={this.state.message.bindings} 
                  // 传递 http 请求头
                  header={this.state.header}
                  // 传递超级账号编号
                  superAccountId={this.state.message.superAccount.id}
                  // 工程列表
                  projects={this.state.projects}
                  callbackHide={()=>{
                    this.setState({
                      isSubAccountRightEditShow: false
                    });
                  }}
                />
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <ButtonItem label="取 消" func={()=> this.setState({isSubAccountRightEditShow: false})}/>
                  <ButtonItem label="提 交" 
                    func={()=>{
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <FirstTab
            // 传递绑定关系列表
            subAccounts={this.state.message.bindings}
            // 传递显示子账号详细信息回调方法
            callbackShowSubAccountDetail={(subAccountDetail)=>{
              this.setState({
                isSubAccountDetailShow: true,
                subAccountDetail: subAccountDetail
              });
            }}
            // 传递显示编辑子账号界面回调方法
            callbackShowSubAccountEdit={(rowIDEdit,rowDataEdit)=>{
              this.setState({
                isSubAccountEditShow: true,
                rowIDEdit: rowIDEdit,
                rowDataEdit: rowDataEdit
              });
            }}
            // 传递显示编辑子账号权限信息界面回调方法
            callbackShowSubAccountRightEdit={()=>{
              // 设置及时同步数据函数
              global.storage.sync = {
                storageProjects(params){
                  httpPostJson(
                    base_url+"UIDesigner/"+params.syncParams.superAccountId+"/projects",
                    {},
                    params.syncParams.header,
                    (res)=>{
                      console.log("网络请求工程列表",res);
                      if(res.errorcode==0){
                        global.storage.save({
                          key: 'storageProjects',  // 注意:请不要在key中使用_下划线符号!
                          data: res.data.projectList,
                          // 如果不指定过期时间，则会使用defaultExpires参数
                          // 如果设为null，则永不过期
                          expires: 1000 * 3600 * 0.25  // 15分钟 用户可设置
                        });
                        // 成功则调用resolve
                        params.resolve && params.resolve(res.data.projectList);
                      }else{
                        // 失败则调用reject
                        params.reject && params.reject(new Error('data parse error'));
                      }
                    }
                  );
                }
              }
              // 先从缓存中读取工程列表,如果没有则进行网络请求
              global.storage.load({
                key: 'storageProjects',
                // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                autoSync: true,
                // syncInBackground(默认为true)意味着如果数据过期，
                // 在调用sync方法的同时先返回已经过期的数据。
                // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
                syncInBackground: false,
                // 你还可以给sync方法传递额外的参数
                syncParams: {// 当找不到缓存数据的时候自动调用方法的参数
                    superAccountId: this.state.message.superAccount.id,
                    header: this.state.header
                },
              }).then(projects => {
                // 如果找到数据，则在then方法中返回
                // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
                // 你只能在then这个方法内继续处理projects数据,而不能在then以外处理,也没有办法“变成”同步返回
                // 你也可以使用“看似”同步的async/await语法
                //console.log("projects",projects);
                this.setState({
                  projects: projects,
                  isSubAccountRightEditShow: true
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
            // 传递 http 请求头
            header={this.state.header}
            // 设置 ref, 方便调用当前子组件(FirstTab)内部方法
            ref={firstTabRef=>this.firstTabRef=firstTabRef}
          />
        </View>
        <ScrollView tabLabel="ios-paper" style={styles.tabView}
          ref={component => this.scrollView1 = component}
        >
          <View style={styles.card}>
            <Text style={{fontSize:30}}>网关管理</Text>
            <TouchableOpacity // 点击显示新增子账号绑定关系模态窗口
              onPress={()=>{
                //console.log('网关信息',this.state.message.superAccount.gateway);
                Alert.alert('提示','当前网关已是最新版本,无需升级!',[{text: '确定'}]);
              }}
            >
              <Image 
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10
                }}
                source={require('./img/upGrade.png')}
              />
            </TouchableOpacity>
          </View>
          <SecondTab gateway={this.state.message.superAccount.gateway} 
            scroll={(dir)=>{
              if(dir){
                // 自动会回去的
                // this.scrollView1.scrollTo(50,0,true);
              }else{
                this.scrollView1.scrollTo({x:0,y:150,animated:true});
              }
            }}
          />
        </ScrollView>
        <ScrollView tabLabel="ios-body" style={styles.tabView}
          ref={component => this.scrollView2 = component}
        >
          <View style={styles.card}>
            <Text style={{fontSize:30}}>个人信息</Text>
            <TouchableOpacity // 点击显示修改个人信息模态窗口
              onPress={()=>{
                console.log('个人信息',this.state.message.superAccount);
                this.setState({isPersonalEditShow: true});
                //Alert.alert('提示','当前网关已是最新版本,无需升级!',[{text: '确定'}]);
              }}
            >
              <Image 
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10
                }}
                source={require('./img/edit.jpg')}
              />
            </TouchableOpacity>
          </View>
          <Modal // 修改个人信息模态窗口
            visible={this.state.isPersonalEditShow}
            //从下面向上滑动 slide
            //慢慢显示 fade
            animationType = {global.animationType}
            //是否透明默认是不透明 false
            transparent = {true}
            //关闭时调用
            onRequestClose={()=>{}}
          >
            <View style={{flex:1,justifyContent: 'center',backgroundColor:'rgba(0,0,0,0.8)'}}>
              <View style={{padding:15,height:250, backgroundColor:'rgba(255,255,255,1)'}}>
                <TextInputBar name="昵称" txtHide="请输入新昵称" ref={node=>this.personalEdit_nickname=node}/>
                <TextInputBar name="手机" txtHide="请输入新手机号" ref={node=>this.personalEdit_mobile=node}/>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <ButtonItem label="取 消" func={()=> this.setState({isPersonalEditShow: false})}/>
                  <ButtonItem label="提 交"
                    func={()=>{
                      // 获取输入信息
                      this.state.personalEdit_nickname=this.personalEdit_nickname.getValue();
                      this.state.personalEdit_mobile=this.personalEdit_mobile.getValue();
                      // 进行网络请求
                      httpPut(base_url+'client/info',
                        {nickname: this.state.personalEdit_nickname,mobile: this.state.personalEdit_mobile},
                        this.state.header,
                        (res)=>{
                          if(res.errorcode==0){
                            this.thirdTabRef.update(this.state.personalEdit_nickname,this.state.personalEdit_mobile);
                            this.setState({isPersonalEditShow: false});
                          }else if(res.errorcode==-1){
                            Alert.alert('错误提示','您输入的手机格式有误!',[{text: '确定'}]);
                          }else{
                            Alert.alert('错误提示','修改账号信息失败,请重试!',[{text: '确定'}]);
                          }
                        }
                      );
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <ThirdTab
            superAccount={this.state.message.superAccount}
            scroll={(dir)=>{
              if(dir){
                // 自动会回去的
                // this.scrollView2.scrollTo(50,0,true);
              }else{
                this.scrollView2.scrollTo({x:0,y:150,animated:true});
              }
            }}
            ref={thirdTabRef=>this.thirdTabRef=thirdTabRef}
          />
        </ScrollView>
        <ScrollView tabLabel="ios-apps" style={styles.tabView}>
          <View style={styles.card}>
            <Text style={{fontSize:30}}>系统设置</Text>
            <TouchableOpacity // 点击显示修改个人信息模态窗口
              onPress={()=>{
                //console.log('个人信息',this.state.message.superAccount);
                Alert.alert('提示','密码修改,退出登录等!',[{text: '确定'}]);
              }}
            >
              <Image 
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10
                }}
                source={require('./img/3.png')}
              />
            </TouchableOpacity>
          </View>
          <FourthTab
            header={this.state.header}
            password={this.state.message.superAccount.password}
            navigator={superAccountIndex.navigator}
          />
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
