import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    AppRegistry,
    Button,
    TouchableHighlight,
    Image
} from 'react-native'
  
import ExpandableList from 'react-native-expandable-section-list'
import DictStyle from './dictStyle'

import Swipeout from 'react-native-swipeout'
import { connect } from 'react-redux';

import { FOREGROUND, BACKGROUND, INACTIVE } from 'redux-enhancer-react-native-appstate';

import * as actions from '../../Actions'
import firebase from 'react-native-firebase';
import { Constants } from 'react-native-navigation';
// import { stat } from 'fs';

import Constant from '../../Utils/Constant'
// import {watchTaskAddEvent, watchTaskChangedEvent, watchTaskRemovedEvent} from '../../Actions'
import ImageWithDefault from '../../Utils/ImageWithDefault'

class FriendsPage extends React.Component{

    constructor(props){
        super(props)
        this.state = {
          renderContent: false,
        }
    }
    
    componentDidMount() {
      setTimeout(() => {this.setState({renderContent: true})}, 0);


      // group_all(v=>{
      //   console.log(v)
      // })
      
      // groupDetail_all(v=>{
      //   console.log(v)
      // })

      // FastImage.preload([
      //   {
      //     uri: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K',
      //     headers: { Authorization: 'someAuthToken' },
      //   }
      // ])
    }

    componentWillReceiveProps(nextProps){
      
      /* 
      check ว่ามี property auth ถ้าไม่มีแสดงข้อมูลอาจผิดพลาดเราจะไม่ทำอะไร
      */
      if(!nextProps.hasOwnProperty('auth')){
        return;
      }

      console.log('componentWillReceiveProps : auth')
      console.log(nextProps)
    }

    loadData=()=>{
        let profile = {
          title: 'Profile',
          member: [
            {
              name: this.props.auth.user.user_profile.profiles.name,
              status: this.props.auth.user.user_profile.profiles.status_message,
              image_url: this.props.auth.user.user_profile.profiles.image_url,
            }
          ]
        }

        // console.log(friend_profiles)
        let friendRequestSent_member = []
        let friend_member = []
        for (var key in this.props.auth.user.user_profile.friends) {
          // console.log()

          let friend =  this.props.auth.user.user_profile.friends[key]

          // let friend_profile = {};//friend_profiles[key]
          // console.log(friend)
          // console.log(friend_profile)

          // console.log(friend.status)
          // console.log(Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND)
          switch(friend.status){
            case Constant.FRIEND_STATUS_FRIEND:{
              // console.log('1, --' + key)
              
              friend_member.push(friend);
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
              // console.log()

              friendRequestSent_member.push(friend);  
              break
            }
          }
        }

        // console.log(friendRequestSent_member)
        // console.log(friend_member)

        let friendRequestSent = {
          title: 'Friend Request Sent',
          member: friendRequestSent_member
        }

        let friends = {title: 'Friends',
          member: friend_member
        }

        // console.log([profile, friends, friendRequestSent])
        return [profile, friendRequestSent, friends];        
    }

    _itemOnPress(rowId, sectionId){
      if(rowId == 0 && sectionId == 0){
        this.props.params.navigation.navigate("MyProfilePage")
      }else{
        this.props.params.navigation.navigate("FriendProfilePage")
      }
    }

