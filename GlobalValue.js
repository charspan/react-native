import React, {Component} from 'react';
import Storage from 'react-native-storage';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  AsyncStorage
} from'react-native';

var storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 1000,
  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,
  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: 1000 * 3600 * 24,
  // 读写时在内存中缓存数据。默认启用。
  enableCache: true
});
global.storage=storage;

//从下面向上滑动 slide
//慢慢显示 fade
//模态窗口(Modal)显示效果
// var animationType='slide';
var animationType='fade';
global.animationType=animationType;
