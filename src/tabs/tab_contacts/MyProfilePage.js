import React from 'react'
import {FlatList, 
        StyleSheet, 
        View, 
        Text, 
        Platform, 
        TouchableOpacity,
        ScrollView,
        Linking,
        SafeAreaView,
        Image} from 'react-native'

import { Header } from 'react-navigation';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import { isIphoneX, ifIphoneX } from 'react-native-iphone-x-helper';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import Share, {ShareSheet, Button} from 'react-native-share';
import Moment from 'moment'
var _ = require('lodash');

import {getStatusBarHeight, isEmpty} from '../../utils/Helpers'
import * as actions from '../../actions'

import Constant from '../../utils/Constant'
import MyIcon from '../../config/icon-font.js';

let shareOptions = {
    title: "React Native",
    message: "Hola mundo",
    url: "http://facebook.github.io/react-native/",
    subject: "Share Link" //  for email
};

import {makeUidState, 
        makeProfileState, 
        makeMyIdsState,
        makePhonesState, 
        makeWebsitesState, 
        makeEmailsState } from '../../reselect'

let unsubscribes = []

class MyProfilePage extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        headerTransparent: true,
        headerTitleStyle:{color:'white'},
        headerTintColor: '#C7D8DD',
        headerRight: (
            <View style={{flexDirection:'row', flex:1}}>
                <TouchableOpacity style={{paddingRight:10}}
                    onPress={()=>{
                        const { params = {} } = navigation.state
                        if(Object.keys(params).length !== 0){
                            params.handleEdit()
                        }
                    }}>
                    <MyIcon
                        name={'edit'}
                        size={25}
                        color={'#C7D8DD'} 
                        />
                </TouchableOpacity>
                <TouchableOpacity style={{paddingRight:10}}
                    onPress={()=>{
                        const { params = {} } = navigation.state
                        if(Object.keys(params).length !== 0){
                            params.handleShare()
                        }
                    }}>
                    <MyIcon
                        name={'share'}
                        size={25}
                        color={'#C7D8DD'}  />
                </TouchableOpacity>
            </View>
        ),
    });

    constructor(){
        super();
    
        this.state = { 
            renderContent: false,
        }
    }

    // componentDidMount(){
    //     console.log('componentDidMount')
    //     // console.log(this.props.dispatch)
    // }

    // https://github.com/react-navigation/react-navigation/blob/master/examples/NavigationPlayground/js/StackWithTranslucentHeader.js
    // Inset to compensate for navigation bar being transparent.
    // And improved abstraction for this will be built in to react-navigation
    // at some point.
    getHeaderInset() {
        const NOTCH_HEIGHT = isIphoneX() ? 25 : 0;
  
        // $FlowIgnore: we will remove the HEIGHT static soon enough
        const BASE_HEADER_HEIGHT = Header.HEIGHT;
  
        const HEADER_HEIGHT =
        Platform.OS === 'ios'
          ? BASE_HEADER_HEIGHT + NOTCH_HEIGHT
          : BASE_HEADER_HEIGHT + getStatusBarHeight();
  
        //   console.log("HEADER_HEIGHT : " , HEADER_HEIGHT)
        return HEADER_HEIGHT
    }

    componentDidMount() {
        let {uid, phones, websites, emails, myIds} = this.props

        // this.props.trackProfilesPhones(uid, phones, (data)=>{
        //     unsubscribes.push(data.unsubscribe)
        // })
        // this.props.trackProfileWebsites(uid, websites, (data)=>{
        //     unsubscribes.push(data.unsubscribe)
        // })
        // this.props.trackProfileEmails(uid, emails, (data)=>{
        //     unsubscribes.push(data.unsubscribe)
        // })
        // this.props.trackProfileMyIds(uid, myIds, (data)=>{
        //     unsubscribes.push(data.unsubscribe)
        // })

        setTimeout(() => {this.setState({renderContent: true})}, 0);
    
        this.props.navigation.setParams({handleEdit: this.handleEdit})
        this.props.navigation.setParams({handleShare: this.handleShare})
    }

    componentWillUnmount(){
        console.log('componentWillUnmount')
        // unsubscribes.map((unsubscribe, k)=>{
        //     unsubscribe()
        // })
    }

    handleShare = () => {
        Share.open(shareOptions);
    }

    handleEdit = () =>{
        this.props.navigation.navigate("EditMyProfilePage")
    }

    phonesList(phones){
        if(phones === undefined){
            return;
        }

        return Object.entries(phones).map(([key, value]) => {
            return(<Cell
                    key={key}
                    cellStyle="Subtitle"
                    titleTextColor="#007AFF"
                    hideSeparator={true} 
                    cellContentView={
                        <View style={{flexDirection:'row'}}>
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{fontSize: 22,  }}>
                                    {value.phone_number} 
                                </Text>
                                <TouchableOpacity
                                    style={{alignSelf:'flex-end'}}
                                    onPress={()=>{
                                        alert('Verify')
                                    }}>
                                    <Text style={{fontSize: 16, color:'blue', marginLeft:10, textAlignVertical:'bottom'}}>
                                        {value.is_verify ? '': ''}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }/>)
        })
    }

    emailsList(emails){
        if(emails === undefined){
            return;
        }

        console.log('emailsList', emails)

        return Object.entries(emails).map(([key, value]) => {
            return(<Cell
                    key={key}
                    cellStyle="Subtitle"
                    titleTextColor="#007AFF"
                    hideSeparator={true} 
                    accessory="DisclosureIndicator"
                    cellContentView={
                    <View style={{flex:1,}}>
                        <View style={{flex:1,}}>
                            <Text style={{flex:1, fontSize: 16, marginTop:10 }}>
                                {value.email}
                            </Text>
                        </View>
                    </View>
                    }
                    onPress={()=>{
                        Linking.openURL('mailto:' + value.email)
                    }}/>)
        })
    }

    websitesList(websites){
        if(websites === undefined){
            return;
        }

        return Object.entries(websites).map(([key, value]) => {
            return(<Cell
                    key={key}
                    cellStyle="Subtitle"
                    titleTextColor="#007AFF"
                    hideSeparator={true} 
                    accessory="DisclosureIndicator"
                    cellContentView={
                    <View style={{flex:1}}>
                        <View style={{flex:1}}>
                            <Text style={{flex:1, fontSize:16, marginTop:10, marginBottom:10, color:'blue'}}>
                                {value.url}
                            </Text>
                        </View>
                    </View>
                    }
                    onPress={()=>{
                        Linking.openURL(value.url)
                    }}/>)
        })
    }

    render() {
        let {name, 
            image_url, 
            bg_url, 
            status_message, 
            address,
            gender, 
            // my_ids,
            birthday,
            intereste_in,
            // phones,
            // websites,
            // emails
        } = this.props.profile

        let my_ids =  this.props.myIds
        let phones =  this.props.phones
        let websites =  this.props.websites
        let emails =  this.props.emails

        // Status message
        let textStatusMessage = <View />
        if(!isEmpty(status_message.trim())){
            textStatusMessage = <Text style={{  fontSize:16,
                                                color:'white',
                                                marginRight:100,
                                                marginLeft:10}}>{status_message}</Text>
        }

        // MyId
        let textMyId = <Text style={{ fontSize:18 }}>Not set</Text>
        if(my_ids !== undefined){
            let __ =_.find(my_ids,  function(v, k) { 
                return v.enable
            })

            if(__ !== undefined){
                textMyId = <Text style={{ fontSize:18 }}>{__.id}</Text>
            }
        }
        
        // Gender
        let textGender = <Text style={{ fontSize:18 }}>Not set</Text>
        if(gender !== undefined){       
            let __ = Constant.gender.filter(function(item){
                return item.id == gender;
            })
            
            if(__.length > 0){
                textGender = <Text style={{ fontSize:18 }}>{__[0].name}</Text>
            }
        }

        // Birthday
        let textBirthday = <Text style={{ fontSize:18 }}>Not set</Text>
        if(birthday !== undefined){
           textBirthday =   <Text style={{ fontSize:18 }}>
                                {Moment(new Date(birthday)).format('MMMM DD, YYYY')}
                            </Text>
        }

        // InteresteIn
        let textInteresteIn = <Text style={{ fontSize:18 }}>Not set</Text>
        console.log('intereste_in', intereste_in)
        if(intereste_in !== undefined){
            let resteIn = []
            intereste_in.forEach(function(key, v, arr){
                let f = Constant.intereste_in.find(k => k.id==key)
                resteIn.push(f.name)
            });

            if(resteIn.length > 0){
                textInteresteIn =   <Text style={{ fontSize:18 }}>
                                        {resteIn.join(", ")}
                                    </Text>
            }
        }

        // Address
        let textAddress = <Text style={{fontSize:18}}>Not set</Text>
        if(address !== undefined){
            textAddress = <Text style={{fontSize:18}}>{address}</Text>
        }

        // {/* {Object.keys(this.props.profiles.phones).length == 0 ? <Text style={{flex:1, fontSize:18}}>Not set</Text> :<View />} */}
        let textMobilephones = <Text style={{flex:1, fontSize:18}}>Not set</Text>
        if(phones !== undefined){
            textMobilephones =  <View />
        }

        // {this.props.profiles.websites === undefined ? <Text style={{flex:1, fontSize:18}}>Not set</Text> :<View />}
        let textWebsites = <Text style={{flex:1, fontSize:18}}>Not set</Text>
        if(websites !== undefined){
            textWebsites =  <View />
        }

        // {this.props.profiles.emails === undefined ? <Text style={{flex:1, fontSize:18}}>Not set</Text> :<View />}
        let textEmails = <Text style={{flex:1, fontSize:18}}>Not set</Text>
        if(emails !== undefined){
            textEmails =  <View />
        }

        return (<ScrollView style={{ flex: 1, marginBottom:isIphoneX() ? 50 : 0 }}>
                <View style={{flex:1, backgroundColor:'gray'}}>
                    <View style={{flex:1, paddingTop: this.getHeaderInset(), flexDirection:'row'}}>
                        <FastImage
                            style={StyleSheet.absoluteFill}
                            source={{
                                uri: bg_url,
                                headers:{ Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <View style={{flexDirection:'row', margin:20}}>
                        <TouchableOpacity>
                            <FastImage
                                style={{width: 80, 
                                        height: 80, 
                                        borderRadius: 10}}
                                source={{
                                uri: image_url,
                                headers:{ Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                        <View style = {{
                            justifyContent: 'flex-end',
                            // alignItems: 'center'
                            }}>
                            <Text style={{alignSelf:'center',
                                        fontSize:22,
                                        color:'white',
                                        justifyContent:'center',
                                        alignItems:'center', 
                                        marginRight:100,
                                        marginLeft:10}}>
                                {name}
                            </Text>
                            {textStatusMessage}
                        </View>
                        </View>
                    </View>
                    <View style={{ flex:1}}>
                        <TableView >
                        <Section
                            sectionPaddingTop={5}
                            sectionPaddingBottom={0}
                            separatorInsetLeft={0}>
                            <Cell
                                cellStyle="Subtitle"
                                titleTextColor="#007AFF"
                                cellContentView={
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <Text style={{flex:1, fontSize: 18,  }}>
                                            Basic Info
                                        </Text>
                                    </View>
                                }
                            />
                            {/* <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true} 
                                cellContentView={
                                    <View style={{flex:1}}>
                                        <View >
                                            <Text style={{ }}>
                                                Status message
                                            </Text>
                                            {textStatusMessage}
                                        </View>
                                    </View>
                                }
                            /> */}
                             <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true} 
                                cellContentView={
                                    <View style={{flex:1}}>
                                        <View >
                                            <Text style={{ }}>
                                                My ID
                                            </Text>
                                            {textMyId}
                                        </View>
                                        
                                    </View>
                                }
                            />
                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true} 
                                cellContentView={
                                    <View style={{flex:1}}>
                                        <View >
                                            <Text style={{ }}>
                                                Gender
                                            </Text>
                                            {textGender}
                                        </View>
                                    </View>
                                }
                            />
                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true} 
                                cellContentView={
                                    <View style={{flex:1}}>
                                        <View >
                                            <Text style={{ }}>
                                                Birthday
                                            </Text>
                                            {textBirthday}
                                        </View>
                                    </View>
                                }
                            />
                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true} 
                                cellContentView={
                                    <View style={{flex:1}}>
                                        <View >
                                            <Text style={{ }}>
                                                Interested In
                                            </Text>
                                            {textInteresteIn}
                                        </View>
                                    </View>
                                }
                            />
                            <Cell
                                cellStyle="Basic"
                                accessory="DisclosureIndicator"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true} 
                                cellContentView={
                                    <View style={{flex:1}}>
                                        <View >
                                            <Text style={{ fontSize:18 }}>
                                                My QR code
                                            </Text>
                                        </View>
                                    </View>
                                }
                                onPress={()=>{
                                    this.props.navigation.navigate("MyQRcodeNavigator")
                                }}
                            />
                        </Section>

                        <Section
                            sectionPaddingTop={5}
                            sectionPaddingBottom={0}
                            separatorInsetLeft={0}>
                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ }} 
                                hideSeparator={false}
                                cellContentView={
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <Text style={{flex:1, fontSize: 18,  }}>
                                        Contact Info
                                        </Text>
                                    </View>
                                }
                            />
                            <Cell
                                cellStyle="Subtitle"
                                titleTextColor="#007AFF"
                                hideSeparator={true} 
                                contentContainerStyle={{ padding:10 }} 
                                cellContentView={
                                    <View style={{flex:1}}>
                                        <Text style={{flex:1,}}>
                                        Mobile phones
                                        </Text>
                                        {textMobilephones}
                                    </View>
                                }
                            />
                            {this.phonesList(phones)}
                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true}
                                cellContentView={
                                    <View style={{flex:1, marginBottom:10}}>
                                        <View >
                                            <Text style={{ }}>
                                            Address
                                            </Text>
                                            {textAddress}
                                        </View>
                                    </View>
                                }
                            />
                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true}
                                cellContentView={
                                    <View style={{flex:1, marginBottom:10}}>
                                        <View >
                                            <Text style={{ }}>
                                            Website
                                            </Text>
                                            {textWebsites}
                                        </View>
                                    </View>
                                }
                            />
                            {this.websitesList(websites)}
                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true} 
                                cellContentView={
                                    <View style={{flex:1}}>
                                        <View >
                                            <Text style={{ }}>
                                                Email
                                            </Text>
                                            {textEmails}
                                        </View>
                                    </View>
                                }
                            />
                            {this.emailsList(emails)}
                        </Section>
                    </TableView>
                    </View>
                </View>
            </ScrollView> 
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
        uid:makeUidState(state, ownProps),
        profile: makeProfileState(state, ownProps),
        // myIds: makeMyIdsState(state, ownProps),
        // phones: makePhonesState(state, ownProps),
        // websites: makeWebsitesState(state, ownProps),
        // emails: makeEmailsState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(MyProfilePage);