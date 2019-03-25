import React from 'react'
import {StyleSheet, 
        View, 
        Text, 
        TouchableOpacity,} from 'react-native'

import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import Spinner from 'react-native-loading-spinner-overlay';
var _ = require('lodash');

import {getHeaderInset, getUid} from '../../utils/Helpers'
import * as actions from '../../actions'
import MyIcon from '../../config/icon-font.js';

import {makeUidState, 
        makeClasssState,
        makeClassMembersState,
        makeFriendsState, 
        makeFriendProfilesState} from '../../reselect'

class ManageClasssPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        headerTransparent: true,
        headerTitleStyle:{color:'white'},
        headerTintColor: 'white',
    });

    constructor(){
        super();
    
        this.state = { 
            renderContent: false,
            class_id: 0,
            data: {}
        }
    }

    componentDidMount() {
        setTimeout(() => {this.setState({renderContent: true})}, 0);
        const { navigation} = this.props;
        const class_id = navigation.getParam('class_id', null)

        this.setState({class_id},()=>{
            this.loadData(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData = (props) => {
        // console.log()
        let {classs, class_members, friends, friend_profiles} = props
        let {class_id} = this.state

        let cla = _.find(classs,  function(v, k) { 
            return k == class_id
        })

        if(cla === undefined){
            this.props.navigation.goBack()
            return;
        }

        let class_member =  _.find(class_members, (v, k)=>{
                                return k == class_id
                            })

        if(class_member){
            let data =  _.map(class_member, (v, k)=>{
                            var friend_profile = _.filter(friends, function(v, k) {
                                                    return k == value.friend_id;
                                                });

                            return {...v, friend_profile}
                        })

            this.setState({data})
        }

        /*
        let members ={}
        Object.entries(_class.members).forEach(([key, value]) => {
            if(!value.status){
                return;
            }
            var friend_profile = _.filter(friends, function(v, k) {
                return k == value.friend_id;
            });

            if(friend_profile.length == 0){

            }else{
                members = {...members, [key]:{...value, friend_profile:friend_profile[0]}}                
            }
        })

        let newData = {...{..._class}, members}
        this.setState({data:newData})
        */
    }

    countMembers = (item) =>{
        let count = 0
        if(item.members !== undefined){
          _.each(item.members, function(_v, _k) { 
              if(_v.status){
                count++
              } 
          })
        }
        return count
    }

    itemMembers = (data) =>{
        let {members} = data

        console.log(members)
        return Object.keys(members).map((key, v) => {
            let {profile} = members[key].friend_profile
            // console.log(v)
            if(v > 3){
                return
            }

            return(<TouchableOpacity key={members[key].friend_id} style={{marginRight:5}}>
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
        })
    }

    render() {
        let {data} = this.state
        if (Object.keys(data).length == 0) {
            return(<View style={{flex:1, backgroundColor:'#DF2D6C'}}></View>)
        }
        
        // console.log(data)
        // console.log(this.state.class_id)
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
                    style={{height: 120,
                            width: 120,
                            borderRadius: 60,
                            borderColor:'#BCD1D5',
                            borderWidth:5,
                            justifyContent:'center',
                            alignItems:'center'
                            }}>
                  <FastImage
                    style={{width: 100, 
                            height: 100, 
                            borderRadius: 50,
                            borderColor:'#BCD1D5',
                            borderWidth:5,}}
                    source={{
                        uri: data.image_url,
                        headers:{ Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </TouchableOpacity>
                <View style={{padding:5, flexDirection:'row'}}>
                    <TouchableOpacity
                    onPress={()=>{
                        let is_favorites = true;
                        if(data.is_favorites !== undefined){
                            is_favorites = !data.is_favorites
                        }

                        this.setState({loading:true})
                        this.props.actionFavoritesClass(this.props.uid, this.state.class_id, is_favorites, (result) => {
                            console.log(result)

                            this.setState({loading:false})
                        })
                    }}>
                        <MyIcon
                            name={data.is_favorites ? 'star' : 'star-empty' } // star
                            // name={'star'}
                            size={30}
                            color={'#C7D8DD'} />
                    </TouchableOpacity>
                    <View style={{paddingLeft:5}}>
                        <Text style={{fontSize:26, fontWeight:'bold', textAlignVertical: 'bottom', color:'#BCD1D5'}}>{data.name}</Text>
                    </View>
                </View>
                <View style={{padding:5, flexDirection:'row'}}>
                    {this.itemMembers(data)}
                    <TouchableOpacity 
                        style={{width: 36, height: 36, borderRadius: 18, justifyContent:'center', alignItems:'center', backgroundColor:'#BCD1D5'}}
                        onPress={()=>{
                            this.props.navigation.navigate("ListClassMemberPage", {'class_id': this.state.class_id})
                        }}>
                        <Text style={{color:'white', fontWeight:'bold'}}>{Object.keys(data.members).length}+</Text>
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
                        // backgroundColor:'blue',
                        ...ifIphoneX({
                            marginBottom: 40,
                        }, {
                            marginBottom: 20,
                        })}}>
                <TouchableOpacity style={{alignItems:'center', marginRight:30}}
                    onPress={()=>{
                        this.props.navigation.navigate("ChatPage")
                    }}>
                        <MyIcon
                            name={'chat'}
                            size={30}
                            color={'#C7D8DD'} />
                    <Text style={{fontWeight:'bold', color:'#BCD1D5', fontSize:16}}>CHAT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems:'center'}}
                    onPress={()=>{
                        this.props.navigation.navigate('ClasssSettingsPage')
                    }}>
                    <MyIcon
                        name={'settings'}
                        size={40}
                        color={'#C7D8DD'} />
                </TouchableOpacity>
            </View>
        </View>
        )
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
        // uid:getUid(state),
        // friends:state.auth.users.friends,
        // classs:state.auth.users.classs,

        uid:makeUidState(state, ownProps),
        friends:makeFriendsState(state, ownProps),
        friend_profiles:makeFriendProfilesState(state, ownProps),
        classs:makeClasssState(state, ownProps),
        class_members:makeClassMembersState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(ManageClasssPage);