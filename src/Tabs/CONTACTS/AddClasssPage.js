import React from 'react'

import {View, Text, TouchableOpacity, TextInput} from 'react-native'
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/FontAwesome5';

import Styles from '../../styles';

export default class AddClasssPage extends React.Component{


    static navigationOptions = ({ navigation }) => ({
        title: "Add Classs",
        // headerLeft: (
        //     <TouchableOpacity
        //         style={Styles.headerButton}
        //         onPress={() => navigation.openDrawer()}>
        //         <Icon name="bars" size={25} />
        //     </TouchableOpacity>
        // ),
        headerRight: (
            <TouchableOpacity
                style={Styles.headerButton}
                onPress={() => alert("save")}>
                <Text style={{fontSize:18}}>Save</Text>
            </TouchableOpacity>
          ),
    })

    render(){
        return(
            <View style={{flex:1, alignItems:'center'}}>
                    <TouchableOpacity 
                              style={{height:80,
                                      width: 80,
                                      borderRadius: 10,
                                      margin:10}}
                                onPress={()=>alert("1")}>
                              <FastImage
                                  style={{width: 80, height: 80, borderRadius: 10}}
                                  source={{
                                  uri: 'https://unsplash.it/400/400?image=1',
                                  headers:{ Authorization: 'someAuthToken' },
                                  priority: FastImage.priority.normal,
                                  }}
                                  resizeMode={FastImage.resizeMode.contain}
                              />
                    </TouchableOpacity>
                    <TextInput style = {{margin: 15,
                                        height: 40,
                                        width:180,
                                        borderColor: 'gray',
                                        borderWidth: 1}}
                        underlineColorAndroid = "transparent"
                        placeholder = "Name chat group"
                        placeholderTextColor = "gray"
                        autoCapitalize = "none"
                        onChangeText = {this.handleEmail}/>
                </View>
        )
    }
}