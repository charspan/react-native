import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ListView
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from './my_component/TabBar';

export default class superAccountIndex extends Component {

  static navigator;
  constructor(props){
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      message: props.message,
      dataSource: ds.cloneWithRows(['row1', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8']), 
    };
    superAccountIndex.navigator=this.props.navigator;
  }

  render() {
    return (
      <ScrollableTabView
        style={{marginTop: 20, }}
        initialPage={0}
        renderTabBar={() => <TabBar tabNames={['子账号','网关','个人','设置']} tabIcons={['ios-people','ios-paper','ios-body','ios-apps']}/>}
        tabBarPosition='bottom'
      >
        <ScrollView tabLabel="ios-people" style={styles.tabView}>
        <ListView  
        dataSource={this.state.dataSource}  
        renderRow={(rowData) =><Text>{rowData}</Text>}  
      />  
          <View style={styles.card}>
            <Text>登录成功!这是主页!</Text>
          </View>
        </ScrollView>
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
  tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    height: 150,
    padding: 15,
    
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});
