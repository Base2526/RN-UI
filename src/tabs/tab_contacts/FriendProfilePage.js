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
        StatusBar,
        ActivityIndicator,
        Linking} from 'react-native'

import firebase from 'react-native-firebase';
import { Header } from 'react-navigation';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import { isIphoneX, ifIphoneX } from 'react-native-iphone-x-helper';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import Modal from 'react-native-modalbox';
import Share, {ShareSheet, Button} from 'react-native-share';
import Spinner from 'react-native-loading-spinner-overlay';

var _ = require('lodash');

import Moment from 'moment'
import {getStatusBarHeight, randomKey, isEmpty} from '../../utils/Helpers'
import * as actions from '../../actions'
// import {isEmpty} from '../../utils/Helpers'
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
        makeFriendsState, 
        makeFriendProfilesState, 
        makePresencesState,
        makeFriendProfileState,
        makeClasssState,
        makeClassMembersState} from '../../reselect'

let unsubscribes = [];

class FriendProfilePage extends React.Component{
    static navigationOptions = { 
        title: 'Friend profile', 
        header: null ,
    }
    
    constructor(){
        super();
    
        this.state = { 
            loading:false,
            renderContent: false,
            friend:{},
            friend_id:0,

            is_favorite: false,
            friend_status: 0,

            classs:[],

            renderContent_ContactInfo: false,
            contact_info:{},
        }
    }

    componentDidMount() {
        // setTimeout(() => {this.setState({renderContent: true})}, 0);

        // this.props.navigation.setParams({handleFriendFavorite: this.handleFriendFavorite})
        // this.props.navigation.setParams({handleShare: this.handleShare})

        const { navigation } = this.props;
        const friend_id = navigation.getParam('friend_id', null);

        this.setState({friend_id},()=>{
            this.loadData(this.props)
        })

        /*
        let {uid, friends, friend_profile, classs, class_members}   = this.props
        let friend =_.find(friends, (v,k)=>{
                        return k == friend_id
                    })

        if(!friend){
            this.props.navigation.goBack(null)
            return
        }

        let new_classs =_.map(classs, (v, k)=>{
                            let members =   _.find(class_members, (mv, mk)=>{
                                                return k == mk
                                            })
                            if(members){
                                return {class_id:k, ...v, members}
                            }else{
                                return {class_id:k, ...v}
                            }
                        })

        this.setState({friend, classs:new_classs})

        if(isEmpty(friend_profile)){
            this.props.actionFriendProfile99(uid, friend_id).then((data) => {
                console.log(data)
                if(data.status){
                    this.loadData(data.data)
                }
            })
        }else{
            console.log(friend_profile)
            this.loadData(friend_profile)
        }
        */

        this.props.trackProfileFriend(friend_id, (data)=>{
            unsubscribes = data.unsubscribes
        })
        
        // let friend_profile =_.find(friend_profiles, (v,k)=>{
        //                         return k == friend_id
        //                     })
        // if(!friend_profile){
        // }
                // let friend_emails   = v.friend_emails
                // let friend_my_ids   = v.friend_my_ids
                // let friend_phones   = v.friend_phones
                // let friend_profile  = v.friend_profile
                // let friend_websites = v.friend_websites
        /*
        let unsubscribe = firebase.firestore().collection('profiles').doc(friend_id).onSnapshot((friendProfileDocSnapshot) => {
            // console.log(change.doc.id, friendDocSnapshot)
            if (!friendProfileDocSnapshot.exists) {
                console.log('No such document!', friend_id);
            } else {
                console.log('friend profiles >', friendProfileDocSnapshot.data())
    
                // let friend_data = friendProfileDocSnapshot.data()
    
                // let friend_profile =_.find(friend_profiles, (v, k)=>{
                //                         return k == friend_id
                //                     })
    
                // if(!_.isEqual(friend_profile, friend_data) ){
                //     console.log('friend profiles > added not equal')
                //     dispatch({ type: ADDED_FRIEND_PROFILE, friend_id, friend_profile:friend_data });
                // }
            }
        })
        unsubscribes.push(unsubscribe)
        
        console.log(friend_id, friend, friend_profile, unsubscribes)
        */
        // if(friend_profile === undefined){
        //     this.setState({loading:true})
        //     this.props.actionFriendProfile99(uid, friend_id).then((result) => {
        //         this.setState({friend_id, loading:false}, ()=>{
        //             this.loadData(this.props)
        //         })
        //     })
        // }else{
        //     this.setState({friend_id}, ()=>{
        //         this.loadData(this.props)
        //     })
        // }
    }

