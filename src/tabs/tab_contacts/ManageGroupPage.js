import React from 'react'
import {StyleSheet, 
        View, 
        Text, 
        TouchableOpacity,
        Alert,
        Platform
        } from 'react-native'
 
import { Header } from 'react-navigation';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import { isIphoneX, ifIphoneX } from 'react-native-iphone-x-helper';
var _ = require('lodash');
import Spinner from 'react-native-loading-spinner-overlay';

import {isEmpty} from '../../utils/Helpers'
import * as actions from '../../actions'
import {checkInternetDialog} from '../../utils/Helpers'

import MyIcon from '../../config/icon-font.js';
import Constant from '../../utils/Constant'

import {makeUidState,
        makeProfileState, 
        makeGroupsState,
        makeGroupProfilesState,
        makeGroupMembersState,
        makeFriendsState,
        makeIsConnectedState,
    
        makePresencesState} from '../../reselect'

let unsubscribes = []
class ManageGroupPage extends React.Component{
    static navigationOptions = {  
        header: null ,
    }

    constructor(){
        super();
        this.state = { 
            loading:false,
            renderContent: false,
            group_id:0,
            group:{},

            group_member:{},
            member_is_join:false, // ตัวบอกว่า member คนนี้ ตอบรับการเชิญแล้วหรือยัง
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

        let {uid, friends, group_members} = this.props

        let group_member =  _.find(group_members, (v, k)=>{
                                return k == group_id
                            })

        this.props.trackGroupMember_Profile(uid, friends, group_id, group_member, (data)=>{
            unsubscribes.push(data.unsubscribe)
        })
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps)
        this.loadData(nextProps)
    }

    loadData = (props) =>{
        let {groups, 
            group_members, 
            friends, 
            uid, 
            group_profiles, 
            presences} = props
        let {group_id} = this.state

        let group  = _.find(groups, (v, k)=>{
            return group_id == k
        })

        if( isEmpty(group) ){
            this.props.navigation.goBack(null)
            return
        }
       
        let group_profile = _.find(group_profiles, (v, k)=>{
                                return group_id == k
                            })

        let group_member =  _.find(group_members, (v, k)=>{
                                return group_id == k
                            })

        if( isEmpty(group_member) ){
            this.props.navigation.goBack(null)
            return
        }

        let member =_.find(group_member, (v, k)=>{
                        return v.friend_id == uid
                    })

        // console.log(member)

        if( isEmpty(group_member) ){
            return 
        }

        let member_is_join = false
        switch(member.status){
            case Constant.GROUP_STATUS_MEMBER_INVITED:{
                break;
            }

            case Constant.GROUP_STATUS_MEMBER_JOINED:{
                member_is_join=true
                break;
            }

            default:{
                this.props.navigation.goBack(null)
            }
        }
        // check GROUP STATUS MEMBER

        group_profile = {...group_profile, members:group_member}

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
        
            let friend =_.find(friends, (fv, fk)=>{
                            return fk == friend_id
                        })    
                        
            if(!isEmpty(friend)){
                // check online/offline
                let presence =  _.find(presences, (presences_v, presences_k)=>{
                                    return presences_k == friend_id
                                })

                let is_online = false
                if(presence !== undefined){
                    let __ =_.find(presence, (presence_v, presence_k)=>{
                                return presence_v.status == 'online'
                            })
                    if(__ !== undefined){
                        is_online = true
                    }
                }
                friend = {...friend, is_online}
                // check online/offline

                members = {...members, [keys[i]]:{...members[keys[i]], friend}}
            }
        }

