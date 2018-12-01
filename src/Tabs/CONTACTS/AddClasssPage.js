import React from 'react'

import {View, Text, TouchableOpacity, TextInput} from 'react-native'
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/FontAwesome5';

import Styles from '../../styles';

import ImagePicker from 'react-native-image-picker';

// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    noData: true,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    quality: 0.7,
    maxWidth: 500,
    maxHeight: 500,
  };

export default class AddClasssPage extends React.Component{

    constructor(props){
        super(props)
        
        this.state = {
            avatarSource: {"uri":"https://unsplash.it/400/400?image=1"}
        }
    }

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
        style={{paddingRight:10}}
        onPress={() => alert("Create")}>
          <Text style={{fontSize:16, fontWeight:'600'}}>Create</Text>
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
                                onPress={()=>
                                {
                                  /**
                                   * The first arg is the options object for customization (it can also be null or omitted for default options),
                                   * The second arg is the callback which sends object: response (more info in the API Reference)
                                   */
                                  ImagePicker.showImagePicker(options, (response) => {
                                    console.log('Response = ', response);

                                    if (response.didCancel) {
                                      console.log('User cancelled image picker');
                                    } else if (response.error) {
                                      console.log('ImagePicker Error: ', response.error);
                                    } else if (response.customButton) {
                                      console.log('User tapped custom button: ', response.customButton);
                                    } else {
                                      const source = { uri: response.uri };

                                      // You can also display the image using data:
                                      // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                                      this.setState({
                                        avatarSource: source,
                                      });

                                      console.log(this.state.avatarSource.uri)
                                    }
                                  });

                                }}>
                              <FastImage
                                  style={{width: 80, height: 80, borderRadius: 10}}
                                  source={{
                                  uri: this.state.avatarSource.uri,
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