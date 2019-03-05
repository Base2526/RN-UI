import React from 'react'
import { createSelector } from 'reselect'

// import console = require('console');
// import {getUid} from '../Utils/Helpers'

const getUid = (state, props) => {
    if(!state._persist.rehydrated){
        return -1
    }
    if(state.auth.user === null){
        return -1 
    }
    return state.auth.user.session.user.uid
}

const getProfile = (state, props) => {
    return state.auth.user.profile
}

const getPhones = (state, props) => {
    return state.auth.user.phones
}

const getWebsites = (state, props) => {
    return state.auth.user.websites
}

const getEmails = (state, props) => {
    return state.auth.user.emails
}

const getMyIds= (state, props) => {
    return state.auth.user.my_ids
}

const getMyAppications= (state, props) => {
    return state.auth.user.my_applications
}

const getFriends = (state, props) => {
    return state.auth.user.friends
}

const getFriendProfiles = (state, props) => {
    return state.auth.user.friend_profiles
}

const getPresences = (state, props) => {
    // console.log('getPresences', state.presence.user_presences)

    if(state.presence.user_presences === undefined){
        return;
    }
    
    return state.presence.user_presences
}

const getGroups = (state, props) => {
    return state.auth.user.groups
}

const getClasss = (state, props) => {
    return state.auth.user.classs
}

const getIsConnected = (state, props) => {
    return state.offline.online
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

// phones
export const makePhonesState = createSelector(
    [ getPhones ],
    (phones) => phones
)

// getWebsites
export const makeWebsitesState = createSelector(
    [ getWebsites ],
    (websites) => websites
)

export const makeEmailsState = createSelector(
    [ getEmails ],
    (emails) => emails
)

export const makeMyIdsState = createSelector(
    [ getMyIds ],
    (myIds) => myIds
)

export const makeMyAppicationsState = createSelector(
    [ getMyAppications ],
    (my_applications) => my_applications
)


// 
// export const makeProfilesMenuState = createSelector(
//     [ getProfileMenu ],
//     (v) => v
// )

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

// isConnected
export const makeIsConnectedState = createSelector(
    [ getIsConnected ],
    (isConnected) => isConnected
)
