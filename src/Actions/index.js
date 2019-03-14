import {Platform, AsyncStorage} from 'react-native'
import firebase from 'react-native-firebase';
const FBSDK = require('react-native-fbsdk');
const { LoginButton, AccessToken, LoginManager } = FBSDK;

import DeviceInfo from 'react-native-device-info';
var _ = require('lodash');

import {USER_LOGIN_SUCCESS,
        USER_LOGIN_FAIL,
        USER_LOGOUT,
        DEVICE_ACCESS_ADDED,
        DEVICE_ACCESS_MODIFIED,
        UPDATE_PROFILE,
        ADD_FRIEND,
        MODIFIED_FRIEND,
        // FRIEND_PROFILE,
        ADDED_FRIEND_PROFILE,
        UPDATE_STATUS_FRIEND,
        CHANGE_FRIEND_NAME,
        ADD_GROUP,
        MODIFIED_GROUP,
        DELETE_GROUP,
        UPDATE_GROUP_PICTURE_PROFILE,
        ADDED_GROUP_MEMBER,
        MODIFIED_GROUP_MEMBER,
        REMOVED_GROUP_MEMBER,

        // ADDED_GROUP_ADMIN,
        MODIFIED_GROUP_ADMIN, // modified
        REMOVED_GROUP_ADMIN,

        //  เป็นการ cancel การ invite โดยผู้เชิญ(admin)
        CANCELED_GROUP_MEMBER,


        ADDED_GROUP_PROFILE,

        FAVORITES_GROUP,
        MEMBER_JOIN_GROUP,
        MEMBER_DECLINE_GROUP,
        MEMBER_INVITE_AGAIN_GROUP,
        MEMBER_LEAVE_GROUP,
        ADDED_CLASS,
        MODIFIED_CLASS,
        REMOVED_CLASS,
        // CLASS_MEMBERS,
        ADDED_CLASS_MEMBER,
        MODIFIED_CLASS_MEMBER,
        REMOVED_CLASS_MEMBER,
        FAVORITES_CLASS,
        UPDATE_CLASS_PICTURE_PROFILE,
        FRIEND_MUTE,
        FRIEND_HIDE,
        FRIEND_BLOCK,
        ADDED_MY_APPLICATION,
        MODIFIED_MY_APPLICATION,
        REMOVED_MY_APPLICATION,
        UPDATE_STATUS_MY_APPLICATION,
        ADD_APPLICATION_CATEGORY,

        ADDED_MY_APPLICATIONS_POSTS,
        MODIFIED_MY_APPLICATIONS_POSTS,
        REMOVED_MY_APPLICATIONS_POSTS,
        
        ADDED_MY_APPLICATIONS_POSTS_IMAGES,

        ADDED_MY_APPLICATIONS_POSTS_LIKES,
        MODIFIED_MY_APPLICATIONS_POSTS_LIKES,
        REMOVED_MY_APPLICATIONS_POSTS_LIKES,

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


        ADD_MY_ID_FRIEND, 
        EDIT_MY_ID_FRIEND, 
        REMOVE_MY_ID_FRIEND,
    
        ADDRESS_PROFILE,

        ADD_WEBSITE_PROFILE,
        EDIT_WEBSITE_PROFILE,
        REMOVE_WEBSITE_PROFILE,
    
        ADD_EMAIL_PROFILE,
        EDIT_EMAIL_PROFILE,
        REMOVE_EMAIL_PROFILE,
    
        ADD_MY_ID_PROFILE,
        EDIT_MY_ID_PROFILE,
        REMOVE_MY_ID_PROFILE,
        FRIEND_FAVORITE,
    

        ADDED_FEELINGS_AND_PRIVACY,
    
        ADDED_PRESENCE,
        CHANGED_PRESENCE,
        REMOVED_PRESENCE,
        } from './types'

import {randomKey} from '../Utils/Helpers'
import Constant from '../Utils/Constant'

import {login, 
        people_you_may_khow, 
        invite_friend,
        create_group,
        create_class,
        application_category,
        get_post_feelings_and_privacy,
        create_my_application,
        update_picture_profile,
        update_picture_bg_profile,
        update_group_picture_profile,
        update_class_picture_profile,
        check_my_id,
        scan_qrcode,
        friend_profile_99,
        friend_profile_multi_99,
        add_new_post} from '../Utils/Services'

import {makeMyAppicationsPostsState} from '../Reselect'

import configureStore from '../configureStore'
const { persistor, store } = configureStore()

export const actionApplicationCategory = () =>dispatch =>{
    return application_category().then(data=>{
        if(data.result){
            dispatch({ type: ADD_APPLICATION_CATEGORY, data_category: data.data});
            return {'status':true, 'data': data.data}
        }

        return {'status':false}
    })
}

export const actionGetPostFeelingsAndPrivacy = () =>dispatch =>{
    return get_post_feelings_and_privacy().then(data=>{
        console.log(data)
        if(data.result){
            dispatch({ type: ADDED_FEELINGS_AND_PRIVACY, post_feelings: data.data.post_feelings, post_privacys: data.data.post_privacys});
            return {'status':true, 'data': data.data}
        }

        return {'status':false}
    })
}

// uid, group_name, members, uri
export const actionCreateMyApplication = (uid, application_name, category, subcategory, uri) =>dispatch =>{
    // 
    return create_my_application(uid, application_name, category, subcategory, uri).then(data=>{
        if(data.result){
            // dispatch({ type: ADD_APPLICATION_CATEGORY, data_category: data.data});
            return {'status':true, 'data': data.data}
        }
        return {'status':false}
    })
}

export const actionMyApplicationEmail = (uid, application_id, emails, callback) => dispatch =>{

    // console.log(intereste_in)
    // dispatch({ type: INTERESTE_IN_PROFILE, intereste_in});

    // /users/549098/my_applications/1223
    // my_applications
    firebase.firestore().collection('users').doc(uid).collection('my_applications').doc(application_id).set({
        emails
    }, { merge: true});

    callback({'status':true})
}


export const actionMyApplicationPhone = (uid, application_id, phones, callback) => dispatch =>{

    // console.log(intereste_in)
    // dispatch({ type: INTERESTE_IN_PROFILE, intereste_in});

    // /users/549098/my_applications/1223
    // my_applications
    firebase.firestore().collection('users').doc(uid).collection('my_applications').doc(application_id).set({
        phones
    }, { merge: true});

    callback({'status':true})
}

export const actionLogin = ({email, password}) => dispatch => {
    return login(email, password).then(data => {
        if((data instanceof Array)){
            dispatch({ type: USER_LOGIN_FAIL, provider: Constant.PROVIDERS.USER, error: data[0] });

            return {'status':false, 'error_message': data[0]}
        }else{
            if(!data.result){
                dispatch({ type: USER_LOGIN_FAIL, provider: Constant.PROVIDERS.USER, error: data.message });
                return {'status':false, 'error_message': data.message}
            }else{
                console.log('actionLogin', data.data)
                dispatch({ type: USER_LOGIN_SUCCESS, provider: Constant.PROVIDERS.USER, users: data.data.users, user: data.data.user });
                return {'status':true, 'data': data.data}
            }
        }
    })
}

export const loginWithFacebook = () => {
    return (dispatch) => {
        LoginManager.logInWithReadPermissions(["public_profile"]).then(
            (result) => {

                if(result.isCancelled){
                    console.log("login with fb : 0")
                }else{
                    console.log("login with fb : 1")
                    console.log(result)
                }
            },(error)=> {
                console.log("login with fb : -1")
                console.log("Login fail with error: " + error);

                dispatch({ type: USER_LOGIN_FAIL, payload: error.message, provider: Constant.PROVIDERS.FACEBOOK });
            }
        );
    }
}

export const updateIsLogin = (users, callback) => {

    let uid = users.user.uid
    let device_access = users.device_access

    let key = 0
    _.each(device_access, function(_v, _k) { 
        if(_v.udid === DeviceInfo.getUniqueID()){
            key = _k
        }
    });

    if(key === 0){
        callback({'status':false})
    }

    firebase.firestore().collection('users').doc(uid).collection('device_access').doc(key).set({is_login:'0', online:'0'},{ merge: true })
    callback({'status':true})
    /*
    check before set เพราะจะมีกรณีที่ user ลบ ออกจากระบบแล้ว 
    */
    // const doc = userRef.get()
    // doc.then(v=>{
    //    if(v.exists){
    //        userRef.set({
    //            profiles: {
    //                device_access:{
    //                    [key]:{
    //                     is_login:'0',
    //                     online:'0'
    //                    }
    //                }
    //            }
    //        },{ merge: true });

    //        callback({'status':true})
    //    }
    // })    
}

export const actionLogout = (uid, dispatch, callback) => {
    firebase.database().ref('user_presence/' + uid).orderByChild("udid").equalTo(DeviceInfo.getUniqueID()).once('value').then(function (snapshot) { 
        if(snapshot.val() !== null){
          firebase.database().ref("user_presence/" + uid + "/"+ Object.keys(snapshot.val())[0] +"/").update({
            'status':'offline'
          });
        }
    })

    // firebase.database().ref('idna/user/1').off()
    // unsubscribe();

    dispatch({ type: USER_LOGOUT});
    callback({'status':true})
}

/*
export const actionCheckUserLogin = () => dispatch =>(
    // AsyncStorage.getItem('userToken')
    //     .then((data) => {
    //         dispatch(loading(false));
    //         dispatch(getToken(data));
    //     })
    //     .catch((err) => {
    //         dispatch(loading(false));
    //         dispatch(error(err.message || 'ERROR'));
    //     })

    loadAsyncStorage(Constant.USER_LOGIN).then((data) => {  
        // console.log(data)    
        if(data.status){
            let value = JSON.parse(data.value)
            // console.log(value)

            dispatch({ type: USER_LOGIN_SUCCESS, provider: value.provider, user: value.user });
            return {'status':true, 'value': value}
        }else{
            return {'status':false, 'message': data.message}
        }
    }).catch((error)=>{
        return {'status':false, 'message': error}
    })
)
*/

export const actionPeopleYouMayKhow = (uid) => dispatch=>{
    return people_you_may_khow(uid).then(data => {
        console.log(data)
        if((data instanceof Array)){
            return {'status':false, 'message': data.message}
        }else{
            if(!data.result){
                return {'status':false, 'message': data.message}
            }else{
                return {'status':true, 'data':data}
            }
        }
    })
}

export const actionInviteFriend = (uid, friend_id, callback) => dispatch =>{
    let userRef = firebase.firestore().collection('users').doc(uid).collection('friends').doc(friend_id);
    userRef.get()
    .then(doc => {
        let chat_id = randomKey()
        if (!doc.exists) {
        } else {
            let data = doc.data();
            if(data.chat_id){
                chat_id = data.chat_id
            }
        }

        let batch = firebase.firestore().batch();

        let userRef = firebase.firestore().collection('users').doc(uid).collection('friends').doc(friend_id);
        batch.set(userRef, {chat_id, 
                            status:Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND}, { merge: true})

        let friendRef = firebase.firestore().collection('users').doc(friend_id).collection('friends').doc(uid);
        batch.set(friendRef, {  chat_id, 
                                status:Constant.FRIEND_STATUS_FRIEND_REQUEST}, { merge: true})

        batch.commit().then(function () {
            // console.log("Transaction success: actionInviteFriend");
            callback({'status':true})
        }).catch(function(err) {
            // console.log("Transaction failure: " + err);
            callback({'status':false, 'message':err})
        });
    })
    .catch(err => {
        // console.log('Error getting document', err);
        callback({'status':false, 'message':err})
    });
}

export const actionAddFriend = (uid, friend_id, data, profile, callback) => dispatch =>{
    // dispatch({ type: ADD_FRIEND, friend_id,  friend_data:data, profile})
    callback({'status':true, friend_id, data, profile})
}

// create_group
export const actionCreateGroup = (uid, group_name, members, uri) => dispatch =>{
    return create_group(uid, group_name, members, uri).then(data => {
        console.log(data)
        if((data instanceof Array)){
            return {'status':false, 'message': data}
        }else{
            if(!data.result){
                return {'status':false, 'message': data.message}
            }else{
                // console.log(data)
                // let newGroup = { item_id: data.group.item_id, 
                //                  status: data.group.status, 
                //                  group_profile: data.group_profile,
                //                  members: data.members,
                //                 //  group_admins: data.group_admins
                //                 }
                // dispatch({ type: ADD_GROUP, group_id:data.item_id, group_data:newGroup});
                return {'status':true}
            }
        }
    })
}

/*
//  เป็นการ cancel การ invite โดยผู้เชิญ(admin)
CANCELED_GROUP_MEMBER  = "canceled_group_member"
*/
export const actionCanceledGroupMember = (uid, group_id, friend_id, member_key, callback) => dispatch =>{
    let batch = firebase.firestore().batch();
    let usersRef = firebase.firestore().collection('users').doc(friend_id).collection('groups').doc(group_id)
    batch.delete(usersRef);

    let groupsRef = firebase.firestore().collection('groups').doc(group_id).collection('members').doc(member_key)
    batch.set(groupsRef, {status: Constant.GROUP_STATUS_MEMBER_CANCELED, canceler:uid}, { merge: true})
    
    batch.commit().then(function () {
        console.log("Transaction success: actionMemberJoinGroup");
    }).catch(function(err) {
        console.log("Transaction failure: " + err);
    });

    dispatch({ type: CANCELED_GROUP_MEMBER, group_id, friend_id, member_key});
    callback({'status':true})
}

