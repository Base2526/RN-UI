import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Alert
} from 'react-native'
  
import ExpandableList from 'react-native-expandable-section-flatlist'
import { connect } from 'react-redux';

import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
import {
  MenuProvider,
  Menu,
  MenuContext,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';

import ActionButton from 'react-native-action-button';
var _ = require('lodash');

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'
import {getHeaderInset} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';
import {checkInternetDialog} from '../../Utils/Helpers'

import {makeUidState, 
        makeProfileState, 
        makeFriendsState, 
        makeFriendProfilesState, 
        makePresencesState,
        makeIsConnectedState} from '../../Reselect'

class FriendsPage extends React.Component{

    constructor(props){
        super(props)
        this.state = {
          renderContent: false,
          loading: false,
          data:[],

          sectionID: null,
          rowID: null,
        }
    }
    
    componentDidMount() {
      this.loadData(this.props)
    }

    componentWillReceiveProps(nextProps){
      this.loadData(nextProps)
    }

    loadData=(props)=>{
      if(props.uid === undefined){
        return;
      }

      // if( /*_.isEqual(this.props.presences, props.presences) && */
      //    _.isEqual(this.props.profiles, props.profiles) &&
      //    _.isEqual(this.props.friends, props.friends) &&
      //    _.isEqual(this.props.friend_profiles, props.friend_profiles) && this.state.renderContent){
      //      return;
      // }

      // if(!this.state.renderContent){
      //   this.setState({renderContent: true})
      //   console.log('FriendsPage > loadData : this.setState({renderContent: true})')
      // }
      
      let {presences, profile, friends, friend_profiles} = props

      // console.log(friends, friend_profiles)
      let my_profile = {
        title: 'Profile',
        member: [
          {
            name: profile.name,
            status: profile.status_message,
            image_url: profile.image_url,
          }
        ]
      }

      let friendRequestSent_member = []
      let friendRequest_member = []
      let friend_member = []

      let favorite_member = [] 
      for (var key in friends) {

        let friend = friends[key]

        let friend_profile =_.find(friend_profiles, (fv, fk)=>{
                              return fk == key
                            })
        // console.log(friend, key, friend_profile)

        if(friend_profile === undefined){
          continue;
        }
        
        friend = {...friend, profile:friend_profile}

        switch(friend.status){
          case Constant.FRIEND_STATUS_FRIEND:{
            
            // hide, block
            let isAdd = false
            if(friend.hide === undefined && friend.block === undefined){
              isAdd = true
            }else if(friend.hide !== undefined && friend.block !== undefined){
              if(!friend.hide && !friend.block){
                isAdd = true
              }
            }else if(friend.hide !== undefined){
              if(!friend.hide){
                isAdd = true
              }
            }else if(friend.block !== undefined){
              if(!friend.block){
                isAdd = true
              }
            } 
            
            // console.log('XX', friend, friend_profile, friend.hide, friend.block)
            if(isAdd){
              // check online/offline
              let presence =_.find(presences, (presences_v, presences_k)=>{
                              return presences_k == key
                            })

              let is_online = false
              if(presence !== undefined){
                let __ =_.find(presence, (presence_v, presence_k)=>{
                  return presence_v.status == 'online'
                })
                if(__ !== undefined){
                  is_online = true
                }
              }
              // check online/offline


              friend_member.push({...friend, friend_id:key, is_online});

              if(friend.is_favorite !== undefined){
                if(friend.is_favorite){
                    favorite_member.push({...friend, friend_id:key, is_online});
                }
              }
            }
            break
          }

          case Constant.FRIEND_STATUS_FRIEND_CANCEL:{
            // console.log('2, --' + key)
            break
          }

          case Constant.FRIEND_STATUS_FRIEND_REQUEST:{
            // console.log('3, --' + key)
            friendRequest_member.push({...friend, friend_id:key}); 
            break
          }

          case Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND:{
            // console.log('4, --' + key)
            // console.log()

            // friendRequestSent_member.push({...friend, friend_id:key});  
            break
          }
        }
      }

      let favorites = {title: 'Favorites',
        member: favorite_member
      }

      let friendRequests = {
        title:'Friend Request',
        member: friendRequest_member
      }

      let friendRequestSents = {
        title: 'Friend Request Sent',
        member: friendRequestSent_member
      }

      let _friends = {title: 'Friends',
        member: friend_member
      }
        
      let data = [my_profile, favorites, friendRequests, friendRequestSents, _friends];
      this.setState({data})
    }

    _itemOnPress=(item, rowId, sectionId)=>{
      if(rowId == 0 && sectionId == 0){
        this.props.params.navigation.navigate("MyProfilePage")
      }else{
        this.props.params.navigation.navigate("FriendProfilePage",{'friend_id': item.friend_id})
      }
    }

    showMenuFriend = (rowItem)=>{
      let {is_connected} = this.props

      return( <View style={{flex:1,
                            position:'absolute', 
                            top:0,
                            right:0, 
                            marginRight:10,
                            zIndex:100}}>
                <Menu>
                  <MenuTrigger>
                      <MyIcon 
                          style={{padding:10}}
                          name={'dot-horizontal'}
                          size={15}
                          color={'gray'} />  
                  </MenuTrigger>
                  <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset())}}>
                      <MenuOption onSelect={() => {
                        this.props.params.navigation.navigate("ChatPage")
                      }}>
                          <Text style={{padding:10, fontSize:18}}>Chat</Text>
                      </MenuOption>
                      <MenuOption onSelect={() => {
                            if(!is_connected){
                              checkInternetDialog()
                              return 
                            }

                            let mute = true;
                            if(rowItem.mute !== undefined){
                              mute = !rowItem.mute
                            }
                            
                            // this.setState({loading:true})
                            this.props.actionFriendMute(this.props.uid, rowItem.friend_id, mute,(result)=>{
                              console.log(result)
                              // this.setState({loading:false})
                            })
                          }}>
                          <Text style={{padding:10, fontSize:18}}>{rowItem.mute ? 'Mute': 'Unmute'}</Text>
                      </MenuOption>
                      <MenuOption onSelect={() => {
                            if(!is_connected){
                              checkInternetDialog()
                              return 
                            }

                            let is_favorite = true
                            if(rowItem.is_favorite !== undefined){
                                is_favorite = !rowItem.is_favorite
                            }

                            // this.setState({loading:true})
                            this.props.actionFriendFavirite(this.props.uid, rowItem.friend_id, is_favorite, (result) => {
                                console.log(result)
                                // this.setState({loading:false})
                            })
                          }}>
                          <Text style={{padding:10, fontSize:18}}>{rowItem.is_favorite ? 'Unfavorite': 'Favorite'}</Text>
                      </MenuOption>
                      <MenuOption onSelect={() => {
                        if(!is_connected){
                          checkInternetDialog()
                          return 
                        }

                        let name = rowItem.change_friend_name ? rowItem.change_friend_name : rowItem.profile.name
                        Alert.alert(
                          '',
                          'Hide '+ name +'?',
                          [
                            // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                            {text: 'Cancel', 
                            onPress: () => {console.log("cancel")}, 
                            style: 'cancel'},
                            {text: 'OK', 
                            onPress: () => {
                                // this.setState({loading:true})
                                this.props.actionFriendHide(this.props.uid, rowItem.friend_id, true, (result)=>{
                                  console.log(result)
                                  // this.setState({loading:false})
                                })
                              }, 
                            },
                          ],
                          { cancelable: false }
                        )
                      }}>
                          <Text style={{padding:10, fontSize:18}}>Hide</Text>
                      </MenuOption>
                      <MenuOption onSelect={() => {
                          if(!is_connected){
                            checkInternetDialog()
                            return 
                          }

                          let name = rowItem.change_friend_name ? rowItem.change_friend_name : rowItem.profile.name
                          Alert.alert(
                            '',
                            'Block '+ name + '?',
                            [
                              // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                              {text: 'Cancel', 
                              onPress: () => {console.log("cancel")}, 
                              style: 'cancel'},
                              {text: 'OK', 
                              onPress: () => {
                                // this.setState({loading:true})
                                this.props.actionFriendBlock(this.props.uid, rowItem.friend_id, true,(result)=>{
                                  console.log(result)
                                  // this.setState({loading:false})
                                })
                              }, 
                              },
                            ],
                            { cancelable: false }
                          )

                      }}>
                          <Text style={{padding:10, fontSize:18}}>Block</Text>
                      </MenuOption>
                  </MenuOptions>
              </Menu>
            </View>)
    }

    showMenuFriendRequest = (rowItem) =>{
      return( <View style={{flex:1,
                            position:'absolute', 
                            top:0,
                            right:0, 
                            marginRight:10,
                            zIndex:100}}>
                  <Menu>
                  <MenuTrigger>
                    <MyIcon 
                        style={{padding:10}}
                        name={'dot-horizontal'}
                        size={15}
                        color={'gray'} />  
                  </MenuTrigger>
                  <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset())}}>
                      <MenuOption onSelect={() => {
                        // this.props.params.navigation.navigate("ChatPage")
                        // alert('Accept')
                        this.props.actionUpdateStatusFriend(this.props.uid, rowItem.friend_id, Constant.FRIEND_STATUS_FRIEND, (data)=>{
                        })
                      }}>
                          <Text style={{padding:10, fontSize:18}}>Accept</Text>
                      </MenuOption>

                      <MenuOption onSelect={() => {
                        // this.props.params.navigation.navigate("ChatPage")
                        this.props.actionUpdateStatusFriend(this.props.uid, rowItem.friend_id, Constant.FRIEND_STATUS_FRIEND_CANCEL_FROM_FRIEND, (data)=>{
                        })
                      }}>
                          <Text style={{padding:10, fontSize:18}}>Cancel</Text>
                      </MenuOption>

                      <MenuOption onSelect={() => {
                        this.props.params.navigation.navigate("FriendProfilePage", {'friend_id': rowItem.friend_id})
                      }}>
                          <Text style={{padding:10, fontSize:18}}>View profile</Text>
                      </MenuOption>
                  </MenuOptions>
                  </Menu>
              </View>)
    }

    _renderRow = (rowItem, rowId, sectionId) => {
        if(rowId == 0 && sectionId == 0){
          
          return (
            <TouchableOpacity 
              key={ rowId } 
              onPress={()=>{
                this._itemOnPress(rowItem, rowId, sectionId)
              }}>
              <View
                style={{
                  alignItems: 'center', 
                  padding: 10,
                  borderColor: '#E4E4E4',
                  flexDirection: 'row',
                }}>
                  <TouchableOpacity
                    onPress={()=>{
                      this._itemOnPress(rowItem, rowId, sectionId)
                    }}>
                    <FastImage
                      style={{width: 50, 
                              height: 50, 
                              borderRadius: 10, 
                              borderColor:'gray'}}
                      source={{
                        uri: rowItem.image_url,
                        headers:{ Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </TouchableOpacity>
                  <View>
                    <Text style={{fontSize: 18, 
                                  fontWeight: '600',
                                  color: '#222',
                                  paddingLeft: 10, 
                                  paddingBottom:5}}>
                        {rowItem.name}
                    </Text>
                    <Text style={{fontSize: 13, 
                                color: '#222',
                                paddingLeft: 10}}>
                        {rowItem.status}
                    </Text>
                  </View>
              </View>
            </TouchableOpacity>
          )
        }

        if(rowItem.profile === undefined){
          return(<View></View>);
        }

        switch(rowItem.status){
          case Constant.FRIEND_STATUS_FRIEND:{

            break
          }

          case Constant.FRIEND_STATUS_FRIEND_CANCEL:{
            break
          }

          case Constant.FRIEND_STATUS_FRIEND_REQUEST:{
            return (
              <TouchableOpacity 
                key={rowId} 
                onPress={()=>{
                  this._itemOnPress(rowItem, rowId, sectionId)
                }}>
                <View
                  style={{
                    alignItems: 'center', 
                    padding: 10,
                    borderColor: '#E4E4E4',
                    flexDirection: 'row',
                  }}>
                    <TouchableOpacity
                      onPress={()=>{
                        this._itemOnPress(rowItem, rowId, sectionId)
                      }}>
                      <FastImage
                            style={{width: 50, height: 50, borderRadius: 10, borderColor:'gray'}}
                            source={{
                              uri: rowItem.profile.image_url,
                              headers:{ Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
    
                      {rowItem.is_online ? <View style={{width: 10, 
                                              height: 10, 
                                              backgroundColor: '#00ff80', 
                                              position: 'absolute',
                                              borderWidth: 2,
                                              borderColor: 'white',
                                              borderRadius: 8,
                                              right: -5,
                                              top: -5}} /> : <View />}
                      
                    </TouchableOpacity>
                    <View>
                        <Text style={{fontSize: 18, 
                                      fontWeight: '600',
                                      color: '#222',
                                      paddingLeft: 10, 
                                      paddingBottom:5}}>
                            {rowItem.hasOwnProperty('change_friend_name') ? rowItem.change_friend_name : rowItem.profile.name}
                        </Text>
                        <Text style={{fontSize: 13, 
                                    color: '#222',
                                    paddingLeft: 10}}>
                            {rowItem.profile.status_message}
                        </Text>
                    </View>
                </View>
                {this.showMenuFriendRequest(rowItem)}
              </TouchableOpacity>
            )
            break
          }

          case Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND:{
            break
          }
        }

        return (
          <TouchableOpacity 
            key={rowId} 
            onPress={()=>{
              this._itemOnPress(rowItem, rowId, sectionId)
            }}
            onLongPress={()=>{

            }}>
            <View
              style={{
                alignItems: 'center', 
                padding: 10,
                borderColor: '#E4E4E4',
                flexDirection: 'row',
              }}>
                <TouchableOpacity
                  onPress={()=>{
                    this._itemOnPress(rowItem, rowId, sectionId)
                  }}>
                  <FastImage
                        style={{width: 50, height: 50, borderRadius: 10, borderColor:'gray'}}
                        source={{
                          uri: rowItem.profile.image_url,
                          headers:{ Authorization: 'someAuthToken' },
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />

                  {rowItem.is_online ? <View style={{width: 10, 
                                          height: 10, 
                                          backgroundColor: '#00ff80', 
                                          position: 'absolute',
                                          borderWidth: 2,
                                          borderColor: 'white',
                                          borderRadius: 8,
                                          right: -5,
                                          top: -5}} /> : <View />}
                  
                </TouchableOpacity>
                <View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{fontSize: 18, 
                                    fontWeight: '600',
                                    color: '#222',
                                    paddingLeft: 10, 
                                    paddingBottom:5}}>
                          {rowItem.hasOwnProperty('change_friend_name') ? rowItem.change_friend_name : rowItem.profile.name}
                      </Text>
                      {rowItem.mute?<View />:<MyIcon
                                      style={{paddingLeft:5}}
                                      name={'volume-off'}
                                      size={20}
                                      color={'#C7D8DD'} />}
                    </View>

                    <Text style={{fontSize: 13, 
                                color: '#222',
                                paddingLeft: 10}}>
                        {rowItem.profile.status_message}
                    </Text>
                </View>
            </View>
            {this.showMenuFriend(rowItem)}
          </TouchableOpacity>
        )
    };
    
    _renderSection = (section, sectionId, state)  => {
      if(sectionId == 0){
        return (
          <View
              style={{ 
                      height: 30, 
                      flexDirection: 'row',
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#E4E4E4' }}>
          <View style={{ flexDirection: 'row', 
                        alignItems: 'center'}}>
              <Text style={{ fontSize: 13, 
                              color: 'gray',
                              paddingLeft: 10,
                              fontWeight:'700' }}>
              {section}
              </Text>
          </View>
          </View>
        )
      }else{
        let member_size = this.state.data[sectionId].member.length
        if(member_size == 0){
          return ;
        }

        let ic_collapse = <MyIcon
                              name={state?'collapse-up':'collapse-down'}
                              size={8}
                              color={'#C7D8DD'} />

        return (
            <View
                style={{ 
                        height: 30, 
                        flexDirection: 'row',
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        borderBottomWidth: 0.5,
                        borderBottomColor: '#E4E4E4' }}>
            <View style={{ flexDirection: 'row', 
                          alignItems: 'center'}}>
                <Text style={{ fontSize: 13, 
                                color: 'gray',
                                paddingLeft: 10,
                                fontWeight:'700' }}>
                {section + "("+ member_size +")"}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent:'center', alignItems: 'center', marginRight:10 }}>
                {ic_collapse}
            </View>
            </View>
        )
      }
    }
    
    _btnPress = () => {
      this.ExpandableList.setSectionState(0, false);
    };
    
    render() {
      let {renderContent, data} = this.state;

      if(data.length == 0){
        return <View style={{flex: 1}}></View>
      }

      console.log('FriendsPage > render()')
      return (
          <View style={{flex: 1}}>
          <Spinner
            visible={this.state.loading}
            textContent={'Wait...'}
            textStyle={{color: '#FFF'}}
            overlayColor={'rgba(0,0,0,0.5)'}
          />
          {
            // renderContent && 
            <ExpandableList
              ref={instance => this.ExpandableList = instance}
              dataSource={data}
              headerKey="title"
              memberKey="member"
              renderRow={this._renderRow}
              headerOnPress={(i, state) => {
                // console.log(i, state)
                // alert('headerOnPress')
              } }
              renderSectionHeaderX={this._renderSection}
              openOptions={[0, 1, 2, 3, 4]}
              // onScroll={this.props.handleScroll}
            />
          }
            <ActionButton 
              buttonColor="rgba(231,76,60,1)"
              offsetX={10} 
              offsetY={10}
              hideShadow={true}
              renderIcon={() => {
                  return(<MyIcon
                      name={'user-plus'}
                      size={25}
                      color={'#C7D8DD'} />)
                  }}
              onPress={()=>{
                  this.props.params.navigation.navigate("AddFriendsPage")
              }} />
          </View>
      );
    }
}

const mapStateToProps = (state, ownProps) => {
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
    friends:makeFriendsState(state, ownProps),
    friend_profiles:makeFriendProfilesState(state, ownProps),
    profile:makeProfileState(state, ownProps),
    presences:makePresencesState(state, ownProps),

    is_connected: makeIsConnectedState(state, ownProps),
  }
}
export default connect(mapStateToProps, actions)(FriendsPage);