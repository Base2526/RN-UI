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
        MODIFIED_GROUP,
        DELETE_GROUP,
        UPDATE_GROUP_PICTURE_PROFILE,
        FAVORITES_GROUP,
        MEMBER_JOIN_GROUP,
        MEMBER_DECLINE_GROUP,
        MEMBER_INVITE_AGAIN_GROUP,
        MEMBER_LEAVE_GROUP,
        ADDED_GROUP_MEMBER,
        MODIFIED_GROUP_MEMBER,
        REMOVED_GROUP_MEMBER,
        ADDED_GROUP_ADMIN,
        MODIFIED_GROUP_ADMIN, 
        REMOVED_GROUP_ADMIN,
        SELECT_ADD_CLASS,
        CLASS_MEMBERS,
        FRIEND_MUTE,
        FRIEND_HIDE,
        FRIEND_BLOCK,
        FRIEND_FAVORITE,
        ADDED_MY_APPLICATION,
        MODIFIED_MY_APPLICATION,
        REMOVED_MY_APPLICATION,
        UPDATE_STATUS_MY_APPLICATION,
        ADD_APPLICATION_CATEGORY,
        UPDATE_PICTURE_PROFILE,
        UPDATE_PICTURE_BG_PROFILE,
        EDIT_DISPLAY_NAME_PROFILE,
        EDIT_STATUS_MESSAGE_PROFILE,
        // EDIT_MY_ID_PROFILE,
        GENDER_PROFILE,
        INTERESTE_IN_PROFILE,
        BIRTHDAY_PROFILE,

        ADD_PHONE_PROFILE,
        EDIT_PHONE_PROFILE,
        REMOVE_PHONE_PROFILE,

        ADD_PHONE_FRIEND,
        EDIT_PHONE_FRIEND,
        REMOVE_PHONE_FRIEND,

        ADD_WEBSITE_FRIEND,
        EDIT_WEBSITE_FRIEND,
        REMOVE_WEBSITE_FRIEND,

        ADD_EMAIL_FRIEND,
        EDIT_EMAIL_FRIEND,
        REMOVE_EMAIL_FRIEND,

        ADDRESS_PROFILE,

        ADD_WEBSITE_PROFILE,
        EDIT_WEBSITE_PROFILE,
        REMOVE_WEBSITE_PROFILE,
    
        ADD_EMAIL_PROFILE,
        EDIT_EMAIL_PROFILE,
        REMOVE_EMAIL_PROFILE,
        
    
        ADD_MY_ID_PROFILE,
        EDIT_MY_ID_PROFILE,
        REMOVE_MY_ID_PROFILE}  from '../Actions/types'

const INITIAL_STATE = {users:null,
                       provider:'',
                       isLogin: false,
                       online: '-1',
                       error_message:'',
                       application_category: null
                       }

import {isEquivalent2Object} from '../Utils/Helpers'

