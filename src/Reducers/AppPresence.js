var _ = require('lodash');

import {ADDED_PRESENCE,
        CHANGED_PRESENCE,
        REMOVED_PRESENCE}  from '../Actions/types'

const INITIAL_STATE = {user_presences:null}

import Constant from '../Utils/Constant'
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
    
        case ADDED_PRESENCE:{
            if(state.user_presence === null){
                return state
            }

            let user_presences = state.user_presences
            // console.log(user_presences)

            let userId      = action.userId;
            let presenceKey = action.presenceKey;
            let presenceData = action.presenceData;

            let user_presence = _.find(user_presences, (v, k)=>{
                                return k == userId
                            })

            if(user_presence === undefined){
                user_presences = {...user_presences, [userId]:{[presenceKey]:presenceData}}
                return {...state, user_presences}
            }else{
                let presense =  _.find(user_presence, (v, k)=>{
                                    return k == presenceKey
                                })

                if(presense === undefined){
                    presense = {[presenceKey]:presenceData}
                    user_presence = {...user_presence, ...presense}
                    let newState = {...state, 
                                    user_presences:{
                                        ...state.user_presences,
                                        [userId]:user_presence
                                    }
                                }
                    // console.log(newState)
                    return newState
                }
            }
            return state
        }

        case CHANGED_PRESENCE:{
            if(state.user_presence === null){
                return state
            }

            let user_presences = state.user_presences

            let userId      = action.userId;
            let presenceKey = action.presenceKey;
            let presenceData = action.presenceData;

            let user_presence = _.find(user_presences, (v, k)=>{
                return k == userId
            })

            if(user_presence === undefined){
                return state
            }

            let presense =  _.find(user_presence, (v, k)=>{
                return k == presenceKey
            })

            if(!_.isEqual(presense, presenceData)){
                // console.log('Not equal')

                user_presence = {...user_presence, ...{[presenceKey]:presenceData}}
                let newState = {...state, 
                    user_presences:{
                        ...state.user_presences,
                        [userId]:user_presence
                    }
                }
                return newState
            }

            return state
        }

        case REMOVED_PRESENCE:{
            if(state.user_presence === null){
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

                let newState = {...state, 
                    user_presences:{
                        ...state.user_presences,
                        [userId]:user_presence
                    }
                }
                // console.log(newState)
                return newState;
            }

            return state
        }
    }
    return state
}