export const actionUpdateGroupPictureProfile = (uid, group_id, image_uri) => dispatch =>{

    return update_group_picture_profile(uid, group_id, image_uri).then(data => {
        console.log(data)
        if((data instanceof Array)){
            return {'status':false, 'message': data}
        }else{
            if(!data.result){
                return {'status':false, 'message': data}
            }else{
                dispatch({ type: UPDATE_GROUP_PICTURE_PROFILE, group_id, image_url:data.image_url});
                return {'status':true}
            }
        }
    })
}

// EDIT_GROUP_NAME_PROFILE
export const actionEditGroupNameProfile = (uid, group_id, group_name, callback) => dispatch =>{
    firebase.firestore().collection('groups').doc(group_id).set({
        name:group_name,
    }, { merge: true});

    // dispatch({ type: EDIT_DISPLAY_NAME_PROFILE, name});

    callback({'status':true})
}

// favorites group
export const actionFavoritesGroup = (uid, group_id, favorite_status, callback) => dispatch => {
    dispatch({ type: FAVORITES_GROUP, group_id, favorite_status});
    firebase.firestore().collection('users').doc(uid).collection('groups').doc(group_id).set({
        is_favorites: favorite_status,
    }, { merge: true});

    callback({'status':true})
}

// Join Group
/* 
การตอบ ตกลงเพือเข้าร่วมกลุ่ม
* ขั้นตอนการทำงาน
    - update status GROUP_STATUS_MEMBER_JOINED : users/{user_id}/groups/{group_id}/status = GROUP_STATUS_MEMBER_JOINED
    - update status == GROUP_STATUS_MEMBER_JOINED groups/{group_id}/members/{item_id}/status = GROUP_STATUS_MEMBER_JOINED
*/

/*

                let batch = firebase.firestore().batch();

                let groupsRef = firebase.firestore().collection('groups').doc(group_id).collection('members').doc(key);
                let groupsValue = { friend_id, 
                                    status: Constant.GROUP_STATUS_MEMBER_INVITED}
                batch.set(groupsRef, groupsValue, { merge: true});
*/
export const actionMemberJoinGroup = (uid, group_id, member_key, callback) => dispatch => {
    let batch = firebase.firestore().batch();
    let usersRef = firebase.firestore().collection('users').doc(uid).collection('groups').doc(group_id)
    batch.set(usersRef, {status: Constant.GROUP_STATUS_MEMBER_JOINED}, { merge: true})

    let groupsRef = firebase.firestore().collection('groups').doc(group_id).collection('members').doc(member_key)
    batch.set(groupsRef, {status: Constant.GROUP_STATUS_MEMBER_JOINED}, { merge: true})

    batch.commit().then(function () {
        console.log("Transaction success: actionMemberJoinGroup");

        dispatch({ type: MEMBER_JOIN_GROUP, group_id, member_key})
        callback({'status':true})
    }).catch(function(err) {
        console.log("Transaction failure: " + err);

        callback({'status':false, 'message':err})
    });

    
}

// Leave Group
export const actionMemberLeaveGroup = (uid, group_id, member_item_id, callback) => dispatch => {
    
    // console.log(uid, group_id, member_item_id)
    firebase.firestore().collection('users').doc(uid).collection('groups').doc(group_id).delete()
    firebase.firestore().collection('groups').doc(group_id).collection('members').doc(member_item_id).set({
        status: Constant.GROUP_STATUS_MEMBER_LEAVE,
    }, { merge: true});

    dispatch({ type: MEMBER_LEAVE_GROUP, group_id});
    callback({'status':true})
}

// Decline Group
/*
การปฎิเสจคำขอให้เข้ากลุ่มสนทนา
* ขั้นตอนการทำงาน
    - ลบกลุ่มออกจาก  users/{user_id}/groups/{group_id} และ remove group redux local
    - update status == GROUP_STATUS_MEMBER_DECLINE groups/{group_id}/members/{item_id}/status = GROUP_STATUS_MEMBER_DECLINE
*/
export const actionMemberDeclineGroup = (uid, group_id, member_key, callback) => dispatch => {
    /*
    firebase.firestore().collection('users').doc(uid).collection('groups').doc(group_id).delete()
    firebase.firestore().collection('groups').doc(group_id).collection('members').doc(member_key).set({
        status: Constant.GROUP_STATUS_MEMBER_DECLINE,
    }, { merge: true});
    */

    let batch = firebase.firestore().batch();
    let usersRef = firebase.firestore().collection('users').doc(uid).collection('groups').doc(group_id)
    batch.delete(usersRef);

    let groupsRef = firebase.firestore().collection('groups').doc(group_id).collection('members').doc(member_key)
    batch.set(groupsRef, {status: Constant.GROUP_STATUS_MEMBER_DECLINE}, { merge: true})

    batch.commit().then(function () {
        console.log("Transaction success: actionMemberJoinGroup");
    }).catch(function(err) {
        console.log("Transaction failure: " + err);
    });

    dispatch({ type: MEMBER_DECLINE_GROUP, group_id, member_key});
    callback({'status':true})
}

/* 
 การ invite again (กรณีที่เพือนกด decline แล้วเราจะทำการ invite อีกครั้ง)
*/
export const actionMemberInviteAgainGroup = (uid, group_id, friend_id, member_key, callback) => dispatch => {
    /*
    firebase.firestore().collection('users').doc(friend_id).collection('groups').doc(group_id).set({
        item_id: item_id,
        status: Constant.GROUP_STATUS_MEMBER_INVITED,
    }, { merge: true});

    firebase.firestore().collection('groups').doc(group_id).collection('members').doc(member_key).set({
        status: Constant.GROUP_STATUS_MEMBER_INVITED,
    }, { merge: true});

    dispatch({ type: MEMBER_INVITE_AGAIN_GROUP, friend_id, group_id, member_key});
    */

    let batch = firebase.firestore().batch();
    let usersRef = firebase.firestore().collection('users').doc(friend_id).collection('groups').doc(group_id)
    batch.set(usersRef, {status: Constant.GROUP_STATUS_MEMBER_INVITED}, { merge: true})

    let groupsRef = firebase.firestore().collection('groups').doc(group_id).collection('members').doc(member_key)
    batch.set(groupsRef, {status: Constant.GROUP_STATUS_MEMBER_INVITED}, { merge: true})
    
    batch.commit().then(function () {
        console.log("Transaction success: actionMemberJoinGroup");
    }).catch(function(err) {
        console.log("Transaction failure: " + err);
    });

    dispatch({ type: MEMBER_INVITE_AGAIN_GROUP, friend_id, group_id, member_key});
    callback({'status':true, uid, friend_id, group_id, member_key})
}

export const actionDeleteGroup = (uid, group_id, callback) => dispatch =>{
    let batch = firebase.firestore().batch();
    
    // /groups/1337
    let groupRef = firebase.firestore().collection('groups').doc(group_id)
    batch.delete(groupRef);

    // /users/549099/groups/1362
    let groupUserRef = firebase.firestore().collection('users').doc(uid).collection('groups').doc(group_id)
    batch.delete(groupUserRef);

    batch.commit().then(function () {
        console.log("Transaction success: actionDeleteGroup");
    }).catch(function(err) {
        console.log("Transaction failure: " + err);
    });

    // dispatch({ type: DELETE_GROUP, group_id});
    callback({'status':true, uid, group_id})
}

// Invite Member to group
export const actionGroupInviteMember = (uid, group_id, members, callback) => dispatch =>{
    let batch = firebase.firestore().batch();
    members.map(function(v, k) {
        let groupsRef = firebase.firestore().collection('groups').doc(group_id).collection('members').doc(v.member_key);
        batch.set(groupsRef, {status: Constant.GROUP_STATUS_MEMBER_INVITED, friend_id:v.friend_id, invitor:uid}, { merge: true});

        let usersRef = firebase.firestore().collection('users').doc(v.friend_id).collection('groups').doc(group_id);
        batch.set(usersRef, {status: Constant.GROUP_STATUS_MEMBER_INVITED}, { merge: true});
    })

    batch.commit().then(function () {
        callback({'status':true})
    }).catch(function(err) {
        console.log("Transaction failure: " + err);
        callback({'status':false, 'message':err})
    });
}

// Group MakeAdmin
export const actionMakeAdminGroup = (uid, group_id, frind_id, member_key, callback) => dispatch =>{
    firebase.firestore().collection('groups').doc(group_id).collection('members').doc(member_key).set({
        is_admin: true
    }, { merge: true});
    callback({'status':true})
}

// Remove as admin
export const actionRemoveAsAdminGroup = (uid, group_id, frind_id, member_key, callback) => dispatch =>{
    // firebase.firestore().collection('groups').doc(group_id).collection('members').where('friend_id', '==', frind_id).get().then(snapshot => {
    //     console.log(snapshot)
    //     if(snapshot.size == 0){
    //         callback({'status':false, 'message':'Friend not found.'})
    //     }else{
    //         snapshot.docs.forEach(doc => {
    //             firebase.firestore().collection('groups').doc(group_id).collection('members').doc(doc.id).set({
    //                 is_admin: false
    //             }, { merge: true});
    //         })

    //         callback({'status':true})
    //     }
    // })

    firebase.firestore().collection('groups').doc(group_id).collection('members').doc(member_key).set({
        is_admin: false
    }, { merge: true});
    callback({'status':true})
}

export const actionCreateClass = (uid, class_name, members, uri) => dispatch =>{
    return create_class(uid, class_name, members, uri).then(data => {
        console.log(data)
        if((data instanceof Array)){
            return {'status':false, 'message': data}
        }else{
            if(!data.result){
                return {'status':false, 'message': data}
            }else{
                // dispatch({type: ADDED_CLASS, class_id:data.item_id ,class_data:data.data})
                return {'status':true}
            }
        }
    })
}

// favorites class
export const actionFavoritesClass = (uid, class_id, favorite_status, callback) => dispatch => {
    
    dispatch({ type: FAVORITES_CLASS, class_id, favorite_status});
    firebase.firestore().collection('users').doc(uid).collection('classs').doc(class_id).set({
        is_favorites: favorite_status,
    }, { merge: true});
    callback({'status':true})
}

// delete class
export const actionDeleteClass = (uid, class_id, callback) => dispatch =>{
    firebase.firestore().collection('users').doc(uid).collection('classs').doc(class_id).delete()
    dispatch({ type: REMOVED_CLASS, class_id});
    callback({'status':true, uid, class_id})
}

// Classs add member 
export const actionClassAddMember = (uid, class_id, members, callback) => dispatch =>{
    
    let batch = firebase.firestore().batch();
    members.map((v, k)=>{
        let {friend_id, member_key} = v

        let classRef =  firebase.firestore().collection('users').doc(uid).collection('classs').doc(class_id).collection('members').doc(member_key)
        batch.set(classRef, {status: true,friend_id}, { merge: true})
    })

    batch.commit().then(function () {
        callback({'status':true})
    }).catch(function(err) {
        console.log("Transaction failure: " + err);
    });

    /*
    members.map(function(friend_id, k) {
        firebase.firestore().collection('users').doc(uid).collection('classs').doc(class_id).collection('members').where('friend_id', '==', friend_id).get().then(snapshot => {
            let value = {friend_id, status: true}
            if(snapshot.size == 0){
                let key = randomKey()
                
                firebase.firestore().collection('users').doc(uid).collection('classs').doc(class_id).collection('members').doc(key).set(value, { merge: true})
            
                dispatch({type: MODIFIED_CLASS_MEMBER, class_id, class_member_id:key, class_member_data:value })
                // callback({'status':true})

                if(k == members.length - 1){
                    callback({'status':true})
                }
            }else{
                snapshot.docs.forEach(doc => {
                    firebase.firestore().collection('users').doc(uid).collection('classs').doc(class_id).collection('members').doc(doc.id).set({status: true}, { merge: true})
                    
                    dispatch({type: MODIFIED_CLASS_MEMBER, class_id, class_member_id:doc.id, class_member_data:value })
                    
                    if(k == members.length - 1){
                        callback({'status':true})
                    }
                })
            }
        })
    })
    */
}

// REMOVED_CLASS_MEMBER
export const actionDeleteClassMember = (uid, class_id, member_key, callback) => dispatch =>{
    // users/{userId}/classs/{classId}/members/{key}
    firebase.firestore().collection('users').doc(uid).collection('classs').doc(class_id).collection('members').doc(member_key).set({status: false}, { merge: true})
    dispatch({type: REMOVED_CLASS_MEMBER, class_id, member_key})
    callback({'status':true})
}

export const actionUpdateClassPictureProfile = (uid, class_id, image_uri) => dispatch =>{
    return update_class_picture_profile(uid, class_id, image_uri).then(data => {
        console.log(data)
        if((data instanceof Array)){
            return {'status':false, 'message': data}
        }else{
            if(!data.result){
                return {'status':false, 'message': data}
            }else{
                // dispatch({ type: UPDATE_GROUP_PICTURE_PROFILE, group_id, image_url:data.image_url});
                // dispatch({ type: UPDATE_CLASS_PICTURE_PROFILE, class_id, image_url:data.image_url});
                return {'status':true}
            }
        }
    })
}

