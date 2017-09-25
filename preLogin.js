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

  /**
   * 配置场景动画
   * @param route 路由
   * @param routeStack 路由栈
   * @returns {*} 动画
   */
  configureScene(route, routeStack) {
    if (route.type == 'Bottom') {
      return Navigator.SceneConfigs.FloatFromBottom; // 底部弹出
    }
    return Navigator.SceneConfigs.PushFromRight; // 右侧弹出
  }

  render() {
    return (
      <Navigator
        style={{flex:1}}
        initialRoute={{component: Login}}
        configureScene={this.configureScene}
        renderScene={this.renderScene}/>
    );
  }
}

const styles = StyleSheet.create({
});
