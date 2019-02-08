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
        KeyboardAvoidingView
        } from 'react-native'
import { connect } from 'react-redux';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
var _ = require('lodash');

import * as actions from '../../Actions'
import MyIcon from '../../config/icon-font.js';
import Constant from '../../Utils/Constant'
import {getUid} from '../../Utils/Helpers'

class GroupSettingsPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "Group setting",
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
    });

    constructor(props) {
        super(props)

        this.state ={
            data:{},
            group_id:0,
            name:'',
            image_url:'',
            loading:false,
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({handleCancel: this.handleCancel })
    
        const { navigation } = this.props;
        const group = navigation.getParam('group', null);
        console.log(group)

        this.setState({ data: group,
                        group_id: group.group_id,
                        name: group.group_profile.name,
                        image_url: group.group_profile.image_url})
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    handleGroupName = (name) => {
        this.setState({name})
    }

    groupProfilePicture = () => {
        let options =  {
            title: 'Select group profile picture',
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
                this.props.actionUpdateGroupPictureProfile(this.props.uid, this.state.group_id, response.uri).then((result) => {
                    console.log(result)

                    this.setState({loading:false})

                    // setTimeout(() => {
                    //     Alert.alert('Oops!');
                    //   }, 100);
                })
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        // console.log(state)

        let groups = nextProps.auth.users.groups
        let group_id = this.state.group_id
        console.log(groups)
        console.log(group_id)

        let key = 0
        let group = null
        _.each(groups, function(_v, _k) { 
            if(_k === group_id){
                key = _k
                group = {..._v, group_id:_k}
            }
        });
        
        console.log(group)
        if(group !== null){
            this.setState({ data: group,
                name: group.group_profile.name,
                image_url: group.group_profile.image_url})
        }
    }

    render(){
        let {data, name, image_url, group_id} = this.state

        if(Object.keys(data).length == 0){
            return(<View style={{flex:1, backgroundColor:'white'}}></View>)
        }

        console.log(group_id)
        return(
        <KeyboardAwareScrollView>
        <View style={{flex:1}}>
            <Spinner
                visible={this.state.loading}
                textContent={'Wait...'}
                textStyle={{color: '#FFF'}}
                overlayColor={'rgba(0,0,0,0.5)'}
            />
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
                                Group Profile Picture
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
                                    this.groupProfilePicture()
                                }}>
                                
                                <FastImage
                                    style={{width: 150, height: 150}}
                                    source={{
                                        uri: image_url == '' ? Constant.DEFAULT_AVATARSOURCE_URI : image_url,
                                        headers:{ Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{position:'absolute', right:0, bottom:0, padding:5, margin:5}}
                                            onPress={()=>{
                                                this.groupProfilePicture()
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
                        hideSeparator={true} 
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                Group name
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
                            value={name}
                            ref= {(el) => { this.name = el; }}
                            onChangeText = {this.handleGroupName}
                            // value={this.state.profiles.name}
                            multiline={true}

                            editable={false}
                            pointerEvents="none"
                        />
                        }
                        onPress={()=>{
                            this.props.navigation.navigate("EditGroupNamePage", {group:this.state.data})
                        }}
                        />
                </Section>
            </TableView>
        </View>
        </KeyboardAwareScrollView>)
    }
}

const mapStateToProps = (state) => {
    console.log(state)

    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
        uid:getUid(state),
        auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(GroupSettingsPage);