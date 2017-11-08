## MyTest02

### 需优化的内容

1. 安装包大小需要压缩

2. 应用运行使用内存需要减少,运行速度较慢

3. 应用界面需要美化

4. 内部逻辑需要优化

5. 目前 ios 客户端js服务器的 ip 和 port 没有改变

6. 用户界面自定义设置未实现

7. 所有的http请求 异常情况需要做统一处理

## 启动指令

1. npm start -- --reset-cache

## 注意

1. 安装react-native-fs步骤

    第一步：
    npm install react-native-fs --save
    第二步：
    react-native link react-native-fs

2. 安装 react-native-zip-archive
  
  第一步
  npm install react-native-zip-archive
  第二部
  react-native link react-native-zip-archive

## 进度

1. 目前超级账号功能全部完成，有以下几点可以后续补充

~~~~
1. 新增app主题设置，夜间模式等
2. 优化android界面加载速度，目前还是较慢，最慢时候大概3~5秒左右
~~~~


复习android ios知识点

1. Android sd卡使用权限
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>