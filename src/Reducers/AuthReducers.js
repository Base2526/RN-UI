import firebase from 'react-native-firebase';
import { FOREGROUND, BACKGROUND, INACTIVE } from 'redux-enhancer-react-native-appstate';

import DeviceInfo from 'react-native-device-info';

var _ = require('lodash');

import {USER_LOGIN_SUCCESS,
        USER_LOGIN_FAIL,
        USER_LOGOUT}  from '../Actions/types'

const INITIAL_STATE = {users:null,
                       provider:'',
                       isLogin: false,
                       online: '-1',
                       error_message:''
                       }

_online = (state, online) =>{
    // console.log(action)
    console.log(state)
    // console.log(DeviceInfo.getUniqueID())
    // if(state.isLogin){
    // console.log(action)
    // console.log(state)

    if(state.users === null){
        // console.log('state.user')
        return
    }

    // let device_access = state.users.profiles.device_access
    let device_access = state.users.device_access
    
    let key = 0
    _.each(device_access, function(_v, _k) { 
        if(_v.udid === DeviceInfo.getUniqueID()){
            key = _k
        }
    });

    if(key === 0){
        return;
    }

    let uid = state.users.user.uid;

    let userRef = firebase.firestore().collection('users').doc(uid).collection('device_access').doc(key)
    /*
        check is_login == 1 หรือไม่ ก่อนทำงาน 
        จะมีกรณีถูก forelogout จะมีการ update online : 1 โดยความเป็นจิงไม่ควรเป็นแบบนั้น
        
        *** เราสามารถข้างการเช็ดได้เลย{เพราะจะเสียเวลาวิ่งไปดึงข้อมูลทุกครั้งก่อนเสมอ} แต่ตอนนี้ใช้การเช็ด
    */
    const doc = userRef.get()
    doc.then(v=>{
        // console.log(v.data())
        let data = v.data()
        if(data.is_login == 1){
            userRef.set({online},{ merge: true })
        }else{
            console.log('not login')
        }
    })
    
    /*
    check before set เพราะจะมีกรณีที่ user ลบ ออกจากระบบแล้ว 
    */
    // const doc = userRef.get()
    // doc.then(v=>{
    //     console.log(v)
        
    //     if(v.exists){
    //         userRef.set({
    //             profiles: {
    //                 device_access:{
    //                     [key]:{
    //                         online
    //                     }
    //                 }
    //             }
    //         },{ merge: true });
    //     }
    // })

    // const doc = await userRef.get()
    // console.log(doc.exists)
    // if(doc.exists){
        
    // }else{
    //     console.log('user lost')
    // }
    

    // console.log(userRef)
        /*
        let uid = state.users.user.uid
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
    */
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
            state = {...state, 
                    // user: action.user, 
                    provider: action.provider,
                    isLogin: true,
                    users: action.users,
                    online: '1',
                    }

            this._online(state, '1')
            return state
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

            state = {...state, 
                    // user : action.payload.auth.user,
                    users: action.payload.auth.users,
                    isLogin: action.payload.auth.isLogin,
                    provider: action.payload.auth.provider,
                    online: action.payload.auth.online}

            this._online(state, '1')

            return state
        }

        // online
        case FOREGROUND:{
            state = {...state,
                    online:'1'}

            this._online(state, '1')
            return state
        } 
        
        case INACTIVE:{   
            state = {...state,
                    online:'0'}

            this._online(state, '0')
            return state
        }

        case BACKGROUND:{
            state = {...state,
                online:'0'}

            this._online(state, '0')
            return state
        }
        
        default:
            return state
    }
}