// export const add_new_post = (uid, app_id, feelings, privacy, images, text) 
export const actionAddNewPost = (uid, app_id, feelings, privacy, images, text, location) => dispatch =>{
    return add_new_post(uid, app_id, feelings, privacy, images, text, location).then(data => {
        console.log(data)
        if((data instanceof Array)){
            return {'status':false, 'message': data}
        }else{
            if(!data.result){
                return {'status':false, 'message': data}
            }else{
                // dispatch({type:ADDED_MY_APPLICATIONS_POSTS, app_id:data.app_id, post_id:data.post_id, my_applications_posts_data:data.my_applications_posts_data})
                // dispatch({type:ADDED_MY_APPLICATIONS_POSTS_IMAGES, post_id:data.post_id, my_applications_posts_images_data:data.my_applications_posts_images_data})
                
                return {'status':true, data}
            }
        }
    })
}

export const actionDeletePost = (uid, app_id, post_id, callback) => dispatch =>{
    firebase.firestore().collection('users').doc(uid).collection('my_applications').doc(app_id).collection('my_applications_posts').doc(post_id).delete()
    callback({'status':true})
    /*
    return add_new_post(uid, app_id, feelings, privacy, images, text, location).then(data => {
        console.log(data)
        if((data instanceof Array)){
            return {'status':false, 'message': data}
        }else{
            if(!data.result){
                return {'status':false, 'message': data}
            }else{
                // dispatch({type:ADDED_MY_APPLICATIONS_POSTS, app_id:data.app_id, post_id:data.post_id, my_applications_posts_data:data.my_applications_posts_data})
                // dispatch({type:ADDED_MY_APPLICATIONS_POSTS_IMAGES, post_id:data.post_id, my_applications_posts_images_data:data.my_applications_posts_images_data})
                
                return {'status':true, data}
            }
        }
    })
    */
}

export const actionLikePost = (creator, uid, app_id, post_id, status, callback) => dispatch =>{
    // firebase.firestore().collection('users').doc(uid).collection('classs').doc(class_id).set({
    //     name,
    // }, { merge: true});

    // /users/549099/my_applications/1286/my_applications_posts/1124656

    // if(!like_key){
    //     like_key = randomKey()
    // }

    firebase.firestore().collection('users').doc(creator).collection('my_applications').doc(app_id).collection('my_applications_posts').doc(post_id).collection('my_applications_posts_likes').doc(uid).set({
        status,
    }, { merge: true});

    callback({'status':true})
}

export const actionEditClassNameProfile = (uid, class_id, name, callback) => dispatch =>{
    firebase.firestore().collection('users').doc(uid).collection('classs').doc(class_id).set({
        name,
    }, { merge: true});

    callback({'status':true})
}

export const actionUpdateStatusFriend = (uid, friend_id, status, callback) => dispatch=>{
    let batch = firebase.firestore().batch();

    // update status เพือ่นของเรา
    let userRef = firebase.firestore().collection('users').doc(uid).collection('friends').doc(friend_id) //.update({status})
    batch.set(userRef, {status}, { merge: true})
    
    // update status เราของเพือน
    let friendRef = firebase.firestore().collection('users').doc(friend_id).collection('friends').doc(uid) //.update({status})
    batch.set(friendRef, {status}, { merge: true})

    batch.commit().then(function () {
        // status
        dispatch({ type: UPDATE_STATUS_FRIEND, friend_id, status});

        callback({'status':true})
    }).catch(function(err) {
        console.log("Transaction failure: " + err);
    });
}

// key, this.props.uid, friend.friend_id
export const actionSelectClassMember = (uid, friend_id, class_id, member_key, status,callback) => dispatch=> {
    if(!member_key){
        member_key = randomKey()
    }

    firebase.firestore().collection('users').doc(uid).collection('classs').doc(class_id).collection('members').doc(member_key).set({
        friend_id, status
    }, { merge: true}).then(result => {
        // dispatch({ type: CHANGE_FRIEND_NAME, friend_id, change_friend_name:name});
        callback({'status':true})
    })
    .catch(error => {
        callback({'status':false, 'message': error})
    })  

    dispatch({type: ADDED_CLASS_MEMBER, class_id, class_member_id:member_key, class_member_data:{friend_id, status} })

    /*
    firebase.firestore().collection('users').doc(uid).collection('classs').doc(class_id).collection('members').where('friend_id', '==', friend_id).get().then(snapshot => {
        if(snapshot.size == 0){
            firebase.firestore().collection('users').doc(uid).collection('classs').doc(class_id).collection('members').add({
                friend_id,
                status: true,
            })
        }else{
            snapshot.docs.forEach(doc => {
                // https://firebase.google.com/docs/firestore/manage-data/transactions
                var classsRef = firebase.firestore().collection('users').doc(uid).collection('classs').doc(class_id).collection('members').doc(doc.id);

                var transaction = firebase.firestore().runTransaction(t => {
                return t.get(classsRef)
                    .then(doc => {
                        t.update(classsRef, {status: !doc.data().status});
                    });
                }).then(result => {
                    console.log('Transaction success!');
                }).catch(err => {
                    console.log('Transaction failure:', err);
                });               
            });
        }
        
    })

    callback({'status':true, 'uid':uid, 'friend_id': friend_id, 'class_id': class_id})
    */
}

// Change friend's name
export const actionChangeFriendsName = (uid, friend_id, name, callback) => dispatch=> {
    firebase.firestore().collection('users').doc(uid).collection('friends').doc(friend_id).set({
        change_friend_name: name,
    }, { merge: true}).then(result => {
        dispatch({ type: CHANGE_FRIEND_NAME, friend_id, change_friend_name:name});
        callback({'status':true})
    })
    .catch(error => {
        callback({'status':false, 'message': error})
    })    
}

// friend hide
export const actionFriendHide = (uid, friend_id, hide, callback) => dispatch=> {
    firebase.firestore().collection('users').doc(uid).collection('friends').doc(friend_id).set({
        hide,
    }, { merge: true}).then(()=> {
        dispatch({ type: FRIEND_HIDE, friend_id, hide});
        callback({'status':true})
    }).catch(error => {
        callback({'status':false, 'message': error})
    })      
}

// friend block
export const actionFriendBlock = (uid, friend_id, block, callback) => dispatch=> {
    firebase.firestore().collection('users').doc(uid).collection('friends').doc(friend_id).set({
        block,
    }, { merge: true}).then(()=> {
        dispatch({ type: FRIEND_BLOCK, friend_id, block});
        callback({'status':true})
    }).catch(error => {
        callback({'status':false, 'message': error})
    })  
}

// friend mute/unmute
export const actionFriendMute = (uid, friend_id, mute, callback) => dispatch=> {
    firebase.firestore().collection('users').doc(uid).collection('friends').doc(friend_id).set({
        mute,
    }, { merge: true}).then(()=> {
        dispatch({ type: FRIEND_MUTE, friend_id, mute});
        callback({'status':true})
    }).catch(error => {
        callback({'status':false, 'message': error})
    })
}

// friend favorite
export const actionFriendFavirite = (uid, friend_id, favorite_status, callback) => dispatch=> {
    firebase.firestore().collection('users').doc(uid).collection('friends').doc(friend_id).set({
        is_favorite: favorite_status,
    }, { merge: true}).then(()=> {
        dispatch({ type: FRIEND_FAVORITE, friend_id, favorite_status});
        callback({'status':true})
    }).catch(error => {
        callback({'status':false, 'message': error})
    })
}

// My application published/unpublished 
export const actionUpdateStatusMyApplication = (uid, my_application_id, status, callback) => dispatch =>{
    firebase.firestore().collection('users').doc(uid).collection('my_applications').doc(my_application_id).set({
        status,
    }, { merge: true});

    dispatch({ type: UPDATE_STATUS_MY_APPLICATION, my_application_id, my_application_status:status});
    callback({'status':true})
}

export const actionUpdatePictureProfile = (uid, image_uri, callback) => dispatch =>{
    return update_picture_profile(uid, image_uri).then(data => {
        if((data instanceof Array)){
            return {'status':false, 'message': data}
        }else{
            if(!data.result){
                return {'status':false, 'message': data.message}
            }else{
                dispatch({ type: UPDATE_PICTURE_PROFILE, image_url:data.image_url});
                return {'status':true}
            }
        }
    })
}

// UPDATE_PICTURE_BG_PROFILE
export const actionUpdatePictureBGProfile = (uid, image_uri, callback) => dispatch =>{
    return update_picture_bg_profile(uid, image_uri).then(data => {
        if((data instanceof Array)){
            return {'status':false, 'message': data}
        }else{
            if(!data.result){
                return {'status':false, 'message': data.message}
            }else{
                console.log(data)
                dispatch({ type: UPDATE_PICTURE_BG_PROFILE, bg_url:data.bg_url});
                return {'status':true}
            }
        }
    })
}

// EDIT_DISPLAY_NAME_PROFILE
export const actionEditDisplayNameProfile = (uid, name, callback) => dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).set({
        name,
    }, { merge: true});

    dispatch({ type:EDIT_DISPLAY_NAME_PROFILE, profile_name:name});

    callback({'status':true})
}

// EDIT_STATUS_MESSAGE_PROFILE
export const actionEditStatusMessageProfile = (uid, status_message, callback) => dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).set({
        status_message,
    }, { merge: true});

    dispatch({ type: EDIT_STATUS_MESSAGE_PROFILE, status_message});

    callback({'status':true, uid, status_message})
}

// EDIT_MY_ID_PROFILE
// export const actionEditMyIDProfile = (uid, my_id, callback) => dispatch =>{
//     firebase.firestore().collection('profiles').doc(uid).set({
//         my_id,
//     }, { merge: true});

//     dispatch({ type: EDIT_MY_ID_PROFILE, my_id});

//     callback({'status':true})
// }

// Gender
export const actionGenderProfile = (uid, gender_id, callback) => dispatch =>{
    // console.log('gender_id', gender_id)
    firebase.firestore().collection('profiles').doc(uid).set({
        gender:gender_id,
    }, { merge: true});

    dispatch({ type: GENDER_PROFILE, gender_id:gender_id});

    callback({'status':true})
}

// InteresteIn
export const actionInteresteInProfile = (uid, intereste_in, callback) => dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).set({
        intereste_in
    }, { merge: true});

    dispatch({ type: INTERESTE_IN_PROFILE, intereste_in});
    callback({'status':true})
}

// BIRTHDAY_PROFILE
export const actionBirthdayProfile = (uid, date, callback) => dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).set({
        birthday:date,
    }, { merge: true});

    dispatch({ type: BIRTHDAY_PROFILE, birthday:date});

    callback({'status':true})
}

export const actionAddPhoneProfile = (uid, phone_number, callback) => dispatch =>{

    let key = randomKey()

    firebase.firestore().collection('profiles').doc(uid).collection('phones').where("phone_number", "==", phone_number).get().then(snapshot => {
        if(snapshot.size == 0){
            firebase.firestore().collection('profiles').doc(uid).collection('phones').doc(key).set({
                phone_number,
                is_verify:false
            })

            dispatch({ type: ADD_PHONE_PROFILE, phone_key:key, phone_data:{phone_number, is_verify:false} });
            callback({'status':true})
        }else{

            callback({'status':false, 'message':'Duplicate phone number'})
        }
    })
}

export const actionEditPhoneProfile = (uid, phone_key , newValue, callback) => dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).collection('phones').where("phone_number", "==", newValue.phone_number).get().then(snapshot => {
        if(snapshot.size == 0){
            firebase.firestore().collection('profiles').doc(uid).collection('phones').doc(phone_key).set({
                is_verify:newValue.is_verify, 
                phone_number:newValue.phone_number,
            }, { merge: true});
        
            dispatch({ type: EDIT_PHONE_PROFILE, phone_key, phone_data:newValue});

            callback({'status':true})
        }else{
            callback({'status':false, 'message':'Duplicate phone number'})
        }
    })
}

export const actionRemovePhoneProfile = (uid, phone_key, callback) => dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).collection('phones').doc(phone_key).delete()
    dispatch({ type: REMOVE_PHONE_PROFILE, phone_key});
    callback({'status':true})
}

// Address
export const actionAddressProfile = (uid, address, callback) => dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).set({
        address,
    }, { merge: true});

    dispatch({ type: ADDRESS_PROFILE, address});
    callback({'status':true})
}

// websites
/* 
ADD_WEBSITE_PROFILE,
EDIT_WEBSITE_PROFILE,
REMOVE_WEBSITE_PROFILE
*/
export const actionAddWebsiteProfile = (uid, url, callback) => dispatch =>{

    let key = randomKey()

    firebase.firestore().collection('profiles').doc(uid).collection('websites').where("url", "==", url).get().then(snapshot => {
        if(snapshot.size == 0){
            firebase.firestore().collection('profiles').doc(uid).collection('websites').doc(key).set({
                url
            })

            dispatch({ type: ADD_WEBSITE_PROFILE, website_key:key, url});
            callback({'status':true})
        }else{

            callback({'status':false, 'message':'Duplicate website.'})
        }
    })
}

export const actionEditWebsiteProfile = (uid, website_key ,url, callback) => dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).collection('websites').where("url", "==", url).get().then(snapshot => {
        if(snapshot.size == 0){
            firebase.firestore().collection('profiles').doc(uid).collection('websites').doc(website_key).set({
                url,
            }, { merge: true});
        
            dispatch({ type: EDIT_WEBSITE_PROFILE, website_key, url});

            callback({'status':true})
        }else{
            callback({'status':false, 'message':'Duplicate website'})
        }
    })
}

