import React from 'react'
import {View, 
        Text, 
        FlatList,
        TouchableOpacity} from 'react-native'

import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image'

import {
  MenuProvider,
  Menu,
  MenuContext,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';

var _ = require('lodash');

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'
import {getUid, getHeaderInset} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';

import {makeUidState, 
        makeFriendsState,
        makeFriendProfilesState} from '../../Reselect'
// import console = require('console');

  //       const {state} = navigation;
  // return {
  //   title: `${state.params.title}`,
  // };
class SettingListFriendRequestSent extends React.Component{
  static navigationOptions = ({ navigation }) => ({
    // title: "Friend Request Sent",
    title:`${navigation.state.params.title}`,
    headerTintColor: '#C7D8DD',
    headerStyle: {
      backgroundColor: 'rgba(186, 53, 100, 1.0)',
      // ios navigationoptions underline hide
      borderBottomWidth: 0,

      // android navigationoptions underline hide
      elevation: 0,
      shadowOpacity: 0
    },
  }) 

  constructor(props){
      super(props)

      this.state = {
        data:[],
        loading: false
      }
  }

  componentDidMount(){
    this.loadData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.loadData(nextProps)
  }

  loadData = (props) =>{
    let {friends, friend_profiles} = props

    let data = []
    for (var key in friends) {
        let friend = friends[key]
        switch(friend.status){
          case Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND:{
            let friend_profile =_.find(friend_profiles, (v, k)=>{
                                  return k == key
                                })
            if(friend_profile !== undefined){
              data.push({...friend, friend_id:key, profile:friend_profile});
            } 
            break
          }            
        }
    }

    // console.log(data.length)

    if(!_.isEqual(data, this.state.data)){
      const {setParams} = props.navigation;
      setParams({ title: 'Friend Request('+ data.length +')'})
    }

    this.setState({data})
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
    )
  }

  showMenu = (item)=>{
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
                      this.setState({loading:true})
                      this.props.actionUpdateStatusFriend(this.props.uid, item.friend_id, Constant.FRIEND_STATUS_FRIEND_CANCEL, (result)=>{
                          this.setState({loading:false})
                      })
                    }}>
                    <Text style={{padding:10, fontSize:18}}>Cancel request</Text>
                  </MenuOption>
                </MenuOptions>
            </Menu>
          </View>)
  }

  renderItem = ({item, index}) => {
      // console.log('renderItem', item)
      return(
          <TouchableOpacity 
          key={item}
          onPress={()=>{
              this.props.navigation.navigate("FriendProfilePage",{'friend_id': item.friend_id})
          }}>            
          <View
            style={{
              alignItems: 'center', 
              // margin: 5, 
              padding: 10,
              // borderWidth: 0.5, 
              borderColor: '#E4E4E4',
              flexDirection: 'row',
            }}>
              <TouchableOpacity 
                  style={{}}>
                  <FastImage
                      style={{width: 50, 
                              height: 50, 
                              borderRadius: 10,
                            }}
                      source={{
                        uri: item.profile.image_url,
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

                        {item.hasOwnProperty('change_friend_name') ? item.change_friend_name : item.profile.name}
                  </Text>
                  <Text style={{fontSize: 13, 
                              color: '#222',
                              paddingLeft: 10}}>
                        {item.profile.status_message}
                  </Text>
              </View>
              {this.showMenu(item)}
          </View>
          </TouchableOpacity>
      )
  }

  render(){
    let {data} = this.state
    return(<MenuContext>
            <View style={{flex:1}}>
            <Spinner
              visible={this.state.loading}
              textContent={'Wait...'}
              textStyle={{color: '#FFF'}}
              overlayColor={'rgba(0,0,0,0.5)'}/>
            <FlatList
              data={data}
              renderItem={this.renderItem}
              extraData={this.state}
              keyExtractor = { (item, index) => index.toString() } 
              ItemSeparatorComponent={this.renderSeparator}
              />
          </View>
          </MenuContext>)
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
    friends: makeFriendsState(state, ownProps),
    friend_profiles:makeFriendProfilesState(state, ownProps),
  }
}
  
export default connect(mapStateToProps, actions)(SettingListFriendRequestSent);