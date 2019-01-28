import React from 'react'
import {View, 
        Alert, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity, 
        Image,
        TextInput,
        ScrollView,
        SafeAreaView,
        Dimensions,
        Platform
        } from 'react-native'
import { connect } from 'react-redux';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DatePicker from 'react-native-datepicker'
import FastImage from 'react-native-fast-image'

import ImagePicker from 'react-native-image-picker';

import Moment from 'moment'

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'
import ImageWithDefault from '../../Utils/ImageWithDefault'

import PlaceHolderFastImage from '../../Utils/PlaceHolderFastImage'

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
        headerLeft: (
            <View style={{marginLeft:10}}>
                <TouchableOpacity
                    style={{padding:5}}
                    onPress={() => {
                        const { params = {} } = navigation.state
                        params.handleCancel()
                    }}>
                    <Text style={{fontSize:18, color:'black'}}>CANCEL</Text>
                </TouchableOpacity>
            </View>
        ),
        headerRight: (
            <View style={{marginRight:10}}>
            <TouchableOpacity
                style={{padding:5}}
                onPress={() => {
                    const { params = {} } = navigation.state
                    params.handleSave()
                }}>
                <Text style={{fontSize:18, color:'black'}}>SAVE</Text>
            </TouchableOpacity>
            </View>
        ),
    })

    handleSave = () => {
        alert('save')
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this.handleSave })
        this.props.navigation.setParams({handleCancel: this.handleCancel })
    }

    constructor(props) {
        super(props)

        Moment.locale('en');

        this.state ={
            profile_picture: '',
            background_picture: '',
            date: Moment(new Date()).format('YYYY-MM-DD'),
        }
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

        let height = 2 * 80 + 45

        if(height > Dimensions.get('window').height){
            return (Dimensions.get('window').height - 100);
        }

        // console.log(height)
        return height;
    }

    getHeightGender(){
        // let classs = this.props.auth.users.classs

        /*
        80 : ความสูงของ item
        45 : ความสูงของ header x
        */
        // let height = Object.keys(3).length * 80 + 45

        let height = 3 * 80 + 45

        if(height > Dimensions.get('window').height){
            return (Dimensions.get('window').height - 100);
        }

        // console.log(height)
        return height;
    }

    renderInteresteIn(){
        var list = [];
        
        list.push(
        <TouchableOpacity key={ 0 } onPress={() => {
            // this.props.params.navigation.navigate("ManageClasssPage")
            // alert(classs[key].name)

            // this.props.actionSelectClass(key, this.props.uid, friend.friend_id, (result)=>{

            //     console.log(result)
            // })
          }}>
        <View
          style={{
            alignItems: 'center', 
            padding: 10,
            flexDirection: 'row',
            height:80,
          }}>
            {/* <TouchableOpacity 
                style={{height:60,
                        width: 60,
                        borderRadius: 10}}>
              <ImageWithDefault 
                source={{uri: ''}}
                style={{width: 60, height: 60, borderRadius: 10}}
              />
            </TouchableOpacity> */}
            <View style={{paddingLeft: 10}}>
                <Text style={{fontSize: 18, 
                                fontWeight: '600', 
                                paddingBottom:5
                            }}>
                    Women
                </Text>
            </View>
            <View style={{paddingLeft: 10, position:'absolute', right:0, marginRight:10}}>
                <Icon name="check" size={25} color="#900" />
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

        list.push(
            <TouchableOpacity key={ 1 } onPress={() => {
                    // this.props.params.navigation.navigate("ManageClasssPage")
                    // alert(classs[key].name)
        
                    // this.props.actionSelectClass(key, this.props.uid, friend.friend_id, (result)=>{
        
                    //     console.log(result)
                    // })
                  }}>
                <View
                  style={{
                    alignItems: 'center', 
                    padding: 10,
                    flexDirection: 'row',
                    height:80,
                  }}>
                    
                    <View style={{paddingLeft: 10}}>
                        <Text style={{fontSize: 18, 
                                        fontWeight: '600', 
                                        paddingBottom:5
                                    }}>
                            Men
                        </Text>
                    </View>
                    <View style={{paddingLeft: 10, position:'absolute', right:0, marginRight:10}}>
                        
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

        return list;
    }

    renderGender() {
        var list = [];

        list.push(
        <TouchableOpacity key={ 0 } onPress={() => {
            // this.props.params.navigation.navigate("ManageClasssPage")
            // alert(classs[key].name)

            // this.props.actionSelectClass(key, this.props.uid, friend.friend_id, (result)=>{

            //     console.log(result)
            // })
          }}>
        <View
          style={{
            alignItems: 'center', 
            padding: 10,
            flexDirection: 'row',
            height:80,
          }}>
            {/* <TouchableOpacity 
                style={{height:60,
                        width: 60,
                        borderRadius: 10}}>
              <ImageWithDefault 
                source={{uri: ''}}
                style={{width: 60, height: 60, borderRadius: 10}}
              />
            </TouchableOpacity> */}
            <View style={{paddingLeft: 10}}>
                <Text style={{fontSize: 18, 
                                fontWeight: '600', 
                                paddingBottom:5
                            }}>
                    Female
                </Text>
            </View>
            <View style={{paddingLeft: 10, position:'absolute', right:0, marginRight:10}}>
                {/* {this.icon(classs, friend, key)} */}
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

        list.push(
            <TouchableOpacity key={ 2 } onPress={() => {
                // this.props.params.navigation.navigate("ManageClasssPage")
                // alert(classs[key].name)
    
                // this.props.actionSelectClass(key, this.props.uid, friend.friend_id, (result)=>{
    
                //     console.log(result)
                // })
              }}>
            <View
              style={{
                alignItems: 'center', 
                padding: 10,
                flexDirection: 'row',
                height:80,
              }}>
                {/* <TouchableOpacity 
                    style={{height:60,
                            width: 60,
                            borderRadius: 10}}>
                  <ImageWithDefault 
                    source={{uri: ''}}
                    style={{width: 60, height: 60, borderRadius: 10}}
                  />
                </TouchableOpacity> */}
                <View style={{paddingLeft: 10}}>
                    <Text style={{fontSize: 18, 
                                    fontWeight: '600', 
                                    paddingBottom:5
                                }}>
                        Male
                    </Text>
                </View>
                <View style={{paddingLeft: 10, position:'absolute', right:0, marginRight:10}}>
                    {/* {this.icon(classs, friend, key)} */}
                    <Icon name="check" size={25} color="#900" />
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

            list.push(
                <TouchableOpacity key={ 1 } onPress={() => {
                    // this.props.params.navigation.navigate("ManageClasssPage")
                    // alert(classs[key].name)
        
                    // this.props.actionSelectClass(key, this.props.uid, friend.friend_id, (result)=>{
        
                    //     console.log(result)
                    // })
                  }}>
                <View
                  style={{
                    alignItems: 'center', 
                    padding: 10,
                    flexDirection: 'row',
                    height:80,
                  }}>
                    {/* <TouchableOpacity 
                        style={{height:60,
                                width: 60,
                                borderRadius: 10}}>
                      <ImageWithDefault 
                        source={{uri: ''}}
                        style={{width: 60, height: 60, borderRadius: 10}}
                      />
                    </TouchableOpacity> */}
                    <View style={{paddingLeft: 10}}>
                        <Text style={{fontSize: 18, 
                                        fontWeight: '600', 
                                        paddingBottom:5
                                    }}>
                            Custom
                        </Text>
                    </View>
                    <View style={{paddingLeft: 10, position:'absolute', right:0, marginRight:10}}>
                        {/* {this.icon(classs, friend, key)} */}
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

        return list;
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
    
    render(){

        let {width, height} = Dimensions.get('window') 

        let w = 0
        if(width < height){
            w = width
        }else{
            w = height
        }

        return(
        <SafeAreaView style={{flex:1}}>
            <Modal 
                style={{zIndex:10, 
                        height:this.getHeightGender(), 
                        borderTopLeftRadius:15, 
                        borderTopRightRadius:15}} 
                position={"bottom"} 
                ref={"modalGender"}
                backdropPressToClose={false}
                // swipeToClose={false}
                swipeArea={50}
                >
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
                            this.refs.modalGender.close()
                        }}>
                        <Text style={{color:'red', fontSize:16}}>X</Text>
                    </TouchableOpacity>
                    <View style={{flex:1, marginLeft:10, justifyContent:'center'}}>
                        <Text style={{fontSize:18}}>Select Gender</Text>
                    </View>
                </View>
                <ScrollView>
                    <View
                        style={{marginLeft:10, marginRight:10, marginBottom:20, marginTop:5, flex:1}}>
                        {this.renderGender()}
                    </View>
                </ScrollView>
            </Modal>
            {/*  */}

            <Modal 
                style={{zIndex:10, 
                        height:this.getHeightInteresteIn(), 
                        borderTopLeftRadius:15, 
                        borderTopRightRadius:15}} 
                position={"bottom"} 
                ref={"modalInteresteIn"}
                backdropPressToClose={false}
                // swipeToClose={false}
                swipeArea={50}
                >
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
                        contentContainerStyle={{ paddingLeft:0, paddingRight:0 }}
                        cellContentView={
                            <View style={{
                                        flexDirection:'row', 
                                        height: 200,
                                        backgroundColor:'yellow',
                                        }}>
                                <TouchableOpacity
                                style={{backgroundColor:'green'}}
                                onPress={()=>{
                                    this.profilePicture()
                                }}>
                                
                                    <PlaceHolderFastImage 
                                        style={{height: 200,
                                            width: w }} 
                                        source={{
                                            uri: this.state.profile_picture == "" ? Constant.DEFAULT_AVATARSOURCE_URI : this.state.profile_picture.uri,
                                            headers:{ Authorization: 'someAuthToken' },
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}/>
                                </TouchableOpacity>
                                <TouchableOpacity style={{position:'absolute', 
                                                            right:0, 
                                                            bottom:0, 
                                                            borderRadius:10, 
                                                            borderColor:'gray', 
                                                            borderWidth:1,
                                                            padding:5,
                                                            margin:5
                                                        }}
                                                            onPress={()=>{
                                                                this.profilePicture()
                                                            }}>
                                    <Text style={{color:'gray'}}>EDIT</Text>
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
                                {/* <ImageWithDefault 
                                    // source={{uri: 'https://images.pexels.com/photos/1054289/pexels-photo-1054289.jpeg?auto=compress&cs=tinysrgb&h=350'}}
                                    source={{
                                        uri: 'https://images.pexels.com/photos/1054289/pexels-photo-1054289.jpeg?auto=compress&cs=tinysrgb&h=350',
                                        headers:{ Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    style={{height: 150, width: 150}}
                                /> */}
                                <PlaceHolderFastImage 
                                    style={{width: 150, height: 150}}
                                    source={{
                                        uri: this.state.background_picture == "" ? Constant.DEFAULT_AVATARSOURCE_URI : this.state.background_picture.uri,
                                        headers:{ Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{position:'absolute', 
                                                        right:0, 
                                                        bottom:0, 
                                                        borderRadius:10, 
                                                        borderColor:'gray', 
                                                        borderWidth:1,
                                                        padding:5,
                                                        margin:5}}
                                onPress={()=>{
                                    this.backgroundPicture()
                                }}>
                                <Text style={{color:'gray'}}>EDIT</Text>
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
                            style={{ fontSize: 22, flex: 1 }}
                            placeholder="input my id"
                            />
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
                                    <Text>
                                        Male
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
                                <Text>
                                Women
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
                    
                    <Cell
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
                        // onPress={()=>{
                        //     // this.openModalInteresteIn()
                        // }}
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
                        // onPress={()=>{
                        //     // this.openModalInteresteIn()
                        // }}
                    />
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
                            this.props.navigation.navigate("AddAnotherPhone", {'title':"Add another phone", 'mode': 'add'})
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
                                        marginBottom:10}}
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
                            this.props.navigation.navigate("AddAnotherWebsite")
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
                            this.props.navigation.navigate("AddAnotherEmail")
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