import { FOREGROUND, BACKGROUND, INACTIVE } from 'redux-enhancer-react-native-appstate';

import {USER_LOGIN_SUCCESS,
        USER_LOGIN_FAIL,
        USER_LOGOUT}  from '../Actions/types'

const INITIAL_STATE = {user:null,
                       provider:'',
                       isLogin: false,
                       }

export default (state= INITIAL_STATE, action)=>{
    // console.log(action)
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
        
        default:
            return state
    }
}