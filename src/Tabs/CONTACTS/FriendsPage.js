import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    Alert
} from 'react-native'
  
import ExpandableList from 'react-native-expandable-section-flatlist'
import Swipeout from 'react-native-swipeout'
import { connect } from 'react-redux';

import FastImage from 'react-native-fast-image'
import Image from 'react-native-remote-svg'

import Spinner from 'react-native-loading-spinner-overlay';

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'
import {getUid} from '../../Utils/Helpers'
import TestSVG from '../../test/TestSVG'

class FriendsPage extends React.Component{

    constructor(props){
        super(props)
        this.state = {
          renderContent: false,
          loading: false,

          sectionID: null,
          rowID: null,
        }
    }
    
    componentDidMount() {
      setTimeout(() => {this.setState({renderContent: true})}, 0);

    }

    componentWillReceiveProps(nextProps){
      /* 
      check ว่ามี property auth ถ้าไม่มีแสดงข้อมูลอาจผิดพลาดเราจะไม่ทำอะไร
      */
      if(!nextProps.hasOwnProperty('auth')){
        return;
      }

      // console.log('componentWillReceiveProps')
    }

    loadData=()=>{
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
        let friendRequest_member = [];
        let friend_member = []
        for (var key in this.props.auth.users.friends) {

          let friend =  this.props.auth.users.friends[key]

          switch(friend.status){
            case Constant.FRIEND_STATUS_FRIEND:{

              // hide, block
              if(friend.hide === undefined && friend.block === undefined){
                friend_member.push({...friend, friend_id:key});
              }else if(friend.hide !== undefined && friend.block !== undefined){
                if(!friend.hide && !friend.block){
                  friend_member.push({...friend, friend_id:key});
                }
              }else if(friend.hide !== undefined){
                if(!friend.hide){
                  friend_member.push({...friend, friend_id:key});
                }
              }else if(friend.block !== undefined){
                if(!friend.block){
                  friend_member.push({...friend, friend_id:key});
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

        let friendRequest = {
          title:'Friend Request',
          member: friendRequest_member
        }

        let friendRequestSent = {
          title: 'Friend Request Sent',
          member: friendRequestSent_member
        }

        let friends = {title: 'Friends',
          member: friend_member
        }

        // console.log([profile, friends, friendRequestSent])
        return [profile, friendRequest, friendRequestSent, friends];        
    }

    _itemOnPress=(item, rowId, sectionId)=>{
      if(rowId == 0 && sectionId == 0){
        this.props.params.navigation.navigate("MyProfilePage")
      }else{
        this.props.params.navigation.navigate("FriendProfilePage",{'friend_id': item.friend_id})
      }
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
                    }}
                    >
                    <TestSVG 
                      width={80}
                      height={80}
                      strokeWidth={3}
                      image_uri={rowItem.image_url}/>
                  </TouchableOpacity>
                  <View>
                    <Text style={{fontSize: 18, 
                                  fontWeight: '600',
                                  color: '#222',
                                  paddingLeft: 10, 
                                  paddingBottom:5}}>
                        Name : {rowItem.name}
                    </Text>
                    <Text style={{fontSize: 13, 
                                color: '#222',
                                paddingLeft: 10}}>
                        Status : {rowItem.status}
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
                            <Image
                                style={{ width: 60, height: 60}}
                                source={{uri:rowItem.mute ? `data:image/svg+xml;utf8,<svg id="Layer_3" data-name="Layer 3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 792 792"><defs><style>.cls-1{fill:#fff;}</style></defs><title>mute</title><path class="cls-1" d="M471.22,564.12a25.91,25.91,0,0,1-13.79,12.11s-9.83,1.54-14.81,0C420.28,568.32,340,521.34,336.4,519.57a30.07,30.07,0,0,0-10.72-2.83H241.94c-4.34,0-22-3.31-32.68-13.22s-24.64-30.1-29.62-40.61c-10.34-20.77-12.77-52.25-12.77-66.91,0-15.85,2.43-49.89,12.77-72.36,3.94-9,13.47-24.54,22.6-35.95"/><path class="cls-1" d="M220.73,271.65c9-4.53,18.23-6.22,21.21-6.22h83.74a28.21,28.21,0,0,0,10.72-3.07c3.58-1.91,83.88-52.72,106.22-61.27,5-1.66,14.81,0,14.81,0a26.29,26.29,0,0,1,15.44,17.74c3.45,13.53,25.28,127,27.07,130.85s8.42,3.7,10.59,6.13c7.53,6.76,6.64,20.42,6.64,20.42v38s.89,12.63-6.64,18.88c-2.17,2.25-8.81,2.13-10.59,5.67-1.25,2.48-12.32,54.61-20,90"/><g id="Layer_4" data-name="Layer 4"><path class="cls-1" d="M511,291s34.22,39,34.22,105S511,499,511,499s17.11-24,17.11-103S511,291,511,291Z"/><path class="cls-1" d="M537.36,269.36S578.61,316.41,578.61,396s-41.25,124.23-41.25,124.23S558,491.25,558,396,537.36,269.36,537.36,269.36Z"/></g><path class="cls-1" d="M565.68,613.55c-3.13-3.12-417.51-413.42-420.25-416.17s-11.24-22.47,0-33.7,30.7,1.6,33.19,4.09,412.13,408,415.15,411.06,15.56,22.39,3.22,34.72S568.81,616.68,565.68,613.55Z"/></svg>`:
                            `data:image/svg+xml;utf8,<svg id="Layer_3" data-name="Layer 3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 792 792"><defs><style>.cls-1{fill:#fff;}</style></defs><title>sound</title><path class="cls-1" d="M517.17,396V376.23s.89-13.66-6.64-20.42c-2.17-2.43-8.81-2.3-10.59-6.13s-23.62-117.32-27.07-130.85a26.29,26.29,0,0,0-15.44-17.74s-9.83-1.66-14.81,0C420.28,209.64,340,260.45,336.4,262.36a28.21,28.21,0,0,1-10.72,3.07H241.94c-4.34,0-22,3.57-32.68,14.29s-24.64,32.56-29.62,43.92c-10.34,22.47-12.77,56.51-12.77,72.36"/><path class="cls-1" d="M517.17,396v18.28s.89,12.63-6.64,18.88c-2.17,2.25-8.81,2.13-10.59,5.67s-23.62,108.48-27.07,121-15.44,16.41-15.44,16.41-9.83,1.54-14.81,0C420.28,568.32,340,521.34,336.4,519.57a30.07,30.07,0,0,0-10.72-2.83H241.94c-4.34,0-22-3.31-32.68-13.22s-24.64-30.1-29.62-40.61c-10.34-20.77-12.77-52.25-12.77-66.91"/><g id="Layer_4" data-name="Layer 4"><path class="cls-1" d="M511,291s34.22,39,34.22,105S511,499,511,499s17.11-24,17.11-103S511,291,511,291Z"/><path class="cls-1" d="M550.13,269.36S591.38,316.41,591.38,396s-41.25,124.23-41.25,124.23,20.62-29,20.62-124.23S550.13,269.36,550.13,269.36Z"/><path class="cls-1" d="M597,244.27s49.5,56.45,49.5,152S597,545.33,597,545.33s24.75-34.79,24.75-149.09S597,244.27,597,244.27Z"/></g></svg>`}} />
                          </View>
                ,
                onPress: () => {
                  this.props.actionFriendMute(this.props.uid, rowItem.friend_id, (result)=>{
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
          <Swipeout 
            style={{backgroundColor:'white'}} 
            right={swipeoutRight}
            left={swipeoutLeft}
            rowID={rowId}
            sectionID={sectionId}
            onOpen={(sectionId, rowId) => {
              this.setState({
                sectionID: sectionId,
                rowID: rowId,
              })
            }}
            close={!(this.state.sectionID === sectionId && this.state.rowID === rowId)}
            >
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
                      <TestSVG 
                        width={80}
                        height={80}
                        strokeWidth={3}
                        image_uri={rowItem.profile.image_url}/>
                </TouchableOpacity>
                <View>
                    <Text style={{fontSize: 18, 
                                  fontWeight: '600',
                                  color: '#222',
                                  paddingLeft: 10, 
                                  paddingBottom:5}}>
                         Name : {rowItem.hasOwnProperty('change_friend_name') ? rowItem.change_friend_name : rowItem.profile.name}
                    </Text>
                    <Text style={{fontSize: 13, 
                                color: '#222',
                                paddingLeft: 10}}>
                        Status : {rowItem.profile.status_message}
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
          </TouchableOpacity>
          </Swipeout>
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

        let ic_collapse;
        if(state){
          // ic_collapse = <Image
          //               style={{width: 20, height: 20}}
          //               source={require('../../Images/collapse_down.svg')}
          //               // resizeMode={FastImage.resizeMode.contain}
          //           />


          ic_collapse =  <Image
                            style={{ width: 20, height: 20}}
                            source={{uri:`data:image/svg+xml;utf8,<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                  width="60.000000pt" height="60.000000pt" viewBox="0 0 60.000000 60.000000"
                                  preserveAspectRatio="xMidYMid meet">
                                <metadata>
                                Created by potrace 1.15, written by Peter Selinger 2001-2017
                                </metadata>
                                <g transform="translate(0.000000,60.000000) scale(0.100000,-0.100000)"
                                fill="#000000" stroke="none">
                                <path d="M128 389 l-31 -31 101 -101 102 -102 99 99 c108 107 111 116 55 153
                                -25 16 -26 16 -90 -48 l-64 -63 -63 62 c-34 34 -66 62 -71 62 -4 0 -21 -14
                                -38 -31z m109 -41 l63 -62 63 62 c67 67 84 71 108 26 12 -24 10 -28 -79 -117
                                l-92 -92 -90 90 c-49 49 -90 94 -90 100 0 13 37 55 48 55 3 0 35 -28 69 -62z"/>
                                <path d="M147 382 c-10 -10 -16 -23 -16 -28 1 -5 39 -45 85 -88 l84 -80 84 80
                                c46 43 84 84 85 90 0 6 -7 18 -18 28 -17 16 -21 13 -85 -51 l-66 -68 -66 68
                                c-36 37 -67 67 -69 67 -1 0 -9 -8 -18 -18z"/>
                                </g>
                                </svg>`}} />

        }else{
          // ic_collapse = <Image
          //               style={{width: 20, height: 20}}
          //               source={require('../../Images/collapse_up.svg')}
          //               // resizeMode={FastImage.resizeMode.contain}
          //           />

          ic_collapse =  <Image
                            style={{ width: 20, height: 20}}
                            source={{uri:`data:image/svg+xml;utf8,<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                            width="60.000000pt" height="60.000000pt" viewBox="0 0 60.000000 60.000000"
                            preserveAspectRatio="xMidYMid meet">
                           <metadata>
                           Created by potrace 1.15, written by Peter Selinger 2001-2017
                           </metadata>
                           <g transform="translate(0.000000,60.000000) scale(0.100000,-0.100000)"
                           fill="#000000" stroke="none">
                           <path d="M197 342 c-94 -94 -97 -98 -82 -120 9 -12 25 -27 37 -33 18 -10 28
                           -4 84 52 l64 63 64 -63 c56 -56 66 -62 84 -52 12 6 28 21 37 33 15 22 12 26
                           -82 120 -54 54 -100 98 -103 98 -3 0 -49 -44 -103 -98z m198 -2 c85 -86 88
                           -90 75 -114 -23 -45 -40 -41 -107 26 l-63 62 -63 -62 c-67 -67 -84 -71 -107
                           -26 -13 24 -10 28 75 114 49 50 92 90 95 90 3 0 46 -40 95 -90z"/>
                           <path d="M213 329 c-46 -45 -83 -85 -83 -89 0 -4 8 -14 19 -24 17 -16 21 -13
                           85 51 l66 68 66 -68 c64 -64 68 -67 85 -51 11 10 19 20 19 24 0 8 -156 163
                           -168 167 -4 2 -44 -34 -89 -78z"/>
                           </g>
                           </svg>
                           `}} />
        }

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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
              openOptions={[0, 1, 2, 3]}
              onScroll={this.props.handleScroll}
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
    uid:getUid(state),
    auth:state.auth
  }
}

export default connect(mapStateToProps, actions)(FriendsPage);