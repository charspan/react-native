import React,{Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import CustomerComponents, {Navigator} from 'react-native-deprecated-custom-components';
import Login from './login';
import "./GlobalValue";

export default class preLogin extends Component {
  /**
   * 使用动态页面加载
   * @param route 路由
   * @param navigator 导航器
   * @returns {XML} 页面
   */
  renderScene(route, navigator) {
    return <route.component navigator={navigator}  {...route.params} />;
  }

  //使用静态加载组件, 需要预定义组件, 没有动态加载灵活
  /**
   * 渲染场景, 通过不同参数, 设置不同页面
   * @param route 路由, 场景信息
   * @param navigator 导航器
   * @returns {XML} 页面
   */
  renderSceneStatic(route, navigator) {
    if (route.name == 'FirstPage') {
      return <FirstPage navigator={navigator} {...route.params}/>
    } else if (route.name == 'SecondPage') {
      return <SecondPage navigator={navigator} {...route.params}/>
    }
  }

  /**
   * 配置场景动画
   * @param route 路由
   * @param routeStack 路由栈
   * @returns {*} 动画
   */
  configureScene(route, routeStack) {
    if (route.type == 'Bottom') {
      return Navigator.SceneConfigs.FloatFromBottom; // 底部弹出
    }else if(route.type=='VerticalDownSwipeJump'){
      return Navigator.SceneConfigs.VerticalDownSwipeJump;
    }
    return Navigator.SceneConfigs.PushFromRight; // 右侧弹出
  }

  render() {
    return (
      <Navigator
        style={{flex:1}}
        // 初始化路由
        initialRoute={{component: Login}}
        // 配置场景动画
        configureScene={this.configureScene}
        // 渲染场景
        renderScene={this.renderScene}/>
    );
  }
}
