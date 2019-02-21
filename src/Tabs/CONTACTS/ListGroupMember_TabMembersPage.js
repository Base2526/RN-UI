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

import Swipeout from 'react-native-swipeout'
import {
    MenuProvider,
    Menu,
    MenuTrigger,
    MenuOptions,
    MenuOption,
  } from 'react-native-popup-menu';

var _ = require('lodash');
import ActionButton from 'react-native-action-button';
import * as actions from '../../Actions'

import Constant from '../../Utils/Constant'
import MyIcon from '../../config/icon-font.js';
import {getUid, getHeaderInset} from '../../Utils/Helpers'

class ListGroupMember_TabMembersPage extends React.Component{

    constructor(){
        super();
        this.state = { 
            renderContent: false,
            data:[],
            group_id :0,
            group:{}, 
            group_profile:{}
        }
    }

    componentWillMount(){
        // console.log(this.props)
        let {group_id} = this.props.params

        this.setState({group_id}, ()=>{
            this.loadData(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        this.loadData(nextProps)
    }

    loadData = (props) =>{
        let {group_id}  = this.state
        let {groups, friends, uid}    = props

        let group = _.find(groups,  function(v, k) { 
            return k == group_id
        })

        if(group === undefined){
            this.handleCancel()
        }

        let members  = []
        let pendings = []
        let declines = []

        let group_members = group.members
        _.each(group_members, (v, k)=>{
            console.log(v, k)
            var friend_profile = _.find(friends, function(fv, fk) {
                return fk == v.friend_id;
            });

            switch(v.status){
                case Constant.GROUP_STATUS_MEMBER_INVITED:{
                    // console.log(friend_profile)
                    if(friend_profile === undefined ){
                        if(uid === v.friend_id){
                            pendings.push({...v, member_key:k})
                        }else{
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
                        pendings.push({...v, member_key:k, friend:friend_profile})
                    }
                    break;
                }
                case Constant.GROUP_STATUS_MEMBER_JOINED:{
                    if(friend_profile === undefined ){
                        if(uid === v.friend_id){
                            members.push({...v, member_key:k})
                        }else{
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
                        members.push({...v, member_key:k, friend:friend_profile})
                    }
                    break;
                }
                case Constant.GROUP_STATUS_MEMBER_DECLINE:{
                    if(friend_profile === undefined ){
                        if(uid === v.friend_id){
                            declines.push({...v, member_key:k})
                        }else{
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
                        declines.push({...v, member_key:k, friend:friend_profile})
                    }
                    break;
                }
            }
        })

        console.log(members)
        console.log(pendings)
        console.log(declines)

        this.setState({
            data: [ {title: 'Members',member: members}, 
                    {title: 'Pending', member: pendings},
                    {title: 'Decline', member: declines},],
            group_profile: group.group_profile,
            group
        })

        /*
        let members = []
        let pending = []
        let decline = []
        _.each(group.members,  function(_v, _k) { 
            switch(_v.status){
                case Constant.GROUP_STATUS_MEMBER_INVITED:{
                    pending.push({
                        item_id:_k,
                        friend_id:_v.friend_id,
                        name:_v.friend_name,
                        status:_v.status,
                        image_url:_v.friend_image_url,
                        invitor:_v.invitor === undefined? 0:_v.invitor
                    })
                    break;
                }
                case Constant.GROUP_STATUS_MEMBER_JOINED:{
                    members.push({
                        item_id:_k,
                        friend_id:_v.friend_id,
                        name:_v.friend_name,
                        status:_v.status,
                        image_url:_v.friend_image_url,
                        invitor:_v.invitor === undefined? 0:_v.invitor
                    })
                    break;
                }
                case Constant.GROUP_STATUS_MEMBER_DECLINE:{
                    decline.push({
                        item_id:_k,
                        friend_id:_v.friend_id,
                        name:_v.friend_name,
                        status:_v.status,
                        image_url:_v.friend_image_url
                    })
                    break;
                }
            }
        });

        this.setState({
            data: [ {title: 'Members',member: members}, 
                    {title: 'Pending', member: pending},
                    {title: 'Decline', member: decline},],
            group_profile: group.group_profile,
            group
        })
        */
    }

    handleInvite = () => {
        const { navigation } = this.props;
        const group = navigation.getParam('group', null);
        this.props.navigation.navigate("GroupMemberInvite", {'group':group})
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    checkInvitor = (rowItem) =>{

        let {friends} = this.props
        // rowItem.friend_id === this.state.group_profile.creator_id?<Text style={{fontSize:12, color:'gray'}}>Group Creator</Text>:<View />
    
        if(rowItem.friend_id === this.state.group_profile.creator_id){
            return(<Text style={{fontSize:12, color:'gray'}}>Group Creator</Text>)
        }else {
            if(rowItem.invitor != 0){

                if(rowItem.invitor === this.props.uid){
                    return(<Text style={{fontSize:12, color:'gray'}}>Added by You</Text>)
                }

                let member = _.find(this.state.group.members, (mv, mk)=>{
                    // return rowItem.invitor == mv.friend_id
                    return '1'
                })

                // console.log(member)

                var friend_profile = _.find(friends, function(fv, fk) {
                    return fk == member.friend_id;
                });

                let friend_name = ''
                if(friend_profile !== undefined){
                    friend_name = friend_profile.profile.name
                }

                return(<Text style={{fontSize:12, color:'gray'}}>Added by {friend_name}</Text>)
            }
        }
        return(<View />)
    }

    _renderRow = (rowItem, rowId, sectionId) => {

        console.log(rowItem)

        let {group_id} = this.state
        let {uid} = this.props

        let swipeoutRight = []
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
                    return( <View style={{flex:1, height:100, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                                <TouchableOpacity>
                                    <FastImage
                                        style={{width: 60,  
                                                height: 60,
                                                borderRadius: 10, 
                                                borderColor:'gray', 
                                                // backgroundColor: '#FF83AF',
                                                borderWidth:1
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
                                    <TouchableOpacity
                                            style={{padding:5}}
                                            onPress={()=>{
                                                alert('menu')
                                            }}>
                                        <MyIcon name={'dot-vertical'}
                                            size={20}
                                            color={'#C7D8DD'} />  
                                    </TouchableOpacity>
                                </View>
                            </View>)
                }

                return( 
                    // <Swipeout 
                    //     style={{backgroundColor:'white'}} 
                    //     right={swipeoutRight}>
                        <View style={{flex:1, height:100, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                            <TouchableOpacity>
                                <FastImage
                                    style={{width: 60,  
                                            height: 60,
                                            borderRadius: 10, 
                                            borderColor:'gray', 
                                            // backgroundColor: '#FF83AF',
                                            borderWidth:1
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
                                <TouchableOpacity
                                        style={{padding:5}}
                                        onPress={()=>{
                                            alert('menu')
                                        }}>
                                    <MyIcon name={'dot-vertical'}
                                        size={20}
                                        color={'#C7D8DD'} />  
                                </TouchableOpacity>
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
                    return( 
                        <Swipeout 
                            style={{backgroundColor:'white'}} 
                            right={swipeoutRight}>
                            <View style={{flex:1, height:100, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                                <TouchableOpacity>
                                    <FastImage
                                        style={{width: 60,  
                                                height: 60,
                                                borderRadius: 10, 
                                                borderColor:'gray', 
                                                // backgroundColor: '#FF83AF',
                                                borderWidth:1
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
                            </View>
                        </Swipeout>)
                }

                return( 
                    <Swipeout 
                        style={{backgroundColor:'white'}} 
                        right={swipeoutRight}>
                        <View style={{flex:1, height:100, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                            <TouchableOpacity>
                                <FastImage
                                    style={{width: 60,  
                                            height: 60,
                                            borderRadius: 10, 
                                            borderColor:'gray', 
                                            // backgroundColor: '#FF83AF',
                                            borderWidth:1
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
                        </View>
                    </Swipeout>)
            }

            case Constant.GROUP_STATUS_MEMBER_DECLINE:{
                if(rowItem.friend_id === uid){
                    let {profiles} = this.props
                    return( 
                        <Swipeout 
                            style={{backgroundColor:'white'}} 
                            right={swipeoutRight}>
                            <View style={{flex:1, height:100, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                                <TouchableOpacity>
                                    <FastImage
                                        style={{width: 60,  
                                                height: 60,
                                                borderRadius: 10, 
                                                borderColor:'gray', 
                                                // backgroundColor: '#FF83AF',
                                                borderWidth:1
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
                            </View>
                        </Swipeout>)
                }

                return(<View style={{flex:1, height:100, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                            <TouchableOpacity>
                                <FastImage
                                    style={{width: 60,  
                                            height: 60,
                                            borderRadius: 10, 
                                            borderColor:'gray', 
                                            // backgroundColor: '#FF83AF',
                                            borderWidth:1
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
                        }}>
            <View style={{ flexDirection: 'row', 
                        alignItems: 'center'}}>
                <Text style={{  color: 'gray',
                                paddingLeft: 10,
                                fontWeight:'700' }}>
                {section + "(" + m_length +")"}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {ic_collapse}
            </View>
            </View>
        )
    }
      
    render() {
        return (<View style={{flex:1}}>
                    
                        <ExpandableList
                            style={{flex:1}}
                            ref={instance => this.ExpandableList = instance}
                            dataSource={this.state.data}
                            headerKey="title"
                            memberKey="member"
                            renderRow={this._renderRow}
                            headerOnPress={(i, state) => {
                            } }
                            renderSectionHeaderX={this._renderSection}
                            openOptions={[0, 1, 2]}
                            removeClippedSubviews={false}
                        />
                    
                    <ActionButton 
                        buttonColor="rgba(231,76,60,1)"
                        renderIcon={() => {
                            return(<MyIcon
                                name={'user-plus'}
                                size={25}
                                color={'#C7D8DD'} />)
                            }}
                        onPress={()=>{
                            this.props.props.navigation.navigate("GroupMemberInvite", {'group_id':this.state.group_id})
                        }}>
                    </ActionButton>
                </View>
        );
    }
}

const mapStateToProps = (state) => {
    // console.log(state)

    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
        uid:getUid(state),
        profiles:state.auth.users.profiles,
        friends:state.auth.users.friends,
        groups:state.auth.users.groups,
    }
}

export default connect(mapStateToProps, actions)(ListGroupMember_TabMembersPage);