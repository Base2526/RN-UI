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
var _ = require('lodash');

import * as actions from '../../actions'
import MyIcon from '../../config/icon-font.js';
import {isEmpty} from '../../utils/Helpers'
import {makeUidState, makeMyAppicationsState} from '../../reselect'

class MyApplicationQRcodePage extends React.Component{

    static navigationOptions = ({ navigation }) => {
      return {
          // title: "QR code for ",
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
            <View style={{flexDirection:'row', padding:5}}>
                    <Menu style={{ zIndex: 10 }}>
                        <MenuTrigger>
                            <MyIcon
                                style={{paddingRight:5}}
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
                        </MenuOptions>
                    </Menu>
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

        application_id:0,
        my_application:{}
      };
    }
  
    componentDidMount() {
        // setTimeout(() => {this.setState({renderContent: true})}, 0);
        this.props.navigation.setParams({handleShare: this.handleShare })
        this.props.navigation.setParams({handleSaveToDevice: this.handleSaveToDevice })

        this.props.navigation.setParams({handleCancel: this.handleCancel })
        
        const { navigation } = this.props;
        const application_id = navigation.getParam('application_id', null);

        this.setState({application_id},()=>{
            this.loadData(this.props)
        })

    }

    componentWillReceiveProps(nextProps){
      this.loadData(nextProps)
    }

    loadData = (props) =>{
    //   let {profile} = props
    //   this.setState({profile, renderContent:true})

        let {uid, my_applications} = props
        let {application_id}  = this.state

        let my_application =_.find(my_applications, (v, k)=>{
                                return k == application_id
                            })

        if(isEmpty(my_application)){
            this.props.navigation.goBack(null);
            return
        }

        if(isEmpty(my_application.qrcode_url)){
          this.setState({loading:true})
          this.props.actionRecreateQRcodeforApplication(uid, application_id).then((result) => {
            console.log(result)

            this.setState({loading:false, my_application, renderContent:true})
          })
        }else{
          this.setState({my_application, renderContent:true})
        }
    }

    handleShare = () => {
        let {my_application} = this.state

      let shareOptions = {
        title: "Share QRcode",
        message: "Share QRcode",
        url: my_application.qrcode_url,
        subject: "Share QRcode" //  for email
      }
    
      Share.open(shareOptions);
    }

    handleSaveToDevice = () =>{
    //   console.log('handleSaveToDevice')
      let {my_application} = this.state
      
      let toFile = `${RNFS.DocumentDirectoryPath}/react-native.png`
      RNFS.downloadFile({
        fromUrl: my_application.qrcode_url,
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
      let {uid} = this.props
      let {application_id} = this.state

      this.setState({loading:true})
      this.props.actionRecreateQRcodeforApplication(uid, application_id).then((result) => {
        this.setState({loading:false})
        console.log(result)
      })
    }
   
    render() {
        let {my_application, renderContent, loading} = this.state

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
                          uri: my_application.qrcode_url,
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
    // profile: makeProfileState(state, ownProps),
    my_applications: makeMyAppicationsState(state, ownProps),
  }
}

export default connect(mapStateToProps, actions)(MyApplicationQRcodePage);