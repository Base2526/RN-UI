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

const getNameCards= (state, props) => {
    return state.auth.user.name_cards
}

const getApplicationCategory= (state, props) => {
    return state.auth.application_category
}

const getMyAppications= (state, props) => {
    let my_applications = state.auth.user.my_applications
    return my_applications
    /*
    let new_my_applications = {...my_applications}
    // my_applications_posts
    _.each(my_applications, (v,k)=>{
        let {my_applications_posts, 
            my_applications_posts_images} = state.auth.user

        let posts = _.find(my_applications_posts, (posts_v, posts_k)=>{
                        return k == posts_k
                    })
        if(posts){
            _.each(posts, (post_v,post_k)=>{
                let images   =  _.find(my_applications_posts_images, (image_v, image_k)=>{
                                    return post_k == image_k
                                })
                if(images){
                    posts = {...posts, [post_k]:{...post_v, images}}
                }
            })
            v = {...v, posts}
        }
        new_my_applications = {...new_my_applications, [k]:v}
    })

    return new_my_applications
    */
}

const getMyAppicationsPosts = (state, props) => {
    let {my_applications_posts, 
        my_applications_posts_images,
        my_applications_posts_likes} = state.auth.user
    let new_my_applications_posts = {...my_applications_posts}
    _.each(my_applications_posts, (post_v,post_k)=>{
        let newPostV = {...post_v}
        _.each(post_v, (pv, pk)=>{
            let images  =  _.find(my_applications_posts_images, (image_v, image_k)=>{
                            return pk == image_k
                        })

            let likes  =  _.find(my_applications_posts_likes, (like_v, like_k)=>{
                            return pk == like_k
                          })
            
            if(images){
                pv = {...pv, images}
                newPostV = {...newPostV, [pk]:pv}
            }else{
                pv = {...pv, images:{}}
                newPostV = {...newPostV, [pk]:pv}
            }

            if(likes){
                // console.log('likes>>> ?', likes, my_applications_posts_likes)
                pv = {...pv, likes}
                newPostV = {...newPostV, [pk]:pv}
            }else{
                pv = {...pv, likes:{}}
                newPostV = {...newPostV, [pk]:pv}
            }
        })
        new_my_applications_posts = {...new_my_applications_posts, [post_k]:newPostV}
    })
    // console.log('new_my_applications_posts', new_my_applications_posts, my_applications_posts)
    return new_my_applications_posts
}

const getMyAppicationsPostsLikes = (state, props) => {
    let {my_applications_posts_likes} = state.auth.user

    return my_applications_posts_likes
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

const getFriendProfilePhones = (state, props) => {
    return state.auth.user.friend_phones
}

const getFriendProfileWebsites = (state, props) => {
    return state.auth.user.friend_websites
}

const getFriendProfileEmails = (state, props) => {
    return state.auth.user.friend_emails
}

const getFriendProfileMyids = (state, props) => {
    return state.auth.user.friend_my_ids
}

const getFriendProfile = (state, props) => {
    const { navigation } = props;
    const friend_id = navigation.getParam('friend_id', null);
    // console.log(friend_id)

    // let friends = state.auth.user.friends
    // let friend  = _.find(friends, (v, k)=>{
    //                 return k == friend_id
    //               })

    let friend  ={}

    let {friend_phones, 
        friend_websites, 
        friend_emails, 
        friend_my_ids} = state.auth.user

    let phones = _.find(friend_phones, (phone_v, phone_k)=>{
        return friend_id == phone_k
    })

    let websites = _.find(friend_websites, (websites_v, websites_k)=>{
        return friend_id == websites_k
    })

    let emails =_.find(friend_emails, (email_v, email_k)=>{
        return friend_id == email_k
    })

    let my_ids =_.find(friend_my_ids, (my_id_v, my_id_k)=>{
        return friend_id == my_id_k
    })

    /*
    // let friend_emails   = v.friend_emails
    // let friend_my_ids   = v.friend_my_ids
    // let friend_phones   = v.friend_phones
    // let friend_profile  = v.friend_profile
    // let friend_websites = v.friend_websites  
    */

    if(phones){
        friend = {...friend, friend_phones:phones}
    }
    if(websites){
        friend = {...friend, friend_websites:websites}
    }
    if(emails){
        friend = {...friend, friend_emails:emails}
    }
    // if(my_ids){
    //     friend = {...friend, friend_my_ids:my_ids}
    // }
    return friend
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

const getGroupProfiles = (state, props) => {
    let group_profiles = state.auth.user.group_profiles
    // let new_group_profiles = {...group_profiles}

    /*
    _.each(group_profiles, (v,k)=>{
        let {group_members} = state.auth.user
        let members = _.find(group_members, (mv, mk)=>{
            return k == mk
        })

        if(members !== undefined){
            v = {...v, members}
        }

        new_group_profiles = {...new_group_profiles, [k]:v}
    })
    */

    // return new_group_profiles
    return group_profiles
}

const getGroupMembers = (state, props) =>{
    return state.auth.user.group_members
}

const getClasss = (state, props) => {
    return state.auth.user.classs
}

const getClassMembers = (state, props) => {
    return state.auth.user.class_members
}

const getPeopleYouMayKhows = (state, props) => {
    return state.auth.user.people_you_may_khows
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

export const makeMyAppicationsPostsState = createSelector(
    [ getMyAppicationsPosts ],
    (my_applications_posts) => my_applications_posts
)

export const makeMyAppicationsPostsLikesState = createSelector(
    [ getMyAppicationsPostsLikes ],
    (my_applications_posts_likes) => my_applications_posts_likes
)

/*

let {my_applications_posts, 
            my_applications_posts_images} = state.auth.user
*/


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

export const makeFriendProfilePhonesState = createSelector(
    [ getFriendProfilePhones ],
    (friend_profile_phones) => friend_profile_phones
)

export const makeFriendProfileWebsitesState = createSelector(
    [ getFriendProfileWebsites ],
    (friend_profile_websites) => friend_profile_websites
)

// friend_emails
export const makeFriendProfileEmailsState = createSelector(
    [ getFriendProfileEmails ],
    (friend_profile_emails) => friend_profile_emails
)

export const makeFriendProfileMyidsState  = createSelector(
    [ getFriendProfileMyids ],
    (friend_profile_my_ids) => friend_profile_my_ids
)

export const makeFriendProfileState = createSelector(
    [ getFriendProfile ],
    (friend_profile) => friend_profile
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

export const makeGroupProfilesState = createSelector(
    [ getGroupProfiles ],
    (group_profiles) => group_profiles
)

// group_members
export const makeGroupMembersState = createSelector(
    [ getGroupMembers ],
    (group_members) => group_members
)


// classs
export const makeClasssState = createSelector(
    [ getClasss ],
    (classs) => classs
)

export const makeClassMembersState = createSelector(
    [ getClassMembers ],
    (class_members) => class_members
)

export const makePeopleYouMayKhowState = createSelector(
    [ getPeopleYouMayKhows ],
    (people_you_may_khows) => people_you_may_khows
)

// isConnected
export const makeIsConnectedState = createSelector(
    [ getIsConnected ],
    (is_connected) => is_connected
)

export const makeNameCardsState = createSelector(
    [ getNameCards ],
    (name_cards) => name_cards
)

export const makeApplicationCategoryState = createSelector(
    [ getApplicationCategory ],
    (application_category) => application_category
)