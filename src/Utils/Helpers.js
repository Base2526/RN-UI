import {AsyncStorage} from 'react-native'

import { Dimensions, DeviceInfo, Platform } from 'react-native';
import { Header } from 'react-navigation';

export const getUid = (state) =>{
    console.log(state)
    if(!state._persist.rehydrated){
        return -1
    }
    return state.auth.user.user.user.uid
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
