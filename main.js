import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';

export default class main extends Component {
  constructor(props){
    super(props);
    this.state = {
        message:"",
    };
    console.log(props);
}

componentDidMount(){
    this.setState({
        message:this.props.message,
    });
}

  render() {
    return (
      <View
        style={styles.container}>
        <Text>登录成功!这是主页!</Text>
        <Text>{this.state.message}</Text>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
