import React, { Component,PropTypes } from 'react';
import { 
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight
} from 'react-native';

export default class CheckBox extends Component{

    //默认属性(框在前，字在后，未选中,无点击事件)
    static defaultProps={
        text: '选项1',
        textAtBehind: true,
        checked: false,
        func: ()=>{console.log('默认方法');}
    }

     //属性类型：
    static propTypes={
        text: PropTypes.string,
        textStyle: PropTypes.object,
        textAtBehind: PropTypes.bool,
        checked: PropTypes.bool,
        func: PropTypes.func
     };
     
    render(){
        //选择框的图片
        var imgSource;
        if(this.props.checked){
            imgSource = require('./img/checkbox_enabled.png');
        }else{
            imgSource = require('./img/checkbox_disabled.png');
        }
        //文字跟可选框位置
        var container;
        if(this.props.textAtBehind){
            container = (
                <View style = {styles.container} >
                    <Image
                        style = {styles.image}
                        source = {imgSource} />
                    <View style = {styles.view} >
                        <Text style = {[this.props.textStyle,styles.text]} >{this.props.text}</Text>
                    </View>
                </View>
            );
        }else{
            container = (
                <View style = {styles.container} >
                    <View style = {styles.view} >
                        <Text style = {[this.props.textStyle,styles.text]} >{this.props.text}</Text>
                    </View>
                    <Image
                        style = {styles.image}
                        source = {imgSource} />
                </View>
            );
        }

        return(
            <TouchableHighlight
                onPress = {()=>{
                    console.log(this.props);
                    this.props.func(true);
                }}
                underlayColor='white' >
                {container}
            </TouchableHighlight>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image:{
        width: 25,
        height: 25
    },
    view:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    text:{
        fontSize: 15
    }
});
