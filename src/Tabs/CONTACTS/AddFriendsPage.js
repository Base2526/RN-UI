import React from 'react'

import { View, 
        Text, 
        StyleSheet, 
        TouchableOpacity, 
        FlatList, 
        ActivityIndicator, 
        Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
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

import * as actions from '../../Actions'
import {getUid, getHeaderInset} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';

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
    let {uid} = this.props

    this.props.actionPeopleYouMayKhow(uid).then((result) => {
      if(result.status){

        this.setState({data:result.data.data, refreshing: false});
      }else{

      }
    })
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
    console.log(item)
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
                      // this.props.params.navigation.navigate("ListClassMemberPage", {'class_id': item.class_id})
                    }}>
                        <Text style={{padding:10, fontSize:18}}>View profile</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => {
                      this.setState({loading:true})
                      this.props.actionInviteFriend(this.props.uid, item.uid, (result) => {
                          this.setState({loading:false})

                          let data = [...this.state.data];
                          data.splice(index, 1)
                          this.setState({data})
                      })
                    }}>
                        <Text style={{padding:10, fontSize:18}}>Add friend</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => {
                        // this.props.params.navigation.navigate('ClasssSettingsPage', {'class_id': item.class_id})
                    }}>
                        <Text style={{padding:10, fontSize:18}}>Remove</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
          </View>)
  }

  renderHeader = () => {
    // return <SearchBar placeholder="Type Here..." lightTheme round />;
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
                    borderWidth:1, 
                    borderColor:'gray'
                  }}
            source={{
              uri: item.url_image,
              headers:{ Authorization: 'someAuthToken' },
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.normal}/>
        </View>
        <View style={{flex:3}}>
          <TouchableOpacity 
                onPress={
                  ()=>this.props.navigation.navigate("FriendProfilePage")
                }>
            <Text style={{
                        fontSize: 18, 
                        fontWeight: 'bold',
                        paddingLeft: 5}}>
                {item.name}
            </Text>
          </TouchableOpacity>
        </View>
        {this.showMenu(item, index)}
        { /*
        <View style={{flexDirection:'row', position:'absolute', right:0, bottom:0, margin:5, }}>
          <View style={{borderColor:'green', borderWidth:1, borderRadius:10, padding:5}}>
            <TouchableOpacity
            onPress={()=>{

              let uid = this.props.uid
              let friend_id = item.uid

              this.setState({loading:true})
              this.props.actionInviteFriend(uid, friend_id).then((result) => {
                console.log(result)

                console.log('uid : ' + uid)
                console.log('friend_id : ' + friend_id)

                this.setState({loading:false})
                // this.setState({loading: false})
                if(result.status){
                  // this.props.navigation.navigate("App") 
                  // this.setState({data:result.data.data});

                  switch(result.data.friend_status){
                    case 99:{
                      
                    }
                    case -1:{

                    }
                  }
                }else{
          
                }
              })
            }}>
              <Text style={{color:'green', fontSize:14}}>Add friend</Text>
            </TouchableOpacity>
          </View>
          <View style={{borderColor:'red', borderWidth:1, borderRadius:10, padding:5, marginLeft:5}}>
            <TouchableOpacity
            onPress={()=>alert('Cancel')}>
              <Text style={{color:'red', fontSize:14}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
        */ }
      </View>)
  }
  
  render() {
      let {renderContent, data} = this.state;

      console.log(data)
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

const mapStateToProps = (state) => {
  console.log(state)
  return({
      uid:getUid(state)
  })
}

export default connect(mapStateToProps, actions)(AddFriendsPage);