import React from 'react'
import {View, 
        Text, 
        TouchableOpacity, 
        ActivityIndicator, 
        TextInput,
        ScrollView,
        Switch} from 'react-native';
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';

var _ = require('lodash');
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { connect } from 'react-redux';
import {
    MenuProvider,
    Menu,
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
  } from 'react-native-popup-menu';

import * as actions from '../../actions'
import {getHeaderInset, isEquivalent2Object, checkInternetDialog, isEmpty} from '../../utils/Helpers'
import MyIcon from '../../config/icon-font.js';

import {makeUidState, 
        makeMyAppicationsState, 
        makeApplicationCategoryState,} from '../../reselect'

// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
    title: 'Select Picture',
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

class SettingMyApplicationPage extends React.Component{
    static navigationOptions = ({ navigation }) => {
        return {
            headerTintColor: '#C7D8DD',
            headerStyle: {
                backgroundColor: 'rgba(186, 53, 100, 1.0)',
                // ios navigationoptions underline hide
                borderBottomWidth: 0,
    
                // android navigationoptions underline hide
                elevation: 0,
                shadowOpacity: 0
            },
        }
    }

    constructor(props) {
        super(props);
    
        this.state = {
            application_id :0,
            text:'',
            applicationName: '',
            renderContent: false,
            loading: false,
            showSpinner: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            // avatarSource: {"uri":"https://unsplash.it/400/400?image=1"},
            category_select:{},
            subcategory_select:{},
            applicationImage: {"uri":""},
            isPublished: false,
            item:{},


            my_application:{}
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const application_id = navigation.getParam('application_id', null);

        this.setState({application_id},()=>{
            this.loadData(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData = (props) =>{
        let {application_id} = this.state
        let {my_applications, application_category} = props

        let my_application =_.find(my_applications, (v, k)=>{
                                return application_id == k
                            })

        this.setState({my_application, renderContent: true})
    }

    handleCategoryBack = (data) => {
        let {my_application} = this.props
        my_application = {...my_application, category:data.item.tid, subcategory:0}
        
        this.setState({my_application})
    }

    handleSubcategoryBack = (data) => {
        // console.log(data.item)
        let {my_application} = this.props
        my_application = {...my_application, subcategory:data.item.tid}
        
        this.setState({my_application})
    };    
  
    handleApplicatonName = (text) => {
        this.setState({ applicatonName:text })
    }

    onSelectPicture = () => {
        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info in the API Reference)
         */
        ImagePicker.showImagePicker(options, (response) => {
        //   console.log('Response = ', response);
  
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            // const source = { uri: response.uri };

            let {application_id} = this.state
            let {uid} = this.props

            this.setState({loading: true})
            this.props.actionUpdatePictureMyApplication(uid, application_id, response.uri).then((result) => {
                // console.log(result)
                this.setState({loading: false})
            })
          }
        });
    }

    togglePublished = (status) => {
        let {application_id, my_application} = this.state

        my_application = {...my_application, status}
        this.setState({my_application})

        this.props.actionUpdateStatusMyApplication(this.props.uid, application_id, status, (result)=>{
            console.log(result)
        })
    }

    showMenuEmail= ()=>{
        // let {is_connected} = this.props
        return( <View style={{flex:1,
                              position:'absolute', 
                              top:0,
                              right:0}}>
                  <Menu>
                    <MenuTrigger>
                        <MyIcon 
                            style={{padding:3}}
                            name={'dot-horizontal'}
                            size={15}
                            color={'gray'} />  
                    </MenuTrigger>
                    <MenuOptions
                        optionsContainerStyle={{ marginTop: -(getHeaderInset())}}>
                        <MenuOption onSelect={() => {}}>
                          <Text style={{padding:10, fontSize:18}}>Delete</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
              </View>)
    }

    emailsList = () =>{
        return(<Cell
            // key={key}
            cellStyle="Subtitle"
            titleTextColor="#007AFF"
            hideSeparator={true} 
            // accessory="DisclosureIndicator"
            cellContentView={
            <View style={{flex:1, justifyContent:'center', padding:5}}>
                <Text style={{fontSize: 16, fontStyle:'italic'}}>
                    mr.simajarn@gmail.com
                </Text>
                {this.showMenuEmail()}
            </View>
            }
            onPress={()=>{
                // Linking.openURL('mailto:' + value.email)
            }}/>)
    }

    showMenuPhone = ()=>{
        // let {is_connected} = this.props
        return( <View style={{flex:1,
                              position:'absolute', 
                              top:0,
                              right:0, 
                              }}>
                  <Menu>
                    <MenuTrigger>
                        <MyIcon 
                            style={{padding:3}}
                            name={'dot-horizontal'}
                            size={15}
                            color={'gray'} />  
                    </MenuTrigger>
                    <MenuOptions
                        optionsContainerStyle={{ marginTop: -(getHeaderInset())}}>
                        <MenuOption onSelect={() => {}}>
                          <Text style={{padding:10, fontSize:18}}>Delete</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
              </View>)
    }

    phonesList = () =>{
        return(<Cell
            // key={key}
            cellStyle="Subtitle"
            titleTextColor="#007AFF"
            hideSeparator={true} 
            // accessory="DisclosureIndicator"
            cellContentView={
                <View style={{flex:1, justifyContent:'center', padding:5}}>
                    <Text style={{fontSize: 16, fontStyle:'italic'}}>
                        09831243124
                    </Text>
                    {this.showMenuPhone()}
                </View>
            }
            onPress={()=>{
                // Linking.openURL('mailto:' + value.email)
            }}
            />)
    }

    render() {
        let {renderContent, 
            my_application, 
            loading, 
            application_id} = this.state

        if(!renderContent){
            return (<View style={{flex:1, backgroundColor:'white'}}></View>)
        }

        console.log(my_application)

        let cell_published = <Cell
                                cellStyle="Basic" 
                                title="Published"
                                cellAccessoryView={
                                <Switch 
                                    onValueChange = {this.togglePublished}
                                    value = {my_application.status}/>
                                }
                                contentContainerStyle={{ paddingVertical: 4 }}/>

        let cell_category = <Cell 
                                cellStyle="RightDetail" 
                                title="Category" 
                                detail={"None"}
                                accessory="DisclosureIndicator"
                                contentContainerStyle={{ padding:10}} 
                                onPress={()=>{
                                    this.props.navigation.navigate("ListAllCategory", { handleCategoryBack: this.handleCategoryBack, mode:'edit', application_id, category:0 })
                                }}/>
        if( !isEmpty(my_application.category) ){
            let {application_category} = this.props
            let category= _.find(application_category, (v, k)=>{
                            return my_application.category == k
                        })
            cell_category = <Cell 
                                cellStyle="RightDetail" 
                                title="Category" 
                                detail={category.name}
                                accessory="DisclosureIndicator"
                                contentContainerStyle={{ padding:10}} 
                                onPress={()=>{
                                    this.props.navigation.navigate("ListAllCategory", { handleCategoryBack: this.handleCategoryBack, mode:'edit', application_id, category:my_application.category })
                                }}/>
        }

        let cell_subcategory = <Cell 
                                    cellStyle="RightDetail" 
                                    title="Subcategory" 
                                    detail={"None"}
                                    accessory="DisclosureIndicator"
                                    contentContainerStyle={{padding:10}} 
                                    onPress={()=>{
                                        this.props.navigation.navigate("ListAllSubcategory", { handleSubcategoryBack: this.handleSubcategoryBack, mode:'edit', application_id, category:my_application.category, subcategory:my_application.subcategory })
                                    }}/>

        if( !isEmpty(my_application.subcategory) ){
            let {application_category} = this.props
            let category    =   _.find(application_category, (v, k)=>{
                                    return my_application.category == k
                                })

            var subcategory =   _.find(category.children, function(v, k) {
                                    return my_application.subcategory == v.tid;
                                });

            if(!isEmpty(subcategory)){
                cell_subcategory = <Cell 
                                    cellStyle="RightDetail" 
                                    title="Subcategory" 
                                    detail={subcategory.name}
                                    accessory="DisclosureIndicator"
                                    contentContainerStyle={{padding:10}} 
                                    onPress={()=>{
                                        this.props.navigation.navigate("ListAllSubcategory", { handleSubcategoryBack: this.handleSubcategoryBack, mode:'edit', application_id, category:my_application.category, subcategory:my_application.subcategory })
                                    }}/>
            }
        }

        let cell_address =<Cell
                            cellStyle="Subtitle"
                            title="Address"
                            hideSeparator={true} 
                            accessory="DisclosureIndicator"
                            detail={'Not set'}
                            onPress={()=>{
                                // alert('EditMyApplicationAddressPage')
                                this.props.navigation.navigate("EditMyApplicationAddressPage", {application_id})
                            }}
                            />

        if( !isEmpty(my_application.address) ){
            cell_address =<Cell
                            cellStyle="Basic"
                            title="Address"
                            hideSeparator={true} 
                            accessory="DisclosureIndicator"
                            cellContentView={
                                <View style={{flex:1}}>
                                    <Text style={{fontSize:18}}>Address</Text>
                                <TextInput
                                    style={{fontSize: 16, 
                                            paddingBottom:10, 
                                            // borderColor:'gray', 
                                            // borderWidth:.5,
                                            // backgroundColor:'red',
                                            // minHeight:150,
                                            color:'black',
                                            textAlignVertical: 'top'}}
                                    // onChangeText={(text) => this.setState({text})}
                                    value={my_application.address}
                                    clearButtonMode='while-editing'
                                    maxLength={500}
                                    multiline = {true}
                                    editable={false} 
                                    // multiline = {true}
                                    pointerEvents="none"
                                    // placeholder= {this.state.text}
                                />
                                </View>
                              }
                              onPress={()=>{
                                this.props.navigation.navigate("EditMyApplicationAddressPage", {application_id})
                              }}
                            />
        }
      
        return (
            <MenuContext>
            <KeyboardAwareScrollView>
                <ScrollView style={{  flex:1, 
                                        backgroundColor: 'white',
                                        ...ifIphoneX({
                                            paddingBottom: 30
                                        }, {
                                            paddingBottom: 0
                                        })}}>
                    <Spinner
                        visible={loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}
                    />
                    <TableView >
                        <Section
                            sectionPaddingTop={0}
                            sectionPaddingBottom={0}
                            separatorInsetLeft={0}>
                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10,}} 
                                hideSeparator={true} 
                                title="Picture" 
                            />
                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true} 
                                cellContentView={
                                <View style={{}}>
                                    <TouchableOpacity 
                                        style={{}}
                                        onPress={()=>{
                                            this.onSelectPicture()
                                        }}>
                                        <FastImage
                                            style={{width: 120, 
                                                    height: 120, 
                                                    borderRadius: 60, 
                                                    backgroundColor: '#FF83AF',}}
                                            source={{
                                                uri: my_application.image_url,
                                                headers:{ Authorization: 'someAuthToken' },
                                                priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                        <TouchableOpacity
                                            style={{position:'absolute', right:0, bottom:0, }}
                                            onPress={()=>{
                                                this.onSelectPicture()
                                            }}>
                                            <MyIcon
                                                name={'camera'}
                                                size={20}
                                                color={'#C7D8DD'} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                </View>
                                }/>
                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10, }} 
                                hideSeparator={true} 
                                title="Name" 
                            />
                            <Cell
                                accessory="DisclosureIndicator"
                                cellContentView={
                                    <TextInput
                                        style={{ fontSize: 22, flex: 1 }}
                                        placeholder="Input name application"
                                        // ref= {(el) => { this.applicationName = el; }}
                                        onChangeText={(text) => {

                                            my_application = {...my_application, name:text}
                                            this.setState({my_application})
                                        }}
                                        editable={false}
                                        pointerEvents="none"
                                        value={my_application.name}
                                    />
                                }
                                onPress={()=>{
                                    this.props.navigation.navigate("EditNameMyApplicationPage", {application_id})
                                }}
                            />

                            {cell_category}
                            {cell_subcategory}
                            {cell_published}
                        
                            <Cell 
                                cellStyle="RightDetail" 
                                title="Emails" 
                                detail=""
                                // accessory="DisclosureIndicator"
                                hideSeparator={true} 
                                contentContainerStyle={{}} 
                                onPress={()=>{
                                    // this.state.item.item_id
                                    // this.props.navigation.navigate("ManageEmailsPage", {'item_id': this.state.item.item_id})
                                }}/>
                            {this.emailsList()}
                            <Cell
                                cellStyle="Basic"
                                title="Add another email"
                                titleTextStyle={{ fontSize: 16}} 
                                hideSeparator={true} 
                                accessory="DisclosureIndicator"
                                onPress={()=>{
                                    this.props.navigation.navigate("ManageEmailsPage", {application_id})
                                }}/>

                            <Cell 
                                cellStyle="RightDetail" 
                                title="Phones" 
                                detail=""
                                // accessory="DisclosureIndicator"
                                hideSeparator={true} 
                                contentContainerStyle={{}} 
                                onPress={()=>{
                                    // this.props.navigation.navigate("ManageEmailsPage", {'item_id': this.state.item.item_id})
                                }}/>
                            {this.phonesList()}
                            <Cell
                                cellStyle="Basic"
                                title="Add another phone"
                                titleTextStyle={{ fontSize: 16}} 
                                hideSeparator={true} 
                                accessory="DisclosureIndicator"
                                onPress={()=>{
                                    this.props.navigation.navigate("ManagePhonesPage", {application_id})
                                }}/>

                            {cell_address}
                            {/* phonesList
                            <Cell 
                                cellStyle="RightDetail" 
                                title="Category" 
                                detail={Object.keys(this.state.category_select).length == 0 ? "None" : this.state.category_select.name}
                                accessory="DisclosureIndicator"
                                contentContainerStyle={{ padding:10}} 
                                onPress={()=>{
                                    this.props.navigation.navigate("ListAllCategory", { handleCategoryBack: this.handleCategoryBack, category_select:this.state.category_select })
                                }}/>
                            <Cell 
                                cellStyle="RightDetail" 
                                title="Subcategory" 
                                detail={Object.keys(this.state.subcategory_select).length == 0 ? "None" : this.state.subcategory_select.name}
                                accessory="DisclosureIndicator"
                                contentContainerStyle={{ padding:10}} 
                                onPress={()=>{
                                    this.props.navigation.navigate("ListAllSubcategory", { handleSubcategoryBack: this.handleSubcategoryBack, category:this.state.category_select, subcategory_select:this.state.subcategory_select })
                                }}/>
                            <Cell 
                                cellStyle="RightDetail" 
                                title="Emails" 
                                detail="None"
                                accessory="DisclosureIndicator"
                                contentContainerStyle={{ padding:10}} 
                                onPress={()=>{
                                    // this.state.item.item_id
                                    this.props.navigation.navigate("ManageEmailsPage", {'item_id': this.state.item.item_id})
                                }}/>
                            <Cell 
                                cellStyle="RightDetail" 
                                title="Phones" 
                                detail="None"
                                accessory="DisclosureIndicator"
                                contentContainerStyle={{ padding:10}} 
                                onPress={()=>{
                                    this.props.navigation.navigate("ManagePhonesPage", {'item_id': this.state.item.item_id})
                                }}/>
                            <Cell
                                cellStyle="Basic" 
                                title="Published"
                                cellAccessoryView={
                                <Switch 
                                    onValueChange = {this.togglePublished}
                                    value = {this.state.isPublished}/>
                                }
                                contentContainerStyle={{ paddingVertical: 4 }}/>
                            */}
                        </Section>
                    </TableView>
                </ScrollView>
                </KeyboardAwareScrollView>
                            
            </MenuContext>
        );
      }
}

const mapStateToProps = (state, ownProps) => {
    // console.log(state)
  
    // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
    //_persist.rehydrated parameter is initially set to false
    if(!state._persist.rehydrated){
      return {}
    }

    if(!state.auth.isLogin){
        return;
    }
  
    return{
        uid: makeUidState(state, ownProps),
        my_applications: makeMyAppicationsState(state, ownProps),
        application_category: makeApplicationCategoryState(state, ownProps),
    }
}
  
export default connect(mapStateToProps, actions)(SettingMyApplicationPage)