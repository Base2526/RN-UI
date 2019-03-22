import React from 'react'
import {FlatList, 
        StyleSheet, 
        View, 
        Text, 
        Alert, 
        TouchableOpacity,
        Image} from 'react-native'

import ExpandableList from 'react-native-expandable-section-flatlist'
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import {
    MenuProvider,
    Menu,
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
  } from 'react-native-popup-menu';

var _ = require('lodash');
import ActionButton from 'react-native-action-button';

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'
import MyIcon from '../../config/icon-font.js';
import {getHeaderInset, isEmpty} from '../../Utils/Helpers'

import {makeUidState, 
        makeProfileState, 
        makeFriendsState, 
        makeFriendProfilesState, 
        makeGroupsState,
        makeGroupProfilesState,
        makeGroupMembersState} from '../../Reselect'

class ListGroupMember_TabMembersPage extends React.Component{

    constructor(){
        super();
        this.state = { 
            loading: false,
            renderContent: false,
            data:[],
            group_id :0,
            group:{}, 
            is_admin:false,
        }
    }

    componentWillMount(){
        let {group_id} = this.props.params

        let {uid, group_profiles, friend_profiles, group_members} = this.props
        let group_profile = _.find(group_profiles, (v, k)=>{
                                return k == group_id
                            })

        let group_member =  _.find(group_members, (v,k)=>{
                                return k == group_id 
                            })

        group_profile = {...group_profile, members:group_member}

        /// check is friend_profile ครบหรือไม่  ถ้าไม่ครบเราต้องวิ่งไปดึงจาก server
        let lost_profile = []
        _.each(group_profile.members, (v, k)=>{
            var friend_profile = _.find(friend_profiles, function(fv, fk) {
                return fk == v.friend_id;
            });

            if(!friend_profile){
                lost_profile.push(v.friend_id)
            }
        })

        console.log(group_profile.members, lost_profile)
        if(!isEmpty(lost_profile)){
            this.setState({loading:true})
            this.props.actionFriendProfileMulti99(uid, lost_profile).then((result) => {
                this.setState({loading:false})

                this.setState({group_id}, ()=>{
                    this.loadData(this.props)
                })
            })
        }else{
            this.setState({group_id}, ()=>{
                this.loadData(this.props)
            })
        }
        /// check is friend_profile ครบหรือไม่ 
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData = (props) =>{
        let {group_id}  = this.state

        if(group_id == 0){
            return;
        }

        let {uid, groups, group_profiles, group_members, friends, friend_profiles}    = props

        let group = _.find(groups,  function(v, k) { 
            return k == group_id
        })

        console.log(group, groups, group_id)
        if(!group){
            this.handleCancel()
        }
        
        let group_profile = _.find(group_profiles, (v, k)=>{
                                return k == group_id
                            })

        let group_member =  _.find(group_members, (v,k)=>{
                                return k == group_id 
                            })

        group_profile = {...group_profile, members:group_member}
                            
        // console.log('1, ListGroupMember_TabMembersPage', group, group_profile)

        group = {...group, ...group_profile}

        // console.log('2, ListGroupMember_TabMembersPage', group, group_profile)

        // let group_members = group.members
        
        let members  = []
        let pendings = []
        let declines = []

        _.each(group.members, (v, k)=>{
            console.log(v, k)
            var friend = _.find(friends, function(fv, fk) {
                return fk == v.friend_id;
            });

            // friend_profiles

            var friend_profile = _.find(friend_profiles, function(fv, fk) {
                                    return fk == v.friend_id;
                                });

            if(!friend_profile){
                this.setState({loading:true})
                this.props.actionFriendProfile99(uid, v.friend_id).then((result) => {
                    this.setState({friend_id, loading:false}, ()=>{
                        this.loadData(this.props)
                    })
                })
            }else{
                friend = {...friend, profile:friend_profile}

                switch(v.status){
                    case Constant.GROUP_STATUS_MEMBER_INVITED:{
                        // console.log(friend_profile)
                        if(friend === undefined ){
                            if(uid === v.friend_id){
                                pendings.push({...v, member_key:k})
                            }else{
                                // ไม่มีเพือนเราจะต้องดึง firestore โดยตรง
                                firebase.firestore().collection('profiles').doc(v.friend_id).get()
                                .then(doc => {
                                    console.log('No such document!');
                                    if (!doc.exists) {
                                        console.log('No such document!');
                                    } else {
                                        console.log(doc.data())

                                        // this.props.actionAddFriend(uid, friend_id, {'status':Constant.FRIEND_STATUS_FRIEND_99}, doc.data(), (result) => {
                                        //     console.log(result)
                                        // })
                                    }
                                })
                                .catch(err => {
                                    console.log('Error getting document', err);
                                });
                            }
                        }else{
                            pendings.push({...v, member_key:k, friend})
                        }
                        break;
                    }
                    case Constant.GROUP_STATUS_MEMBER_JOINED:{
                        if(friend === undefined ){
                            if(uid === v.friend_id){
                                members.push({...v, member_key:k})
                            }else{
                                console.log('No such document!');
                                // ไม่มีเพือนเราจะต้องดึง firestore โดยตรง
                                firebase.firestore().collection('profiles').doc(v.friend_id).get()
                                .then(doc => {
                                    if (!doc.exists) {
                                        console.log('No such document!');
                                    } else {
                                        console.log(doc.data())

                                        // this.props.actionAddFriend(uid, friend_id, {'status':Constant.FRIEND_STATUS_FRIEND_99}, doc.data(), (result) => {
                                        //     console.log(result)
                                        // })
                                    }
                                })
                                .catch(err => {
                                    console.log('Error getting document', err);
                                });
                            }
                        }else{
                            members.push({...v, member_key:k, friend})
                        }
                        break;
                    }
                    case Constant.GROUP_STATUS_MEMBER_DECLINE:{
                        if(friend === undefined ){
                            if(uid === v.friend_id){
                                declines.push({...v, member_key:k})
                            }else{
                                console.log('No such document!');
                                // ไม่มีเพือนเราจะต้องดึง firestore โดยตรง
                                firebase.firestore().collection('profiles').doc(v.friend_id).get()
                                .then(doc => {
                                    if (!doc.exists) {
                                        console.log('No such document!');
                                    } else {
                                        console.log(doc.data())

                                        // this.props.actionAddFriend(uid, friend_id, {'status':Constant.FRIEND_STATUS_FRIEND_99}, doc.data(), (result) => {
                                        //     console.log(result)
                                        // })
                                    }
                                })
                                .catch(err => {
                                    console.log('Error getting document', err);
                                });
                            }
                        }else{
                            declines.push({...v, member_key:k, friend})
                        }
                        break;
                    }
                }
            }
        })

        // console.log(members)
        // console.log(pendings)
        // console.log(declines)

        let is_admin = false
        let is_admin_check =  _.find(members, (v, k)=>{
                                    return v.friend_id == this.props.uid && v.is_admin
                                })

        if(is_admin_check){
            is_admin = true
        }
        
        this.setState({
            data: [ {title: 'Members',member: members}, 
                    {title: 'Pending', member: pendings},
                    {title: 'Decline', member: declines},],
            group_profile: group.group_profile,
            group,
            is_admin,
            renderContent: true
        })
    }

    handleInvite = () => {
        const { navigation } = this.props;
        const group = navigation.getParam('group', null);
        this.props.navigation.navigate("GroupMemberInvite", {'group':group})
    }

    handleCancel = () => {
        // this.props.navigation.goBack(null)
    }

    checkInvitor = (rowItem) =>{

        let {uid, friend_profiles, groups} = this.props
        // rowItem.friend_id === this.state.group_profile.creator_id?<Text style={{fontSize:12, color:'gray'}}>Group Creator</Text>:<View />
    
        // console.log('checkInvitor', rowItem)
        
        if(rowItem.friend_id === groups.creator_id){
            return(<Text style={{fontSize:12, color:'gray'}}>Group Creator</Text>)
        }else {
            if(rowItem.invitor != 0){

                if(rowItem.invitor === uid){
                    return(<Text style={{fontSize:12, color:'gray'}}>Added by You</Text>)
                }

                let member = _.find(this.state.group.members, (mv, mk)=>{
                    return rowItem.invitor == mv.friend_id
                    // return '1'
                })

                // console.log(member)

                var friend_profile = _.find(friend_profiles, function(fv, fk) {
                    return fk == member.friend_id;
                });

                // console.log('friend_profile', friend_profile)
                let friend_name = ''
                if(friend_profile){
                    friend_name = friend_profile.name
                }

                return(<Text style={{fontSize:12, color:'gray'}}>Added by {friend_name}</Text>)
            }
        }
        
        return(<View />)
    }

    showMenuMembers = (rowItem)=>{
        console.log('showMenuMembers', rowItem)

        let {uid} = this.props
        let {group_id} = this.state
        let {friend, friend_id, member_key, is_admin} = rowItem

        let menu_make_admin = <View />
        if(this.state.is_admin){
            if(uid !== friend_id && !is_admin){
            menu_make_admin=<MenuOption onSelect={() => {
                                    Alert.alert(
                                        'Add group admin',
                                        'As a group admin ' + friend.profile.name + ' will be able to manage the group and remove members from the conversation. They will be able to remove other admins.',
                                        [
                                        
                                        // {text: 'Leave group', onPress: () => console.log('Leave group')},
                                        {
                                            text: 'Cancel',
                                            onPress: () => console.log('Cancel Pressed'),
                                            style: 'cancel',
                                        },
                                        {text: 'Make admin', onPress: () => {
                                            this.setState({loading:true})
                                            this.props.actionMakeAdminGroup(uid, group_id, friend_id, member_key, (result) => {
                                                this.setState({loading:false})

                                                console.log(result)
                                            })
                                        }},
                                        ],
                                        {cancelable: false},
                                    );
                                }}>
                                <Text style={{padding:10, fontSize:18}}>Make admin</Text>
                            </MenuOption>
            }
        }

        let memu_trigger = <View />
        let memu_view_profile = <View />
        if(uid !== friend_id){

            memu_trigger = <MyIcon 
                            style={{padding:10}}
                            name={'dot-horizontal'}
                            size={15}
                            color={'#C7D8DD'} />  

            memu_view_profile = <MenuOption onSelect={() => {
                                    if(uid === friend_id){
                                        this.props.props.navigation.navigate("MyProfilePage")
                                    }else{
                                        this.props.props.navigation.navigate("FriendProfilePage",{'friend_id': friend_id})
                                    }
                                }}>
                                    <Text style={{padding:10, fontSize:18}}>View profile</Text>
                                </MenuOption>
        }

        return( <Menu>
                    <MenuTrigger>
                        {memu_trigger}
                    </MenuTrigger>
                    <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset() + 50)}}>
                        {menu_make_admin}
                        {memu_view_profile}
                    </MenuOptions>
                </Menu>)
    }

    showMenuPending = (rowItem)=>{

        let {group_id} = this.state
        let {uid} = this.props

        let {friend_id, member_key} = rowItem

        return( <Menu>
                    <MenuTrigger>
                        <MyIcon 
                            style={{padding:10}}
                            name={'dot-horizontal'}
                            size={15}
                            color={'#C7D8DD'} />  
                    </MenuTrigger>
                    <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset() + 50)}}>
                        <MenuOption onSelect={() => {
                            if(uid === friend_id){
                                this.props.props.navigation.navigate("MyProfilePage")
                            }else{
                                this.props.props.navigation.navigate("FriendProfilePage",{'friend_id': friend_id})
                            }
                        }}>
                            <Text style={{padding:10, fontSize:18}}>View profile</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => {
                             this.setState({loading:true})
                             this.props.actionCanceledGroupMember(uid, group_id, friend_id, member_key, (result) => {
                                 this.setState({loading:false})
 
                                 console.log(result)
                             })
                        }}>
                            <Text style={{padding:10, fontSize:18}}>Cancel</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>)
    }

    showMenu = ()=>{
        return( <Menu>
                    <MenuTrigger>
                        <MyIcon 
                            style={{padding:10}}
                            name={'dot-horizontal'}
                            size={15}
                            color={'#C7D8DD'} />  
                    </MenuTrigger>
                    <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset() + 50)}}>
                        <MenuOption onSelect={() => {console.log('Navigation Login')}}>
                            <Text style={{padding:10, fontSize:18}}>Navigation Login</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => {console.log('Navigation Register')}}>
                            <Text style={{padding:10, fontSize:18}}>Navigation Register</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => {console.log('Navigation Home')}}>
                            <Text style={{padding:10, fontSize:18}}>Navigation Home</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>)
    }

    showMenuDeline = (rowItem) =>{
        let {group_id} = this.state
        let {uid} = this.props

        return( <Menu>
                    <MenuTrigger>
                        <MyIcon 
                            style={{padding:10}}
                            name={'dot-horizontal'}
                            size={15}
                            color={'#C7D8DD'} />  
                    </MenuTrigger>
                    <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset() + 50)}}>
                        <MenuOption onSelect={() => {
                                                console.log(uid, group_id, rowItem.friend_id, rowItem.member_key)
                                                
                                                this.setState({loading:true})
                                                this.props.actionMemberInviteAgainGroup(uid, group_id, rowItem.friend_id, rowItem.member_key, (result) => {
                                                    console.log(result)
        
                                                    this.setState({loading:false})
                                                })
                                                
                                            }}>
                            <Text style={{padding:10, fontSize:18}}>Invite</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => {
                                                console.log(uid, group_id, rowItem.friend_id, rowItem.member_key)
                                                
                                                this.setState({loading:true})
                                                this.props.actionCanceledGroupMember(uid, group_id, rowItem.friend_id, rowItem.member_key, (result) => {
                                                    this.setState({loading:false})
                    
                                                    console.log(result)
                                                })
                                                
                                            }}>
                            <Text style={{padding:10, fontSize:18}}>Cancel</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>)
    }

    _renderRow = (rowItem, rowId, sectionId) => {
        let {group_id} = this.state
        let {uid} = this.props
        switch(rowItem.status){
            case Constant.GROUP_STATUS_MEMBER_JOINED:{
                swipeoutRight = [
                    {
                        component:  <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'red'}}>
                                        <Text style={{fontWeight:'bold', color:'white', fontSize:14}}>LEAVE</Text>
                                    </View>,
                        backgroundColor: 'red',
                        onPress: () => { 
                            alert('LEAVE')
                        }
                    }
                ]

                if(rowItem.friend_id === uid){
                    let {profiles} = this.props
                    return( <View style={{flex:1, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                                <TouchableOpacity>
                                    <FastImage
                                        style={{width: 50,  
                                                height: 50,
                                                borderRadius: 10, 
                                                // borderColor:'gray', 
                                                // backgroundColor: '#FF83AF',
                                                // borderWidth:1
                                                }}
                                        source={{
                                            uri: profiles.image_url,
                                            headers:{ Authorization: 'someAuthToken' },
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.normal}
                                    />
                                </TouchableOpacity>
                                <View >
                                    <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                                        <View style={{flexDirection:'row', alignItems:'baseline'}}>
                                            <Text style={{fontSize:18}}>{profiles.name}</Text>
                                            <Text style={{fontSize:12, fontStyle:'italic', color:'gray'}}>(You)</Text>
                                        </View>
                                        {this.checkInvitor(rowItem)}
                                    </View>
                                </View>
                                <View style={{position:'absolute', right:0, marginRight:10}}>
                                    {this.showMenuMembers(rowItem)} 
                                </View>
                            </View>)
                }

                return( <View style={{flex:1, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                            <TouchableOpacity>
                                <FastImage
                                    style={{width: 50,  
                                            height: 50,
                                            borderRadius: 10, 
                                            // borderColor:'gray', 
                                            // backgroundColor: '#FF83AF',
                                            // borderWidth:1
                                            }}
                                    source={{
                                        uri: rowItem.friend.profile.image_url,
                                        headers:{ Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.normal}
                                />
                            </TouchableOpacity>
                            <View >
                                <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                                <Text style={{fontSize:18}}>{rowItem.friend.change_friend_name !== undefined ?rowItem.friend.change_friend_name: rowItem.friend.profile.name}</Text>
                                    {this.checkInvitor(rowItem)}
                                </View>
                            </View>
                            <View style={{position:'absolute', right:0, marginRight:10}}>
                                {this.showMenuMembers(rowItem)} 
                            </View>
                        </View>)
            }

            case Constant.GROUP_STATUS_MEMBER_INVITED:{
                swipeoutRight = [
                    {
                        component:  <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'red'}}>
                                        <Text style={{fontWeight:'bold', color:'white', fontSize:14}}>CANCEL</Text>
                                    </View>,
                        backgroundColor: 'red',
                        onPress: () => { 
                            // console.log(rowItem)
                            // console.log(uid, group_id, rowItem.friend_id, rowItem.member_key)

                            this.setState({loading:true})
                            this.props.actionCanceledGroupMember(uid, group_id, rowItem.friend_id, rowItem.member_key, (result) => {
                                this.setState({loading:false})

                                console.log(result)
                            })
                        }
                    }
                ]

                if(rowItem.friend_id === uid){
                    let {profiles} = this.props
                    return( <View style={{flex:1, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                                <TouchableOpacity>
                                    <FastImage
                                        style={{width: 50,  
                                                height: 50,
                                                borderRadius: 10, 
                                                // borderColor:'gray', 
                                                // backgroundColor: '#FF83AF',
                                                // borderWidth:1
                                                }}
                                        source={{
                                            uri: profiles.image_url,
                                            headers:{ Authorization: 'someAuthToken' },
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.normal}
                                    />
                                </TouchableOpacity>
                                <View >
                                    <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                                        <Text style={{fontSize:18}}>{profiles.name}(You)</Text>
                                        {this.checkInvitor(rowItem)}
                                    </View>
                                </View>
                                <View style={{position:'absolute', right:0, marginRight:10}}>
                                    {this.showMenuPending(rowItem)} 
                                </View>
                            </View>)
                }

                return( <View style={{flex:1, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                            <TouchableOpacity>
                                <FastImage
                                    style={{width: 50,  
                                            height: 50,
                                            borderRadius: 10, 
                                            // borderColor:'gray', 
                                            // backgroundColor: '#FF83AF',
                                            // borderWidth:1
                                            }}
                                    source={{
                                        uri: rowItem.friend.profile.image_url,
                                        headers:{ Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.normal}
                                />
                            </TouchableOpacity>
                            <View >
                                <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                                    <Text style={{fontSize:18}}>{rowItem.friend.change_friend_name !== undefined ?rowItem.friend.change_friend_name: rowItem.friend.profile.name}</Text>
                                    {this.checkInvitor(rowItem)}
                                </View>
                            </View>
                            <View style={{position:'absolute', right:0, marginRight:10}}>
                                    {this.showMenuPending(rowItem)} 
                            </View>
                        </View>)
            }

            case Constant.GROUP_STATUS_MEMBER_DECLINE:{
                if(rowItem.friend_id === uid){
                    let {profiles} = this.props
                    return( <View style={{flex:1, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                                <TouchableOpacity>
                                    <FastImage
                                        style={{width: 50,  
                                                height: 50,
                                                borderRadius: 10, 
                                                // borderColor:'gray', 
                                                // backgroundColor: '#FF83AF',
                                                // borderWidth:1
                                                }}
                                        source={{
                                            uri: profiles.image_url,
                                            headers:{ Authorization: 'someAuthToken' },
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.normal}
                                    />
                                </TouchableOpacity>
                                <View >
                                    <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                                        <Text style={{fontSize:18}}>{profiles.name}(You)</Text>
                                        {this.checkInvitor(rowItem)}
                                    </View>
                                </View>
                                <View style={{position:'absolute', right:0, marginRight:10}}>
                                    {this.showMenu()} 
                                </View>
                            </View>)
                }

                return(<View style={{flex:1, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                            <TouchableOpacity>
                                <FastImage
                                    style={{width: 50,  
                                            height: 50,
                                            borderRadius: 10, 
                                            // borderColor:'gray', 
                                            // backgroundColor: '#FF83AF',
                                            // borderWidth:1
                                            }}
                                    source={{
                                        uri: rowItem.friend.profile.image_url,
                                        headers:{ Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.normal}
                                />
                            </TouchableOpacity>
                            <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                            <Text style={{fontSize:18}}>{rowItem.friend.change_friend_name !== undefined ?rowItem.friend.change_friend_name: rowItem.friend.profile.name}</Text>
                            </View>

                            {this.showMenuDeline(rowItem)} 
                            { /*
                            <View style={{flexDirection:'row', position:'absolute', right:0, bottom:0, margin:5, }}>
                                <TouchableOpacity
                                    style={{padding:5, 
                                            borderColor:'green', 
                                            borderRadius:10, 
                                            borderWidth:.5,
                                            marginRight:5}}
                                    onPress={()=>{
                                        // console.log(rowItem)
                                        // console.log(this.state.group_id)
                                        this.setState({loading:true})
                                        this.props.actionMemberInviteAgainGroup(uid, group_id, rowItem.friend_id, rowItem.member_key, (result) => {
                                            console.log(result)

                                            this.setState({loading:false})
                                        })
                                    }}>
                                    <Text style={{color:'green'}}>Invite</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{padding:5, 
                                            borderColor:'red', 
                                            borderRadius:10, 
                                            borderWidth:.5}}
                                    onPress={()=>{
                                        this.setState({loading:true})
                                        this.props.actionCanceledGroupMember(uid, group_id, rowItem.friend_id, rowItem.member_key, (result) => {
                                            this.setState({loading:false})
            
                                            console.log(result)
                                        })
                                    }}>
                                    <Text style={{color:'red'}}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                            */ }
                        </View>)
            }
        }

        return (<View />)
    }

    _renderSection = (section, sectionId, state)  => {
        let {data} = this.state

        let m_length = data[sectionId].member.length
        if(m_length == 0){
            return ;
        }

        let ic_collapse = <MyIcon name={state ? 'collapse-up' : 'collapse-down'}
                                  size={8}
                                  color={'#C7D8DD'} />
        return (
            <View
                style={{ 
                        height: 30, 
                        flexDirection: 'row',
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        borderBottomWidth: 0.5,
                        borderBottomColor: '#E4E4E4' 
                        }}>
            <View style={{ flexDirection: 'row', 
                        alignItems: 'center'}}>
                <Text style={{  color: 'gray',
                                paddingLeft: 10,
                                fontWeight:'700' }}>
                {section + "(" + m_length +")"}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight:10 }}>
                {ic_collapse}
            </View>
            </View>
        )
    }
      
    render() {
        let {group_id, loading, data, renderContent} = this.state

        if(!renderContent){
            return(<View style={{flex:1}}></View>)
        }

        return (<MenuContext>
                    <View style={{flex:1}}>
                        <Spinner
                            visible={loading}
                            textContent={'Wait...'}
                            textStyle={{color: '#FFF'}}
                            overlayColor={'rgba(0,0,0,0.5)'}
                            />
                        <ExpandableList
                            style={{flex:1}}
                            ref={instance => this.ExpandableList = instance}
                            dataSource={data}
                            headerKey="title"
                            memberKey="member"
                            renderRow={this._renderRow}
                            headerOnPress={(i, state) => {
                            } }
                            renderSectionHeaderX={this._renderSection}
                            openOptions={[0, 1, 2]}
                            // removeClippedSubviews={false}
                        />
                        <ActionButton 
                            buttonColor="rgba(231,76,60,1)"
                            hideShadow={true}
                            renderIcon={() => {
                                return(<MyIcon
                                    name={'user-plus'}
                                    size={25}
                                    color={'#C7D8DD'} />)
                                }}
                            onPress={()=>{
                                this.props.props.navigation.navigate("GroupMemberInvite", {'group_id':group_id})
                            }}>
                        </ActionButton>
                    </View>
                </MenuContext>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    // console.log(state)

    if(!state._persist.rehydrated){
      return {}
    }

    if(!state.auth.isLogin){
        return;
    }
  
    return{
        uid:makeUidState(state, ownProps),
        profiles:makeProfileState(state, ownProps),
        friends:makeFriendsState(state, ownProps),
        friend_profiles:makeFriendProfilesState(state, ownProps),
        groups:makeGroupsState(state, ownProps),
        group_profiles:makeGroupProfilesState(state, ownProps),
        group_members:makeGroupMembersState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(ListGroupMember_TabMembersPage);