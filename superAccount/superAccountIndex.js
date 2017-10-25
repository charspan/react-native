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
import TabBar from '../my_component/TabBar';
import TextInputBar from '../my_component/TextInputBar';
import ButtonItem from '../my_component/ButtonItem';
import FirstTab from './FirstTab';
import ProjectList from './ProjectList';
import {base_url,httpPostJson,httpPut,httpGet} from '../common';
import moment from 'moment';
import SecondTab from './SecondTab';
import ThirdTab from './ThirdTab';
import FourthTab from './FourthTab';
import "../GlobalValue";
import RoomList from './RoomList';

// 超级账号首页
export default class superAccountIndex extends Component {

  constructor(props){
    super(props);
    this.state = {
      message: props.message, // 超级账号登录后获取的 data 信息
      isSubAccountDetailShow: false, // 是否显示当前子账号详细信息
      isProjectShow: false, // 是否显示子账号权限编辑界面--工程列表
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
      isRoomsShow: false, // 是否显示房间列表
      rooms: [], // 房间列表
      // 初始化权限信息, 以工程编号为 key, 房间编号集合为 value,其中房间编号集合以'.'为分隔符
      /*
        如:
        {
          1: "1_12_45",
          31: "67"
        }
        // 代表当前子账号可以访问1号工程下的1号,12号,45号房间,以及31号工程下的67号房间
       */
      rights: {},
      currProjectId: -1, //当前正要编辑工程内部房间权限的工程编号
      rightId: -1 ,//当前权限编号
    };
    // 根据不同用户设置不同缓存时间（是否是开发模式）
    global.storage.load({
      key: 'defaultExpires',
      id: this.state.message.superAccount.id,
      // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
      autoSync: false,
    }).then(defaultExpires => {
      // 如果找到数据，则在then方法中返回
      // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
      // 只能在then这个方法内继续处理ret数据而不能在then以外处理,也没有办法“变成”同步返回
      // 也可以使用“看似”同步的async/await语法
      global.storage.defaultExpires=defaultExpires;
    }).catch(err => {
      global.storage.defaultExpires=86400000;
    });
    // 获取所有子账号权限信息
    httpGet(base_url+"subAccountRights",{superAccountId:this.state.message.superAccount.id},this.props.header,
    (res)=>{
      if(res.errorcode==0){
        // 遍历登录获取的子账号绑定关系列表 
        //item1 :
        //{
        // "id": 6, // 绑定关系编号
        // "subAccountId":2,
        // "account": "subAccount021",
        // "subRelatedName": " 昵称022",
        // "createTime": "2017-04-27 17:36:51.0"
        //}
        for(var i=0;i<props.message.bindings.length;i++){
          // 遍历所有子账号权限信息
          // item2 :
          //{
          // "id":1, // 权限信息编号
          // "subAccountId":1,
          // "rightJson":""
          //}
          for(var j=0;j<res.data.rights.length;j++){
            // 在每一个item1中插入item2的内容
            if(props.message.bindings[i].subAccountId==res.data.rights[j].subAccountId){
              // 追加权限信息编号
              this.state.message.bindings[i].rightId=res.data.rights[j].id;
              // 追加权限信息
              this.state.message.bindings[i].rightJson=res.data.rights[j].rightJson;
              // 将当前已经处理过的子账号移除
              res.data.rights.splice(j,1);
              break;
            }
          }
        }
      }
    });
  }