import Constant from '../Utils/Constant'

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

        case UPDATE_PICTURE_PROFILE:{
            if(state.users === null){
                return state
            }

            // let profiles = state.users.profiles;

            let v = {
                ...state,
                users : {
                    ...state.users,
                    profiles : {
                        ...state.users.profiles,
                        image_url:action.image_url
                    }
                }
            }

            // console.log(v)
            return v
        }

        case UPDATE_PICTURE_BG_PROFILE:{
            if(state.users === null){
                return state
            }

            // let profiles = state.users.profiles;

            let v = {
                ...state,
                users : {
                    ...state.users,
                    profiles : {
                        ...state.users.profiles,
                        bg_url:action.bg_url
                    }
                }
            }

            return v
        }

        case EDIT_DISPLAY_NAME_PROFILE:{
            if(state.users === null){
                return state
            }

            let name = state.users.profiles.name
            if(name !== action.profile_name){
                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        profiles : {
                            ...state.users.profiles,
                            name:action.profile_name
                        }
                    }
                }
                return v
            }
            return state
        }

        case EDIT_STATUS_MESSAGE_PROFILE:{
            if(state.users === null){
                return state
            }

            let v = {
                ...state,
                users : {
                    ...state.users,
                    profiles : {
                        ...state.users.profiles,
                        status_message:action.status_message
                    }
                }
            }

            return v
        }

        // case EDIT_MY_ID_PROFILE: {
        //     if(state.users === null){
        //         return state
        //     }

        //     let v = {
        //         ...state,
        //         users : {
        //             ...state.users,
        //             profiles : {
        //                 ...state.users.profiles,
        //                 my_id:action.my_id
        //             }
        //         }
        //     }
        //     return v
        // }

        // dispatch({ type: GENDER_PROFILE, gender:gender_id});

        case GENDER_PROFILE: {
            if(state.users === null){
                return state
            }

            let v = {
                ...state,
                users : {
                    ...state.users,
                    profiles : {
                        ...state.users.profiles,
                        gender:action.gender_id
                    }
                }
            }
            return v
        }

        case BIRTHDAY_PROFILE : {
            if(state.users === null){
                return state
            }

            let v = {
                ...state,
                users : {
                    ...state.users,
                    profiles : {
                        ...state.users.profiles,
                        birthday:action.birthday
                    }
                }
            }
            return v
        }

        // INTERESTE_IN_PROFILE
        case INTERESTE_IN_PROFILE :{
            if(state.users === null){
                return state
            }

            let intereste_in = state.users.profiles.intereste_in

            if(intereste_in === undefined){
                return state
            }

            console.log(intereste_in)
            console.log(action.intereste_in)
            let v = {...state,
                        users : {
                            ...state.users,
                            profiles : {
                                ...state.users.profiles,
                                // ...{intereste_in:{[randomKey()]:{id: action.interestein_id, enable: true}}}
                                intereste_in: action.intereste_in
                            }
                        }
                    }

            console.log(v)
            return v
        }

        case ADD_PHONE_PROFILE:{
            if(state.users === null){
                return state
            }

            let v = {
                ...state,
                users : {
                    ...state.users,
                    profiles : {
                        ...state.users.profiles,
                        // ...{intereste_in:{[randomKey()]:{id: action.interestein_id, enable: true}}}
                        phones : {
                            ...state.users.profiles.phones,
                            [action.phone_key]:{phone_number: action.phone_number, is_verify:action.is_verify}
                        }
                    }
                }
            }
            return v
        }

        case EDIT_PHONE_PROFILE:{
            if(state.users === null){
                return state
            }

            let phones = state.users.profiles.phones
            if(Object.keys(phones).length == 0){
                return state
            }

            let value = null
            _.each(phones, function(_v, _k) { 
                if(_k === action.phone_key){
                    value = _v
                }
            });

            if(value !== null){
                let newPhones = {...phones, [action.phone_key]:{phone_number: action.phone_number}}

                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        profiles : {
                            ...state.users.profiles,
                            // ...{intereste_in:{[randomKey()]:{id: action.interestein_id, enable: true}}}
                            phones : {
                                ...state.users.profiles.phones, ...newPhones
                            }
                        }
                    }
                }
                // console.log(v)
                return v
            }

            return state
        }

        case REMOVE_PHONE_PROFILE:{
            if(state.users === null){
                return state
            }

            let phones = {...state.users.profiles.phones}
            if(Object.keys(phones).length == 0){
                return state
            }

            let newPhones = _.omit(phones, action.phone_key)

            let v = {
                ...state,
                users : {
                    ...state.users,
                    profiles : {
                        ...state.users.profiles,
                        phones : newPhones
                    }
                }
            }
            return v
        }

        case ADD_PHONE_FRIEND :{
            if(state.users === null){
                return state
            }

            let friends = state.users.friends

            let friend = _.find(friends,  function(v, k) { 
                return k == action.friend_id
            })

            if(friend === undefined){
                return state
            }

            if(friend.profile.phones === undefined){
                let {profile} = friend

                let newProfile = {...profile, phones:{[action.phone_key]: action.phone_data}}

                let newFriend = {...friend, 
                                    profile:{
                                        ...friend.profile, ...newProfile
                                    }
                                }
  
                let v = {...state,
                            users : {
                                ...state.users,
                                friends : {
                                    ...state.users.friends,
                                    [action.friend_id]:newFriend
                                }
                            }
                        }
                return v
            }else{
                
                let phones = friend.profile.phones

                let phone = _.find(phones,  function(v, k) { 
                    return k == action.phone_key && _.isEqual(v, action.phone_data)
                })

                if(phone === undefined){
                    let newPhones = {...phones, [action.phone_key]: action.phone_data}
                    let {profile} = friend
                    let newProfile = {...profile, phones:newPhones}
                    let newFriend = {...friend, 
                        profile:{
                            ...friend.profile, ...newProfile
                        }
                    }
    
                    let v = {...state,
                                users : {
                                    ...state.users,
                                    friends : {
                                        ...state.users.friends,
                                        [action.friend_id]:newFriend
                                    }
                                }
                            }
                    return v
                }
            }
            return state
        }

        case EDIT_PHONE_FRIEND:{
            if(state.users === null){
                return state
            }

            return state
        }

        case REMOVE_PHONE_FRIEND:{
            if(state.users === null){
                return state
            }

            return state
        }

        // ADD_WEBSITE_FRIEND,
        // EDIT_WEBSITE_FRIEND,
        // REMOVE_WEBSITE_FRIEND,
        case ADD_WEBSITE_FRIEND:{
            if(state.users === null){
                return state
            }

            // websites
            let friends = state.users.friends

            let friend = _.find(friends,  function(v, k) { 
                return k == action.friend_id
            })

            if(friend === undefined){
                return state
            }

            if(friend.profile.websites === undefined){
                let {profile} = friend

                let newProfile = {...profile, websites:{[action.website_key]: action.website_data}}

                let newFriend = {...friend, 
                                    profile:{
                                        ...friend.profile, ...newProfile
                                    }
                                }
  
                let v = {...state,
                            users : {
                                ...state.users,
                                friends : {
                                    ...state.users.friends,
                                    [action.friend_id]:newFriend
                                }
                            }
                        }
                // console.log(v)
                return v
            }else{
                
                let websites = friend.profile.websites

                let website = _.find(websites,  function(v, k) { 
                    return k == action.website_key && _.isEqual(v, action.website_data)
                })

                if(website === undefined){
                    let newWebsites = {...websites, [action.website_key]: action.website_data}
                    let {profile} = friend
                    let newProfile = {...profile, websites:newWebsites}
                    let newFriend = {...friend, 
                                        profile:{
                                            ...friend.profile, ...newProfile
                                        }
                                    }
    
                    let v = {...state,
                                users : {
                                    ...state.users,
                                    friends : {
                                        ...state.users.friends,
                                        [action.friend_id]:newFriend
                                    }
                                }
                            }
                    // console.log(v)
                    return v
                }
            }
            return state
        }

        case EDIT_WEBSITE_FRIEND:{
            if(state.users === null){
                return state
            }

            return state
        }

        case REMOVE_WEBSITE_FRIEND:{
            if(state.users === null){
                return state
            }

            return state
        }


        // ADD_EMAIL_FRIEND,
        // EDIT_EMAIL_FRIEND,
        // REMOVE_EMAIL_FRIEND,

        // emails
        case ADD_EMAIL_FRIEND:{
            if(state.users === null){
                return state
            }

            // websites
            let friends = state.users.friends

            let friend = _.find(friends,  function(v, k) { 
                return k == action.friend_id
            })

            if(friend === undefined){
                return state
            }

            if(friend.profile.emails === undefined){
                let {profile} = friend

                let newProfile = {...profile, emails:{[action.email_key]: action.email_data}}

                let newFriend = {...friend, 
                                    profile:{
                                        ...friend.profile, ...newProfile
                                    }
                                }
  
                let v = {...state,
                            users : {
                                ...state.users,
                                friends : {
                                    ...state.users.friends,
                                    [action.friend_id]:newFriend
                                }
                            }
                        }
                // console.log(v)
                return v
            }else{
                
                let emails = friend.profile.emails

                let email = _.find(emails,  function(v, k) { 
                    return k == action.email_key && _.isEqual(v, action.email_data)
                })

                if(email === undefined){
                    let newEmails = {...emails, [action.email_key]: action.email_data}
                    let {profile} = friend
                    let newProfile = {...profile, emails:newEmails}
                    let newFriend = {...friend, 
                                        profile:{
                                            ...friend.profile, ...newProfile
                                        }
                                    }
    
                    let v = {...state,
                                users : {
                                    ...state.users,
                                    friends : {
                                        ...state.users.friends,
                                        [action.friend_id]:newFriend
                                    }
                                }
                            }
                    // console.log(v)
                    return v
                }
            }
            return state
        }

        case ADD_EMAIL_FRIEND:{
            if(state.users === null){
                return state
            }

            return state
        }

        case REMOVE_EMAIL_FRIEND:{
            if(state.users === null){
                return state
            }

            return state
        }



        case ADDRESS_PROFILE : {
            if(state.users === null){
                return state
            }

            let v = {
                ...state,
                users : {
                    ...state.users,
                    profiles : {
                        ...state.users.profiles,
                        address:action.address
                    }
                }
            }
            return v
        }


        /* 
        ADD_WEBSITE_PROFILE,
        EDIT_WEBSITE_PROFILE,
        REMOVE_WEBSITE_PROFILE
        */
        case ADD_WEBSITE_PROFILE:{
            if(state.users === null){
                return state
            }

            let v = {
                ...state,
                users : {
                    ...state.users,
                    profiles : {
                        ...state.users.profiles,
                        // ...{intereste_in:{[randomKey()]:{id: action.interestein_id, enable: true}}}
                        websites : {
                            ...state.users.profiles.websites,
                            [action.website_key]:{url: action.url}
                        }
                    }
                }
            }

            // console.log(v)
            return v
        }

        case EDIT_WEBSITE_PROFILE:{
            if(state.users === null){
                return state
            }

            let websites = state.users.profiles.websites
            if(Object.keys(websites).length == 0){
                return state
            }

            let value = null
            _.each(websites, function(_v, _k) { 
                if(_k === action.website_key){
                    value = _v
                }
            });

            if(value !== null){
                let newWebsites = {...websites, [action.website_key]:{url: action.url}}

                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        profiles : {
                            ...state.users.profiles,
                            // ...{intereste_in:{[randomKey()]:{id: action.interestein_id, enable: true}}}
                            websites : {
                                ...state.users.profiles.websites, ...newWebsites
                            }
                        }
                    }
                }
                // console.log(v)
                return v
            }

            return state
        }

        case REMOVE_WEBSITE_PROFILE:{
            if(state.users === null){
                return state
            }

            let websites = {...state.users.profiles.websites}
            if(Object.keys(websites).length == 0){
                return state
            }

            let newWebsites = _.omit(websites, action.website_key)

            let v = {
                ...state,
                users : {
                    ...state.users,
                    profiles : {
                        ...state.users.profiles,
                        websites : newWebsites
                    }
                }
            }
            return v
        }

        /*
        ADD_EMAIL_PROFILE,
        EDIT_EMAIL_PROFILE,
        REMOVE_EMAIL_PROFILE,
        */
        case ADD_EMAIL_PROFILE:{
            if(state.users === null){
                return state
            }

            let v = {
                ...state,
                users : {
                    ...state.users,
                    profiles : {
                        ...state.users.profiles,
                        // ...{intereste_in:{[randomKey()]:{id: action.interestein_id, enable: true}}}
                        emails : {
                            ...state.users.profiles.emails,
                            [action.email_key]:{email: action.email}
                        }
                    }
                }
            }

            // console.log(v)
            return v
        }

        case EDIT_EMAIL_PROFILE:{
            if(state.users === null){
                return state
            }

            let emails = state.users.profiles.emails
            if(Object.keys(emails).length == 0){
                return state
            }

            let value = null
            _.each(emails, function(_v, _k) { 
                if(_k === action.email_key){
                    value = _v
                }
            });

            if(value !== null){
                let newEmails = {...emails, [action.email_key]:{email: action.email}}

                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        profiles : {
                            ...state.users.profiles,
                            // ...{intereste_in:{[randomKey()]:{id: action.interestein_id, enable: true}}}
                            emails : {
                                ...state.users.profiles.emails, ...newEmails
                            }
                        }
                    }
                }
                return v
            }
            return state
        }

        case REMOVE_EMAIL_PROFILE:{
            if(state.users === null){
                return state
            }

            let emails = {...state.users.profiles.emails}
 
            let email = _.find(emails,  function(v, k) { 
                return k == action.email_key
            })

            if(email !== undefined){
                let newEmails = _.omit(emails, action.email_key)
                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        profiles : {
                            ...state.users.profiles,
                            emails: newEmails
                        }
                    }
                }
                return v
            }
            return state
        }

        case ADD_MY_ID_PROFILE:{
            if(state.users === null){
                return state
            }

            let my_ids = state.users.profiles.my_ids
            let my_id = _.find(my_ids,  function(v, k) { 
                return k == action.my_id_key && _.isEqual(v, action.my_id_data)
            })

            // console.log(my_id)
            if(my_id === undefined){
                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        profiles : {
                            ...state.users.profiles,
                            my_ids : {
                                ...state.users.profiles.my_ids,
                                [action.my_id_key]:action.my_id_data
                            }
                        }
                    }
                }
                // console.log(v)
                return v
            }
            return state
        }

        case EDIT_MY_ID_PROFILE:{
            if(state.users === null){
                return state
            }

            let my_ids = {...state.users.profiles.my_ids}

            if(action.my_id_key == 0){
                let newMyIDs = {}
                _.each(my_ids, function(_v, _k) { 
                    newMyIDs = {...newMyIDs, 
                                    [_k]:{..._v, enable:false}
                                }
                });

                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        profiles : {
                            ...state.users.profiles,
                            my_ids : newMyIDs
                        }
                    }
                }
                return v
            }


            // let my_id = _.find(my_ids,  function(v, k) { 
            //     return k == action.my_id_key &&  v.enable
            // })
            // console.log(my_id)
            // if(my_id !== undefined){
            //     return state
            // }

            // dispatch({ type: EDIT_MY_ID_PROFILE, my_id_key:doc_id, my_id_data:doc_data});
            // console.log(my_id)

            let newMyIds = {}
            _.each(my_ids, function(_v, _k) { 
                if(_k === action.my_id_key){
                    newMyIds = {...newMyIds, [_k]:{..._v, enable:true}}
                }else{
                    newMyIds = {...newMyIds, [_k]:{..._v, enable:false}}
                }
            });

            let v = {...state,
                        users : {
                            ...state.users,
                            profiles : {
                                ...state.users.profiles,
                                my_ids : newMyIds
                            }
                        }
                    }
            console.log(action.my_id_key)
            console.log(v)
            return v
        }

        case REMOVE_MY_ID_PROFILE:{
            if(state.users === null){
                return state
            }

            let my_ids = {...state.users.profiles.my_ids}
 
            let my_id = _.find(my_ids,  function(v, k) { 
                return k == action.my_id_key
            })

            if(my_id !== undefined){
                let newMyIDs = _.omit(my_ids, action.my_id_key)
                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        profiles : {
                            ...state.users.profiles,
                            my_ids: newMyIDs
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


                if(!_.isEqual(value, action.data)){
                    // console.log('Not Equal')
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
                    return v;
                }else{
                    // console.log('Equal')
                }
            }

            return state;
        }

        case FRIEND_PROFILE:{
            if(state.users === null){
                return state
            }

            // console.log('FRIEND_PROFILE')
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
            let group = _.find(groups,  function(v, k) { 
                return k == action.group_id
            })

            if(group === undefined){
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
                return v
            }else{
                // let newObjValue = action.data
                // if(group.members !== undefined){
                //     newObjValue = {...action.data, members:group.members}
                // }

                let newGroup = {...group, ...action.data}
                console.log(newGroup)
                console.log(group)

                if(!_.isEqual(group, newGroup)){
                    let v = {
                        ...state,
                        users : {
                            ...state.users,
                            groups : {
                                ...state.users.groups,
                                [action.group_id]: newGroup
                            }
                        }
                    }
                    console.log(v)
                    return v
                }
            }
            return state
        }

        case MODIFIED_GROUP:{

            if(state.users === null){
                return state
            }

            let groups = state.users.groups
            let group = _.find(groups,  function(v, k) { 
                return k == action.group_id
            })

            if(group === undefined){
                return state
            }
            // dispatch({ type: MODIFIED_GROUP, group_id:change.doc.id, data:change.doc.data() });

            // console.log(group)

            let newGroup = action.data
            if(group.members !== undefined){
                newGroup = {...newGroup, members:group.members}
            }

            if(group.group_profile !== undefined){
                newGroup = {...newGroup, group_profile:group.group_profile}
            }

            if(!_.isEqual(group, newGroup)){
                console.log('Not equal')
                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        groups : {
                            ...state.users.groups,
                            [action.group_id]: {...group, ...action.data}
                        }
                    }
                }
                console.log(v)
                console.log(newGroup)
                return v
            }else{
                console.log('Equal')
            }

            return state
        }

        case DELETE_GROUP:{
            if(state.users === null){
                return state
            }

            let groups = state.users.groups
            let group = _.find(groups,  function(v, k) { 
                return k == action.group_id
            })

            if(group !== undefined){
                // เป็น การลบ object ที่มี key ตรงกันออก
                // https://stackoverflow.com/questions/3455405/how-do-i-remove-a-key-from-a-javascript-object

                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        groups :_.omit(groups, action.group_id)
                    }
                }
                return v
            }
            return state
        }

        case UPDATE_GROUP_PICTURE_PROFILE:{

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

            let newValue = {...value, 
                                group_profile: {
                                    ...value.group_profile,
                                    image_url:action.image_url
                                }
                            }

            let v = {
                ...state,
                users : {
                    ...state.users,
                    groups : {
                        ...state.users.groups,
                        [action.group_id]: newValue
                    }
                }
            }

            // console.log(v)
            return v
        }

        case FAVORITES_GROUP:{

            if(state.users === null){
                return state
            }

            let groups = state.users.groups

            let group = _.find(groups,  function(v, k) { 
                return k == action.group_id
            })

            if(group === undefined){
                return state
            }

            if(group.is_favorites === undefined){
                group = {...group, is_favorites:true}
                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        groups : {
                            ...state.users.groups,
                            [action.group_id]: group
                        }
                    }
                }
                return v 
            }else{
                if(action.favorite_status != group.is_favorites){
                    group = {...group, is_favorites:action.favorite_status}
                    let v = {
                        ...state,
                        users : {
                            ...state.users,
                            groups : {
                                ...state.users.groups,
                                [action.group_id]: group
                            }
                        }
                    }
                    return v    
                }
            }

            return state
        }

        case MEMBER_JOIN_GROUP:{
            if(state.users === null){
                return state
            }

            let groups = state.users.groups

            // let key = 0
            // let value = null
            // _.each(groups, function(_v, _k) { 
            //     if(_k === action.group_id){
            //         key = _k
            //         value = _v
            //     }
            // });

            let group = _.find(groups,  function(v, k) { 
                return k == action.group_id
            })

            if(group.members !== undefined){
                let member_item_id = action.member_item_id

                let member = _.find(group.members,  function(v, k) { 
                    return k == member_item_id && v.status != Constant.GROUP_STATUS_MEMBER_JOINED
                })

                if(member !== undefined){      
                    let newGroup = {...group, 
                                        members: {
                                            ...group.members,
                                            [member_item_id]:{...member, status:Constant.GROUP_STATUS_MEMBER_JOINED}
                                        }
                                    }

                    let v = {
                            ...state,
                            users : {
                                ...state.users,
                                groups : {
                                    ...state.users.groups,
                                    [action.group_id]: newGroup
                                }
                            }
                        }

                    return v
                }
            }
            
            return state
        }

        case MEMBER_LEAVE_GROUP:{
            if(state.users === null){
                return state
            }

            let groups = state.users.groups
            let group = _.find(groups,  function(v, k) { 
                return k == action.group_id
            })

            if(group !== undefined){ 
                let newGroup = _.omit(groups, action.group_id)
                let newState = {...state,
                    users : {
                        ...state.users,
                        groups : newGroup
                    }
                }
                return newState
            }
            return state
        }

        case MEMBER_DECLINE_GROUP:{

            if(state.users === null){
                return state
            }

            let groups = state.users.groups
            let group = _.find(groups,  function(v, k) { 
                return k == action.group_id
            })

            if(group !== undefined){ 
                let newGroup = _.omit(groups, action.group_id)
                let newState = {...state,
                    users : {
                        ...state.users,
                        groups : newGroup
                    }
                }
                return newState
            }
            return state
        }

        case MEMBER_INVITE_AGAIN_GROUP:{
            if(state.users === null){
                return state
            }

            // friend_id, group_id, item_id, status:Constant.GROUP_STATUS_MEMBER_INVITED
            let groups = state.users.groups
            let group = _.find(groups,  function(v, k) { 
                return k == action.group_id
            })

            // console.log(group)
            if(group !== undefined){ 
                let member = _.find(group.members,  function(v, k) { 
                    return k == action.item_id
                })

                let newGroup = {...group, 
                                    members: {
                                        ...group.members,
                                        [action.item_id]:{...member, status:Constant.GROUP_STATUS_MEMBER_INVITED}
                                    }
                                }

                let v = {...state,
                            users : {
                                ...state.users,
                                groups : {
                                    ...state.users.groups,
                                    [action.group_id]: newGroup
                                }
                            }
                        }
                return v   
            }
            return state
        }

        case ADDED_GROUP_MEMBER:{
            if(state.users === null){
                return state
            }

            let groups = state.users.groups

            // let key = 0
            // let value = null
            // _.each(groups, function(_v, _k) { 
            //     if(_k === action.group_id){
            //         key = _k
            //         value = _v
            //     }
            // });

            let group = _.find(groups,  function(v, k) { 
                return k == action.group_id
            })

            if(group === undefined){
                // console.log(value)
                return state
            }

            if(group.members === undefined){
                // console.log(group)
                let newGroup = {...group, 
                                    members: {
                                        ...group.members,
                                        [action.item_id]:action.data
                                    }
                                }
                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        groups : {
                            ...state.users.groups,
                            [action.group_id]: newGroup
                        }
                    }
                }
                return v
            }else{
                console.log(group)

                let oldMember = _.find(group.members,  function(v, k) { 
                    return k == action.item_id
                })

                if(!_.isEqual(oldMember, action.data)){
                    console.log('Not equal')
                    let newGroup = {...group, 
                                        members: {
                                            ...group.members,
                                            [action.item_id]:action.data
                                        }
                                    }

                    let v = {
                        ...state,
                        users : {
                            ...state.users,
                            groups : {
                                ...state.users.groups,
                                [action.group_id]: newGroup
                            }
                        }
                    }
                    return v
                }else{
                    console.log('equal')
                }
            }

            return state
        }

        case MODIFIED_GROUP_MEMBER:{
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

            if(value == null){
                return state
            }
            
            if(value.hasOwnProperty('members') && value.members !== undefined){
                let m_key = 0
                let m_value = null
                _.each(value.members, function(_vv, _kk) { 
                    if(_kk === action.item_id){
                        m_key = _kk
                        m_value = _vv
                    }
                });

                if(!_.isEqual(m_value, action.data)){
                    
                    let newValue = {...value, 
                        members: {
                            ...value.members,
                            [action.item_id]:action.data
                        }
                    }
    
                    let v = {
                        ...state,
                        users : {
                            ...state.users,
                            groups : {
                                ...state.users.groups,
                                [action.group_id]: newValue
                            }
                        }
                    }
                    return v
                }
            }

            return state
        }

        case REMOVED_GROUP_MEMBER:{
            if(state.users === null){
                return state
            }

            let groups = state.users.groups

            // let key = 0
            // let value = null
            // _.each(groups, function(_v, _k) { 
            //     if(_k === action.group_id){
            //         key = _k
            //         value = _v
            //     }
            // });

            let group = _.find(groups,  function(v, k) { 
                return k == action.group_id
            })

            if(group === undefined){
                return state
            }

            if(group.members !== undefined){
   
                let newMembers = _.omit(group.members, action.item_id)

                let newValue = {...group, 
                    members: newMembers
                }

                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        groups : {
                            ...state.users.groups,
                            [action.group_id]: newValue
                        }
                    }
                }
                return v
            }

            return state
        }

        case ADDED_GROUP_ADMIN:{
            if(state.users === null){
                return state
            }

            let groups = state.users.groups
            let group = _.find(groups,  function(v, k) { 
                return k == action.group_id
            })

            if(group === undefined){
                // console.log(value)
                return state
            }

            // dispatch({ type: ADDED_GROUP_ADMIN, group_id:change.doc.id, admin_item_id:admins_change.doc.id, admin_data: admins_change.doc.data()});

            if(group.group_admins === undefined){
                // console.log(group)
                let newGroup = {...group, 
                                    group_admins: {
                                        ...group.group_admins,
                                        [action.admin_item_id]:action.admin_data
                                    }
                                }
                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        groups : {
                            ...state.users.groups,
                            [action.group_id]: newGroup
                        }
                    }
                }
                return v
            }else{
                let group_admin = _.find(group.group_admins,  function(v, k) { 
                    return k == action.admin_item_id
                })

                if(!_.isEqual(group_admin, action.admin_data)){
                    console.log('Not equal')
                    let newGroup = {...group, 
                                        group_admins: {
                                            ...group.group_admins,
                                            [action.admin_item_id]:action.admin_data
                                        }
                                    }

                    let v = {
                        ...state,
                        users : {
                            ...state.users,
                            groups : {
                                ...state.users.groups,
                                [action.group_id]: newGroup
                            }
                        }
                    }
                    return v
                }else{
                    console.log('equal')
                }
            }

            return state
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

            value = {...value, mute:action.mute}

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

            console.log(v)
            return state
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

        case FRIEND_FAVORITE:{
            if(state.users === null){
                return state
            }
            
            //  dispatch({ type: FRIEND_FAVORITE, friend_id, favorite_status});

            let friends = state.users.friends

            let friend = _.find(friends,  function(v, k) { 
                return k == action.friend_id
            })

            if(friend !== undefined){

                if(friend.is_favorite === undefined){
                    friend = {...friend, is_favorite:true}
                    let v = {
                        ...state,
                        users : {
                            ...state.users,
                            friends : {
                                ...state.users.friends,
                                [action.friend_id]: friend
                            }
                        }
                    }
                    return v
                }else{
                    if(friend.is_favorite != action.favorite_status){
                        friend = {...friend, is_favorite:action.favorite_status}

                        let v = {
                            ...state,
                            users : {
                                ...state.users,
                                friends : {
                                    ...state.users.friends,
                                    [action.friend_id]: friend
                                }
                            }
                        }
                        return v
                    }
                }
                // console.log(friend)

                
            }
            return state
        }

        case ADDED_MY_APPLICATION:
        case MODIFIED_MY_APPLICATION:{
            if(state.users === null){
                return state
            }

            let my_applications = state.users.my_applications
            let my_application = _.find(my_applications,  function(v, k) { 
                return k == action.my_application_id
            })

            if(my_application === undefined){
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
                return v;
            }else{
                /**
                 * เราจะ update กรณีข้อมูลเปลี่ยนแปลงเท่านั้น
                 *  */
                if(!isEquivalent2Object(my_application, action.my_application_data)){
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
            let my_application = _.find(my_applications,  function(v, k) { 
                return k == action.my_application_id
            })

            if(my_application !== undefined){
                let newMy_application = {...my_application, status:action.my_application_status}

                let v = {
                    ...state,
                    users : {
                        ...state.users,
                        my_applications : {
                            ...state.users.my_applications,
                            [action.my_application_id]: newMy_application
                        }
                    }
                }
                return v
            }
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