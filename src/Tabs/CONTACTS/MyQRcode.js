import React from 'react'
import {View, 
        Text, 
        TouchableOpacity, 
        SafeAreaView,
        CameraRoll,
        Alert,
        StyleSheet} from 'react-native'
import { connect } from 'react-redux';

import FastImage from 'react-native-fast-image'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import Spinner from 'react-native-loading-spinner-overlay';
import {
  MenuProvider,
  Menu,
  MenuContext,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';

var RNFS = require('react-native-fs')
import Share, {ShareSheet, Button} from 'react-native-share';

import * as actions from '../../Actions'
import MyIcon from '../../config/icon-font.js';

import {makeUidState, makeProfileState} from '../../Reselect'

class MyQRcode extends React.Component{

    static navigationOptions = ({ navigation }) => {
      return {
          title: "My QR code",
          headerTintColor: '#C7D8DD',
          headerStyle: {
              backgroundColor: 'rgba(186, 53, 100, 1.0)',
              // ios navigationoptions underline hide
              borderBottomWidth: 0,

              // android navigationoptions underline hide
              elevation: 0,
              shadowOpacity: 0
          },
          headerLeft: (
            <View style={{flexDirection:'row', padding:5}}>
                    <Menu style={{ zIndex: 10 }}>
                        <MenuTrigger>
                            <MyIcon
                                // style={{paddingRight:10}}
                                name={'dot-vertical'}
                                size={20}
                                color={'#C7D8DD'} />
                        </MenuTrigger>
                        <MenuOptions optionsContainerStyle={{ }}>
                            <MenuOption onSelect={() => {
                              const { params = {} } = navigation.state
                              params.handleShare()
                            }}>
                                <Text style={{padding:10, fontSize:18}}>Share</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => {

                              const { params = {} } = navigation.state
                              params.handleSaveToDevice()
                            }}>
                                <Text style={{padding:10, fontSize:18}}>Save to device</Text>
                            </MenuOption>
                            {/* <MenuOption onSelect={() => {}}>
                                <Text style={{padding:10, fontSize:18}}>Menu 2</Text>
                            </MenuOption> */}
                            
                        </MenuOptions>
                    </Menu>
                </View>
          ),
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
      }
    }

    constructor(props) {
      super(props);
  
      this.state = {
        renderContent: false,
        loading: false,
        data: [],
        page: 1,
        seed: 1,
        error: null,
        refreshing: false,


        profile:{}
      };
    }
  
    componentDidMount() {
      // setTimeout(() => {this.setState({renderContent: true})}, 0);
      this.props.navigation.setParams({handleShare: this.handleShare })
      this.props.navigation.setParams({handleSaveToDevice: this.handleSaveToDevice })

      this.props.navigation.setParams({handleCancel: this.handleCancel })
    
      this.loadData(this.props)
    }

    componentWillReceiveProps(nextProps){
      this.loadData(nextProps)
    }

    loadData = (props) =>{
      let {profile} = props
      this.setState({profile, renderContent:true})
    }

    handleShare = () => {
      let {profile} = this.state

      let shareOptions = {
        title: "Share QRcode",
        message: "Share QRcode",
        url: profile.url_my_qrcode,
        subject: "Share QRcode" //  for email
      }
    
      Share.open(shareOptions);
    }

    handleSaveToDevice = () =>{
      console.log('handleSaveToDevice')
      let {profile} = this.state
      
      let toFile = `${RNFS.DocumentDirectoryPath}/react-native.png`
      RNFS.downloadFile({
        fromUrl: profile.url_my_qrcode,
        toFile,
      }).promise.then((r) => {
        // this.setState({ isDone: true })

        var promise = CameraRoll.saveToCameraRoll(toFile);
        promise.then((result) => {
          console.log(result);
          if(!result){
            Alert.alert(
              'Save to device error.',
              '',
              [
                {text: 'Close', onPress: () => console.log('OK Pressed')},
              ],
              {cancelable: false},
            );
          }else{
            // console.log('success save image')
            Alert.alert(
              'Save to device success.',
              '',
              [
                {text: 'Close', onPress: () => console.log('OK Pressed')},
              ],
              {cancelable: false},
            );
          }
        }).catch((error) => {
          Alert.alert(
            'Save to device error.',
            '',
            [
              {text: 'Close', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );
        });
      });
    }

    handleCancel = () => {
      this.props.navigation.goBack(null)
    }

    reCreateQRcode = () =>{
      this.setState({loading:true})
      this.props.actionRecreateQRcode(this.props.uid).then((result) => {
        this.setState({loading:false})
        console.log(result)
      })
    }
   
    render() {
        let {profile, renderContent, loading} = this.state

        if(!renderContent){
          return(<View style={{flex:1}}></View>)
        }

        return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex: 1,  
                          justifyContent: 'center', 
                          alignItems: 'center',}}>
                  <Spinner
                    visible={loading}
                    textContent={'Wait...'}
                    textStyle={{color: '#FFF'}}
                    overlayColor={'rgba(0,0,0,0.5)'}/>
                  <View style={{width: 200, height: 200,}}>
                    <FastImage
                        style={{width: 200, height: 200, }}
                        source={{
                          uri: profile.url_my_qrcode,
                          headers:{ Authorization: 'someAuthToken' },
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}/>
                    <TouchableOpacity
                      style={{position:'absolute', bottom:10, right:10}}
                      onPress={()=>{
                        this.reCreateQRcode()
                      }}>
                      <MyIcon
                          name={'reload'}
                          size={25}
                          color={'#C7D8DD'} />
                    </TouchableOpacity>
                  </View>
            </View>
            <TouchableOpacity style={{position:'absolute', 
                                      right:0, 
                                      ...ifIphoneX({
                                        bottom: 30
                                      }, {
                                        bottom: 0
                                      }),
                                      padding:10,}}
                              onPress={()=>{
                                this.props.navigation.navigate("MyQRcode_QRCodeReaderPage")
                              }}>
                <Text style={{fontSize:18}}>QR code reader</Text>
            </TouchableOpacity>
        </SafeAreaView>
      )
    }
}

const mapStateToProps = (state, ownProps) => {
  // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
  //_persist.rehydrated parameter is initially set to false
  if(!state._persist.rehydrated){
    return {}
  }

  if(!state.auth.isLogin){
      return;
  }

  return{
    // profiles:state.auth.users.profiles
    uid: makeUidState(state, ownProps),
    profile: makeProfileState(state, ownProps),
  }
}

export default connect(mapStateToProps, actions)(MyQRcode);