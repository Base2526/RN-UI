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
  

class MyProfileEditBasicInfoPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "Edit Basic Info",
        // headerLeft: (
        //     <TouchableOpacity
        //         style={Styles.headerButton}
        //         onPress={() => navigation.openDrawer()}>
        //         <Icon name="bars" size={20} />
        //     </TouchableOpacity>
        // ),
        headerRight: (
            // <View style={{flexDirection:'row', flex:1}}>
            //     <TouchableOpacity 
            //         style={{paddingRight:10}}
            //         onPress={()=>{
            //             // GroupMemberInvite
            //             const { params = {} } = navigation.state
            //             params.handleClose()

            //         }}>
            //         <Text style={{color:'red', fontSize:16}}>Close</Text>
            //     </TouchableOpacity> 
            // </View>

            <TouchableOpacity 
                    style={{paddingRight:10}}
                    onPress={()=>{
                        const { params = {} } = navigation.state
                        params.handleClose()
                    }}>
                    <Text style={{color:'red', fontSize:16}}>Close</Text>
                </TouchableOpacity> 
        ),
    })

    handleClose = () => {
        this.props.navigation.goBack(null)
    }

    componentDidMount() {
        this.props.navigation.setParams({handleClose: this.handleClose })
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
                
            {/* <View style={{ height:40, 
                        // marginTop:getStatusBarHeight(), 
                        justifyContent:'center', 
                        paddingLeft:10}}>
                <Text style={{fontSize:22}}>Edit Basic Info</Text>
                <TouchableOpacity 
                    style={{
                            borderWidth: 1, 
                            borderColor: 'red',
                            borderRadius: 5,
                            height:30, 
                            width:60,
                            justifyContent: 'center', 
                            alignItems: 'center',
                            position:'absolute',
                            right:0,
                            margin:10,
                            zIndex: 10,
                                }}
                    onPress={()=>{
                        this.props.navigation.goBack()
                    }}>
                    <Text style={{color:'red', fontSize:16}}>Close</Text>
                </TouchableOpacity> 
            </View> */}
              
            <View style={{flex: 1,}}>
          
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
                                    {/* <ImageWithDefault 
                                        source={{uri: this.state.profile_picture == "" ? Constant.DEFAULT_AVATARSOURCE_URI : this.state.profile_picture.uri,}}
                                        style={{width: 150, height: 150}}
                                    /> */}

                                    <PlaceHolderFastImage 
                                        style={{width: 150, height: 150}}
                                        source={{
                                            uri: this.state.profile_picture == "" ? Constant.DEFAULT_AVATARSOURCE_URI : this.state.profile_picture.uri,
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

export default connect(mapStateToProps, actions)(MyProfileEditBasicInfoPage);