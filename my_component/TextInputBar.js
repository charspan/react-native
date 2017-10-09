import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    PropTypes,
    StyleSheet,
    ToastAndroid
} from 'react-native'

export default class TextInputBar extends Component {

    static propTypes = {
        name: React.PropTypes.string,
        txtHide: React.PropTypes.string,
        ispassword: React.PropTypes.bool
    }

    static defaultProps = {
        name: '名称',
        txtHide: '内容',
        ispassword: false
    }
    
    constructor (props) {
        super (props)
        this.state = {
          txtValue: ''
        }
    }
    render () {
        var { style, name, txtHide, ispassword } = this.props
        return(
            <View style={styles.container}>
                <View style={styles.txtBorder}>
                    <Text style={styles.txtName}>{name}</Text>
                    <TextInput
                        underlineColorAndroid = {'transparent'}
                        style={styles.textInput}
                        multiline={false}
                        placeholder={txtHide}
                        password={ispassword} 
                        onChangeText={(text) => {
                            this.setState({
                                txtValue: text
                            });
                        }}
                        value={this.state.txtValue}
                    />
                </View>
            </View>
        );
    }

    getValue () {
        return this.state.txtValue
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row'
    },
    txtBorder: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#51A7F9',
        borderRadius: 25,
        flexDirection: 'row'
    },
    txtName: {
        width: 80,
        marginLeft: 30,
        fontSize: 18,
        alignSelf: 'center',alignItems:'center',  
        justifyContent: 'center',  
        color: '#51A7F9',
        marginRight: 10
    },
    textInput: {
        flex: 1,
        height: 50,
        marginRight: 20,
        fontSize: 18
    }
});