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
import Image from 'react-native-remote-svg'
import Spinner from 'react-native-loading-spinner-overlay';

var _ = require('lodash');

import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { connect } from 'react-redux';
import * as actions from '../../Actions'
import {getUid, isEquivalent2Object} from '../../Utils/Helpers'

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
        //             params.handleSaveApplication()
        //         }}>
        //         <Text style={{fontSize:18, fontWeight:'600', color:'white'}}>Save</Text>
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

        this.props.navigation.setParams({ handleSaveApplication: this.handleSaveApplication })

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
                                    <Image
                                        style={{ width: 25, height: 25}}
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
                                                    </svg>`}} />
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