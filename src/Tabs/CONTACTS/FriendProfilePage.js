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
        Dimensions,
        Image} from 'react-native'

import { Header } from 'react-navigation';

import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import Modal from 'react-native-modalbox';
import Share, {ShareSheet, Button} from 'react-native-share';
import Spinner from 'react-native-loading-spinner-overlay';

var _ = require('lodash');

import Moment from 'moment'

import {getStatusBarHeight} from '../../Utils/Helpers'
import ImageWithDefault from '../../Utils/ImageWithDefault'
import * as actions from '../../Actions'
import {getUid} from '../../Utils/Helpers'
import Constant from '../../Utils/Constant'
import MyIcon from '../../config/icon-font.js';

let shareOptions = {
    title: "React Native",
    message: "Hola mundo",
    url: "http://facebook.github.io/react-native/",
    subject: "Share Link" //  for email
};

class FriendProfilePage extends React.Component{

    static navigationOptions = ({ navigation}) => {
        const { params = {} } = navigation.state
        let {is_favorite} =params
        return {
            headerTransparent: true,
            headerTitleStyle:{color:'white'},
            headerTintColor: 'white',
            headerRight: (
                <View style={{flexDirection:'row', flex:1, marginRight:10}}>
                    <TouchableOpacity style={{paddingRight:10}}
                        onPress={()=>{
                            const { params = {} } = navigation.state
                            if(Object.keys(params).length !== 0){
                                params.handleFriendFavorite()
                            }
                        }}>
                        <MyIcon
                            name={is_favorite ? 'star' : 'star-empty'}
                            size={25}
                            color={'#C7D8DD'} />
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
                            color={'#C7D8DD'} />
                    </TouchableOpacity>
                </View>
            ),
        }
    }

