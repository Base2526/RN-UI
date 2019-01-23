import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';

import deepDiffer from 'react-native/lib/deepDiffer'

var _ = require('lodash');

import {USER_LOGIN_SUCCESS,
        USER_LOGIN_FAIL,
        USER_LOGOUT,
        DEVICE_ACCESS_ADDED,
        DEVICE_ACCESS_MODIFIED,
        UPDATE_PROFILE,
        ADD_FRIEND,
        MODIFIED_FRIEND,
        FRIEND_PROFILE,
        UPDATE_STATUS_FRIEND,
        ADD_GROUP,
        DELETE_GROUP,
        SELECT_ADD_CLASS,
        CLASS_MEMBERS,
        FRIEND_MUTE}  from '../Actions/types'

const INITIAL_STATE = {users:null,
                       provider:'',
                       isLogin: false,
                       online: '-1',
                       error_message:''
                       }

import {isEquivalent2Object} from '../Utils/Helpers'
// import { stat } from 'fs';

_online = (state, online) =>{
    // console.log(action)
    // console.log(state)
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
    // console.log(action)
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
        /*
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
        */

        /*
        DEVICE_ACCESS_ADDED,
        DEVICE_ACCESS_MODIFIED
        */
        case DEVICE_ACCESS_ADDED:
        case DEVICE_ACCESS_MODIFIED:{
            if(state.users === null){
                return state
            }

            let device_access = state.users.device_access
            // console.log(device_access)

            let key = 0
            let value = null
            _.each(device_access, function(_v, _k) { 
                if(_v.udid === action.data.udid){
                    key = _k
                    value = _v
                }
            });

            // console.log(value)
            // console.log(action.device)
            // console.log(isEquivalent2Object(value, action.device))

            if(key == 0){
                // console.log("#0")
                // มีเครื่องใหม่ เข้าใช้งานระบบ

                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        device_access : {
                            ...state.users.device_access,
                            [action.id]:action.data
                        }
                    }
                }
                // console.log(v)
                return v
            }else{
                // console.log("#1")
                // เป็นการ compare ก่อน update 

                // console.log(value)
                // console.log(action.device)
                // console.log(isEquivalent2Object(value, action.device))
                if(!isEquivalent2Object(value, action.data)){
                    // console.log(key)
                    // console.log(value)
                    // console.log(action.device)

                    // let _t = {...device_access, [key]:action.device}
                    // console.log(_t)

                    // console.log(state)

                    let v = {
                        ...state,
                        users : {
                            ...state.users,
                            device_access : {
                                ...state.users.device_access,
                                [key]:action.data
                            }
                        }
                    }
                    // console.log(v)
                    return v
                }
            }

            return state
        }

        case UPDATE_PROFILE:{
            if(state.users === null){
                return state
            }

            let profiles = state.users.profiles;

            if(!isEquivalent2Object(profiles, action.data)){
                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        profiles : {
                            ...state.users.profiles,
                            ...action.data
                        }
                    }
                }
                // console.log(v)
                return v
            }

            return state
        }

        case ADD_FRIEND:{
            if(state.users === null){
                return state
            }

            let friends = state.users.friends

            let key = 0
            let value = null
            _.each(friends, function(_v, _k) { 
                if(_k === action.friend_id){
                    key = _k
                    value = _v
                }
            });

            if(key == 0){
                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        friends : {
                            ...state.users.friends,
                            [action.friend_id]:{...action.data, ...{profile: action.profile}}
                        }
                    }
                }
                return v;
            }else{

                let newValue = {...action.data, ...{profile: action.profile}}
                if(!isEquivalent2Object(value, newValue)){
                    let v = {
                        ...state,
                        users : {
                            ...state.users,
                            friends : {
                                ...state.users.friends,
                                [action.friend_id]:newValue
                            }
                        }
                    }
                    return v;
                }
            }
            return state
        }

        case MODIFIED_FRIEND:{

            if(state.users === null){
                return state
            }

            let friends = state.users.friends

            let key = 0
            let value = null
            _.each(friends, function(_v, _k) { 
                if(_k === action.friend_id){
                    key = _k
                    value = _v
                }
            });

            if(key != 0){

                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        friends : {
                            ...state.users.friends,
                            [action.friend_id]:{...value, ...action.data}
                        }
                    }
                }
                // console.log(v)

                return v;
            }

            return state;
        }

        case FRIEND_PROFILE:{
            if(state.users === null){
                return state
            }

            let friends = state.users.friends

            let key = 0
            let value = null
            _.each(friends, function(_v, _k) { 
                if(_k === action.id){
                    key = _k
                    value = _v
                }
            });

            let v = {
                ...state,
                users : {
                    ...state.users,
                    friends : {
                        ...state.users.friends,
                        [action.id]: {...value, profile:action.data}
                    }
                }
            }

            // console.log(v)
            
            return v
        }

        /*
        case DEVICE_ACCESS_MODIFIED:{
            let device_access = state.users.device_access
            // console.log(device_access)

            let key = 0
            let value = null
            _.each(device_access, function(_v, _k) { 
                if(_v.udid === DeviceInfo.getUniqueID()){
                    key = _k
                    value = _v
                }
            });

            console.log(value)
            console.log(action.device)
            if (isEquivalent2Object(value, action.device)) {
                console.log(true)
            }else{
                console.log(false)
            }

            // console.log(deepDiffer(value, action.device))

            return state
        }
        */

        case UPDATE_STATUS_FRIEND:{

            if(state.users === null){
                return state
            }

            let friends = state.users.friends

            let key = 0
            let value = null
            _.each(friends, function(_v, _k) { 
                if(_k === action.id){
                    key = _k
                    value = _v
                }
            });

            console.log(key, ' | ', value)
            
            return state
        }

        case ADD_GROUP:{

            if(state.users === null){
                return state
            }

            let groups = state.users.groups

            let key = 0
            let value = null
            _.each(groups, function(_v, _k) { 
                if(_k === action.group_id){
                    key = _k
                    value = _v
                }
            });

            // console.log(key, " | ", value)

            // if(key == 0){
                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        groups : {
                            ...state.users.groups,
                            [action.group_id]: action.data
                        }
                    }
                }
                // console.log(v)
                return v
            // }

            return state
        }

        case DELETE_GROUP:{
            if(state.users === null){
                return state
            }

            let groups = state.users.groups
           
            // เป็น การลบ object ที่มี key ตรงกันออก
            // https://stackoverflow.com/questions/3455405/how-do-i-remove-a-key-from-a-javascript-object
            let data = _.omit(groups,action.group_id)

            let v = {
                ...state,
                users : {
                    ...state.users,
                    groups :data
                }
            }
            return v
        }

        case SELECT_ADD_CLASS:{
            if(state.users === null){
                return state
            }

            let classs = state.users.classs

            // console.log(classs)
            // console.log(action.class_id)
            // console.log(action.class_data)

            let v = {
                ...state,
                users : {
                    ...state.users,
                    classs : {
                        ...state.users.classs,
                        [action.class_id]: action.class_data
                    }
                }
            }

            // console.log(v)
            return v;
        }

        case CLASS_MEMBERS:{
            if(state.users === null){
                return state
            }

            let classs = state.users.classs

            let key = 0
            let value = null
            _.each(classs, function(_v, _k) { 
                if(_k === action.parent_id){
                    key = _k
                    value = _v
                }
            })

            // console.log(action.class_members_id)
            if(value.members === undefined){
                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        classs : {
                            ...state.users.classs,
                            [action.parent_id]: {...value, members:{[action.class_members_id]: action.class_members_data}}
                        }
                    }
                }           
                return v
            }else{

                let members = value.members

                let a = 0
                let b = null
                _.each(members, function(_v, _k) { 
                    if(_k === action.class_members_id){
                        a = _k
                        b = _v
                    }
                })

                // console.log(members)
                // console.log(a, ' | ', b)

                if(a == 0){
                    members = {...members, ...{[action.class_members_id]:action.class_members_data}}
                    // console.log(members)

                    let v = {
                        ...state,
                        users : {
                            ...state.users,
                            classs : {
                                ...state.users.classs,
                                [action.parent_id]: {...value, members}
                            }
                        }
                    }       
                    // console.log(v)

                    return v
                }else{
                    members = {...members, ...{[action.class_members_id]:action.class_members_data}}
                    // console.log(members)

                    let v = {
                        ...state,
                        users : {
                            ...state.users,
                            classs : {
                                ...state.users.classs,
                                [action.parent_id]: {...value, members}
                            }
                        }
                    }       
                    // console.log(v)

                    return v
                }
            }
            return state;
        }
        
        case FRIEND_MUTE:{
            if(state.users === null){
                return state
            }

            let friends = state.users.friends

            let key = 0
            let value = null
            _.each(friends, function(_v, _k) { 
                if(_k === action.friend_id){
                    key = _k
                    value = _v
                }
            });

            // console.log(key)
            // console.log(value)
            if(value.mute === undefined){
                value = {...value, mute:true}
            }else{
                value = {...value, mute:!value.mute}
            }
            // console.log(value)

            // friends
            let v = {
                ...state,
                users : {
                    ...state.users,
                    friends : {
                        ...state.users.friends,
                        [action.friend_id]: value
                    }
                }
            }
            // console.log(v)
            return v
        }

        default:
            return state
    }
}