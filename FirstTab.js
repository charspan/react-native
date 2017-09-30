import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableOpacity
} from'react-native';

export default class FirstTab extends Component{

    constructor(props){     
      super(props);
      // 方法1
      //this._renderRow=this._renderRow.bind(this);
      //console.log(props.subAccounts);
      var ds= new ListView.DataSource({
        rowHasChanged:(r1,r2)=>r1!==r2
      });
      this.state={
        dataSource : ds,
        data: props.subAccounts?props.subAccounts:[],
      }
    }

    removeByValue(arr, val) {
      for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
          arr.splice(i, 1);
          break;
        }
      }
    }

    // 父组件 ref 调用
    addValue(data){
      console.log('新增',data);
      this.state.data.push(data);
      this.setState({
        data: this.state.data
      });
    }

    // 父组件 ref 调用
    hasSameValue(account){
      for(var i=0;i<this.state.data.length;i++){
        if(this.state.data[i].account==account){
          return true;
        }
      }
      return false;
    }

    // 方法二
    renderRow=(rowData,sectionID, rowID)=> {
        return (
            <View style={styles.row}>
              <Text style={{flex:1,fontSize:16,color:'blue',}}
                onPress={()=>{
                  //console.log(rowData);
                  this.props.callback(rowData);
                }}
              >
                {"昵称: "+rowData.subRelatedName + "\n账号: " +rowData.account}
              </Text>
              <TouchableOpacity
                onPress={()=>{
                }}
              >
                <Image style={styles.thumb} source={require('./img/power.png')}  />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={()=>{
                  console.log('修改',rowData);
                  rowData.subRelatedName='subRelatedName';
                  rowData.account='account';
                  this.state.data.splice(rowID,1,rowData);
                  this.setState({
                    data: this.state.data
                  });
                }}
              >
                <Image style={styles.thumb} source={require('./img/edit.jpg')} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={()=>{
                  console.log("移除",rowData);
                  this.removeByValue(this.state.data,rowData);
                  this.setState({
                    data: this.state.data
                  });
                  console.log("还剩"+this.state.data.length);
                }}
              >
                <Image style={styles.thumb} source={require('./img/trash.jpg')}  />
              </TouchableOpacity>
            </View>
          );
    }
   
    render() {
      return (
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(this.state.data)}
          renderRow={this.renderRow}
          showsVerticalScrollIndicator={false}
        />
      );
    }
}

var styles =StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
    alignItems: 'center'
  },
  thumb: {
    width: 50,
    height: 50,
    borderRadius: 10
  },
});
