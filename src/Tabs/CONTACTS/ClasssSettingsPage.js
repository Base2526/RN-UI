import React from 'react'
import {View, 
        Alert, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity, 
        Image,
        TextInput,
        ScrollView,
        KeyboardAvoidingView
        } from 'react-native'
import { connect } from 'react-redux';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';

import {getStatusBarHeight} from '../../Utils/Helpers'

import * as actions from '../../Actions'

import Constant from '../../Utils/Constant'
import MyIcon from '../../config/icon-font.js';

class ClasssSettingsPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "Classs setting",
        headerTintColor: '#C7D8DD',
        headerStyle: {
            backgroundColor: 'rgba(186, 53, 100, 1.0)',
  
            // ios navigationoptions underline hide
            borderBottomWidth: 0,
  
            // android navigationoptions underline hide
            elevation: 0,
            shadowOpacity: 0
          },
          headerRight: (
            <View style={{marginRight:10}}>
                <TouchableOpacity
                    style={{padding:5}}
                    // disabled={isModify ? false: true}
                    onPress={() => {
                        const { params = {} } = navigation.state
                        params.handleCancel()
                    }}>
                    <MyIcon
                        name={'cancel'}
                        size={25}
                        color={'#C7D8DD'} />
                </TouchableOpacity>
            </View>
        ),
    });


    constructor(props) {
        super(props)

        this.state ={
            image_url:''
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({handleCancel: this.handleCancel })
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    groupProfilePicture = () => {
        let options =  {
            title: 'Select group profile picture',
            noData: true,
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
            quality: 0.7,
            maxWidth: 500,
            maxHeight: 500,
        }

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // this.setState({loading:true})
                // this.props.actionUpdateGroupPictureProfile(this.props.uid, this.state.group_id, response.uri).then((result) => {
                //     console.log(result)

                //     this.setState({loading:false})

                //     // setTimeout(() => {
                //     //     Alert.alert('Oops!');
                //     //   }, 100);
                // })

                this.setState({image_url: response.uri})
            }
        });
    }

    render(){

        console.log(this.state.image_url)
        return(
        <KeyboardAwareScrollView>
        <View style={{flex:1}}>
            
            <View style={{flex: 1,}}>
          
            <TableView >
                <Section
                    sectionPaddingTop={5}
                    sectionPaddingBottom={0}
                    separatorInsetLeft={0}>
                    <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                Classs Profile Picture
                                </Text>
                            </View>
                        }
                    />
                    
                    <Cell
                        cellStyle="Basic"
                        titleTextColor="#007AFF"
                        hideSeparator={true}
                        cellContentView={
                        <View style={{
                            flexDirection:'row', 
                            height: 150,
                            width: 150,
                            marginBottom:10}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.groupProfilePicture()
                                }}>
                                
                                <FastImage
                                    style={{width: 150, height: 150}}
                                    source={{
                                        uri: this.state.image_url == "" ? Constant.DEFAULT_AVATARSOURCE_URI : this.state.image_url,
                                        headers:{ Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{position:'absolute', right:0, bottom:0, padding:5, margin:5}}
                                            onPress={()=>{
                                                this.groupProfilePicture()
                                            }}>
                                <MyIcon
                                    name={'camera'}
                                    size={20}
                                    color={'#C7D8DD'} 
                                    />
                            </TouchableOpacity>
                        </View>
                        }
                    />
                </Section>
                <Section
                    sectionPaddingTop={5}
                    sectionPaddingBottom={0}
                    separatorInsetLeft={0}>
                    <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                Class name
                                </Text>
                            </View>
                        }
                    />
                    <Cell
                        cellContentView={
                            <TextInput
                            style={{ fontSize: 22, flex: 1 }}
                            placeholder="input class name"
                            />
                        }
                        />
                </Section>
            </TableView>
          </View>
        </View>
        </KeyboardAwareScrollView>)
    }
}

const mapStateToProps = (state) => {
    console.log(state)

    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
      auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(ClasssSettingsPage);