  render() {
    return (
      /* 带有选项卡的界面，切换底部或者头部选项即可切换界面显示内容， 类似微信6.X */
      <ScrollableTabView
        style={{marginTop: 20, backgroundColor:'rgba(255,255,255,1)'}}
        /* 初始化时被选中的Tab下标，默认是0（即第一页）。
          initialPage={0}
        */
        // TabBar的样式，系统提供了两种默认的，分别是DefaultTabBar(Tab会平分在水平方向的空间)和ScrollableTabBar(Tab可以超过屏幕范围，滚动可以显示。)。这里我用了自定义的TabBar
        renderTabBar={() => <TabBar tabNames={['子账号','网关','个人','设置']} tabIcons={['ios-people','ios-paper','ios-body','ios-apps']}/>}
        /*
          top：位于屏幕顶部 
          bottom：位于屏幕底部 
          overlayTop：位于屏幕顶部，悬浮在内容视图之上（看颜色区分：视图有颜色，Tab栏没有颜色） 
          overlayBottom：位于屏幕底部，悬浮在内容视图之上（看颜色区分：视图有颜色，Tab栏没有颜色）
        */
        tabBarPosition='bottom'
        /*
          Tab切换之后会触发此方法，包含一个参数（Object类型），这个对象有两个参数: 
          i：被选中的Tab的下标（从0开始） 
          ref：被选中的Tab对象（基本用不到）（想用也很难用。。。）
          from ： 前一个被选中的Tab的下标
          onChangeTab={(obj) => {}}
        */
        /*
          视图正在滑动的时候触发此方法，包含一个Float类型的数字，范围是[0, tab的数量-1]
          onScroll={(postion) => {}}
        */
        /*
          表示手指是否能拖动视图，默认为false（表示可以拖动）。设为true的话，我们只能“点击”Tab来切换视图。
          locked={false}
        */
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
                style={styles.img}
                source={require('../img/plus.png')}
              />
            </TouchableOpacity>
          </View>
          <Modal // 新增子账号绑定关系模态窗口
            visible={this.state.isSubAccountAddShow}
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
                      // 本地验证子账号是否存在
                      if(this.firstTabRef.hasSameValue(this.state.newSubAccount_account)){
                        Alert.alert('错误提示','该子账号的绑定关系已经存在!',[{text: '确定'}]);
                      } else {
                        // 进行网络请求
                        httpPostJson(base_url+'relative',{account: this.state.newSubAccount_account,subRelatedName: this.state.newSubAccount_relativeName},this.props.header,
                          (res)=>{
                            if(res.errorcode==0){
                              this.setState({isSubAccountAddShow: false});
                              this.firstTabRef.addValue({id: res.data.id,rightId: res.data.rightId, rightJson:"",account: this.state.newSubAccount_account, subRelatedName: this.state.newSubAccount_relativeName, createTime: moment().format('YYYY-MM-DD HH:mm:ss'), subAccountId:res.data.subAccountId});
                            }else{
                              Alert.alert('错误提示','新增子账号绑定关系失败,请重试!',[{text: '确定'}]);
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
                      httpPut(base_url+'relative/'+this.state.rowDataEdit.id,{subRelatedName: this.editSubAccount_relativeName.getValue()},this.props.header,
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
                  <Text style={{alignSelf:'flex-start',fontSize:18}}>权限编号:  {this.state.subAccountDetail. rightId+"\n"}</Text>
                  <Text style={{alignSelf:'flex-start',fontSize:18}}>昵称:  {this.state.subAccountDetail.subRelatedName+"\n"}</Text>
                  <Text style={{alignSelf:'flex-start',fontSize:18}}>账号:  {this.state.subAccountDetail.account+"\n"}</Text>
                  <Text style={{alignSelf:'flex-start',fontSize:18}}>账号编号:  {this.state.subAccountDetail.subAccountId+"\n"}</Text>
                  <Text style={{alignSelf:'flex-start',fontSize:18}}>创建时间:  {(this.state.subAccountDetail.createTime+"").replace('.0','')}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <Modal // 修改子账号权限模态窗口--工程列表
            visible={this.state.isProjectShow}
            //从下面向上滑动 slide
            //慢慢显示 fade
            animationType = "fade"
            //是否透明默认是不透明 false
            transparent = {true}
            //关闭时调用
            onRequestClose={()=>{}}
          >
            <View style={{flex:1,justifyContent: 'center',backgroundColor:'rgba(0,0,0,0.8)'}}>
              <View style={{padding:20,height:400, backgroundColor:'rgba(255,255,255,1)'}}>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize:24,paddingBottom:10}}>工程列表</Text>
                </View>
                <ProjectList
                  subAccounts={this.state.message.bindings} 
                  // 传递 http 请求头
                  header={this.props.header}
                  // 传递超级账号编号
                  superAccountId={this.state.message.superAccount.id}
                  // 工程列表
                  projects={this.state.projects}
                  // 传递权限信息
                  rights={this.state.rights}
                  callbackShowRooms={(projectId)=>{
                    // 现将修改的工程编号和权限信息保存
                    this.setState({
                      currProjectId: projectId,
                      //rights: rights // 按照对象存储的原理,自动会更新
                    });
                    // 设置及时同步数据函数
                    global.storage.sync = {
                      storageRooms(params){
                        httpPostJson(base_url+"UIDesigner/"+params.syncParams.superAccountId+"/"+params.syncParams.projectId+"/rooms",{},params.syncParams.header,
                        (res)=>{
                          console.log("rooms");
                          if(res.errorcode==0){
                            global.storage.save({
                              key: 'storageRooms',  // 注意:请不要在key中使用_下划线符号!
                              id: params.syncParams.projectId, // 工程编号
                              data: res.data.roomList,
                              // 如果不指定过期时间，则会使用defaultExpires参数
                              // 如果设为null，则永不过期
                              // expires: 1000 * 3600 * 0.25  // 15分钟 用户可设置
                            });
                            // 成功则调用resolve
                            params.resolve && params.resolve(res.data.roomList);
                          }else{
                            // 失败则调用reject
                            params.reject && params.reject(new Error('data parse error'));    
                          }
                        });
                      }
                    }
                    // 先从缓存中读取工程列表,如果没有则进行网络请求
                    global.storage.load({
                      key: 'storageRooms',
                      id: projectId,
                      // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                      autoSync: true,
                      // syncInBackground(默认为true)意味着如果数据过期，
                      // 在调用sync方法的同时先返回已经过期的数据。
                      // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
                      syncInBackground: false,
                      // 你还可以给sync方法传递额外的参数
                      syncParams: {// 当找不到缓存数据的时候自动调用方法的参数
                          superAccountId: this.state.message.superAccount.id,
                          projectId: projectId,
                          header: this.props.header
                      },
                    }).then(rooms => {
                      // 如果找到数据，则在then方法中返回
                      // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
                      // 你只能在then这个方法内继续处理 rooms 数据,而不能在then以外处理,也没有办法“变成”同步返回
                      // 你也可以使用“看似”同步的async/await语法
                      this.setState({
                        rooms: rooms,
                        isProjectShow: false,
                        isRoomsShow: true
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
                />
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <ButtonItem label="取 消" func={()=> this.setState({isProjectShow: false})}/>
                  <ButtonItem label="提 交" 
                    func={()=>{
                      // 在这里提交修改子账号权限信息的网络请求
                      if(JSON.stringify(this.state.rights)!=this.state.rowDataEdit.rightJson){
                        httpPut(base_url+"subAccountRights/"+this.state.rightId,{rightJson: JSON.stringify(this.state.rights)},this.props.header,
                        (res)=>{
                          if(res.errorcode==0){
                            this.firstTabRef.updateRights(this.state.rowIDEdit,this.state.rowDataEdit,JSON.stringify(this.state.rights));
                            this.setState({isProjectShow: false});
                          }else{
                            Alert.alert('提示','修改权限失败,请重试!',[{text: '确定'}]);
                          }
                        });
                      }else{
                        this.setState({isProjectShow: false});
                      }
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>

          <Modal // 房间列表模态窗口
            visible={this.state.isRoomsShow}
            //从下面向上滑动 slide
            //慢慢显示 fade
            animationType = "fade"
            //是否透明默认是不透明 false
            transparent = {true}
            //关闭时调用
            onRequestClose={()=>{}}
          >
            <View style={{flex:1,justifyContent: 'center',backgroundColor:'rgba(0,0,0,0.8)'}}>
              <View style={{padding:20,height:400, backgroundColor:'rgba(255,255,255,1)'}}>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize:24,marginBottom:10}}>房间列表</Text>
                </View>
                <RoomList
                  superAccountId={this.state.superAccountId}
                  header={this.props.header}
                  rooms={this.state.rooms}
                  rights={this.state.rights}
                  projectId={this.state.currProjectId}
                />
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <ButtonItem label="确 定" 
                    func={()=> {
                      this.setState({
                        isRoomsShow: false,
                        isProjectShow: true
                      });
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>

          <FirstTab // 第一个底部菜单的界面内容
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
            callbackShowProjects={(rowID,rowData)=>{
              if(rowData.rightJson.indexOf('jurisdictionList')==-1){
                this.setState({
                  rowIDEdit: rowID,
                  rowDataEdit: rowData,
                  rightId: rowData.rightId,
                  rights: rowData.rightJson == "" ? {} : JSON.parse(rowData.rightJson)
                });
              }else{
                Alert.alert('权限格式不合法',JSON.stringify(rowData.rightJson));
                return;
              }
              // 设置及时同步数据函--获取工程列表
              global.storage.sync = {
                storageProjects(params){
                  httpPostJson(base_url+"UIDesigner/"+params.syncParams.superAccountId+"/projects",{},params.syncParams.header,
                    (res)=>{
                      console.log("projecs");
                      if(res.errorcode==0){
                        global.storage.save({
                          key: 'storageProjects',  // 注意:请不要在key中使用_下划线符号!
                          id: params.syncParams.superAccountId,// 用户编号
                          data: res.data.projectList,
                          // 如果不指定过期时间，则会使用defaultExpires参数
                          // 如果设为null，则永不过期
                          // expires: 1000 * 3600 * 0.25  // 15分钟 用户可设置
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
                id: this.state.message.superAccount.id,
                // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                autoSync: true,
                // syncInBackground(默认为true)意味着如果数据过期，
                // 在调用sync方法的同时先返回已经过期的数据。
                // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
                syncInBackground: false,
                // 你还可以给sync方法传递额外的参数
                syncParams: {// 当找不到缓存数据的时候自动调用方法的参数
                    superAccountId: this.state.message.superAccount.id,
                    header: this.props.header
                },
              }).then(projects => {
                // 如果找到数据，则在then方法中返回
                // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
                // 你只能在then这个方法内继续处理projects数据,而不能在then以外处理,也没有办法“变成”同步返回
                // 你也可以使用“看似”同步的async/await语法
                this.setState({
                  projects: projects,
                  isProjectShow: true
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
            header={this.props.header}
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
                Alert.alert('提示','当前网关已是最新版本,无需升级!网关信息'+this.state.message.superAccount.gateway,[{text: '确定'}]);
              }}
            >
              <Image 
                style={styles.img}
                source={require('../img/upGrade.png')}
              />
            </TouchableOpacity>
          </View>
          <SecondTab gateway={this.state.message.superAccount.gateway} 
            scroll={(dir)=>{
              if(!dir){
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
                this.setState({isPersonalEditShow: true});
              }}
            >
              <Image 
                style={styles.img}
                source={require('../img/edit.png')}
              />
            </TouchableOpacity>
          </View>
          <Modal // 修改个人信息模态窗口
            visible={this.state.isPersonalEditShow}
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
                        this.props.header,
                        (res)=>{
                          if(res.errorcode==0){
                            this.setState({isPersonalEditShow: false});
                            this.thirdTabRef.update(this.state.personalEdit_nickname,this.state.personalEdit_mobile);
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
              if(!dir){
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
                Alert.alert('提示','当前客户端版本为V1.0.0，无需更新！',[{text: '确定'}]);
              }}
            >
              <Image 
                style={styles.img}
                source={require('../img/setting.png')}
              />
            </TouchableOpacity>
          </View>
          <FourthTab
            superAccountId={this.state.message.superAccount.id}
            header={this.props.header}
            password={this.state.message.superAccount.password}
            navigator={this.props.navigator}
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
  img: {
    width: 40,
    height: 40
  }
});
