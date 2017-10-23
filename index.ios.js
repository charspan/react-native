import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
// 使用任何组件必须先导入进来
import PreLogin from './preLogin'
// 启动加载 login
AppRegistry.registerComponent('MyTest02', () => PreLogin);
