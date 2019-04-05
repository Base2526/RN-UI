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
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';
import {
    MenuProvider,
    Menu,
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
  } from 'react-native-popup-menu';

import FriendsPage from '../tab_contacts/FriendsPage'
import GroupsPage from '../tab_contacts/GroupsPage'
import ClasssPage from '../tab_contacts/ClasssPage'

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

class NameCard_HomePage extends React.Component{
    static navigationOptions = { 
        // title: 'Friend profile', 
        header: null ,
    }
    
    constructor(){
        super();
    
        this.state = { 
            loading:false,
            renderContent: false,
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        // const friend_id = navigation.getParam('friend_id', null);

        // this.setState({friend_id},()=>{
        //     this.loadData(this.props)
        // })
    }

    componentWillUnmount(){
        // unsubscribes.map((unsubscribe, k)=>{
        //     unsubscribe()
        // })
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData = (props) =>{
        this.setState({renderContent:true})
    }

    handleFriendFavorite = () =>{
        let {is_favorite} = this.state.friend

        this.setState({loading:true})
        this.props.actionFriendFavirite(this.props.uid, this.state.friend_id, !is_favorite, (result) => {
            this.setState({loading:false})
        })
    }

    handleShare = () => {
        // let {uid, name} = this.state.friend

        let shareOptions = {
            title: "iDNA",
            message: "Name Card",
            // url: Constant.API_URL +  '/profile-main/' + uid,
            subject: "Share Link" //  for email
        };

        Share.open(shareOptions);
    }

    render() {
        let {loading} = this.state

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

        return(<View style={{flex:1}}>
                <Text>Text</Text>
                </View>)
        /*
        return( <View style={{flex:1}}>
                    <Spinner
                        visible={loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}/>
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
                                        // padding:10
                                    }}>
                            <Menu style={{ zIndex: 10 }}>
                                <MenuTrigger>
                                    <MyIcon
                                        style={{padding:10}}
                                        name={'dot-vertical'}
                                        size={20}
                                        color={'#C7D8DD'} />
                                </MenuTrigger>
                                <MenuOptions optionsContainerStyle={{ }}>
                                    
                                    <MenuOption onSelect={() => {
                                        this.handleShare()
                                    }}>
                                        <Text style={{padding:10, fontSize:18}}>Share</Text>
                                    </MenuOption>

                                    <MenuOption onSelect={() => {
                                        // this.handleShare()
                                    }}>
                                        <Text style={{padding:10, fontSize:18}}>Add friend</Text>
                                    </MenuOption>

                                    <MenuOption onSelect={() => {
                                        // this.handleShare()
                                    }}>
                                        <Text style={{padding:10, fontSize:18}}>Register member</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => {}}>
                                        <Text style={{padding:10, fontSize:18}}>Delete</Text>
                                    </MenuOption> 
                                </MenuOptions>
                            </Menu>
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
                        <View style={{ flex:1}}>
                            <TableView>
                                <Section
                                    sectionPaddingTop={0}
                                    sectionPaddingBottom={0}
                                    separatorInsetLeft={0}>
                                    <Cell cellStyle="Subtitle"
                                        title="Compay"
                                        detail={'Klovers company'}
                                        hideSeparator={true}/>
                                    <Cell cellStyle="Subtitle"
                                        title="Name"
                                        detail={'Mr.Somkid Simjarn'}
                                        hideSeparator={true}/>
                                    <Cell
                                        cellStyle="Subtitle"
                                        title="Job position"
                                        detail={'Motion-picture, Programmer, Producer'}
                                        hideSeparator={true}/>
                                    <Cell cellStyle="Basic"
                                        title="Emails"
                                        hideSeparator={true}/>
                                    <Cell
                                        cellStyle="Basic"
                                        title={'mr.simajarn@gmail.com'}
                                        titleTextStyle={{paddingLeft:10,fontStyle:'italic'}}
                                        onPress={()=>{
                                            Linking.openURL(`mailto:${'mr.simajarn@gmail.com'}`)
                                        }}
                                        hideSeparator={true}/>
                                    <Cell cellStyle="Subtitle"
                                        title="Mobiles"
                                        // detail={'0912431242, 0912431243, 0912431244'}
                                        // contentContainerStyle={{ paddingVertical: 10 }}
                                        hideSeparator={true}/>
                                    <Cell
                                        cellStyle="Basic"
                                        title={'0912431242'}
                                        titleTextStyle={{paddingLeft:10,fontStyle:'italic'}}
                                        onPress={()=>{
                                            Linking.openURL(`tel:${'0912431242'}`)
                                        }}
                                        hideSeparator={true}/>
                                    <Cell
                                        cellStyle="Basic"
                                        title={'0912431243'}
                                        titleTextStyle={{paddingLeft:10,fontStyle:'italic'}}
                                        onPress={()=>{
                                            Linking.openURL(`tel:${'0912431243'}`)
                                        }}
                                        hideSeparator={true}/>
                                    <Cell
                                        cellStyle="Basic"
                                        title={'0912431244'}
                                        titleTextStyle={{paddingLeft:10,fontStyle:'italic'}}
                                        onPress={()=>{
                                            Linking.openURL(`tel:${'0912431244'}`)
                                        }}
                                        hideSeparator={true}/>
                                    <Cell cellStyle="Subtitle"
                                        title="Line id"
                                        detail={'Kid_Klovers'}
                                        hideSeparator={true}/>
                                    <Cell cellStyle="Subtitle"
                                        title="We Chat"
                                        detail={'Kid_Klovers'}
                                        hideSeparator={true}/>
                                    <Cell cellStyle="Subtitle"
                                        title="Facebook"
                                        detail={'AThe Station'}
                                        hideSeparator={true}/>
                                    <Cell cellStyle="Subtitle"
                                        title="Facebook Page"
                                        detail={'https://www.facebook.com/FreelanceAndroidWebHtml5/'}
                                        hideSeparator={true}/>
                                    <Cell cellStyle="Subtitle"
                                        title="Instagram"
                                        detail={'agaligo_coffee'}
                                        hideSeparator={true}/>
                                    <Cell
                                        cellStyle="Basic"
                                        // title="Address"
                                        hideSeparator={true} 
                                        cellContentView={
                                            <View>
                                                <Text style={{fontSize:18}}>Address</Text>
                                            <TextInput
                                                style={{fontSize: 16, 
                                                        paddingBottom:10, 
                                                        color:'black',
                                                        textAlignVertical: 'top'}}
                                                value={'927/43ข. ถนน เศรษฐกิจ 1 ตำบลมหาชัย อำเภอเมือง Chang Wat Samut Sakhon 74000'}
                                                clearButtonMode='while-editing'
                                                maxLength={500}
                                                multiline = {true}
                                                editable={false} 
                                                pointerEvents="none"
                                            />
                                            </View>
                                        }/>
                                </Section>
                            </TableView>
                        </View>
                    </View>
                    </ScrollView>
                </View>)

        */ 
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

export default connect(mapStateToProps, actions)(NameCard_HomePage);