export const actionRemoveWebsiteProfile = (uid, website_key, callback) => dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).collection('websites').doc(website_key).delete()
    dispatch({ type: REMOVE_WEBSITE_PROFILE, website_key});
    callback({'status':true})
}

// Emails
/**
ADD_EMAIL_PROFILE,
EDIT_EMAIL_PROFILE,
REMOVE_EMAIL_PROFILE,
*/
export const actionAddEmailProfile = (uid, email, callback) => dispatch =>{

    let key = randomKey()

    firebase.firestore().collection('profiles').doc(uid).collection('emails').where("email", "==", email).get().then(snapshot => {
        if(snapshot.size == 0){
            firebase.firestore().collection('profiles').doc(uid).collection('emails').doc(key).set({
                email
            })

            dispatch({ type: ADD_EMAIL_PROFILE, email_key:key, email_data:email});
            callback({'status':true})
        }else{

            callback({'status':false, 'message':'Duplicate email.'})
        }
    })
}

export const actionEditEmailProfile = (uid, email_key, email, callback) => dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).collection('emails').where("email", "==", email).get().then(snapshot => {
        if(snapshot.size == 0){
            firebase.firestore().collection('profiles').doc(uid).collection('emails').doc(email_key).set({
                email,
            }, { merge: true});
        
            dispatch({ type: EDIT_EMAIL_PROFILE, email_key, email_data:{email} });

            callback({'status':true})
        }else{
            callback({'status':false, 'message':'Duplicate email'})
        }
    })
}

export const actionRemoveEmailProfile = (uid, email_key, callback) => dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).collection('emails').doc(email_key).delete()
    dispatch({ type: REMOVE_EMAIL_PROFILE, email_key});
    callback({'status':true})
}

// my id
export const actionAddMyIDProfile = (uid, id) => dispatch =>{
    return check_my_id(uid, 'check', id).then(data => {
        // console.log(data)
        if((data instanceof Array)){
            return {'status':false, 'message': data.message}
        }else{
            if(!data.result){
                return {'status':false, 'message': data.message}
            }else{
                if(data.is_exist){
                    return {'status':false, 'message': data.message}
                }else{
                    let key = randomKey()
                    let data = {id, enable:false}
                    firebase.firestore().collection('profiles').doc(uid).collection('my_ids').doc(key).set(data, { merge: true})

                    dispatch({ type: ADD_MY_ID_PROFILE, my_id_key:key, my_id_data:data});
                    // callback({'status':true})

                    return {'status':true}
                }
            }
        }
    })
}

export const actionRemoveMyIDProfile = (uid, key, callback) => dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).collection('my_ids').doc(key).delete()
    dispatch({ type: REMOVE_MY_ID_PROFILE, my_id_key:key});
    callback({'status':true})
}

export const actionSelectMyIDProfile = (uid, id, data, callback) => dispatch =>{
    if(id == 0){
        firebase.firestore().collection('profiles').doc(uid).collection('my_ids').where('enable', '==', true).get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                // console.log(doc.id)  
                firebase.firestore().collection('profiles').doc(uid).collection('my_ids').doc(doc.id).set({
                    enable:false
                }, { merge: true})            
            });
        })

        dispatch({ type: EDIT_MY_ID_PROFILE, my_id_key:0});
        callback({'status':true})
    }else{
        firebase.firestore().collection('profiles').doc(uid).collection('my_ids').where('enable', '==', true).get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                // console.log(doc.id)  
                if(doc.id != id){
                    firebase.firestore().collection('profiles').doc(uid).collection('my_ids').doc(doc.id).set({
                        enable:false
                    }, { merge: true})    
                }        
            });
        })
        firebase.firestore().collection('profiles').doc(uid).collection('my_ids').doc(id).set({
            enable:true
        }, { merge: true})

        dispatch({ type: EDIT_MY_ID_PROFILE, my_id_key:id, my_id_data:data});
        callback({'status':true})
    }
}

export const actionFindMyID = (uid, type, id) => dispatch=>{
    return check_my_id(uid, type, id).then(data => {
        // console.log(data)
        if((data instanceof Array)){
            return {'status':false, 'message': data.message}
        }else{
            if(!data.result){
                return {'status':false, 'message': data.message}
            }else{
                // if(data.is_exist){
                //     return {'status':false, 'message': data.message}
                // }else{
                    // let key = randomKey()
                    // let data = {id, enable:false}
                    // firebase.firestore().collection('profiles').doc(uid).collection('my_ids').doc(key).set(data, { merge: true})

                    // dispatch({ type: ADD_MY_ID_PROFILE, my_id_key:key, my_id_data:data});
                    // // callback({'status':true})

                    return {'status':true, data}
                // }
            }
        }
    })

    // callback({'status':true})
}

export const actionScanQRcode= (uid, qe) => dispatch=>{
    return scan_qrcode(uid, qe).then(data => {
        console.log(data)
        if((data instanceof Array)){
            return {'status':false, 'message': data.message}
        }else{
            if(!data.result){
                return {'status':false, 'message': data.message}
            }else{
                return {'status':true, data}
            }
        }
    })
}

export const actionFriendProfile99= (uid, friend_id) => dispatch=>{
    return friend_profile_99(uid, friend_id).then(data => {
        if((data instanceof Array)){
            return {'status':false, 'message': data.message}
        }else{
            if(!data.result){
                return {'status':false, 'message': data.message}
            }else{
                let v = data.data
                let friend_emails   = v.friend_emails
                let friend_my_ids   = v.friend_my_ids
                let friend_phones   = v.friend_phones
                let friend_profile  = v.friend_profile
                let friend_websites = v.friend_websites

                let friend_data = {'status':Constant.FRIEND_STATUS_FRIEND_99, }
                dispatch({type: ADD_FRIEND, friend_id, friend_data});
                dispatch({ type: ADDED_FRIEND_PROFILE, friend_id, friend_profile});

                _.each(friend_emails, (ev, ek)=>{
                    dispatch({ type: ADD_EMAIL_FRIEND, friend_id, friend_email_id:ek, friend_email_data:ev})
                })

                _.each(friend_my_ids, (mv, mk)=>{
                    dispatch({ type: ADD_MY_ID_FRIEND, friend_id, friend_my_id_id:mk, friend_my_id_data:mv})
                })

                _.each(friend_phones, (pv, pk)=>{
                    dispatch({ type: ADD_PHONE_FRIEND, friend_id, friend_phone_id:pk, friend_phone_data:pv})
                })

                _.each(friend_websites, (wv, wk)=>{
                    dispatch({ type: ADD_WEBSITE_FRIEND, friend_id, friend_website_id:wk, friend_website_data:wv})
                })
                
                return {'status':true, friend_profile: v.friend_profile}
            }
        }
    })
}


export const actionFriendProfileMulti99 = (uid, lost_profile) => dispatch=>{
    return friend_profile_multi_99(uid, lost_profile).then(data => {
        if((data instanceof Array)){
            return {'status':false, 'message': data.message}
        }else{
            if(!data.result){
                return {'status':false, 'message': data.message}
            }else{
                console.log(data)
                let friend_profiles =  data.data
                _.map(friend_profiles, (v, friend_id)=>{
                    // console.log(v, k)
                    // let v = data.data
                    let friend_emails   = v.friend_emails
                    let friend_my_ids   = v.friend_my_ids
                    let friend_phones   = v.friend_phones
                    let friend_profile  = v.friend_profile
                    let friend_websites = v.friend_websites

                    let friend_data = {'status':Constant.FRIEND_STATUS_FRIEND_99, }
                    dispatch({type: ADD_FRIEND, friend_id, friend_data});
                    dispatch({ type: ADDED_FRIEND_PROFILE, friend_id, friend_profile});

                    _.each(friend_emails, (ev, ek)=>{
                        dispatch({ type: ADD_EMAIL_FRIEND, friend_id, friend_email_id:ek, friend_email_data:ev})
                    })

                    _.each(friend_my_ids, (mv, mk)=>{
                        dispatch({ type: ADD_MY_ID_FRIEND, friend_id, friend_my_id_id:mk, friend_my_id_data:mv})
                    })

                    _.each(friend_phones, (pv, pk)=>{
                        dispatch({ type: ADD_PHONE_FRIEND, friend_id, friend_phone_id:pk, friend_phone_data:pv})
                    })

                    _.each(friend_websites, (wv, wk)=>{
                        dispatch({ type: ADD_WEBSITE_FRIEND, friend_id, friend_website_id:wk, friend_website_data:wv})
                    })
                })

                return {'status':true}
                /*
                let v = data.data
                let friend_emails   = v.friend_emails
                let friend_my_ids   = v.friend_my_ids
                let friend_phones   = v.friend_phones
                let friend_profile  = v.friend_profile
                let friend_websites = v.friend_websites

                let friend_data = {'status':Constant.FRIEND_STATUS_FRIEND_99, }
                dispatch({type: ADD_FRIEND, friend_id, friend_data});
                dispatch({ type: ADDED_FRIEND_PROFILE, friend_id, friend_profile});

                _.each(friend_emails, (ev, ek)=>{
                    dispatch({ type: ADD_EMAIL_FRIEND, friend_id, friend_email_id:ek, friend_email_data:ev})
                })

                _.each(friend_my_ids, (mv, mk)=>{
                    dispatch({ type: ADD_MY_ID_FRIEND, friend_id, friend_my_id_id:mk, friend_my_id_data:mv})
                })

                _.each(friend_phones, (pv, pk)=>{
                    dispatch({ type: ADD_PHONE_FRIEND, friend_id, friend_phone_id:pk, friend_phone_data:pv})
                })

                _.each(friend_websites, (wv, wk)=>{
                    dispatch({ type: ADD_WEBSITE_FRIEND, friend_id, friend_website_id:wk, friend_website_data:wv})
                })
                
                return {'status':true, friend_profile: v.friend_profile}
                */
            }
        }
    })
}

let unsubscribe = null;

