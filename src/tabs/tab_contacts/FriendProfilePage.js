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
        Linking,
        TextInput} from 'react-native'

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
import Constant from '../../utils/Constant'
import MyIcon from '../../config/icon-font.js';

import {makeUidState, 
        makeFriendsState, 
        makeFriendProfilePhonesState, 
        makeFriendProfileWebsitesState, 
        makeFriendProfileEmailsState, 
        makePresencesState,
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

            contact_info:{},
            is_online:false,

            friend_phone:{}, 
            friend_website:{}, 
            friend_email:{}
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        const friend_id = navigation.getParam('friend_id', null);

        this.setState({friend_id},()=>{
            this.loadData(this.props)
        })

        this.props.trackProfileFriend(friend_id, (data)=>{
            unsubscribes = data.unsubscribes
        })
    }

    componentWillUnmount(){
        unsubscribes.map((unsubscribe, k)=>{
            unsubscribe()
        })
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData = (props) =>{
        let {friend_id} = this.state
        let {friends, 
            classs, 
            class_members, 
            presences, 
            friend_phones, 
            friend_websites, 
            friend_emails} = props

        // console.log(friend_phones, 
        //             friend_websites, 
        //             friend_emails,)

        let friend =_.find(friends, (v,k)=>{
                        return k == friend_id
                    })

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

        // phones, websites, emails, my_ids
        let friend_phone = {}
        if(!isEmpty(friend_phones)){
            friend_phone =  _.find(friend_phones, (v, k)=>{
                                return k == friend_id
                            })
        }

        let friend_website = {}
        if(!isEmpty(friend_websites)){
            friend_website =_.find(friend_websites, (v, k)=>{
                                return k == friend_id
                            })
        }

        let friend_email = {}
        if(!isEmpty(friend_emails)){
            friend_email =  _.find(friend_emails, (v, k)=>{
                                return k == friend_id
                            })
        }

        // console.log(friend_phone, friend_website, friend_email)
        // phone, website, email

        /// check is online
        let presence =  _.find(presences, (v, k)=>{
                            return k == friend_id
                        })
        // console.log(presence)
        let is_online = false
        if(!isEmpty(presence)){
            let __ =_.find(presence, (presence_v, presence_k)=>{
                return presence_v.status == 'online'
            })
            if(!isEmpty(__) ){
                is_online = true
            }
        }
        /// check is online

        // console.log(is_online)

        this.setState({ friend, 
                        classs:new_classs, 
                        is_online, 
                        friend_phone, 
                        friend_website, 
                        friend_email,
                        renderContent:true})
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
  
        return HEADER_HEIGHT
    }

    handleFriendFavorite = () =>{
        let {is_favorite} = this.state.friend

        this.setState({loading:true})
        this.props.actionFriendFavirite(this.props.uid, this.state.friend_id, !is_favorite, (result) => {
            this.setState({loading:false})
        })
    }

    handleShare = () => {
        let {uid, name} = this.state.friend

        let shareOptions = {
            title: "iDNA",
            message: "Profile " + name,
            url: Constant.API_URL +  '/profile-main/' + uid,
            subject: "Share Link" //  for email
        };

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
        let select =_.find(members, (v, k)=>{
                        return friend.uid === v.friend_id && v.status
                    })

        if(select){
            return(<MyIcon
                        name={'check-ok'}
                        size={25}
                        color={'#CE3B6E'}/>)
        }
    }

    renderListClasss(friend, classs) {
        return _.map(classs, (value, key)=>{
            return(
                <TouchableOpacity 
                    key={ key } 
                    onPress={() => {
                        let members = classs[key].members
                        let select = _.find(members, (v, k)=>{
                            return friend.uid === v.friend_id
                        })

                        let status = true
                        if(select){
                            status = !select.status

                            let member_key = _.findKey(members,  function(v, k) { 
                                return friend.uid === v.friend_id
                            })

                            this.setState({loading:true})
                            this.props.actionSelectClassMember(this.props.uid, friend.uid, value.class_id, member_key, status, (result)=>{
                                this.setState({loading:false})
                            })
                        }else{

                            let member_key = randomKey()
                            this.setState({loading:true})
                            this.props.actionSelectClassMember(this.props.uid, friend.uid, value.class_id, member_key, status, (result)=>{
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
        _.map(classs, (v, _k)=>{
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

    phonesList(phone){
        if( isEmpty(phone) ){
            return;
        }
        return _.map(phone, (value, key)=>{
            return <Cell
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
                hideSeparator={true}/>
        })
    }

    websitesList(website){
        if(isEmpty(website) ){
            return;
        }

        return _.map(website, (value, key)=>{
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

    emailsList(email){
        if( isEmpty(email) ){
            return;
        }

        return _.map(email, (value, key)=>{
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
        let {friend, is_online, renderContent, loading} = this.state
        if(!renderContent){
            return(<View style={{flex:1}}></View>)
        }

        console.log(friend)
        let {
            name,
            change_friend_name,
            status_message, 
            image_url, 
            bg_url, 
            is_favorite, 
            status, 
            gender,
            birthday,
            address,
            intereste_in} = friend

        let {friend_id, 
            classs, 
            friend_phone, 
            friend_website, 
            friend_email} = this.state

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
                                this.props.navigation.navigate('ChangeFriendsName', {"friend": friend})
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

        let cell_address =<Cell
                                cellStyle="Subtitle"
                                title="Address"
                                hideSeparator={true} 
                                detail={'Not set'}/>

        if(address){
            cell_address =<Cell
                            cellStyle="Basic"
                            title="Address"
                            hideSeparator={true} 
                            cellContentView={
                                <View>
                                    <Text style={{fontSize:18}}>Address</Text>
                                <TextInput
                                    style={{fontSize: 16, 
                                            paddingBottom:10, 
                                            color:'black',
                                            textAlignVertical: 'top'}}
                                    value={address}
                                    clearButtonMode='while-editing'
                                    maxLength={500}
                                    multiline = {true}
                                    editable={false} 
                                    pointerEvents="none"
                                />
                                </View>
                              }/>
        }

        let cell_phones =  <Cell
                                cellStyle="Subtitle"
                                title="Mobile phones"
                                hideSeparator={true} 
                                detail={'Not set'}/>
        if(!isEmpty(friend_phone)){
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
        if(!isEmpty(friend_website)){
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
        if(!isEmpty(friend_email)){
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

        let section_contact_info =  <Section
                                    sectionPaddingTop={5}
                                    sectionPaddingBottom={0}
                                    separatorInsetLeft={0}>
                                    <Cell
                                        cellStyle="Basic"
                                        title="Contact Info"
                                        titleTextStyle={fontSize= 18}
                                        hideSeparator={false}/>
                                    
                                    {cell_phones}
                                    {this.phonesList(friend_phone)}

                                    {cell_website}
                                    {this.websitesList(friend_website)} 

                                    {cell_email}
                                    {this.emailsList(friend_email)}                                    
                                </Section>

        let view_name = <View style={{ }}>
                            <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                                <Text style={{fontSize:22, marginLeft:10, color:'white'}}>{name}</Text>
                                {edit_name}
                            </View>
                            {view_status_message}
                        </View>

        if(!isEmpty(change_friend_name)){
            view_name = <View style={{}}>
                            <View style={{flexDirection:'row', }}>
                                <Text style={{fontSize:22, marginLeft:10, color:'white'}}>{  change_friend_name  }</Text>
                                {edit_name}
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:12, marginLeft:10, color:'white'}}>{ name }</Text>
                            </View>
                            {view_status_message}
                        </View>
        }

        return( <View style={{flex:1}}>
                    <Spinner
                        visible={loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}/>
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
                                {is_online ? <View style={{ width: 12, 
                                                            height: 12, 
                                                            backgroundColor: '#00ff80', 
                                                            position: 'absolute',
                                                            borderWidth: 2,
                                                            borderColor: 'white',
                                                            borderRadius: 6,
                                                            right: -3,
                                                            top: -3
                                                            }} /> : <View />}
                            </TouchableOpacity>
                                {view_name}
                            </View>

                            <View style={{position:'absolute', 
                                        flexDirection:'row', 
                                        right:0, 
                                        bottom:0,
                                        padding:5}}>
                                <TouchableOpacity
                                    onPress={()=>{
                                        let params = {'type':'private', 'data':friend}
                                        this.props.navigation.navigate("ChatPage", {'title': 'Private ' + friend.name, params})
                                    }}>
                                    <MyIcon
                                        style={{padding:5}}
                                        name={'friend-chat'}
                                        size={30}
                                        color={'#C7D8DD'} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={()=>{
                                        alert('video call')
                                    }}>
                                    <MyIcon
                                        style={{padding:5}}
                                        name={'call'}
                                        size={30}
                                        color={'#C7D8DD'} />
                                </TouchableOpacity>
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

                                    {cell_address}

                                </Section>

                                {section_contact_info}

                            </TableView>
                        </View>

                    </View>
                    </ScrollView>
                </View>)
    }
}

const mapStateToProps = (state, ownProps) => {
    if(!state._persist.rehydrated){
        return {}
    }

    if(!state.auth.isLogin){
        return;
    }
  
    return{
        uid:makeUidState(state, ownProps),
        friends:makeFriendsState(state, ownProps),
        friend_phones: makeFriendProfilePhonesState(state, ownProps),
        friend_websites: makeFriendProfileWebsitesState(state, ownProps),
        friend_emails: makeFriendProfileEmailsState(state, ownProps),
        presences:makePresencesState(state, ownProps),
        classs:makeClasssState(state, ownProps),
        class_members:makeClassMembersState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(FriendProfilePage);