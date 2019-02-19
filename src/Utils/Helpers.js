import {AsyncStorage, Alert} from 'react-native'
import { Dimensions, DeviceInfo, Platform, StatusBar } from 'react-native';
import { Header } from 'react-navigation';

import { isIphoneX } from 'react-native-iphone-x-helper';

export const getUid = (state) =>{
    // console.log(state)
    if(!state._persist.rehydrated){
        return -1
    }
    return state.auth.users.user.uid
}

export async function loadAsyncStorage(key) {
    let result = {}

    if(key == null){
        result.status = false
        result.message = "key empty"
        return result
    }

    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
        result.status = true
        result.value = value
        return result
    }else{
        result.status = false
        result.message = "key not match"
        return result
    }
}

export async function saveAsyncStorage(key, data) {
    let result = {}

    if(key == null){
        result.status = false
        result.message = "key empty"
        return result
    }

    await AsyncStorage.setItem(key, JSON.stringify(data));
    result.status = true
    return result
}

export async function removeAsyncStorageByKey(key){
    
    let result = {}

    if(key == null){
        result.status = false
        result.message = "key empty"
        return result
    }

    await AsyncStorage.removeItem(key);
    result.status = true
    return result
}

export const setDrawerStatus = async status => {
    try {
      await AsyncStorage.setItem('isOpen', JSON.stringify(status));
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
};

export const getDrawerStatus = async () => {
    let isOpen = false;
    try {
        isOpen = await AsyncStorage.getItem('isOpen') || false;
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }

    return JSON.parse(isOpen);
}


export const LANDSCAPE = 'landscape';
export const PORTRAIT = 'portrait';

export const getHeaderHeight = () => {
  let height;
  const orientation = getOrientation();
  height = getHeaderSafeAreaHeight();
  height += DeviceInfo.isIPhoneX_deprecated && orientation === PORTRAIT ? 24 : 0;

  return height;
};

// This does not include the new bar area in the iPhone X, so I use this when I need a custom headerTitle component
export const getHeaderSafeAreaHeight = () => {
  const orientation = getOrientation();
  if (Platform.OS === 'ios' && orientation === LANDSCAPE && !Platform.isPad) {
    return 32;
  }
  return Header.HEIGHT;
};

export const getOrientation = () => {
  const { width, height } = Dimensions.get('window');
  return width > height ? LANDSCAPE : PORTRAIT;
};

export const validateEmail = (text) => {
    // console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(reg.test(text) === false){
      // console.log("Email is Not Correct");
      // this.setState({email:text})
      return false;
    }else{
      // this.setState({email:text})
      // console.log("Email is Correct");
      return true;
    }
}

export const validateMobile = (text) =>{
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(text.match(phoneno)){
	   return true;      
	}else{
	//    alert("Not a valid Phone Number");
	   return false;
    }
}

export const validateURL = (text) =>{
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(!regex .test(text)) {
        // alert("Please enter valid URL.");
        return false;
    } else {
        return true;
    }
}

// var isValidUrl = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;

export const validURL= (string) => {
    // var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    //   '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    //   '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    //   '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    //   '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    //   '(\#[-a-z\d_]*)?$','i'); // fragment locater
    // if(!pattern.test(str)) {
    // //   alert("Please enter a valid URL.");
    //   return false;
    // } else {
    //   return true;
    // }
    let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(string))
    {
      return true;
    }
    else
    {
      return false;
    }

    var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;

    var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/
    var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;

    if (typeof string !== 'string') {
        return false;
    }

    var match = string.match(protocolAndDomainRE);
    if (!match) {
    return false;
    }

    var everythingAfterProtocol = match[1];
    if (!everythingAfterProtocol) {
    return false;
    }

    if (localhostDomainRE.test(everythingAfterProtocol) ||
        nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true;
    }

    return false;
}

/*
    let date = new Date()
    console.log(date)

    const timestamp = Math.floor(date / 1000);
    console.log(timestamp)

    var t = new Date(timestamp * 1000);
    console.log(t.toLocaleDateString())
*/
export const currentTimestamp = () => {
    return Math.floor(new Date() / 1000);
}

export const displayTimestamp = (timestamp) =>{
    return new Date(timestamp * 1000);
}

export function getStatusBarHeight(skipAndroid: boolean = false): number {
    const X_WIDTH = 375;
    const X_HEIGHT = 812;

    const XSMAX_WIDTH = 414;
    const XSMAX_HEIGHT = 896;

    const { height: W_HEIGHT, width: W_WIDTH } = Dimensions.get('window');

    let isIPhoneX = false;

    if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
        isIPhoneX = W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT || W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT;
    }
    
    return Platform.select({
        ios: isIPhoneX ? 44 : 20,
        android: skipAndroid ? 0 : StatusBar.currentHeight,
        default: 0
    })
}

// https://github.com/react-navigation/react-navigation/blob/master/examples/NavigationPlayground/js/StackWithTranslucentHeader.js
// Inset to compensate for navigation bar being transparent.
// And improved abstraction for this will be built in to react-navigation
// at some point.
export function  getHeaderInset() {
    const NOTCH_HEIGHT = isIphoneX() ? 25 : 0;

    // $FlowIgnore: we will remove the HEIGHT static soon enough
    const BASE_HEADER_HEIGHT = Header.HEIGHT;

    const HEADER_HEIGHT =
        Platform.OS === 'ios'
        ? BASE_HEADER_HEIGHT + NOTCH_HEIGHT
        : BASE_HEADER_HEIGHT + getStatusBarHeight(true);

        // console.log("HEADER_HEIGHT : " , HEADER_HEIGHT)
        return HEADER_HEIGHT
    return Platform.select({
        ios: {
        contentInset: { top: HEADER_HEIGHT },
        contentOffset: { y: -HEADER_HEIGHT },
        },
        android: {
        contentContainerStyle: {
            paddingTop: HEADER_HEIGHT,
        },
        },
    });
}

export function isEquivalent2Object(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

export function randomKey() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

export function checkInternetConnectionDialog(){
    Alert.alert(
        '',
        'Please check internet connection and retry.',
        [
          {text: 'OK', onPress: () => console.log('close, please check internet connection and retry.')},
        ],
        {cancelable: false},
      );
}

