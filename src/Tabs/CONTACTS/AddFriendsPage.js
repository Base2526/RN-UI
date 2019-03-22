import React from 'react'

import { View, 
        Text, 
        StyleSheet, 
        TouchableOpacity, 
        FlatList, 
        ActivityIndicator, 
        Alert} from 'react-native';
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
var _ = require('lodash');

import * as actions from '../../Actions'
import {getHeaderInset, isEmpty, randomKey} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';
import {makeUidState, 
        makeIsConnectedState,
        makeFriendsState,
        makePeopleYouMayKhowState} from '../../Reselect'

class AddFriendsPage extends React.Component{

  static navigationOptions = ({ navigation }) => ({
      title: "Add Friends",
      headerTintColor: '#C7D8DD',
      headerStyle: {
        // color: 'white',
        backgroundColor: 'rgba(186, 53, 100, 1.0)',

        // ios navigationoptions underline hide
        borderBottomWidth: 0,

        // android navigationoptions underline hide
        elevation: 0,
        shadowOpacity: 0,
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
        refreshing: true
      };
  }

  componentDidMount() {
    setTimeout(() => {this.setState({renderContent: true})}, 0);
    let {uid, people_you_may_khows} = this.props

    if(isEmpty(people_you_may_khows)){
      this.props.actionPeopleYouMayKhow(uid).then((result) => {
        // if(result.status){
  
        //   this.setState({refreshing: false});
        // }else{
        //   this.setState({refreshing: false});
        // }

        console.log(result)
      })
    }else{
      this.loadData(this.props)
    }
  }

  componentWillReceiveProps(nextProps){
    this.loadData(nextProps)
  }

  loadData = (props) =>{
    let {friends, people_you_may_khows} = props

    let data =[]
    _.map(people_you_may_khows, (v, k)=>{
      let friend =  _.find(friends, (fv, fk)=>{
                      return v.uid == fk
                    })

      if(!friend){
        data.push(v)
      }
    })
      
    // console.log(data)
    this.setState({data, refreshing:false})
  }
   
  ItemSeparatorComponent = () => {
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
  }

  showMenu = (item, index)=>{
    // console.log(item)
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
                      this.props.navigation.navigate("FriendProfilePage", {'friend_id': item.uid})
                    }}>
                        <Text style={{padding:10, fontSize:18}}>View profile</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => {

                      let {friends} = this.props

                      let find_friend = _.find(friends, (v, k)=>{
                                          return k == item.uid
                                        })

                      let chat_id = randomKey()
                      if(find_friend){
                        chat_id = find_friend.chat_id
                      }
                      console.log(find_friend)
                      
                      this.setState({loading:true})
                      this.props.actionInviteFriend(this.props.uid, item.uid, chat_id, (result) => {
                        console.log(result)  
                        this.setState({loading:false})

                        // let data = [...this.state.data];
                        // data.splice(index, 1)
                        // this.setState({data})
                      })
                      
                    }}>
                        <Text style={{padding:10, fontSize:18}}>Add friend</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
          </View>)
  }

  renderHeader = () => {
    return(
      <View style={{justifyContent:'center'}}>
          <View style={{flexDirection:'row', justifyContent:'center', backgroundColor:'rgba(186, 53, 100, 1.0)'}}>
            <TouchableOpacity 
              style={{justifyContent:'center', alignItems:'center', padding:10}}
              onPress={()=>{
                Alert.alert(
                  'Select invite',
                  '',
                  [
                    {text: 'Text message', onPress: () => {
                      this.props.navigation.navigate("InviteFriendByTextmessagePage")
                    }},
                    {text: 'Email', onPress: () => {
                      this.props.navigation.navigate("InviteFriendByEmailPage")
                    }},
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    // {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ],
                  {cancelable: false},
                );
              }}>
              <MyIcon
                  name={'contacts-phone-book'}
                  size={40}
                  color={'#C7D8DD'} />
              <Text style={{color:'#C7D8DD', padding:5}}>Phone book</Text>                   
            </TouchableOpacity>
            <TouchableOpacity 
              style={{justifyContent:'center', alignItems:'center', padding:10}} 
              onPress={()=>{
                this.props.navigation.navigate("QRCodeReaderPage")
              }}>
              <MyIcon
                  name={'contacts-qr'}
                  size={40}
                  color={'#C7D8DD'} />
              <Text style={{color:'#C7D8DD', padding:5}}>QR code</Text>     
            </TouchableOpacity>
            <TouchableOpacity 
              style={{justifyContent:'center', alignItems:'center', padding:10}}
              onPress={()=>{
                this.props.navigation.navigate("FindFriendPage")
              }}>
              <MyIcon
                  name={'contacts-search'}
                  size={40}
                  color={'#C7D8DD'} />
              <Text style={{color:'#C7D8DD', padding:5}}>Search</Text>     
            </TouchableOpacity>
          </View>
          <View style={{padding:10, color:'gray'}}>
            <Text>People you may know.</Text>
          </View>
      </View>)
  };

  renderFooter = () => {
    if (!this.state.refreshing) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}>
        <ActivityIndicator animating size="small" />
      </View>
    );
  };

  renderItem = ({item, index}) => {
    return(
      <View
        style={{
          alignItems: 'center', 
          padding: 10,
          // borderColor: DictStyle.colorSet.lineColor,
          flexDirection: 'row',
          backgroundColor: 'white',
        }}>
        <View style={{flex:1, alignItems:'center', }}>
          <FastImage
            style={{width: 50, 
                    height: 50, 
                    borderRadius: 10, 
                  }}
            source={{
              uri: item.url_image,
              headers:{ Authorization: 'someAuthToken' },
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.normal}/>
        </View>
        <View style={{flex:3}}>
          <Text style={{
                      fontSize: 18, 
                      fontWeight: 'bold',
                      paddingLeft: 5}}>
              {item.name}
          </Text>
        </View>
        {this.showMenu(item, index)}
      </View>)
  }
  
  render() {
      let {renderContent, data} = this.state;

      return (
        <MenuContext>
        <View style={{flex:1, backgroundColor: 'white'}}>
        <Spinner
            visible={this.state.loading}
            textContent={'Wait...'}
            textStyle={{color: '#FFF'}}
            overlayColor={'rgba(0,0,0,0.5)'}
          />
        {
        renderContent && 
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={item => item.uid}
            ItemSeparatorComponent={this.ItemSeparatorComponent}
            ListHeaderComponent={this.renderHeader}
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
      uid:makeUidState(state, ownProps),
      friends:makeFriendsState(state, ownProps),
      people_you_may_khows:makePeopleYouMayKhowState(state, ownProps),
      is_connected:makeIsConnectedState(state, ownProps),
  })
}

export default connect(mapStateToProps, actions)(AddFriendsPage);