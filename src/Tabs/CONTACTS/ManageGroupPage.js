import React from 'react'
import {StyleSheet, 
        View, 
        Text, 
        TouchableOpacity,
        Alert,
        } from 'react-native'
        
import firebase from 'react-native-firebase';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
var _ = require('lodash');
import Spinner from 'react-native-loading-spinner-overlay';

import {getHeaderInset} from '../../Utils/Helpers'
import * as actions from '../../Actions'
import {getUid, checkInternetConnectionDialog} from '../../Utils/Helpers'

import MyIcon from '../../config/icon-font.js';

import Constant from '../../Utils/Constant'

class ManageGroupPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        headerTransparent: true,
        headerTitleStyle:{color:'white'},
        headerTintColor: 'white',
    });

    constructor(){
        super();
        this.state = { 
            loading:false,
            renderContent: false,
            group_id:0,
            group:{}
        }
    }

    componentDidMount() {
        setTimeout(() => {this.setState({renderContent: true})}, 0);

        const { navigation } = this.props;
        const group_id = navigation.getParam('group_id', null);

        this.setState({group_id},()=>{
            this.loadData(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps)
        this.loadData(nextProps)
    }

    loadData = (props) =>{
        let {groups, friends, uid} = props
        let {group_id} = this.state

        let group  = _.find(groups, (v, k)=>{
            return group_id == k
        })

        if(group === undefined){
            this.props.navigation.goBack(null)
        }

        // console.log(group)

        let members = {}
        _.each(group.members, (v, k)=>{
            if(v.status === Constant.GROUP_STATUS_MEMBER_JOINED){
                members = {...members, [k]:v}
            }
        })

        let count = Object.keys(members).length;
        if(count >= 5){
            count = 5
        }

        let keys = Object.keys(members);
        for (let i = 0; i < count; i++) {
            let {friend_id}= members[keys[i]]
            var friend_profile = _.find(friends, function(v, k) {
                // console.log(k, friend_id)
                return k == friend_id;
            });
            // console.log(friend_profile)

            if(friend_profile === undefined && uid !== friend_id){
                if(uid === friend_id){

                }else{
                    console.log(this.props.uid, friend_id)
                    // กรณีไม่ใช่ friend เราจะดึงจาก firestore โดยตรงแล้ว insert เข้าไเก้บใน friend
                    let pfriendRef = firebase.firestore().collection('profiles').doc(friend_id);
                    let getDoc = pfriendRef.get()
                    .then(doc => {
                        if (!doc.exists) {
                            console.log('No such document!');
                        } else {

                            let {members} = this.state.group

                            // var member = _.find(members, function(v, k) {
                            //     // console.log(k, friend_id)
                            //     return k == keys[i];
                            // });

                            members = {...members, [keys[i]]: {...members[keys[i]], friend:{profile:doc.data()} }}

                            let newGroup = {...this.state.group, members}
                            this.props.actionAddFriend(uid, friend_id, {'status':Constant.FRIEND_STATUS_FRIEND_99}, doc.data(), (result) => {
                                console.log(result)
                            })
                            this.setState({group: newGroup})
                        }
                    })
                    .catch(err => {
                        console.log('Error getting document', err);
                    });
                }
            }else{
                members = {...members, [keys[i]]:{...members[keys[i]], friend:friend_profile}}
            }
        }

        let newGroup = {...group, members}

        console.log(friends)
        console.log(newGroup)

        this.setState({group: newGroup})
    }

    itemMembers = (group) =>{
        // console.log(group)
        let {members} = group
        return Object.keys(members).map((key, v) => {
            if(v > 3){
                return;
            }

            let {friend, friend_id} = members[key]
            if(friend_id === this.props.uid){
                let {profiles} = this.props
                return(<TouchableOpacity key={friend_id} 
                            style={{marginRight:5}}
                            onPress={()=>{
                                this.props.navigation.navigate("MyProfilePage")
                            }}>
                            <FastImage
                                style={{width: 36, height: 36, borderRadius: 18}}
                                source={{
                                uri: profiles.image_url,
                                headers:{ Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>)
            }
            
            console.log(friend_id, friend)
            // let {friend} = members[key]
            // console

            if(friend === undefined){
                return(<TouchableOpacity key={friend_id} 
                    style={{marginRight:5}}
                    onPress={()=>{
                        this.props.navigation.navigate("FriendProfilePage",{'friend_id': friend_id})
                    }}>
                    <FastImage
                        style={{width: 36, height: 36, borderRadius: 18}}
                        source={{
                            uri: Constant.DEFAULT_AVATARSOURCE_URI,
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </TouchableOpacity>)
            }

            return(<TouchableOpacity key={friend_id} 
                        style={{marginRight:5}}
                        onPress={()=>{
                            this.props.navigation.navigate("FriendProfilePage",{'friend_id': friend_id})
                        }}>
                        <FastImage
                            style={{width: 36, height: 36, borderRadius: 18}}
                            source={{
                                uri: friend.profile.image_url,
                                headers:{ Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>)
            }
        )
    }

    render() {
        let {group_id, group} = this.state

        if (Object.keys(group).length == 0) {
            return(<View style={{flex:1, backgroundColor:'#DF2D6C'}}></View>)
        }

        let {isConnected} = this.props

        // console.log(group)
        // return(<View style={{flex:1, backgroundColor:'#DF2D6C'}}></View>)
        return (
                <View style={{flex:1, backgroundColor:'#DF2D6C', paddingTop:getHeaderInset()}}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}
                    />
                    <View style={{ alignItems:'center'}}>
                        <TouchableOpacity
                            style={{paddingTop:10}}>
                            <FastImage
                                style={{width: 120, height: 120, borderRadius: 60, borderWidth:4, borderColor:'#BCD1D5'}}
                                source={{
                                uri: group.group_profile.image_url,
                                headers:{ Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                        <View style={{padding:5, flexDirection:'row'}}>
                            <TouchableOpacity
                                style={{justifyContent:'center', alignItems:'center'}}
                                onPress={()=>{

                                    if(!isConnected){
                                        checkInternetConnectionDialog()
                                    }else{
                                        let is_favorites = true;
                                        if(group.is_favorites !== undefined){
                                            is_favorites = !group.is_favorites
                                        }
                                        this.setState({loading:true})
                                        this.props.actionFavoritesGroup(this.props.uid, group_id, is_favorites, (result) => {
                                            // console.log(result)
                                            this.setState({loading:false})
                                        })
                                    }
                                }}>
                                <MyIcon
                                    name={group.is_favorites ? 'star' : 'star-empty' } // star
                                    size={30}
                                    color={'#C7D8DD'} />
                            </TouchableOpacity>
                            <View style={{paddingLeft:5}}>
                                <Text style={{fontSize:26, fontWeight:'bold', textAlignVertical: 'bottom', color:'#BCD1D5'}}>{group.group_profile.name}</Text>
                            </View>
                        </View>
                        <View style={{padding:5, flexDirection:'row'}}>
                            {this.itemMembers(group)}
                            <TouchableOpacity 
                                style={{width: 36, height: 36, borderRadius: 18, justifyContent:'center', alignItems:'center', backgroundColor:'#BCD1D5'}}
                                onPress={()=>{
                                    this.props.navigation.navigate('ListGroupMemberPage', {group_id})
                                }}>
                                <Text style={{color:'white', fontWeight:'bold'}}>{group.members ?Object.keys(group.members).length:'0' }+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{position:'absolute', 
                                bottom:0, 
                                left:0, 
                                right:0, 
                                flexDirection:'row', 
                                alignItems:'center', 
                                justifyContent:'center', 
                                ...ifIphoneX({
                                    marginBottom: 40,
                                }, {
                                    marginBottom: 20,
                                })}}>
                        <TouchableOpacity style={{alignItems:'center'}}
                            onPress={()=>{
                                this.props.navigation.navigate("ChatPage")
                            }}>
                            <MyIcon
                                name={'chat'}
                                size={30}
                                color={'#C7D8DD'} />
                            <Text style={{fontWeight:'bold', color:'#BCD1D5', fontSize:16}}>CHAT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginLeft:30 ,alignItems:'center'}}
                            onPress={()=>{
                                this.props.navigation.navigate('GroupSettingsPage', {group_id})
                            }}>
                            <MyIcon
                                name={'settings'}
                                size={40}
                                color={'#C7D8DD'} />
                        </TouchableOpacity>
                    </View>
                </View>
            );
    }
}

const mapStateToProps = (state) => {
    console.log(state)
  
    // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
    //_persist.rehydrated parameter is initially set to false
    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
        uid:getUid(state),
        profiles:state.auth.users.profiles,
        groups:state.auth.users.groups,
        friends:state.auth.users.friends,
        isConnected:state.offline.online,
    }
}
export default connect(mapStateToProps, actions)(ManageGroupPage);