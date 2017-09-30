import React, { Component } from 'react';
import {
    Text,
    TouchableHighlight,
    PropTypes,
    Alert,
    StyleSheet
} from 'react-native'

export default class ButtonItem extends Component {

    static propTypes = {
        label: React.PropTypes.string,
        func: React.PropTypes.func
    }

    static defaultProps = {
        label: '名称',
        func: ()=>{}
    }
    
    constructor (props) {
        super (props);
    }

    render () {
        return(
            <TouchableHighlight
                style={styles.button}
                activeOpacity={0.8}
                underlayColor='#63B8FF'
                onPress={this.props.func}
            >
                <Text style={styles.text}>{this.props.label}</Text>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        backgroundColor:'#63B8FF',
        borderRadius: 15
    },
    text: {
        color: 'white',
        alignSelf: 'center',
        padding: 10,
        fontSize: 18
    },
});