        this.setState({ group: {...group, ...group_profile, members}, 
                        member_is_join, 
                        group_member})
    }

    handleChat = () => {
        let {group} = this.state

        // @work
        let params = {'type':'group', 'data':group}
        this.props.navigation.navigate("ChatPage", {'title':'Group ' + group.name, params})
    }

    handleSettings = () => {
        this.props.navigation.navigate('GroupSettingsPage', {group_id:this.state.group_id})
    }

    countMembers = (members) =>{
        console.log('members', members)
        return (_.filter(members, (v, k)=>{
                  return v.status === Constant.GROUP_STATUS_MEMBER_JOINED
                })).length
    }

    itemMembers = (group) =>{
        // console.log(group)
        let {members} = group
        return Object.keys(members).map((key, v) => {
            if(v > 3){
                return;
            }

            console.log(members[key])
            let {friend, friend_id, is_online} = members[key]
            if(friend_id === this.props.uid){
                let {profile} = this.props
                return(<TouchableOpacity key={friend_id} 
                            style={{marginRight:5}}
                            onPress={()=>{
                                this.props.navigation.navigate("MyProfilePage")
                            }}>
                            <FastImage
                                style={{width: 36, 
                                        height: 36, 
                                        borderRadius: 18,
                                        // borderColor:'white',
                                        // borderWidth:1
                                    }}
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

            // if(friend === undefined){
            //     return(<TouchableOpacity key={friend_id} 
            //         style={{marginRight:5}}
            //         onPress={()=>{
            //             this.props.navigation.navigate("FriendProfilePage",{'friend_id': friend_id})
            //         }}>
            //         <FastImage
            //             style={{width: 36, 
            //                     height: 36, 
            //                     borderRadius: 18,
            //                     borderColor:is_online ? '#00ff80':'white',
            //                     borderWidth:1
            //                 }}
            //             source={{
            //                 uri: Constant.DEFAULT_AVATARSOURCE_URI,
            //                 headers:{ Authorization: 'someAuthToken' },
            //                 priority: FastImage.priority.normal,
            //             }}
            //             resizeMode={FastImage.resizeMode.cover}
            //         />
            //     </TouchableOpacity>)
            // }

            return(<TouchableOpacity key={friend_id} 
                        style={{marginRight:5}}
                        onPress={()=>{
                            this.props.navigation.navigate("FriendProfilePage",{'friend_id': friend_id})
                        }}>
                        <FastImage
                            style={{width: 36, 
                                    height: 36, 
                                    borderRadius: 18,
                                    borderColor:friend.is_online ? '#00ff80':'white',
                                    borderWidth:1
                                }}
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
        let {group_id, group, member_is_join, group_member} = this.state

        if (Object.keys(group).length == 0) {
            return(<View style={{flex:1, backgroundColor:'#DF2D6C'}}></View>)
        }

        let {uid, is_connected} = this.props

        // console.log(group)
        // return(<View style={{flex:1, backgroundColor:'#DF2D6C'}}></View>)
        let button_arrow_back = <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                    <MyIcon
                                        name={'ios-arrow-left'}
                                        size={25}
                                        color={'#C7D8DD'} />
                                        <Text style={{color:'#C7D8DD', paddingLeft:8, fontSize:18}}>Back</Text>
                                </View>
        if(Platform.OS != "ios"){
            button_arrow_back = <MyIcon
                                    name={'android-arrow-left'}
                                    size={20}
                                    color={'#C7D8DD'} />
        }

        let memu_right = <View style={{ flexDirection:'row', 
                                        position:'absolute', 
                                        right:0,}}>
                            <TouchableOpacity 
                                style={{padding:10}}
                                onPress={()=>{
                                    if(!is_connected){
                                        checkInternetDialog()
                                        return 
                                      }

                                      let member_key =  _.findKey(group_member,  function(v, k) { 
                                                            return v.friend_id == uid
                                                        })
            
                                      if(member_key){
                                        this.setState({loading:true})
                                        this.props.actionMemberDeclineGroup(uid, group_id, member_key, (result) => {
                                          setTimeout(() => {
                                            this.setState({loading:false})

                                            this.props.navigation.goBack(null)
                                          }, 200);
                                        })
                                      }else{
                                        console.log(member_key)
                                      }
                                }}>
                                <Text style={{color:'#C7D8DD', fontSize:18}}>Decline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{padding:10}}
                                onPress={()=>{
                                    if(!is_connected){
                                        checkInternetDialog()
                                        return 
                                    }

                                    let member_key =_.findKey(group_member,  function(v, k) { 
                                                        return v.friend_id == uid
                                                    })
                                    // console.log(member_key)

                                    console.log(member_key)
                                    if(member_key){
                                        this.setState({loading:true})
                                        this.props.actionMemberJoinGroup(uid, group_id, member_key, (result) => {
                                            console.log(result)
                                            setTimeout(() => {
                                                this.setState({loading:false})
                                            }, 200);
                                        })
                                    }else{
                                        console.log(member_key)
                                    }

                                }}>
                                <Text style={{color:'#C7D8DD', fontSize:18}}>Join</Text>
                            </TouchableOpacity>
                        </View> 
        if(member_is_join){
            memu_right =<View style={{ flexDirection:'row', 
                                        position:'absolute', 
                                        right:0,}}>
                            <TouchableOpacity 
                                style={{padding:10}}
                                onPress={()=>{
                                    this.handleChat()
                                }}>
                                <MyIcon
                                    name={'friend-chat'}
                                    size={25}
                                    color={'#C7D8DD'} />

                            </TouchableOpacity>
                            <TouchableOpacity style={{  padding:10}}
                                                        onPress={()=>{
                                                            this.handleSettings()
                                                        }}>
                                <MyIcon
                                    name={'settings'}
                                    size={25}
                                    color={'#C7D8DD'} />
                            </TouchableOpacity>
                        </View>
        }

        let button_favorites = <View />
        if(member_is_join){
            button_favorites = <TouchableOpacity
                                    style={{justifyContent:'center', alignItems:'center'}}
                                    onPress={()=>{

                                        if(!is_connected){
                                            checkInternetDialog()
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
        }
        
        return (
                <View style={{flex:1, backgroundColor:'#DF2D6C' /*, paddingTop:getHeaderInset()*/ }}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}
                    />
                    <View style={{height:Header.HEIGHT +  (isIphoneX() ? 25 : 0), //- (Platform.OS == "ios" ? 20 : 0), 
                              backgroundColor: '#DF2D6C',
                              justifyContent: Platform.OS == "ios" ?'flex-end':'center'}}>

                        <View style={{ flexDirection:'row', position:'absolute'}}>
                            <TouchableOpacity
                                style={{padding:10}}
                                onPress={()=>{
                                    this.props.navigation.goBack(null)
                                }}>
                                {button_arrow_back}
                            </TouchableOpacity>
                        </View>
                        {memu_right}
                    </View>

                    <View style={{ alignItems:'center'}}>
                        <TouchableOpacity
                            style={{paddingTop:10}}>
                            <FastImage
                                style={{width: 120, height: 120, borderRadius: 60, borderWidth:4, borderColor:'#BCD1D5'}}
                                source={{
                                uri: group.image_url,
                                headers:{ Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                        <View style={{padding:5, flexDirection:'row'}}>
                            {button_favorites}
                            <View style={{paddingLeft:5}}>
                                <Text style={{fontSize:26, fontWeight:'bold', textAlignVertical: 'bottom', color:'#BCD1D5'}}>{group.name}</Text>
                            </View>
                        </View>
                        <View style={{padding:5, flexDirection:'row'}}>
                            {this.itemMembers(group)}
                            <TouchableOpacity 
                                style={{width: 36, height: 36, borderRadius: 18, justifyContent:'center', alignItems:'center', backgroundColor:'#BCD1D5'}}
                                onPress={()=>{
                                    this.props.navigation.navigate('ListGroupMemberPage', {'group_id': group_id})
                                }}>
                                <Text style={{color:'white', fontWeight:'bold'}}>{ this.countMembers(group.members) }+</Text>
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
    // console.log(state)
  
    // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
    //_persist.rehydrated parameter is initially set to false
    if(!state._persist.rehydrated){
        return {}
    }

    if(!state.auth.isLogin){
        return;
    }
    
    return{
        uid: makeUidState(state, ownProps),
        profile: makeProfileState(state, ownProps),
        groups: makeGroupsState(state, ownProps),
        group_profiles: makeGroupProfilesState(state, ownProps),
        group_members: makeGroupMembersState(state, ownProps),

        friends: makeFriendsState(state, ownProps),
        is_connected: makeIsConnectedState(state, ownProps),


        presences:makePresencesState(state, ownProps),
    }
}
export default connect(mapStateToProps, actions)(ManageGroupPage);