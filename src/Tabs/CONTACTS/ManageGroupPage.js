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
                                {/* <Image
                                    style={{ width: 30, height: 30}}
                                    source={require('../../Images/icon-group-arrow.svg')}
                                /> */}

                            <Image
                                style={{ width: 30, height: 30}}
                                source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28.26" height="27.305" viewBox="0 0 28.26 27.305">
                                <path id="Path_1995" data-name="Path 1995" d="M-836.388-3198.788l3.9,9h9.293l-7.193,6.95,3.4,9.354-9.4-5.854-9.195,5.854,2.945-9.354-6.817-6.95h9.067Z" transform="translate(850.454 3199.788)" fill="none" stroke="#bcd1d5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                              </svg>                              
                              `}} />
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
                            {/* <Image
                                style={{ width: 30, height: 30}}
                                source={require('../../Images/icon-group-chat.svg')}
                            /> */}

                            <Image
                                style={{ width: 30, height: 30}}
                                source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="26.212" height="22.876" viewBox="0 0 26.212 22.876">
                                <g id="Group_460" data-name="Group 460" transform="translate(-88.341 -798.503)">
                                  <path id="Path_320" data-name="Path 320" d="M1288.858,280.317a6.813,6.813,0,1,1-6.814-6.814A6.815,6.815,0,0,1,1288.858,280.317Z" transform="translate(-1186.89 525)" fill="#bcd1d5"/>
                                  <path id="Path_321" data-name="Path 321" d="M1335.431,280.317a6.815,6.815,0,1,1-6.814-6.814A6.816,6.816,0,0,1,1335.431,280.317Z" transform="translate(-1220.877 525)" fill="#bcd1d5"/>
                                  <path id="Path_322" data-name="Path 322" d="M1275.559,302.806s-.089,3.44,4.573,8.486c2.191,2.552,8.362,6.473,8.362,6.473s5.771-3.538,7.922-5.87c4.884-4.8,5.174-9.089,5.174-9.089" transform="translate(-1187.129 503.614)" fill="#bcd1d5"/>
                                  <path id="Path_323" data-name="Path 323" d="M1292.553,307.224a1.955,1.955,0,1,1-1.952-1.956A1.952,1.952,0,0,1,1292.553,307.224Z" transform="translate(-1196.679 501.817)" fill="#fff"/>
                                  <path id="Path_324" data-name="Path 324" d="M1320.408,307.224a1.955,1.955,0,1,1-1.954-1.956A1.952,1.952,0,0,1,1320.408,307.224Z" transform="translate(-1217.008 501.817)" fill="#fff"/>
                                  <path id="Path_325" data-name="Path 325" d="M1348.266,307.224a1.956,1.956,0,1,1-1.955-1.956A1.953,1.953,0,0,1,1348.266,307.224Z" transform="translate(-1237.338 501.817)" fill="#fff"/>
                                  <path id="Path_326" data-name="Path 326" d="M1295.037,345.967a23.228,23.228,0,0,1-2.586,2.009,14.631,14.631,0,0,1-3.486,1.288s6.6-.563,7.961-1.648" transform="translate(-1196.913 472.114)" fill="#bcd1d5"/>
                                </g>
                              </svg>
                              
                              `}} />
                            <Text style={{fontWeight:'bold', color:'#BCD1D5', fontSize:16}}>CHAT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginRight:30, marginLeft:30,  alignItems:'center'}}
                            onPress={()=>{
                                this.props.navigation.navigate('GroupsQRcode')
                            }}
                            >
                            {/* <Image
                                style={{ width: 30, height: 30}}
                                source={require('../../Images/icon-group-qr.svg')}
                            /> */}
                            <Image
                                style={{ width: 30, height: 30}}
                                source={{uri:`data:image/svg+xml;utf8,<svg id="Group_333" data-name="Group 333" xmlns="http://www.w3.org/2000/svg" width="21.084" height="21.109" viewBox="0 0 21.084 21.109">
                                <path id="Path_1687" data-name="Path 1687" d="M690.024,308.132v-2.073c-.726-.045-1.368-.089-2.139-.137v-4.156c-.792,0-1.448,0-2.1,0,0,0,.048.033.048.033v-2.075h8.324v6.221H692.15c0,.771,0,1.456,0,2.143,0,0,.032-.046.032-.046-.732.019-1.465.038-2.2.048Zm2.045-6.307h-1.976v1.98h1.976Z" transform="translate(-673.077 -299.693)" fill="#bcd1d5" fill-rule="evenodd"/>
                                <path id="Path_1688" data-name="Path 1688" d="M638.874,305.809v-6.193h6.19v6.193ZM643,303.743v-2.006h-1.98v2.006Z" transform="translate(-638.874 -299.616)" fill="#bcd1d5" fill-rule="evenodd"/>
                                <path id="Path_1689" data-name="Path 1689" d="M645.171,354.029v6.336h-6.206v-6.3c2.05,0,4.151,0,6.245,0Zm-4.131,4.217h2.024v-1.953h-2.024Z" transform="translate(-638.94 -339.29)" fill="#bcd1d5" fill-rule="evenodd"/>
                                <path id="Path_1690" data-name="Path 1690" d="M668.255,333.013v2.125h-1.972c-.053.77-.1,1.412-.144,2.13-1.451,0-2.85,0-4.25,0,0,0,.038.04.036.038.023-.711.039-1.415.055-2.122l-.036.041H664v-2.165h-2.057l.036.029v-2.052h4.178v2.016c.772,0,1.456,0,2.142,0C668.3,333.056,668.255,333.013,668.255,333.013Z" transform="translate(-655.654 -322.525)" fill="#bcd1d5" fill-rule="evenodd"/>
                                <path id="Path_1691" data-name="Path 1691" d="M697.927,354.247h2.045v6.279H693.76v-1.995h4.208v-4.317Z" transform="translate(-678.893 -339.426)" fill="#bcd1d5" fill-rule="evenodd"/>
                                <path id="Path_1692" data-name="Path 1692" d="M692.027,348.483h-2.088c-.043.7-.079,1.33-.118,2.116h-4.208l.04.033v-2.064c.677-.038,1.31-.079,2.032-.114.045-.669.083-1.3.137-2.055h4.193l-.042-.045c0,.724.007,1.448.014,2.162Z" transform="translate(-672.952 -333.693)" fill="#bcd1d5" fill-rule="evenodd"/>
                                <path id="Path_1693" data-name="Path 1693" d="M672.281,307.158c.735.008,1.477.023,2.215.03,0,0-.049-.034-.046-.033,0,1.358,0,2.711,0,4.147H670.24V309.31h2.084v-2.195Z" transform="translate(-661.744 -305.084)" fill="#bcd1d5" fill-rule="evenodd"/>
                                <path id="Path_1694" data-name="Path 1694" d="M643.174,332.977c-.689.042-1.381.085-2.154.137v1.96h-2.066V331h4.186c0,.714,0,1.362,0,2.019C643.139,333.021,643.174,332.977,643.174,332.977Z" transform="translate(-638.932 -322.498)" fill="#bcd1d5" fill-rule="evenodd"/>
                                <path id="Path_1695" data-name="Path 1695" d="M674.483,362.026v2.08c-.688.039-1.323.072-2.048.119-.037.672-.083,1.31-.125,2.006h-1.961v-4.169h4.174S674.483,362.026,674.483,362.026Z" transform="translate(-661.823 -345.121)" fill="#bcd1d5" fill-rule="evenodd"/>
                                <path id="Path_1696" data-name="Path 1696" d="M689.7,330.609v2.1c-1.455,0-2.879,0-4.3,0,0,0,.042.04.042.038v-2.089h4.3Z" transform="translate(-672.797 -322.214)" fill="#bcd1d5" fill-rule="evenodd"/>
                                <path id="Path_1697" data-name="Path 1697" d="M709.134,334.8c.014-1.454.027-2.9.041-4.354a.263.263,0,0,0-.032.043h2.014v4.267h-2.064Z" transform="translate(-690.072 -322.093)" fill="#bcd1d5" fill-rule="evenodd"/>
                                <path id="Path_1698" data-name="Path 1698" d="M672.407,301.682h-2.053v-2.018h2.009v2.061S672.407,301.682,672.407,301.682Z" transform="translate(-661.827 -299.651)" fill="#bcd1d5" fill-rule="evenodd"/>
                                <path id="Path_1699" data-name="Path 1699" d="M656.525,340.479h-2.088c0-.745,0-1.464,0-2.179a.325.325,0,0,1-.032.042c.707.015,1.411.033,2.118.043l-.036-.029v2.165Z" transform="translate(-650.2 -327.822)" fill="#bcd1d5" fill-rule="evenodd"/>
                              </svg>
                              `}} />
                            <Text style={{fontWeight:'bold', color:'#BCD1D5', fontSize:16}}>QR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{alignItems:'center'}}
                            onPress={()=>{
                                this.props.navigation.navigate('GroupSettingsPage')
                            }}>
                            {/* <Image
                                style={{ width: 40, height: 40}}
                                source={require('../../Images/icon-group-setting.svg')}
                            /> */}
                             <Image
                            style={{ width: 40, height: 40}}
                            source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28.685" height="28.685" viewBox="0 0 28.685 28.685">
                            <path id="Path_1374" data-name="Path 1374" d="M165.036,63.834V58.559h-3.448a10.638,10.638,0,0,0-1.182-2.845l2.44-2.441-3.729-3.729-2.44,2.44a10.569,10.569,0,0,0-2.848-1.181V47.354h-5.272V50.8a10.6,10.6,0,0,0-2.847,1.181l-2.44-2.44-3.729,3.729,2.44,2.441a10.717,10.717,0,0,0-1.182,2.845h-3.448v5.275H140.8a10.706,10.706,0,0,0,1.182,2.845l-2.44,2.441,3.729,3.729,2.44-2.44a10.546,10.546,0,0,0,2.847,1.18v3.45h5.272v-3.45a10.541,10.541,0,0,0,2.848-1.18l2.44,2.44,3.729-3.729-2.44-2.441a10.68,10.68,0,0,0,1.182-2.845Zm-13.842,3.555a6.193,6.193,0,1,1,6.193-6.193A6.193,6.193,0,0,1,151.194,67.389Z" transform="translate(-136.851 -46.854)" fill="#bcd1d5" stroke="rgba(0,0,0,0)" stroke-width="1" fill-rule="evenodd"/>
                          </svg>`}} />
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