import React, { Component } from 'react';
import { Text } from 'react-native';

export default class test extends Component{

    constructor(props){
        super(props);
        this.state={
            
        }
    }

    render(){
        return <Text style={textStyle}>hello</Text>
    }
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize:20,
        backgroundColor:'red'
    },
});