export const watchTaskEvent=(uid, fcmToken) => dispatch => {
    console.log('-------------- watchTaskEvent()')

    // firebase.firestore().enablePersistence()
    // .catch(function(err) {
    //     console.log("watchTaskEvent", err)
    //     if (err.code == 'failed-precondition') {
    //         // Multiple tabs open, persistence can only be enabled
    //         // in one tab at a a time.
    //         // ...
            
    //     } else if (err.code == 'unimplemented') {
    //         // The current browser does not support all of the
    //         // features required to enable persistence
    //         // ...
    //     }
    // });
    // // Sub

    // firebase.firestore().disableNetwork()
    
    // track profile
    // unsubscribe = firebase.firestore().collection('profiles').doc(uid).onSnapshot((docSnapshot) => {
    //     if(docSnapshot.data() === undefined){
    //         actionLogout(dispatch, ()=>{
    //             // console.log(this)                
    //             this.navigation.navigate("AuthLoading")
    //         })
    //     }
    //     dispatch({ type: UPDATE_PROFILE, data:docSnapshot.data()});
    // }, (error) => {
    //     //...
    //     console.log(error)
    // })

    // track profile > phones
    /*
    firebase.firestore().collection('profiles').doc(uid).collection('phones').onSnapshot((querySnapshot) => {
        // querySnapshot.

        console.log('fromCache > ', querySnapshot.metadata.fromCache)
        
        querySnapshot.docChanges.forEach(function(change) {

            let doc_id   = change.doc.id
            let doc_data = change.doc.data()
            if (change.type === 'added') {  
                // console.log(change.type, doc_id, doc_data)
                dispatch({ type: ADD_PHONE_PROFILE, phone_key:doc_id, phone_data:doc_data});
            }
            if (change.type === 'modified') {
                // console.log(change.type, doc_id, doc_data)
               
                dispatch({ type: EDIT_PHONE_PROFILE, phone_key:doc_id, phone_data:doc_data});
            }

            if (change.type === 'removed') {
                dispatch({ type: REMOVE_PHONE_PROFILE, phone_key:doc_id});
            }
        })
    })
    */

    // track profile > websites
    /*
    firebase.firestore().collection('profiles').doc(uid).collection('websites').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges.forEach(function(change) {

            let doc_id   = change.doc.id
            let doc_data = change.doc.data()

            if (change.type === 'added') {  
                // console.log(change.type, doc_id, doc_data)
                
                dispatch({ type: ADD_WEBSITE_PROFILE, website_key:doc_id, url:doc_data.url});
            }
            if (change.type === 'modified') {
                // console.log(change.type, doc_id, doc_data)
               
                dispatch({ type: EDIT_WEBSITE_PROFILE, website_key:doc_id, url:doc_data.url});
            }

            if (change.type === 'removed') {
                dispatch({ type: REMOVE_WEBSITE_PROFILE, website_key:doc_id});
            }
        })
    })
    */

    /*
    // track profile > emails
    firebase.firestore().collection('profiles').doc(uid).collection('emails').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges.forEach(function(change) {

            let doc_id   = change.doc.id
            let doc_data = change.doc.data()

            if (change.type === 'added') {  
                // console.log(change.type, doc_id, doc_data)
                
                dispatch({ type: ADD_EMAIL_PROFILE, email_key:doc_id, email_data:doc_data});
            }
            if (change.type === 'modified') {
                // console.log(change.type, doc_id, doc_data)
            
                dispatch({ type: EDIT_EMAIL_PROFILE, email_key:doc_id, email_data:doc_data});
            }

            if (change.type === 'removed') {
                dispatch({ type: REMOVE_EMAIL_PROFILE, email_key:doc_id});
            }
        })
    })
    */

    // track profile > my_ids
    /*
    firebase.firestore().collection('profiles').doc(uid).collection('my_ids').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges.forEach(function(change) {

            let doc_id   = change.doc.id
            let doc_data = change.doc.data()

            if (change.type === 'added') {  
                // console.log(change.type, doc_id, doc_data)

                dispatch({ type: ADD_MY_ID_PROFILE, my_id_key:doc_id, my_id_data:doc_data});
            }
            if (change.type === 'modified') {
                // console.log(change.type, doc_id, doc_data)
                // if(doc_data.enable){
                    // console.log(change.type, doc_id, doc_data)
                    dispatch({ type: EDIT_MY_ID_PROFILE, my_id_key:doc_id, my_id_data:doc_data});
                // }
            }

            if (change.type === 'removed') {
                dispatch({ type: REMOVE_MY_ID_PROFILE, my_id_key:doc_id});
            }
        })
    })
    */
    
    // track friends
    /*
    firebase.firestore().collection('users').doc(uid).collection('friends').onSnapshot((querySnapshot) => {
        // console.log(querySnapshot)

        querySnapshot.docChanges.forEach(function(change) {
            // console.log(change.type)
            if (change.type === 'added') {

                dispatch({ type: ADD_FRIEND, friend_id:change.doc.id, friend_data:change.doc.data() });

                // console.log('users>friends', change.doc.data())

                // จะ track ตลอด added, modified, remove 
                firebase.firestore().collection('profiles').doc(change.doc.id).onSnapshot((friendDocSnapshot) => {
                    // console.log(change.doc.id, friendDocSnapshot)
                    if (!friendDocSnapshot.exists) {
                        console.log('No such document!');
                    } else {
                        dispatch({ type: ADDED_FRIEND_PROFILE, friend_id:change.doc.id, friend_profile:friendDocSnapshot.data()});
                    }
                })

                // track friends > phones
                firebase.firestore().collection('profiles').doc(change.doc.id).collection('phones').onSnapshot((phonesSnapshot) => {
                    phonesSnapshot.docChanges.forEach(function(phonesChange) {
                        console.log(phonesChange.type)

                        console.log(change.doc.id, phonesChange.doc.id, phonesChange.doc.data())
                        if (phonesChange.type === 'added') {
                            // friend_id:change.doc.id, data:change.doc.data()

                            dispatch({ type: ADD_PHONE_FRIEND, friend_id:change.doc.id, phone_key:phonesChange.doc.id, phone_data:phonesChange.doc.data()})
                        }

                        if (phonesChange.type === 'modified') {

                        }

                        if (phonesChange.type === 'removed') {

                        }
                    })
                })

      
                // ADD_WEBSITE_FRIEND
                
                // track friends > websites
                firebase.firestore().collection('profiles').doc(change.doc.id).collection('websites').onSnapshot((websitesSnapshot) => {
                    websitesSnapshot.docChanges.forEach(function(websitesChange) {
                        console.log(websitesChange.type)

                        console.log(change.doc.id, websitesChange.doc.id, websitesChange.doc.data())
                        if (websitesChange.type === 'added') {
                            // friend_id:change.doc.id, data:change.doc.data()


                            dispatch({ type: ADD_WEBSITE_FRIEND, friend_id:change.doc.id, website_key:websitesChange.doc.id, website_data:websitesChange.doc.data()})
                        }

                        if (websitesChange.type === 'modified') {

                        }

                        if (websitesChange.type === 'removed') {

                        }
                    })
                })

                // track friends > emails
                firebase.firestore().collection('profiles').doc(change.doc.id).collection('emails').onSnapshot((emailsSnapshot) => {
                    emailsSnapshot.docChanges.forEach(function(emailsChange) {
                        console.log(emailsChange.type)

                        console.log(change.doc.id, emailsChange.doc.id, emailsChange.doc.data())
                        if (emailsChange.type === 'added') {
                            // friend_id:change.doc.id, data:change.doc.data()

                            dispatch({ type: ADD_EMAIL_FRIEND, friend_id:change.doc.id, email_key:emailsChange.doc.id, email_data:emailsChange.doc.data()})
                        }

                        if (emailsChange.type === 'modified') {

                        }

                        if (emailsChange.type === 'removed') {

                        }
                    })
                })

                // track friends > my_ids
                firebase.firestore().collection('profiles').doc(change.doc.id).collection('my_ids').onSnapshot((my_idsSnapshot) => {
                    my_idsSnapshot.docChanges.forEach(function(my_idsChange) {
                        console.log(my_idsChange.type)

                        console.log(change.doc.id, my_idsChange.doc.id, my_idsChange.doc.data())
                        if (my_idsChange.type === 'added') {
                            // friend_id:change.doc.id, data:change.doc.data()
                        }

                        if (my_idsChange.type === 'modified') {

                        }

                        if (my_idsChange.type === 'removed') {

                        }
                    })
                })

                firebase.database().ref('user_presence/' + change.doc.id).on('child_added', function (snapshot) {
                    // console.log(change.doc.id, snapshot.key, snapshot.val())

                    dispatch({ type: ADDED_PRESENCE, userId:change.doc.id, presenceKey:snapshot.key, presenceData:snapshot.val()})
                });

                firebase.database().ref('user_presence/' + change.doc.id).on('child_changed', function (snapshot) {
                    // console.log(change.doc.id, snapshot.key, snapshot.val())

                    dispatch({ type: CHANGED_PRESENCE, userId:change.doc.id, presenceKey:snapshot.key, presenceData:snapshot.val()})
                });

                firebase.database().ref('user_presence/' + change.doc.id).on('child_removed', function (snapshot) {
                    // console.log(change.doc.id, snapshot.key, snapshot.val())

                    dispatch({ type: REMOVED_PRESENCE, userId:change.doc.id, presenceKey:snapshot.key})
                });
            }
            if (change.type === 'modified') {
                dispatch({ type: MODIFIED_FRIEND, friend_id:change.doc.id, data:change.doc.data() });
            }
        })
    })
    */

    // track grouds
    /*
    firebase.firestore().collection('users').doc(uid).collection('groups').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges.forEach(function(change) {
            console.log(change.type, change.doc.id, change.doc.data());

            switch(change.type){
                case 'added':{
                    // dispatch({type: ADDED_MY_APPLICATION, my_application_id:change.doc.id, my_application_data:change.doc.data()})
                    
                    // track group profile
                    firebase.firestore().collection('groups').doc(change.doc.id).onSnapshot((docSnapshot) => {
                        // console.log(docSnapshot.id) 
                        // doc.id จะมีค่าเท่ากันกับ  docSnapshot.id 
        
                        if(docSnapshot.data() !== undefined){
                            // console.log(doc.id, " => ", doc.data());
        
                            let newData = {...change.doc.data(), group_profile:docSnapshot.data()}
                            console.log(newData)
                            dispatch({ type: ADD_GROUP, group_id:docSnapshot.id, data:newData });
                        }
                    })

                    // track group > members
                    firebase.firestore().collection('groups').doc(change.doc.id).collection('members').onSnapshot((querySnapshot) => {
                        querySnapshot.docChanges.forEach(function(members_change) {
                            console.log(change.doc.id, members_change.type, members_change.doc.id, members_change.doc.data())
                            
                            if (members_change.type === 'added') {
                                console.log('added: ', change.doc.id, members_change.doc.id, members_change.doc.data());

                                let group_id = change.doc.id
                                let member_key = members_change.doc.id
                                let data = members_change.doc.data()
                                // ADDED_GROUP_MEMBER

                                dispatch({ type: ADDED_GROUP_MEMBER, group_id, member_key, data});
                            }
                            if (members_change.type === 'modified') {
                                console.log('modified: ', change.doc.id, members_change.doc.id, members_change.doc.data());

                                let group_id = change.doc.id
                                let member_key = members_change.doc.id
                                let data = members_change.doc.data()
                                // MODIFIED_GROUP_MEMBER

                                dispatch({ type: MODIFIED_GROUP_MEMBER, group_id, member_key, data});
                            }
                            if (members_change.type === 'removed') {
                                console.log('removed: ', change.doc.id, members_change.doc.id, members_change.doc.data());

                                let group_id = change.doc.id
                                let item_id = members_change.doc.id
                                let data = members_change.doc.data()
                                // REMOVED_GROUP_MEMBER

                                dispatch({ type: REMOVED_GROUP_MEMBER, group_id, item_id});
                            }
                        })
                    })

                    break;
                }
                case 'modified':{
                    // dispatch({type: MODIFIED_MY_APPLICATION, my_application_id:change.doc.id, my_application_data:change.doc.data()})
                    
                    // MODIFIED_GROUP
                    dispatch({ type: MODIFIED_GROUP, group_id:change.doc.id, data:change.doc.data() });
                    break;
                }
                case 'removed':{
                    // dispatch({type: REMOVED_MY_APPLICATION, my_application_id:change.doc.id, my_application_data:change.doc.data()})
                    dispatch({ type: DELETE_GROUP, group_id:change.doc.id});
                    break;
                }
            }
        });
    })
    */
    
    // track classs
    /*
    firebase.firestore().collection('users').doc(uid).collection('classs').onSnapshot((classsSnapshot) => {
        classsSnapshot.docChanges.forEach(function(classsChange) {
            console.log("Classs", classsChange.type, classsChange.doc.id, classsChange.doc.data());

            switch(classsChange.type){
                case 'added':{
                    // ADDED_CLASS class_id, class_data
                    dispatch({type: ADDED_CLASS, class_id:classsChange.doc.id ,class_data:classsChange.doc.data() })

                    firebase.firestore().collection('users').doc(uid).collection('classs').doc(classsChange.doc.id).collection('members').onSnapshot((classsMembersSnapshot) => {
                        classsMembersSnapshot.docChanges.forEach(function(classsMembersChange) {
                            // console.log("Classs", classsChange.doc.data(), classsMembersChange.type, classsMembersChange.doc.id, classsMembersChange.doc.data());
                            // console.log("CLASS_MEMBERS ", doc.id, " => ", doc.data());
                            // SELECT_CLASS_MEMBERS
                            // dispatch({type: CLASS_MEMBERS, parent_id:doc.id,class_members_id:pdoc.id, class_members_data:pdoc.data()})
                        
                            switch(classsMembersChange.type){
                                case 'added':{
                                    // ADDED_CLASS_MEMBER
                                    dispatch({type: ADDED_CLASS_MEMBER, class_id:classsChange.doc.id, class_member_id:classsMembersChange.doc.id, class_member_data:classsMembersChange.doc.data() })
                                    break;
                                }
                                case 'modified':{
                                    // MODIFIED_CLASS_MEMBER
                                    dispatch({type: MODIFIED_CLASS_MEMBER, class_id:classsChange.doc.id, class_member_id:classsMembersChange.doc.id, class_member_data:classsMembersChange.doc.data() })
                                    break;
                                }
                                case 'removed':{
                                    // REMOVED_CLASS_MEMBER
                                    dispatch({type: REMOVED_CLASS_MEMBER, class_id:classsChange.doc.id, class_member_id:classsMembersChange.doc.id})
                                    break;
                                }
                            }
                        })
                    })
                    break;
                }
                case 'modified':{
                    // MODIFIED_CLASS
                    // console.log("Classs", classsChange.type, classsChange.doc.id, classsChange.doc.data());
                    dispatch({type: MODIFIED_CLASS, class_id:classsChange.doc.id ,class_data:classsChange.doc.data() })
                   
                    break;
                }
                case 'removed':{
                    // REMOVED_CLASS
                    dispatch({type: REMOVED_CLASS, class_id:classsChange.doc.id})
                    break;
                }
            }
        })

    })
    */

    /*
    // trach my application
    firebase.firestore().collection('users').doc(uid).collection('my_applications').onSnapshot((qSnapshot) => {
        qSnapshot.docChanges.forEach(function(change) {
            console.log(change.type, change.doc.id, change.doc.data());
            switch(change.type){
                case 'added':{
                    dispatch({type: ADDED_MY_APPLICATION, my_application_id:change.doc.id, my_application_data:change.doc.data()})
                    break;
                }
                case 'modified':{
                    dispatch({type: MODIFIED_MY_APPLICATION, my_application_id:change.doc.id, my_application_data:change.doc.data()})
                    break;
                }
                case 'removed':{
                    dispatch({type: REMOVED_MY_APPLICATION, my_application_id:change.doc.id, my_application_data:change.doc.data()})
                    break;
                }
            }
        })
    })
    */


    // track online/offline
    let flag = false
    const oldRealTimeDb = firebase.database();
    const onlineRef = oldRealTimeDb.ref('.info/connected');
    onlineRef.on('value', snapshot => {
        // console.log('-- 0')
        oldRealTimeDb.ref('user_presence/' + uid).orderByChild("udid").equalTo(DeviceInfo.getUniqueID()).once('value').then(function (snapshot) { 
            // console.log('-- 1', snapshot.val())
            if(snapshot.val() === null){
                /* 
                    แก้ปัณหาโดยการใช้ flag ไปก่อนเพราะว่าจะมีการ push data ที่มี udid ซํ้ากัน
                    ซึ่งในความเป็นจิงไม่ถูกต้อง
                    ** ลองเทส ดึงข้อมูลออกมาตรวจสอบก้ยังไม่สำเร็จจึงแก้ปัญหาโดยการใช้ flag ไปก่อน
                */
                if(!flag){
                    flag = true
                    oldRealTimeDb.ref('user_presence/' + uid).push({
                            'platform': Platform.OS,
                            'udid': DeviceInfo.getUniqueID(),
                            'bundle_identifier': DeviceInfo.getBundleId(),
                            'build_number': DeviceInfo.getBuildNumber(),
                            'build_version':DeviceInfo.getVersion(),
                            'model_number': DeviceInfo.getModel(),
                            'fcmToken':fcmToken,
                            'status':'online'
                        });
                }else{
                    return;
                }
            }else{
                oldRealTimeDb.ref("user_presence/" + uid + "/"+ Object.keys(snapshot.val())[0] +"/").set({
                    'platform': Platform.OS,
                    'udid': DeviceInfo.getUniqueID(),
                    'bundle_identifier': DeviceInfo.getBundleId(),
                    'build_number': DeviceInfo.getBuildNumber(),
                    'build_version':DeviceInfo.getVersion(),
                    'model_number': DeviceInfo.getModel(),
                    'fcmToken':fcmToken,
                    'status':'online'
                });

                oldRealTimeDb.ref("user_presence/" + uid + "/"+ Object.keys(snapshot.val())[0] +"/")
                    .onDisconnect() // Set up the disconnect hook
                    .set({
                        'platform': Platform.OS,
                        'udid': DeviceInfo.getUniqueID(),
                        'bundle_identifier': DeviceInfo.getBundleId(),
                        'build_number': DeviceInfo.getBuildNumber(),
                        'build_version':DeviceInfo.getVersion(),
                        'model_number': DeviceInfo.getModel(),
                        'fcmToken':fcmToken,
                        'status':'offline'
                    });
            } 
        });     
    });
}

