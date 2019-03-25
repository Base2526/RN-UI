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
import {getStatusBarHeight} from '../utils/Helpers'


// https://thekevinscott.com/background-images-in-react-native/
export default class BackgroundImage extends React.Component {

  componentDidMount(){
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
    let{name, image_url} = this.props.auth.users.profiles;
    return (
      <View style={{flex:1, paddingTop: this.getHeaderInset(), flexDirection:'row'}}>
        <FastImage
          style={StyleSheet.absoluteFill}
          source={require('../images/boxpink.png')}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={{flexDirection:'row', margin:20}}>
          {/* <TouchableOpacity>
              <TestSVG 
                  width={100}
                  height={100}
                  strokeWidth={3}
                  image_uri={image_url}/> 
          </TouchableOpacity> */}
          <View style={{justifyContent: 'flex-end', }}>
            <Text style={{fontSize:22, marginLeft:10, color:'white'}}>{name}</Text>
          </View>
        </View>
      </View>
    );
  }
}