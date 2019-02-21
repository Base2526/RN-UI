import React from 'react'

import { View, 
        Text, 
        StyleSheet, 
        TouchableOpacity, 
        FlatList, 
        ActivityIndicator, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { List, ListItem, SearchBar } from "react-native-elements";
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';

import * as actions from '../../Actions'
import {getUid, getHeaderInset} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';

const Header = props => (
  <View style={{flex:1, alignItems:'flex-end', flexDirection:'row'}}>
      <View style={{flex:1}}>
          <TouchableOpacity
              style={{marginBottom:10}}
              onPress={() => {
                  props.navigation.goBack(null)
              }}>
              <View style={{flexDirection:'row', marginLeft:5}}>
                <Icon name={'chevron-left'} size={25} />
                <Text style={{alignSelf:'center', fontSize:18, marginLeft:5}}>Back</Text>
              </View>
          </TouchableOpacity>
      </View>
  </View>
);

const ImageHeader = (props) => {
  return(<View style={{ backgroundColor: 'rgba(186, 53, 100, 1.0)', height: getHeaderInset(true) }}>
          <Header {...props} style={{ backgroundColor: 'transparent' }}/> 
        </View>)
}

class AddFriendsPage extends React.Component{

  static navigationOptions = ({ navigation }) => ({
      title: "Add Friends",
      headerTintColor: '#C7D8DD',
      // header: (props) => <ImageHeader {...props} />,
      headerStyle: {
        // color: 'white',
        backgroundColor: 'rgba(186, 53, 100, 1.0)',

        // ios navigationoptions underline hide
        borderBottomWidth: 0,

        // android navigationoptions underline hide
        elevation: 0,
        shadowOpacity: 0,
      },
    //   style: { },
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
        refreshing: false
      };
  }

  componentDidMount() {
    setTimeout(() => {this.setState({renderContent: true})}, 0);

    this.setState({
      error: null,
      refreshing: false
    });

    this.props.actionPeopleYouMayKhow().then((result) => {
      if(result.status){
        this.setState({data:result.data.data});
      }else{

      }
    })
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };
    
  handleRefresh = () => {

  };

  handleLoadMore = () => {
    // this.setState(
    //   {
    //     page: this.state.page + 1
    //   },
    //   () => {
    //     this.makeRemoteRequest();
    //   }
    // );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  renderHeader = () => {
    // return <SearchBar placeholder="Type Here..." lightTheme round />;
    return(
      <View style={{flexDirection:'row', justifyContent:'center', backgroundColor:'rgba(186, 53, 100, 1.0)'}}>
          <TouchableOpacity 
            style={{justifyContent:'center', alignItems:'center', padding:10}}
            onPress={()=>{
              this.props.navigation.navigate("InviteFriendForContactPage")
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
      </View>)
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  renderItem = ({item, index}) => {
      // return here
      // console.log("renderItem : " + index)
      
    switch(index){
      case 0:{
          return(<View><Text>People you may know.</Text></View>)
      }
      break
      default:{
          return(
                <View
                  style={{
                    alignItems: 'center', 
                    padding: 10,
                    // borderColor: DictStyle.colorSet.lineColor,
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    height: 80
                  }}>
                  <View style={{flex:1, alignItems:'center', }}>
                    <TouchableOpacity 
                      onPress={
                        ()=>this.props.navigation.navigate("FriendProfilePage")
                      }>
                      <FastImage
                        style={{width: 60, 
                                height: 60, 
                                borderRadius: 10, 
                                borderWidth:1, 
                                borderColor:'gray'
                              }}
                        source={{
                          uri: item.url_image,
                          headers:{ Authorization: 'someAuthToken' },
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.normal}
                    />
                    </TouchableOpacity>
                  </View>
                  <View style={{flex:3}}>
                    <TouchableOpacity 
                          onPress={
                            ()=>this.props.navigation.navigate("FriendProfilePage")
                          }>
                      <Text style={{
                                  fontSize: 14, 
                                  // color: DictStyle.colorSet.normalFontColor,
                                  paddingLeft: 5}}>
                          {item.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
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
                </View>)
      }
    }   
  }
  
  render() {
      // let swipeBtns = [{
      //   text: 'Delete',
      //   backgroundColor: 'red',
      //   underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      //   onPress: () => { this.deleteNote(rowData) }
      // }];

      let {
        renderContent
      } = this.state;

      // this.setState({data:result.data.data});

      console.log(this.state.data)

      // if (this.state.data instanceof Object) console.log('Object!');
  
      return (
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
            data={this.state.data}
            // renderItem={({ item }) => (
            //   <ListItem
            //     roundAvatar
            //     title={`${item.name.first} ${item.name.last}`}
            //     subtitle={item.email}
            //     avatar={{ uri: item.picture.thumbnail }}
            //     containerStyle={{ borderBottomWidth: 0 }}
            //     onPress={()=>console.log("item click")}
            //   />
            // )}
            renderItem={this.renderItem.bind(this)}
            keyExtractor={item => item.name}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            // onRefresh={this.handleRefresh}
            // refreshing={this.state.refreshing}
            // onEndReached={this.handleLoadMore}
            onEndReachedThreshold={20}
            initialNumToRender={5}
          />
        }
        </View>
      );
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     actions
//   }
// }

const mapStateToProps = (state) => {
  console.log(state)
  return({
      // loading:state.auth.loading,
      // isLogin:state.auth.isLogin
      uid:getUid(state)
  })
}

export default connect(mapStateToProps, actions)(AddFriendsPage);