import React from 'react'
import {View, 
        Text, 
        SafeAreaView,
        Keyboard,
        TouchableOpacity,
        TextInput} from 'react-native'
import { connect } from 'react-redux';
import ExpandableList from 'react-native-expandable-section-flatlist'
var _ = require('lodash');


import * as actions from '../../actions'
import FastImage from 'react-native-fast-image'
import MyIcon from '../../config/icon-font.js';
import {isEmpty} from '../../utils/Helpers'

import {makeClasssState,
        makeClassMembersState,
        makeGroupsState,
        makeGroupProfilesState,
        makeGroupMembersState,
        makeFriendsState,
        makeFriendProfilesState,} from '../../reselect'

// https://stackoverflow.com/questions/43309879/search-in-object-react
class ContactsSearch extends React.Component{

  static navigationOptions = ({ navigation }) => {
    return {
        title: "Search",
        headerTintColor: '#C7D8DD',
        headerStyle: {
            backgroundColor: 'rgba(186, 53, 100, 1.0)',
            // ios navigationoptions underline hide
            borderBottomWidth: 0,

            // android navigationoptions underline hide
            elevation: 0,
            shadowOpacity: 0
        },
    }
  }

  constructor(props){
    super(props)

    this.state = {
      text:'',
      data: []
    };
  }

  componentDidMount(){
    let tabFriends = []
    let tabGroups = []
    let tabClasss = []

    this.setState({
      data: [{title: 'Friends',member: tabFriends}, {title: 'Groups', member: tabGroups}, {title: 'Classs', member: tabClasss}]
    })
  }

  handleSearch = () => {
    let text = this.state.text.trim()

    // Hide that keyboard!
    Keyboard.dismiss()

    console.log('text', text)

    if(isEmpty(text)){
      alert("Empty key search")
    }

    let {friends, friend_profiles, group_profiles, classs} = this.props

    
    // let _friends =_.filter(friends,function(v, k) { 
    //                 if(v.change_friend_name){
    //                   console.log(v.change_friend_name.toLowerCase().includes(text.toLowerCase()))
    //                   return v.change_friend_name.toLowerCase().includes(text.toLowerCase())
    //                 }
    //                 return;
    //               }).map((vv, kk)=>{
    //                 return {vv, kk};
    //               });

    // ---------------------  tabFriends
    let _friends= []
    _.map(friends, (v, k)=>{
      if(v.change_friend_name){
        if(v.change_friend_name.toLowerCase().includes(text.toLowerCase())){
          _friends.push(k)
        }
      }
    })

    _.map(friend_profiles, (v, k)=>{
      if(v.name){
        if(v.name.toLowerCase().includes(text.toLowerCase())){
          _friends.push(k)
        }
      }
      if(v.status_message){
        if(v.name.toLowerCase().includes(text.toLowerCase())){
          _friends.push(k)
        }
      }
    })

    // Removing duplicate array values
    const new_friends = _friends.filter(function(elem, pos) {
                          return _friends.indexOf(elem) == pos;
                        }); 

    let tabFriends = []
    _.map(new_friends, (v, k)=>{
      let _f  =_.find(friends, (fv, fk)=>{
                return v == fk
              })
      if(_f){
        let _fp =_.find(friend_profiles, (fv, fk)=>{
                  return v == fk
                })
        tabFriends.push({friend_id:v, ..._f, profile:_fp}) 
      }
    })
    // ---------------------  tabFriends

    // ---------------------  tabGroups

    let tabGroups= []
    _.map(group_profiles, (v, k)=>{
      if(v.name){
        if(v.name.toLowerCase().includes(text.toLowerCase())){
        // if(v.change_friend_name.toLowerCase().includes(text.toLowerCase())){
          tabGroups.push({...v, group_id:k})
        }
      }
    })
    
    // ---------------------  tabGroups

    // ---------------------  tabClasss
    // let tabClasss= []
    let tabClasss = _.filter(classs,  function(v, k) { 
      return v.name.toLowerCase().includes(text.toLowerCase())
    })
    // ---------------------  tabClasss

    let data = [{title: 'Tab Friends',member: tabFriends}, {title: 'Tab Groups', member: tabGroups}, {title: 'Tab Classs', member: tabClasss}]
    this.setState({data})

    /*
    let friends = this.props.auth.users.friends
    let classs = this.props.auth.users.classs
    let groups = this.props.auth.users.groups

    console.log(friends)
    let tabFriends = _.filter(friends,  function(v, k) { 
      return v.profile.name.toLowerCase().includes(text.toLowerCase())
    })

    let tabClasss = _.filter(classs,  function(v, k) { 
      return v.name.toLowerCase().includes(text.toLowerCase())
    })

    let tabGroups = _.filter(groups,  function(v, k) { 
      return v.group_profile.name.toLowerCase().includes(text.toLowerCase())
    })

    let data = [{title: 'Tab Friends',member: tabFriends}, {title: 'Tab Groups', member: tabGroups}, {title: 'Tab Classs', member: tabClasss}]
    
    // console.log(data)
    if(tabFriends.length == 0 && tabClasss.length == 0 && tabGroups.length == 0){
      alert("Empty result")
    }else{
      this.setState({
        data
      })
    }
    */
  }

  onHide(results){
    console.log("onHide")

    // console.log(this)
    // navigation.goBack()

    this.props.navigation.goBack()
  }

