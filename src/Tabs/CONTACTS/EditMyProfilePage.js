import React from 'react'
import {View, 
        Alert, 
        Text, 
        TouchableOpacity, 
        TextInput,
        ScrollView,
        SafeAreaView,
        Dimensions} from 'react-native'
import { connect } from 'react-redux';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DatePicker from 'react-native-datepicker'
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-picker';
import Moment from 'moment'
import { isIphoneX } from 'react-native-iphone-x-helper'
var _ = require('lodash');

import Image from 'react-native-remote-svg'

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'
import MyModal from '../../Utils/MyModal'

import {randomKey} from '../../Utils/Helpers'

// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
    title: 'Select Avatar',
    // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    noData: true,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    quality: 0.7,
    maxWidth: 500,
    maxHeight: 500,
};
  

class EditMyProfilePage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        // title: "Edit Profile",
        headerStyle: {
            backgroundColor: 'rgba(186, 53, 100, 1.0)',
  
            // ios navigationoptions underline hide
            borderBottomWidth: 0,
  
            // android navigationoptions underline hide
            elevation: 0,
            shadowOpacity: 0
          },
        headerLeft: (
            <View style={{marginLeft:10}}>
                <TouchableOpacity
                    style={{padding:5}}
                    onPress={() => {
                        const { params = {} } = navigation.state
                        params.handleCancel()
                    }}>
                    <Text style={{fontSize:18, color:'white'}}>CANCEL</Text>
                </TouchableOpacity>
            </View>
        ),
        headerRight: (
            <View style={{marginRight:10}}>
            <TouchableOpacity
                style={{padding:5}}
                disabled={true}
                onPress={() => {
                    const { params = {} } = navigation.state
                    params.handleSave()
                }}>
                <Text style={{fontSize:18, color:'white'}}>SAVE</Text>
            </TouchableOpacity>
            </View>
        ),
    })


    constructor(props) {
        super(props)

        Moment.locale('en');

        this.state ={
            profiles: {},
            profile_picture: '',
            background_picture: '',
            date: Moment(new Date()).format('YYYY-MM-DD'),
            gender: [{id:29, name:'Female'}, {id:28, name:'Male'}, {id:42, name:'Custom'}],
            intereste_in: [{id:43, name:'Women'}, {id:44, name:'Men'}],
            is_open_modal_gender: false,
            is_open_modal_InteresteIn: false,

            // phones:[],
            // emails:[]
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this.handleSave })
        this.props.navigation.setParams({handleCancel: this.handleCancel })
    
        let {profiles} = this.props.auth.users
        this.setState({profiles})

    }

    componentWillReceiveProps(nextProps) {
        let {profiles} = nextProps.auth.users   
        this.setState({profiles})
    }

    handleSave = () => {
        alert('save')
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    openModalGender(){
        // this.refs.modalGender.open()
        this.setState({is_open_modal_gender: true})
    }

    openModalInteresteIn(){
        // this.refs.modalInteresteIn.open()
        this.setState({is_open_modal_InteresteIn: true})
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
            if(this.state.profiles.interesteIn !== undefined){
                let interesteIn = this.state.profiles.interesteIn
                // console.log(interesteIn)
                if(interesteIn.find(item => (item == data.id)) !== undefined){
                    __check = <Icon name="check" size={25} color="#900" />
                }
            }
            
            return(<TouchableOpacity key={data.id} 
                        onPress={() => {
                            if(this.state.profiles.interesteIn === undefined){
                                /**
                                 * กรณียังไม่เคยมี
                                 **/
                                let p = {...this.state.profiles, interesteIn:[data.id] }
                                this.setState({profiles:p})
                            }else{
                                let interesteIn = this.state.profiles.interesteIn
                                if(interesteIn.find(item => (item == data.id)) === undefined){
                                    /**
                                     * กรณีตรวจสอบแล้วว่า ไม่มี เราจะทำการเพิ่มลงไป
                                     **/
                                    interesteIn.push(data.id)

                                    let p  ={...this.state.profiles, interesteIn}
                                    // console.log(p)
                                    this.setState({profiles:p})
                                }else{
                                    /**
                                     * กรณีตรวจสอบแล้วว่า มี เราจะทำการลบออก
                                     **/
                                    let p  ={...this.state.profiles, interesteIn:interesteIn.filter(item => item !== data.id)}
                                    // console.log(p)
                                    this.setState({profiles:p})
                                }
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
                        let p = {...this.state.profiles, gender:data.id }
                        this.setState({profiles:p})
                        console.log(p)
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
        // this.state.profiles.phones
        console.log(this.state.profiles)
        console.log(this.state.profiles.phones)

        // http://tobyho.com/2011/01/28/checking-types-in-javascript/
        // if(this.state.profiles.phones instanceof Array || this.state.profiles.phones instanceof Object){
        //     if(this.state.profiles.phones instanceof Array){
        //         if(this.state.profiles.phones.length == 0){
        //             return;
        //         }
        //     }

        //     if(this.state.profiles.phones instanceof Object){
        //         if (Object.keys(this.state.profiles.phones).length == 0) {
        //             return;
        //         }
        //     }
        // }

        return Object.entries(this.state.profiles.phones).map(([key, value]) => {
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
                                {value.isVerify ? '': 'Verify'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1, 
                                flexDirection:'row', 
                                position:'absolute', 
                                right:0,
                                bottom:0}}>
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
                                        let phones = this.state.profiles.phones

                                        var newPhones = _.filter(phones, function(v, k) {
                                            return k != key;
                                        });

                                        let p = {...this.state.profiles, phones:newPhones }
                                        this.setState({profiles:p})
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

        console.log(this.state.profiles)
        console.log(this.state.profiles.mails)
        // this.state.profiles.phones

        return Object.entries(this.state.profiles.mails).map(([key, value]) => {
            // console.log(data)
            // console.log(key)
            return(<Cell
                    key={key}
                    cellStyle="Subtitle"
                    titleTextColor="#007AFF"
                    hideSeparator={true} 
                    cellContentView={
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:1, flexDirection:'row'}}>
                            <Text style={{flex:1, fontSize: 16,  }}>
                                {value.name}
                            </Text>
                        </View>
                        <View style={{flex:1, 
                                    flexDirection:'row', 
                                    position:'absolute', 
                                    right:0,
                                    bottom:0}}>
                            <TouchableOpacity 
                                style={{justifyContent: 'center', 
                                        alignItems: 'center',
                                        zIndex: 10,
                                        marginRight:10}}
                                onPress={()=>{
                                    this.props.navigation.navigate("AddAnotherPhone", {'title':'Edit phone', 'mode': 'edit'})
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
                                          {text: 'Delete', onPress: () => console.log('Delete Pressed')},
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
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
            console.log('User cancelled image picker');
            } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    profile_picture: source,
                });

                // console.log(this.state.avatarSource.uri)
            }
        });
    }

    backgroundPicture = () =>{
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
            console.log('User cancelled image picker');
            } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    background_picture: source,
                });

                console.log(source.uri)
            }
        });
    }

    onAddAnotherPhone = (result) =>{
        console.log(result)
        // console.log(randomKey())

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
                    console.log(newPhones)

                    let p = {...this.state.profiles, phones:{...phones, [result.key]:result.value} }
                    this.setState({profiles:p})

                    console.log(p)
                }
            }
        }

    }

    onAddAnotherEmail = (values) =>{
        console.log(values)
    }

    onAddAnotherWebsite = (values) =>{
        console.log(values)
    }
    
    render(){

        if (Object.keys(this.state.profiles).length == 0) {
            return(<View style={{flex:1, backgroundColor:'white'}}></View>)
        }

        // ส่วนของ my id
        let my_id = ''
        let is_edit = false
        _.each(this.state.profiles.my_id, function(_v, _k) { 
            my_id = _v.value
            is_edit = _v.is_edit
        });

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
        if(this.state.profiles.interesteIn !== undefined){
            this.state.profiles.interesteIn.map((id) => {
                let value = this.state.intereste_in.filter(item => item.id === id)
                if(value.length > 0){
                    // console.log(value[0].name)
                    intereste_in.push(value[0].name)
                }
            });
        }

        return(
        <SafeAreaView style={{flex:1}}>
            {/* <Modal 
                style={{zIndex:10, 
                        height:this.getHeightGender(), 
                        borderTopLeftRadius:15, 
                        borderTopRightRadius:15}} 
                position={"bottom"} 
                ref={"modalGender"}
                // backdropPressToClose={false}
                swipeToClose={true}
                swipeArea={50}  
                > */}
                <MyModal style={{height: this.getHeightGender()}} 
                                isOpen={this.state.is_open_modal_gender} 
                                position={"bottom"}
                                onRequestClose={()=>{ this.setState({is_open_modal_gender:false}) }} >
                    <ScrollView>
                        <View
                            style={{marginLeft:10, marginRight:10, marginBottom:20, marginTop:5, flex:1}}>
                            {this.renderGender()}
                        </View>
                    </ScrollView>
                </MyModal>
            {/* </Modal> */}
            {/*  */}

            {/* <Modal 
                style={{zIndex:10, 
                        height:this.getHeightInteresteIn(), 
                        borderTopLeftRadius:15, 
                        borderTopRightRadius:15}} 
                position={"bottom"} 
                ref={"modalInteresteIn"}
                backdropPressToClose={true}
                swipeToClose={true}
                swipeArea={50}> */}
{/* 
                <View 
                    style={{height:35}}>
                    <TouchableOpacity 
                        style={{
                                borderWidth: 1, 
                                borderColor: 'red',
                                borderRadius: 15,
                                height:30, 
                                width:30,
                                justifyContent: 'center', 
                                alignItems: 'center',
                                position:'absolute',
                                right:0,
                                margin:5,
                                zIndex:10
                                    }}
                        onPress={()=>{
                            this.refs.modalInteresteIn.close()
                        }}>
                        <Text style={{color:'red', fontSize:16}}>X</Text>
                    </TouchableOpacity>
                    <View style={{flex:1, marginLeft:10, justifyContent:'center'}}>
                        <Text style={{fontSize:18}}>Select Intereste In</Text>
                    </View>
                </View>
                 */}
                 
                 <MyModal style={{height: this.getHeightInteresteIn()}} 
                                isOpen={this.state.is_open_modal_InteresteIn} 
                                position={"bottom"}
                                onRequestClose={()=>{ this.setState({is_open_modal_InteresteIn:false}) }} >
                    <ScrollView>
                        <View
                            style={{marginLeft:10, marginRight:10, marginBottom:20, marginTop:5, flex:1}}>
                            {this.renderInteresteIn()}
                        </View>
                    </ScrollView>
                </MyModal>
            {/* </Modal> */}

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
                                <Image style={{ width: 25, height: 25}}
                                    source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="21.05" height="21.05" viewBox="0 0 21.05 21.05">
                                    <g id="Group_477" data-name="Group 477" transform="translate(-91.95 -175.4)">
                                    <g id="Ellipse_43" data-name="Ellipse 43" transform="translate(91.95 175.4)" fill="#fff" stroke="#c6d7dd" stroke-width="1">
                                        <ellipse cx="10.525" cy="10.525" rx="10.525" ry="10.525" stroke="none"/>
                                        <ellipse cx="10.525" cy="10.525" rx="10.025" ry="10.025" fill="none"/>
                                    </g>
                                    <g id="Group_343" data-name="Group 343" transform="translate(95.206 180.136)">
                                        <g id="Path_1779" data-name="Path 1779" transform="translate(0 0)" fill="#fff">
                                        <path d="M 10.79541206359863 11.34874057769775 L 3.159631967544556 11.34874057769775 C 1.693111896514893 11.34874057769775 0.5000019073486328 10.15562057495117 0.5000019073486328 8.689081192016602 L 0.5000019073486328 3.159660816192627 C 0.5000019073486328 1.693120718002319 1.693111896514893 0.5000007748603821 3.159631967544556 0.5000007748603821 L 10.79541206359863 0.5000007748603821 C 12.26193237304688 0.5000007748603821 13.45504188537598 1.693120718002319 13.45504188537598 3.159660816192627 L 13.45504188537598 8.689081192016602 C 13.45504188537598 10.15562057495117 12.26193237304688 11.34874057769775 10.79541206359863 11.34874057769775 Z" stroke="none"/>
                                        <path d="M 3.159631729125977 1.000000953674316 C 1.968811988830566 1.000000953674316 1.000001907348633 1.968820571899414 1.000001907348633 3.159660339355469 L 1.000001907348633 8.689081192016602 C 1.000001907348633 9.879920959472656 1.968811988830566 10.84874057769775 3.159631729125977 10.84874057769775 L 10.79541206359863 10.84874057769775 C 11.98623180389404 10.84874057769775 12.95504188537598 9.879920959472656 12.95504188537598 8.689081192016602 L 12.95504188537598 3.159660339355469 C 12.95504188537598 1.968820571899414 11.98623180389404 1.000000953674316 10.79541206359863 1.000000953674316 L 3.159631729125977 1.000000953674316 M 3.159631729125977 9.5367431640625e-07 L 10.79541206359863 9.5367431640625e-07 C 12.54042148590088 9.5367431640625e-07 13.95504188537598 1.414630889892578 13.95504188537598 3.159660339355469 L 13.95504188537598 8.689081192016602 C 13.95504188537598 10.43411064147949 12.54042148590088 11.84874057769775 10.79541206359863 11.84874057769775 L 3.159631729125977 11.84874057769775 C 1.41461181640625 11.84874057769775 1.9073486328125e-06 10.43411064147949 1.9073486328125e-06 8.689081192016602 L 1.9073486328125e-06 3.159660339355469 C 1.9073486328125e-06 1.414630889892578 1.41461181640625 9.5367431640625e-07 3.159631729125977 9.5367431640625e-07 Z" stroke="none" fill="#8fb3c1"/>
                                        </g>
                                        <g id="Path_1778" data-name="Path 1778" transform="translate(4.476 3.423)" fill="#fff">
                                        <path d="M 2.501375675201416 4.502800941467285 C 1.397815704345703 4.502800941467285 0.4999956786632538 3.604980945587158 0.4999956786632538 2.501400947570801 C 0.4999956786632538 1.397820949554443 1.397815704345703 0.5000009536743164 2.501375675201416 0.5000009536743164 C 3.604935646057129 0.5000009536743164 4.502755641937256 1.397820949554443 4.502755641937256 2.501400947570801 C 4.502755641937256 3.604980945587158 3.604935646057129 4.502800941467285 2.501375675201416 4.502800941467285 Z" stroke="none"/>
                                        <path d="M 2.501375675201416 1.000000953674316 C 1.673515558242798 1.000000953674316 0.9999957084655762 1.673531055450439 0.9999957084655762 2.501400947570801 C 0.9999957084655762 3.329270839691162 1.673515558242798 4.002800941467285 2.501375675201416 4.002800941467285 C 3.329235553741455 4.002800941467285 4.002755641937256 3.329270839691162 4.002755641937256 2.501400947570801 C 4.002755641937256 1.673531055450439 3.329235553741455 1.000000953674316 2.501375675201416 1.000000953674316 M 2.501375675201416 9.5367431640625e-07 C 3.882845640182495 9.5367431640625e-07 5.002755641937256 1.119910955429077 5.002755641937256 2.501400947570801 C 5.002755641937256 3.882890939712524 3.882845640182495 5.002800941467285 2.501375675201416 5.002800941467285 C 1.119905710220337 5.002800941467285 -4.291534423828125e-06 3.882890939712524 -4.291534423828125e-06 2.501400947570801 C -4.291534423828125e-06 1.119910955429077 1.119905710220337 9.5367431640625e-07 2.501375675201416 9.5367431640625e-07 Z" stroke="none" fill="#8fb3c1"/>
                                        </g>
                                        <g id="Path_1777" data-name="Path 1777" transform="translate(2.106 1.58)" fill="#8fb3c1">
                                        <path d="M 1.316509366035461 0.5532206296920776 L 0.5266094207763672 0.5532206296920776 C 0.5119394063949585 0.5532206296920776 0.4999994039535522 0.5412806272506714 0.4999994039535522 0.5266106128692627 C 0.4999994039535522 0.511940598487854 0.5119394063949585 0.5000005960464478 0.5266094207763672 0.5000005960464478 L 1.316509366035461 0.5000005960464478 C 1.33117938041687 0.5000005960464478 1.343119382858276 0.511940598487854 1.343119382858276 0.5266106128692627 C 1.343119382858276 0.5412806272506714 1.33117938041687 0.5532206296920776 1.316509366035461 0.5532206296920776 Z" stroke="none"/>
                                        <path d="M 0.5266094207763672 5.960464477539062e-07 L 1.316509366035461 5.960464477539062e-07 C 1.607349395751953 5.960464477539062e-07 1.843119382858276 0.235770583152771 1.843119382858276 0.5266106128692627 C 1.843119382858276 0.8174506425857544 1.607349395751953 1.053220629692078 1.316509366035461 1.053220629692078 L 0.5266094207763672 1.053220629692078 C 0.2357693910598755 1.053220629692078 -5.960464477539062e-07 0.8174506425857544 -5.960464477539062e-07 0.5266106128692627 C -5.960464477539062e-07 0.235770583152771 0.2357693910598755 5.960464477539062e-07 0.5266094207763672 5.960464477539062e-07 Z" stroke="none" fill="#8fb3c1"/>
                                        </g>
                                    </g>
                                    </g>
                                </svg>                                                                    
                                    `}} />
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
                                 <Image style={{ width: 25, height: 25}}
                                    source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="21.05" height="21.05" viewBox="0 0 21.05 21.05">
                                    <g id="Group_477" data-name="Group 477" transform="translate(-91.95 -175.4)">
                                    <g id="Ellipse_43" data-name="Ellipse 43" transform="translate(91.95 175.4)" fill="#fff" stroke="#c6d7dd" stroke-width="1">
                                        <ellipse cx="10.525" cy="10.525" rx="10.525" ry="10.525" stroke="none"/>
                                        <ellipse cx="10.525" cy="10.525" rx="10.025" ry="10.025" fill="none"/>
                                    </g>
                                    <g id="Group_343" data-name="Group 343" transform="translate(95.206 180.136)">
                                        <g id="Path_1779" data-name="Path 1779" transform="translate(0 0)" fill="#fff">
                                        <path d="M 10.79541206359863 11.34874057769775 L 3.159631967544556 11.34874057769775 C 1.693111896514893 11.34874057769775 0.5000019073486328 10.15562057495117 0.5000019073486328 8.689081192016602 L 0.5000019073486328 3.159660816192627 C 0.5000019073486328 1.693120718002319 1.693111896514893 0.5000007748603821 3.159631967544556 0.5000007748603821 L 10.79541206359863 0.5000007748603821 C 12.26193237304688 0.5000007748603821 13.45504188537598 1.693120718002319 13.45504188537598 3.159660816192627 L 13.45504188537598 8.689081192016602 C 13.45504188537598 10.15562057495117 12.26193237304688 11.34874057769775 10.79541206359863 11.34874057769775 Z" stroke="none"/>
                                        <path d="M 3.159631729125977 1.000000953674316 C 1.968811988830566 1.000000953674316 1.000001907348633 1.968820571899414 1.000001907348633 3.159660339355469 L 1.000001907348633 8.689081192016602 C 1.000001907348633 9.879920959472656 1.968811988830566 10.84874057769775 3.159631729125977 10.84874057769775 L 10.79541206359863 10.84874057769775 C 11.98623180389404 10.84874057769775 12.95504188537598 9.879920959472656 12.95504188537598 8.689081192016602 L 12.95504188537598 3.159660339355469 C 12.95504188537598 1.968820571899414 11.98623180389404 1.000000953674316 10.79541206359863 1.000000953674316 L 3.159631729125977 1.000000953674316 M 3.159631729125977 9.5367431640625e-07 L 10.79541206359863 9.5367431640625e-07 C 12.54042148590088 9.5367431640625e-07 13.95504188537598 1.414630889892578 13.95504188537598 3.159660339355469 L 13.95504188537598 8.689081192016602 C 13.95504188537598 10.43411064147949 12.54042148590088 11.84874057769775 10.79541206359863 11.84874057769775 L 3.159631729125977 11.84874057769775 C 1.41461181640625 11.84874057769775 1.9073486328125e-06 10.43411064147949 1.9073486328125e-06 8.689081192016602 L 1.9073486328125e-06 3.159660339355469 C 1.9073486328125e-06 1.414630889892578 1.41461181640625 9.5367431640625e-07 3.159631729125977 9.5367431640625e-07 Z" stroke="none" fill="#8fb3c1"/>
                                        </g>
                                        <g id="Path_1778" data-name="Path 1778" transform="translate(4.476 3.423)" fill="#fff">
                                        <path d="M 2.501375675201416 4.502800941467285 C 1.397815704345703 4.502800941467285 0.4999956786632538 3.604980945587158 0.4999956786632538 2.501400947570801 C 0.4999956786632538 1.397820949554443 1.397815704345703 0.5000009536743164 2.501375675201416 0.5000009536743164 C 3.604935646057129 0.5000009536743164 4.502755641937256 1.397820949554443 4.502755641937256 2.501400947570801 C 4.502755641937256 3.604980945587158 3.604935646057129 4.502800941467285 2.501375675201416 4.502800941467285 Z" stroke="none"/>
                                        <path d="M 2.501375675201416 1.000000953674316 C 1.673515558242798 1.000000953674316 0.9999957084655762 1.673531055450439 0.9999957084655762 2.501400947570801 C 0.9999957084655762 3.329270839691162 1.673515558242798 4.002800941467285 2.501375675201416 4.002800941467285 C 3.329235553741455 4.002800941467285 4.002755641937256 3.329270839691162 4.002755641937256 2.501400947570801 C 4.002755641937256 1.673531055450439 3.329235553741455 1.000000953674316 2.501375675201416 1.000000953674316 M 2.501375675201416 9.5367431640625e-07 C 3.882845640182495 9.5367431640625e-07 5.002755641937256 1.119910955429077 5.002755641937256 2.501400947570801 C 5.002755641937256 3.882890939712524 3.882845640182495 5.002800941467285 2.501375675201416 5.002800941467285 C 1.119905710220337 5.002800941467285 -4.291534423828125e-06 3.882890939712524 -4.291534423828125e-06 2.501400947570801 C -4.291534423828125e-06 1.119910955429077 1.119905710220337 9.5367431640625e-07 2.501375675201416 9.5367431640625e-07 Z" stroke="none" fill="#8fb3c1"/>
                                        </g>
                                        <g id="Path_1777" data-name="Path 1777" transform="translate(2.106 1.58)" fill="#8fb3c1">
                                        <path d="M 1.316509366035461 0.5532206296920776 L 0.5266094207763672 0.5532206296920776 C 0.5119394063949585 0.5532206296920776 0.4999994039535522 0.5412806272506714 0.4999994039535522 0.5266106128692627 C 0.4999994039535522 0.511940598487854 0.5119394063949585 0.5000005960464478 0.5266094207763672 0.5000005960464478 L 1.316509366035461 0.5000005960464478 C 1.33117938041687 0.5000005960464478 1.343119382858276 0.511940598487854 1.343119382858276 0.5266106128692627 C 1.343119382858276 0.5412806272506714 1.33117938041687 0.5532206296920776 1.316509366035461 0.5532206296920776 Z" stroke="none"/>
                                        <path d="M 0.5266094207763672 5.960464477539062e-07 L 1.316509366035461 5.960464477539062e-07 C 1.607349395751953 5.960464477539062e-07 1.843119382858276 0.235770583152771 1.843119382858276 0.5266106128692627 C 1.843119382858276 0.8174506425857544 1.607349395751953 1.053220629692078 1.316509366035461 1.053220629692078 L 0.5266094207763672 1.053220629692078 C 0.2357693910598755 1.053220629692078 -5.960464477539062e-07 0.8174506425857544 -5.960464477539062e-07 0.5266106128692627 C -5.960464477539062e-07 0.235770583152771 0.2357693910598755 5.960464477539062e-07 0.5266094207763672 5.960464477539062e-07 Z" stroke="none" fill="#8fb3c1"/>
                                        </g>
                                    </g>
                                    </g>
                                </svg>                                                                    
                                    `}} />
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
                        // title="Help / FAQ"
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        // onPress={() => console.log("open Help/FAQ")}
                        cellContentView={
                        <View style={{flex:1, flexDirection:'row'}}>
                            <Text
                            // allowFontScaling
                            // numberOfLines={1}
                            style={{flex:1, fontSize: 18,  }}>
                            Basic Info
                            </Text>
                            {/* <View style={{flex:1, alignItems: 'flex-end', justifyContent:'center'}}>
                                <TouchableOpacity
                                style={{borderColor:'gray', borderRadius:5, borderWidth:.2}}
                                onPress={()=>{
                                    this.props.navigation.navigate("BasicInfoNavigator")
                                }}>
                                    <Text
                                        // allowFontScaling
                                        // numberOfLines={1}
                                        style={{ fontSize: 14, margin:5}}>
                                        EDIT
                                    </Text>
                                </TouchableOpacity>
                            </View> */}
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
                                Name Subname
                                </Text>
                            </View>
                        }
                    />
                    <Cell
                        cellContentView={
                            <TextInput
                            style={{ fontSize: 22, flex: 1 }}
                            placeholder="input name subname"
                            value={this.state.profiles.name}
                            />
                        }
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
                        cellContentView={
                            <TextInput
                            style={{ fontSize: 22, flex: 1 }}
                            placeholder="input status messsage"
                            value={this.state.profiles.status_message}
                            />
                        }
                        />
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
                        }
                    />
                    <Cell
                        cellContentView={
                            <TextInput
                                style={{ fontSize: 22, flex: 1, color : is_edit? "black" : "gray"}}
                                placeholder="input my id"
                                value={my_id}
                                editable={is_edit} 
                            />
                            // is_edit
                        }
                        />
                    <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        accessory="DisclosureIndicator"
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <View>
                                    <Text style={{flex:1, fontSize: 16,  }}>
                                    Gender
                                    </Text>
                                </View>
                                <View style={{position:'absolute', right:0}}>
                                    <Text style={{ fontSize: 22}} >
                                        {gender}
                                    </Text>
                                </View>
                            </View>
                        }
                        onPress={()=>{
                            this.openModalGender()
                        }}
                    />
                    <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        accessory="DisclosureIndicator"
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <View style={{flex: 1,
                                    justifyContent: 'center'}}>
                                    <Text style={{fontSize: 16 }}>
                                        Birthday
                                    </Text>
                                </View>
                                <View style={{flex: 1, }}>
                                    <DatePicker
                                        ref={(ref)=>this.datePickerRef=ref}
                                        style={{width: 200}}
                                        date={this.state.date}
                                        mode="date"
                                        // placeholder="placeholder"
                                        format="YYYY-MM-DD"
                                        minDate="1920-01-01"
                                        maxDate={this.state.date}
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        // customArrowIcon={null} 
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
                                        onDateChange={(date) => {this.setState({date: date});}}
                                        />
                                </View>
                            </View>
                        }
                        onPress={()=>{
                            this.datePickerRef.onPressDate()
                        }}
                    />

                    <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        accessory="DisclosureIndicator"
                        cellContentView={
                            // <View style={{flex:1, flexDirection:'row'}}>
                            //     <Text style={{flex:1, fontSize: 16,  }}>
                            //     Intereste In
                            //     </Text>
                            // </View>

                            <View style={{flex:1, flexDirection:'row'}}>
                            <View>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                Intereste In
                                </Text>
                            </View>
                            <View style={{position:'absolute', right:0}}>
                                <Text style={{ fontSize: 22}}>
                                    {intereste_in.length == 0 ? "None": intereste_in.join(", ")}
                                </Text>
                            </View>
                            </View>
                        }
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
                                        {/* <View style={{flex:1, alignItems: 'flex-end', justifyContent:'center'}}>
                                            <TouchableOpacity
                                            style={{borderColor:'gray', borderRadius:5, borderWidth:.2}}
                                            onPress={()=>{
                                                this.props.navigation.navigate("ContactInfoNavigator")
                                            }}>
                                                <Text
                                                    // allowFontScaling
                                                    // numberOfLines={1}
                                                    style={{ fontSize: 14, margin:5}}>
                                                    EDIT
                                                </Text>
                                            </TouchableOpacity>
                                        </View> */}
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
                    
                    {/* <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        // accessory="DisclosureIndicator"
                        // backgroundColor= "blue"
                        cellContentView={
                            <View style={{flexDirection:'row'}}>
                                <View style={{flex:1, flexDirection:'row'}}>
                                    <Text style={{flex:1, fontSize: 16,  }}>
                                    0988129483
                                    </Text>
                                </View>
                                <View style={{flex:1, 
                                            flexDirection:'row', 
                                            position:'absolute', 
                                            right:0,
                                            bottom:0}}>
                                    <TouchableOpacity 
                                        style={{justifyContent: 'center', 
                                                alignItems: 'center',
                                                zIndex: 10,
                                                marginRight:10}}
                                        onPress={()=>{
                                            this.props.navigation.navigate("AddAnotherPhone", {'title':'Edit phone', 'mode': 'edit'})
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
                                                  {text: 'Delete', onPress: () => console.log('Delete Pressed')},
                                                ],
                                                { cancelable: false }
                                              )
                                        }}>
                                        <Text style={{color:'red', fontSize:16}}>Delete</Text>
                                    </TouchableOpacity> 
                                </View>
                            </View>
                        }
                    />
                    <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        // accessory="DisclosureIndicator"
                        cellContentView={
                            <View style={{flexDirection:'row'}}>
                                <View style={{flex:1, flexDirection:'row'}}>
                                    <Text style={{flex:1, fontSize: 16,  }}>
                                    0988129999
                                    </Text>
                                </View>
                                <View style={{flex:1, 
                                            flexDirection:'row', 
                                            position:'absolute', 
                                            right:0,
                                            bottom:0}}>
                                    <TouchableOpacity 
                                        style={{justifyContent: 'center', 
                                                alignItems: 'center',
                                                zIndex: 10,
                                                marginRight:10}}
                                        onPress={()=>{
                                            this.props.navigation.navigate("AddAnotherPhone", {'title':'Edit phone','mode': 'edit'})
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
                                                  {text: 'Delete', onPress: () => console.log('Delete Pressed')},
                                                ],
                                                { cancelable: false }
                                              )
                                        }}>
                                        <Text style={{color:'red', fontSize:16}}>Delete</Text>
                                    </TouchableOpacity> 
                                </View>
                            </View>
                        }
                       
                    /> */}
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
                        cellContentView={
                            <TextInput
                                style={{fontSize:16, 
                                        flex:1, 
                                        borderColor:'gray', 
                                        borderRadius:5, 
                                        borderWidth:.5,
                                        padding:5,
                                        marginBottom:10,
                                        minHeight:150,
                                        textAlignVertical: "top"}}
                                placeholder="input address"
                                multiline={true}
                                underlineColorAndroid='transparent'
                            />
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
                                Website
                                </Text>
                            </View>
                        }
                    />
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
    console.log(state)

    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
      auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(EditMyProfilePage);