// track profiles
export const trackProfiles=(uid, profiles)=> dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).onSnapshot((docSnapshot) => {
        // if(docSnapshot.data() === undefined){
        //     actionLogout(dispatch, ()=>{
        //         // console.log(this)                
        //         this.navigation.navigate("AuthLoading")
        //     })
        // }
        if(docSnapshot.data() !== undefined){
            // console.log('trackProfiles', profiles, docSnapshot.data())
            
            if(!_.isEqual(profiles, docSnapshot.data())){
                dispatch({ type: UPDATE_PROFILE, profile_data:docSnapshot.data()});
            }
        }
        
    }, (error) => {
        //...
        console.log(error)
    })
}

// track phones
export const trackProfilesPhones=(uid, phones)=> dispatch =>{
    /*
    var phonesRef = firebase.firestore().collection('profiles').doc(uid).collection('phones')
    var promises = []
    _.each(phones, (v, k)=>{
        let promise = phonesRef.where('phone_number', '<', v.phone_number).where('phone_number', '>', v.phone_number).get()

        // Push the promise to the array
        promises.push(promise)

        onSnapshotPhoneProfile(uid, k)
    })

    Promise.all(promises).then(res => {
                            console.log('Get: d', res)
                            res.forEach(r => {
                                // if(r.size == 0){
                                r.forEach(d => {
                                    console.log('Get: d', d.id, d.data());
                                });
                                console.log('Get: r', r, r.size);
                            });
                        }).catch(function(err) {
                            console.log('Get: d', err.message); // some coding error in handling happened
                        });

                        */

    firebase.firestore().collection('profiles').doc(uid).collection('phones').onSnapshot((querySnapshot) => {
        // querySnapshot.
        // console.log('fromCache > ', querySnapshot.metadata.fromCache)
        querySnapshot.docChanges.forEach(function(change) {

            let doc_id   = change.doc.id
            let doc_data = change.doc.data()
            if (change.type === 'added') {  
                let phone = _.find(phones, (v, k)=>{
                                return doc_id == k
                            })
                // console.log('phone > ', phone)
                if(phone === undefined){
                    dispatch({ type: ADD_PHONE_PROFILE, phone_key:doc_id, phone_data:doc_data});
                }
            }
            if (change.type === 'modified') {
                // console.log(change.type, doc_id, doc_data)
                
                dispatch({ type: EDIT_PHONE_PROFILE, phone_key:doc_id, phone_data:doc_data});
            }

            if (change.type === 'removed') {
                dispatch({ type: REMOVE_PHONE_PROFILE, phone_key:doc_id});
            }
        })
    })
}

// track websites
export const trackProfileWebsites=(uid, websites)=> dispatch =>{

    firebase.firestore().collection('profiles').doc(uid).collection('websites').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges.forEach(function(change) {

            let doc_id   = change.doc.id
            let doc_data = change.doc.data()

            if (change.type === 'added') {  
                // console.log(change.type, doc_id, doc_data)

                let website = _.find(websites, (v, k)=>{
                    return doc_id == k
                })
                
                if(website === undefined){
                    console.log('website > ', websites, website, doc_id )
                    dispatch({ type: ADD_WEBSITE_PROFILE, website_key:doc_id, url:doc_data.url});
                }
            }
            if (change.type === 'modified') {
                // console.log(change.type, doc_id, doc_data)
               
                dispatch({ type: EDIT_WEBSITE_PROFILE, website_key:doc_id, url:doc_data.url});
            }

            if (change.type === 'removed') {
                dispatch({ type: REMOVE_WEBSITE_PROFILE, website_key:doc_id});
            }
        })
    })
}

// track emails
export const trackProfileEmails=(uid, emails)=> dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).collection('emails').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges.forEach(function(change) {

            let doc_id   = change.doc.id
            let doc_data = change.doc.data()

            if (change.type === 'added') {  
                // console.log(change.type, doc_id, doc_data)
                let email = _.find(emails, (v, k)=>{
                    return doc_id == k
                })
                
                if(email === undefined){
                    console.log('email > ', emails, email, doc_id )
                
                    dispatch({ type: ADD_EMAIL_PROFILE, email_key:doc_id, email_data:doc_data});
                }
            }
            if (change.type === 'modified') {
                // console.log(change.type, doc_id, doc_data)
            
                dispatch({ type: EDIT_EMAIL_PROFILE, email_key:doc_id, email_data:doc_data});
            }

            if (change.type === 'removed') {
                dispatch({ type: REMOVE_EMAIL_PROFILE, email_key:doc_id});
            }
        })
    })
}

// track my_ids
export const trackProfileMyIds=(uid, myIds)=> dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).collection('my_ids').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges.forEach(function(change) {

            let doc_id   = change.doc.id
            let doc_data = change.doc.data()

            if (change.type === 'added') {  
                // console.log(change.type, doc_id, doc_data)

                let myId = _.find(myIds, (v, k)=>{
                    return doc_id == k
                })
                
                if(myId === undefined){
                    console.log('myId > ', myIds, myId, doc_id )
                    dispatch({ type: ADD_MY_ID_PROFILE, my_id_key:doc_id, my_id_data:doc_data});
                }
            }
            if (change.type === 'modified') {
                // console.log(change.type, doc_id, doc_data)
                // if(doc_data.enable){
                    // console.log(change.type, doc_id, doc_data)
                    dispatch({ type: EDIT_MY_ID_PROFILE, my_id_key:doc_id, my_id_data:doc_data});
                // }
            }

            if (change.type === 'removed') {
                dispatch({ type: REMOVE_MY_ID_PROFILE, my_id_key:doc_id});
            }
        })
    })
}

// trach my application
export const trackMyApplications=(uid, my_applications, my_applications_posts)=> dispatch =>{
    console.log('trackMyApplications', my_applications, my_applications_posts)
    firebase.firestore().collection('users').doc(uid).collection('my_applications').onSnapshot((qSnapshot) => {
        qSnapshot.docChanges.forEach(function(change) {
            // console.log(change.type, change.doc.id, change.doc.data());

            let doc_id   = change.doc.id
            let doc_data = change.doc.data()

            switch(change.type){
                case 'added':{
                    let my_application = _.find(my_applications, (v, k)=>{
                        return doc_id == k
                    })
                    
                    if(my_application === undefined){
                        // console.log('my_application > ', my_applications, my_application, doc_id )
                        dispatch({type: ADDED_MY_APPLICATION, my_application_id:doc_id, my_application_data:doc_data})
                    }

                    // /users/549099/my_applications/1363/my_applications_posts/1124668
                    firebase.firestore().collection('users').doc(uid).collection('my_applications').doc(doc_id).collection('my_applications_posts').onSnapshot((postsSnapshot) => {
                        postsSnapshot.docChanges.forEach(function(postsChange) {
                            let posts_doc_id   = postsChange.doc.id
                            let posts_doc_data = postsChange.doc.data()
                            switch(postsChange.type){
                                case 'added':{
                                    // console.log('trackMyApplications > my_applications > my_applications_posts : added ', doc_id, posts_doc_id, posts_doc_data)
                                   
                                    let my_applications_post =  _.find(my_applications_posts, (v, k)=>{
                                                                    return doc_id == k
                                                                })
                                    if(my_applications_post){
                                        let post =  _.find(my_applications_post, (post_v, post_k)=>{
                                                        return posts_doc_id == post_k
                                                    })

                                        if(!post){
                                            dispatch({type:ADDED_MY_APPLICATIONS_POSTS, app_id:doc_id, post_id:posts_doc_id, my_applications_posts_data:posts_doc_data})
                                        }
                                    }else{
                                        dispatch({type:ADDED_MY_APPLICATIONS_POSTS, app_id:doc_id, post_id:posts_doc_id, my_applications_posts_data:posts_doc_data})
                                    }

                                    // /users/549099/my_applications/1363/my_applications_posts/1124668/my_applications_posts_images/1124669
                                    firebase.firestore().collection('users').doc(uid).collection('my_applications').doc(doc_id).collection('my_applications_posts').doc(posts_doc_id).collection('my_applications_posts_images').onSnapshot((imagesSnapshot) => {
                                        imagesSnapshot.docChanges.forEach(function(imagesChange) {
                                            let image_doc_id   = imagesChange.doc.id
                                            let image_doc_data = imagesChange.doc.data()
                                            switch(imagesChange.type){
                                                case 'added':{
                                                    let posts   =_.find(my_applications_posts, (v, k)=>{
                                                                    return doc_id == k
                                                                })

                                                    let post    =_.find(posts,(v, k)=>{
                                                                    return posts_doc_id == k
                                                                })

                                                    if(!post){
                                                        dispatch({type:ADDED_MY_APPLICATIONS_POSTS_IMAGES, post_id:posts_doc_id, image_doc_id, image_doc_data})
                                                        return;
                                                    }else{
                                                        // if (!post.hasOwnProperty("images")){
                                                        //     dispatch({type:ADDED_MY_APPLICATIONS_POSTS_IMAGES, post_id:posts_doc_id, image_doc_id, image_doc_data})
                                                        // }else{
                                                        // console.log('images----->', post)
                                                        let {images} = post

                                                        

                                                        let image = _.find(images,(v, k)=>{
                                                                        return image_doc_id == k
                                                                    })

                                                        if(!image){
                                                            dispatch({type:ADDED_MY_APPLICATIONS_POSTS_IMAGES, post_id:posts_doc_id, image_doc_id, image_doc_data})
                                                        }
                                                    }
                                                    break;
                                                }
                                                case 'modified':{
                                                    
                                                    break;
                                                }
                                                case 'removed':{
                                                    
                                                    break;
                                                }
                                            }
                                        })
                                    })

                                    firebase.firestore().collection('users').doc(uid).collection('my_applications').doc(doc_id).collection('my_applications_posts').doc(posts_doc_id).collection('my_applications_posts_likes').onSnapshot((likesSnapshot) => {
                                        likesSnapshot.docChanges.forEach(function(likesChange) {
                                            let like_doc_id   = likesChange.doc.id
                                            let like_doc_data = likesChange.doc.data()
                                            switch(likesChange.type){
                                                case 'added':{
                                                    // console.log('my_applications_posts_likes', like_doc_id, like_doc_data)
                                                    
                                                    let posts   =_.find(my_applications_posts, (v, k)=>{
                                                                    return doc_id == k
                                                                })

                                                    let post    =_.find(posts,(v, k)=>{
                                                                    return posts_doc_id == k
                                                                })

                                                    if(!post){
                                                        // console.log('ADDED_MY_APPLICATIONS_POSTS_LIKES', like_doc_id, like_doc_data)
                                                        dispatch({type:ADDED_MY_APPLICATIONS_POSTS_LIKES, post_id:posts_doc_id, like_doc_id, like_doc_data})
                                                        return;
                                                    }else{
                                                        // if (!post.hasOwnProperty("images")){
                                                        //     dispatch({type:ADDED_MY_APPLICATIONS_POSTS_IMAGES, post_id:posts_doc_id, image_doc_id, image_doc_data})
                                                        // }else{
                                                        // console.log('likes----->', post)
                                                        let {likes} = post

                                                        let like = _.find(likes,(v, k)=>{
                                                                        return like_doc_id == k
                                                                    })

                                                        if(!like){
                                                            console.log('ADDED_MY_APPLICATIONS_POSTS_LIKES', like_doc_id, like_doc_data)
                                                            dispatch({type:ADDED_MY_APPLICATIONS_POSTS_LIKES, post_id:posts_doc_id, like_doc_id, like_doc_data})
                                                        }
                                                    }
                                                
                                                    break;
                                                }
                                                case 'modified':{
                                                    // var newState =store.getState();
                                                    dispatch({type:MODIFIED_MY_APPLICATIONS_POSTS_LIKES, post_id:posts_doc_id, like_doc_id, like_doc_data})
                                                    break;
                                                }
                                                case 'removed':{
                                                    dispatch({type:REMOVED_MY_APPLICATIONS_POSTS_LIKES, post_id:posts_doc_id, like_doc_id})
                                                    break;
                                                }
                                            }
                                        })
                                    })

                                    break;
                                }
                                case 'modified':{
                                    
                                    break;
                                }
                                case 'removed':{
                                    dispatch({type:REMOVED_MY_APPLICATIONS_POSTS, app_id:doc_id, post_id:posts_doc_id})
                                    break;
                                }
                            }
                        })
                    })

                    break;
                }
                case 'modified':{
                    dispatch({type: MODIFIED_MY_APPLICATION, my_application_id:change.doc.id, my_application_data:change.doc.data()})
                    break;
                }
                case 'removed':{
                    dispatch({type: REMOVED_MY_APPLICATION, my_application_id:change.doc.id, my_application_data:change.doc.data()})
                    break;
                }
            }
        })
    })
}