    constructor(){
        super();
    
        this.state = { 
            loading:false,
            renderContent: false,
            friend:null,
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
  
          console.log("HEADER_HEIGHT : " , HEADER_HEIGHT)
        return HEADER_HEIGHT
    }

    componentDidMount() {
        setTimeout(() => {this.setState({renderContent: true})}, 0);

        this.props.navigation.setParams({handleFriendFavorite: this.handleFriendFavorite})
        this.props.navigation.setParams({handleShare: this.handleShare})

       
        const { navigation } = this.props;
        const friend_id = navigation.getParam('friend_id', null);

        let friends = this.props.auth.users.friends;

        let friend = null
        _.each(friends, function(_v, _k) { 
            if(friend_id === _k){
                friend = {..._v, friend_id:friend_id}
            }
        });

        this.setState({
            friend
        })

        let is_favorite = false
        if(friend.is_favorite !== undefined){
            is_favorite = friend.is_favorite
        }

        this.props.navigation.setParams({is_favorite: is_favorite});
    }

    componentWillReceiveProps(nextProps) {
        const { navigation } = this.props;
        const friend_id = navigation.getParam('friend_id', null);

        let friends = nextProps.auth.users.friends;
        let friend = {}
        _.each(friends, function(_v, _k) { 
            // console.log(_v," | ",_k)
            if(friend_id === _k){
                friend = {..._v, friend_id:friend_id}
            }
        });

        if(friend.hasOwnProperty('profile')){
            this.setState({
                friend
            })
        }

        if (friend.is_favorite != this.state.friend.is_favorite) {
            this.props.navigation.setParams({is_favorite: friend.is_favorite});
        }
    }

    handleFriendFavorite = () =>{
        let {friend} = this.state

        let is_favorite = false
        if(friend.is_favorite !== undefined){
            is_favorite = !friend.is_favorite
        }

        this.setState({loading:true})
        this.props.actionFriendFavirite(this.props.uid, friend.friend_id, is_favorite, (result) => {
            console.log(result)
            this.setState({loading:false})
        })
    }

    handleShare = () => {
        Share.open(shareOptions);
    }

    renderListItem = ({ item }) => {
        switch(item.key){
            case '1':
            {
                return( <View style={{flex:1, height:60, padding:10, backgroundColor:'white', justifyContent:'center'}}>
                    <Text style={{fontSize:18}}>My ID: XUYDDE</Text>
                    <FastImage
                        style={{width: 20, height: 20, position:'absolute', right:0}}
                        source={require('../../Images/disclosure_indicator.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>)
            }
            break
            case '2':
            {
                return( <View style={{flex:1, height:60, padding:10, backgroundColor:'white', justifyContent:'center'}}>
                    <Text style={{fontSize:18}}>Messages: xx-xxx</Text>
                    <FastImage
                        style={{width: 20, height: 20, position:'absolute', right:0}}
                        source={require('../../Images/disclosure_indicator.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>)
            }
            break
            case '3':
            {
                return( <View style={{flex:1, height:60, padding:10, backgroundColor:'white', justifyContent:'center'}}>
                    <Text style={{fontSize:18}}>Address: test test</Text>
                    <FastImage
                        style={{width: 20, height: 20, position:'absolute', right:0}}
                        source={require('../../Images/disclosure_indicator.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>)
            }
            break
            case '4':
            {
                return( <View style={{flex:1, height:60, padding:10, backgroundColor:'white', justifyContent:'center'}}>
                    <Text style={{fontSize:18}}>Email: Not email</Text>
                    <FastImage
                        style={{width: 20, height: 20, position:'absolute', right:0}}
                        source={require('../../Images/disclosure_indicator.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>)
            }
            break
            case '5':
            {
                return( <View style={{flex:1, height:60, padding:10, backgroundColor:'white', justifyContent:'center'}}>
                    <Text style={{fontSize:18}}>Phones: Not phone</Text>
                    <FastImage
                        style={{width: 20, height: 20, position:'absolute', right:0}}
                        source={require('../../Images/disclosure_indicator.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>)
            }
            break
        }
    }

    openModal(){
        this.refs.modal4.open()
    }

    getHeightListClasss(){
        let classs = this.props.auth.users.classs

        /*
        80 : ความสูงของ item
        45 : ความสูงของ header x
        */
        let height = Object.keys(classs).length * 80 // + 45

        if(height > Dimensions.get('window').height){
            return (Dimensions.get('window').height - 100);
        }

        return height;
    }

    icon = (classs, friend, key) =>{
        let members = classs[key].members

        let icon = null
        if(members !== undefined){
            _.each(members, function(_v, _k) { 
                if(friend.friend_id === _v.friend_id && _v.status){
                    icon = <Icon name="check" size={25} color="#900" />
                } 
            })
        }

        return icon
    }

    renderListClasss() {
        var list = [];

        let classs = this.props.auth.users.classs

        let {friend} = this.state

        Object.keys(classs).map(key => {
            list.push(
                <TouchableOpacity key={ key } onPress={() => {
                    // this.props.params.navigation.navigate("ManageClasssPage")
                    // alert(classs[key].name)

                    this.props.actionSelectClass(key, this.props.uid, friend.friend_id, (result)=>{

                        console.log(result)
                    })
                  }}>
                <View
                  style={{
                    alignItems: 'center', 
                    padding: 10,
                    flexDirection: 'row',
                    height:80,
                  }}>
                    <TouchableOpacity 
                        style={{height:60,
                                width: 60,
                                borderRadius: 10}}>
                      {/* <ImageWithDefault 
                        source={{uri: classs[key].image_url}}
                        style={{width: 60, height: 60, borderRadius: 10}}
                      /> */}
                        <FastImage
                            style={{width: 60, height: 60, borderRadius: 30, borderWidth:.5, borderColor:'gray'}}
                            source={{
                                uri: classs[key].image_url,
                                headers:{ Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>
                    <View style={{paddingLeft: 10}}>
                        <Text style={{fontSize: 18, 
                                        fontWeight: '600', 
                                        paddingBottom:5
                                    }}>
                            {classs[key].name}
                        </Text>
                    </View>
                    <View style={{paddingLeft: 10, position:'absolute', right:0, marginRight:10}}>
                        {this.icon(classs, friend, key)}
                    </View>
    
                    <View
                        style={{
                            height: 1,
                            width: "86%",
                            backgroundColor: "#CED0CE",
                            marginLeft: "14%",
                            position:'absolute',
                            bottom: 0,
                            right: 0,
                        }}
                    />
                </View>
                </TouchableOpacity>
            )
            }
        )
        return list;
    }

    getClasssName=()=>{

        let classs = this.props.auth.users.classs

        let {friend_id} = this.state.friend

        // console.log(classs)
        // console.log(friend_id)

        let n = []
        _.each(classs, function(_v, _k) { 

            if(_v.members !== undefined){
                let class_name = _v.name
                // console.log(_v)
                // console.log(_k)

                _.each(_v.members, function(_v, _k) { 
                    if(_v.status && _v.friend_id == friend_id){
                        n.push(class_name)
                    }
                    // console.log(_v)
                })
            }
        })

        if(n.length == 0){
            return "Not set class"
        }else{
            return n.join(", ")
        }
    }

    phonesList(){

        if(this.state.friend.profile.phones === undefined){
            return;
        }

        // console.log(this.props.friend.profile.phones)
        return Object.entries(this.state.friend.profile.phones).map(([key, value]) => {
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

    websitesList(){
        
        if(this.state.friend.profile.websites === undefined){
            return;
        }

        return Object.entries(this.state.friend.profile.websites).map(([key, value]) => {
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
    emailsList(){
        if(this.state.friend.profile.emails === undefined){
            return;
        }

        return Object.entries(this.state.friend.profile.emails).map(([key, value]) => {
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


    render() {
        let {friend} = this.state

        if(friend === null){
            return <View></View>
        }

        console.log(friend)

        let {profile} = friend

        // let {my_ids} = this.state.profiles
        let find_my_id = _.find(profile.my_ids,  function(v, k) { 
            return v.enable
        })
        
        let my_id = ''
        if(find_my_id === undefined){
            my_id = "Not set"
        }else{
            my_id = find_my_id.id
        }

        let status_message = ''
        if(profile.status_message !== undefined){
            status_message = profile.status_message
        }

        // Gender
        let text_gender = 'Not set'
        if(profile.gender !== undefined){  
            console.log(profile.gender)      
            let __ = Constant.gender.filter(function(item){
                return item.id == profile.gender;
            })
            
            if(__.length > 0){
                text_gender = __[0].name
            }
        }

        let birthday = ''
        if(profile.birthday !== undefined){
            birthday = profile.birthday
        }

        // intereste_in
        let intereste_in = []
        if(profile.intereste_in !== undefined){
        profile.intereste_in.forEach(function(key, v, arr){
                let f = Constant.intereste_in.find(k => k.id==key)
                intereste_in.push(f.name)
            });
        }
 
        // value={this.props.auth.users.profiles.address}
        let address = 'Not set'
        if(profile.address !== undefined){
            address = profile.address
        }
 

        //  {Object.keys(profile.phones).length == 0 ? <Text style={{flex:1, fontSize:18}}>Not set</Text> :<View />}
        let txt_phones = <Text style={{flex:1, fontSize:18}}>Not set</Text>
        if(profile.phones !== undefined){
            txt_phones = <View />
        }

        return (
            <View style={{flex:1}}>
                <Spinner
                    visible={this.state.loading}
                    textContent={'Wait...'}
                    textStyle={{color: '#FFF'}}
                    overlayColor={'rgba(0,0,0,0.5)'}
                    />
                <Modal 
                    style={{zIndex:10, height:this.getHeightListClasss()}} 
                    position={"bottom"} 
                    ref={"modal4"}
                    // backdropPressToClose={false}
                    swipeToClose={true}
                    coverScreen={true}
                    swipeArea={50}
                    >
                    <ScrollView>
                        <View
                            style={{marginBottom:20, marginTop:5, flex:1}}>
                            {this.renderListClasss()}
                        </View>
                    </ScrollView>
                </Modal>

                <ScrollView style={{ flex: 1,}}>
                <View style={{flex:1, backgroundColor:'gray'}}>
                    <View style={{flex:1, paddingTop: this.getHeaderInset(), flexDirection:'row'}}>
                        <FastImage
                            style={StyleSheet.absoluteFill}
                            source={{
                                uri: friend.profile.bg_url,
                                headers:{ Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <View style={{flexDirection:'row', margin:20}}>
                        <TouchableOpacity>
                            <FastImage
                                style={{width: 80, height: 80, borderRadius: 10, borderWidth:.5, borderColor:'gray'}}
                                source={{
                                    uri: friend.profile.image_url,
                                    headers:{ Authorization: 'someAuthToken' },
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                        <View style={{justifyContent: 'flex-end', }}>
                            <Text style={{fontSize:22, marginLeft:10, color:'white'}}>{friend.profile.name}</Text>
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
                                // title="Help / FAQ"
                                cellStyle="Subtitle"
                                titleTextColor="#007AFF"
                                onPress={() => console.log("open Help/FAQ")}
                                cellContentView={
                                    <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
                                        <TouchableOpacity
                                            style={{padding:5}}
                                            onPress={()=>{
                                                alert('All Application')
                                            }}     
                                            >

                                            <MyIcon
                                                name={'all-app'}
                                                size={60}
                                                color={'#CE3B6E'}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{padding:5}}
                                            onPress={()=>{
                                                alert('Video call')
                                            }}     
                                            >
                                            {/* <ImageWithDefault 
                                                // source={{uri: 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t1.0-9/49682566_926064284253361_1603030473750085632_n.jpg?_nc_cat=107&_nc_ht=scontent.fbkk8-2.fna&oh=393d859cd955afe7d6e8f2053c4f5116&oe=5C906265'}}
                                                source={require('../../Images/icon-profile-friend-phone.png')}
                                                style={{width: 60, height: 60, borderRadius: 30, }}
                                            />       */}

                                            <MyIcon
                                            name={'call'}
                                            size={60}
                                            color={'#CE3B6E'}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{padding:5}}
                                            onPress={()=>{
                                                this.props.navigation.navigate("ChatPage")
                                            }}
                                            >
                                            <MyIcon
                                            name={'friend-chat'}
                                            size={60}
                                            color={'#CE3B6E'}/> 
                                        </TouchableOpacity>
                                        {/* <TouchableOpacity
                                            style={{height:60,
                                                    width:60,
                                                    borderRadius: 30,
                                                    margin:5,
                                                    backgroundColor:'blue'
                                                    }}        
                                            >
                                            <ImageWithDefault 
                                                source={{uri: 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t1.0-9/49682566_926064284253361_1603030473750085632_n.jpg?_nc_cat=107&_nc_ht=scontent.fbkk8-2.fna&oh=393d859cd955afe7d6e8f2053c4f5116&oe=5C906265'}}
                                                style={{width: 60, height: 60, borderRadius: 30, }}
                                            />      
                                        </TouchableOpacity> */}
                                    </View>
                                }
                            />
                        </Section>
                        <Section
                            sectionPaddingTop={5}
                            sectionPaddingBottom={0}
                            separatorInsetLeft={0}>
                            <Cell
                                // title="Help / FAQ"
                                cellStyle="Subtitle"
                                titleTextColor="#007AFF"
                                onPress={() => console.log("open Help/FAQ")}
                                cellContentView={
                                <View style={{flex:1, flexDirection:'row'}}>
                                    <Text
                                    // allowFontScaling
                                    // numberOfLines={1}
                                    style={{flex:1, fontSize: 18,  }}>
                                    Basic Info
                                    </Text>
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
                                        Name Subname {friend.hasOwnProperty('change_friend_name') ? " (" + friend.profile.name + ")" : '' }
                                        </Text>
                                        <Text style={{ fontSize:18 }}>
                                            {friend.hasOwnProperty('change_friend_name') ? friend.change_friend_name: friend.profile.name }
                                        </Text>
                                    </View>

                                    {friend.status == Constant.FRIEND_STATUS_FRIEND ? 
                                    <View style={{position:'absolute', right:0, bottom:0}}>
                                        <TouchableOpacity
                                            onPress={()=>{
                                                this.props.navigation.navigate('ChangeFriendsName', {"friend": friend})
                                            }}>
                                            <MyIcon
                                                name={'edit'}
                                                size={20}
                                                color={'#C7D8DD'} />
                                        </TouchableOpacity>
                                    </View>
                                    :null
                                    }
                                </View>
                                }
                                onPress={()=>{
                                    this.props.navigation.navigate('ChangeFriendsName', {"friend": friend})
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
                                                Status message
                                            </Text>
                                            <Text style={{ fontSize:18 }}>
                                                {status_message}
                                            </Text>
                                        </View>
                                        
                                    </View>
                                }
                            />
                             <Cell
                                // title="Help / FAQ"
                                cellStyle="Subtitle"
                                titleTextColor="#007AFF"
                                hideSeparator={true} 
                                onPress={() => {
                                    this.openModal()
                                }}
                                cellContentView={
                                
                                <View style={{flex:1, }}>
                                    <Text
                                        style={{flex:1, fontSize: 18,}}>
                                        Classs
                                    </Text>
                                    <Text style={{ fontSize:18 }}>
                                         {this.getClasssName()}
                                    </Text>
                                    { friend.status == Constant.FRIEND_STATUS_FRIEND ? 
                                    <View style={{position:'absolute', right:0, bottom:0}}>
                                        <TouchableOpacity
                                            onPress={()=>{
                                                this.openModal()
                                            }}>
                                            <MyIcon
                                                name={'edit'}
                                                size={20}
                                                color={'#C7D8DD'} />
                                        </TouchableOpacity>
                                    </View>
                                    : null
                                    }
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
                            separatorInsetLeft={0}
                            // contentContainerStyle={{ paddingVertical: 4 }} 
                            >
                            <Cell
                                cellStyle="Basic"
                                // title="MY INFO"
                                contentContainerStyle={{ }} 
                                hideSeparator={false}
                                cellContentView={
                                    // <Text style={{ flex: 1, fontSize: 18, }}>
                                    //   Contact Info
                                    // </Text>
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <Text
                                        // allowFontScaling
                                        // numberOfLines={1}
                                        style={{flex:1, fontSize: 18,  }}>
                                        Contact Info
                                        </Text>
                                    </View>
                                }
                            />
                            <Cell
                                cellStyle="Basic"
                                // title="MY INFO"
                                contentContainerStyle={{  }} 
                                hideSeparator={true}
                                // contentContainerStyle={{ paddingVertical: 10 }} 
                                cellContentView={
                                    <View style={{flex:1, marginBottom:10}}>
                                        <View >
                                            <Text style={{ }}>
                                            Mobile phones
                                            </Text>
                                           {txt_phones}
                                        </View>
                                    </View>
                                }
                            />
                            {this.phonesList()}
                            <Cell
                                cellStyle="Basic"
                                // title="MY INFO"
                                contentContainerStyle={{ }} 
                                hideSeparator={true}
                                // contentContainerStyle={{ paddingVertical: 10 }} 
                                cellContentView={
                                    <View style={{flex:1, marginBottom:10}}>
                                        <View >
                                            <Text style={{ }}>
                                            Address
                                            </Text>
                                            <Text style={{ fontSize:18}}>
                                            {address}
                                            </Text>
                                        </View>
                                    </View>
                                }
                            />

                            <Cell
                                cellStyle="Basic"
                                // title="MY INFO"
                                contentContainerStyle={{ }} 
                                hideSeparator={true}
                                // contentContainerStyle={{ paddingVertical: 10 }} 
                                cellContentView={
                                    <View style={{flex:1, marginBottom:10}}>
                                        <View >
                                            <Text style={{ }}>
                                            Website
                                            </Text>
                                            {profile.websites === undefined ? <Text style={{flex:1, fontSize:18}}>Not set</Text> :<View />}
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
                                            {profile.emails === undefined ? <Text style={{flex:1, fontSize:18}}>Not set</Text> :<View />}
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

export default connect(mapStateToProps, actions)(FriendProfilePage);