import React from 'react'
import {StyleSheet, 
        View, 
        Text, 
        TouchableOpacity,
        } from 'react-native'

import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
var _ = require('lodash');
import Spinner from 'react-native-loading-spinner-overlay';

import {getHeaderInset} from '../../Utils/Helpers'
import * as actions from '../../Actions'
import {getUid} from '../../Utils/Helpers'

import MyIcon from '../../config/icon-font.js';

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
            group:{}
        }
    }

    componentDidMount() {
        setTimeout(() => {this.setState({renderContent: true})}, 0);

        const { navigation, auth } = this.props;
        const group_id = navigation.getParam('group_id', null);

        let groups = this.props.auth.users.groups;

        let friends = auth.users.friends
        
        Object.entries(groups).forEach(([key, value]) => {
            if(group_id === key){
                let {members} = value

                let newMembers = {...members}
                Object.entries(members).forEach(([mkey, mvalue]) => {

                    var friend_profile = _.filter(friends, function(v, k) {
                        return k == mvalue.friend_id;
                    });

                    if(friend_profile.length == 0){
                        newMembers = {...newMembers, [mkey]:mvalue}
                    }else{
                        let mm = {...mvalue, ...{friend_profile:friend_profile[0]} }
                        newMembers = {...newMembers, [mkey]:mm}
                    }

                    let group = {...{group_id:key, ...value}, 
                                    group_profile:{
                                        ...value.group_profile,
                                        members:newMembers
                                    },
                                    members:newMembers
                                }

                    this.setState({
                        group
                    })
                })
                return;
            }
        });
    }

    itemMembers = (group) =>{
        let {members} = group
        return Object.keys(members).map((key, v) => {
            if(v > 3){
                return;
            }

            let friend = members[key]
            if(friend.friend_id === this.props.uid){
                let {profiles} = this.props.auth.users
                return(<TouchableOpacity key={friend.friend_id} style={{marginRight:5}}>
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
            
            let {profile} = members[key].friend_profile

            return(<TouchableOpacity key={friend.friend_id} style={{marginRight:5}}>
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
        )
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)

        const { navigation, auth } = this.props;
        const group_id = navigation.getParam('group_id', null);

        // console.log(group_id)

        let groups = nextProps.auth.users.groups;
        let friends = auth.users.friends
        
        Object.entries(groups).forEach(([key, value]) => {
            if(group_id === key){
                let {members} = value

                let newMembers = {...members}
                Object.entries(members).forEach(([mkey, mvalue]) => {

                    var friend_profile = _.filter(friends, function(v, k) {
                        return k == mvalue.friend_id;
                    });

                    if(friend_profile.length == 0){
                        newMembers = {...newMembers, [mkey]:mvalue}
                    }else{
                        let mm = {...mvalue, ...{friend_profile:friend_profile[0]} }
                        newMembers = {...newMembers, [mkey]:mm}
                    }

                    let group = {...{group_id:key, ...value}, 
                                    group_profile:{
                                        ...value.group_profile,
                                        members:newMembers
                                    },
                                    members:newMembers
                                }

                    this.setState({
                        group
                    })
                })
                return;
            }
        });
    }

    render() {
        let {group} = this.state

        if (Object.keys(group).length == 0) {
            return(<View style={{flex:1, backgroundColor:'#DF2D6C'}}></View>)
        }

        console.log(group)
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
                                    let is_favorites = false;
                                    if(group.is_favorites !== undefined){
                                        is_favorites = group.is_favorites
                                    }

                                    this.setState({loading:true})
                                    this.props.actionFavoritesGroup(this.props.uid, group.group_id, !is_favorites, (result) => {
                                        console.log(result)

                                        this.setState({loading:false})
                                    })
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
                                    this.props.navigation.navigate('ListGroupMemberPage', {group})
                                }}>
                                <Text style={{color:'white', fontWeight:'bold'}}>{Object.keys(group.members).length}+</Text>
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
                                this.props.navigation.navigate('GroupSettingsPage', {group})
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
        auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(ManageGroupPage);