// track classs
export const trackClasss=(uid, classs, class_members)=> dispatch =>{
    console.log('classs? ', classs)
    firebase.firestore().collection('users').doc(uid).collection('classs').onSnapshot((classsSnapshot) => {
        classsSnapshot.docChanges.forEach(function(classsChange) {
            // console.log("Classs", classsChange.type, classsChange.doc.id, classsChange.doc.data());

            let class_id   = classsChange.doc.id
            let class_data = classsChange.doc.data()

            switch(classsChange.type){
                case 'added':{
                    // ADDED_CLASS class_id, class_data
                    let _class = _.find(classs, (v, k)=>{
                        return class_id == k
                    })

                    if(!_class){
                        console.log('track classs > added')
                        dispatch({type: ADDED_CLASS, class_id, class_data})
                    }else{
                        if(!_.isEqual(_class, class_data)){
                            console.log('track classs > added not equal')
                            dispatch({type: ADDED_CLASS, class_id, class_data})
                        }
                    }
                    
                    // console.log('2, classs > ', uid, classsChange.doc.id)
                    firebase.firestore().collection('users').doc(uid).collection('classs').doc(classsChange.doc.id).collection('members').onSnapshot((classsMembersSnapshot) => {
                        classsMembersSnapshot.docChanges.forEach(function(classsMembersChange) {
                            // console.log("Classs", classsChange.doc.data(), classsMembersChange.type, classsMembersChange.doc.id, classsMembersChange.doc.data());
                            // console.log("CLASS_MEMBERS ", doc.id, " => ", doc.data());
                            // SELECT_CLASS_MEMBERS
                            // dispatch({type: CLASS_MEMBERS, parent_id:doc.id,class_members_id:pdoc.id, class_members_data:pdoc.data()})
                        
                            let class_member_id     = classsMembersChange.doc.id
                            let class_member_data   = classsMembersChange.doc.data()

                            switch(classsMembersChange.type){
                                case 'added':{
                                    // ADDED_CLASS_MEMBER
                                
                                    let class_member = _.find(class_members, (v, k)=>{
                                        return k == class_id
                                    })

                                    if(class_member){
                                        let c = _.find(class_member, (cv, ck)=>{
                                            return ck == class_member_id && _.isEqual(class_member_data, cv)
                                        })

                                        if(c){
                                            return;
                                        }
                                    }

                                    console.log('track classs > members > added ')
                                    dispatch({type: ADDED_CLASS_MEMBER, class_id, class_member_id, class_member_data})
                                    break;
                                }
                                case 'modified':{
                                    console.log('track classs > members > modified')
                                    // MODIFIED_CLASS_MEMBER
                                    dispatch({type: MODIFIED_CLASS_MEMBER, class_id, class_member_id, class_member_data})
                                    break;
                                }
                                case 'removed':{
                                    console.log('track classs > members > removed')
                                    // REMOVED_CLASS_MEMBER
                                    // dispatch({type: REMOVED_CLASS_MEMBER, class_id:classsChange.doc.id, class_member_id:classsMembersChange.doc.id})
                                    break;
                                }
                            }
                        })
                    })
                    
                    break;
                }
                case 'modified':{
                    // MODIFIED_CLASS
                    // console.log("Classs", classsChange.type, classsChange.doc.id, classsChange.doc.data());
                    dispatch({type: MODIFIED_CLASS, class_id, class_data })
                   
                    break;
                }
                case 'removed':{
                    // REMOVED_CLASS
                    dispatch({type: REMOVED_CLASS, class_id:classsChange.doc.id})
                    break;
                }
            }
        })

    })
}

// track groups
export const trackGroups=(uid, groups, group_profiles, group_members)=> dispatch =>{
    // console.log("trackGroups", groups)
    firebase.firestore().collection('users').doc(uid).collection('groups').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges.forEach(function(change) {
            // console.log(change.type, change.doc.id, change.doc.data());
        
            let group_id    = change.doc.id
            let group_data  = change.doc.data()

            switch(change.type){
                case 'added':{

                    let group = _.find(groups, (v, k)=>{
                                    return change.doc.id == k
                                })
                        
                    if(!group){
                        console.log("trackGroups users > groups > added")
                        dispatch({ type: ADD_GROUP, group_id, group_data});
                    }

                    // track group profile
                    firebase.firestore().collection('groups').doc(change.doc.id).onSnapshot((docSnapshot) => {
                        // console.log(docSnapshot.id) 
                        // doc.id จะมีค่าเท่ากันกับ  docSnapshot.id 
        
                        if(docSnapshot.data() !== undefined){
                            let group_profile = _.find(group_profiles, (v, k)=>{
                                                    return change.doc.id == k
                                                })

                            if(!group_profile){
                                console.log('track group profile')
                                dispatch({ type: ADDED_GROUP_PROFILE, group_id:change.doc.id, group_profile_data:docSnapshot.data()});
                            }
                        }
                    })

                    // track group > members
                    firebase.firestore().collection('groups').doc(change.doc.id).collection('members').onSnapshot((querySnapshot) => {
                        querySnapshot.docChanges.forEach(function(members_change) {
                            
                            let group_id = change.doc.id
                            let member_key = members_change.doc.id
                            let member_data = members_change.doc.data()
                            
                            if (members_change.type === 'added') {
                                
                                
                                let members = _.find(group_members,  function(fpv, fpk) { 
                                                return fpk == group_id
                                            })

                                let member  = _.find(members, (mv, mk)=>{
                                                return mk == member_key && _.isEqual(mv, members_change.doc.data())
                                            })
                            
                                if(member){
                                    return;
                                }

                                console.log('track group > members : added', member_key, member_data)

                                dispatch({ type: ADDED_GROUP_MEMBER, group_id, member_key, member_data});
                            }
                            if (members_change.type === 'modified') {
                                console.log('track group > members : modified');
                                // MODIFIED_GROUP_MEMBER
                                dispatch({ type: MODIFIED_GROUP_MEMBER, group_id, member_key, member_data});
                            }
                            if (members_change.type === 'removed') {
                                console.log('track group > members : removed');
                                dispatch({ type: REMOVED_GROUP_MEMBER, group_id, member_key});
                            }
                        })
                    })
                    
                    break;
                }

                case 'modified':{
                    console.log('trackGroups > modified')

                    // MODIFIED_GROUP
                    dispatch({ type: MODIFIED_GROUP, group_id, group_data });
                    break;
                }
                case 'removed':{
                    // dispatch({type: REMOVED_MY_APPLICATION, my_application_id:change.doc.id, my_application_data:change.doc.data()})
                    dispatch({ type: DELETE_GROUP, group_id});
                    break;
                }
            }
        });
    })
}

// track friends
export const trackFriends=(uid, friends, friend_profiles)=> dispatch =>{
    firebase.firestore().collection('users').doc(uid).collection('friends').onSnapshot((querySnapshot) => {
        // console.log(querySnapshot)

        querySnapshot.docChanges.forEach(function(change) {
            // console.log(change.type)
            if (change.type === 'added') {

                let friend_id   = change.doc.id
                let friend_data = change.doc.data()

                let friend = _.find(friends, (v, k)=>{
                    return change.doc.id == k
                })

                console.log('trackFriends > added', friend, friend_data)
                // if(friend === undefined){
                if(!_.isEqual(friend, friend_data)){
                    console.log('trackFriends > added', friend)
                    dispatch({ type: ADD_FRIEND, friend_id, friend_data});
                }

                // friend > profiles
                firebase.firestore().collection('profiles').doc(change.doc.id).onSnapshot((friendProfileDocSnapshot) => {
                    // console.log(change.doc.id, friendDocSnapshot)
                    if (!friendProfileDocSnapshot.exists) {
                        console.log('No such document!');
                    } else {

                        let friend_id           = change.doc.id
                        let new_friend_profile  = friendProfileDocSnapshot.data()

                        let friend_profile  = _.find(friend_profiles, (fpv, fpk)=>{
                                                return friend_id == fpk
                                            })
                        if(friend_profile === undefined){
                            console.log('trackFriends > added > profile', friend)
                            dispatch({ type: ADDED_FRIEND_PROFILE, friend_id, friend_profile:new_friend_profile});
                        } 
                    }
                })

                // track friends > phones
                firebase.firestore().collection('profiles').doc(change.doc.id).collection('phones').onSnapshot((phonesSnapshot) => {
                    phonesSnapshot.docChanges.forEach(function(phonesChange) {
                        // console.log(phonesChange.type)

                        // console.log(change.doc.id, phonesChange.doc.id, phonesChange.doc.data())
                        if (phonesChange.type === 'added') {
                            let friend_id         = change.doc.id
                            let friend_phone_id   = phonesChange.doc.id
                            let friend_phone_data = phonesChange.doc.data()

                            let friend_profile  = _.find(friend_profiles, (fpv, fpk)=>{
                                return friend_id == fpk
                            })

                            if(friend_profile !== undefined){
                                let friend_phone =_.find(friend_profile.phones,  function(fpv, fpk) { 
                                                return fpk == friend_phone_id
                                            })

                                if(friend_phone !== undefined){
                                    return;
                                }

                                console.log('phones > added', friend_profiles, friend_id, friend_profile)
                                dispatch({ type: ADD_PHONE_FRIEND, friend_id, friend_phone_id, friend_phone_data})
                            }
                        }

                        if (phonesChange.type === 'modified') {

                        }

                        if (phonesChange.type === 'removed') {

                        }
                    })
                })

                // track friends > websites
                firebase.firestore().collection('profiles').doc(change.doc.id).collection('websites').onSnapshot((websitesSnapshot) => {
                    websitesSnapshot.docChanges.forEach(function(websitesChange) {
                        // console.log(websitesChange.type)

                        // console.log(change.doc.id, websitesChange.doc.id, websitesChange.doc.data())
                        if (websitesChange.type === 'added') {
                            // dispatch({ type: ADD_WEBSITE_FRIEND, friend_id:change.doc.id, website_key:websitesChange.doc.id, website_data:websitesChange.doc.data()})
                        
                            let friend_id         = change.doc.id
                            let friend_website_id   = websitesChange.doc.id
                            let friend_website_data = websitesChange.doc.data()

                            let friend_profile  = _.find(friend_profiles, (fpv, fpk)=>{
                                return friend_id == fpk
                            })

                            if(friend_profile !== undefined){
                                let websites =_.find(friend_profile.websites,  function(fwv, fwk) { 
                                                return fwk == friend_website_id
                                            })

                                if(websites !== undefined){
                                    return;
                                }

                                // console.log('websites > added')
                                dispatch({ type: ADD_WEBSITE_FRIEND, friend_id, friend_website_id, friend_website_data})
                            }
                        }

                        if (websitesChange.type === 'modified') {

                        }

                        if (websitesChange.type === 'removed') {

                        }
                    })
                })

                // track friends > emails
                firebase.firestore().collection('profiles').doc(change.doc.id).collection('emails').onSnapshot((emailsSnapshot) => {
                    emailsSnapshot.docChanges.forEach(function(emailsChange) {
                        // console.log(emailsChange.type)

                        // console.log(change.doc.id, emailsChange.doc.id, emailsChange.doc.data())
                        if (emailsChange.type === 'added') {
                            let friend_id         = change.doc.id
                            let friend_email_id   = emailsChange.doc.id
                            let friend_email_data = emailsChange.doc.data()

                            let friend_profile  = _.find(friend_profiles, (fpv, fpk)=>{
                                return friend_id == fpk
                            })

                            if(friend_profile !== undefined){
                                let email =_.find(friend_profile.emails,  function(fwv, fwk) { 
                                                return fwk == friend_email_id
                                            })

                                if(email !== undefined){
                                    return;
                                }

                                console.log('emails > added')
                                dispatch({ type: ADD_EMAIL_FRIEND, friend_id, friend_email_id, friend_email_data})
                            }
                        }

                        if (emailsChange.type === 'modified') {

                        }

                        if (emailsChange.type === 'removed') {

                        }
                    })
                })


                // track friends > my_ids
                firebase.firestore().collection('profiles').doc(change.doc.id).collection('my_ids').onSnapshot((my_idsSnapshot) => {
                    my_idsSnapshot.docChanges.forEach(function(my_idsChange) {
                        // console.log(my_idsChange.type)

                        // console.log(change.doc.id, my_idsChange.doc.id, my_idsChange.doc.data())
                        if (my_idsChange.type === 'added') {
                            // friend_id:change.doc.id, data:change.doc.data()

                            let friend_id         = change.doc.id
                            let friend_my_id_id   = my_idsChange.doc.id
                            let friend_my_id_data = my_idsChange.doc.data()

                            let friend_profile  = _.find(friend_profiles, (fpv, fpk)=>{
                                return friend_id == fpk
                            })

                            if(friend_profile !== undefined){
                                let my_id =_.find(friend_profile.my_ids,  function(fwv, fwk) { 
                                                return fwk == friend_my_id_id
                                            })

                                if(my_id !== undefined){
                                    return;
                                }

                                console.log('my_ids > added', friend_id, friend_my_id_id, friend_my_id_data, friend_profile)
                                dispatch({ type: ADD_MY_ID_FRIEND, friend_id, friend_my_id_id, friend_my_id_data})
                            }
                        }

                        if (my_idsChange.type === 'modified') {

                        }

                        if (my_idsChange.type === 'removed') {

                        }
                    })
                })

                /*
                dispatch({ type: ADD_FRIEND, friend_id:change.doc.id, friend_data:change.doc.data() });

                // console.log('users>friends', change.doc.data())

                // จะ track ตลอด added, modified, remove 
                firebase.firestore().collection('profiles').doc(change.doc.id).onSnapshot((friendDocSnapshot) => {
                    // console.log(change.doc.id, friendDocSnapshot)
                    if (!friendDocSnapshot.exists) {
                        console.log('No such document!');
                    } else {
                        dispatch({ type: ADDED_FRIEND_PROFILE, friend_id:change.doc.id, friend_profile:friendDocSnapshot.data()});
                    }
                })

                // track friends > phones
                firebase.firestore().collection('profiles').doc(change.doc.id).collection('phones').onSnapshot((phonesSnapshot) => {
                    phonesSnapshot.docChanges.forEach(function(phonesChange) {
                        console.log(phonesChange.type)

                        console.log(change.doc.id, phonesChange.doc.id, phonesChange.doc.data())
                        if (phonesChange.type === 'added') {
                            // friend_id:change.doc.id, data:change.doc.data()

                            dispatch({ type: ADD_PHONE_FRIEND, friend_id:change.doc.id, phone_key:phonesChange.doc.id, phone_data:phonesChange.doc.data()})
                        }

                        if (phonesChange.type === 'modified') {

                        }

                        if (phonesChange.type === 'removed') {

                        }
                    })
                })
          
                // track friends > websites
                firebase.firestore().collection('profiles').doc(change.doc.id).collection('websites').onSnapshot((websitesSnapshot) => {
                    websitesSnapshot.docChanges.forEach(function(websitesChange) {
                        console.log(websitesChange.type)

                        console.log(change.doc.id, websitesChange.doc.id, websitesChange.doc.data())
                        if (websitesChange.type === 'added') {
                            // friend_id:change.doc.id, data:change.doc.data()


                            dispatch({ type: ADD_WEBSITE_FRIEND, friend_id:change.doc.id, website_key:websitesChange.doc.id, website_data:websitesChange.doc.data()})
                        }

                        if (websitesChange.type === 'modified') {

                        }

                        if (websitesChange.type === 'removed') {

                        }
                    })
                })

                // track friends > emails
                firebase.firestore().collection('profiles').doc(change.doc.id).collection('emails').onSnapshot((emailsSnapshot) => {
                    emailsSnapshot.docChanges.forEach(function(emailsChange) {
                        console.log(emailsChange.type)

                        console.log(change.doc.id, emailsChange.doc.id, emailsChange.doc.data())
                        if (emailsChange.type === 'added') {
                            // friend_id:change.doc.id, data:change.doc.data()

                            dispatch({ type: ADD_EMAIL_FRIEND, friend_id:change.doc.id, email_key:emailsChange.doc.id, email_data:emailsChange.doc.data()})
                        }

                        if (emailsChange.type === 'modified') {

                        }

                        if (emailsChange.type === 'removed') {

                        }
                    })
                })

                // track friends > my_ids
                firebase.firestore().collection('profiles').doc(change.doc.id).collection('my_ids').onSnapshot((my_idsSnapshot) => {
                    my_idsSnapshot.docChanges.forEach(function(my_idsChange) {
                        console.log(my_idsChange.type)

                        console.log(change.doc.id, my_idsChange.doc.id, my_idsChange.doc.data())
                        if (my_idsChange.type === 'added') {
                            // friend_id:change.doc.id, data:change.doc.data()
                        }

                        if (my_idsChange.type === 'modified') {

                        }

                        if (my_idsChange.type === 'removed') {

                        }
                    })
                })

                firebase.database().ref('user_presence/' + change.doc.id).on('child_added', function (snapshot) {
                    // console.log(change.doc.id, snapshot.key, snapshot.val())

                    dispatch({ type: ADDED_PRESENCE, userId:change.doc.id, presenceKey:snapshot.key, presenceData:snapshot.val()})
                });

                firebase.database().ref('user_presence/' + change.doc.id).on('child_changed', function (snapshot) {
                    // console.log(change.doc.id, snapshot.key, snapshot.val())

                    dispatch({ type: CHANGED_PRESENCE, userId:change.doc.id, presenceKey:snapshot.key, presenceData:snapshot.val()})
                });

                firebase.database().ref('user_presence/' + change.doc.id).on('child_removed', function (snapshot) {
                    // console.log(change.doc.id, snapshot.key, snapshot.val())

                    dispatch({ type: REMOVED_PRESENCE, userId:change.doc.id, presenceKey:snapshot.key})
                });
                */
            }
            if (change.type === 'modified') {
                dispatch({ type: MODIFIED_FRIEND, friend_id:change.doc.id, friend_data:change.doc.data() });
            }
        })
    })
}


