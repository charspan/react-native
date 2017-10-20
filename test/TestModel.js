import React, { Component } from 'react';
import { Text,StyleSheet } from 'react-native';

export default class TestModel extends Component{

    constructor(props){
        super(props);
        this.state={
            
        }
    }

    render(){
        return <Text style={styles.textStyle}>hello</Text>
    }
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize:20,
        backgroundColor:'red'
    },
});
