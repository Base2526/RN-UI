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
        // headerRight: (
        //     <View style={{flexDirection:'row', flex:1}}>
        //         <TouchableOpacity 
        //             style={{paddingRight:10}}
        //             onPress={()=>{
        //                 Alert.alert(
        //                     '',
        //                     'If you leave this group, you\'ll no longer be able to see its member list or chat history Continue?',
        //                     [
        //                     //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        //                       {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        //                       {text: 'OK', onPress: () => console.log('OK Pressed')},
        //                     ],
        //                     { cancelable: false }
        //                   )
        //             }}>
        //             <Text style={{color:'red', fontSize:16, borderWidth: 1, borderColor: 'red', borderRadius: 12, padding: 8, overflow:"hidden",}}>Settings</Text>
        //         </TouchableOpacity> 
        //     </View>
        // ),
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
                <TouchableOpacity
                    style={{paddingTop:10}}>
                    {/* <PlaceHolderFastImage 
                        source={{uri: data.image_url, priority: FastImage.priority.normal}}
                        style={{width: 100, height: 100, borderRadius: 50, borderWidth:4, borderColor:'#BCD1D5'}}
                        resizeMode={FastImage.resizeMode.cover}/> */}

                        <FastImage
                            style={{width: 100, height: 100, borderRadius: 50, borderWidth:4, borderColor:'#BCD1D5'}}
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
                        <Image
                            style={{ width: 30, height: 30}}
                            source={require('../../Images/icon-group-arrow.svg')}
                        />
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
                    <Image
                        style={{ width: 30, height: 30}}
                        source={require('../../Images/icon-group-chat.svg')}
                    />
                    <Text style={{fontWeight:'bold', color:'#BCD1D5', fontSize:16}}>CHAT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems:'center'}}
                    onPress={()=>{
                        this.props.navigation.navigate('ClasssSettingsPage')
                    }}>
                    <Image
                        style={{ width: 40, height: 40}}
                        source={require('../../Images/icon-group-setting.svg')}
                    />
                </TouchableOpacity>
            </View>
        </View>
        )
        /*
        return (
                <ScrollView style={{ flex: 1,}}>
                <View style={{flex:1, backgroundColor:'gray'}}>
                    <GroupBackgroundImage style={{paddingTop:getHeaderInset()}} auth={this.props.auth} data={data} />
                    <View style={{ flex:1}}>
                    <TableView >
                        <Section
                            sectionPaddingTop={5}
                            sectionPaddingBottom={0}
                            separatorInsetLeft={0}>

                            <Cell
                                cellStyle="Basic"
                                accessory="DisclosureIndicator"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={false} 
                                cellContentView={
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <Image
                                            style={{width: 25, height: 25}}
                                            source={require('../../Images/member-icon.png')}
                                        />
                                        <Text style={{ fontSize:22 , paddingLeft:10}}>
                                            Members ({this.countMembers(data)})
                                        </Text>
                                    </View>
                                }
                                onPress={() => { 
                                    this.props.navigation.navigate('ListClassMemberPage', {'data': data})
                                    // this.props.navigation.navigate('ListGroupMemberPage', {'group': group})
                                }}
                            />
                            <Cell
                                cellStyle="Basic"
                                accessory="DisclosureIndicator"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={false} 
                                cellContentView={
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <Image
                                            style={{width: 25, height: 25}}
                                            source={require('../../Images/settings-icon.png')}
                                        />
                                        <Text style={{ fontSize:22 , paddingLeft:10}}>
                                        Settings
                                        </Text>
                                    </View>
                                }
                                onPress={() => {
                                    this.props.navigation.navigate('ClasssSettingsPage')
                                }}
                            />
                        </Section>
                      </TableView>
                    </View>
                </View>
            </ScrollView> 
        );
        */
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