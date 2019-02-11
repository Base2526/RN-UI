import React from 'react'
import {StyleSheet, 
        View, 
        Text, 
        TouchableOpacity,} from 'react-native'

import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
var _ = require('lodash');
import Image from 'react-native-remote-svg'

import {getHeaderInset} from '../../Utils/Helpers'
import * as actions from '../../Actions'

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
            data: {}
        }
    }

    componentDidMount() {
        setTimeout(() => {this.setState({renderContent: true})}, 0);

        const { navigation, auth } = this.props;
        const data = navigation.getParam('data', null);

        let friends = auth.users.friends

        let members ={}
        Object.entries(data.members).forEach(([key, value]) => {
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

        newData = {...{...data}, members}

        this.setState({data:newData})
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

    componentWillReceiveProps(nextProps) {
        let classs = nextProps.auth.users.classs
        let arr_classs = Object.keys(classs).map((key, index) => {
            return {...{class_id:key}, ...classs[key]};
        })

        let {class_id} = this.state.data
        var v = arr_classs.find(function(element) { 
            return element.class_id == class_id; 
        }); 

        this.setState({data: v})
    }

    itemMembers = (data) =>{
        let {members} = data

        // console.log(members)
        return Object.keys(members).map((key, v) => {
            let {profile} = members[key].friend_profile
            // console.log(v)
            if(v > 3){
                return
            }

            return(<TouchableOpacity key={members[key].friend_id} style={{marginRight:5}}>
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
                    </TouchableOpacity>
                    )
        })

        /*
        let {members} = data
        return Object.keys(members).map(key => {
            let friend = members[key]
            if(friend.friend_id === this.props.uid){
                let {profiles} = this.props.auth.users
                return(<TouchableOpacity key={friend.friend_id} style={{marginRight:5}}>
                            <PlaceHolderFastImage 
                                source={{uri: profiles.image_url, priority: FastImage.priority.normal}}
                                style={{width: 36, height: 36, borderRadius: 18, }}/>
                        </TouchableOpacity>)
            }
            
            let {profile} = members[key].friend_profile
            // console.log(pro)
            return(<TouchableOpacity key={friend.friend_id} style={{marginRight:5}}>
                        <PlaceHolderFastImage 
                            source={{uri: profile.image_url, priority: FastImage.priority.normal}}
                            style={{width: 36, height: 36, borderRadius: 18, }}/>
                    </TouchableOpacity>)
            }
        )
        */
    }

    render() {
        
        let {data} = this.state

        if (Object.keys(data).length == 0) {
            return(<View style={{flex:1, backgroundColor:'#DF2D6C'}}></View>)
        }
        
        console.log(data)
        return (
            <View style={{flex:1, backgroundColor:'#DF2D6C', paddingTop:getHeaderInset()}}>
            <View style={{ alignItems:'center'}}>
                {/* <TouchableOpacity
                    style={{paddingTop:10}}>
                    
                        <FastImage
                            style={{width: 100, height: 100, borderRadius: 50, borderWidth:4, borderColor:'#BCD1D5'}}
                            source={{
                            uri: data.image_url,
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                </TouchableOpacity> */}

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
                    <TouchableOpacity>
                        {/* <Image
                            style={{ width: 30, height: 30}}
                            source={require('../../Images/icon-group-arrow.svg')}
                        /> */}
                        <Image
                            style={{ width: 30, height: 30}}
                            source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28.26" height="27.305" viewBox="0 0 28.26 27.305">
                            <path id="Path_1995" data-name="Path 1995" d="M-836.388-3198.788l3.9,9h9.293l-7.193,6.95,3.4,9.354-9.4-5.854-9.195,5.854,2.945-9.354-6.817-6.95h9.067Z" transform="translate(850.454 3199.788)" fill="none" stroke="#bcd1d5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                            </svg>`}} />
                    </TouchableOpacity>
                    <View style={{paddingLeft:5}}>
                        <Text style={{fontSize:26, fontWeight:'bold', textAlignVertical: 'bottom', color:'#BCD1D5'}}>{data.name}</Text>
                    </View>
                </View>
                <View style={{padding:5, flexDirection:'row'}}>
                    {this.itemMembers(data)}
                    <TouchableOpacity 
                        style={{width: 36, height: 36, borderRadius: 18, justifyContent:'center', alignItems:'center', backgroundColor:'#BCD1D5'}}>
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
                <TouchableOpacity style={{alignItems:'center'}}
                    onPress={()=>{
                        this.props.navigation.navigate('ClasssSettingsPage')
                    }}>
                    {/* <Image
                        style={{ width: 40, height: 40}}
                        source={require('../../Images/icon-group-setting.svg')}
                    /> */}
                    <Image
                            style={{ width: 40, height: 40}}
                            source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28.685" height="28.685" viewBox="0 0 28.685 28.685">
                            <path id="Path_1374" data-name="Path 1374" d="M165.036,63.834V58.559h-3.448a10.638,10.638,0,0,0-1.182-2.845l2.44-2.441-3.729-3.729-2.44,2.44a10.569,10.569,0,0,0-2.848-1.181V47.354h-5.272V50.8a10.6,10.6,0,0,0-2.847,1.181l-2.44-2.44-3.729,3.729,2.44,2.441a10.717,10.717,0,0,0-1.182,2.845h-3.448v5.275H140.8a10.706,10.706,0,0,0,1.182,2.845l-2.44,2.441,3.729,3.729,2.44-2.44a10.546,10.546,0,0,0,2.847,1.18v3.45h5.272v-3.45a10.541,10.541,0,0,0,2.848-1.18l2.44,2.44,3.729-3.729-2.44-2.441a10.68,10.68,0,0,0,1.182-2.845Zm-13.842,3.555a6.193,6.193,0,1,1,6.193-6.193A6.193,6.193,0,0,1,151.194,67.389Z" transform="translate(-136.851 -46.854)" fill="#bcd1d5" stroke="rgba(0,0,0,0)" stroke-width="1" fill-rule="evenodd"/>
                          </svg>
                          
                          `}} />
                </TouchableOpacity>
            </View>
        </View>
        )
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
      auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(ManageClasssPage);