import React from 'react'
import {View, 
        Text, 
        Keyboard, 
        TouchableOpacity, 
        FlatList, 
        ActivityIndicator, 
        TextInput } from 'react-native';

import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
var _ = require('lodash');
import FastImage from 'react-native-fast-image'
import {
  MenuProvider,
  Menu,
  MenuContext,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';

import MyIcon from '../../config/icon-font.js';
import * as actions from '../../actions'
import {randomKey, getHeaderInset, checkInternetDialog} from '../../utils/Helpers'
import Constant from '../../utils/Constant'

import {makeUidState, 
        makeProfileState,
        makeFriendsState,
        makeIsConnectedState} from '../../reselect'

class FindFriendPage extends React.Component{
  static navigationOptions = ({ navigation }) => ({
      title: "Find Friend",
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: 'rgba(186, 53, 100, 1.0)',
        
        // ios navigationoptions underline hide
        borderBottomWidth: 0,

        // android navigationoptions underline hide
        elevation: 0,
        shadowOpacity: 0
      },
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
        friends: [],
        isSearch : false,
      };
  }

  componentDidMount() {
    setTimeout(() => {this.setState({renderContent: true})}, 0);
  }

  search = () => {

    let {is_connected} = this.props

    let text = this.state.text.trim()
    // console.log(text)

    if(text.length == 0){
      alert('Empty?')
      return;
    }

    // Hide that keyboard!
    Keyboard.dismiss()

    this.setState({friends:[]})

    if(!is_connected){
      checkInternetDialog()
      return 
    }


    this.setState({loading:true})
    this.props.actionFindMyID(this.props.uid, 'text', text).then((result) => {
      // console.log(result)  
      this.setState({loading:false})
      if(result.status){
        let {friends} = result.data
        let __ = _.map(friends, (v, k)=> {
                  return {item_id:k, ...v}
                })

        this.setState({friends:__, isSearch:true})

        console.log(__)
      }
    })

    
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: .5,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  addFriend = (item, index) =>{
    let {uid, profile} = this.props
    let {friends} = this.state
    /*
    let {uid, friends} = this.props
    let find_friend = _.find(friends, (v, k)=>{
                        return k == friend_id
                    })

    let chat_id = randomKey()
    if(find_friend){
        chat_id = find_friend.chat_id
    }
    */

    //chat_id

    let chat_id = randomKey()
    if(item.chat_id){
        chat_id = item.chat_id
    }

    let friend_data = {...item, chat_id, status:Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND}

    let user_data = {uid, ...profile, chat_id, status:Constant.FRIEND_STATUS_FRIEND_REQUEST}
  
    console.log(user_data, friend_data)
    this.setState({loading:true})
    this.props.actionInviteFriend(uid, item.uid, user_data, friend_data, (result) => {
        this.setState({loading:false})

        // status:Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND

        let new_friends = [...friends];
        new_friends[index] = {...new_friends[index], status: Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND}
    
        this.setState({friends: new_friends});
    })
  }

  /*
  FRIEND_STATUS_FRIEND: '10',
  FRIEND_STATUS_FRIEND_CANCEL: '13',
  FRIEND_STATUS_FRIEND_CANCEL_FROM_FRIEND: '40', 
  FRIEND_STATUS_FRIEND_REQUEST: '11',
  FRIEND_STATUS_WAIT_FOR_A_FRIEND: '12',
  FRIEND_STATUS_FRIEND_REMOVE: '41',
  FRIEND_STATUS_FRIEND_99:'45',
  */

  showMenu = (item, index)=>{
    console.log(item)

    let {friends} = this.state

    let menuOptions = <View />
    switch(item.status){
      case Constant.FRIEND_STATUS_FRIEND:{
        menuOptions = <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset())}}>
                        <MenuOption onSelect={() => {
                          this.props.navigation.navigate("FriendProfilePage", {'friend_id': item.uid})
                        }}>
                            <Text style={{padding:10, fontSize:18}}>View profile</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => {
                          this.props.navigation.navigate("ChatPage")
                        }}>
                            <Text style={{padding:10, fontSize:18}}>Chat</Text>
                        </MenuOption>
                      </MenuOptions>
        break
      }

      case Constant.FRIEND_STATUS_FRIEND_REQUEST:{
        menuOptions = <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset())}}>
                        <MenuOption onSelect={() => {
                          this.props.navigation.navigate("FriendProfilePage", {'friend_id': item.uid})
                        }}>
                            <Text style={{padding:10, fontSize:18}}>View profile</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => {
                            this.setState({loading:true})
                            this.props.actionUpdateStatusFriend(this.props.uid, item.uid, Constant.FRIEND_STATUS_FRIEND_CANCEL, (result)=>{
                                console.log(result)
                                this.setState({loading:false})

                                let new_friends = [...friends];
                                new_friends[index] = {...new_friends[index], status: Constant.FRIEND_STATUS_FRIEND_CANCEL}
                                this.setState({friends: new_friends});
                            })
                          }}>
                          <Text style={{padding:10, fontSize:18}}>Cancel request</Text>
                        </MenuOption>
                      </MenuOptions>
        break
      }

      case Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND:{
        menuOptions = <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset())}}>
                        <MenuOption onSelect={() => {
                          this.props.navigation.navigate("FriendProfilePage", {'friend_id': item.uid})
                        }}>
                            <Text style={{padding:10, fontSize:18}}>View profile</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => {
                            this.setState({loading:true})
                            this.props.actionUpdateStatusFriend(this.props.uid, item.uid, Constant.FRIEND_STATUS_FRIEND_CANCEL, (result)=>{
                                console.log(result)
                                this.setState({loading:false})



                                let new_friends = [...friends];
                                new_friends[index] = {...new_friends[index], status: Constant.FRIEND_STATUS_FRIEND_CANCEL}
                                this.setState({friends: new_friends});
                            })
                          }}>
                          <Text style={{padding:10, fontSize:18}}>Cancel request</Text>
                        </MenuOption>
                      </MenuOptions>
        break
      }

      // FRIEND_STATUS_FRIEND_CANCEL_FROM_FRIEND
      case 0:
      case Constant.FRIEND_STATUS_FRIEND_CANCEL:
      case Constant.FRIEND_STATUS_FRIEND_CANCEL_FROM_FRIEND: {
        menuOptions = <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset())}}>
                        <MenuOption onSelect={() => {
                          this.props.navigation.navigate("FriendProfilePage", {'friend_id': item.uid})
                        }}>
                            <Text style={{padding:10, fontSize:18}}>View profile</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => {
                            // this.props.navigation.navigate("ChatPage")

                            this.addFriend(item, index)
                          }}>
                          <Text style={{padding:10, fontSize:18}}>Add friend</Text>
                        </MenuOption>
                      </MenuOptions>
        break
      }

      case Constant.FRIEND_STATUS_FRIEND_REMOVE:{
        if(item.is_block){
          menuOptions = <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset())}}>
                          <MenuOption onSelect={() => {
                              this.props.navigation.navigate("FriendProfilePage", {'friend_id': item.uid})
                            }}>
                            <Text style={{padding:10, fontSize:18}}>View profile</Text>
                          </MenuOption>
                          <MenuOption onSelect={() => {
                            // this.props.navigation.navigate("FriendProfilePage", {'friend_id': item.uid})
                            
                            this.setState({loading:true})
                            this.props.actionFriendUnremove_Unblock(this.props.uid, item.uid, (result)=>{
                                console.log(result)
                                this.setState({loading:false})

                                // status:Constant.FRIEND_STATUS_FRIEND

                                let new_friends = [...friends];
                                new_friends[index] = {...new_friends[index], status: Constant.FRIEND_STATUS_FRIEND}
                                this.setState({friends: new_friends});
                            })
                          }}>
                              <Text style={{padding:10, fontSize:18}}>Unblock</Text>
                          </MenuOption>
                          
                        </MenuOptions>
        }else{
          menuOptions = <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset())}}>
                          <MenuOption onSelect={() => {
                              this.props.navigation.navigate("FriendProfilePage", {'friend_id': item.uid})
                            }}>
                            <Text style={{padding:10, fontSize:18}}>View profile</Text>
                          </MenuOption>
                          <MenuOption onSelect={() => {
                            // this.props.navigation.navigate("FriendProfilePage", {'friend_id': item.uid})
                            
                            // this.setState({loading:true})
                            // this.props.actionFriendUnremove_Unblock(this.props.uid, item.uid, (result)=>{
                            //     console.log(result)
                            //     this.setState({loading:false})

                            //     // status:Constant.FRIEND_STATUS_FRIEND

                            //     let new_friends = [...friends];
                            //     new_friends[index] = {...new_friends[index], status: Constant.FRIEND_STATUS_FRIEND}
                            //     this.setState({friends: new_friends});
                            // })

                            this.setState({loading:true})
                            this.props.actionFriendUnremove_Chat(this.props.uid, item.uid, (result)=>{
                                console.log(result)
                                this.setState({loading:false})


                                let new_friends = [...friends];
                                new_friends[index] = {...new_friends[index], status: Constant.FRIEND_STATUS_FRIEND}
                                this.setState({friends: new_friends});

                                this.props.navigation.navigate("ChatPage")
                            })
                          }}>
                              <Text style={{padding:10, fontSize:18}}>Chat</Text>
                          </MenuOption>
                          
                        </MenuOptions>
        }

        
              break
      }
    }

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
                {menuOptions}
              </Menu>
            </View>)
  }

  renderItem = ({item, index}) => {
    console.log(item)
    let {uid} = this.props

    /*
    <Text style={{fontSize: 14,
                        paddingLeft: 5,
                        fontStyle: 'italic',
                        color: 'gray'}}>{item.id}(id) </Text>
    */

    let status = <View />

    switch(item.status){
      case Constant.FRIEND_STATUS_FRIEND:{
        status = <Text style={{fontSize: 14,
                  paddingLeft: 5,
                  fontStyle: 'italic',
                  color: 'gray'}}>Friend</Text>
        break
      }
      case Constant.FRIEND_STATUS_FRIEND_CANCEL_FROM_FRIEND:{
        break
      }
      case Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND:{
        status = <Text style={{fontSize: 14,
                  paddingLeft: 5,
                  fontStyle: 'italic',
                  color: 'gray'}}>Wait friend access</Text>
        break
      }
    }

    return(
      <View
        style={{
          alignItems: 'center', 
          padding: 10,
          flexDirection: 'row',
          backgroundColor: 'white'
        }}>
        <View>
          <TouchableOpacity>
             <FastImage
                  style={{width: 40, 
                          height: 40, 
                          borderRadius: 10, 
                          // borderWidth:.5, 
                          // borderColor:'gray'
                        }}
                  source={{
                    uri: item.image_url,
                    headers:{ Authorization: 'someAuthToken' },
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{fontSize: 18,
                        paddingLeft: 5,
                        fontWeight: 'bold'}}>{item.name} {uid == item.uid ? '(You)' : ''}</Text>
          {status}
        </View>
        {uid == item.uid ? <View /> : this.showMenu(item, index)}
      </View>) 
  }
  
  render() {
      let {renderContent, friends, isSearch} = this.state;
      // console.log(friends)

      let userNotFound = <View />
      if(friends.length == 0 && isSearch){
        userNotFound = <View style={{flex:1, 
                                    backgroundColor: 'white', 
                                    padding:10}}>
                          <Text style={{fontSize:18, color:'gray'}}>User not found.</Text>
                        </View>
      }

      return (
        <MenuContext>
        <View style={{flex:1, backgroundColor: 'white'}}>
          <Spinner
            visible={this.state.loading}
            textContent={'Wait...'}
            textStyle={{color: '#FFF'}}
            overlayColor={'rgba(0,0,0,0.5)'}/>
          <View style={{flexDirection:'row', margin:10}}>
            <TextInput
                style={{flex:1,
                        fontSize: 18, 
                        padding:10, 
                        borderColor:'gray', 
                        borderWidth:.5}}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
                clearButtonMode='while-editing'
                placeholder= "Enter your friend's ID"/>
            <TouchableOpacity 
                style={{paddingLeft:10, 
                        paddingRight:10,
                        marginLeft:10,
                        backgroundColor:'#CE3B6E',
                        justifyContent:'center'}}
                onPress={()=>{
                    this.search()
                }}>
                <Text style={{color:'#C7D8DD', fontWeight:'bold'}}>Search</Text>
            </TouchableOpacity>
          </View>
          {userNotFound}
        {
          renderContent && 
          <FlatList
            data={friends}
            renderItem={this.renderItem}
            keyExtractor={item => item.item_id}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={20}
            initialNumToRender={5}
          />
        }
        </View>
        </MenuContext>
      );
  }
}

const mapStateToProps = (state, ownProps) => {
  if(!state._persist.rehydrated){
    return {}
  }

  if(!state.auth.isLogin){
    return;
  }

  return({
    uid: makeUidState(state, ownProps),
    profile: makeProfileState(state, ownProps),
    friends: makeFriendsState(state, ownProps),
    is_connected: makeIsConnectedState(state, ownProps),
  })
}

export default connect(mapStateToProps, actions)(FindFriendPage);