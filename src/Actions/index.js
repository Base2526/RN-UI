import {Platform} from 'react-native'
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
        FRIEND_PROFILE,
        UPDATE_STATUS_FRIEND,
        ADD_GROUP,
        DELETE_GROUP,
        UPDATE_GROUP_PICTURE_PROFILE,
        ADDED_GROUP_MEMBER,
        MODIFIED_GROUP_MEMBER,
        REMOVED_GROUP_MEMBER,
        FAVORITES_GROUP,
        MEMBER_JOIN_GROUP,
        MEMBER_DECLINE_GROUP,
        SELECT_ADD_CLASS,
        CLASS_MEMBERS,
        FRIEND_MUTE,
        FRIEND_HIDE,
        FRIEND_BLOCK,
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
        FRIEND_FAVORITE,} from './types'

import {randomKey} from '../Utils/Helpers'
import Constant from '../Utils/Constant'

import {login, 
        people_you_may_khow, 
        add_friend,
        create_group,
        create_class,
        application_category,
        create_my_application,
        update_picture_profile,
        update_picture_bg_profile,
        update_group_picture_profile} from '../Utils/Services'

export const actionApplicationCategory = () =>dispatch =>{
    return application_category().then(data=>{
        if(data.result){
            dispatch({ type: ADD_APPLICATION_CATEGORY, data_category: data.data});
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
                dispatch({ type: USER_LOGIN_SUCCESS, provider: Constant.PROVIDERS.USER, users: data.data.users });
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

export const actionLogout = (dispatch, callback) => {
    // console.log('actionLogout')

    // firebase.database().ref('idna/user/1').off()
    unsubscribe();

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

export const actionPeopleYouMayKhow = () => dispatch=>{

    return people_you_may_khow().then(data => {
        // this.setState({isShowSpinner:false})

        // dispatch({ type: LOADING, isLoading:false})

        // console.log(data)
        if((data instanceof Array)){
            // error message
            // alert(data[0])
            // dispatch({ type: LOGIN_USER_FAIL, provider: Constant.PROVIDERS.USER, error: data[0] });

            return {'status':false, 'message': data.message}
        }else{
            if(!data.result){
                // alert(data.message)
                // dispatch({ type: LOGIN_USER_FAIL, provider: Constant.PROVIDERS.USER, error: data.message });
        
                return {'status':false, 'message': data.message}
            }else{
                // console.log(data.data.friend_profiles)
                // console.log(data.data.user)
                // console.log(data.data.user_profile)
                // saveAsyncStorage(Constant.USER_LOGIN, {"provider": Constant.PROVIDERS.USER, "user": data.data});

                // dispatch({ type: LOGIN_USER_SUCCESS, provider: Constant.PROVIDERS.USER, user: data.data });
                return {'status':true, 'data':data}
            }
        }
    })
}

export const actionAddFriend = (uid, friend_id) => dispatch =>{

    return add_friend(uid, friend_id).then(data => {
        // this.setState({isShowSpinner:false})

        // dispatch({ type: LOADING, isLoading:false})

        // console.log(data)
        if((data instanceof Array)){
            // error message
            // alert(data[0])
            // dispatch({ type: LOGIN_USER_FAIL, provider: Constant.PROVIDERS.USER, error: data[0] });

            return {'status':false, 'message': data.message}
        }else{
            if(!data.result){
                // alert(data.message)
                // dispatch({ type: LOGIN_USER_FAIL, provider: Constant.PROVIDERS.USER, error: data.message });
        
                return {'status':false, 'message': data.message}
            }else{
                // console.log(data.data.friend_profiles)
                // console.log(data.data.user)
                // console.log(data.data.user_profile)
                // saveAsyncStorage(Constant.USER_LOGIN, {"provider": Constant.PROVIDERS.USER, "user": data.data});
                // dispatch({ type: LOGIN_USER_SUCCESS, provider: Constant.PROVIDERS.USER, user: data.data });
                return {'status':true, 'data':data}
            }
        }
    })
}

// create_group
export const actionCreateGroup = (uid, group_name, members, uri) => dispatch =>{
    return create_group(uid, group_name, members, uri).then(data => {
        if((data instanceof Array)){
            return {'status':false, 'message': data}
        }else{
            if(!data.result){
                return {'status':false, 'message': data}
            }else{


                console.log(data)

                // dispatch({ type: ADD_GROUP, group_id:docSnapshot.id, data:v });

                return {'status':true, 'data':data}
            }
        }
    })
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

    console.log(uid, group_id, favorite_status)
    // dispatch({ type: INTERESTE_IN_PROFILE, interestein_key, interestein_id, interestein_status});
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
export const actionMemberJoinGroup = (uid, group_id, member_item_id, callback) => dispatch => {
    firebase.firestore().collection('users').doc(uid).collection('groups').doc(group_id).set({
        status: Constant.GROUP_STATUS_MEMBER_JOINED,
    }, { merge: true});

    firebase.firestore().collection('groups').doc(group_id).collection('members').doc(member_item_id).set({
        status: Constant.GROUP_STATUS_MEMBER_JOINED,
    }, { merge: true});

    dispatch({ type: MEMBER_JOIN_GROUP, group_id, member_item_id})
    callback({'status':true})
}

// Decline Group
/*
การปฎิเสจคำขอให้เข้ากลุ่มสนทนา
* ขั้นตอนการทำงาน
    - ลบกลุ่มออกจาก  users/{user_id}/groups/{group_id} และ remove group redux local
    - update status == GROUP_STATUS_MEMBER_DECLINE groups/{group_id}/members/{item_id}/status = GROUP_STATUS_MEMBER_DECLINE
*/
export const actionMemberDeclineGroup = (uid, group_id, member_item_id, callback) => dispatch => {
    firebase.firestore().collection('users').doc(uid).collection('groups').doc(group_id).delete()
    firebase.firestore().collection('groups').doc(group_id).collection('members').doc(member_item_id).set({
        status: Constant.GROUP_STATUS_MEMBER_DECLINE,
    }, { merge: true});

    dispatch({ type: MEMBER_DECLINE_GROUP, group_id, member_item_id});
    callback({'status':true})
}

export const actionDeleteGroup = (uid, group_id, callback) => dispatch =>{
    firebase.firestore().collection('groups').doc(group_id).delete()
    dispatch({ type: DELETE_GROUP, group_id});
    callback({'status':true})
}

export const actionCreateClass = (uid, class_name, uri) => dispatch =>{
    return create_class(uid, class_name, uri).then(data => {
        if((data instanceof Array)){
            return {'status':false, 'message': data}
        }else{
            if(!data.result){
                return {'status':false, 'message': data}
            }else{
                return {'status':true, 'data':data}
            }
        }
    })
}

export const actionUpdateStatusFriend = (uid, friend_id, status, callback) => dispatch=>{
    // console.log('-------------- actionAcceptFriend()')
    // update status เพือ่นของเรา
    firebase.firestore().collection('users').doc(uid).collection('friends').doc(friend_id).update({status})

    // update status เราของเพือน
    firebase.firestore().collection('users').doc(friend_id).collection('friends').doc(uid).update({status})

    // status
    dispatch({ type: UPDATE_STATUS_FRIEND, friend_id, status});

    callback({'status':true, 's' : status})
}

// key, this.props.uid, friend.friend_id
export const actionSelectClass = (class_id, uid, friend_id, callback) => dispatch=> {

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
}

// Change friend's name
export const actionChangeFriendsName = (uid, friend_id, name, callback) => dispatch=> {
    firebase.firestore().collection('users').doc(uid).collection('friends').doc(friend_id).set({
        change_friend_name: name,
    }, { merge: true});

    callback({'status':true, uid, friend_id, name})
}

// friend hide
export const actionFriendHide = (uid, friend_id, callback) => dispatch=> {
    var hideRef =  firebase.firestore().collection('users').doc(uid).collection('friends').doc(friend_id);

    firebase.firestore().runTransaction(t => {
        return t.get(hideRef)
        .then(doc => {
            if(doc.data().hide === undefined){
                t.set(hideRef, {
                    hide: true,
                }, { merge: true});
            }else{
                t.update(hideRef, {hide: !doc.data().hide});
            }
        });
    }).then(result => {
        console.log('Transaction success!');
    }).catch(err => {
        console.log('Transaction failure:', err);
    });

    dispatch({ type: FRIEND_HIDE, friend_id});
    callback({'status':true})
}

// friend block
export const actionFriendBlock = (uid, friend_id, callback) => dispatch=> {
    var blockRef =  firebase.firestore().collection('users').doc(uid).collection('friends').doc(friend_id);

    firebase.firestore().runTransaction(t => {
        return t.get(blockRef)
        .then(doc => {
            if(doc.data().block === undefined){
                t.set(blockRef, {
                    block: true,
                }, { merge: true});
            }else{
                t.update(blockRef, {block: !doc.data().block});
            }
        });
    }).then(result => {
        console.log('Transaction success!');
    }).catch(err => {
        console.log('Transaction failure:', err);
    });

    dispatch({ type: FRIEND_BLOCK, friend_id});
    callback({'status':true})
}

// friend mute/unmute
export const actionFriendMute = (uid, friend_id, mute, callback) => dispatch=> {
    dispatch({ type: FRIEND_MUTE, friend_id, mute});
    firebase.firestore().collection('users').doc(uid).collection('friends').doc(friend_id).set({
        mute,
    }, { merge: true});

    callback({'status':true})
}

// FRIEND_FAVORITE
export const actionFriendFavirite = (uid, friend_id, favorite_status, callback) => dispatch=> {
    dispatch({ type: FRIEND_FAVORITE, friend_id, favorite_status});
    firebase.firestore().collection('users').doc(uid).collection('friends').doc(friend_id).set({
        is_favorite: favorite_status,
    }, { merge: true});
    callback({'status':true, uid, friend_id, favorite_status})
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
                return {'status':false, 'message': data}
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
                return {'status':false, 'message': data}
            }else{
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
    firebase.firestore().collection('profiles').doc(uid).set({
        gender:gender_id,
    }, { merge: true});

    dispatch({ type: GENDER_PROFILE, gender:gender_id});

    callback({'status':true})
}

// InteresteIn
export const actionInteresteInProfile = (uid, intereste_in, callback) => dispatch =>{

    dispatch({ type: INTERESTE_IN_PROFILE, intereste_in});

    firebase.firestore().collection('profiles').doc(uid).set({
        intereste_in
    }, { merge: true});

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

            dispatch({ type: ADD_PHONE_PROFILE, phone_key:key, phone_number, is_verify:false});
            callback({'status':true})
        }else{

            callback({'status':false, 'message':'Duplicate phone number'})
        }
    })
}

export const actionEditPhoneProfile = (uid, phone_key ,phone_number, callback) => dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).collection('phones').where("phone_number", "==", phone_number).get().then(snapshot => {
        if(snapshot.size == 0){
            firebase.firestore().collection('profiles').doc(uid).collection('phones').doc(phone_key).set({
                phone_number,
            }, { merge: true});
        
            dispatch({ type: EDIT_PHONE_PROFILE, phone_key, phone_number});

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

            dispatch({ type: ADD_EMAIL_PROFILE, email_key:key, email});
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
        
            dispatch({ type: EDIT_EMAIL_PROFILE, email_key, email});

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
export const actionAddMyIDProfile = (uid, id, callback) => dispatch =>{
    let key = randomKey()
    // firebase.firestore().collection('profiles').doc(uid).collection('my_ids').where("id", "==", id).get().then(snapshot => {
    //     console.log(snapshot.size)
    //     if(snapshot.size == 0){
    //         firebase.firestore().collection('profiles').doc(uid).collection('my_ids').doc(key).set({
    //             id,
    //             enable:false
    //         }, { merge: true})

    //         dispatch({ type: ADD_MY_ID_PROFILE, my_id_key:key, id});
    //         // callback({'status':true})
    //     }else{
    //         // callback({'status':false, 'message':'Duplicate id.'})
    //     }
    // })

    firebase.firestore().collection('profiles').doc(uid).collection('my_ids').doc(key).set({
        id,
        enable:false
    }, { merge: true})

    dispatch({ type: ADD_MY_ID_PROFILE, my_id_key:key, id});
    callback({'status':true})
}

export const actionRemoveMyIDProfile = (uid, key, callback) => dispatch =>{
    firebase.firestore().collection('profiles').doc(uid).collection('my_ids').doc(id).delete()
    dispatch({ type: REMOVE_MY_ID_PROFILE, my_id_key:key});
    callback({'status':true})
}

export const actionSelectMyIDProfile = (uid, id, callback) => dispatch =>{
    
    if(id == 0){
        dispatch({ type: EDIT_MY_ID_PROFILE, my_id_key:0});
    }

    // dispatch({ type: EDIT_MY_ID_PROFILE, my_id_key:id});
    firebase.firestore().collection('profiles').doc(uid).collection('my_ids').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            if(doc.id == id){
                firebase.firestore().collection('profiles').doc(uid).collection('my_ids').doc(doc.id).set({
                    enable:true
                }, { merge: true})
            }else{
                firebase.firestore().collection('profiles').doc(uid).collection('my_ids').doc(doc.id).set({
                    enable:false
                }, { merge: true})
            }
        });
    })
    callback({'status':true})
}


let unsubscribe = null;

export function watchTaskEvent(uid, dispatch) {
    console.log('-------------- watchTaskEvent()')
    
    // track profile
    unsubscribe = firebase.firestore().collection('profiles').doc(uid).onSnapshot((docSnapshot) => {
        if(docSnapshot.data() === undefined){
            actionLogout(dispatch, ()=>{
                // console.log(this)                
                this.navigation.navigate("AuthLoading")
            })
        }
        dispatch({ type: UPDATE_PROFILE, data:docSnapshot.data()});
    }, (error) => {
        //...
        console.log(error)
    })

    // track profile > intereste_in
    firebase.firestore().collection('profiles').doc(uid).collection('intereste_in').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges.forEach(function(change) {

            let doc_id   = change.doc.id
            let doc_data = change.doc.data()
            if (change.type === 'added') {  
                dispatch({ type: INTERESTE_IN_PROFILE, interestein_key:doc_id, interestein_id:doc_data.id, interestein_status:doc_data.enable});
            }
            if (change.type === 'modified') {
                dispatch({ type: INTERESTE_IN_PROFILE, interestein_key:doc_id, interestein_id:doc_data.id, interestein_status:doc_data.enable});
            }

            if (change.type === 'removed') {
                
            }
        })
    })

    // track profile > phones
    firebase.firestore().collection('profiles').doc(uid).collection('phones').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges.forEach(function(change) {

            let doc_id   = change.doc.id
            let doc_data = change.doc.data()
            if (change.type === 'added') {  
                // console.log(change.type, doc_id, doc_data)
                
                dispatch({ type: ADD_PHONE_PROFILE, phone_key:doc_id, phone_number:doc_data.phone_number, is_verify:doc_data.is_verify});
            }
            if (change.type === 'modified') {
                // console.log(change.type, doc_id, doc_data)
               
                dispatch({ type: EDIT_PHONE_PROFILE, phone_key:doc_id, phone_number:doc_data.phone_number});
            }

            if (change.type === 'removed') {
                dispatch({ type: REMOVE_PHONE_PROFILE, phone_key:doc_id});
            }
        })
    })

    // track profile > websites
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

    // track profile > emails
    firebase.firestore().collection('profiles').doc(uid).collection('emails').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges.forEach(function(change) {

            let doc_id   = change.doc.id
            let doc_data = change.doc.data()

            if (change.type === 'added') {  
                // console.log(change.type, doc_id, doc_data)
                
                dispatch({ type: ADD_EMAIL_PROFILE, email_key:doc_id, email:doc_data.email});
            }
            if (change.type === 'modified') {
                // console.log(change.type, doc_id, doc_data)
            
                dispatch({ type: EDIT_EMAIL_PROFILE, email_key:doc_id, email:doc_data.email});
            }

            if (change.type === 'removed') {
                dispatch({ type: REMOVE_EMAIL_PROFILE, email_key:doc_id});
            }
        })
    })

    // track profile > my_ids
    firebase.firestore().collection('profiles').doc(uid).collection('my_ids').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges.forEach(function(change) {

            let doc_id   = change.doc.id
            let doc_data = change.doc.data()

            if (change.type === 'added') {  
                console.log(change.type, doc_id, doc_data)

                dispatch({ type: ADD_MY_ID_PROFILE, my_id_key:doc_id, my_id_data:doc_data});
            }
            if (change.type === 'modified') {
                console.log(change.type, doc_id, doc_data)
            
                dispatch({ type: EDIT_MY_ID_PROFILE, my_id_key:doc_id, my_id_data:doc_data});
            }

            if (change.type === 'removed') {
                // dispatch({ type: REMOVE_EMAIL_PROFILE, email_key:doc_id});
            }
        })
    })
    

    // track friends
    firebase.firestore().collection('users').doc(uid).collection('friends').onSnapshot((querySnapshot) => {
        // console.log(querySnapshot)

        querySnapshot.docChanges.forEach(function(change) {
            // console.log(change.type)
            if (change.type === 'added') {

                firebase.firestore().collection('profiles').doc(change.doc.id).onSnapshot((friendDocSnapshot) => {
                    
                    if (!friendDocSnapshot.exists) {
                        console.log('No such document!');
                    } else {
                        dispatch({ type: ADD_FRIEND, friend_id:change.doc.id, data:change.doc.data(), profile:friendDocSnapshot.data()});
                    }
                })
            }
            if (change.type === 'modified') {
                dispatch({ type: MODIFIED_FRIEND, friend_id:change.doc.id, data:change.doc.data() });
            }
        })
    })

    // track device access
    firebase.firestore().collection('users').doc(uid).collection('device_access').onSnapshot((querySnapshot) => {

        let _this = this
        querySnapshot.forEach(function(doc) {
            let id = doc.id
            let data = doc.data()

            //  check ว่ามีการ force logout จากระบบหรือไม่
            if(data.udid === DeviceInfo.getUniqueID() && data.is_login == 0){
                actionLogout(dispatch, ()=>{
                    // console.log(this)                
                    _this.navigation.navigate("AuthLoading")
                })
            }

            dispatch({ type: DEVICE_ACCESS_ADDED, id, data});
        });
    })

    // track grouds
    firebase.firestore().collection('users').doc(uid).collection('groups').onSnapshot((querySnapshot) => {

        let _this = this
        querySnapshot.forEach(function(doc) {
            // console.log(doc.id, " => ", doc.data());

            // let id = doc.id
            // let data = doc.data()

            firebase.firestore().collection('groups').doc(doc.id).onSnapshot((docSnapshot) => {
                // console.log(docSnapshot.id) 
                // doc.id จะมีค่าเท่ากันกับ  docSnapshot.id 

                if(docSnapshot.data() !== undefined){
                    // console.log(doc.id, " => ", doc.data());

                    let v = {...doc.data(), group_profile:docSnapshot.data()}
                    console.log(v)
                    dispatch({ type: ADD_GROUP, group_id:docSnapshot.id, data:v });
                }else{

                    /** จะมีบั๊ก ไม่รู้ว่าตอนไหนจะมีการ insert object ลงไปเราต้องลบออก ค่อยมาไล่เช็ดทีหลัง */
                    dispatch({ type: DELETE_GROUP, group_id:docSnapshot.id});
                }
            })

            firebase.firestore().collection('groups').doc(doc.id).collection('members').onSnapshot((querySnapshot) => {
                querySnapshot.docChanges.forEach(function(change) {
                    console.log(doc.id, change.doc.id)
                    
                    if (change.type === 'added') {
                        console.log('added: ', doc.id, change.doc.id, change.doc.data());

                        let group_id = doc.id
                        let item_id = change.doc.id
                        let data = change.doc.data()
                        // ADDED_GROUP_MEMBER

                        dispatch({ type: ADDED_GROUP_MEMBER, group_id, item_id, data});
                    }
                    if (change.type === 'modified') {
                        console.log('modified: ', doc.id, change.doc.id, change.doc.data());

                        let group_id = doc.id
                        let item_id = change.doc.id
                        let data = change.doc.data()
                        // MODIFIED_GROUP_MEMBER

                        dispatch({ type: MODIFIED_GROUP_MEMBER, group_id, item_id, data});
                    }
                    if (change.type === 'removed') {
                        console.log('removed: ', doc.id, change.doc.id, change.doc.data());

                        let group_id = doc.id
                        let item_id = change.doc.id
                        let data = change.doc.data()
                        // REMOVED_GROUP_MEMBER

                        dispatch({ type: REMOVED_GROUP_MEMBER, group_id, item_id});
                    }
                })
            })
        })
    })
    
    // track classs
    firebase.firestore().collection('users').doc(uid).collection('classs').onSnapshot((qSnapshot) => {

        let _this = this
        qSnapshot.forEach(function(doc) {
            // console.log("SELECT_ADD_CLASS ", doc.id, " => ", doc.data());

            dispatch({type: SELECT_ADD_CLASS, class_id:doc.id, class_data:doc.data()})

            firebase.firestore().collection('users').doc(uid).collection('classs').doc(doc.id).collection('members').onSnapshot((querySnapshot) => {
            
                // console.log(doc.id)
                querySnapshot.forEach(function(pdoc) {
                    // console.log("CLASS_MEMBERS ", doc.id, " => ", doc.data());

                    // SELECT_CLASS_MEMBERS
                    dispatch({type: CLASS_MEMBERS, parent_id:doc.id,class_members_id:pdoc.id, class_members_data:pdoc.data()})
                })
            })
        })
    })

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
                            'model_number': DeviceInfo.getModel(),
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
                    'model_number': DeviceInfo.getModel(),
                    'status':'online'
                });

                oldRealTimeDb.ref("user_presence/" + uid + "/"+ Object.keys(snapshot.val())[0] +"/")
                    .onDisconnect() // Set up the disconnect hook
                    .set({
                        'platform': Platform.OS,
                        'udid': DeviceInfo.getUniqueID(),
                        'bundle_identifier': DeviceInfo.getBundleId(),
                        'model_number': DeviceInfo.getModel(),
                        'status':'offline'
                    });
            } 
        });     
    });
}