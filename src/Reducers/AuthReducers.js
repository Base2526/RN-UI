import firebase from 'react-native-firebase';
import { FOREGROUND, BACKGROUND, INACTIVE } from 'redux-enhancer-react-native-appstate';

import DeviceInfo from 'react-native-device-info';

import {USER_LOGIN_SUCCESS,
        USER_LOGIN_FAIL,
        USER_LOGOUT}  from '../Actions/types'

const INITIAL_STATE = {user:null,
                       provider:'',
                       isLogin: false,
                       online: '-1',
                       error_message:''
                       }

_online = (state, online) =>{
    
    // console.log(action)
    console.log(state)
    console.log(DeviceInfo.getUniqueID())
    // if(state.isLogin){
        // console.log(action)
        // console.log(state)

        if(state.user === null){
            // console.log('state.user')
            return
        }

        let uid = state.user.user.user.uid
        // console.log(uid)

        var updateRef = firebase.database().ref('idna/user/1/profiles/device_access/1121038/');
        updateRef.update({ 'online': online});
        // switch(action.type){
        //     case FOREGROUND:{
        //         updateRef.update({ 'online': '1'});
        //         break;
        //     } 
            
        //     case INACTIVE:{
        //         updateRef.update({ 'online': '0'});
        //         break;
        //     }

        //     case BACKGROUND:{
        //         updateRef.update({ 'online': '-1'});
        //         break;
        //     }
        // }
    // }
}

/*
init = (auth) => {
    let online = auth.online

    var updateRef = firebase.database().ref('idna/user/1/profiles/device_access/1121038/');
    updateRef.update({ 'online': online});
    // switch(online){
    //     case '1':{
    //         updateRef.update({ 'online': '1'});
    //         break;
    //     } 
        
    //     case '0':{
    //         updateRef.update({ 'online': '0'});
    //         break;
    //     }

    //     case '-1':{
    //         updateRef.update({ 'online': '-1'});
    //         break;
    //     }
    // }
}
*/

export default (state= INITIAL_STATE, action)=>{
    console.log(action)
    // this.fb(state, action)

    // console.log(action)
    // console.log(state)
    switch(action.type){
        // case EMAIL_CHANGED:{
        //     return { ...state, email: action.payload };
        // }
        // case PASSWORD_CHANGED:{
        //     return { ...state, password: action.payload}
        // }
        case USER_LOGIN_SUCCESS: {
            return {...state, 
                    user: action.user, 
                    provider: action.provider,
                    isLogin: true,
                    }
        } 
        case USER_LOGIN_FAIL: {
            return {...state,
                    provider: action.provider,
                    isLogin: false}
        }

        case USER_LOGOUT: {
            return INITIAL_STATE
        }

        case 'persist/REHYDRATE':{
            if(!action.hasOwnProperty('payload')){
                return INITIAL_STATE
            }

            if(action.payload === undefined){
                return INITIAL_STATE
            }

            if(!action.payload.hasOwnProperty('auth')){
                return INITIAL_STATE
            }
            return {...state, 
                user : action.payload.auth.user,
                isLogin: action.payload.auth.isLogin,
                provider: action.payload.auth.provider,
                online: action.payload.auth.online}
        }

        // online
        case FOREGROUND:{
            this._online(state, '1')
            return {...state,
                    online:'1'}
        } 
        
        case INACTIVE:{
            this._online(state, '0')
            return {...state,
                    online:'0'}
        }

        case BACKGROUND:{
            this._online(state, '-1')
            return {...state,
                    online:'-1'}
        }
        
        default:
            return state
    }
}