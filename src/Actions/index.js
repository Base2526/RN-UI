// import firebase from 'firebase'

const FBSDK = require('react-native-fbsdk');
const { LoginButton, AccessToken, LoginManager } = FBSDK;

import {LOGIN_USER_SUCCESS,
        LOGIN_USER_FAIL} from './types'

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

        // console.log(data)
        if((data instanceof Array)){
            // error message
            // alert(data[0])
            dispatch({ type: LOGIN_USER_FAIL, provider: Constant.PROVIDERS.USER, error: data[0] });

            return {'status':false, 'message': data.message}
        }else{
            if(!data.result){
                // alert(data.message)
                dispatch({ type: LOGIN_USER_FAIL, provider: Constant.PROVIDERS.USER, error: data.message });
        
                return {'status':false, 'message': data.message}
            }else{
                // console.log(data.data.friend_profiles)
                // console.log(data.data.user)
                // console.log(data.data.user_profile)
                saveAsyncStorage(Constant.USER_LOGIN, {"provider": Constant.PROVIDERS.USER, "user": data.data});

                dispatch({ type: LOGIN_USER_SUCCESS, provider: Constant.PROVIDERS.USER, user: data.data });
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

                dispatch({ type: LOGIN_USER_FAIL, payload: error.message, provider: Constant.PROVIDERS.FACEBOOK });
            }
        );
    }
}

export const actionUserLogin = () => dispatch =>(
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

            dispatch({ type: LOGIN_USER_SUCCESS, provider: value.provider, user: value.user });
            return {'status':true, 'value': value}
        }else{
            return {'status':false, 'message': data.message}
        }
    }).catch((error)=>{
        return {'status':false, 'message': error}
    })
)

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