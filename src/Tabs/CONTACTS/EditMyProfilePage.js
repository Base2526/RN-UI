import React from 'react'
import {View, 
        Alert, 
        Text, 
        TouchableOpacity, 
        TextInput,
        ScrollView,
        SafeAreaView,
        Dimensions,} from 'react-native'
import { connect } from 'react-redux';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome5';
import DatePicker from 'react-native-datepicker'
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-picker';
import Moment from 'moment'
import { isIphoneX } from 'react-native-iphone-x-helper'
var _ = require('lodash');
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modalbox';

import {
    MenuProvider,
    Menu,
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
  } from 'react-native-popup-menu';

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'
import MyModal from '../../Utils/MyModal'
import MyIcon from '../../config/icon-font.js';
import {randomKey, getHeaderInset} from '../../Utils/Helpers'

import {makeUidState, 
        makeProfileState, 
        makeMyIdsState,
        makePhonesState,
        makeWebsitesState,
        makeEmailsState} from '../../Reselect'

class EditMyProfilePage extends React.Component{
    static navigationOptions = ({ navigation }) => {
        return {
            title: "Edit My Profile",
            headerTintColor: '#C7D8DD',
            headerStyle: {
                backgroundColor: 'rgba(186, 53, 100, 1.0)',
                // ios navigationoptions underline hide
                borderBottomWidth: 0,
    
                // android navigationoptions underline hide
                elevation: 0,
                shadowOpacity: 0
            },
            headerRight: (
                <View style={{marginRight:10}}>
                    <TouchableOpacity
                        style={{padding:5}}
                        // disabled={isModify ? false: true}
                        onPress={() => {
                            const { params = {} } = navigation.state
                            params.handleCancel()
                        }}>
                        <MyIcon
                            name={'cancel'}
                            size={25}
                            color={'#C7D8DD'} />
                    </TouchableOpacity>
                </View>
            ),
        }
    }