  _renderSection = (section, sectionId, state)  => {
    let {data} = this.state

    let m_length = data[sectionId].member.length
    if(m_length == 0){
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
                    // borderBottomColor: DictStyle.colorSet.lineColor 
                  }}>
        <View style={{ flexDirection: 'row', 
                    alignItems: 'center'}}>
            <Text style={{ 
                          // fontSize: DictStyle.fontSet.mSize, 
                            color: 'gray',
                            paddingLeft: 10,
                            fontWeight:'700' }}>
            {section + "(" + m_length +")"}
            </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {ic_collapse}
        </View>
        </View>
    )
  }

  _renderRow = (rowItem, rowId, sectionId) => {
    switch(sectionId){
      case 0: {
        return( 
          <TouchableOpacity
            onPress={()=>{
              // console.log(rowItem)
              // let friend_id = _.findKey(this.props.auth.users.friends,  function(v, k) { 
              //   return v.chat_id == rowItem.chat_id
              // })
              // if(friend_id !== undefined){
              //   this.props.navigation.navigate("FriendProfilePage",{'friend_id': friend_id})
              // }

              this.props.navigation.navigate("FriendProfilePage",{'friend_id': rowItem.friend_id})
            }}>
            <View style={{flex:1, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                <FastImage
                  style={{width: 50, 
                          height: 50, 
                          borderRadius: 10, 
                          // borderWidth:.5, 
                          // borderColor:'gray'
                        }}
                  source={{
                    uri: rowItem.profile.image_url,
                    headers:{ Authorization: 'someAuthToken' },
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                <Text style={{fontSize:18}}>{rowItem.profile.name}</Text>
              </View>
            </View>
          </TouchableOpacity>)
      }
      case 1: {
        return( 
          <TouchableOpacity
            onPress={()=>{

              // console.log(rowItem)
              // let group_id = _.findKey(this.props.auth.users.groups,  function(v, k) { 
              //   return v.item_id == rowItem.item_id
              // })
              // if(group_id !== undefined){
              //   this.props.navigation.navigate("ManageGroupPage",{'group_id': group_id})
              // }

              this.props.navigation.navigate("ManageGroupPage",{'group_id': rowItem.group_id})
            }}>
          <View style={{flex:1, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                  <FastImage
                    style={{width: 50, 
                            height: 50, 
                            borderRadius: 10, 
                            // borderWidth:.5, 
                            // borderColor:'gray'
                          }}
                    source={{
                      uri: rowItem.image_url,
                      headers:{ Authorization: 'someAuthToken' },
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
            <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
              <Text style={{fontSize:18}}>{rowItem.name}</Text>
            </View>
          </View>
          </TouchableOpacity>)
      }

      case 2:{
        return( 
          <TouchableOpacity
            onPress={()=>{
              // console.log(rowItem)
              // this.props.navigation.navigate("ManageClasssPage", {'data': rowItem})
            }}>
          <View style={{flex:1, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
              <FastImage
                style={{width: 50, 
                        height: 50, 
                        borderRadius: 10, 
                        // borderWidth:.5, 
                        // borderColor:'gray'
                      }}
                source={{
                  uri: rowItem.image_url,
                  headers:{ Authorization: 'someAuthToken' },
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
              <Text style={{fontSize:18}}>{rowItem.name}</Text>
            </View>
          </View>
          </TouchableOpacity>)
      }
    }
  }

  render(){
      let {results} = this.state
      return(<SafeAreaView style={{flex:1}}>
              <View style={{flex:1, margin:10}}>
                  <View style={{flexDirection:'row'}}>
                      <TextInput
                          style={{ flex:1,fontSize: 22, padding:10, borderColor:'gray', borderWidth:.5}}
                          onChangeText={(text) => this.setState({text})}
                          value={this.state.text}
                          clearButtonMode='while-editing'
                          // maxLength={30}
                          placeholder= 'search friend, group, class'
                          // editable={this.state.data.length -1 == 10?false:true} 
                      />
                      <TouchableOpacity 
                          style={{paddingLeft:10, 
                                  paddingRight:10,
                                  marginLeft:10,
                                  // backgroundColor:this.state.data.length -1 == 10?'gray':'red',
                                  backgroundColor:'#CE3B6E',
                                  justifyContent:'center'}}
                          onPress={()=>{
                              this.handleSearch()
                          }}
                          // disabled={this.state.data.length -1 == 10? true:false}
                          >
                          <Text style={{color:'#C7D8DD', fontWeight:'bold'}}>Search</Text>
                      </TouchableOpacity>
                  </View>
                  <View style={{marginTop:10, flex:1}}>
                    <ExpandableList
                        style={{flex:1}}
                        ref={instance => this.ExpandableList = instance}
                        dataSource={this.state.data}
                        headerKey="title"
                        memberKey="member"
                        renderRow={this._renderRow}
                        headerOnPress={(i, state) => {
                        } }
                        renderSectionHeaderX={this._renderSection}
                        openOptions={[0, 1, 2]}
                        removeClippedSubviews={false}
                    />
                  </View>
              </View>
            </SafeAreaView>)
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
    // auth:state.auth,

    friends:makeFriendsState(state, ownProps),
    friend_profiles:makeFriendProfilesState(state, ownProps),
    groups:makeGroupsState(state, ownProps),
    group_profiles:makeGroupProfilesState(state, ownProps),
    group_members:makeGroupMembersState(state, ownProps),
    classs:makeClasssState(state, ownProps),
    class_members:makeClassMembersState(state, ownProps),
  }
}

export default connect(mapStateToProps, actions)(ContactsSearch);