import React from 'react'
import {View, 
        Text, 
        TouchableOpacity, 
        ActivityIndicator, 
        TextInput,
        ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';

import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { connect } from 'react-redux';
import * as actions from '../../actions'
import {checkInternetDialog, isEquivalent2Object} from '../../utils/Helpers'

import MyIcon from '../../config/icon-font.js';

import {makeUidState,
        makeIsConnectedState} from '../../reselect'

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

class CreateApplicationPage extends React.Component{
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
        headerRight: (
            <TouchableOpacity
                style={{marginRight:5}}
                onPress={() => {
                    const { params = {} } = navigation.state
                    params.handleCreateApplication()
                }}>
                <Text style={{fontSize:18, fontWeight:'600', color:'white'}}>Create</Text>
            </TouchableOpacity>
          ),
    })

    constructor(props) {
        super(props);
    
        this.state = {
            text:'',
            applicationName: '',
            renderContent: false,
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            // avatarSource: {"uri":"https://unsplash.it/400/400?image=1"},
            category_select:{},
            subcategory_select:{},
            applicationImage: {"uri":""},
        };
    }

    componentDidMount() {
      setTimeout(() => {this.setState({renderContent: true})}, 0);

      this.props.navigation.setParams({ handleCreateApplication: this.handleCreateApplication })

      this.setState({
        error: null,
        loading: false,
        refreshing: false
      });
    }

    handleCreateApplication = () => {
        let {is_connected} = this.props
        
        let uri = this.state.applicationImage.uri; 
        let applicationName = this.state.applicationName.trim()
        let category = this.state.category_select
        let subcategory = this.state.subcategory_select
 
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

            if(!is_connected){
                checkInternetDialog()
                return 
            }

            this.setState({loading: true})
            this.props.actionCreateMyApplication(this.props.uid, applicationName, category.tid, subcategory.tid, uri).then((result) => {
                // console.log(result)
                this.setState({loading: false})
                if(result.status){
                    this.props.navigation.goBack()
                }else{
                    // alert()
                }
            })
        }
    }

    handleCategoryBack = (data) => {
        console.log(data.item)

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
        console.log(data.item)
        this.setState({
            subcategory_select:data.item
        })
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

    render() {
        return (
        <KeyboardAwareScrollView>
          <ScrollView style={{flex:1, backgroundColor: 'white'}}>
            <Spinner
                visible={this.state.loading}
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
                                        size={25}
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
                                onChangeText={(text) => this.setState({applicationName:text})}
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
                            this.props.navigation.navigate("ListAllCategory", { handleCategoryBack: this.handleCategoryBack })
                        }}/>
                    
                    {Object.keys(this.state.category_select).length != 0 ?
                        <Cell 
                            cellStyle="RightDetail" 
                            title="Subcategory" 
                            detail={Object.keys(this.state.subcategory_select).length == 0 ? "None" : this.state.subcategory_select.name}
                            accessory="DisclosureIndicator"
                            contentContainerStyle={{ padding:10}} 
                            onPress={()=>{

                                // console.log(this.state.category_select)
                                this.props.navigation.navigate("ListAllSubcategory", { handleSubcategoryBack: this.handleSubcategoryBack, category:this.state.category_select.tid })
                            }}/>
                        :null
                    }
                </Section>
            </TableView>
          </ScrollView>
        </KeyboardAwareScrollView>
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
        is_connected: makeIsConnectedState(state, ownProps),
    }
}
  
export default connect(mapStateToProps, actions)(CreateApplicationPage)