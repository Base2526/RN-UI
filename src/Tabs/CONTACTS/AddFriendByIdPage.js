import React from 'react'
import {View, Text, TextInput, TouchableHighlight} from 'react-native'

export default class AddFriendByIdPage extends React.Component{

    onFind(){
        alert('onFind')
    }
    
    render(){
        return(<View style={{flexDirection:'column', alignItems:'center'}}>
            <TextInput style = {{margin: 15,
                                        height: 40,
                                        width: 140,
                                        borderColor: 'gray',
                                        borderWidth: 1}}
                        underlineColorAndroid = "transparent"
                        placeholder = "Input id"
                        placeholderTextColor = "gray"
                        autoCapitalize = "none"
                        onChangeText = {this.handleEmail}/>
            <TouchableHighlight
                onPress={this.onFind.bind(this)}>
                    <Text style={{color:'green', fontSize:16}}>Find</Text>
            </TouchableHighlight>
        </View>)
    }
}