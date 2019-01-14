import React from 'react'

import {View, Text, TouchableOpacity, TextInput, FlatList} from 'react-native'
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
            loading: false,
            data: [],
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: "Add Classs",
        headerStyle: {
          backgroundColor: 'rgba(186, 53, 100, 1.0)',
          borderBottomWidth: 0,
        },
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

    renderHeader = () => {
      // return <SearchBar placeholder="Type Here..." lightTheme round />;
      return(
        <View style={{flexDirection:'row', justifyContent:'center', padding:10, backgroundColor:'rgba(186, 53, 100, 1.0)'}}>
            <TouchableOpacity 
              style={{height:80,
                      width: 80,
                      borderRadius: 40}}
                onPress={()=>{

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
                  style={{width: 80, height: 80, borderRadius: 40, borderColor:'gray', borderWidth:1}}
                  source={{
                  uri: this.state.avatarSource.uri === "" ? Constant.DEFAULT_AVATARSOURCE_URI : this.state.avatarSource.uri,
                  headers:{ Authorization: 'someAuthToken' },
                  priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.normal}
              />
            </TouchableOpacity>
            <View style={{justifyContent:'center', flex:1, marginLeft:5}}>
              <TextInput style = {{fontSize:22}}
                  underlineColorAndroid = "transparent"
                  placeholder = "Input class name"
                  placeholderTextColor = "gray"
                  autoCapitalize = "none"
                  ref= {(el) => { this.className = el; }}
                  onChangeText = {this.handleClass}
                  value={this.state.className}/>
            </View>
        </View>)
    };

    renderItem = ({item, index}) => {
        
      switch(index){
          case 0:{
              return(<View><Text>Select friend</Text></View>)
          }
          break
          default:{
              
              let check = null
              var __ = this.state.seleteds.find(function(element) { 
                return element === item.friend_id; 
              }); 

              if(__ !== undefined){
                check = <Icon name="check" size={15} />
              }

              return(
                    <View
                      style={{
                        alignItems: 'center', 
                        padding: 10,
                        borderColor: DictStyle.colorSet.lineColor,
                        flexDirection: 'row',
                        backgroundColor: 'white'
                      }}
                    >
                      <View style={{flex:1, alignItems:'center'}}>
                        <TouchableOpacity 
                            style={{height: 40,
                                    width: 40,
                                    borderRadius: 10}}
                            onPress={
                              ()=>this.props.navigation.navigate("FriendProfilePage")
                            }>
                            <FastImage
                                style={{width: 40, height: 40, borderRadius: 10}}
                                source={{
                                uri: item.profile.image_url ==='' ? Constant.DEFAULT_AVATARSOURCE_URI : Constant.API_URL + item.profile.image_url,
                                headers:{ Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                            /> 
                        </TouchableOpacity>
                      </View>
                      <View style={{flex:5}}>
                        <TouchableOpacity 
                          onPress={()=>{
                            this._check(item.friend_id)
                          }}
                          style={{flex:1, justifyContent:'center'}}>
                          <Text style={{
                                      fontSize: 16, 
                                      fontWeight: '600',
                                      color: DictStyle.colorSet.normalFontColor,
                                      
                                      paddingLeft: 10}}>
                              {item.profile.name}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{flex:1, alignItems:'center'}}>
                        <TouchableOpacity >
                          {check}
                        </TouchableOpacity>
                      </View>
                    </View>
              )
          }
      }
    }

    render(){
        return(
            <View style={{flex:1}}>
            {this.renderHeader()}

            <FlatList
              style={{flex:1}}
              data={this.state.data}
              
              renderItem={this.renderItem.bind(this)}
              // keyExtractor={(item) =>item}
              keyExtractor = { (item, index) => index.toString() }
              ItemSeparatorComponent={this.renderSeparator}
              // ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
              // onRefresh={this.handleRefresh}
              // refreshing={this.state.refreshing}
              // onEndReached={this.handleLoadMore}
              renderSectionHeader={this.renderSectionHeader}
              onEndReachedThreshold={50}
              extraData={this.state}
              ListHeaderComponent={() => (!this.state.data.length ? 
                <Text style={{textAlign:'left', fontSize:22}}>No Friend.</Text>
                : null)}
            />

            {/*                    
              <TouchableOpacity 
                        style={{height:80,
                                width: 80,
                                borderRadius: 10,
                                margin:10}}
                          onPress={()=>
                          {
                            
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
              */}
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