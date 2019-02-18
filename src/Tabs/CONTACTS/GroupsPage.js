import React from 'react'
import {View, 
        Alert, 
        Text, 
        TouchableOpacity} from 'react-native'
import ExpandableList from 'react-native-expandable-section-flatlist'
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import Swipeout from 'react-native-swipeout'
import Spinner from 'react-native-loading-spinner-overlay';
var _ = require('lodash');

import Constant from '../../Utils/Constant'
import * as actions from '../../Actions'
import {getUid} from '../../Utils/Helpers'
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

   
    
    renderItem = ({item, index}) => { 
      // console.log(index)
      let swipeoutRight = [{component:<View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{fontWeight:'bold', color:'white', fontSize:16, textAlign:'center'}}>DELETE GROUP</Text>
                                      </View>,
                            backgroundColor: 'blue',
                              onPress: () => { 
                                Alert.alert(
                                  '',
                                  'การลบกลุ่มจะลบได้เฉพาะตอนเทสระบบเท่านั้น',
                                  [
                                  //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                    {text: 'Cancel', onPress: () => {

                                    }, style: 'cancel'},
                                    {text: 'OK', onPress: () => {
                                      console.log(item) // group_id

                                      // this.setState({loading:true})
                                      // this.props.actionDeleteGroup(this.props.uid, item.group_id, (result) => {
                                      //   console.log(result)

                                      //   this.setState({loading:false})
                                      // })
                                    }},
                                  ],
                                  { cancelable: false }
                                )
                              }
                            },{
                            component:<View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{fontWeight:'bold', color:'white', fontSize:16, textAlign:'center'}}>LEAVE GROUP</Text>
                                      </View>,
                            backgroundColor: 'red',
                            onPress: () => { 
                              Alert.alert(
                                '',
                                'If you leave this group, you\'ll no longer be able to see its member list or chat history Continue?',
                                [
                                //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                                ],
                                { cancelable: false }
                              )
                            }
                          }]

      return(
        <Swipeout 
          style={{backgroundColor:'white'}} 
          right={swipeoutRight}
          rowID={index}
          sectionID={0}
          onOpen={(sectionId, rowId) => {
            this.setState({
              sectionID: sectionId,
              rowID: rowId,
            })
          }}
          close={!(this.state.rowID === index)}
          >
          <TouchableOpacity 
            key={item.item_id} 
            onPress={() => {
              this.props.params.navigation.navigate("ManageGroupPage", {'group_id': item.group_id}) 
            }}>
            <View
              style={{
                alignItems: 'center', 
                padding: 10,
                flexDirection: 'row'
              }}>
                <TouchableOpacity
                  style={{width: 80, height: 80, borderRadius: 40}}
                  onPress={() => {
                    this.props.params.navigation.navigate("ManageGroupPage", {'group_id': item.group_id}) 
                  }}>
                  <FastImage
                      style={{width: 80, height: 80, borderRadius: 40, borderWidth:.5, borderColor:'gray'}}
                      source={{
                        uri: item.group_profile.image_url,
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
                      {item.group_profile.name} ({ Object.keys(item.members).length})
                  </Text>
                </View>
            </View>
          </TouchableOpacity>
      </Swipeout>)
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
                        flexDirection: 'row'
                      }}>
                        <TouchableOpacity
                          style={{width: 80, height: 80, borderRadius: 40}}
                          onPress={() => {
                            this.props.params.navigation.navigate("ManageGroupPage", {'group_id': rowItem.group_id}) 
                          }}>
                          <FastImage
                              style={{width: 80, height: 80, borderRadius: 40, borderWidth:.5, borderColor:'gray'}}
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
                    </View>
                  
                    <View style={{flexDirection:'row', position:'absolute', right:0, bottom:0, margin:5, }}>
                      <TouchableOpacity
                        style={{padding:5, 
                                borderColor:'green', 
                                borderRadius:10, 
                                borderWidth:.5,
                                marginRight:5}}
                        onPress={()=>{
                          let members = rowItem.members
                          let uid = this.props.uid
                          var member = _.find(members, function(item, key) {
                            return item.friend_id == uid
                          })
                          // console.log(members)
                          if(member !== undefined){
                            // console.log(member)
                            this.setState({loading:true})
                            this.props.actionMemberJoinGroup(this.props.uid, rowItem.group_id, rowItem.item_id, (result) => {
                              console.log(result)
                              setTimeout(() => {
                                this.setState({loading:false})
                              }, 200);
                            })
                          }else{
                            console.log(member)
                          }
                        }}>
                        <Text style={{color:'green'}}>Join</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{padding:5, 
                                borderColor:'red', 
                                borderRadius:10, 
                                borderWidth:.5}}
                        onPress={()=>{
                          let members = rowItem.members
                          
                          let uid = this.props.uid
                          var member = _.find(members, function(item, key) {
                            return item.friend_id == uid
                          })

                          if(member !== undefined){
                            this.setState({loading:true})
                            this.props.actionMemberDeclineGroup(this.props.uid, rowItem.group_id, rowItem.item_id, (result) => {
                              setTimeout(() => {
                                this.setState({loading:false})
                              }, 200);
                            })
                          }else{
                            console.log(member)
                          }
                        }}>
                        <Text style={{color:'red'}}>Decline</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>)
        }

        // groups
        case 2:{

          break;
        }
      }
      
      let swipeoutRight = [{component:<View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{fontWeight:'bold', color:'white', fontSize:16, textAlign:'center'}}>DELETE GROUP</Text>
                                      </View>,
                            backgroundColor: 'blue',
                              onPress: () => { 
                                Alert.alert(
                                  '',
                                  'การลบกลุ่มจะลบได้เฉพาะตอนเทสระบบเท่านั้น',
                                  [
                                  //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                    {text: 'Cancel', onPress: () => {

                                    }, style: 'cancel'},
                                    {text: 'OK', onPress: () => {
                                      console.log(rowItem) // group_id

                                      this.setState({loading:true})
                                      this.props.actionDeleteGroup(this.props.uid, rowItem.group_id, (result) => {
                                        console.log(result)

                                        this.setState({loading:false})
                                      })
                                    }},
                                  ],
                                  { cancelable: false }
                                )
                              }
                            },{
                            component:<View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{fontWeight:'bold', color:'white', fontSize:16, textAlign:'center'}}>LEAVE GROUP</Text>
                                      </View>,
                            backgroundColor: 'red',
                            onPress: () => { 
                              Alert.alert(
                                '',
                                'If you leave this group, you\'ll no longer be able to see its member list or chat history Continue?',
                                [
                                //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                  {text: 'OK', onPress: () => {
                                    
                                    let members = rowItem.members
                                    let uid = this.props.uid
                                    var member = _.find(members, function(item, key) {
                                      return item.friend_id == uid
                                    })
                                    // console.log(members)
                                    if(member !== undefined){
                                      // console.log(rowItem)
                                      this.setState({loading:true})
                                      this.props.actionMemberLeaveGroup(this.props.uid, rowItem.group_id, rowItem.item_id, (result) => {
                                        console.log(result)
                                        setTimeout(() => {
                                          this.setState({loading:false})
                                        }, 200);
                                      })
                                    }else{
                                      console.log(member)
                                    }
                                  }},
                                ],
                                { cancelable: false }
                              )
                            }
                          }]

      return(
        <Swipeout 
          style={{backgroundColor:'white'}} 
          right={swipeoutRight}
          rowID={rowId}
          sectionID={0}
          onOpen={(sectionId, rowId) => {
            this.setState({
              sectionID: sectionId,
              rowID: rowId,
            })
          }}
          close={!(this.state.rowID === rowId)}
          >
          <TouchableOpacity 
            key={rowItem.item_id} 
            onPress={() => {
              this.props.params.navigation.navigate("ManageGroupPage", {'group_id': rowItem.group_id}) 
            }}>
            <View
              style={{
                alignItems: 'center', 
                padding: 10,
                flexDirection: 'row'
              }}>
                <TouchableOpacity
                  style={{width: 80, height: 80, borderRadius: 40}}
                  onPress={() => {
                    this.props.params.navigation.navigate("ManageGroupPage", {'group_id': rowItem.group_id}) 
                  }}>
                  <FastImage
                      style={{width: 80, height: 80, borderRadius: 40, borderWidth:.5, borderColor:'gray'}}
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
                      {rowItem.group_profile.name} { rowItem.members === undefined ? '' : "(" + Object.keys(rowItem.members).length +")" }
                  </Text>
                </View>
            </View>
          </TouchableOpacity>
      </Swipeout>)

    }
  
    render() {
      let {favorites, invited, groups, renderContent} = this.state

      if(!renderContent){
        return <View style={{flex: 1}}></View>
      }

      if(favorites.member.length == 0 && invited.member.length == 0 && groups.member.length == 0){
        return <View style={{flex: 1}}><Text>Empty Group</Text></View>
      }

      let data = [favorites, invited, groups]
      return (
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
        </View>
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

  // groups
  return{
    uid:getUid(state),
    // auth:state.auth
    groups:state.auth.users.groups
  }
}

export default connect(mapStateToProps, actions)(GroupsPage);