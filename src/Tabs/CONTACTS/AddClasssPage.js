import React from 'react'

import {View, Text, TouchableOpacity, TextInput} from 'react-native'
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/FontAwesome5';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';

import Styles from '../../styles';

import ImagePicker from 'react-native-image-picker';

import Constant from '../../Utils/Constant'
import * as actions from '../../Actions'

import {getUid} from '../../Utils/Helpers'

// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    noData: true,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    quality: 0.7,
    maxWidth: 500,
    maxHeight: 500,
  };

class AddClasssPage extends React.Component{

    constructor(props){
        super(props)
        
        this.state = {
            className: '',
            avatarSource: {"uri":""},
            loading: false
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: "Add Classs",
        // headerLeft: (
        //     <TouchableOpacity
        //         style={Styles.headerButton}
        //         onPress={() => navigation.openDrawer()}>
        //         <Icon name="bars" size={25} />
        //     </TouchableOpacity>
        // ),
        headerRight: (
          <TouchableOpacity
            style={{paddingRight:10}}
            onPress={() => {
              const { params = {} } = navigation.state
              params.handleCreateClass()
            }}>
            <Text style={{fontSize:16, fontWeight:'600'}}>Create</Text>
          </TouchableOpacity>
        ),
    })

    componentDidMount() {
      this.props.navigation.setParams({ handleCreateClass: this.handleCreateClass })
    }

    handleCreateClass = () => {
      let className = this.state.className.trim()
      let uri = this.state.avatarSource.uri; 

      if(className === "" && uri === ""){
        alert("Class name and Image is empty.")
      }else if(className === ""){
        alert("Class name is empty.")
      }else if(uri === ""){
        alert("Image is empty.")
      }else{
        this.setState({loading:true})
        console.log('className : ' + className + ", uri : " + uri)

        // actionCreateClass = (uid, class_name, uri) 

        this.props.actionCreateClass(this.props.uid, className, this.state.avatarSource.uri).then((result) => {
          console.log(result)

          this.setState({loading:false})
          if(result.status){
            // this.props.navigation.navigate("App") 

            // let {item_id, group, group_detail} = result.data

            this.props.navigation.goBack()

            // let item_id = result
            // console.log(item_id)
            // console.log(group)
            // console.log(group_detail)

            // group_update({'group_id':item_id,'value':group}, v=>{
            //   console.log(v)
            // })

            // groupDetail_update({'group_id':item_id, 'value':group_detail}, v=>{
            //   console.log(v)
            // })
          }else{

          }
        })
      }
    }

    handleClass = (className) => {
      this.setState({ className })
    }

    render(){
        return(
            <View style={{flex:1, alignItems:'center'}}>
                    <Spinner
                      visible={this.state.loading}
                      textContent={'Waite...'}
                      textStyle={{color: '#FFF'}}
                      overlayColor={'rgba(0,0,0,0.5)'}
                    />
                    <TouchableOpacity 
                              style={{height:80,
                                      width: 80,
                                      borderRadius: 10,
                                      margin:10}}
                                onPress={()=>
                                {
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
                                        avatarSource: source,
                                      });

                                      console.log(this.state.avatarSource.uri)
                                    }
                                  });
                                }}>
                              <FastImage
                                  style={{width: 80, height: 80, borderRadius: 10}}
                                  source={{
                                  uri: this.state.avatarSource.uri === "" ? Constant.DEFAULT_AVATARSOURCE_URI : this.state.avatarSource.uri,
                                  headers:{ Authorization: 'someAuthToken' },
                                  priority: FastImage.priority.normal,
                                  }}
                                  resizeMode={FastImage.resizeMode.contain}
                              />
                    </TouchableOpacity>
                    <TextInput style = {{margin: 15,
                                        height: 40,
                                        width:180,
                                        borderColor: 'gray',
                                        borderWidth: 1}}
                        underlineColorAndroid = "transparent"
                        placeholder = "Class name"
                        placeholderTextColor = "gray"
                        autoCapitalize = "none"

                        ref= {(el) => { this.className = el; }}
                        onChangeText = {this.handleClass}
                        value={this.state.className}/>
                </View>
        )
    }
}

// uid:getUid(state)

const mapStateToProps = (state) => {
  console.log(state)

  // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
  //_persist.rehydrated parameter is initially set to false
  if(!state._persist.rehydrated){
    return {}
  }

  return{
    uid:getUid(state)
  }
}

export default connect(mapStateToProps, actions)(AddClasssPage);