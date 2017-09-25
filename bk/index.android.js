/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';
// 使用任何组件必须先导入进来
import login from './login'
// 启动加载 setup
AppRegistry.registerComponent('MyTest02', () => login);
