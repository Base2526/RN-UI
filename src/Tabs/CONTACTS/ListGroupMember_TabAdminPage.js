import React from 'react'
import {FlatList, 
        View, 
        Text, 
        TouchableOpacity,} from 'react-native'

import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout'
import firebase from 'react-native-firebase';

var _ = require('lodash');
import * as actions from '../../Actions'
import {getUid} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';

class ListGroupMember_TabAdminPage extends React.Component{
    constructor(){
        super();
        this.state = { 
            renderContent: false,
            data:[],
            group_id: 0,
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

        let members = []
        _.each(group.group_admins, (v, k)=>{
            let friend = _.find(friends, (fv, fk)=>{
                return v.uid == fk
            })

            // console.log(friend)
            if(friend === undefined){
                if(v.uid == uid){
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
        })

        console.log(members)

        this.setState({members})
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    renderItem = ({item, index}) => { 
        console.log(item)

        let {uid} = this.props

        if(item.uid === uid){

            let swipeoutRight = [
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

            let {profiles} = this.props
            return(<Swipeout 
                    style={{backgroundColor:'white'}} 
                    right={swipeoutRight}>
                    <View style={{height:100, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
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
                        <View style={{flex:1, flexDirection:'row', alignItems:'baseline', marginLeft:5}}>
                            <Text style={{fontSize:18}}>{profiles.name}</Text>
                            <Text style={{fontSize:12, fontStyle:'italic', color:'gray'}}>(You)</Text>
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
                    </View>
                    </Swipeout>)
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
                    <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                        <Text style={{fontSize:18}}>{item.friend.profile.name}</Text>
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
      
    render() {
        let {members} = this.state

        console.log(members)
        return(<View style={{flex:1}} >
                <FlatList
                    data = {members}
                    renderItem={this.renderItem}
                    extraData={this.state}/>
                </View>)
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