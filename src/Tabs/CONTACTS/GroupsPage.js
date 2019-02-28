import React from 'react'
import {View, 
        Alert, 
        Text, 
        TouchableOpacity} from 'react-native'
import ExpandableList from 'react-native-expandable-section-flatlist'
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
var _ = require('lodash');

import {
  MenuProvider,
  Menu,
  MenuContext,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import ActionButton from 'react-native-action-button';

import Constant from '../../Utils/Constant'
import * as actions from '../../Actions'
import {getUid, getHeaderInset} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';

class GroupsPage extends React.Component{
    constructor(props) {
      super(props);
  
      this.state = {
        renderContent: false,
        loading: false,
        data: [],
        page: 1,
        seed: 1,
        error: null,
        // refreshing: false,

        sectionID: null,
        rowID: null,

        favorites:[],
        invited:[],
        groups:[]
      };
    }

    // invited you to group
    componentDidMount() {
      // setTimeout(() => {this.setState({renderContent: true})}, 0);
      this.setState({
        error: null,
        loading: false,
      });   
      
      this.loadData(this.props)
    }

    componentWillReceiveProps(nextProps) {    
      this.loadData(nextProps)
    }

    loadData=(props)=>{
      // console.log(groups)
      let {groups} = props

      console.log(groups)

      let group_invited = []
      let group_joined = []
      let group_favorites = []
      for (var key in groups) {
        let group = groups[key]
        switch(group.status){ // GROUP_STATUS_MEMBER_INVITED
          case Constant.GROUP_STATUS_MEMBER_INVITED:{
            group_invited.push({...group, group_id:key})
            break;
          }
          case Constant.GROUP_STATUS_MEMBER_JOINED:{
            group_joined.push({...group, group_id:key})

            if(group.is_favorites !== undefined && group.is_favorites){
              group_favorites.push({...group, group_id:key})
            }
            break;
          }
        }
      }

      this.setState({
        favorites: {
          title: 'Favorites',
          member:group_favorites
        },
        invited: {
          title: 'Groups invitations',
          member:group_invited
        },
        groups: {
          title:'Groups',
          member: group_joined
        },
        renderContent: true,
      })
    }

    countMembers = (members) =>{
      return (_.filter(members, (v, k)=>{
                return v.status === Constant.GROUP_STATUS_MEMBER_JOINED
              })).length
    }

    /* 
    
    let is_favorites = true;
    if(group.is_favorites !== undefined){
        is_favorites = !group.is_favorites
    }
    this.setState({loading:true})
    this.props.actionFavoritesGroup(this.props.uid, group_id, is_favorites, (result) => {
        // console.log(result)
        this.setState({loading:false})
    })
    */

    favorites = (group_id, status) =>{
      this.setState({loading:true})
      this.props.actionFavoritesGroup(this.props.uid, group_id, status, (result) => {
          this.setState({loading:false})
      })
    }

    showMenuInvited = (rowItem)=>{
      let {uid} = this.props
      let {members, group_id} = rowItem

      let member_key = _.findKey(members,  function(v, k) { 
        return v.friend_id == uid
      })

      return( <View style={{flex:1,position:'absolute', right:0, marginRight:10}}>
                <Menu>
                  <MenuTrigger>
                      <MyIcon 
                          style={{padding:10}}
                          name={'dot-horizontal'}
                          size={15}
                          color={'gray'} />  
                  </MenuTrigger>
                  <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset() + 50)}}>
                      <MenuOption onSelect={() => {
                            
                            if(member_key !== undefined){
                              this.setState({loading:true})
                              this.props.actionMemberJoinGroup(uid, group_id, member_key, (result) => {
                                console.log(result)
                                setTimeout(() => {
                                  this.setState({loading:false})
                                }, 200);
                              })
                            }else{
                              console.log(member_key)
                            }
                          }}>
                          <Text style={{padding:10, fontSize:18}}>Join</Text>
                      </MenuOption>
                      <MenuOption onSelect={() => {
                            if(member_key !== undefined){
                              this.setState({loading:true})
                              this.props.actionMemberDeclineGroup(uid, group_id, member_key, (result) => {
                                setTimeout(() => {
                                  this.setState({loading:false})
                                }, 200);
                              })
                            }else{
                              console.log(member_key)
                            }
                          }}>
                          <Text style={{padding:10, fontSize:18}}>Decline</Text>
                      </MenuOption>
                  </MenuOptions>
              </Menu>
            </View>)
    }

    showMenuGroup = (rowItem)=>{
      let {members, group_id, item_id} = rowItem
      let {uid} = this.props

      var member = _.find(members, function(item, key) {
        return item.friend_id == uid
      })

      return( <View style={{flex:1,
                            position:'absolute', 
                            top:0,
                            right:0, 
                            marginRight:10,}}>
                <Menu>
                  <MenuTrigger>
                      <MyIcon 
                          style={{padding:10}}
                          name={'dot-horizontal'}
                          size={15}
                          color={'gray'} />  
                  </MenuTrigger>
                  <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset() + 50)}}>
                      <MenuOption onSelect={() => {
                        // if(member !== undefined){
                        //   // console.log(rowItem, member)
                        //   this.setState({loading:true})
                        //   this.props.actionMemberLeaveGroup(uid, group_id, item_id, (result) => {
                        //     console.log(result)
                        //     setTimeout(() => {
                        //       this.setState({loading:false})
                        //     }, 200);
                        //   })
                        // }else{
                        //   console.log(member)
                        // }

                        this.props.params.navigation.navigate("ChatPage")
                      }}>
                          <Text style={{padding:10, fontSize:18}}>Group Chat</Text>
                      </MenuOption>

                      {rowItem.is_favorites ? <MenuOption onSelect={() => {this.favorites(group_id, false)}}>
                                                  <Text style={{padding:10, fontSize:18}}>Unfavorites</Text>
                                              </MenuOption>:
                                              <MenuOption onSelect={() => {this.favorites(group_id, true)}}>
                                                  <Text style={{padding:10, fontSize:18}}>Favorites</Text>
                                              </MenuOption>
                      }
                  </MenuOptions>
              </Menu>
            </View>)
    }

    actionAddGroup = () =>{
      return(<ActionButton 
        buttonColor="rgba(231,76,60,1)"
        offsetX={10} 
        offsetY={10}
        hideShadow={true}
        renderIcon={() => {
            return(<MyIcon
                name={'plus'}
                size={25}
                color={'#C7D8DD'} />)
            }}
        onPress={()=>{
            this.props.params.navigation.navigate("AddGroupsPage")
        }} />)
    }

    _renderSection = (section, sectionId, state)  => {
      let member_size = 0
      switch(sectionId){
        case 0:{
          let {favorites} = this.state
          member_size = favorites.member.length
          if(member_size == 0){
            return;
          }
          break;
        }
        case 1:{
          let {invited} = this.state
          member_size = invited.member.length
          if(member_size == 0){
            return;
          }
          break;
        }
        case 2:{
          let {groups} = this.state
          member_size = groups.member.length
          if(member_size == 0){
            return;
          }
          break;
        }
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

    _renderRow = (rowItem, rowId, sectionId) => {
      // console.log(rowItem)
      switch(sectionId){
        // favorites
        case 0:{
          break;
        }

        // invited
        case 1:{
          return(<TouchableOpacity 
                    key={rowItem.item_id} 
                    onPress={() => {
                      this.props.params.navigation.navigate("ManageGroupPage", {'group_id': rowItem.group_id}) 
                    }}>
                    <View
                      style={{
                        alignItems: 'center', 
                        padding: 10,
                        flexDirection: 'row',
                      }}>
                        <TouchableOpacity
                          // style={{width: 80, height: 80, borderRadius: 40}}
                          onPress={() => {
                            this.props.params.navigation.navigate("ManageGroupPage", {'group_id': rowItem.group_id}) 
                          }}>
                          <FastImage
                              style={{width: 50, height: 50, borderRadius: 25, borderWidth:.5, borderColor:'gray'}}
                              source={{
                                uri: rowItem.group_profile.image_url,
                                headers:{ Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                              }}
                              resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                        <View style={{paddingLeft: 10}}>
                          <Text style={{fontSize: 18, 
                                        fontWeight: '600', 
                                        paddingBottom:5
                                      }}>
                              {rowItem.group_profile.name} { rowItem.group_profile.members === undefined ? '' : "(" + Object.keys(rowItem.group_profile.members).length +")" }
                          </Text>
                        </View>
                        {this.showMenuInvited(rowItem)} 
                    </View>
                  </TouchableOpacity>)
        }

        // groups
        case 2:{

          break;
        }
      }
      
      return(
          <TouchableOpacity 
            key={rowItem.item_id} 
            onPress={() => {
              this.props.params.navigation.navigate("ManageGroupPage", {'group_id': rowItem.group_id}) 
            }}>
            <View
              style={{
                alignItems: 'center', 
                padding: 10,
                flexDirection: 'row',
                // backgroundColor: 'red'
              }}>
                <TouchableOpacity
                  // style={{width: 80, height: 80, borderRadius: 40}}
                  onPress={() => {
                    this.props.params.navigation.navigate("ManageGroupPage", {'group_id': rowItem.group_id}) 
                  }}>
                  <FastImage
                      style={{width: 50, height: 50, borderRadius: 25, borderWidth:.5, borderColor:'gray'}}
                      source={{
                        uri: rowItem.group_profile.image_url,
                        headers:{ Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                </TouchableOpacity>
                <View style={{paddingLeft: 10}}>
                  <Text style={{fontSize: 18, 
                                fontWeight: '600', 
                                paddingBottom:5
                              }}>
                      {rowItem.group_profile.name} { rowItem.members === undefined ? '' : "(" + this.countMembers(rowItem.members) /*Object.keys(rowItem.members).length*/ +")" }
                  </Text>
                </View>
                {this.showMenuGroup(rowItem)} 
            </View>
          </TouchableOpacity>
      )
    }
  
    render() {
      let {favorites, invited, groups, renderContent} = this.state

      if(!renderContent){
        return <View style={{flex: 1}}></View>
      }

      if(favorites.member.length == 0 && invited.member.length == 0 && groups.member.length == 0){
        return  <View style={{flex: 1}}>
                  <Text>Empty Group</Text>
                  {this.actionAddGroup()}
                </View>
      }

      let data = [favorites, invited, groups]
      console.log(data)
      return (
        <MenuContext>
        <View style={{flex:1}}>
        <Spinner
          visible={this.state.loading}
          textContent={'Wait...'}
          textStyle={{color: '#FFF'}}
          overlayColor={'rgba(0,0,0,0.5)'}
        />
        {
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
              openOptions={[0, 1, 2, 3]}
              // onScroll={this.props.handleScroll}
            />
        }
        {this.actionAddGroup()}
        </View>
        </MenuContext>
      );
    }
}

const mapStateToProps = (state) => {
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
    uid:getUid(state),
    groups:state.auth.users.groups
  }
}

export default connect(mapStateToProps, actions)(GroupsPage);