    componentWillUnmount(){
        console.log('componentWillUnmount')
        unsubscribes.map((unsubscribe, k)=>{
            unsubscribe()
        })
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData = (props) =>{
        let {friend_id} = this.state
        let {friends} = props

        let friend =_.find(friends, (v,k)=>{
                        return k == friend_id
                    })

        this.setState({friend})
    }


    // loadData = (contact_info) =>{
    //     console.log(contact_info)

    //     this.setState({contact_info, renderContent_ContactInfo:true})
    // }


    /*
    loadData = (props) =>{

        let {friend_id, friend, is_favorite, friend_status} = this.state
        let {uid, friends, friend_profiles, classs, class_members}   = props

        let newFriend = _.find(friends, (v, k)=>{
                            return friend_id == k
                        })

        let friend_profile =_.find(friend_profiles, (v,k)=>{
                                return k == friend_id
                            })

        // console.log(newFriend)

        let new_classs =_.map(classs, (v, k)=>{
                            let members =   _.find(class_members, (mv, mk)=>{
                                                return k == mk
                                            })

                            if(members){
                                return {class_id:k, ...v, members}
                            }else{
                                return {class_id:k, ...v}
                            }
                        })
        console.log(classs, new_classs)

        // console.log('loadData = (props) =>{', friend_profile)

        if(friend_profile){
            newFriend = {...newFriend, friend_id, profile:friend_profile}

            // const { navigation } = this.props;
            // const ___is_favorite = navigation.getParam('is_favorite', null);

            // if(is_favorite != newFriend.is_favorite ){
            //     // console.log('--+--', newFriend, friend)
            //     if(friend_status != newFriend.status){
            //         this.props.navigation.setParams({is_favorite:newFriend.is_favorite, friend_status: newFriend.status});
            //     }
            // }else{
            //     if(friend_status != newFriend.status){
            //         this.props.navigation.setParams({is_favorite:newFriend.is_favorite, friend_status: newFriend.status});
            //     }
            // }

            this.setState({friend:newFriend, renderContent: true, is_favorite:newFriend.is_favorite, friend_status:newFriend.status, classs:new_classs})
        }
    }
    */

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

    handleFriendFavorite = () =>{
        // console.log(is_favorite)

        let {is_favorite} = this.state.friend

        this.setState({loading:true})
        this.props.actionFriendFavirite(this.props.uid, this.state.friend_id, !is_favorite, (result) => {
            // console.log(result)
            this.setState({loading:false})
        })
    }

    handleShare = () => {
        Share.open(shareOptions);
    }

    openListClasssModal(){
        this.refs.modalListClasss.open()
    }

    getHeightListClasss(){
        let classs = this.props.classs

        /*
        80 : ความสูงของ item
        45 : ความสูงของ header x
        */
        let height = Object.keys(classs).length * 80 // + 45

        if(height > Dimensions.get('window').height - 100){
            return (Dimensions.get('window').height - 100);
        }

        return height;
    }

    isSelectClass = (classs, friend, key) =>{
        let members = classs[key].members
        let select = _.find(members, (v, k)=>{
            return friend.friend_id === v.friend_id && v.status
        })

        if(select){
            return(<MyIcon
                        name={'check-ok'}
                        size={25}
                        color={'#CE3B6E'}/>)
        }
    }

    renderListClasss(friend, classs) {
        /*
        var list = [];

        Object.keys(classs).map(key => {
            list.push(
                <TouchableOpacity 
                key={ key } 
                onPress={() => {
                    let members = classs[key].members
                    let select = _.find(members, (v, k)=>{
                        return friend.friend_id === v.friend_id
                    })

                    let status = true
                    if(select){
                        status = !select.status

                        let member_key = _.findKey(members,  function(v, k) { 
                            return friend.friend_id === v.friend_id
                        })

                        this.props.actionSelectClassMember(this.props.uid, friend.friend_id, key, member_key, status, (result)=>{
                            console.log(result)
                        })
                    }else{
                        this.props.actionSelectClassMember(this.props.uid, friend.friend_id, key, undefined, status, (result)=>{
                            console.log(result)
                        })
                    }
                }}>
                <View
                  style={{
                    alignItems: 'center', 
                    padding: 10,
                    flexDirection: 'row',
                  }}>
                    <TouchableOpacity>
                        <FastImage
                            style={{width: 50, 
                                    height: 50, 
                                    borderRadius: 25, 
                                    // borderWidth:.5, 
                                    // borderColor:'gray'
                                    }}
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
                        {this.isSelectClass(classs, friend, key)}
                    </View>
    
                    <View
                        style={{
                            height: .5,
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
        // return list;
        */

        return  classs.map((value, key)=>{
                    return(
                        <TouchableOpacity 
                            key={ key } 
                            onPress={() => {
                                let members = classs[key].members
                                let select = _.find(members, (v, k)=>{
                                    return friend.friend_id === v.friend_id
                                })

    
                                let status = true
                                if(select){
                                    status = !select.status

                                    let member_key = _.findKey(members,  function(v, k) { 
                                        return friend.friend_id === v.friend_id
                                    })

                                    this.setState({loading:true})
                                    this.props.actionSelectClassMember(this.props.uid, friend.friend_id, value.class_id, member_key, status, (result)=>{
                                        console.log(result)

                                        this.setState({loading:false})
                                    })
                                }else{

                                    let member_key = randomKey()
                                    this.setState({loading:true})
                                    this.props.actionSelectClassMember(this.props.uid, friend.friend_id, value.class_id, member_key, status, (result)=>{
                                        console.log(result)

                                        this.setState({loading:false})
                                    })
                                }
                            }}>
                            <View
                            style={{
                                alignItems: 'center', 
                                padding: 10,
                                flexDirection: 'row',
                            }}>
                                <TouchableOpacity>
                                    <FastImage
                                        style={{width: 50, 
                                                height: 50, 
                                                borderRadius: 25, 
                                                // borderWidth:.5, 
                                                // borderColor:'gray'
                                                }}
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
                                    {this.isSelectClass(classs, friend, key)}
                                </View>
                
                                <View
                                    style={{
                                        height: .5,
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
                })
    }

    getClasssName=(classs)=>{
        let {friend_id} = this.state
    
        let n = []
        classs.map((v, _k)=>{
            if(v.members){
                let class_name = v.name
                _.each(v.members, function(_v, _k) { 
                    if(_v.status && _v.friend_id == friend_id){
                        n.push(class_name)
                    }
                })
            }
        })

        // Removing duplicate array values and then storing them [react]
        let new_n = n.filter(function(elem, pos) {
                        return n.indexOf(elem) == pos;
                    });

        if(new_n.length == 0){
            return "Not set class"
        }else{
            return new_n.join(", ")
        }
    }

    phonesList(phones){
        if(!phones){
            return;
        }

        return Object.entries(phones).map(([key, value]) => {
            return( <Cell
                        key={key}
                        cellStyle="Basic"
                        title={value.phone_number} 
                        cellAccessoryView={<TouchableOpacity
                                            onPress={()=>{
                                                Linking.openURL(`tel:${value.phone_number}`)
                                            }}>
                                                <MyIcon
                                                    name={'call'}
                                                    size={25}
                                                    color={'gray'}/>
                                            </TouchableOpacity>}
                        hideSeparator={true}/>)
        })
    }

    websitesList(websites){
        
        if(!websites){
            return;
        }

        return Object.entries(websites).map(([key, value]) => {
            return( <Cell
                key={key}
                cellStyle="Basic"
                title={value.url}
                accessory="DisclosureIndicator"
                onPress={()=>{
                    Linking.openURL(value.url)
                }}
                hideSeparator={true}/>)
        })
    }

    emailsList(emails){
        if(!emails){
            return;
        }

        return Object.entries(emails).map(([key, value]) => {
            return( <Cell
                key={key}
                cellStyle="Basic"
                title={value.email}
                accessory="DisclosureIndicator"
                onPress={()=>{
                    Linking.openURL('mailto:' + value.email)
                }}
                hideSeparator={true}/>)
        })
    }

    viewModalClasss = (friend, classs) =>{
        return( <Modal 
                    style={{zIndex:10, height:this.getHeightListClasss()}} 
                    position={"bottom"} 
                    ref={"modalListClasss"}
                    // backdropPressToClose={false}
                    swipeToClose={true}
                    coverScreen={true}
                    swipeArea={50}>
                    <ScrollView>
                        <View style={{marginBottom:20, marginTop:5, flex:1}}>
                            {this.renderListClasss(friend, classs)}
                        </View>
                    </ScrollView>
                </Modal>)            
    }

    render() {
        let {friend, renderContent_ContactInfo} = this.state
        if(!friend){
            return(<View style={{flex:1}}></View>)
        }
        console.log(friend)

        let {status_message, 
            image_url, 
            bg_url, 
            is_favorite, 
            status, 
            gender,
            birthday,
            intereste_in,} = friend

        let {friend_id, renderContent, classs} = this.state

        let button_arrow_back = <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                    <MyIcon
                                        name={'ios-arrow-left'}
                                        size={25}
                                        color={'#C7D8DD'} />
                                        <Text style={{color:'#C7D8DD', paddingLeft:8, fontSize:18}}>Back</Text>
                                </View>
        if(Platform.OS != "ios"){
            button_arrow_back = <MyIcon
                                    name={'android-arrow-left'}
                                    size={20}
                                    color={'#C7D8DD'} />
        }

        let edit_name = <View />
        if(status == Constant.FRIEND_STATUS_FRIEND){
            edit_name =<TouchableOpacity
                            style={{padding:5}}
                            onPress={()=>{
                                // this.props.navigation.navigate('ChangeFriendsName', {"friend": friend})
                            }}>
                            <MyIcon
                                name={'edit'}
                                size={15}
                                color={'white'} />
                        </TouchableOpacity>
        }

        let view_status_message = <View />
        if(status_message){
            view_status_message =   <Text style={{fontSize:16, marginLeft:10, color:'white', fontStyle:'italic'}}>
                                        {status_message}
                                    </Text>
        }

        let cell_classs_name =  <Cell cellStyle="Subtitle"
                                    title="Classs"
                                    detail={this.getClasssName(classs)}
                                    contentContainerStyle={{ paddingVertical: 10 }}
                                    hideSeparator={true}/>

        if(status == Constant.FRIEND_STATUS_FRIEND){
            cell_classs_name = <Cell cellStyle="Subtitle"
                                    title="Classs"
                                    detail={this.getClasssName(classs)}
                                    contentContainerStyle={{ paddingVertical: 10 }}
                                    hideSeparator={true}
                                    cellAccessoryView={ <View style={{}}>
                                                            <MyIcon
                                                                name={'edit'}
                                                                size={20}
                                                                color={'gray'} />
                                                        </View>} 
                                    onPress={()=>{
                                        this.openListClasssModal()
                                    }}/>
        }

        let cell_gender = <Cell
                            cellStyle="Subtitle"
                            title="Gender"
                            detail={'Not set'}
                            hideSeparator={true} />
        if(gender){     
            let __ =Constant.gender.filter(function(item){
                        return item.id == gender;
                    })
            
            if(__.length > 0){
                cell_gender = <Cell
                                cellStyle="Subtitle"
                                title="Gender"
                                detail={__[0].name}
                                hideSeparator={true} />
            }
        }

        let cell_birthday=  <Cell
                                cellStyle="Subtitle"
                                title="Birthday"
                                detail={'Not set'}
                                hideSeparator={true} />
        if(birthday){
            cell_birthday =  <Cell
                                cellStyle="Subtitle"
                                title="Birthday"
                                detail={Moment(new Date(birthday)).format('MMMM DD, YYYY')}
                                hideSeparator={true} />
        }

        let cell_intereste_in = <Cell
                                    cellStyle="Subtitle"
                                    title="Interested In"
                                    hideSeparator={true} 
                                    detail={'Not set'}/>
        if(intereste_in){
            let reste_in = []
            intereste_in.forEach(function(key, v, arr){
                let f = Constant.intereste_in.find(k => k.id==key)
                reste_in.push(f.name)
            })

            cell_intereste_in = <Cell
                                    cellStyle="Subtitle"
                                    title="Interested In"
                                    hideSeparator={true} 
                                    detail={reste_in.join(", ")}/>
        }

        let section_contact_info =  <Section
                                        sectionPaddingTop={5}
                                        sectionPaddingBottom={0}
                                        separatorInsetLeft={0}
                                        hideSeparator={true}>
                                        <Cell
                                            cellStyle="Basic"
                                            hideSeparator={true} 
                                            cellContentView={
                                                <View style={{  flex:1, 
                                                                justifyContent:'center',
                                                                alignItems:'center'}}>
                                                    <ActivityIndicator animating size="small" />
                                                </View>
                                            }/>
                                    </Section>

        if(renderContent_ContactInfo){
            // section_contact_info

            let {friend_emails, friend_phones, friend_websites} = this.state.contact_info

            console.log(friend_emails, friend_phones, friend_websites, this.state.contact_info)
            
            let cell_phones =  <Cell
                            cellStyle="Subtitle"
                            title="Mobile phones"
                            hideSeparator={true} 
                            detail={'Not set'}/>
            if(!isEmpty(friend_phones)){
                cell_phones =  <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{  }} 
                                hideSeparator={true}
                                cellContentView={
                                    <View>
                                        <Text style={{fontSize:16 }}>
                                        Mobile phones
                                        </Text>
                                    </View>
                                }
                            />
            }

            let cell_website =  <Cell
                                cellStyle="Subtitle"
                                title="Website"
                                hideSeparator={true} 
                                detail={'Not set'}/>
            if(!isEmpty(friend_websites)){
                cell_website =  <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{  }} 
                                hideSeparator={true}
                                cellContentView={
                                    <View>
                                        <Text style={{fontSize:16 }}>
                                            Website
                                        </Text>
                                    </View>
                                }/>
            }

            let cell_email =  <Cell
                                cellStyle="Subtitle"
                                title="Email"
                                hideSeparator={true} 
                                detail={'Not set'}/>
            if(!isEmpty(friend_emails)){
                cell_email =  <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{  }} 
                                hideSeparator={true}
                                cellContentView={
                                    <View>
                                        <Text style={{fontSize:16 }}>
                                            Email
                                        </Text>
                                    </View>
                                }/>
            }

            section_contact_info =  <Section
                                        sectionPaddingTop={5}
                                        sectionPaddingBottom={0}
                                        separatorInsetLeft={0}>
                                        <Cell
                                            cellStyle="Basic"
                                            title="Contact Info"
                                            titleTextStyle={fontSize= 18}
                                            hideSeparator={false}/>
                                        
                                        {cell_phones}
                                        {this.phonesList(friend_phones)}

                                        {/* 
                                        {cell_address}
                                        */}

                                        {cell_website}
                                        {this.websitesList(friend_websites)} 

                                        {cell_email}
                                        {this.emailsList(friend_emails)}
                                    </Section>
        }

        return( <View style={{flex:1}}>
                    <View style={{height:Header.HEIGHT +  (isIphoneX() ? 25 : 0), //- (Platform.OS == "ios" ? 20 : 0), 
                              backgroundColor: 'rgba(186, 53, 100, 1.0)',
                              justifyContent: Platform.OS == "ios" ?'flex-end':'center'}}>

                        {this.viewModalClasss(friend, classs)}

                        <View style={{flexDirection:'row', 
                                    position:'absolute', 
                                    }}>
                            <TouchableOpacity
                                style={{padding:10}}
                                onPress={()=>{
                                    this.props.navigation.goBack(null)
                                }}>
                                {button_arrow_back}
                            </TouchableOpacity>
                        </View>
                        <View style={{
                                        flexDirection:'row', 
                                        position:'absolute', 
                                        right:0,
                                    }}>
                            <TouchableOpacity 
                                style={{padding:10}}
                                onPress={()=>{
                                    this.handleFriendFavorite()
                                }}>

                                <MyIcon
                                    name={is_favorite ? 'star' : 'star-empty'}
                                    size={25}
                                    color={'#C7D8DD'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{padding:10}}
                                onPress={()=>{
                                    this.handleShare()
                                }}>
                                <MyIcon
                                    name={'share'}
                                    size={25}
                                    color={'#C7D8DD'} />
                            </TouchableOpacity>
                        </View>    
                    </View>
                    {/* <ActivityIndicator animating size="small" /> */}

                    <ScrollView style={{ }}>
                    <View style={{  flex:1, 
                                    backgroundColor:'gray', 
                                    ...ifIphoneX({
                                        marginBottom: 25
                                    }, {
                                        marginBottom: 0
                                    })}}>
                        <View style={{flex:1, /*paddingTop: this.getHeaderInset(),*/ flexDirection:'row'}}>
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
                                            borderRadius: 10, 
                                        }}
                                    source={{
                                        uri: image_url,
                                        headers:{ Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                                <View style={{justifyContent: 'flex-end', }}>
                                    <View style={{flexDirection:'row', justifyContent: 'flex-end', }}>
                                        <Text style={{fontSize:22, marginLeft:10, color:'white'}}>{friend.hasOwnProperty('change_friend_name') ? friend.change_friend_name : friend.name }</Text>
                                        {edit_name}
                                    </View>
                                    {view_status_message}
                                </View>
                            </View>
                        </View>

                        <View style={{ flex:1}}>
                            <TableView>
                                <Section
                                sectionPaddingTop={5}
                                sectionPaddingBottom={0}
                                separatorInsetLeft={0}>
                                    <Cell
                                        cellStyle="Basic"
                                        title="Basic Info"
                                        titleTextStyle={fontSize= 18}
                                        hideSeparator={false}/>

                                    {cell_classs_name}
                                    {cell_gender}

                                    {cell_birthday}
                                    {cell_intereste_in}

                                </Section>

                                {/* {section_contact_info} */}

                                {/* <Section
                                    sectionPaddingTop={5}
                                    sectionPaddingBottom={0}
                                    separatorInsetLeft={0}> */}
                                    {/* <Cell
                                        cellStyle="Basic"
                                        title="Contact Info"
                                        titleTextStyle={fontSize= 18}
                                        hideSeparator={false}/> */}
                                    {/* <Cell
                                        cellStyle="Basic"
                                        // title="Contact Info"
                                        hideSeparator={true} 
                                        onPress={() => console.log("Heyho!")}
                                        cellContentView={
                                            <View style={{  flex:1, 
                                                            justifyContent:'center',
                                                            alignItems:'center'}}>
                                                <ActivityIndicator animating size="small" />
                                            </View>
                                        }/> */}
                                    {/* <Cell
                                        cellStyle="Basic"
                                        // title="Contact Info"
                                        hideSeparator={true} 
                                        onPress={() => console.log("Heyho!")}
                                        // cellContentView={
                                        //     <ActivityIndicator animating size="small" />
                                        // }
                                        /> */}

                                    {/* {cell_phones} */}
                                    {/* {this.phonesList(phones)} */}

                                    {/* {cell_address} */}

                                    {/* {cell_website} */}
                                    {/* {this.websitesList(websites)} */}

                                    {/* {cell_email} */}
                                    {/* {this.emailsList(emails)} */}
                                {/* </Section> */}
                            </TableView>
                        </View>

                    </View>
                    </ScrollView>
                </View>)

        

        if(!renderContent){
            return(<View style={{flex:1}}>
                        <Spinner
                            visible={this.state.loading}
                            textContent={'Wait...'}
                            textStyle={{color: '#FFF'}}
                            overlayColor={'rgba(0,0,0,0.5)'}
                            />
                    </View>)
        }

        // let {change_friend_name, status, is_favorite} = friend

        let {
            name,
            // status_message,
            // gender,
            // birthday,
            // intereste_in,
            address,
            // image_url,
            // bg_url,
            phones,
            websites,
            emails,
            } = friend.profile

        /* 
        can edit friendName case is friend only
        */
        // let edit_changeFriendsName = <View />
        // if(status == Constant.FRIEND_STATUS_FRIEND){
        //     edit_changeFriendsName =<View style={{position:'absolute', right:0, bottom:0}}>
        //                                 <TouchableOpacity
        //                                     onPress={()=>{
        //                                         this.props.navigation.navigate('ChangeFriendsName', {"friend": friend})
        //                                     }}>
        //                                     <MyIcon
        //                                         name={'edit'}
        //                                         size={20}
        //                                         color={'gray'} />
        //                                 </TouchableOpacity>
        //                             </View>
        // }

        let cell_name_subname = <Cell
                                    cellStyle="Basic"
                                    contentContainerStyle={{ padding:10 }} 
                                    hideSeparator={true} 
                                    cellContentView={
                                        <View style={{flex:1}}>
                                            <View >
                                                <View style={{flexDirection:'row'}}>
                                                    <Text style={{fontSize:16 }}>
                                                        Name Subname
                                                    </Text>
                                                </View>
                                                
                                            </View>
                                            {edit_changeFriendsName}
                                        </View>
                                    }
                                    onPress={()=>{
                                        this.props.navigation.navigate('ChangeFriendsName', {"friend": friend})
                                    }}/>
        if(change_friend_name){

            if(name){
                cell_name_subname = <Cell
                                        cellStyle="Basic"
                                        contentContainerStyle={{ padding:10 }} 
                                        hideSeparator={true} 
                                        cellContentView={
                                            <View style={{flex:1}}>
                                                <View >
                                                    <View style={{flexDirection:'row'}}>
                                                        <Text style={{fontSize:16 }}>
                                                            Name Subname
                                                        </Text>
                                                        <Text style={{ fontStyle:'italic', color:'gray' }}>
                                                            {" (" + name + ")"}
                                                        </Text>
                                                    </View>
                                                    <Text style={{ fontSize:12 }}>
                                                        {change_friend_name}
                                                    </Text>
                                                </View>
                                                {edit_changeFriendsName}
                                            </View>
                                        }
                                        onPress={()=>{
                                            this.props.navigation.navigate('ChangeFriendsName', {"friend": friend})
                                        }}/>

            }else{
                cell_name_subname = <Cell
                                    cellStyle="Basic"
                                    contentContainerStyle={{ padding:10 }} 
                                    hideSeparator={true} 
                                    cellContentView={
                                        <View style={{flex:1}}>
                                            <View >
                                                <View style={{flexDirection:'row'}}>
                                                    <Text style={{fontSize:16 }}>
                                                        Name Subname
                                                    </Text>
                                                    
                                                </View>
                                                <Text style={{ fontSize:12 }}>
                                                    {change_friend_name}
                                                </Text>
                                            </View>
                                            {edit_changeFriendsName}
                                        </View>
                                    }
                                    onPress={()=>{
                                        this.props.navigation.navigate('ChangeFriendsName', {"friend": friend})
                                    }}/>
            }

        }else{
            if(name){
                cell_name_subname = <Cell
                                    cellStyle="Basic"
                                    contentContainerStyle={{ padding:10 }} 
                                    hideSeparator={true} 
                                    cellContentView={
                                        <View style={{flex:1}}>
                                            <View >
                                                <View style={{flexDirection:'row'}}>
                                                    <Text style={{fontSize:16 }}>
                                                        Name Subname
                                                    </Text>
                                                </View>
                                                <Text style={{ fontSize:18 }}>
                                                    {name}
                                                </Text>
                                            </View>
                                            {edit_changeFriendsName}
                                        </View>
                                    }
                                    onPress={()=>{
                                        this.props.navigation.navigate('ChangeFriendsName', {"friend": friend})
                                    }}/>
            }
        }
        
        // let cell_status_message = <Cell
        //                             cellStyle="Subtitle"
        //                             title="Status message"
        //                             detail={'Not set'}
        //                             hideSeparator={true}/>

        // if(status_message){
        //     cell_status_message = <Cell
        //                             cellStyle="Subtitle"
        //                             title="Status message"
        //                             detail={status_message}
        //                             hideSeparator={true}/>
        // }

        /*
        let cell_classs_name =  <Cell cellStyle="Subtitle"
                                    title="Classs"
                                    detail={this.getClasssName(classs)}
                                    contentContainerStyle={{ paddingVertical: 10 }}
                                    hideSeparator={true}/>

        if(status == Constant.FRIEND_STATUS_FRIEND){
            cell_classs_name = <Cell cellStyle="Subtitle"
                                    title="Classs"
                                    detail={this.getClasssName(classs)}
                                    contentContainerStyle={{ paddingVertical: 10 }}
                                    hideSeparator={true}
                                    cellAccessoryView={ <View style={{}}>
                                                            <MyIcon
                                                                name={'edit'}
                                                                size={20}
                                                                color={'gray'} />
                                                        </View>} 
                                    onPress={()=>{
                                        this.openListClasssModal()
                                    }}/>
        }
        */
        
        // Gender
        /*
        let cell_gender = <Cell
                            cellStyle="Subtitle"
                            title="Gender"
                            detail={'Not set'}
                            hideSeparator={true} />
        if(gender){     
            let __ =Constant.gender.filter(function(item){
                        return item.id == gender;
                    })
            
            if(__.length > 0){
                cell_gender = <Cell
                                cellStyle="Subtitle"
                                title="Gender"
                                detail={__[0].name}
                                hideSeparator={true} />
            }
        }
        */

        // let cell_birthday= <Cell
        //                     cellStyle="Subtitle"
        //                     title="Birthday"
        //                     detail={'Not set'}
        //                     hideSeparator={true} />
        // if(birthday){
        //     cell_birthday =  <Cell
        //                         cellStyle="Subtitle"
        //                         title="Birthday"
        //                         detail={Moment(new Date(birthday)).format('MMMM DD, YYYY')}
        //                         hideSeparator={true} />
        // }

        // let cell_intereste_in = <Cell
        //                             cellStyle="Subtitle"
        //                             title="Interested In"
        //                             hideSeparator={true} 
        //                             detail={'Not set'}/>
        // if(intereste_in !== undefined){
        //     let reste_in = []
        //     intereste_in.forEach(function(key, v, arr){
        //         let f = Constant.intereste_in.find(k => k.id==key)
        //         reste_in.push(f.name)
        //     });
        //     cell_intereste_in = <Cell
        //                             cellStyle="Subtitle"
        //                             title="Interested In"
        //                             hideSeparator={true} 
        //                             detail={reste_in.join(", ")}/>
        // }
 
        let cell_address =  <Cell
                                cellStyle="Subtitle"
                                title="Address"
                                hideSeparator={true} 
                                detail={'Not set'}/>
        if(address){
            cell_address =  <Cell
                                cellStyle="Subtitle"
                                title="Address"
                                hideSeparator={true} 
                                detail={address}/>
        }
 
        let cell_phones =  <Cell
                            cellStyle="Subtitle"
                            title="Mobile phones"
                            hideSeparator={true} 
                            detail={'Not set'}/>
        if(phones){
            cell_phones =  <Cell
                            cellStyle="Basic"
                            contentContainerStyle={{  }} 
                            hideSeparator={true}
                            cellContentView={
                                <View>
                                    <Text style={{fontSize:16 }}>
                                    Mobile phones
                                    </Text>
                                </View>
                            }
                        />
        }

        // let cell_website =  <Cell
        //                         cellStyle="Subtitle"
        //                         title="Website"
        //                         hideSeparator={true} 
        //                         detail={'Not set'}/>
        // if(websites){
        //     cell_website =  <Cell
        //                     cellStyle="Basic"
        //                     contentContainerStyle={{  }} 
        //                     hideSeparator={true}
        //                     cellContentView={
        //                         <View>
        //                             <Text style={{fontSize:16 }}>
        //                                 Website
        //                             </Text>
        //                         </View>
        //                     }/>
        // }

        // let cell_email =  <Cell
        //                         cellStyle="Subtitle"
        //                         title="Email"
        //                         hideSeparator={true} 
        //                         detail={'Not set'}/>

        // if(emails){
        //     cell_email =  <Cell
        //                     cellStyle="Basic"
        //                     contentContainerStyle={{  }} 
        //                     hideSeparator={true}
        //                     cellContentView={
        //                         <View>
        //                             <Text style={{fontSize:16 }}>
        //                                 Email
        //                             </Text>
        //                         </View>
        //                     }/>
        // }

        
        return (
            <View style={{flex:1, }}>
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
                    ref={"modalListClasss"}
                    // backdropPressToClose={false}
                    swipeToClose={true}
                    coverScreen={true}
                    swipeArea={50}
                    >
                    <ScrollView>
                        <View style={{marginBottom:20, marginTop:5, flex:1}}>
                            {this.renderListClasss(friend, classs)}
                        </View>
                    </ScrollView>
                </Modal>

                <View style={{height:Header.HEIGHT +  (isIphoneX() ? 25 : 0), //- (Platform.OS == "ios" ? 20 : 0), 
                              backgroundColor: 'rgba(186, 53, 100, 1.0)',
                              justifyContent: Platform.OS == "ios" ?'flex-end':'center'}}>

                    <View style={{flexDirection:'row', 
                                position:'absolute', 
                                }}>
                        <TouchableOpacity
                            style={{padding:10}}
                            onPress={()=>{
                                this.props.navigation.goBack(null)
                            }}>
                            {button_arrow_back}
                        </TouchableOpacity>
                    </View>
                    <View style={{
                                    flexDirection:'row', 
                                    position:'absolute', 
                                    right:0,
                                }}>
                        <TouchableOpacity 
                            style={{padding:10}}
                            onPress={()=>{
                                this.handleFriendFavorite()
                            }}>

                            <MyIcon
                                name={is_favorite ? 'star' : 'star-empty'}
                                size={25}
                                color={'#C7D8DD'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{padding:10}}
                            onPress={()=>{
                                this.handleShare()
                            }}>
                            <MyIcon
                                name={'share'}
                                size={25}
                                color={'#C7D8DD'} />
                        </TouchableOpacity>
                    </View>    
                </View>
                <ScrollView style={{ }}>
                <View style={{flex:1, backgroundColor:'gray', ...ifIphoneX({
                                                    marginBottom: 25
                                                }, {
                                                    marginBottom: 0
                                                })}}>
                    <View style={{flex:1, /*paddingTop: this.getHeaderInset(),*/ flexDirection:'row'}}>
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
                                        borderRadius: 10, 
                                    }}
                                source={{
                                    uri: image_url,
                                    headers:{ Authorization: 'someAuthToken' },
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                        <View style={{justifyContent: 'flex-end', }}>
                            <Text style={{fontSize:22, marginLeft:10, color:'white'}}>{friend.hasOwnProperty('change_friend_name') ? friend.change_friend_name : friend.profile.name }</Text>
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
                                    <View style={{flex:1, flexDirection:'row', justifyContent:'center', padding:5}}>
                                        {friend.status === Constant.FRIEND_STATUS_FRIEND_99 ? <TouchableOpacity
                                            style={{padding:5}}
                                            onPress={()=>{
                                                // this.setState({loading:true})
                                                // this.props.actionInviteFriend(this.props.uid, friend_id, (result) => {
                                                //     this.setState({loading:false})
                                                // })
                                            }}>
                                            <MyIcon
                                                name={'user-plus'}
                                                size={40}
                                                color={'#CE3B6E'}/>
                                        </TouchableOpacity> : <View />}
                                        
                                        <TouchableOpacity
                                            style={{padding:5}}
                                            onPress={()=>{
                                                alert('All application')
                                            }}>
                                            <MyIcon
                                                name={'all-app'}
                                                size={40}
                                                color={'#CE3B6E'}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{padding:5}}
                                            onPress={()=>{
                                                alert('Video call')
                                            }}>
                                            <MyIcon
                                                name={'call'}
                                                size={40}
                                                color={'#CE3B6E'}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{padding:5}}
                                            onPress={()=>{
                                                this.props.navigation.navigate("ChatPage")
                                            }}>
                                            <MyIcon
                                                name={'friend-chat'}
                                                size={40}
                                                color={'#CE3B6E'}/> 
                                        </TouchableOpacity>
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
                                title="Basic Info"
                                titleTextStyle={fontSize= 18}
                                hideSeparator={false}/>
                            
                            {cell_name_subname}
                            {cell_status_message}
                            {cell_classs_name}
                            {cell_gender}
                            {cell_birthday}
                            {cell_intereste_in}
                        </Section>

                        <Section
                            sectionPaddingTop={5}
                            sectionPaddingBottom={0}
                            separatorInsetLeft={0}>
                            <Cell
                                cellStyle="Basic"
                                title="Contact Info"
                                titleTextStyle={fontSize= 18}
                                hideSeparator={false}/>
                            
                            {cell_phones}
                            {this.phonesList(phones)}

                            {cell_address}

                            {cell_website}
                            {this.websitesList(websites)}

                            {cell_email}
                            {this.emailsList(emails)}
                        </Section>
                    </TableView>
                    </View>
                </View>
                </ScrollView> 
            </View>
            </View>
       );
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
        uid:makeUidState(state, ownProps),
        friends:makeFriendsState(state, ownProps),
        // friend_profiles:makeFriendProfilesState(state, ownProps),
        classs:makeClasssState(state, ownProps),

        class_members:makeClassMembersState(state, ownProps),

        friend_profile:makeFriendProfileState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(FriendProfilePage);