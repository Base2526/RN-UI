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
        FRIEND_MUTE,
        FRIEND_HIDE,
        FRIEND_BLOCK,
        ADDED_MY_APPLICATION,
        MODIFIED_MY_APPLICATION,
        REMOVED_MY_APPLICATION,
        UPDATE_STATUS_MY_APPLICATION,
        ADD_APPLICATION_CATEGORY}  from '../Actions/types'

const INITIAL_STATE = {users:null,
                       provider:'',
                       isLogin: false,
                       online: '-1',
                       error_message:'',
                       application_category: null
                       }

import {isEquivalent2Object} from '../Utils/Helpers'

export default (state= INITIAL_STATE, action)=>{
    console.log(action)
    switch(action.type){
        case USER_LOGIN_SUCCESS: {
            state = {...state, 
                    // user: action.user, 
                    provider: action.provider,
                    isLogin: true,
                    users: action.users,
                    online: '1',
                    }
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
                    online: action.payload.auth.online,
                    application_category: action.payload.auth.application_category,}

            return state
        }

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

        case FRIEND_HIDE:{

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

            if(value.hide === undefined){
                value = {...value, hide:true}
            }else{
                value = {...value, hide:!value.hide}
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

        case FRIEND_BLOCK:{

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

            if(value.block === undefined){
                value = {...value, block:true}
            }else{
                value = {...value, block:!value.block}
            }
            // console.log(value)

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

            return v
        }

        case ADDED_MY_APPLICATION:
        case MODIFIED_MY_APPLICATION:{
            if(state.users === null){
                return state
            }

            let my_applications = state.users.my_applications

            let key = 0
            let value = null
            _.each(my_applications, function(_v, _k) { 
                if(_k === action.my_application_id){
                    key = _k
                    value = _v
                }
            });

            if(key == 0){
                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        my_applications : {
                            ...state.users.my_applications,
                            [action.my_application_id]:{...action.my_application_data}
                        }
                    }
                }
                // console.log(v)
                return v;
            }else{

                /**
                 * เราจะ update กรณีข้อมูลเปลี่ยนแปลงเท่านั้น
                 *  */
                if(!isEquivalent2Object(value, action.my_application_data)){
                    let v = {
                        ...state,
                        users : {
                            ...state.users,
                            my_applications : {
                                ...state.users.my_applications,
                                [action.my_application_id]:action.my_application_data
                            }
                        }
                    }
                    // console.log(v)
                    return v;
                }
            }

            return state
        }

        case REMOVED_MY_APPLICATION:{

            // my_application_id:change.doc.id, my_application_data
            console.log('REMOVED_MY_APPLICATION')
            console.log(action.my_application_id)
            console.log(action.my_application_data)
            return state
        }

        case UPDATE_STATUS_MY_APPLICATION:{
            if(state.users === null){
                return state
            }

            let my_applications = state.users.my_applications

            let key = 0
            let value = null
            _.each(my_applications, function(_v, _k) { 
                if(_k === action.my_application_id){
                    key = _k
                    value = _v
                }
            });

            if(value.status === undefined){
                value = {...value, status:true}
            }else{
                value = {...value, status:!value.status}
            }

            let v = {
                ...state,
                users : {
                    ...state.users,
                    my_applications : {
                        ...state.users.my_applications,
                        [action.my_application_id]: value
                    }
                }
            }

            console.log(v)
            return state
        }

        case ADD_APPLICATION_CATEGORY:{
            // application_category
            let v = {
                ...state,
                application_category: action.data_category
            }
            return v
        }

        default:
            return state
    }
}