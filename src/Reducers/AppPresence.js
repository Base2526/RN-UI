var _ = require('lodash');

import {ADDED_PRESENCE,
        CHANGED_PRESENCE,
        REMOVED_PRESENCE,
        USER_LOGOUT}  from '../actions/types'

const INITIAL_STATE = {user_presences:null}

import Constant from '../utils/Constant'
import {isEmpty} from '../utils/Helpers'
export default (state= INITIAL_STATE, action)=>{
    // console.log(action)

    switch(action.type){
        case 'persist/REHYDRATE':{
            if(!action.hasOwnProperty('payload')){
                return INITIAL_STATE
            }

            if(action.payload === undefined){
                return INITIAL_STATE
            }

            // if(!action.payload.hasOwnProperty('auth')){
            //     return INITIAL_STATE
            // }

            state = {...state, 
                    user_presences: action.payload.presence.user_presences,}

            // console.log(state, action)
            return state
        }

        case USER_LOGOUT: {
            console.log('USER_LOGOUT')
            return INITIAL_STATE
        }
    
        case ADDED_PRESENCE:{
            if( isEmpty(action.userId) || 
                isEmpty(action.presenceKey) || 
                isEmpty(action.presenceData)){
                return state
            }

            let user_presences = state.user_presences
            // console.log(user_presences)

            let userId      = action.userId;
            let presenceKey = action.presenceKey;
            let presenceData = action.presenceData;

            // console.log('added_presence', action)
            let user_presence = _.find(user_presences, (v, k)=>{
                                return k == userId
                            })

            console.log('user_presence', action, user_presence)
            if(!user_presence){
                user_presences = {...user_presences, [userId]:{[presenceKey]:presenceData}}
                
                console.log('user_presence', action, user_presence)
                return {...state, user_presences}
            }else{
                let presense =  _.find(user_presence, (v, k)=>{
                                    return k == presenceKey
                                })

                if(!presense){
                    presense = {[presenceKey]:presenceData}
                    user_presence = {...user_presence, ...presense}
                    let new_state = {...state, 
                                    user_presences:{
                                        ...state.user_presences,
                                        [userId]:user_presence
                                    }
                                }
                    console.log('user_presence', state, new_state)
                    return new_state
                }else{
                    if(!_.isEqual(presense, presenceData)){
                        user_presence = {...user_presence, ...{[presenceKey]:presenceData}}
                        let new_state = {...state, 
                                        user_presences:{
                                            ...state.user_presences,
                                            [userId]:user_presence
                                        }
                                    }
                        console.log('user_presence', new_state, user_presence)
                        return new_state
                    }
                }
            }
            return state
        }

        case CHANGED_PRESENCE:{
            if(!state.user_presences){
                return state
            }

            let user_presences = state.user_presences

            let userId      = action.userId;
            let presenceKey = action.presenceKey;
            let presenceData = action.presenceData;

            let user_presence = _.find(user_presences, (v, k)=>{
                return k == userId
            })

            if(!user_presence){
                return state
            }

            let presense =  _.find(user_presence, (v, k)=>{
                return k == presenceKey
            })

            if(!_.isEqual(presense, presenceData)){
                // console.log('Not equal')

                user_presence = {...user_presence, ...{[presenceKey]:presenceData}}
                let new_state = {...state, 
                                    user_presences:{
                                        ...state.user_presences,
                                        [userId]:user_presence
                                    }
                                }
                return new_state
            }

            return state
        }

        case REMOVED_PRESENCE:{
            if(!state.user_presences){
                return state
            }

            let user_presences = state.user_presences

            let userId      = action.userId;
            let presenceKey = action.presenceKey;

            let user_presence = _.find(user_presences, (v, k)=>{
                return k == userId
            })

            if(user_presence === undefined){
                return state
            }

            let presense =  _.find(user_presence, (v, k)=>{
                return k == presenceKey
            })

            if(presense !== undefined){
                user_presence = _.omit(user_presence, presenceKey)
                let new_state = {...state, 
                                    user_presences:{
                                        ...state.user_presences,
                                        [userId]:user_presence
                                    }
                                }
                // console.log(newState)
                return new_state;
            }

            return state
        }
    }
    return state
}