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
  //defaultExpires: 1000 * 3600 * 24,
  // 读写时在内存中缓存数据。默认启用。
  enableCache: true
});
// 读取
storage.load({
  key: 'defaultExpires',
  // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
  autoSync: false,
  }).then(defaultExpires => {
    // 如果找到数据，则在then方法中返回
    // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
    // 只能在then这个方法内继续处理ret数据而不能在then以外处理,也没有办法“变成”同步返回
    // 也可以使用“看似”同步的async/await语法
    storage.defaultExpires=defaultExpires;
  }).catch(err => {
    storage.defaultExpires=86400000;
  });
global.storage=storage;
/**
 * 删除缓存数据
 */
function clearStorage(){
  // 删除单个数据
  storage.remove({key: 'storageProjects'});
  // 清除某个key下的所有数据
  storage.clearMapForKey('storageRooms');
}
global.clearStorage=clearStorage;

