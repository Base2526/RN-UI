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
        }
    }

    componentDidMount() {
        setTimeout(() => {this.setState({renderContent: true})}, 0);
    }

    render() {
        const { navigation } = this.props;
        const group_id = navigation.getParam('group_id', null);
        // console.log(group_id)

        let groups = this.props.auth.users.groups;

        let group = null
        _.each(groups, function(_v, _k) { 
            if(group_id === _k){
                group = {group_id:_k, ..._v}
            }
        });

        console.log(group)
        return (
                // <ScrollView style={{ flex: 1,}}>
                <View style={{flex:1, backgroundColor:'#DF2D6C', paddingTop:getHeaderInset()}}>
                    <View style={{ alignItems:'center'}}>
                        <TouchableOpacity
                            style={{paddingTop:10}}>
                            <PlaceHolderFastImage 
                                source={{uri: '', priority: FastImage.priority.normal}}
                                style={{width: 100, height: 100, borderRadius: 50, borderWidth:4, borderColor:'#BCD1D5'}}/>
                        </TouchableOpacity>
                        <View style={{padding:5, flexDirection:'row'}}>
                            <Image
                                style={{ width: 30, height: 30}}
                                source={require('../../Images/icon-group-arrow.svg')}
                            />
                            <View style={{paddingLeft:5}}>
                                <Text style={{fontSize:26, fontWeight:'bold', textAlignVertical: 'bottom', color:'#BCD1D5'}}>Group B</Text>
                            </View>
                        </View>
                        <View style={{padding:5, flexDirection:'row'}}>
                            <TouchableOpacity style={{marginRight:5}}>
                                <PlaceHolderFastImage 
                                    source={{uri: '', priority: FastImage.priority.normal}}
                                    style={{width: 36, height: 36, borderRadius: 18, }}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginRight:5}}>
                                <PlaceHolderFastImage 
                                    source={{uri: '', priority: FastImage.priority.normal}}
                                    style={{width: 36, height: 36, borderRadius: 18, }}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginRight:5}}>
                                <PlaceHolderFastImage 
                                    source={{uri: '', priority: FastImage.priority.normal}}
                                    style={{width: 36, height: 36, borderRadius: 18, }}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginRight:5}}>
                                <PlaceHolderFastImage 
                                    source={{uri: '', priority: FastImage.priority.normal}}
                                    style={{width: 36, height: 36, borderRadius: 18, }}/>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{width: 36, height: 36, borderRadius: 18, justifyContent:'center', alignItems:'center', backgroundColor:'#BCD1D5'}}>
                                <Text style={{color:'white', fontWeight:'bold'}}>12+</Text>
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
                        <TouchableOpacity style={{alignItems:'center'}}>
                            <Image
                                style={{ width: 30, height: 30}}
                                source={require('../../Images/icon-group-chat.svg')}
                            />
                            <Text style={{fontWeight:'bold', color:'#BCD1D5', fontSize:16}}>CHAT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginRight:30, marginLeft:30,  alignItems:'center'}}>
                            <Image
                                style={{ width: 30, height: 30}}
                                source={require('../../Images/icon-group-qr.svg')}
                            />
                            <Text style={{fontWeight:'bold', color:'#BCD1D5', fontSize:16}}>QR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{alignItems:'center'}}>
                            <Image
                                style={{ width: 40, height: 40}}
                                source={require('../../Images/icon-group-setting.svg')}
                            />
                        </TouchableOpacity>
                    </View>
                    
                    {/* <GroupBackgroundImage style={{paddingTop:getHeaderInset()}} auth={this.props.auth} group={group} /> */}
                    {/* <View style={{ flex:1}}>
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
                                            source={require('../../Images/chat-icon.png')}
                                        />
                                        <Text style={{ fontSize:22 , paddingLeft:10}}>
                                            Chat
                                        </Text>
                                    </View>
                                }
                                onPress={() => {
                                    // console.log("Chat")
                                    this.props.navigation.navigate("ChatPage")
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
                                            source={require('../../Images/member-icon.png')}
                                        />
                                        <Text style={{ fontSize:22 , paddingLeft:10}}>
                                            Members ({ Object.keys(group.group_profile.members).length })
                                        </Text>
                                    </View>
                                }
                                onPress={() => {
                                    this.props.navigation.navigate('ListGroupMemberPage', {'group': group})
                                }}
                            />
                            <Cell
                                cellStyle="Basic"
                                // accessory="DisclosureIndicator"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={false} 
                                cellContentView={
                                    
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <Image
                                            style={{width: 25, height: 25}}
                                            source={require('../../Images/qrcode-icon.png')}
                                        />
                                        <Text style={{ fontSize:22 , paddingLeft:10}}>
                                            QR code
                                        </Text>
                                    </View>
                                }
                                onPress={() => {
                                    // console.log("QR code")

                                    this.props.navigation.navigate('GroupsQRcode')
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
                                    this.props.navigation.navigate('GroupSettingsPage')
                                }}
                            />
                        </Section>
                      </TableView>
                    </View> */}
                </View>
            // </ScrollView> 
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
      auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(ManageGroupPage);