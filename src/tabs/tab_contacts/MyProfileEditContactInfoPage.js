import React from 'react'
import {View, 
        Alert, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity, 
        TextInput,
        ScrollView,
        SafeAreaView,
        Dimensions,
        } from 'react-native'
import { connect } from 'react-redux';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome5';

import * as actions from '../../actions'
import ImageWithDefault from '../../utils/ImageWithDefault'

class MyProfileEditContactInfoPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "Edit Contact Info",
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

    constructor(props) {
        super(props)
    }

    handleClose = () => {
        this.props.navigation.goBack(null)
    }

    componentDidMount() {
        this.props.navigation.setParams({handleClose: this.handleClose })
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

        console.log(height)
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
            <TouchableOpacity 
                style={{height:60,
                        width: 60,
                        borderRadius: 10}}>
              <ImageWithDefault 
                source={{uri: ''}}
                style={{width: 60, height: 60, borderRadius: 10}}
              />
            </TouchableOpacity>
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
                    <TouchableOpacity 
                        style={{height:60,
                                width: 60,
                                borderRadius: 10}}>
                      <ImageWithDefault 
                        source={{uri: ''}}
                        style={{width: 60, height: 60, borderRadius: 10}}
                      />
                    </TouchableOpacity>
                    <View style={{paddingLeft: 10}}>
                        <Text style={{fontSize: 18, 
                                        fontWeight: '600', 
                                        paddingBottom:5
                                    }}>
                            Men
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

    render(){
        return(
        <SafeAreaView style={{flex:1}}>
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

export default connect(mapStateToProps, actions)(MyProfileEditContactInfoPage);