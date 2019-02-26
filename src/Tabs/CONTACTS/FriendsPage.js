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
import {getUid, getHeaderInset} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';

class FriendsPage extends React.Component{

    constructor(props){
        super(props)
        this.state = {
          renderContent: false,
          loading: false,
          // data:[],

          sectionID: null,
          rowID: null,
        }
    }
    
    componentDidMount() {
      setTimeout(() => {this.setState({renderContent: true})}, 0);

      this.loadData()
    }

    // componentWillReceiveProps(nextProps){
    //   /* 
    //   check ว่ามี property auth ถ้าไม่มีแสดงข้อมูลอาจผิดพลาดเราจะไม่ทำอะไร
    //   */
    //   if(!nextProps.hasOwnProperty('auth')){
    //     return;
    //   }

    //   // console.log('componentWillReceiveProps')
    // }

    loadData=()=>{
        if(this.props.auth.users === null){
          return;
        }

        let {presences} = this.props

        let profile = {
          title: 'Profile',
          member: [
            {
              name: this.props.auth.users.profiles.name,
              status: this.props.auth.users.profiles.status_message,
              image_url: this.props.auth.users.profiles.image_url,
            }
          ]
        }

        let friendRequestSent_member = []
        let friendRequest_member = []
        let friend_member = []

        let favorite_member = [] 
        for (var key in this.props.auth.users.friends) {

          let friend =  this.props.auth.users.friends[key]
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

        let friends = {title: 'Friends',
          member: friend_member
        }

        return [profile, favorites, friendRequests, friendRequestSents, friends];     
        
        // this.setState({data})
    }

    _itemOnPress=(item, rowId, sectionId)=>{
      if(rowId == 0 && sectionId == 0){
        this.props.params.navigation.navigate("MyProfilePage")
      }else{
        this.props.params.navigation.navigate("FriendProfilePage",{'friend_id': item.friend_id})
      }
    }

    showMenuFriend = (rowItem)=>{
      console.log(rowItem)
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
                          name={'dot-vertical'}
                          size={15}
                          color={'gray'} />  
                  </MenuTrigger>
                  <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset() + 50)}}>
                      <MenuOption onSelect={() => {
                        this.props.params.navigation.navigate("ChatPage")
                      }}>
                          <Text style={{padding:10, fontSize:18}}>Chat</Text>
                      </MenuOption>
                      <MenuOption onSelect={() => {
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
                                this.props.actionFriendHide(this.props.uid, rowItem.friend_id, (result)=>{
                                  console.log(result)
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
                                 this.props.actionFriendBlock(this.props.uid, rowItem.friend_id, (result)=>{
                                  console.log(result)
                                })
                              }, 
                              },
                            ],
                            { cancelable: false }
                          )

                      }}>
                          <Text style={{padding:10, fontSize:18}}>Block</Text>
                      </MenuOption>
                      <MenuOption onSelect={() => {
                            let mute = false;
                            if(rowItem.mute !== undefined){
                              mute = !rowItem.mute
                            }

                            this.props.actionFriendMute(this.props.uid, rowItem.friend_id, mute,(result)=>{
                              console.log(result)
                            })
                          }}>
                          <Text style={{padding:10, fontSize:18}}>{rowItem.mute ? 'Mute': 'Unmute'}</Text>
                      </MenuOption>

                      <MenuOption onSelect={() => {
                            // let mute = false;
                            // if(rowItem.mute !== undefined){
                            //   mute = !rowItem.mute
                            // }

                            // this.props.actionFriendMute(this.props.uid, rowItem.friend_id, mute,(result)=>{
                            //   console.log(result)
                            // })

                            let is_favorite = false
                            if(rowItem.is_favorite !== undefined){
                                is_favorite = !rowItem.is_favorite
                            }

                            this.setState({loading:true})
                            this.props.actionFriendFavirite(this.props.uid, rowItem.friend_id, is_favorite, (result) => {
                                console.log(result)
                                this.setState({loading:false})
                            })

                          }}>
                          <Text style={{padding:10, fontSize:18}}>{rowItem.is_favorite ? 'Unfavorite': 'Favorite'}</Text>
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

        var swipeoutRight = []

        let swipeoutLeft  = []

        if(rowItem.profile === undefined){
          return(<View></View>);
        }

        // console.log(rowItem.status)
        switch(rowItem.status){
          case Constant.FRIEND_STATUS_FRIEND:{

            
            swipeoutRight = [
             {
                // text: 'Hide',
                // backgroundColor: '#FFCA16',
                component:<View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: '#FFCA16'}}>
                            <Text style={{fontWeight:'bold', color:'white', fontSize:16}}>HIDE</Text>
                          </View>
                ,
                onPress: () => { 
                  let title = rowItem.hasOwnProperty('change_friend_name') ? rowItem.change_friend_name : rowItem.profile.name
                  
                  Alert.alert(
                    '',
                    'Hide '+ title +'?',
                    [
                      // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                      {text: 'Cancel', 
                      onPress: () => {console.log("cancel")}, 
                      style: 'cancel'},
                      {text: 'OK', 
                      onPress: () => {
                          this.props.actionFriendHide(this.props.uid, rowItem.friend_id, (result)=>{
                            console.log(result)
                          })
                        }, 
                      },
                    ],
                    { cancelable: false }
                  )
                }
              },{
                // text: 'Block',
                // backgroundColor: '#7ACC1F',
                component:<View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: '#7ACC1F'}}>
                            <Text style={{fontWeight:'bold', color:'white', fontSize:16}}>BLOCK</Text>
                          </View>
                ,
                onPress: () => { 
                 
                  let title = rowItem.hasOwnProperty('change_friend_name') ? rowItem.change_friend_name : rowItem.profile.name
                  
                  Alert.alert(
                    '',
                    'Block '+ title + '?',
                    [
                      // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                      {text: 'Cancel', 
                      onPress: () => {console.log("cancel")}, 
                      style: 'cancel'},
                      {text: 'OK', 
                      onPress: () => {
                         this.props.actionFriendBlock(this.props.uid, rowItem.friend_id, (result)=>{
                          console.log(result)
                        })
                      }, 
                      },
                    ],
                    { cancelable: false }
                  )
                  
                }
              }
            ]

            swipeoutLeft  = [
              {
                component:<View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'rgba(186, 53, 100, 1.0)'}}>
                            {/* <Image
                                style={{ width: 60, height: 60}}
                                source={{uri:rowItem.mute ? `data:image/svg+xml;utf8,<svg id="Layer_3" data-name="Layer 3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 792 792"><defs><style>.cls-1{fill:#fff;}</style></defs><title>mute</title><path class="cls-1" d="M471.22,564.12a25.91,25.91,0,0,1-13.79,12.11s-9.83,1.54-14.81,0C420.28,568.32,340,521.34,336.4,519.57a30.07,30.07,0,0,0-10.72-2.83H241.94c-4.34,0-22-3.31-32.68-13.22s-24.64-30.1-29.62-40.61c-10.34-20.77-12.77-52.25-12.77-66.91,0-15.85,2.43-49.89,12.77-72.36,3.94-9,13.47-24.54,22.6-35.95"/><path class="cls-1" d="M220.73,271.65c9-4.53,18.23-6.22,21.21-6.22h83.74a28.21,28.21,0,0,0,10.72-3.07c3.58-1.91,83.88-52.72,106.22-61.27,5-1.66,14.81,0,14.81,0a26.29,26.29,0,0,1,15.44,17.74c3.45,13.53,25.28,127,27.07,130.85s8.42,3.7,10.59,6.13c7.53,6.76,6.64,20.42,6.64,20.42v38s.89,12.63-6.64,18.88c-2.17,2.25-8.81,2.13-10.59,5.67-1.25,2.48-12.32,54.61-20,90"/><g id="Layer_4" data-name="Layer 4"><path class="cls-1" d="M511,291s34.22,39,34.22,105S511,499,511,499s17.11-24,17.11-103S511,291,511,291Z"/><path class="cls-1" d="M537.36,269.36S578.61,316.41,578.61,396s-41.25,124.23-41.25,124.23S558,491.25,558,396,537.36,269.36,537.36,269.36Z"/></g><path class="cls-1" d="M565.68,613.55c-3.13-3.12-417.51-413.42-420.25-416.17s-11.24-22.47,0-33.7,30.7,1.6,33.19,4.09,412.13,408,415.15,411.06,15.56,22.39,3.22,34.72S568.81,616.68,565.68,613.55Z"/></svg>`:
                              `data:image/svg+xml;utf8,<svg id="Layer_3" data-name="Layer 3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 792 792"><defs><style>.cls-1{fill:#fff;}</style></defs><title>sound</title><path class="cls-1" d="M517.17,396V376.23s.89-13.66-6.64-20.42c-2.17-2.43-8.81-2.3-10.59-6.13s-23.62-117.32-27.07-130.85a26.29,26.29,0,0,0-15.44-17.74s-9.83-1.66-14.81,0C420.28,209.64,340,260.45,336.4,262.36a28.21,28.21,0,0,1-10.72,3.07H241.94c-4.34,0-22,3.57-32.68,14.29s-24.64,32.56-29.62,43.92c-10.34,22.47-12.77,56.51-12.77,72.36"/><path class="cls-1" d="M517.17,396v18.28s.89,12.63-6.64,18.88c-2.17,2.25-8.81,2.13-10.59,5.67s-23.62,108.48-27.07,121-15.44,16.41-15.44,16.41-9.83,1.54-14.81,0C420.28,568.32,340,521.34,336.4,519.57a30.07,30.07,0,0,0-10.72-2.83H241.94c-4.34,0-22-3.31-32.68-13.22s-24.64-30.1-29.62-40.61c-10.34-20.77-12.77-52.25-12.77-66.91"/><g id="Layer_4" data-name="Layer 4"><path class="cls-1" d="M511,291s34.22,39,34.22,105S511,499,511,499s17.11-24,17.11-103S511,291,511,291Z"/><path class="cls-1" d="M550.13,269.36S591.38,316.41,591.38,396s-41.25,124.23-41.25,124.23,20.62-29,20.62-124.23S550.13,269.36,550.13,269.36Z"/><path class="cls-1" d="M597,244.27s49.5,56.45,49.5,152S597,545.33,597,545.33s24.75-34.79,24.75-149.09S597,244.27,597,244.27Z"/></g></svg>`}} /> */}

                            <MyIcon
                              name={rowItem.mute ? 'volume-off' : 'volume-low'}
                              size={35}
                              color={'#C7D8DD'} />
                          </View>
                ,
                onPress: () => {

                  console.log(rowItem)

                  let mute = false;
                  if(rowItem.mute !== undefined){
                    mute = !rowItem.mute
                  }

                  this.props.actionFriendMute(this.props.uid, rowItem.friend_id, mute,(result)=>{
                    console.log(result)
                  })
                },
              },
            ]
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

        return (
          // <Swipeout 
          //   style={{backgroundColor:'white'}} 
          //   right={swipeoutRight}
          //   left={swipeoutLeft}
          //   rowID={rowId}
          //   sectionID={sectionId}
          //   onOpen={(sectionId, rowId) => {
          //     this.setState({
          //       sectionID: sectionId,
          //       rowID: rowId,
          //     })
          //   }}
          //   close={!(this.state.sectionID === sectionId && this.state.rowID === rowId)}
          //   >
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

                  {rowItem.is_online ? <View style={{width: 16, 
                                          height: 16, 
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
                { rowItem.status === Constant.FRIEND_STATUS_FRIEND_REQUEST ?
                <View style={{flexDirection:'row', position:'absolute', right:0, bottom:0, margin:5, }}>
                  <View style={{borderColor:'green', borderWidth:1, borderRadius:10, padding:5}}>
                    <TouchableOpacity
                    onPress={()=>{
                      this.props.actionUpdateStatusFriend(this.props.uid, rowItem.friend_id, Constant.FRIEND_STATUS_FRIEND, (data)=>{
                      })
                    }}>
                      <Text style={{color:'green'}}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{borderColor:'red', borderWidth:1, borderRadius:10, padding:5, marginLeft:5}}>
                    <TouchableOpacity
                    onPress={()=>{
                      this.props.actionUpdateStatusFriend(this.props.uid, rowItem.friend_id, Constant.FRIEND_STATUS_FRIEND_CANCEL_FROM_FRIEND, (data)=>{
                      })
                    }}>
                      <Text style={{color:'red'}}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                : null
                }

                { rowItem.status === Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND ?
                <View style={{flexDirection:'row', position:'absolute', right:0, bottom:0, margin:5, }}>
                  <View style={{borderColor:'red', borderWidth:1, borderRadius:10, padding:5, marginLeft:5}}>
                    <TouchableOpacity
                    onPress={()=>{
                      this.setState({
                        loading:true
                      })

                    }}>
                      <Text style={{color:'red'}}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                : null
                }
            </View>
            {this.showMenuFriend(rowItem)}
          </TouchableOpacity>
          // </Swipeout>
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
        let member_size = this.loadData()[sectionId].member.length
        if(member_size == 0){
          return ;
        }

        let ic_collapse = <MyIcon
                          name={state ? 'collapse-up' : 'collapse-down'}
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
      let {renderContent} = this.state;

      if(!this.props.hasOwnProperty('auth') || !this.props.auth.isLogin){
        return <View style={{flex: 1}}></View>
      }

      return (
        // <MenuContext>
          <View style={{flex: 1}}>
          <Spinner
            visible={this.state.loading}
            textContent={'Wait...'}
            textStyle={{color: '#FFF'}}
            overlayColor={'rgba(0,0,0,0.5)'}
          />
          {
            renderContent && 
            <ExpandableList
              ref={instance => this.ExpandableList = instance}
              dataSource={this.loadData()}
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
      // </MenuContext>
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
    auth:state.auth,
    presences:state.presence.user_presences
  }
}

export default connect(mapStateToProps, actions)(FriendsPage);