import React from 'react'
import {FlatList, 
        StyleSheet, 
        View, 
        Text, 
        Alert, 
        Platform, 
        TouchableOpacity,
        ScrollView,
        SafeAreaView,
        } from 'react-native'

import { Header } from 'react-navigation';

import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
var _ = require('lodash');

import Image from 'react-native-remote-svg'

import {getStatusBarHeight, getHeaderInset} from '../../Utils/Helpers'
import GroupBackgroundImage from '../../test/group-image-with-text'
import PlaceHolderFastImage from '../../Utils/PlaceHolderFastImage'
import * as actions from '../../Actions'

import {getUid} from '../../Utils/Helpers'

class ManageGroupPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        headerTransparent: true,
        headerTitleStyle:{color:'white'},
        headerTintColor: 'white',
        // headerRight: (
            // <View style={{flexDirection:'row', flex:1}}>
            //     <TouchableOpacity 
            //         style={{paddingRight:10}}
            //         onPress={()=>{
            //             Alert.alert(
            //                 '',
            //                 'If you leave this group, you\'ll no longer be able to see its member list or chat history Continue?',
            //                 [
            //                 //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
            //                   {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            //                   {text: 'OK', onPress: () => console.log('OK Pressed')},
            //                 ],
            //                 { cancelable: false }
            //               )
            //         }}>
            //         <Text style={{color:'red', fontSize:16, borderWidth: 1, borderColor: 'red', borderRadius: 12, padding: 8, overflow:"hidden",}}>Leave group</Text>
            //     </TouchableOpacity> 
            // </View>
        // ),
    });

    constructor(){
        super();
    
        this.state = { 
            renderContent: false,
            group:{}
        }
    }

    componentDidMount() {
        setTimeout(() => {this.setState({renderContent: true})}, 0);


        const { navigation, auth } = this.props;
        const group_id = navigation.getParam('group_id', null);
        // console.log(group_id)

        let groups = this.props.auth.users.groups;

        // let group = null
        // _.each(groups, function(_v, _k) { 
        //     if(group_id === _k){
        //         group = {group_id:_k, ..._v}

        //         break;
        //     }
        // });

        let friends = auth.users.friends
        

        // let f= friends.filter(function(item){
        //     return item;
        //  })
        
        // var friend = _.filter(friends, function(v, k) {
        //     // console.log(k, v)
        //     return k;
        // });

        // console.log(result)

        Object.entries(groups).forEach(([key, value]) => {
            // console.log(`${key}: ${value}`);

            // console.log(value)
            if(group_id === key){
                // group = {group_id:key, ...value}

                let {members} = value.group_profile
                // console.log(group)

                let newMembers = {...members}
                Object.entries(members).forEach(([mkey, mvalue]) => {
                    // console.log(mvalue);

                    var friend_profile = _.filter(friends, function(v, k) {
                        // console.log(k, m)
                        return k == mvalue.friend_id;
                    });

                    // console.log(friend_profile)
                    if(friend_profile.length == 0){

                        newMembers = {...newMembers, [mkey]:mvalue}
                    }else{
                        let mm = {...mvalue, ...{friend_profile:friend_profile[0]} }
                        // console.log(mm)

                        newMembers = {...newMembers, [mkey]:mm}
                    }

                    // console.log(newMembers)
                    
                    let group = {...{group_id:key, ...value}, 
                                group_profile:{
                                    ...value.group_profile,
                                    members:newMembers
                                }
                            }

                    // console.log(group)
                    this.setState({
                        group
                    })
                    
                })
                return;
            }
        });

        // let friends = auth.users.friends

        // _.each(friends, function(_v, _k) { 

        // })

        // console.log(friends)
        // console.log(group)
    }

    itemMembers = (group) =>{
        let {members} = group.group_profile
        return Object.keys(members).map((key, v) => {

            if(v > 3){
                return;
            }

            let friend = members[key]
            if(friend.friend_id === this.props.uid){
                let {profiles} = this.props.auth.users
                return(<TouchableOpacity key={friend.friend_id} style={{marginRight:5}}>
                            {/* <PlaceHolderFastImage 
                                source={{uri: profiles.image_url, priority: FastImage.priority.normal}}
                                style={{width: 36, height: 36, borderRadius: 18, }}/> */}

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
            // console.log(profile)

            return(<TouchableOpacity key={friend.friend_id} style={{marginRight:5}}>
                        {/* <PlaceHolderFastImage 
                            source={{uri: profile.image_url, priority: FastImage.priority.normal}}
                            style={{width: 36, height: 36, borderRadius: 18, }}/> */}

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

    render() {
        // const { navigation } = this.props;
        // const group_id = navigation.getParam('group_id', null);
        // // console.log(group_id)

        // let groups = this.props.auth.users.groups;

        // let group = null
        // _.each(groups, function(_v, _k) { 
        //     if(group_id === _k){
        //         group = {group_id:_k, ..._v}
        //     }
        // });

        // console.log(group) // 

        let {group} = this.state

        if (Object.keys(group).length == 0) {
            return(<View style={{flex:1, backgroundColor:'#DF2D6C'}}></View>)
        }

        console.log(group)
        return (
                <View style={{flex:1, backgroundColor:'#DF2D6C', paddingTop:getHeaderInset()}}>
                    <View style={{ alignItems:'center'}}>
                        <TouchableOpacity
                            style={{paddingTop:10}}>
                            <PlaceHolderFastImage 
                                source={{uri: group.group_profile.image_url, priority: FastImage.priority.normal}}
                                style={{width: 100, height: 100, borderRadius: 50, borderWidth:4, borderColor:'#BCD1D5'}}
                                resizeMode={FastImage.resizeMode.cover}/>
                        </TouchableOpacity>
                        <View style={{padding:5, flexDirection:'row'}}>
                            <TouchableOpacity>
                                <Image
                                    style={{ width: 30, height: 30}}
                                    source={require('../../Images/icon-group-arrow.svg')}
                                />
                            </TouchableOpacity>
                            <View style={{paddingLeft:5}}>
                                <Text style={{fontSize:26, fontWeight:'bold', textAlignVertical: 'bottom', color:'#BCD1D5'}}>{group.group_profile.name}</Text>
                            </View>
                        </View>
                        <View style={{padding:5, flexDirection:'row'}}>
                            {this.itemMembers(group)}
                            <TouchableOpacity 
                                style={{width: 36, height: 36, borderRadius: 18, justifyContent:'center', alignItems:'center', backgroundColor:'#BCD1D5'}}>
                                <Text style={{color:'white', fontWeight:'bold'}}>{Object.keys(group.group_profile.members).length}+</Text>
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
                        <TouchableOpacity style={{alignItems:'center'}}
                            onPress={()=>{
                                this.props.navigation.navigate("ChatPage")
                            }}>
                            <Image
                                style={{ width: 30, height: 30}}
                                source={require('../../Images/icon-group-chat.svg')}
                            />
                            <Text style={{fontWeight:'bold', color:'#BCD1D5', fontSize:16}}>CHAT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginRight:30, marginLeft:30,  alignItems:'center'}}
                            onPress={()=>{
                                this.props.navigation.navigate('GroupsQRcode')
                            }}
                            >
                            <Image
                                style={{ width: 30, height: 30}}
                                source={require('../../Images/icon-group-qr.svg')}
                            />
                            <Text style={{fontWeight:'bold', color:'#BCD1D5', fontSize:16}}>QR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{alignItems:'center'}}
                            onPress={()=>{
                                this.props.navigation.navigate('GroupSettingsPage')
                            }}>
                            <Image
                                style={{ width: 40, height: 40}}
                                source={require('../../Images/icon-group-setting.svg')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            );
    }
}

const styles = StyleSheet.create({
    
    MainContainer :{
    
    justifyContent: 'center',
    // flex:1,
    backgroundColor:'red'
    // paddingTop: (Platform.OS === 'iOS') ? 20 : 0
        
    },
        
    FlatList_Item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        
    },
        
    header_footer_style:{
        
        width: '100%', 
        height: 44, 
        backgroundColor: '#4CAF50', 
        alignItems: 'center', 
        justifyContent: 'center'
        
    },
    
    textStyle:{
        textAlign: 'center', 
        color: '#fff', 
        fontSize: 21
    }
});

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