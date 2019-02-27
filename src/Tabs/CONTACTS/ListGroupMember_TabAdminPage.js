import React from 'react'
import {FlatList, 
        View, 
        Text, 
        TouchableOpacity,
        Alert,} from 'react-native'
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout'
import firebase from 'react-native-firebase';
import {
    MenuProvider,
    Menu,
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
  } from 'react-native-popup-menu';

import Spinner from 'react-native-loading-spinner-overlay';

var _ = require('lodash');
import * as actions from '../../Actions'
import {getUid, getHeaderInset} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';

class ListGroupMember_TabAdminPage extends React.Component{
    constructor(){
        super();
        this.state = { 
            loading: false,
            renderContent: false,
            group_id: 0,
            group: {},
            members: []
        }
    }

    componentWillMount(){
        let {group_id} = this.props.params
        this.setState({group_id}, ()=>{
            this.loadData(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData = (props) =>{
        let {group_id}  = this.state
        let {uid, groups, friends}    = props

        let group = _.find(groups,  function(v, k) { 
            return k == group_id
        })

        if(group === undefined){
            this.handleCancel()
        }

        console.log(group)

        let members = []
        // _.each(group.group_admins, (v, k)=>{
        //     let friend = _.find(friends, (fv, fk)=>{
        //         return v.uid == fk
        //     })

        //     // console.log(friend)
        //     if(friend === undefined){
        //         if(v.uid == uid){
        //             members.push({...v, group_admin_key:k})
        //         }else{
        //             // get from firestore
        //             firebase.firestore().collection('profiles').doc(v.friend_id).get()
        //             .then(doc => {
        //                 if (!doc.exists) {
        //                     console.log('No such document!');
        //                 } else {
        //                     console.log(doc.data())

        //                     // this.props.actionAddFriend(uid, friend_id, {'status':Constant.FRIEND_STATUS_FRIEND_99}, doc.data(), (result) => {
        //                     //     console.log(result)
        //                     // })
        //                 }
        //             })
        //             .catch(err => {
        //                 console.log('Error getting document', err);
        //             });
        //         }
        //     }else{
        //         members.push({...v, group_admin_key:k, friend})
        //     }
        // })

        _.each(group.members, (v, k)=>{
            console.log(v.is_admin)
            if(v.is_admin){
                let friend = _.find(friends, (fv, fk)=>{
                    return v.friend_id == fk
                })

                if(friend === undefined){
                    if(v.friend_id == uid){
                        members.push({...v, group_admin_key:k})
                    }else{
                        // get from firestore
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
                    members.push({...v, group_admin_key:k, friend})
                }
            }
        })

        this.setState({group, members})
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    showMenuAdmin = (item)=>{
        let {group_id, group}  = this.state

        let {uid} = this.props

        console.log(item, group_id, group)

        // console.log(item.uid, uid)

        

        // let count = Object.keys(group.group_admins).length

        let count = (_.filter(group.members, (v, k)=>{
                        return v.is_admin
                    })).length
        console.log(count)

        let menu = <View />
        if(count == 1){
            menu = <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset() + 50)}}>
                    <MenuOption onSelect={() => {
                        Alert.alert(
                            'Set a new admin',
                            'You can choose a new admin from the people listed under members, if you leave the group without choosing a new admin, the most senior group member will become the admin.',
                            [
                            {text: 'Choose admin', onPress: () => {
                                    this.props.handlerGoToPage(0)
                            }},
                            {text: 'Leave group', onPress: () => console.log('Leave group')},
                            {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            //   {text: 'OK', onPress: () => console.log('OK Pressed')},
                            ],
                            {cancelable: false},
                        );
                    }}>
                        <Text style={{padding:10, fontSize:18}}>Leave group</Text>
                    </MenuOption>
                    </MenuOptions>
        }else if(count > 1){
            menu =  <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset() + 50)}}>
                    <MenuOption onSelect={() => {
                        Alert.alert(
                            'Remove as group admin.',
                            'Once you remove yourself as admin, only other admins in the group can make you an admin agin.',
                            [
                            {text: 'Remove admin', onPress: () => {
                                // console.log('Remove admin')
                                this.setState({loading:true})
                                this.props.actionRemoveAsAdminGroup(uid, group_id, item.friend_id, (result) => {
                                    this.setState({loading:false})

                                    console.log(result)
                                })
                            }},
                            {text: 'Cancel', style: 'cancel', onPress: () => {
                                // this.props.handlerGoToPage(0)
                                console.log('Cancel')
                            }},
                            ],
                            {cancelable: false},
                        );
                        }}>
                        <Text style={{padding:10, fontSize:18}}>Remove as admin</Text>
                    </MenuOption>
                    
                    {item.friend_id == uid ? <View />:   <MenuOption onSelect={() => { 
                                                            this.props.props.navigation.navigate("FriendProfilePage",{'friend_id': item.uid})
                                                        }}>
                                                        <Text style={{padding:10, fontSize:18}}>View profile</Text>
                                                    </MenuOption>}

                    <MenuOption onSelect={() => { }}>
                        <Text style={{padding:10, fontSize:18}}>Leave group</Text>
                    </MenuOption>
                    </MenuOptions>
        }


        return( <View style={{position:'absolute', right:0, marginRight:10}}><Menu>
                    <MenuTrigger>
                        <MyIcon 
                            style={{padding:10}}
                            name={'dot-horizontal'}
                            size={15}
                            color={'#C7D8DD'} />  
                    </MenuTrigger>
                    {menu}
                </Menu></View>)
    }

    checkInvitor = (item) =>{

        let {uid} = this.props
        let {group} = this.state

        console.log(item, uid, group)
        if(item.friend_id === uid){
            if(item.friend_id === group.group_profile.creator_id){
                return(<Text style={{fontSize:12, color:'gray'}}>Group Creator, Admin</Text>)
            }
        }else{
            return(<Text style={{fontSize:12, color:'gray'}}>Admin</Text>)
        }

        // let {friends} = this.props
        // // rowItem.friend_id === this.state.group_profile.creator_id?<Text style={{fontSize:12, color:'gray'}}>Group Creator</Text>:<View />
    
        // if(rowItem.friend_id === this.state.group_profile.creator_id){
        //     return(<Text style={{fontSize:12, color:'gray'}}>Group Creator</Text>)
        // }else {
            // if(rowItem.invitor != 0){

            //     if(rowItem.invitor === this.props.uid){
            //         return(<Text style={{fontSize:12, color:'gray'}}>Added by You</Text>)
            //     }

            //     let member = _.find(this.state.group.members, (mv, mk)=>{
            //         // return rowItem.invitor == mv.friend_id
            //         return '1'
            //     })

            //     // console.log(member)

            //     var friend_profile = _.find(friends, function(fv, fk) {
            //         return fk == member.friend_id;
            //     });

            //     let friend_name = ''
            //     if(friend_profile !== undefined){
            //         friend_name = friend_profile.profile.name
            //     }

            //     return(<Text style={{fontSize:12, color:'gray'}}>Added by {friend_name}</Text>)
            // }
        // }
        return(<View />)
    }

    renderItem = ({item, index}) => { 
        console.log(item)

        let {uid} = this.props
       
        if(item.friend_id === uid){
            let {profiles} = this.props
            return(<View style={{height:100, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                        <TouchableOpacity>
                            <FastImage
                                style={{width: 60,  
                                        height: 60,
                                        borderRadius: 10, 
                                        borderColor:'gray', 
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
                        <View style={{marginLeft:5}}>
                            <View style={{flexDirection:'row', alignItems:'baseline'}}>
                                <Text style={{fontSize:18}}>{profiles.name}</Text>
                                <Text style={{fontSize:12, fontStyle:'italic', color:'gray'}}>(You)</Text>
                                
                            </View>
                            {this.checkInvitor(item)}
                        </View>
                        {this.showMenuAdmin(item)}
                    </View>)
        }

        return(<View style={{height:100, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
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
                                uri: item.friend.profile.image_url,
                                headers:{ Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.normal}
                        />
                    </TouchableOpacity>
                    <View style={{marginLeft:5}}>
                        <View style={{justifyContent:'center'}}>
                            <Text style={{fontSize:18}}>{item.friend.profile.name}</Text>
                            
                        </View>
                        {this.checkInvitor(item)}
                    </View>
                    {this.showMenuAdmin(item)}
                </View>)
    }
      
    render() {
        let {members} = this.state
        return(<MenuContext>
                <View style={{flex:1}} >
                    <Spinner
                        visible={this.state.loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}/>
                    <FlatList
                        data = {members}
                        renderItem={this.renderItem}
                        extraData={this.state}/>
                </View>
                </MenuContext>)
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
        uid:getUid(state),
        profiles:state.auth.users.profiles,
        friends:state.auth.users.friends,
        groups:state.auth.users.groups
    }
}

export default connect(mapStateToProps, actions)(ListGroupMember_TabAdminPage);