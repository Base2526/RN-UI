// import firebase from 'firebase'
import firebase from 'react-native-firebase';
const FBSDK = require('react-native-fbsdk');
const { LoginButton, AccessToken, LoginManager } = FBSDK;

import DeviceInfo from 'react-native-device-info';
var _ = require('lodash');

import {USER_LOGIN_SUCCESS,
        USER_LOGIN_FAIL,
        USER_LOGOUT,
        DEVICE_ACCESS_ADDED,
        DEVICE_ACCESS_MODIFIED} from './types'

import {saveAsyncStorage, loadAsyncStorage} from '../Utils/Helpers'
import Constant from '../Utils/Constant'

import {login, 
        people_you_may_khow, 
        add_friend,
        create_group,
        create_class} from '../Utils/Services'

// export const emailChanged = (text) =>{
//     return({
//         type: "EMAIL_CHANGED",
//         payload: text
//     })
// }

// export const passwordChanged = (text) =>{
//     return({
//         type:"PASSWORD_CHANGED",
//         payload:text
//     })
// }

export const actionLogin = ({email, password}) => dispatch => {
    // firebase.auth().signInWithEmailAndPassword(email, password)
    //   .then((user) => {
    //     // console.log(user)
    //     dispatch({ type: LOGIN_USER_SUCCESS, payload: user });
    //   })
    //   .catch((error)=>{
    //     // console.log(error)
    //     dispatch({ type: LOGIN_USER_FAIL, payload: error.message });
    //   });

    // console.log('action_login : ' + email +", "+password)


    // dispatch({ type: LOADING, isLoading:true})

    return login(email, password).then(data => {
        // this.setState({isShowSpinner:false})

        // dispatch({ type: LOADING, isLoading:false})

        console.log(data)
        if((data instanceof Array)){
            // error message
            // alert(data[0])
            dispatch({ type: USER_LOGIN_FAIL, provider: Constant.PROVIDERS.USER, error: data[0] });

            return {'status':false, 'error_message': data[0]}
        }else{
            if(!data.result){
                // alert(data.message)
                dispatch({ type: USER_LOGIN_FAIL, provider: Constant.PROVIDERS.USER, error: data.message });
        
                return {'status':false, 'error_message': data.message}
            }else{
                // console.log(data.data.friend_profiles)
                // console.log(data.data.user)
                // console.log(data.data.user_profile)
                // saveAsyncStorage(Constant.USER_LOGIN, {"provider": Constant.PROVIDERS.USER, "user": data.data});

                // console.log(data.data.users)

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

                
                // if (result.isCancelled) {
                //     console.log("Login cancelled");
                // } else {
                //     // this.setState({
                //     //   loading:true
                //     // })
                //     saveAsyncStorage(Constant.USER_LOGIN, {"provider": Constant.PROVIDERS.FACEBOOK}).then((data)=>{
                //         if(data.status){
                //           // let {navigator} = _this
                //           _this.navigation.navigate("Main")
    
                //         }
                //     }).catch((error)=>{
                //         console.log(error)
                //     })
                // }

                if(result.isCancelled){
                    console.log("login with fb : 0")
                }else{
                    console.log("login with fb : 1")
                    console.log(result)
                    // save data to local
                    // saveAsyncStorage(Constant.USER_LOGIN, {"data":result, "provider": Constant.PROVIDERS.FACEBOOK}).then((data)=>{
                    //     // if(data.status){
                    //     //   // let {navigator} = _this
                    //     //   _this.navigation.navigate("Main")
    
                    //     // }
                    //     dispatch({ type: LOGIN_USER_SUCCESS, payload: result, provider: Constant.PROVIDERS.FACEBOOK });
                    // }).catch((error)=>{
                    //     console.log(error)
                    // })
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

    // (uid, group_name, members, uri)
    return create_group(uid, group_name, members, uri).then(data => {
        // this.setState({isShowSpinner:false})

        // dispatch({ type: LOADING, isLoading:false})

        // console.log(data)
        if((data instanceof Array)){
            // error message
            // alert(data[0])
            // dispatch({ type: LOGIN_USER_FAIL, provider: Constant.PROVIDERS.USER, error: data[0] });

            return {'status':false, 'message': data}
        }else{
            if(!data.result){
                // alert(data.message)
                // dispatch({ type: LOGIN_USER_FAIL, provider: Constant.PROVIDERS.USER, error: data.message });
        
                return {'status':false, 'message': data}
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

export const actionCreateClass = (uid, class_name, uri) => dispatch =>{

    // (uid, group_name, members, uri)
    return create_class(uid, class_name, uri).then(data => {
        // this.setState({isShowSpinner:false})

        // dispatch({ type: LOADING, isLoading:false})

        // console.log(data)
        if((data instanceof Array)){
            // error message
            // alert(data[0])
            // dispatch({ type: LOGIN_USER_FAIL, provider: Constant.PROVIDERS.USER, error: data[0] });

            return {'status':false, 'message': data}
        }else{
            if(!data.result){
                // alert(data.message)
                // dispatch({ type: LOGIN_USER_FAIL, provider: Constant.PROVIDERS.USER, error: data.message });
        
                return {'status':false, 'message': data}
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

// export const watchTaskEvent = () => {
//     console.log('-------------- watchTaskEvent()')
//     firebase.database().ref('idna/user/1').on('value', (snap) => {
//         // dispatch(addTask(snap.val()));

//         // console.log('value')
//         console.log(snap.val())
//     });

    

//     // value' event
// }

let unsubscribe = null;

export function watchTaskEvent(uid, dispatch) {
    console.log('-------------- watchTaskEvent()')
    
    /*
    firebase.database().ref('idna/user/' + uid).once('value', (snap) => {
        // dispatch(addTask(snap.val()));

        // console.log('value')
        console.log(snap.val())
    });

    firebase.database().ref('idna/user/' + uid).on('child_changed', (snap) => {
        //   dispatch(addTask(snap.val()));

        console.log(snap.val())
    });

    // line_id
    firebase.database().ref('idna/user/' + uid + '/profiles/line_id').on('child_added', (snap) => {
        //   dispatch(addTask(snap.val()));

        console.log(snap.val())
    });

    firebase.database().ref('idna/user/' + uid + '/profiles/line_id').on('child_changed', (snap) => {
        //   dispatch(addTask(snap.val()));

        console.log(snap.val())
    });
    */


    // firebase.firestore().collection('users').doc(uid).collection('test001').where("uid", '==', '1234').onSnapshot((querySnapshot) => {

    //     querySnapshot.docChanges.forEach(function(change) {
    //         console.log(change)
    //     })
    // })

    // Set the specific user's online status to true
    firebase.firestore().collection('user').doc(uid)
        .set({
        online: true,
        }, { merge: true});

    console.log(firebase.database())

    // track profile
    unsubscribe = firebase.firestore().collection('profiles').doc(uid).onSnapshot((docSnapshot) => {
        console.log(docSnapshot.data());

        if(docSnapshot.data() === undefined){
            actionLogout(dispatch, ()=>{
                // console.log(this)                
                this.navigation.navigate("AuthLoading")
            })
        }


    //    querySnapshot.documentChanges.forEach((change) => {
    //     // Do something with change
    //   });

        // console.log(querySnapshot.metadata)

    //    querySnapshot.forEach((doc) => {
    //     console.log(doc)
    //    })

        // Object.keys(querySnapshot).map(function(key) {
        //     // return <option value={key}>{tifs[key]}</option>
        //     console.log(querySnapshot[key].doc())
        // });

        // const items = querySnapshot.docs.map(doc => ({ 
        //     id: doc.id,
        //     fromCache: doc.metadata.fromCache,
        //     hasPendingWrites: doc.metadata.hasPendingWrites,
        //     title: doc.data().title,
        // }));

        // console.log(items)

        // const numChanged = querySnapshot.docChanges;
        
        // // let docs = querySnapshot;
        // console.log(numChanged)

        // let docs = querySnapshot.docs;
        // let size = querySnapshot.size;

        // console.log(docs.length)
        // console.log(size)

        /*
            แสดงว่า user uid นี้โดนลบออกจากระบบแล้ว โดยมีการ login ค้างไว้
        */
        // if(querySnapshot.docs.length === 0) {
        //     actionLogout(dispatch, ()=>{
        //         // console.log(this)                
        //         this.navigation.navigate("AuthLoading")
        //     })
        //     // return;
        // }

        /*
        querySnapshot.docChanges.forEach(function(change) {
            // if (change.type === "removed") {
            //     console.log("Removed city: ", change.doc.data());
            // }
            console.log(change.type)

            // console.log("#--- " , change.type);
            if (change.type === "added") {
                // console.log("added");
            }else if (change.type === "modified") {
                // console.log("modified");
            }else if (change.type === "removed") {
                // console.log("removed");

                firebase.firestore().collection('users').doc(change.doc.data().uid).delete();
            }

            console.log(change.doc.data());
        });
        */
    }, (error) => {
        //...
        console.log(error)
    })

    // track device access
    firebase.firestore().collection('users').doc(uid).collection('device_access').onSnapshot((querySnapshot) => {
        console.log(querySnapshot)

        let _this = this
        querySnapshot.forEach(function(doc) {
            // console.log(doc.id, " => ", doc.data());

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

        // querySnapshot.docChanges.forEach(function(change) {
        //     console.log(change.id)
        //     console.log(change._document._ref._documentPath._parts)
        // })

        // snapshot.ref.parent.parent.key
        /*
        let _this = this
        querySnapshot.docChanges.forEach(function(change) {
            let data = change.doc.data()

            console.log(data)
            console.log(change.type)

            //     if(_v.udid === DeviceInfo.getUniqueID()){
            console.log(DeviceInfo.getUniqueID())

            // device
            if (change.type === "added") {
                dispatch({ type: DEVICE_ACCESS_ADDED, device:data});
            }else if(change.type === "modified"){

                dispatch({ type: DEVICE_ACCESS_MODIFIED, device:data});
                
                //  check ว่ามีการ force logout จากระบบหรือไม่
                if(data.udid === DeviceInfo.getUniqueID() && data.is_login == 0){
                    actionLogout(dispatch, ()=>{
                        // console.log(this)                
                        _this.navigation.navigate("AuthLoading")
                    })
                }
            }
        })
        */
    })
    /*
    firebase.firestore().collection('users').doc(uid).collection('device_access').where('udid', '==', DeviceInfo.getUniqueID()).onSnapshot((querySnapshot) => {
        // console.log(querySnapshot);

        let _this = this
        querySnapshot.docChanges.forEach(function(change) {
            // if (change.type === "removed") {
            //     console.log("Removed city: ", change.doc.data());
            // }
            // console.log(change.type)
            // console.log(change.doc.data());

            let data = change.doc.data()
            console.log(data)
            // console.log(_this)

            if (change.type === "added" || change.type === "modified") {
                //  check ว่ามีการ force logout จากระบบหรือไม่
                if(data.is_login == 0){
                    actionLogout(dispatch, ()=>{
                        // console.log(this)                
                        _this.navigation.navigate("AuthLoading")
                    })
                }
            }else if (change.type === "removed") {
                // console.log("removed");

                let uid = _this.auth.users.user.uid
                let device_access = _this.auth.users.device_access

                Object.keys(device_access).map((key, index) => {
                    firebase.firestore().collection('users').doc(uid).collection('device_access').doc(key).delete();
                    return;
                })
                
                // firebase.firestore().collection('users').doc(change.doc.data().uid).delete();
            }            
        });
    })
    */
}

// Firestore unsubscribe to updates
// export const unsubscribe = () => {
//     unsubscribe()
// }

/*
export const watchTaskChangedEvent = () => (dispatch) => {
    firebase.database().ref('/items').on('child_changed', (snap) => {
        // dispatch(addTask(snap.val()));

        console.log('child_changed')
        console.log(snap)
    });
}

export const watchTaskRemovedEvent = () => (dispatch) => {
    firebase.database().ref('/items').on('child_removed', (snap) => {
        // dispatch(addTask(snap.val()));

        console.log('child_removed')
        console.log(snap)
    });
}
*/