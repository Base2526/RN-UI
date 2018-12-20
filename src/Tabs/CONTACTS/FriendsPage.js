import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    AppRegistry,
    Button,
    Image,
    TouchableHighlight
} from 'react-native'
  
import ExpandableList from 'react-native-expandable-section-list'
import DictStyle from './dictStyle'
import FastImage from 'react-native-fast-image'
import Swipeout from 'react-native-swipeout'
import { connect } from 'react-redux';

import * as actions from '../../Actions'

class FriendsPage extends React.Component{

    constructor(props){
        super(props)

        this.state = {
          renderContent: false,
        }
    }
    
    componentDidMount() {
      setTimeout(() => {this.setState({renderContent: true})}, 0);
    
      // console.log(this.props.profile)
      // console.log(this.props.friends)
    }

    loadData=()=>{
      /*
        let profile = {
          title: 'Profile',
          member: [
            {
              title: this.props.profile.name,
              status: this.props.profile.status_message,
              image_url: this.props.profile.image_url,
            }
          ]
        }

        let friends = {title: 'Friends',
                        member: [
                         
                          {
                            title: 'Friend name',
                            status: 'test'
                          },
                          {
                            title: 'Friend name',
                            status: 'test'
                          },
                          {
                            title: 'Friend name',
                            status: 'test'
                          },
                          {
                            title: 'Friend name',
                            status: 'test'
                          }
                        ]}

        // console.log([profile, friends])
        return [profile, friends];
        */

        return( [
            {
              title: 'Profile',
              member: [
                {
                  title: "Name",
                  status: 'test'
                }
              ]
            },
            {
              title: 'Groups',
              member: [
                {
                  title: 'Group name',
                  status: 'test'
                },
                {
                  title: 'Group name',
                  status: 'test'
                }
              ]
            },
            {
              title: 'Friends',
              member: [
                {
                  title: 'Friend name',
                  status: 'test'
                },
                {
                  title: 'Friend name',
                  status: 'test'
                },
                {
                  title: 'Friend name',
                  status: 'test'
                },
                {
                  title: 'Friend name',
                  status: 'test'
                }
              ]
            },
            {
              title: 'Friend Request Sent',
              member: [
                {
                  title: 'Friend name',
                  status: 'test'
                },
                {
                  title: 'Friend name',
                  status: 'test'
                },
                {
                  title: 'Friend name',
                  status: 'test'
                },
              ]
            }
          ])
    }

    _itemOnPress(rowId, sectionId){
      if(rowId == 0 && sectionId == 0){
        this.props.params.navigation.navigate("MyProfilePage")
      }else{
        this.props.params.navigation.navigate("FriendProfilePage")
      }
    }

    _renderRow = (rowItem, rowId, sectionId) => {
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
                  <TouchableHighlight 
                      style={{height:60,
                              width: 60,
                              borderRadius: 10}}        
                      >
                      <FastImage
                          style={{width: 60, height: 60, borderRadius: 10}}
                          source={{
                            uri: 'https://unsplash.it/400/400?image=1',
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                      />
                  </TouchableHighlight>
                  <View>
                    <Text style={{fontSize: 18, 
                                  fontWeight: '600',
                                  color: DictStyle.colorSet.normalFontColor,
                                  paddingLeft: 10, 
                                  paddingBottom:5}}>
                        Name : {rowItem.title}
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
                    <FastImage
                        style={{width: 60, height: 60, borderRadius: 10}}
                        source={{
                        uri: 'https://unsplash.it/400/400?image=1',
                        headers:{ Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </TouchableHighlight>
                <View>
                    <Text style={{fontSize: 18, 
                                  fontWeight: '600',
                                  color: DictStyle.colorSet.normalFontColor,
                                  paddingLeft: 10, 
                                  paddingBottom:5}}>
                        Name : {rowItem.title}
                    </Text>
                    <Text style={{fontSize: DictStyle.fontSet.mSize, 
                                color: DictStyle.colorSet.normalFontColor,
                                paddingLeft: 10}}>
                        Status : {rowItem.status}
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
        let ic_collapse;
        if(state){
          ic_collapse = <FastImage
                        style={{width: 20, height: 20}}
                        source={require('../../Images/collapse_down.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    />
        }else{
          ic_collapse = <FastImage
                        style={{width: 20, height: 20}}
                        source={require('../../Images/collapse_up.png')}
                        resizeMode={FastImage.resizeMode.contain}
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
                {section + "(4)"}
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

  // if(state.auth === null){
  //   return {}
  // }
  return ({})
  // return({
  //     profile:state.auth.user.user_profile.profiles,
  //     friends:state.auth.user.user_profile.friends,
  // })
}

export default connect(mapStateToProps, actions)(FriendsPage);