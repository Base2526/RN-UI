import React from 'react'
import {View, 
        Text, 
        TouchableOpacity, 
        TextInput,
        } from 'react-native'
import { connect } from 'react-redux';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
var _ = require('lodash');

import * as actions from '../../actions'
import MyIcon from '../../config/icon-font.js';
import Constant from '../../utils/Constant'
import {getUid} from '../../utils/Helpers'

import {makeUidState,
        makeGroupsState,
        makeGroupProfilesState,
        } from '../../reselect'

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
            loading:false,

            renderContent: false,
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({handleCancel: this.handleCancel })
        const { navigation } = this.props;
        const group_id = navigation.getParam('group_id', null);

        this.setState({group_id}, ()=>{
            this.loadData(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData = (props) =>{
        let {group_id} = this.state
        let {groups, group_profiles} = props

        let group =  _.find(groups, (v, k)=>{
            return k == group_id
        })

        if(!group){
            this.handleCancel()
        }

        let group_profile = _.find(group_profiles, (v, k)=>{
            return group_id == k
        })

        if(!group_profile){
            this.handleCancel()
        }


        group = {...group, profile:group_profile}
        console.log('GroupSettingsPage', group)

        this.setState({data: group, renderContent:true})
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    handleGroupName = (name) => {
        this.setState({name})
    }

    profilePicture = () => {
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
                })
            }
        });
    }

    render(){
        // let {group_profile} = this.state.data

        // renderContent
        let {data, renderContent, group_id} = this.state

        // group_profile
        // console.log(group_profile)
        if(!renderContent){
            return(<View style={{flex:1, backgroundColor:'white'}}></View>)
        }

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
                                    this.profilePicture()
                                }}>
                                
                                <FastImage
                                    style={{width: 150, height: 150}}
                                    source={{
                                        uri: data.profile.image_url,
                                        headers:{ Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{position:'absolute', right:0, bottom:0, padding:5, margin:5}}
                                            onPress={()=>{
                                                this.profilePicture()
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
                            value={data.profile.name}
                            ref= {(el) => { this.name = el; }}
                            onChangeText = {this.handleGroupName}
                            multiline={true}
                            editable={false}
                            pointerEvents="none"
                        />
                        }
                        onPress={()=>{
                            this.props.navigation.navigate("EditGroupNamePage", {group_id})
                        }}
                        />
                </Section>
            </TableView>
        </View>
        </KeyboardAwareScrollView>)
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(state)

    if(!state._persist.rehydrated){
        return {}
    }

    if(!state.auth.isLogin){
        return;
    }
  
    return{
        // uid:getUid(state),
        // auth:state.auth,
        // groups:state.auth.users.groups,

        uid: makeUidState(state, ownProps),
        groups: makeGroupsState(state, ownProps),
        group_profiles:makeGroupProfilesState(state, ownProps),
        // group_members:makeGroupMembersState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(GroupSettingsPage);