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
// import Image from 'react-native-remote-svg'
import Spinner from 'react-native-loading-spinner-overlay';

var _ = require('lodash');
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { connect } from 'react-redux';
import * as actions from '../../Actions'
import {getUid, isEquivalent2Object} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';

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

class ManageMyApplicationPage extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'rgba(186, 53, 100, 1.0)',
            // ios navigationoptions underline hide
            borderBottomWidth: 0,

            // android navigationoptions underline hide
            elevation: 0,
            shadowOpacity: 0
        },
        // headerRight: (
        //     <TouchableOpacity
        //         style={{marginRight:10}}
        //         onPress={() => {
        //             const { params = {} } = navigation.state
        //             params.handlePost()
        //         }}>
        //         <Text style={{fontSize:18, fontWeight:'600', color:'white'}}>All post</Text>
        //     </TouchableOpacity>
        //   ),
    })

    constructor(props) {
        super(props);
    
        this.state = {
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
            item:{}
        };
    }

    componentDidMount() {
        setTimeout(() => {this.setState({renderContent: true})}, 0);

        this.props.navigation.setParams({ handlePost: this.handlePost })
        // this.props.navigation.setParams({ handleSaveApplication: this.handleSaveApplication })

        this.setState({
            error: null,
            loading: false,
            refreshing: false
        });

        const { navigation } = this.props;
        const item = navigation.getParam('item', null);
        // console.log(item)

        // _.each(item,  function(_v, _k) { 
        //     console.log(_v, _k)
        //     console.group(item)
        //     // if()
        // })

        let {application_category} = this.props.auth

        let c = item.category
        var __ = _.filter(application_category, function(v, k) {
            return c == v.tid;
        });

        let category
        let subcategory

        if(__.length > 0){
            category = __[0]

            let s = item.subcategory
            var ___ = _.filter(category.children, function(v, k) {
                return s == v.tid;
            });

            if(___.length > 0){
                subcategory = ___[0]
            }
        }

        console.log(category)
        console.log(subcategory)

        this.setState({ item, 
                        applicationName:item.name,
                        category_select:category, 
                        subcategory_select:subcategory, 
                        applicationImage:{'uri':item.image_url},
                        isPublished:item.status,
                        loading: true})

        // this.setState({item, applicationName:item.name, applicationImage:{uri:item.image_url}})
        /*
        let {application_category} = this.props.auth

        let c = this.state.item.category
        var category = _.filter(application_category, function(v, k) {
            return c == v.tid;
        });

        // this.state.applicationName
        
        let categoryName = category[0].name
        // let subCategoryName = category[0].name

        console.log(this.state.applicationName)
        */
    }

    handlePost = () =>{
        this.props.navigation.navigate("MyApplicationMyPost")
    }

    handleSaveApplication = () => {
        // let uid = this.props.uid
        
        let uri = this.state.applicationImage.uri; 
        let applicationName = this.state.applicationName.trim()
        let category = this.state.category_select
        let subcategory = this.state.subcategory_select

        /*
        console.log(applicationName)
        console.log(uri)
        console.log(category)
        console.log(subcategory)
        */
 
        if(uri === "" && applicationName === "" ){
            alert("Picture && application name is empty.")
        }else if(uri === "" ){
            alert("Picture name is empty.")
        }else if(applicationName === ""){
            alert("Application name is empty.")
        }else if(Object.keys(category).length == 0){
            alert("Category not select.")
        }else if(Object.keys(subcategory).length == 0){
            alert("Subcategory not select.")
        }else {
            console.log('success')
            // this.setState({loading: true})
            // this.props.actionCreateMyApplication(this.props.uid, applicationName, category.tid, subcategory.tid, uri).then((result) => {
            //     // console.log(result)
            //     this.setState({loading: false})
            //     if(result.status){
            //         this.props.navigation.goBack()
            //     }else{
            //         // alert()
            //     }
            // })
        }
    }

    handleCategoryBack = (data) => {
        // console.log(data.item)

        // if() isEquivalent2Object
        if(Object.keys(this.state.category_select).length == 0){
            this.setState({
                category_select:data.item,
                subcategory_select:{}
            })
        }else{
            if(!isEquivalent2Object(this.state.category_select, data.item)){
                this.setState({
                    category_select:data.item,
                    subcategory_select:{}
                })
            }
        }
    };    

    handleSubcategoryBack = (data) => {
        // console.log(data.item)
        this.setState({
            subcategory_select:data.item
        })
    };    
  
    renderSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "gray",
          }}
        />
      );
    };

    renderFooter = () => {
      if (!this.state.loading) return null;
  
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: "#CED0CE"
          }}
        >
          <ActivityIndicator animating size="large" />
        </View>
      );
    };

    handleApplicatonName = (text) => {
        this.setState({ applicatonName:text })
    }

    onSelectImage = () => {
        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info in the API Reference)
         */
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
                applicationImage: source,
            });
            // console.log(this.state.avatarSource.uri)
          }
        });
    }

    togglePublished = (status) => {
        this.setState({isPublished: status})

        this.props.actionUpdateStatusMyApplication(this.props.uid, this.state.item.item_id, status, (result)=>{
            console.log(result)
        })
    }

    render() {

        if(!this.state.loading){
            return (<View style={{flex:1, backgroundColor:'white'}}></View>)
        }

        console.log(this.state)
        return (
        <KeyboardAwareScrollView>
          <ScrollView style={{flex:1, backgroundColor: 'white'}}>
            <Spinner
                visible={this.state.showSpinner}
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
                                    this.onSelectImage()
                                }}>
                                <FastImage
                                    style={{width: 120, 
                                            height: 120, 
                                            borderRadius: 60, 
                                            backgroundColor: '#FF83AF',}}
                                    source={{
                                        uri: this.state.applicationImage.uri,
                                        headers:{ Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                                <TouchableOpacity
                                    style={{position:'absolute', right:0, bottom:0, }}
                                    onPress={()=>{
                                        this.onSelectImage()
                                    }}>
                                    <MyIcon
                                        name={'camera'}
                                        size={20}
                                        color={'#C7D8DD'} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                        }
                    />
                    <Cell
                        cellStyle="Basic"
                        contentContainerStyle={{ padding:10, }} 
                        hideSeparator={true} 
                        title="Name" 
                    />
                    <Cell
                        cellContentView={
                            <TextInput
                                style={{ fontSize: 22, flex: 1 }}
                                placeholder="Input name application"
                                ref= {(el) => { this.applicationName = el; }}
                                onChangeText={(text) => {
                                    this.setState({applicationName:text})
                                    // console.log(text)
                                }}
                                value={this.state.applicationName}
                            />
                        }
                    />
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
                            // this.props.navigation.navigate("ListAllSubcategory", { handleSubcategoryBack: this.handleSubcategoryBack, category:this.state.category_select })
                        }}/>
                    <Cell 
                        cellStyle="RightDetail" 
                        title="Phones" 
                        detail="None"
                        accessory="DisclosureIndicator"
                        contentContainerStyle={{ padding:10}} 
                        onPress={()=>{
                            // this.props.navigation.navigate("ListAllSubcategory", { handleSubcategoryBack: this.handleSubcategoryBack, category:this.state.category_select })
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
                </Section>
            </TableView>
          </ScrollView>
        </KeyboardAwareScrollView>
        );
      }
}

const mapStateToProps = (state) => {
    console.log(state)
  
    // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
    //_persist.rehydrated parameter is initially set to false
    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
      uid:getUid(state),
      auth:state.auth
    }
}
  
export default connect(mapStateToProps, actions)(ManageMyApplicationPage)