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
var _ = require('lodash');
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';

import * as actions from '../../actions'
import MyIcon from '../../config/icon-font.js';

import {checkInternetDialog} from '../../utils/Helpers'

import {makeUidState, 
        makeClasssState,
        makeIsConnectedState} from '../../reselect'

class ClasssSettingsPage extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: "Classs setting",
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
                    style={{paddingLeft:10}}
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
            renderContent: false,
            loading: false,
            class_id: 0,
            _class:{}
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({handleCancel: this.handleCancel })
    
        const { navigation } = this.props;
        const class_id = navigation.getParam('class_id', null);

        // console.log(class_id)
        this.setState({class_id},()=>{
            this.loadData(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    loadData = (props) =>{
        // console.log(props)
        let {class_id} = this.state
        let {classs} = props

        let _class = _.find(classs,  function(v, k) { 
            return k == class_id; 
        })

        // console.log(_class)
        this.setState({_class, renderContent:true})
    }

    classProfilePicture = () => {
        let options =  {
            title: 'Select class profile picture',
            noData: true,
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
            quality: 0.7,
            maxWidth: 500,
            maxHeight: 500,
        }

        let {is_connected} = this.props

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {

                if(!is_connected){
                    checkInternetDialog()
                    return 
                }

                this.setState({loading:true})
                this.props.actionUpdateClassPictureProfile(this.props.uid, this.state.class_id, response.uri).then((result) => {
                    console.log(result)
                    setTimeout(() => {
                        this.setState({loading:false})
                    }, 200);
                })
            }
        });
    }

    render(){
        let {renderContent, _class, class_id} = this.state

        if(!renderContent){
            return(<View style={{flex:1}}></View>)
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
                                Classs Profile Picture
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
                                    this.classProfilePicture()
                                }}>
                                
                                <FastImage
                                    style={{width: 150, height: 150}}
                                    source={{
                                        uri: _class.image_url,
                                        headers:{ Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{position:'absolute', right:0, bottom:0, padding:5, margin:5}}
                                            onPress={()=>{
                                                this.classProfilePicture()
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
                                Class name
                                </Text>
                            </View>
                        }
                    />
                    <Cell
                        accessory="DisclosureIndicator"
                        cellContentView={
                            <TextInput
                                style={{ fontSize: 22, flex: 1 }}
                                placeholder="input class name"
                                value={_class.name}
                                editable={false}
                                pointerEvents="none"
                            />
                        }
                        onPress={()=>{
                            this.props.navigation.navigate("EditClassNamePage", {'class_id': class_id})
                        }}
                        />
                </Section>
            </TableView>
          </View>
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
        uid:makeUidState(state, ownProps),
        classs:makeClasssState(state, ownProps),

        is_connected: makeIsConnectedState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(ClasssSettingsPage);