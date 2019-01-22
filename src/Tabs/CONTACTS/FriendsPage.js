import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    Image
} from 'react-native'
  
import ExpandableList from 'react-native-expandable-section-list'
import Swipeout from 'react-native-swipeout'
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'react-native-firebase';

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'
import PlaceHolderFastImage from '../../Utils/PlaceHolderFastImage'
import {getUid} from '../../Utils/Helpers'

class FriendsPage extends React.Component{

    constructor(props){
        super(props)
        this.state = {
          renderContent: false,
          loading: false,
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

        // console.log(friend_profiles)
        let friendRequestSent_member = []
        let friendRequest_member = [];
        let friend_member = []
        for (var key in this.props.auth.users.friends) {
          // console.log(key)

          let friend =  this.props.auth.users.friends[key]

          // let friend_profile = {};//friend_profiles[key]
          // console.log(friend)
          // console.log(friend_profile)

          // console.log(friend.status)
          // console.log(Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND)
          switch(friend.status){
            case Constant.FRIEND_STATUS_FRIEND:{
              // console.log('1, --' + key)
              
              friend_member.push({...friend, friend_id:key});
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

              friendRequestSent_member.push({...friend, friend_id:key});  
              break
            }
          }
        }

        // console.log(friendRequestSent_member)
        // console.log(friend_member)

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

    _itemOnPress(item, rowId, sectionId){
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
              onPress={this._itemOnPress.bind(this, rowItem, rowId, sectionId)}
              onLongPress={()=>alert("MyProfile onLongPress")}>
              <View
                style={{
                  alignItems: 'center', 
                  padding: 10,
                  borderColor: '#E4E4E4',
                  flexDirection: 'row',
                }}>
                  <TouchableOpacity
                      style={{height:60,
                              width: 60,
                              borderRadius: 10}}>
                      <PlaceHolderFastImage 
                        source={{uri: rowItem.image_url}}
                        style={{width: 60, height: 60, borderRadius: 10, borderWidth:1, borderColor:'gray'}}/>
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
                text: 'Delete',
                backgroundColor: 'red',
                onPress: () => { alert("Delete Click") }
              },{
                text: 'Hide',
                backgroundColor: '#3c33ff',
                onPress: () => { alert("Hide Click") }
              },{
                text: 'Block',
                backgroundColor: '#22ff1a',
                onPress: () => { alert("Block Click") }
              }
            ]

            swipeoutLeft  = [
              {
                component:<View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'rgba(186, 53, 100, 1.0)'}}>
                            <Icon raised color='white'containerStyle={{backgroundColor: '#FF5722'}} name={rowId% 2 === 0 ? 'volume-up': 'volume-mute'} size={40}/>
                          </View>
                ,
                onPress: () => console.log("Do something"),
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
            left={swipeoutLeft}>
          <TouchableOpacity 
            key={ rowId } 
            onPress={this._itemOnPress.bind(this, rowItem, rowId, sectionId)}
            onLongPress={()=>alert("Friend onLongPress")}>
            <View
              style={{
                alignItems: 'center', 
                // margin: 5, 
                padding: 10,
                // borderWidth: 0.5, 
                borderColor: '#E4E4E4',
                flexDirection: 'row',
              }}>
                <TouchableHighlight 
                    style={{}}>
                      <PlaceHolderFastImage 
                        source={{uri:rowItem.profile.image_url}}
                        style={{width: 60, height: 60, borderRadius: 10, borderWidth:1, borderColor:'gray'}}/>
                </TouchableHighlight>
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
                      this.setState({loading:true})
                      this.props.actionUpdateStatusFriend(this.props.uid, rowItem.friend_id, Constant.FRIEND_STATUS_FRIEND, (data)=>{
                        this.setState({loading:false})
                      })
                    }}>
                      <Text style={{color:'green'}}>Accept</Text>
                    </TouchableOpacity>
                  </View>
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
          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 24, 
                              color: DictStyle.colorSet.weakFontColor }}>
              {'^ '}
              </Text>
          </View> */}
          </View>
        )
      }else{

        // console.log(this.loadData()[sectionId].member)

        let member_size = this.loadData()[sectionId].member.length
        if(member_size == 0){
          return ;
        }

        let ic_collapse;
        if(state){
          ic_collapse = <Image
                        style={{width: 20, height: 20}}
                        source={require('../../Images/collapse_down.png')}
                        // resizeMode={FastImage.resizeMode.contain}
                    />
        }else{
          ic_collapse = <Image
                        style={{width: 20, height: 20}}
                        source={require('../../Images/collapse_up.png')}
                        // resizeMode={FastImage.resizeMode.contain}
                    />
        }


        // var friend = this.mockData().filter(function(user) {
        //   // console.log(user.title)

        //   if(user.title.toLocaleLowerCase().localeCompare(section.toLocaleLowerCase()) == 0){
        //     // console.log(Object.keys(user.member).length)
        //     // return Object.keys(user.member).length
        //     return user;
        //   }
        //   return {};
        // })
        // console.log(friend)

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
                {/* <Text style={{ fontSize: 24, 
                                color: DictStyle.colorSet.weakFontColor }}>
                {'^ '}
                </Text> */}
                {ic_collapse}
            </View>
            </View>
        )
      }
    }
    
    _btnPress = () => {
      // console.log(this.ExpandableList);
      this.ExpandableList.setSectionState(0, false);
    };
    
    render() {

      let {
        renderContent
      } = this.state;

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

// const mapDispatchToProps = (dispatch) => {
//   // watchTaskAddEvent(dispatch)
//   // watchTaskChangedEvent(dispatch)
//   // watchTaskRemovedEvent(dispatch)
//   return {actionAcceptFriend}
// }

export default connect(mapStateToProps, actions)(FriendsPage);