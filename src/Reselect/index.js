import React from 'react'
import { createSelector } from 'reselect'

var _ = require('lodash');

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
    let friend_profiles = state.auth.user.friend_profiles
    let new_friend_profiles = {...friend_profiles}

    _.each(friend_profiles, (v,k)=>{
        let {friend_phones, 
            friend_websites, 
            friend_emails, 
            friend_my_ids} = state.auth.user

        let phones = _.find(friend_phones, (phone_v, phone_k)=>{
            return k == phone_k
        })

        let websites = _.find(friend_websites, (phone_v, phone_k)=>{
            return k == phone_k
        })

        let emails =_.find(friend_emails, (email_v, email_k)=>{
            return k == email_k
        })

        let my_ids =_.find(friend_my_ids, (my_id_v, my_id_k)=>{
            return k == my_id_k
        })

        if(phones !== undefined){
            v = {...v, phones}
        }
        if(websites !== undefined){
            v = {...v, websites}
        }
        if(emails !== undefined){
            v = {...v, emails}
        }
        if(my_ids !== undefined){
            v = {...v, my_ids}
        }
        new_friend_profiles = {...new_friend_profiles, [k]:v}
    })

    return new_friend_profiles
}

// const getFriendPhones = (state, props) => {
//     return state.auth.user.friend_profiles
// }

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
export const makeProfileState = createSelector(
    [ getProfile ],
    (profile) => profile
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

// export const makeFriendPhonesState = createSelector(
//     [ getFriendPhones ],
//     (friend_phones) => friend_phones
// )

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
