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

import {getStatusBarHeight} from '../../Utils/Helpers'
import * as actions from '../../Actions'

import Constant from '../../Utils/Constant'
import MyIcon from '../../config/icon-font.js';

let shareOptions = {
    title: "React Native",
    message: "Hola mundo",
    url: "http://facebook.github.io/react-native/",
    subject: "Share Link" //  for email
};

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
        setTimeout(() => {this.setState({renderContent: true})}, 0);
    
        this.props.navigation.setParams({handleEdit: this.handleEdit})
        this.props.navigation.setParams({handleShare: this.handleShare})
    }

    handleShare = () => {
        Share.open(shareOptions);
    }

    handleEdit = () =>{
        this.props.navigation.navigate("EditMyProfilePage")
    }

    phonesList(){

        console.log(this.props.auth.users.profiles.phones)
        return Object.entries(this.props.auth.users.profiles.phones).map(([key, value]) => {
            return(<Cell
                key={key}
                cellStyle="Subtitle"
                titleTextColor="#007AFF"
                hideSeparator={false} 
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
            }
        />)
        })
    }

    emailsList(){
        if(this.props.auth.users.profiles.emails === undefined){
            return;
        }

        return Object.entries(this.props.auth.users.profiles.emails).map(([key, value]) => {
            return(<Cell
                    key={key}
                    cellStyle="Subtitle"
                    titleTextColor="#007AFF"
                    hideSeparator={false} 
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
                    }}
                    />)
        })
    }

    websitesList(){
        
        if(this.props.auth.users.profiles.websites === undefined){
            return;
        }

        return Object.entries(this.props.auth.users.profiles.websites).map(([key, value]) => {
            return(<Cell
                    key={key}
                    cellStyle="Subtitle"
                    titleTextColor="#007AFF"
                    hideSeparator={false} 
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
                    }}
                />)
        })
    }

    render() {
        let {name, image_url, bg_url, status_message, my_id, gender} = this.props.auth.users.profiles
        // let{name, image_url} = this.props.auth.users.profiles;

        // My ID
        if(my_id === undefined || my_id == ''){
            my_id = "Not set"
        } 

        // console.log(my_id)

        // Gender
        let text_gender = 'Not set'
        if(gender !== undefined){  
            console.log(gender)      
            let __ = Constant.gender.filter(function(item){
                return item.id == gender;
            })
            
            if(__.length > 0){
                text_gender = __[0].name
            }
        }

        let birthday = ''
        if(this.props.auth.users.profiles.birthday !== undefined){
            birthday = this.props.auth.users.profiles.birthday

        }

        // intereste_in
        let intereste_in = []
        if(this.props.auth.users.profiles.intereste_in !== undefined){
            _.each(this.props.auth.users.profiles.intereste_in,  function(v, k) { 
                if(v.enable){
                    let f = Constant.intereste_in.find(k => k.id==v.id)
                    intereste_in.push(f.name)
                }
            })
        }

        // value={this.props.auth.users.profiles.address}
        let address = 'Not set'
        if(this.props.auth.users.profiles.address !== undefined){
            address = this.props.auth.users.profiles.address
        }

        // isIphoneX() ? 25 : 0
        return (<ScrollView style={{ flex: 1, marginBottom:isIphoneX() ? 50 : 0 }}>
                <View style={{flex:1, backgroundColor:'gray'}}>
                    {/* <BackgroundImage style={{paddingTop:this.getHeaderInset()}} auth={this.props.auth} /> */}
                    <View style={{flex:1, paddingTop: this.getHeaderInset(), flexDirection:'row'}}>
                        <FastImage
                            style={StyleSheet.absoluteFill}
                            // source={require('../../Images/boxpink.png')}
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
                                style={{width: 100, height: 100, borderRadius: 10, borderWidth:.5, borderColor:'gray'}}
                                source={{
                                uri: image_url,
                                headers:{ Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                        <View style = {{
                            justifyContent: 'center',
                            alignItems: 'center'}}>
                            <Text style={{alignSelf:'center',
                                        fontSize:22,
                                        color:'white',
                                        justifyContent:'center',
                                        alignItems:'center', 
                                        marginRight:100,
                                        marginLeft:10}}>
                                {name}
                            </Text>
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
                                        <Text
                                        style={{flex:1, fontSize: 18,  }}>
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
                                            Name Subname
                                            </Text>
                                            <Text style={{ fontSize:18 }}>
                                                {name}
                                            </Text>
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
                                                Status message
                                            </Text>
                                            <Text style={{ fontSize:18 }}>
                                                {status_message == "" ? "Not set" : status_message}
                                            </Text>
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
                                            <Text style={{ fontSize:18 }}>
                                                {my_id}
                                            </Text>
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
                                            <Text style={{ fontSize:18 }}>
                                                {text_gender}
                                            </Text>
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
                                            <Text style={{ fontSize:18 }}>
                                                {birthday != ''? Moment(new Date(birthday)).format('MMMM DD, YYYY'):'Not set'}
                                                {/*  */}
                                            </Text>
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
                                            <Text style={{ fontSize:18 }}>
                                                {intereste_in.length == 0 ? "Not set": intereste_in.join(", ")}
                                            </Text>
                                        </View>
                                    </View>
                                }
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
                                        <Text
                                        style={{flex:1, fontSize: 18,  }}>
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
                                        {Object.keys(this.props.auth.users.profiles.phones).length == 0 ? <Text style={{flex:1, fontSize:18}}>Not set</Text> :<View />}
                                    </View>
                                }
                            />
                            {this.phonesList()}
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
                                            <Text style={{fontSize:18}}>
                                            {address}
                                            </Text>
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
                                           {this.props.auth.users.profiles.websites === undefined ? <Text style={{flex:1, fontSize:18}}>Not set</Text> :<View />}
                                        </View>
                                    </View>
                                }
                            />
                            {this.websitesList()}
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
                                            {this.props.auth.users.profiles.emails === undefined ? <Text style={{flex:1, fontSize:18}}>Not set</Text> :<View />}
                                        </View>
                                    </View>
                                }
                            />
                            {this.emailsList()}
                        </Section>
                    </TableView>
                    </View>
                </View>
            </ScrollView> 
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
      auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(MyProfilePage);