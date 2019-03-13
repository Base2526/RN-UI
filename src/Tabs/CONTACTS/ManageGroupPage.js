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
import {checkInternetConnectionDialog} from '../../Utils/Helpers'

import MyIcon from '../../config/icon-font.js';
import Constant from '../../Utils/Constant'

import {makeUidState,
        makeProfileState, 
        makeGroupsState,
        makeGroupProfilesState,
        makeFriendsState,
        makeFriendProfilesState,
        makeIsConnectedState,} from '../../Reselect'

class ManageGroupPage extends React.Component{

    static navigationOptions = ({ navigation }) => {

        let menuHeaderRight = <View style={{flexDirection:'row', flex:1, marginRight:10}}>
                                <TouchableOpacity style={{paddingRight:10}}
                                    onPress={()=>{
                                        const { params = {} } = navigation.state
                                        if(Object.keys(params).length !== 0){
                                            params.handleChat()
                                        }
                                    }}>
                                    <MyIcon
                                        name={'friend-chat'}
                                        size={25}
                                        color={'#C7D8DD'} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{paddingRight:10}}
                                    onPress={()=>{
                                        const { params = {} } = navigation.state
                                        if(Object.keys(params).length !== 0){
                                            params.handleSettings()
                                        }
                                    }}>
                                    <MyIcon
                                        name={'settings'}
                                        size={25}
                                        color={'#C7D8DD'} />
                                </TouchableOpacity>
                            </View>

        return {
            headerTransparent: true,
            headerTitleStyle:{color:'white'},
            headerTintColor: 'white',
            headerRight: (
                menuHeaderRight
            ),
        }
    };

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

        this.props.navigation.setParams({handleChat: this.handleChat})
        this.props.navigation.setParams({handleSettings: this.handleSettings})
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
        let {groups, friends, uid, friend_profiles, group_profiles} = props
        let {group_id} = this.state

        let group  = _.find(groups, (v, k)=>{
            return group_id == k
        })

        if(group === undefined){
            this.props.navigation.goBack(null)
        }
       

        let group_profile = _.find(group_profiles, (v, k)=>{
                                return group_id == k
                            })

        console.log(group, group_profile)

        let members = {}
        _.each(group_profile.members, (v, k)=>{
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
        
            let friend_profile =_.find(friend_profiles, (fv, fk)=>{
                return fk == friend_id
            })
            console.log(friend_profile)

            if(!friend_profile){
                if(uid === friend_id){
                    console.log('my profile')
                }else{
                    /*
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

                            members = {...members, [keys[i]]: {...members[keys[i]], friend:doc.data() }}

                            let newGroup = {...this.state.group, members}
                            // this.props.actionAddFriend(uid, friend_id, {'status':Constant.FRIEND_STATUS_FRIEND_99}, doc.data(), (result) => {
                            //     console.log(result)
                            // })
                            this.setState({group: newGroup})
                        }
                    })
                    .catch(err => {
                        console.log('Error getting document', err);
                    });
                    */


                    this.props.actionFriendProfile99(uid, friend_id).then((result) => {
                        // this.setState({friend_id, loading:false}, ()=>{
                        //     // this.loadData(this.props)
                        // })

                        console.log(result)
                    })
                }
            }else{
                members = {...members, [keys[i]]:{...members[keys[i]], friend:friend_profile}}
            }
        }

        let newGroup = {...group, profile:group_profile, members}

        console.log(friends)
        console.log(newGroup)

        this.setState({group: newGroup})
    }

    handleChat = () => {
        this.props.navigation.navigate("ChatPage")
    }

    handleSettings = () => {
        this.props.navigation.navigate('GroupSettingsPage', {group_id:this.state.group_id})
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
                let {profile} = this.props
                return(<TouchableOpacity key={friend_id} 
                            style={{marginRight:5}}
                            onPress={()=>{
                                this.props.navigation.navigate("MyProfilePage")
                            }}>
                            <FastImage
                                style={{width: 36, height: 36, borderRadius: 18}}
                                source={{
                                uri: profile.image_url,
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
                                uri: friend.image_url,
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
                                uri: group.profile.image_url,
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
                                            console.log(result)
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
                                <Text style={{fontSize:26, fontWeight:'bold', textAlignVertical: 'bottom', color:'#BCD1D5'}}>{group.profile.name}</Text>
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
                    </View>
                </View>
            );
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(state)
  
    // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
    //_persist.rehydrated parameter is initially set to false
    if(!state._persist.rehydrated){
        return {}
    }

    if(!state.auth.isLogin){
        return;
    }
    
    return{
        // uid:getUid(state),
        // profiles:state.auth.users.profiles,
        // groups:state.auth.users.groups,
        // friends:state.auth.users.friends,
        // friend_profiles:state.auth.users.friend_profiles,
        // isConnected:state.offline.online,

        uid: makeUidState(state, ownProps),
        profile: makeProfileState(state, ownProps),
        groups: makeGroupsState(state, ownProps),
        group_profiles:makeGroupProfilesState(state, ownProps),
        friends: makeFriendsState(state, ownProps),
        friend_profiles: makeFriendProfilesState(state, ownProps),
        isConnected: makeIsConnectedState(state, ownProps),
    }
}
export default connect(mapStateToProps, actions)(ManageGroupPage);