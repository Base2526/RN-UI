import React from 'react';
import {
    View,
  AppRegistry,
  ImageBackground,
  Text,
  Platform,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import { Header } from 'react-navigation';

import { isIphoneX } from 'react-native-iphone-x-helper';

import FastImage from 'react-native-fast-image'

import {getStatusBarHeight} from '../Utils/Helpers'

import ImageWithDefault from '../Utils/ImageWithDefault'

const remote = 'http://s1.bwallpapers.com/wallpapers/2014/05/09/blue-full-hd-desktop-wallpapers_034316171.jpg';

// https://thekevinscott.com/background-images-in-react-native/
export default class BackgroundImage extends React.Component {

    componentDidMount(){
      // console.log(this.props.auth.users.profiles.bg_url)

    }

// https://github.com/react-navigation/react-navigation/blob/master/examples/NavigationPlayground/js/StackWithTranslucentHeader.js
    // Inset to compensate for navigation bar being transparent.
    // And improved abstraction for this will be built in to react-navigation
    // at some point.
  getHeaderInset() {
    const NOTCH_HEIGHT = isIphoneX() ? 25 : 0;

    // $FlowIgnore: we will remove the HEIGHT static soon enough
    const BASE_HEADER_HEIGHT = Header.HEIGHT;

    const HEADER_HEIGHT =
      Platform.OS === 'ios'
        ? BASE_HEADER_HEIGHT + NOTCH_HEIGHT
        : BASE_HEADER_HEIGHT + getStatusBarHeight();

    return HEADER_HEIGHT    
  }

  render() {
    const resizeMode = 'center';
    const text = 'This is some text inlaid in an <Image />';


    console.log(this.props.auth.users.profiles)

    let{name, image_url, bg_url} = this.props.auth.users.profiles;

    return (
      // <ImageBackground
      //   style={{
      //     backgroundColor: '#ccc',
      //     flex: 1,
      //     resizeMode,
      //   //   position: 'absolute',
      //     width: '100%',
      //     height: '100%',
      //     justifyContent: 'center',
      //   }}
      //   source={{ uri: remote }}
      // >
      <View style={{flex:1, paddingTop: this.getHeaderInset(), flexDirection:'row'}}>
            <FastImage
              style={StyleSheet.absoluteFill}
              // style={{borderColor: '#000', borderWidth:4}}
              // source={{
              // uri: bg_url,
              // headers:{ Authorization: 'someAuthToken' },
              // priority: FastImage.priority.normal,
              // }}
              source={require('../Images/boxpink.png')}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={{flexDirection:'row', margin:20}}>
              <TouchableOpacity
                  style={{height:60,
                          width: 60,
                          borderRadius: 10,
                          // margin: 20,
                          // backgroundColor:'blue',
                          // borderWidth:1,
                          // borderColor:'#000'
                          }}        
                  >
{/* source={require('../../Images/boxpink.png')} */}
                  <ImageWithDefault 
                      source={{uri: image_url}}
                      style={{width: 60, height: 60, borderRadius: 10, borderWidth:1, borderColor:'gray'}}
                  />      
              </TouchableOpacity>
              <View style={{justifyContent: 'flex-end', }}>
                <Text style={{fontSize:22, marginLeft:10, color:'white'}}>{name}</Text>
              </View>
            </View>
            {/* <View style={{flexDirection:'row', flex:1, justifyContent:'flex-end'}}>
                <TouchableOpacity style={{margin:5}}>
                    <Text style={{color:'white'}}>EDIT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{margin:5}}>
                    <Text style={{color:'white'}}>SHARE</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    );
  }
}