    constructor(props) {
        super(props)

        Moment.locale('en');
        this.state ={
            profile: null,
            myIds: null,
            phones: null,
            websites: null,
            emails: null,
            renderContent: false,

            profiles: {},
            profile_picture: '',
            background_picture: '',
            date: Moment(new Date()).format('YYYY-MM-DD'),
            gender: Constant.gender,
            intereste_in: Constant.intereste_in,
            is_open_modal_gender: false,
            is_open_modal_InteresteIn: false,
            loading:false,
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({handleCancel: this.handleCancel })
        
        this.loadData(this.props)
    }

    componentWillReceiveProps(nextProps) {

        this.loadData(nextProps)
    }

    loadData = (props) =>{
        let {profile, myIds, phones, websites, emails} = props

        this.setState({profile, myIds, phones, websites, emails,  renderContent:true})
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    openModalGender(){
        this.refs.modalGender.open()
    }

    openModalInteresteIn(){
        this.refs.modalInteresteIn.open()
    }

    getHeightInteresteIn(){
        // let classs = this.props.auth.users.classs

        /*
        80 : ความสูงของ item
        45 : ความสูงของ header x
        */
        // let height = Object.keys(3).length * 80 + 45

        let height = 2 * 60

        if(height > Dimensions.get('window').height){
            return (Dimensions.get('window').height - 100);
        }

        // console.log(height)

        if(isIphoneX()){
            return height + 30;
        }

        return height;
    }

    getHeightGender(){
        // let classs = this.props.auth.users.classs

        /*
        80 : ความสูงของ item
        45 : ความสูงของ header x
        */
        // let height = Object.keys(3).length * 80 + 45

        let height = 3 * 60

        if(height > Dimensions.get('window').height){
            return (Dimensions.get('window').height - 100);
        }


        if(isIphoneX()){
            return height + 30;
        }

        return height;
    }

    renderInteresteIn(intereste_in){
        return Constant.intereste_in.map((data) => {
            let __check = null
            if(intereste_in !== undefined){
                let f = _.find(intereste_in, (v, k)=>{ 
                    return v == data.id
                })

                if(f !== undefined){
                    __check = <MyIcon
                                name={'check-ok'}
                                size={25}
                                color={'#900'} />
                }
            }
            
            return(<TouchableOpacity key={data.id} 
                        onPress={() => {
                        //    let intereste_in = intereste_in;
                           if(intereste_in !== undefined){
                                
                                // let _find = intereste_in.find(v=>{
                                let _find = _.find(intereste_in, (v, k)=>{ 
                                    return v == data.id;
                                })

                                let newValue = null
                                if(_find === undefined){
                                    newValue = [...intereste_in, data.id]

                                    // console.log('intereste_in', newValue)
                                }else{
                                    newValue = intereste_in.filter(function(v, k) { 
                                    // newValue = _.find(intereste_in, (v, k)=>{ 
                                        return v != data.id 
                                    })

                                    // console.log('intereste_in', intereste_in)
                                    // console.log('intereste_in', newValue)
                                }

                                // console.log('intereste_in', data.id, intereste_in, newValue)

                                this.setState({loading:true})
                                this.props.actionInteresteInProfile(this.props.uid, newValue, (result) => {
                                    console.log(result)

                                    this.setState({loading:false})
                                })
                            }else{
                                this.setState({loading:true})
                                this.props.actionInteresteInProfile(this.props.uid, [data.id], (result) => {
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
                            height:60,}}>
                            <View style={{paddingLeft: 10}}>
                                <Text style={{fontSize: 18, 
                                                fontWeight: '600', 
                                                paddingBottom:5
                                            }}>
                                    {data.name}
                                </Text>
                            </View>
                            <View style={{paddingLeft: 10, position:'absolute', right:0, marginRight:10}}>
                                {__check}
                            </View>
                            <View
                                style={{
                                    height: 1,
                                    width: "100%",
                                    backgroundColor: "#CED0CE",
                                    // marginLeft: "14%",
                                    position:'absolute',
                                    bottom: 0,
                                    right: 0,
                                }}
                            />
                        </View>
                    </TouchableOpacity>)
        })
    }

    renderGender(gender) {
        return Constant.gender.map((data) => {
            let __check = null
            if(gender !== undefined){
                console.log('renderGender', gender, data.id)
                if(gender == data.id){
                    __check = <MyIcon
                                name={'check-ok'}
                                size={25}
                                color={'#900'} />// <Icon name="check" size={25} color="#900" />
                }
            }

            return (
                <TouchableOpacity key={data.id} 
                    onPress={() => {
                        if(gender !== undefined){
                            if(gender != data.id){
                                this.props.actionGenderProfile(this.props.uid, data.id, (result) => {
                                    console.log(result)
                                })
                            }
                        }else{
                            this.props.actionGenderProfile(this.props.uid, data.id, (result) => {
                                console.log(result)
                            })
                        }
                    }}>
                    <View
                        style={{
                        alignItems: 'center', 
                        padding: 10,
                        flexDirection: 'row',
                        height:60,
                        }}>
                        <View style={{paddingLeft: 10}}>
                            <Text style={{fontSize: 18, 
                                            fontWeight: '600', 
                                            paddingBottom:5
                                        }}>
                                {data.name}
                            </Text>
                        </View>
                        <View style={{paddingLeft: 10, position:'absolute', right:0, marginRight:10}}>
                            {__check}
                        </View>
                        <View
                            style={{
                                height: 1,
                                width: "100%",
                                backgroundColor: "#CED0CE",
                                // marginLeft: "14%",
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

    menuPhone = (key, value) =>{
        return(<View style={{flex:1,position:'absolute', right:0, top:0, marginRight:5}}>
                    <Menu>
                    <MenuTrigger>
                        <MyIcon 
                            style={{padding:5}}
                            name={'dot-horizontal'}
                            size={15}
                            color={'gray'} />  
                    </MenuTrigger>
                    <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset())}}>
                        <MenuOption onSelect={() => {
                                this.props.navigation.navigate("AddAnotherPhone", {title:'Edit phone', mode: 'edit', key, value, onAddAnotherPhone: this.onAddAnotherPhone})
                            }}>
                            <Text style={{padding:10, fontSize:18}}>Edit</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => {
                            Alert.alert(
                                'Delete',
                                'Are sure delete phone ?',
                                [
                                //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                    {text: 'Cancel', onPress: () => {

                                    }, style: 'cancel'},
                                    {text: 'Delete', onPress: () => {
                                    this.setState({loading:true})
                                    this.props.actionRemovePhoneProfile(this.props.uid, key, (result) => {
                                        console.log(result)

                                        this.setState({loading:false})
                                    })
                                    }},
                                ],
                                { cancelable: false }
                            )
                        }}>
                            <Text style={{padding:10, fontSize:18}}>Delete</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
                </View>)
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
                        <Text style={{fontSize: 22, color:'gray' }}>
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
                    {this.menuPhone(key, value)}
                </View>
            }
        />)
        })
    }

    menuEmail = (key, value) =>{
        return(<View style={{flex:1,position:'absolute', right:0, top:0, marginRight:5}}>
                    <Menu>
                    <MenuTrigger>
                        <MyIcon 
                            style={{padding:5}}
                            name={'dot-horizontal'}
                            size={15}
                            color={'gray'} />  
                    </MenuTrigger>
                    <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset())}}>
                        <MenuOption onSelect={() => {
                                this.props.navigation.navigate("AddAnotherEmail", {'title':"Edit email", 'mode': 'edit', key, value, onAddAnotherEmail: this.onAddAnotherEmail}) 
                            }}>
                            <Text style={{padding:10, fontSize:18}}>Edit</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => {
                                Alert.alert(
                                    'Delete',
                                    'Are sure delete phone ?',
                                    [
                                    //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                      {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                      {text: 'Delete', onPress: () => {
                                        this.setState({loading:true})
                                        this.props.actionRemoveEmailProfile(this.props.uid, key, (result) => {
                                            console.log(result)

                                            this.setState({loading:false})
                                        })
                                      }},
                                    ],
                                    { cancelable: false }
                                )
                            }}>
                            <Text style={{padding:10, fontSize:18}}>Delete</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
                </View>)
    }

    emailsList(emails){
        if(emails === undefined){
            return;
        }

        return Object.entries(emails).map(([key, value]) => {
            return(<Cell
                    key={key}
                    cellStyle="Subtitle"
                    titleTextColor="#007AFF"
                    hideSeparator={true} 
                    cellContentView={
                    <View style={{flex:1,}}>
                        <View style={{flex:1, padding:5}}>
                            <Text style={{flex:1, fontSize: 22, color:'gray',  }}>
                                {value.email}
                            </Text>
                        </View>
                        {this.menuEmail(key, value)}
                    </View>
                }
            />)
        })
    }

    menuWebsite = (key, value) =>{
        return(<View style={{flex:1,position:'absolute', right:0, top:0, marginRight:5}}>
                    <Menu>
                    <MenuTrigger>
                        <MyIcon 
                            style={{padding:5}}
                            name={'dot-horizontal'}
                            size={15}
                            color={'gray'} />  
                    </MenuTrigger>
                    <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset())}}>
                        <MenuOption onSelect={() => {
                                this.props.navigation.navigate("AddAnotherWebsite", {'title':"Edit website", 'mode': 'edit', key, value, onAddAnotherWebsite: this.onAddAnotherWebsite}) 
                            }}>
                            <Text style={{padding:10, fontSize:18}}>Edit</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => {
                                Alert.alert(
                                    'Delete',
                                    'Are sure delete phone ?',
                                    [
                                    //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                      {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                      {text: 'Delete', onPress: () => {
                                            this.setState({loading:true})
                                            this.props.actionRemoveWebsiteProfile(this.props.uid, key, (result) => {
                                                console.log(result)

                                                this.setState({loading:false})
                                            })
                                      }},
                                    ],
                                    { cancelable: false }
                                )
                            }}>
                            <Text style={{padding:10, fontSize:18}}>Delete</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>)
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
                // accessory="DisclosureIndicator"
                cellContentView={
                <View style={{flex:1}}>
                    <View style={{flex:1, padding:5}}>
                        <Text style={{fontSize: 22, color:'gray' }}>
                            {value.url}
                        </Text>
                    </View>
                    {this.menuWebsite(key, value)}
                </View>
                }
            />)
        })
    }

    profilePicture = () => {
        let options =  {
            title: 'Select profile picture',
            // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            noData: true,
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
            quality: 0.7,
            maxWidth: 500,
            maxHeight: 500,
        }

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({loading:true})
                this.props.actionUpdatePictureProfile(this.props.uid, response.uri).then((result) => {
                    console.log(result)
                    this.setState({loading:false})
                    if(!result.status){
                        setTimeout(() => {
                            Alert.alert('Oops!', result.message);
                        }, 100);
                    }
                })
            }
        });
    }

    backgroundPicture = () =>{
        let options =  {
            title: 'Select backgroud picture',
            // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            noData: true,
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
            quality: 0.7,
            maxWidth: 500,
            maxHeight: 500,
        }

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({loading:true})
                this.props.actionUpdatePictureBGProfile(this.props.uid, response.uri).then((result) => {
                    console.log(result)
                    this.setState({loading:false})
                    if(!result.status){
                        setTimeout(() => {
                            Alert.alert('Oops!', result.message);
                        }, 100);
                    }
                })
            }
        });
    }

    onAddAnotherPhone = (result) =>{
        console.log(result)
        // console.log(randomKey())

        /*
        if(Object.keys(this.state.profiles.phones).length == 0){
            // กรณียังไม่เคยมี
            let p = {...this.state.profiles, phones:{[randomKey()]:result.value} }
            this.setState({profiles:p})
        }else{
            if(result.mode == 'add'){  
                let p = {...this.state.profiles, phones:{...this.state.profiles.phones, [randomKey()]:result.value} }
                this.setState({profiles:p})
            }else if(result.mode == 'edit'){

                console.log('edit')
                console.log(this.state.profiles.phones)

                let phones = this.state.profiles.phones

                let value = null
                _.each(phones, function(_v, _k) { 
                    if(_k === result.key){
                        value = _v
                    }
                });

                if(value !== null){
                    let newPhones = {...phones, [result.key]:result.value}
                    // console.log(newPhones)

                    let p = {...this.state.profiles, phones:{...phones, [result.key]:result.value} }
                    this.setState({profiles:p})

                    // console.log(p)
                }
            }
        }
        */

    }

    onAddAnotherEmail = (result) =>{
        let {emails} = this.props.profile
        console.log(result, emails)

        if(Object.keys(emails).length == 0){
            // กรณียังไม่เคยมี
            // let p = {...this.state.profiles, mails:{[randomKey()]:result.value} }

            // this.setState({profiles:p})
        }else{
            if(result.mode == 'add'){  
                // let p = {...this.state.profiles, mails:{...this.state.profiles.mails, [randomKey()]:result.value} }
                
                // // console.log(p)
                // this.setState({profiles:p})
            }else if(result.mode == 'edit'){

                // console.log('edit')
                // console.log(this.state.profiles.mails)

                // let mails = this.state.profiles.mails

                // let value = null
                // _.each(mails, function(_v, _k) { 
                //     if(_k === result.key){
                //         value = _v
                //     }
                // });

                // if(value !== null){
                //     let p = {...this.state.profiles, mails:{...mails, [result.key]:result.value} }
                //     this.setState({profiles:p})

                //     console.log(p)
                // }
            }
        }
    }

    onAddAnotherWebsite = (result) =>{
        console.log(result)

        /*
        if(this.state.profiles.websites === undefined){
            let p = {...this.state.profiles, websites:{[randomKey()]:result.value} }
            // console.log(p)
            this.setState({profiles:p})
        }else {
            if(result.mode == 'add'){  
                let p = {...this.state.profiles, websites:{...this.state.profiles.websites, [randomKey()]:result.value} }
                
                // console.log(p)
                this.setState({profiles:p})
            }else if(result.mode == 'edit'){

                // console.log('edit')
                // console.log(this.state.profiles.mails)

                let websites = this.state.profiles.websites

                let value = null
                _.each(websites, function(_v, _k) { 
                    if(_k === result.key){
                        value = _v
                    }
                });

                if(value !== null){
                    let p = {...this.state.profiles, websites:{...websites, [result.key]:result.value} }
                    this.setState({profiles:p})

                    // console.log(p)
                }
            }
        }
        */
    }

    handleName = (name) => {
        // let p = {...this.state.profiles, name }
        // this.setState({profiles:p})
    }

    handleStatusMessage = (message) => {
        // let p = {...this.state.profiles, status_message:message }
        // this.setState({profiles:p})
    }

    handleAddress = (address) => {
        // let p = {...this.state.profiles, address }
        // this.setState({profiles:p})
    }

    render(){

        let {renderContent} = this.state

        if(!renderContent){
            return(<View style={{flex:1}}></View>)
        }

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
             } = this.state.profile 

        let {phones, websites, emails} = this.state

        let my_ids = this.state.myIds
        
        let my_id = ''
        if(my_ids !== undefined){
            let __ =_.find(my_ids,  function(v, k) { 
                return v.enable
            })

            if(__ !== undefined){
                my_id = __.id
            }
        }

       
        // gender
        let cellGender =    <Cell cellStyle="RightDetail"
                                // titleTextColor="#007AFF"
                                hideSeparator={true} 
                                accessory="DisclosureIndicator"
                                title="Gender"
                                detail={'None'}
                                onPress={()=>{
                                    this.openModalGender()
                                }}/>

        console.log('renderGender', gender, this.state.profile)
        
        if(gender !== undefined){       
            let __ = Constant.gender.filter(function(item){
               return item.id == gender;
            })
           
            if(__.length > 0){
                // gender = __[0].name
                cellGender =    <Cell cellStyle="RightDetail"
                                // titleTextColor="#007AFF"
                                hideSeparator={true} 
                                accessory="DisclosureIndicator"
                                title="Gender"
                                detail={__[0].name}
                                onPress={()=>{
                                    this.openModalGender()
                                }}/>
            }
        }

        // intereste_in
        let cellInteresteIn =   <Cell
                                    cellStyle="RightDetail"
                                    // titleTextColor="#007AFF"
                                    hideSeparator={true} 
                                    accessory="DisclosureIndicator"
                                    title="Intereste In"
                                    detail={"None"}
                                    onPress={()=>{
                                        this.openModalInteresteIn()
                                    }}
                                />
        if(intereste_in !== undefined){
            let resteIn = []
            
            intereste_in.forEach(function(key, v, arr){
                let f = Constant.intereste_in.find(k => k.id==key)
                resteIn.push(f.name)
            });

            if(resteIn.length > 0){
                cellInteresteIn =   <Cell cellStyle="RightDetail"
                                        // titleTextColor="#007AFF"
                                        hideSeparator={true} 
                                        accessory="DisclosureIndicator"
                                        title="Intereste In"
                                        detail={resteIn.join(", ")}
                                        onPress={()=>{
                                            this.openModalInteresteIn()
                                        }}
                                    />
            }
        }

        // let birthday = 'Not set'
        // if(this.state.profiles.birthday !== undefined){
        //     birthday = this.state.profiles.birthday
        // }
        let cellBirthday = <Cell cellStyle="Subtitle"
                                titleTextColor="#007AFF"
                                hideSeparator={true} 
                                accessory="DisclosureIndicator"
                                // title="Birthday"
                                cellContentView={
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <View style={{flex: 1,
                                            justifyContent: 'center'}}>
                                            <Text style={{fontSize: 16 }}>
                                                Birthday
                                            </Text>
                                        </View>
                                        <View style={{position:'absolute', right:0, alignSelf: 'center',}}>
                                            <Text style={{fontSize:16, color:'gray'}}>Not set</Text>
                                        </View>
                                        <View style={{flex: 1, }}>
                                                <DatePicker
                                                    ref={(ref)=>this.datePickerRef=ref}
                                                    style={{width: 200}}
                                                    date={Moment(birthday).format('YYYY-MM-DD')}
                                                    mode="date"
                                                    placeholder="select date"
                                                    format="YYYY-MM-DD"
                                                    minDate="1920-01-01"
                                                    maxDate={this.state.date}
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    hideText={true}
                                                    customStyles={{
                                                    dateIcon: {
                                                        position: 'absolute',
                                                        width:0,
                                                        height:0,
                                                    },
                                                    dateInput: {
                                                        marginLeft: 36
                                                    }
                                                    // ... You can check the source to find the other keys.
                                                    }}
                                                    onDateChange={(date) => {
                                                        this.props.actionBirthdayProfile(this.props.uid, Moment(date).format('MMMM DD, YYYY'), (result) => {
                                                            console.log(result)
                                                        })
                                                    }}
                                                />
                                        </View>
                                    </View>
                                }
                                onPress={()=>{
                                    this.datePickerRef.onPressDate()
                                }}
                            />

        if(birthday !== undefined){
            cellBirthday = <Cell
                                cellStyle="Subtitle"
                                titleTextColor="#007AFF"
                                hideSeparator={true} 
                                accessory="DisclosureIndicator"
                                // title="Birthday"
                                cellContentView={
                                    <View style={{flex:1, flexDirection:'row'}}>
                                                <View style={{flex: 1,
                                                    justifyContent: 'center'}}>
                                                    <Text style={{fontSize: 16 }}>
                                                        Birthday
                                                    </Text>
                                                </View>
                                                <View style={{position:'absolute', right:0, alignSelf: 'center',}}>
                                                    <Text style={{fontSize:16, color:'gray'}}>{birthday}</Text>
                                                </View>
                                                <View style={{flex: 1, }}>
                                                        <DatePicker
                                                            ref={(ref)=>this.datePickerRef=ref}
                                                            style={{width: 200}}
                                                            date={Moment(birthday).format('YYYY-MM-DD')}
                                                            mode="date"
                                                            placeholder="select date"
                                                            format="YYYY-MM-DD"
                                                            minDate="1920-01-01"
                                                            maxDate={this.state.date}
                                                            confirmBtnText="Confirm"
                                                            cancelBtnText="Cancel"
                                                            hideText={true}
                                                            customStyles={{
                                                            dateIcon: {
                                                                position: 'absolute',
                                                                width:0,
                                                                height:0,
                                                            },
                                                            dateInput: {
                                                                marginLeft: 36
                                                            }
                                                            // ... You can check the source to find the other keys.
                                                            }}
                                                            onDateChange={(date) => {
                                                                this.props.actionBirthdayProfile(this.props.uid, Moment(date).format('MMMM DD, YYYY'), (result) => {
                                                                    console.log(result)
                                                                })
                                                            }}
                                                        />
                                                </View>
                                            </View>
                        
                                }
                                onPress={()=>{
                                    this.datePickerRef.onPressDate()
                                }}
                            />
        }

        let cellAddress =   <Cell
                                accessory="DisclosureIndicator"
                                cellContentView={
                                    <TextInput
                                            style={{ fontSize: 22, flex: 1, color :"gray", marginBottom:10}}
                                            placeholder="None"
                                            value={'Not set'}
                                            editable={false} 
                                            multiline = {true}
                                            pointerEvents="none"
                                        />
                                }
                                onPress={()=>{
                                    this.props.navigation.navigate("EditAddressPage", {'title':"Add Address", 'mode': 'add'})
                                }}/>
        if(address !== undefined) {
            cellAddress =   <Cell
                                accessory="DisclosureIndicator"
                                cellContentView={
                                    <TextInput
                                        style={{ fontSize: 22, flex: 1, color :"gray", marginBottom:10}}
                                        placeholder="None"
                                        value={address}
                                        editable={false} 
                                        multiline = {true}
                                        pointerEvents="none"
                                    />
                                }
                                onPress={()=>{
                                    this.props.navigation.navigate("EditAddressPage", {'title':"Add Address", 'mode': 'edit'})
                                }}
                            />
        }

        // console.log(this.props.profile)
        // return(<View><Text>this.props.profile</Text></View>)

        return(
            <MenuContext>
        <SafeAreaView style={{flex:1}}>
            <Spinner
                visible={this.state.loading}
                textContent={'Wait...'}
                textStyle={{color: '#FFF'}}
                overlayColor={'rgba(0,0,0,0.5)'}
            />
            <Modal 
                style={{zIndex:10, 
                        height:this.getHeightGender(), 
                    }} 
                position={"bottom"} 
                ref={"modalGender"}
                // backdropPressToClose={false}
                swipeToClose={true}
                swipeArea={50}  
                coverScreen={true}>
                <ScrollView>
                    <View
                        style={{marginLeft:10, marginRight:10, marginBottom:20, marginTop:5, flex:1}}>
                        {this.renderGender(gender)}
                    </View>
                </ScrollView>
            </Modal>
            <Modal 
                style={{zIndex:10, 
                        height:this.getHeightInteresteIn(), 
                    }} 
                position={"bottom"} 
                ref={"modalInteresteIn"}
                backdropPressToClose={true}
                swipeToClose={true}
                swipeArea={50}
                coverScreen={true}>
                <ScrollView>
                    <View
                        style={{marginLeft:10, marginRight:10, marginBottom:20, marginTop:5, flex:1}}>
                        {this.renderInteresteIn(intereste_in)}
                    </View>
                </ScrollView>
            </Modal>

            <KeyboardAwareScrollView>
                
            <View style={{flex: 1}}>
          
            <TableView >
                <Section
                    sectionPaddingTop={5}
                    sectionPaddingBottom={0}
                    separatorInsetLeft={0}>
                    <Cell
                        cellStyle="Basic"
                        title="Profile Picture"
                        titleTextStyle={fontSize= 16}
                        hideSeparator={false}/>
                    <Cell
                        cellStyle="Basic"
                        titleTextColor="#007AFF"
                        hideSeparator={true}
                        // contentContainerStyle={{ paddingLeft:0, paddingRight:0 }}
                        cellContentView={
                        <View style={{
                                flexDirection:'row', 
                                height: 150,
                                width: 150,
                                margin: 10}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.profilePicture()
                                }}>
                                <FastImage
                                    style={{width: 150, height: 150}}
                                    source={{
                                        uri: image_url,
                                        headers:{ Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{position:'absolute', right:0, bottom:0, padding:5, margin:5}}
                                            onPress={()=>{this.profilePicture()}}>
                                <MyIcon
                                    name={'camera'}
                                    size={20}
                                    color={'#C7D8DD'} 
                                    />
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
                        title="Background Picture"
                        titleTextStyle={fontSize= 16}
                        hideSeparator={false}/>
                    <Cell
                        cellStyle="Basic"
                        titleTextColor="#007AFF"
                        hideSeparator={true}
                        cellContentView={
                        <View style={{
                                    flexDirection:'row', 
                                    height: 150,
                                    width: 150,
                                    margin: 10}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.backgroundPicture()
                                }}>
                                
                                <FastImage
                                    style={{width: 150, height: 150}}
                                    source={{
                                        uri: bg_url,
                                        headers:{ Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}/>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{position:'absolute', right:0, bottom:0, padding:5, margin:5}}
                                onPress={()=>{
                                    this.backgroundPicture()
                                }}>
                                <MyIcon
                                    name={'camera'}
                                    size={20}
                                    color={'#C7D8DD'} 
                                    />
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
                    <Cell
                        cellStyle="Basic"
                        title="Display name"
                        titleTextStyle={fontSize= 16}
                        hideSeparator={true}/>
                    <Cell
                        accessory="DisclosureIndicator"
                        hideSeparator={true}
                        cellContentView={
                            <TextInput
                                style={{ fontSize: 22, flex: 1, color:'gray' }}
                                placeholder="None"
                                ref= {(el) => { this.name = el; }}
                                onChangeText = {this.handleName}
                                value={name}
                                multiline={true}
                                editable={false}
                                pointerEvents="none"
                            />
                        }
                        onPress={()=>{
                            this.props.navigation.navigate("EditDisplayNamePage")
                        }}
                        />
                    <Cell
                        cellStyle="Basic"
                        title="Status messsage"
                        titleTextStyle={fontSize= 16}
                        hideSeparator={true}/>
                    <Cell
                        accessory="DisclosureIndicator"
                        hideSeparator={true}
                        cellContentView={
                            <TextInput
                                style={{ fontSize: 22, flex: 1, marginBottom:10, color:'gray'}}
                                placeholder="Not set"
                                multiline={true}
                                ref= {(el) => { this.message = el; }}
                                onChangeText = {this.handleStatusMessage}
                                value={status_message}

                                editable={false}
                                pointerEvents="none"
                            />
                        }
                        onPress={()=>{
                            this.props.navigation.navigate("EditStatusMessagePage")
                        }}/>
                    <Cell
                        cellStyle="Basic"
                        title="My ID"
                        titleTextStyle={fontSize= 16}
                        hideSeparator={true}/>
                    <Cell
                        accessory="DisclosureIndicator"
                        hideSeparator={true}
                        cellContentView={
                            <TextInput
                                style={{ fontSize: 22, flex: 1, color : "gray"}}
                                placeholder="Not set"
                                value={my_id}
                                editable={false} 
                                pointerEvents="none"
                            />
                        }
                        onPress={()=>{
                            this.props.navigation.navigate("EditMyIDPage")
                        }}/>

                    {cellGender}
                    {cellBirthday}
                    {cellInteresteIn}
                </Section>
                <Section
                    sectionPaddingTop={5}
                    sectionPaddingBottom={0}
                    separatorInsetLeft={0}>
                    <Cell
                        cellStyle="Basic"
                        title="Contact Info"
                        titleTextStyle={{ fontSize: 18}} 
                        hideSeparator={false}
                    />
                    <Cell
                        cellStyle="Basic"
                        title="Mobile phones"
                        titleTextStyle={{ fontSize: 16}} 
                        hideSeparator={true} 
                    />
                    {this.phonesList(phones)}
                    <Cell
                        cellStyle="Basic"
                        title="Add another phone"
                        titleTextStyle={{ fontSize: 16}} 
                        hideSeparator={true} 
                        accessory="DisclosureIndicator"
                        onPress={()=>{
                            this.props.navigation.navigate("AddAnotherPhone", {'title':"Add phone", 'mode': 'add', onAddAnotherPhone: this.onAddAnotherPhone})
                        }}
                    />
                    <Cell
                        cellStyle="Basic"
                        title="Address"
                        titleTextStyle={{ fontSize: 16}} 
                        hideSeparator={true}/>
                    {cellAddress}
                    <Cell
                        cellStyle="Basic"
                        title="Website"
                        titleTextStyle={fontSize= 16}
                        hideSeparator={true}
                    />
                    {this.websitesList(websites)}
                    <Cell
                        cellStyle="Basic"
                        title="Add another website"
                        titleTextStyle={fontSize= 16}
                        hideSeparator={true} 
                        accessory="DisclosureIndicator"
                        onPress={()=>{
                            this.props.navigation.navigate("AddAnotherWebsite", {'title':"Add website", 'mode': 'add', onAddAnotherWebsite: this.onAddAnotherWebsite})
                        }}/>

                    <Cell
                        cellStyle="Basic"
                        title="Email"
                        titleTextStyle={fontSize= 16}
                        hideSeparator={true} />
                    {this.emailsList(emails)}
                    <Cell
                        cellStyle="Basic"
                        title="Add another email"
                        hideSeparator={true} 
                        titleTextStyle={fontSize= 16}
                        accessory="DisclosureIndicator"
                        onPress={()=>{  
                            this.props.navigation.navigate("AddAnotherEmail", {'title':"Add email", 'mode': 'add', onAddAnotherEmail: this.onAddAnotherEmail}) 
                        }}
                    />
                </Section>
            </TableView>
          </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
        </MenuContext>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    // console.log(state)
    if(!state._persist.rehydrated){
      return {}
    }

    if(!state.auth.isLogin){
        return;
    }
  
    return{
        uid: makeUidState(state, ownProps),
        profile: makeProfileState(state, ownProps),
        myIds: makeMyIdsState(state, ownProps),

        // myIds: makeMyIdsState(state, ownProps),
        phones: makePhonesState(state, ownProps),
        websites: makeWebsitesState(state, ownProps),
        emails: makeEmailsState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(EditMyProfilePage);