/*
onSnapshotPhoneProfile = (uid, phone_key) =>{
    console.log('onSnapshotPhoneProfile', uid, phone_key)

    firebase.firestore().collection('profiles').doc(uid).collection('phones').doc(phone_key).onSnapshot((querySnapshot) => {
        console.log('onSnapshotPhoneProfile', querySnapshot)

        querySnapshot.docChanges.forEach(function(change) {
            console.log('onSnapshotPhoneProfile', change.type, change.doc.id, change.doc.data());
        })
    })
}
*/

// export const watchTaskGroupEvent = (uid) => dispatch =>{
//     console.log('watchTaskGroupEvent')
    
//     // track grouds
//     firebase.firestore().collection('users').doc(uid).collection('groups').onSnapshot((querySnapshot) => {
//         querySnapshot.docChanges.forEach(function(change) {
//             console.log(change.type, change.doc.id, change.doc.data());

//             switch(change.type){
//                 case 'added':{
//                     // dispatch({type: ADDED_MY_APPLICATION, my_application_id:change.doc.id, my_application_data:change.doc.data()})
                    
//                     // track group profile
//                     firebase.firestore().collection('groups').doc(change.doc.id).onSnapshot((docSnapshot) => {
//                         // console.log(docSnapshot.id) 
//                         // doc.id จะมีค่าเท่ากันกับ  docSnapshot.id 
        
//                         if(docSnapshot.data() !== undefined){
//                             // console.log(doc.id, " => ", doc.data());
        
//                             let newData = {...change.doc.data(), group_profile:docSnapshot.data()}
//                             console.log(newData)
//                             dispatch({ type: ADD_GROUP, group_id:docSnapshot.id, data:newData });
//                         }
//                     })

//                     // track group > members
//                     firebase.firestore().collection('groups').doc(change.doc.id).collection('members').onSnapshot((querySnapshot) => {
//                         querySnapshot.docChanges.forEach(function(members_change) {
//                             console.log(change.doc.id, members_change.type, members_change.doc.id, members_change.doc.data())
                            
//                             if (members_change.type === 'added') {
//                                 console.log('added: ', change.doc.id, members_change.doc.id, members_change.doc.data());

//                                 let group_id = change.doc.id
//                                 let member_key = members_change.doc.id
//                                 let data = members_change.doc.data()
//                                 // ADDED_GROUP_MEMBER

//                                 dispatch({ type: ADDED_GROUP_MEMBER, group_id, member_key, data});
//                             }
//                             if (members_change.type === 'modified') {
//                                 console.log('modified: ', change.doc.id, members_change.doc.id, members_change.doc.data());

//                                 let group_id = change.doc.id
//                                 let member_key = members_change.doc.id
//                                 let data = members_change.doc.data()
//                                 // MODIFIED_GROUP_MEMBER

//                                 dispatch({ type: MODIFIED_GROUP_MEMBER, group_id, member_key, data});
//                             }
//                             if (members_change.type === 'removed') {
//                                 console.log('removed: ', change.doc.id, members_change.doc.id, members_change.doc.data());

//                                 let group_id = change.doc.id
//                                 let item_id = members_change.doc.id
//                                 let data = members_change.doc.data()
//                                 // REMOVED_GROUP_MEMBER

//                                 dispatch({ type: REMOVED_GROUP_MEMBER, group_id, item_id});
//                             }
//                         })
//                     })
                    
//                     break;
//                 }
//                 case 'modified':{
//                     // dispatch({type: MODIFIED_MY_APPLICATION, my_application_id:change.doc.id, my_application_data:change.doc.data()})
                    
//                     // MODIFIED_GROUP
//                     dispatch({ type: MODIFIED_GROUP, group_id:change.doc.id, data:change.doc.data() });
//                     break;
//                 }
//                 case 'removed':{
//                     // dispatch({type: REMOVED_MY_APPLICATION, my_application_id:change.doc.id, my_application_data:change.doc.data()})
//                     dispatch({ type: DELETE_GROUP, group_id:change.doc.id});
//                     break;
//                 }
//             }
//         });
//     })
// }

// export const watchTaskClassEvent = (uid) => dispatch =>{
//     console.log('watchTaskClassEvent')
//     firebase.firestore().collection('users').doc(uid).collection('classs').onSnapshot((classsSnapshot) => {
//         classsSnapshot.docChanges.forEach(function(classsChange) {
//             console.log("Classs", classsChange.type, classsChange.doc.id, classsChange.doc.data());

//             switch(classsChange.type){
//                 case 'added':{
//                     // ADDED_CLASS class_id, class_data
//                     dispatch({type: ADDED_CLASS, class_id:classsChange.doc.id ,class_data:classsChange.doc.data() })

//                     firebase.firestore().collection('users').doc(uid).collection('classs').doc(classsChange.doc.id).collection('members').onSnapshot((classsMembersSnapshot) => {
//                         classsMembersSnapshot.docChanges.forEach(function(classsMembersChange) {
//                             console.log("Classs", classsChange.doc.data(), classsMembersChange.type, classsMembersChange.doc.id, classsMembersChange.doc.data());
//                             // console.log("CLASS_MEMBERS ", doc.id, " => ", doc.data());
//                             // SELECT_CLASS_MEMBERS
//                             // dispatch({type: CLASS_MEMBERS, parent_id:doc.id,class_members_id:pdoc.id, class_members_data:pdoc.data()})
                        
//                             switch(classsMembersChange.type){
//                                 case 'added':{
//                                     // ADDED_CLASS_MEMBER
//                                     dispatch({type: ADDED_CLASS_MEMBER, class_id:classsChange.doc.id, class_member_id:classsMembersChange.doc.id, class_member_data:classsMembersChange.doc.data() })
//                                     break;
//                                 }
//                                 case 'modified':{
//                                     // MODIFIED_CLASS_MEMBER
//                                     dispatch({type: MODIFIED_CLASS_MEMBER, class_id:classsChange.doc.id, class_member_id:classsMembersChange.doc.id, class_member_data:classsMembersChange.doc.data() })
//                                     break;
//                                 }
//                                 case 'removed':{
//                                     // REMOVED_CLASS_MEMBER
//                                     dispatch({type: REMOVED_CLASS_MEMBER, class_id:classsChange.doc.id, class_member_id:classsMembersChange.doc.id})
//                                     break;
//                                 }
//                             }
//                         })
//                     })
//                     break;
//                 }
//                 case 'modified':{
//                     // MODIFIED_CLASS
//                     // console.log("Classs", classsChange.type, classsChange.doc.id, classsChange.doc.data());
//                     dispatch({type: MODIFIED_CLASS, class_id:classsChange.doc.id ,class_data:classsChange.doc.data() })
                   
//                     break;
//                 }
//                 case 'removed':{
//                     // REMOVED_CLASS
//                     dispatch({type: REMOVED_CLASS, class_id:classsChange.doc.id})
//                     break;
//                 }
//             }
//         })

//     })
// }

// export const watchTaskMyApplicationEvent = (uid) => dispatch =>{
//     firebase.firestore().collection('users').doc(uid).collection('my_applications').onSnapshot((qSnapshot) => {
//         qSnapshot.docChanges.forEach(function(change) {
//             console.log(change.type, change.doc.id, change.doc.data());
//             switch(change.type){
//                 case 'added':{
//                     dispatch({type: ADDED_MY_APPLICATION, my_application_id:change.doc.id, my_application_data:change.doc.data()})
//                     break;
//                 }
//                 case 'modified':{
//                     dispatch({type: MODIFIED_MY_APPLICATION, my_application_id:change.doc.id, my_application_data:change.doc.data()})
//                     break;
//                 }
//                 case 'removed':{
//                     dispatch({type: REMOVED_MY_APPLICATION, my_application_id:change.doc.id, my_application_data:change.doc.data()})
//                     break;
//                 }
//             }
//         })
//     })
// }