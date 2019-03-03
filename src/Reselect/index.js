import React from 'react'
import { createSelector } from 'reselect'

// import console = require('console');
// import {getUid} from '../Utils/Helpers'

const getUid = (state, props) => {
    if(!state._persist.rehydrated){
        return -1
    }
    if(state.auth.users === null){
        return -1 
    }
    return state.auth.users.user.uid
}

const getProfile = (state, props) => {
    console.log(state.auth.users.profiles)
    return state.auth.users.profiles
}

const getFriends = (state, props) => {
    return state.auth.users.friends
}

const getFriendProfiles = (state, props) => {
    return state.auth.users.friend_profiles
}

const getPresences = (state, props) => {
    // console.log('getPresences', state.presence.user_presences)

    if(state.presence.user_presences === undefined){
        return;
    }
    
    return state.presence.user_presences
}

const getGroups = (state, props) => {
    return state.auth.users.groups
}

const getClasss = (state, props) => {
    return state.auth.users.classs
}

export const makeUidState = createSelector(
    [ getUid ],
    (uid) => uid
)

// profiles
export const makeProfilesState = createSelector(
    [ getProfile ],
    (profiles) => profiles
)

export const makeFriendsState = createSelector(
    [ getFriends ],
    (friends) => friends
)

// friend_profiles:state.auth.users.friend_profiles,
export const makeFriendProfilesState = createSelector(
    [ getFriendProfiles ],
    (friend_profiles) => friend_profiles
)

// presences
export const makePresencesState = createSelector(
    [ getPresences ],
    (presences) => presences
)

// groups
export const makeGroupsState = createSelector(
    [ getGroups ],
    (groups) => groups
)

// classs
export const makeClasssState = createSelector(
    [ getClasss ],
    (classs) => classs
)
