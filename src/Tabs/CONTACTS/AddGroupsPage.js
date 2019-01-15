import React from 'react'

import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, TouchableHighlight, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Styles from '../../styles';
import { List, ListItem, SearchBar } from "react-native-elements";
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import DictStyle from '../CONTACTS/dictStyle';

import ImagePicker from 'react-native-image-picker';

// import RNFetchBlob from 'react-native-fetch-blob'

// import ImgToBase64 from 'react-native-image-base64';

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'

import {getUid} from '../../Utils/Helpers'

import ImageWithDefault from '../../Utils/ImageWithDefault'

// import {group_all, 
//         groupDetail_all, 
//         group_get,
//         groupDetail_get, 
//         group_update, 
//         groupDetail_update} from '../../Utils/DB'

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

class AddGroupsPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "Create Group",
        // headerLeft: (
        //     <TouchableOpacity
        //         style={Styles.headerButton}
        //         onPress={() => navigation.openDrawer()}>
        //         <Icon name="bars" size={25} />
        //     </TouchableOpacity>
        // ),
        headerStyle: {
          backgroundColor: 'rgba(186, 53, 100, 1.0)',
          borderBottomWidth: 0,
        },
        headerRight: (
            <TouchableOpacity
                style={{paddingRight:10}}
                onPress={() => {
                  const { params = {} } = navigation.state
                  params.handleCreateGroup()
                }}>
                <Text style={{fontSize:16, fontWeight:'600'}}>Create</Text>
            </TouchableOpacity>
          ),
    })

    constructor(props) {
        super(props);
    
        this.state = {
          renderContent: false,
          loading: false,
          data: [],
          page: 1,
          seed: 1,
          error: null,
          refreshing: false,
          text: '',
          avatarSource: {"uri":""},
          seleteds: [],
          groupName: ''
        };
    }

    componentDidMount() {
      // this.makeRemoteRequest();

      // console.log(RNFetchBlob)

      setTimeout(() => {this.setState({renderContent: true})}, 0);

      this.props.navigation.setParams({ handleCreateGroup: this.handleCreateGroup })

      this.setState({
        data: this.loadData(),
        error: null,
        loading: false,
        refreshing: false
      });
    }

    handleCreateGroup = () => {
      let groupName = this.state.groupName.trim()
      let uri = this.state.avatarSource.uri; 
      let seleteds = this.state.seleteds;
      if(groupName === "" && uri === "" && seleteds.length === 0){
        alert("Group name and Image && Select friend is empty.")
      }else if(groupName === ""){
        alert("Group name is empty.")
      }else if(uri === ""){
        alert("Image is empty.")
      }else if(seleteds.length === 0){
        alert("Select friend is empty.")
      }else{
        console.log('-success-')


        // console.log(this.state.avatarSource.uri)
        // console.log(this.state.avatarSource.uri.replace('file://', ''))
  
        // console.log(RNFetchBlob.wrap(this.state.avatarSource.uri.replace('file://', '')))
        
        this.setState({loading:true})

        // ImgToBase64.getBase64String(this.state.avatarSource.uri)
        // .then(base64String => {
          //  console.log(base64String)

        this.props.actionCreateGroup(this.props.uid, groupName, seleteds, this.state.avatarSource.uri).then((result) => {
          console.log(result)

          this.setState({loading:false})
          if(result.status){
            // this.props.navigation.navigate("App") 

            let {item_id, group, group_detail} = result.data

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

    loadData=()=>{
      let friend_member = []

      // console.log(this.props.auth.users.friends)
      for (var key in this.props.auth.users.friends) {
    
        let friend =  this.props.auth.users.friends[key]
        // let friend_profile = friend_profiles[key]

        console.log(friend)

        switch(friend.status){
          case Constant.FRIEND_STATUS_FRIEND:{
            // console.log('1, --' + key)
            
            friend_member.push({...friend, ...{'friend_id':key}});
            break
          }

          case Constant.FRIEND_STATUS_FRIEND_CANCEL:{
            // console.log('2, --' + key)
            break
          }

          case Constant.FRIEND_STATUS_FRIEND_REQUEST:{
            // console.log('3, --' + key)
            break
          }

          case Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND:{
            // console.log('4, --' + key)
            break
          }
        }
      }

      // console.log(friend_member)
      return friend_member
    }

    makeRemoteRequest = () => {
      const { page, seed } = this.state;
      const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
      this.setState({ loading: true });
  
      fetch(url)
        .then(res => res.json())
        .then(res => {
          this.setState({
            data: page === 1 ? res.results : [...this.state.data, ...res.results],
            error: res.error || null,
            loading: false,
            refreshing: false
          });
        })
        .catch(error => {
          this.setState({ error, loading: false });
        });
    };
    
    handleRefresh = () => {
      this.setState(
        {
          page: 1,
          seed: this.state.seed + 1,
          refreshing: true
        },
        () => {
          this.makeRemoteRequest();
        }
      );
    };
  
    handleLoadMore = () => {
      this.setState(
        {
          page: this.state.page + 1
        },
        () => {
          this.makeRemoteRequest();
        }
      );
    };
  
    renderSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "86%",
            backgroundColor: "#CED0CE",
            marginLeft: "14%"
          }}
        />
      );
    };
  
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
                  placeholder = "Input group name"
                  placeholderTextColor = "gray"
                  autoCapitalize = "none"
                  ref= {(el) => { this.groupName = el; }}
                  onChangeText = {this.handleEmail}
                  value={this.state.groupName}/>
            </View>
        </View>)
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

    handleEmail = (groupName) => {
        this.setState({ groupName })
    }

    _check=(friend_id)=>{

      let seleteds = this.state.seleteds
      let check = seleteds.find(function(element) { 
        return element === friend_id; 
      }); 

      if(check === undefined){
        this.setState({
          seleteds: [...seleteds, friend_id]
        })
      }else{
        let newSeleteds = seleteds.filter(function(member) {
          return member !== friend_id;
        });

        this.setState({
          seleteds:newSeleteds
        })
      }
    }

    renderItem = ({item, index}) => {        
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
                  style={{height:60,
                          width: 60,
                          borderRadius: 10}}
                  onPress={()=>this.props.navigation.navigate("FriendProfilePage", {'friend_id': item.friend_id})}>
                    <ImageWithDefault 
                      source={{uri:item.profile.image_url}}
                      style={{width: 60, height: 60, borderRadius: 10, borderWidth:1, borderColor:'gray'}}/>
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
    
    render() {
        let {
          renderContent
        } = this.state;
    
        return (
          <View style={{flex:1, backgroundColor: 'white'}}>
          {this.renderHeader()}
          {
            renderContent &&
            
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
          }
          </View>
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
    auth:state.auth,
    uid:getUid(state)
  }
}

export default connect(mapStateToProps, actions)(AddGroupsPage);