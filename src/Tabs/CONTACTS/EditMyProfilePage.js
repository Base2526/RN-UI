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

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'
import MyModal from '../../Utils/MyModal'
import MyIcon from '../../config/icon-font.js';
import {getUid, randomKey} from '../../Utils/Helpers'

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
        
        let {profiles} = this.props
        this.setState({profiles})
    }

    componentWillReceiveProps(nextProps) {
        let {profiles} = nextProps 
        this.setState({profiles})
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    openModalGender(){
        this.refs.modalGender.open()
        // this.setState({is_open_modal_gender: true})
    }

    openModalInteresteIn(){
        this.refs.modalInteresteIn.open()
        // this.setState({is_open_modal_InteresteIn: true})
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

    renderInteresteIn(){
        
        return this.state.intereste_in.map((data) => {
            let __check = null
            if(this.state.profiles.intereste_in !== undefined){
                let intereste_in = this.state.profiles.intereste_in
                let f = intereste_in.find(v=>{ 
                    return v == data.id
                })

                if(f !== undefined){
                    __check = <Icon name="check" size={25} color="#900" />
                }
            }
            
            return(<TouchableOpacity key={data.id} 
                        onPress={() => {
                           let intereste_in = this.state.profiles.intereste_in;
                           if(intereste_in !== undefined){
                                
                                let _find = intereste_in.find(v=>{
                                    return v == data.id;
                                })

                                let newValue = null
                                if(_find === undefined){
                                    newValue = [...intereste_in, data.id]
                                }else{
                                    newValue = intereste_in.filter(function(v) { 
                                        return v != data.id 
                                    })
                                }

                                this.props.actionInteresteInProfile(this.props.uid, newValue, (result) => {
                                    console.log(result)
                                })
                            }else{
                                let intereste_in = [data.id]
                                this.props.actionInteresteInProfile(this.props.uid, intereste_in, (result) => {
                                    console.log(result)
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

    renderGender() {
        return this.state.gender.map((data) => {
            let __check = null
            if(this.state.profiles.gender !== undefined){
                if(this.state.profiles.gender == data.id){
                    __check = <Icon name="check" size={25} color="#900" />
                }
            }

            return (
                <TouchableOpacity key={data.id} 
                    onPress={() => {
                        if(this.state.profiles.gender !== undefined){
                            if(this.state.profiles.gender != data.id){
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

    phonesList(){
        if(this.state.profiles.phones === undefined){
            return;
        }

        return Object.entries(this.state.profiles.phones).map(([key, value]) => {
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
                    <View style={{flex:1, 
                                flexDirection:'row', 
                                position:'absolute', 
                                right:0,
                                bottom:0,
                                padding:5}}>
                        <TouchableOpacity 
                            style={{justifyContent: 'center', 
                                    alignItems: 'center',
                                    zIndex: 10,
                                    marginRight:10}}
                            onPress={()=>{
                                this.props.navigation.navigate("AddAnotherPhone", {title:'Edit phone', mode: 'edit', key, value, onAddAnotherPhone: this.onAddAnotherPhone})
                            }}>
                            <Text style={{color:'gray', fontSize:16}}>Edit</Text>
                        </TouchableOpacity> 
                        <TouchableOpacity 
                            style={{justifyContent: 'center', 
                                    alignItems: 'center',
                                    zIndex: 10,}}
                            onPress={()=>{
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
                            <Text style={{color:'red', fontSize:16}}>Delete</Text>
                        </TouchableOpacity> 
                    </View>
                </View>
            }
        />)
        })
    }

    emailsList(){
        if(this.state.profiles.emails === undefined){
            return;
        }

        return Object.entries(this.state.profiles.emails).map(([key, value]) => {
            return(<Cell
                    key={key}
                    cellStyle="Subtitle"
                    titleTextColor="#007AFF"
                    hideSeparator={false} 
                    cellContentView={
                    <View style={{flex:1,}}>
                        <View style={{flex:1, padding:5}}>
                            <Text style={{flex:1, fontSize: 22, color:'gray',  }}>
                                {value.email}
                            </Text>
                        </View>
                        <View style={{flex:1, 
                                    flexDirection:'row',
                                    justifyContent:'flex-end',
                                    padding:5}}>
                            <TouchableOpacity 
                                style={{justifyContent: 'center', 
                                        alignItems: 'center',
                                        zIndex: 10,
                                        marginRight:10}}
                                onPress={()=>{
                                    // this.props.navigation.navigate("AddAnotherPhone", {title:'Edit phone', mode: 'edit', key, value, onAddAnotherPhone: this.onAddAnotherPhone})
                                   
                                    this.props.navigation.navigate("AddAnotherEmail", {'title':"Edit email", 'mode': 'edit', key, value, onAddAnotherEmail: this.onAddAnotherEmail}) 
                                }}>
                                <Text style={{color:'gray', fontSize:16}}>Edit</Text>
                            </TouchableOpacity> 
                            <TouchableOpacity 
                                style={{justifyContent: 'center', 
                                        alignItems: 'center',
                                        zIndex: 10,}}
                                onPress={()=>{
                                    Alert.alert(
                                        'Delete',
                                        'Are sure delete phone ?',
                                        [
                                        //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                          {text: 'Delete', onPress: () => {
                                            // let mails = this.state.profiles.mails

                                            // var newMails = _.filter(mails, function(v, k) {
                                            //     return k != key;
                                            // });
    
                                            // let p = {...this.state.profiles, mails:newMails }
                                            // // console.log(p)
                                            // this.setState({profiles:p})

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
                                <Text style={{color:'red', fontSize:16}}>Delete</Text>
                            </TouchableOpacity> 
                        </View>
                    </View>
                }
            />)
        })
    }

    websitesList(){
        // return(<View><Text>test</Text></View>)
        if(this.state.profiles.websites === undefined){
            return;
        }

        return Object.entries(this.state.profiles.websites).map(([key, value]) => {
            return(<Cell
                key={key}
                cellStyle="Subtitle"
                titleTextColor="#007AFF"
                hideSeparator={false} 
                // accessory="DisclosureIndicator"
                cellContentView={
                <View style={{flex:1}}>
                    <View style={{flex:1, padding:5}}>
                        <Text style={{fontSize: 22, color:'gray' }}>
                            {value.url}
                        </Text>
                    </View>
                    <View style={{flex:1, 
                                flexDirection:'row',
                                justifyContent:'flex-end',
                                padding:5}}>
                        <TouchableOpacity 
                            style={{justifyContent: 'center', 
                                    alignItems: 'center',
                                    zIndex: 10,
                                    marginRight:10}}
                            onPress={()=>{
                                this.props.navigation.navigate("AddAnotherWebsite", {'title':"Edit website", 'mode': 'edit', key, value, onAddAnotherWebsite: this.onAddAnotherWebsite}) 
                            }}>
                            <Text style={{color:'gray', fontSize:16}}>Edit</Text>
                        </TouchableOpacity> 
                        <TouchableOpacity 
                            style={{justifyContent: 'center', 
                                    alignItems: 'center',
                                    zIndex: 10,}}
                            onPress={()=>{
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
                            <Text style={{color:'red', fontSize:16}}>Delete</Text>
                        </TouchableOpacity> 
                    </View>
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
        console.log(result)

        if(Object.keys(this.state.profiles.mails).length == 0){
            // กรณียังไม่เคยมี
            let p = {...this.state.profiles, mails:{[randomKey()]:result.value} }

            this.setState({profiles:p})
        }else{
            if(result.mode == 'add'){  
                let p = {...this.state.profiles, mails:{...this.state.profiles.mails, [randomKey()]:result.value} }
                
                // console.log(p)
                this.setState({profiles:p})
            }else if(result.mode == 'edit'){

                // console.log('edit')
                // console.log(this.state.profiles.mails)

                let mails = this.state.profiles.mails

                let value = null
                _.each(mails, function(_v, _k) { 
                    if(_k === result.key){
                        value = _v
                    }
                });

                if(value !== null){
                    let p = {...this.state.profiles, mails:{...mails, [result.key]:result.value} }
                    this.setState({profiles:p})

                    console.log(p)
                }
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
        let p = {...this.state.profiles, name }
        this.setState({profiles:p})
    }

    handleStatusMessage = (message) => {
        let p = {...this.state.profiles, status_message:message }
        this.setState({profiles:p})
    }

    handleAddress = (address) => {
        let p = {...this.state.profiles, address }
        this.setState({profiles:p})
    }

    // onRequestClose = () =>{
    //     console.log('onRequestClose')
    // }
    
    render(){
        if (Object.keys(this.state.profiles).length == 0) {
            return(<View style={{flex:1, backgroundColor:'white'}}></View>)
        }

        // ส่วนของ my id
        // let my_id = ''
        // if(this.state.profiles.my_id !== undefined){
        //     my_id = this.state.profiles.my_id
        // }
        let {my_ids} = this.state.profiles
        let find_my_id = _.find(my_ids,  function(v, k) { 
            return v.enable
        })
        let my_id = ''
        if(find_my_id === undefined){
            my_id = "Not set"
        }else{
            my_id = find_my_id.id
        }

        // gender
        let gender = 'None'
        if(this.state.profiles.gender !== undefined){
            let value = this.state.gender.filter(item => item.id === this.state.profiles.gender)
            if(value.length > 0){
                gender = value[0].name
            }
        }

        // intereste_in
        let intereste_in = []
        if(this.state.profiles.intereste_in !== undefined){
            this.state.profiles.intereste_in.forEach(function(key, v, arr){
                let f = Constant.intereste_in.find(k => k.id==key)
                intereste_in.push(f.name)
            });
        }

        let birthday = 'Not set'
        if(this.state.profiles.birthday !== undefined){
            birthday = this.state.profiles.birthday
        }

        return(
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
                        {this.renderGender()}
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
                        {this.renderInteresteIn()}
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
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                    Profile Picture
                                </Text>
                            </View>
                        }
                    />
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
                                marginBottom:10}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.profilePicture()
                                }}>
                                <FastImage
                                    style={{width: 150, height: 150}}
                                    source={{
                                        uri: this.state.profiles.image_url == "" ? Constant.DEFAULT_AVATARSOURCE_URI : this.state.profiles.image_url,
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
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                Background Picture
                                </Text>
                            </View>
                        }
                    />
                    <Cell
                        cellStyle="Basic"
                        titleTextColor="#007AFF"
                        hideSeparator={true}
                        cellContentView={
                        <View style={{
                                    flexDirection:'row', 
                                    height: 150,
                                    width: 150,
                                    marginBottom:10}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.backgroundPicture()
                                }}>
                                
                                <FastImage
                                    style={{width: 150, height: 150}}
                                    source={{
                                        uri: this.state.profiles.bg_url == "" ? Constant.DEFAULT_AVATARSOURCE_URI : this.state.profiles.bg_url,
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
                    <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                Display name
                                </Text>
                            </View>
                        }
                    />
                    <Cell
                        accessory="DisclosureIndicator"
                        cellContentView={
                            <TextInput
                                style={{ fontSize: 22, flex: 1 }}
                                placeholder="None"
                                // value={this.state.profiles.name}
                                ref= {(el) => { this.name = el; }}
                                onChangeText = {this.handleName}
                                value={this.state.profiles.name}
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
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                Status messsage
                                </Text>
                            </View>
                        }
                    />
                    <Cell
                        accessory="DisclosureIndicator"
                        cellContentView={
                            <TextInput
                                style={{ fontSize: 22, flex: 1, marginBottom:10}}
                                placeholder="Not set"
                                // value={this.state.profiles.status_message}
                                multiline={true}
                                ref= {(el) => { this.message = el; }}
                                onChangeText = {this.handleStatusMessage}
                                value={this.state.profiles.status_message}

                                editable={false}
                                pointerEvents="none"
                            />
                        }
                        onPress={()=>{
                            this.props.navigation.navigate("EditStatusMessagePage")
                        }}/>
                    <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        
                        hideSeparator={true} 
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                My ID
                                </Text>
                            </View>
                        }/>
                    <Cell
                        accessory="DisclosureIndicator"
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
                        }}
                        />
                    <Cell
                        cellStyle="RightDetail"
                        // titleTextColor="#007AFF"
                        hideSeparator={true} 
                        accessory="DisclosureIndicator"
                        title="Gender"
                        detail={gender}
                        onPress={()=>{
                            this.openModalGender()
                        }}
                    />
                    <Cell
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

                                {/* Moment(new Date(birthday)).format('MMMM DD, YYYY') */}
                                <View style={{flex: 1, }}>
                                    {/* <DatePicker
                                        ref={(ref)=>this.datePickerRef=ref}
                                        style={{width: 200, color:'gray' }}
                                        date={birthday}
                                        mode="date"
                                        // placeholder="placeholder"
                                        format="MMMM DD, YYYY"
                                        minDate="1920-01-01"
                                        maxDate={this.state.date}
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        // customArrowIcon={null} 

                                        hideText={true}
                                        // iconSource={require('../../Images/google_calendar.png')}
                                        customStyles={{
                                            dateIcon: {
                                                width:0,
                                                height:0,
                                                position:'absolute'
                                            },
                                            dateText: {
                                                fontSize:16
                                            }
                                            // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(date) => {
                                            // this.setState({date: date})
                                            this.props.actionBirthdayProfile(this.props.uid, date, (result) => {
                                                console.log(result)
                    
                                                // this.setState({loading:false})
                                            })
                                        }}
                                        />  */}


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
                                                // this.setState({date: date})

                                                // console.log(Moment(date).format('MMMM DD, YYYY'))
                                                // format="MMMM DD, YYYY"
                                                this.props.actionBirthdayProfile(this.props.uid, Moment(date).format('MMMM DD, YYYY'), (result) => {
                                                    console.log(result)
                                                    // this.setState({loading:false})
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

                    <Cell
                        cellStyle="RightDetail"
                        // titleTextColor="#007AFF"
                        hideSeparator={true} 
                        accessory="DisclosureIndicator"
                        title="Intereste In"
                        detail={intereste_in.length == 0 ? "None": intereste_in.join(", ")}
                        onPress={()=>{
                            this.openModalInteresteIn()
                        }}
                    />
                </Section>
            
            
                <Section
                    sectionPaddingTop={5}
                    sectionPaddingBottom={0}
                    separatorInsetLeft={0}>
                    <Cell
                        cellStyle="Basic"
                        // title="MY INFO"
                        contentContainerStyle={{ }} 
                        hideSeparator={false}
                        cellContentView={
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
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                Mobile phones
                                </Text>
                            </View>
                        }
                    />
                    {this.phonesList()}
                    <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        accessory="DisclosureIndicator"
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                Add another phone
                                </Text>
                            </View>
                        }
                        onPress={()=>{
                            this.props.navigation.navigate("AddAnotherPhone", {'title':"Add phone", 'mode': 'add', onAddAnotherPhone: this.onAddAnotherPhone})
                        }}
                    />
                </Section>

                <Section
                    sectionPaddingTop={5}
                    sectionPaddingBottom={0}
                    separatorInsetLeft={0}>
                    <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                Address
                                </Text>
                            </View>
                        }
                    />
                    <Cell
                        accessory="DisclosureIndicator"
                        cellContentView={
                            <TextInput
                                style={{ fontSize: 22, flex: 1, color :"gray", marginBottom:10}}
                                placeholder="None"
                                value={this.state.profiles.address}
                                editable={false} 
                                multiline = {true}
                                pointerEvents="none"
                            />
                        }
                        onPress={()=>{
                            // EditAddressPage
                            this.props.navigation.navigate("EditAddressPage", {'title':"Add Address", 'mode': 'add'})
                        }}
                    />
                </Section>

                <Section
                    sectionPaddingTop={5}
                    sectionPaddingBottom={0}
                    separatorInsetLeft={0}>
                    <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                Website
                                </Text>
                            </View>
                        }
                    />
                    {this.websitesList()}
                    <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        accessory="DisclosureIndicator"
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                Add another website
                                </Text>
                            </View>
                        }
                        onPress={()=>{
                            this.props.navigation.navigate("AddAnotherWebsite", {'title':"Add website", 'mode': 'add', onAddAnotherWebsite: this.onAddAnotherWebsite})
                        }}
                    />
                </Section>

                <Section
                    sectionPaddingTop={5}
                    sectionPaddingBottom={0}
                    separatorInsetLeft={0}>
                    <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                Email
                                </Text>
                            </View>
                        }
                    />
                    {this.emailsList()}
                    <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        accessory="DisclosureIndicator"
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                Add another email
                                </Text>
                            </View>
                        }
                        onPress={()=>{
                            // this.props.navigation.navigate("AddAnotherEmail")   
                            this.props.navigation.navigate("AddAnotherEmail", {'title':"Add email", 'mode': 'add', onAddAnotherEmail: this.onAddAnotherEmail}) 
                        }}
                    />
                </Section>
           
            </TableView>
          </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => {
    // console.log(state)
    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
        uid:getUid(state),
        auth:state.auth,
        profiles:state.auth.users.profiles
    }
}

export default connect(mapStateToProps, actions)(EditMyProfilePage);