    _renderRow = (rowItem, rowId, sectionId) => {

        console.log(rowItem)
        
        if(rowId == 0 && sectionId == 0){
          return (
            <TouchableOpacity 
              key={ rowId } 
              onPress={this._itemOnPress.bind(this, rowId, sectionId)}
              onLongPress={()=>alert("MyProfile onLongPress")}
              >
              <View
                style={{
                  alignItems: 'center', 
                  // margin: 5, 
                  padding: 10,
                  // borderWidth: 0.5, 
                  borderColor: DictStyle.colorSet.lineColor,
                  flexDirection: 'row',
                }}
              >
                  <TouchableOpacity
                      style={{height:60,
                              width: 60,
                              borderRadius: 10}}        
                      >
                      <ImageWithDefault 
                        source={{uri: Constant.API_URL + rowItem.image_url}}
                        style={{width: 60, height: 60, borderRadius: 10}}
                      />
                      
                  </TouchableOpacity>
                  <View>
                    <Text style={{fontSize: 18, 
                                  fontWeight: '600',
                                  color: DictStyle.colorSet.normalFontColor,
                                  paddingLeft: 10, 
                                  paddingBottom:5}}>
                        Name : {rowItem.name}
                    </Text>
                    <Text style={{fontSize: DictStyle.fontSet.mSize, 
                                color: DictStyle.colorSet.normalFontColor,
                                paddingLeft: 10}}>
                        Status : {rowItem.status}
                    </Text>
                  </View>
              </View>
            </TouchableOpacity>
          )
        }

        var swipeoutBtns = [
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

        return (
          <Swipeout 
            style={{backgroundColor:'white'}} 
            right={swipeoutBtns}>
          <TouchableOpacity 
            key={ rowId } 
            onPress={this._itemOnPress.bind(this, rowId, sectionId)}
            onLongPress={()=>alert("Friend onLongPress")}>
            <View
              style={{
                alignItems: 'center', 
                // margin: 5, 
                padding: 10,
                // borderWidth: 0.5, 
                borderColor: DictStyle.colorSet.lineColor,
                flexDirection: 'row',
              }}
            >
                <TouchableHighlight 
                    style={{height:60,
                            width: 60,
                            borderRadius: 10}}        
                    >
                    { /*}
                    <FastImage
                        style={{width: 60, height: 60, borderRadius: 10}}
                        source={{
                        uri: rowItem.profile.image_url === "" ? Constant.DEFAULT_AVATARSOURCE_URI : Constant.API_URL + rowItem.profile.image_url,
                        // uri: 'https://cdn-images-1.medium.com/max/1600/1*-CY5bU4OqiJRox7G00sftw.gif',
                        headers:{ Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}

                        onLoadStart={()=>{
                          console.log('onLoadStart')
                        }}
                        onProgress={e => console.log(e.nativeEvent.loaded / e.nativeEvent.total)}

                        onLoadEnd={()=>{
                          console.log('onLoadEnd')
                        }}
                    />
                    */ }

                      <ImageWithDefault 
                        source={{uri:Constant.API_URL + rowItem.profile.image_url}}
                        style={{width: 60, height: 60, borderRadius: 10}}
                      />
                </TouchableHighlight>
                <View>
                    <Text style={{fontSize: 18, 
                                  fontWeight: '600',
                                  color: DictStyle.colorSet.normalFontColor,
                                  paddingLeft: 10, 
                                  paddingBottom:5}}>
                        Name : {rowItem.profile.name}
                    </Text>
                    <Text style={{fontSize: DictStyle.fontSet.mSize, 
                                color: DictStyle.colorSet.normalFontColor,
                                paddingLeft: 10}}>
                        Status : {rowItem.profile.status}
                    </Text>
                  </View>
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
                      borderBottomColor: DictStyle.colorSet.lineColor }}>
          <View style={{ flexDirection: 'row', 
                        alignItems: 'center'}}>
              <Text style={{ fontSize: DictStyle.fontSet.mSize, 
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
                        borderBottomColor: DictStyle.colorSet.lineColor }}>
            <View style={{ flexDirection: 'row', 
                          alignItems: 'center'}}>
                <Text style={{ fontSize: DictStyle.fontSet.mSize, 
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
      console.log(this.ExpandableList);
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
          {
            renderContent && 
            <ExpandableList
                    ref={instance => this.ExpandableList = instance}
                    dataSource={this.loadData()}
                    headerKey="title"
                    memberKey="member"
                    renderRow={this._renderRow}
                    headerOnPress={(i, state) => console.log(i, state)}
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
    auth:state.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  // watchTaskAddEvent(dispatch)
  // watchTaskChangedEvent(dispatch)
  // watchTaskRemovedEvent(dispatch)
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsPage);