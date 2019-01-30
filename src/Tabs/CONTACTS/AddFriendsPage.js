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

import Image from 'react-native-remote-svg'

import Styles from '../../styles';
import DictStyle from './dictStyle';

import * as actions from '../../Actions'

import {API_URL} from '../../Utils/Constant'

import {getUid, getHeaderInset} from '../../Utils/Helpers'

import ImageWithDefault from '../../Utils/ImageWithDefault'

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
      headerTintColor: 'white',
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
    // this.setState(
    //   {
    //     page: 1,
    //     seed: this.state.seed + 1,
    //     refreshing: true
    //   },
    //   () => {
    //     this.makeRemoteRequest();
    //   }
    // );
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
            {/* <Image
              style={{ width: 40, height: 40}}
              source={require('../../Images/icon-contacts-phone-book.svg')}
            />   */}
            <Image
              style={{ width: 40, height: 40}}
              source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28.259" height="32.897" viewBox="0 0 28.259 32.897">
                            <g id="Group_7" data-name="Group 7" transform="translate(-35.942 -60.79)">
                              <line id="Line_5" data-name="Line 5" x2="26.62" transform="translate(36.302 62.144)" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="0.454"/>
                              <line id="Line_6" data-name="Line 6" y2="31.754" transform="translate(62.922 61.933)" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="0.451"/>
                              <line id="Line_7" data-name="Line 7" y2="32.667" transform="translate(63.962 61.02)" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="0.45"/>
                              <line id="Line_8" data-name="Line 8" x2="27.195" transform="translate(37.006 61.02)" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="0.459"/>
                              <path id="Path_62" data-name="Path 62" d="M35.942,63.082v1.713H37.08v1.324H35.942v2.274H37.08v1.323H35.942V71.99H37.08v1.323H35.942v2.274H37.08v1.322H35.942v2.274H37.08v1.323H35.942v2.275H37.08v1.324H35.942v2.273H37.08V87.7H35.942v2.274H37.08V91.3H35.942v2.389H62.027v-30.6Zm16.958,6.6a3.033,3.033,0,1,1-3.034,3.033A3.035,3.035,0,0,1,52.9,69.686Zm-7,1.929a3.032,3.032,0,1,1-3.033,3.033A3.036,3.036,0,0,1,45.9,71.615ZM52,85.92H39.8c.515-4.427,2.961-7.784,5.908-7.784h.384a4.2,4.2,0,0,1,2.405.8,5.18,5.18,0,0,1,4.21-2.731h.384c2.947,0,5.392,3.356,5.908,7.783H51.632A13.679,13.679,0,0,1,52,85.92Z" fill="#fff"/>
                            </g>
                          </svg>            
                          `}} />
            <Text style={{color:'white', padding:5}}>Phone book</Text>                   
          </TouchableOpacity>
          <TouchableOpacity 
            style={{justifyContent:'center', alignItems:'center', padding:10}} 
            onPress={()=>{
              this.props.navigation.navigate("QRCodeReaderPage")
            }}>
            {/* <Image
              style={{ width: 40, height: 40}}
              source={require('../../Images/icon-contacts-qr.svg')}
            />   */}

          <Image
              style={{ width: 40, height: 40}}
              source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="31.475" height="31.462" viewBox="0 0 31.475 31.462">
              <g id="Group_8" data-name="Group 8" transform="translate(-111.872 -61.197)">
                <path id="Path_63" data-name="Path 63" d="M137.108,73.793V70.727l-3.175-.2v-6.16c-1.173,0-2.143,0-3.111,0l.062.057V61.337h12.348v9.215h-2.975c0,1.146,0,2.159,0,3.175l.056-.066q-1.629.037-3.263.072Zm3.031-9.341h-2.926v2.935h2.926Z" fill="#fff" stroke="#cc2162" stroke-miterlimit="10" stroke-width="0.196" fill-rule="evenodd"/>
                <path id="Path_64" data-name="Path 64" d="M111.97,70.474V61.295h9.189v9.179Zm6.118-3.07V64.433h-2.936V67.4Z" fill="#fff" stroke="#cc2162" stroke-miterlimit="10" stroke-width="0.196" fill-rule="evenodd"/>
                <path id="Path_65" data-name="Path 65" d="M121.215,83.129V92.5h-9.206V83.184c3.043,0,6.156,0,9.269,0Zm-6.127,6.241h2.993V86.479h-2.993Z" fill="#fff" stroke="#cc2162" stroke-miterlimit="10" stroke-width="0.196" fill-rule="evenodd"/>
                <path id="Path_66" data-name="Path 66" d="M130.664,76.833v3.141h-2.93c-.074,1.144-.139,2.09-.21,3.158h-6.306l.06.055q.041-1.575.083-3.143l-.063.055h3.052V76.893H121.3l.063.056V73.9h6.192v2.982c1.146,0,2.158,0,3.174,0Z" fill="#fff" stroke="#cc2162" stroke-miterlimit="10" stroke-width="0.196" fill-rule="evenodd"/>
                <path id="Path_67" data-name="Path 67" d="M140.2,83.254h3.04v9.291h-9.217V89.589h6.238V83.2Z" fill="#fff" stroke="#cc2162" stroke-miterlimit="10" stroke-width="0.196" fill-rule="evenodd"/>
                <path id="Path_68" data-name="Path 68" d="M140.261,83.2h-3.1c-.06,1.039-.113,1.982-.177,3.133H130.75l.06.058V83.321c1-.055,1.942-.106,3.016-.167.064-.984.125-1.924.2-3.045h6.22l-.059-.059q.006,1.6.014,3.2Z" fill="#fff" stroke="#cc2162" stroke-miterlimit="10" stroke-width="0.196" fill-rule="evenodd"/>
                <path id="Path_69" data-name="Path 69" d="M127.6,64.363l3.279.053-.061-.055c0,2.012,0,4.019,0,6.142h-6.25V67.558h3.091V64.3Z" fill="#fff" stroke="#cc2162" stroke-miterlimit="10" stroke-width="0.196" fill-rule="evenodd"/>
                <path id="Path_70" data-name="Path 70" d="M118.267,76.81c-1.025.064-2.048.131-3.2.2V79.92H112V73.884h6.208c0,1.062,0,2.024,0,2.99Z" fill="#fff" stroke="#cc2162" stroke-miterlimit="10" stroke-width="0.196" fill-rule="evenodd"/>
                <path id="Path_71" data-name="Path 71" d="M130.75,86.329v3.08c-1.02.06-1.965.114-3.032.175-.063,1-.126,1.946-.192,2.977h-2.9V86.388h6.188Z" fill="#fff" stroke="#cc2162" stroke-miterlimit="10" stroke-width="0.196" fill-rule="evenodd"/>
                <path id="Path_72" data-name="Path 72" d="M137.048,73.733v3.1c-2.161,0-4.271,0-6.382,0l.061.054c0-.964,0-1.927,0-3.1h6.384Z" fill="#fff" stroke="#cc2162" stroke-miterlimit="10" stroke-width="0.196" fill-rule="evenodd"/>
                <path id="Path_73" data-name="Path 73" d="M140.245,80.109q.032-3.221.065-6.445l-.055.063c.962,0,1.92,0,2.994,0V80.05h-3.063Z" fill="#fff" stroke="#cc2162" stroke-miterlimit="10" stroke-width="0.196" fill-rule="evenodd"/>
                <path id="Path_74" data-name="Path 74" d="M127.665,64.3h-3.041V61.313H127.6v3.05Z" fill="#fff" stroke="#cc2162" stroke-miterlimit="10" stroke-width="0.196" fill-rule="evenodd"/>
                <path id="Path_75" data-name="Path 75" d="M121.361,80.043h-3.1c0-1.108,0-2.168,0-3.231l-.054.062q1.58.036,3.15.075l-.063-.056V80.1Z" fill="#fff" stroke="#cc2162" stroke-miterlimit="10" stroke-width="0.196" fill-rule="evenodd"/>
              </g>
            </svg>
            `}} />
            <Text style={{color:'white', padding:5}}>QR code</Text>     
          </TouchableOpacity>
          <TouchableOpacity 
            style={{justifyContent:'center', alignItems:'center', padding:10}}
            onPress={()=>{
              this.props.navigation.navigate("FindFriendPage")
            }}>
            {/* <Image
              style={{ width: 40, height: 40}}
              source={require('../../Images/icon-contacts-search.svg')}
            /> */}
            <Image
              style={{ width: 40, height: 40}}
              source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="29.409" height="29.403" viewBox="0 0 29.409 29.403">
              <g id="Group_6" data-name="Group 6" transform="translate(-190.586 -60.482)">
                <path id="Path_61" data-name="Path 61" d="M194.893,79.179a10.181,10.181,0,1,0-.233-14.623A10.347,10.347,0,0,0,194.893,79.179Z" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="2.321"/>
                <line id="Line_4" data-name="Line 4" x2="9.656" y2="9.652" transform="translate(209.518 79.412)" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="2.321"/>
              </g>
            </svg>`}} />
            <Text style={{color:'white', padding:5}}>Search</Text>     
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
                    borderColor: DictStyle.colorSet.lineColor,
                    flexDirection: 'row',
                    backgroundColor: 'white'
                  }}>
                  <View style={{flex:1, alignItems:'center'}}>
                    <TouchableOpacity 
                      style={{
                              height: 40,
                              width: 40,
                              borderRadius: 10,
                              alignItems:'center'}}
                      onPress={
                        ()=>this.props.navigation.navigate("FriendProfilePage")
                      }>
                      <ImageWithDefault 
                        source={{uri: item.url_image}}
                        style={{width: 40, height: 40, borderRadius: 10, borderWidth:1, borderColor:'gray'}}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{flex:3}}>
                    <TouchableOpacity 
                          onPress={
                            ()=>this.props.navigation.navigate("FriendProfilePage")
                          }>
                      <Text style={{
                                  fontSize: 18, 
                                  color: DictStyle.colorSet.normalFontColor,
                                  paddingLeft: 5}}>
                          {item.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* <View style={{flex:2}}> */}
                  {/*
                    <TouchableOpacity
                        style={{
                            borderRadius:10,
                            top:3,
                            right:0,
                            borderWidth:1,
                            borderColor:'gray',
                            alignItems:'center',
                            padding:10}}
                          onPress={
                            ()=>{
                              // console.log(item.uid)
                              // console.log(this.props.uid)
                              // this.props.navigation.goBack()

                              let uid = this.props.uid
                              let friend_id = item.uid

                              this.setState({loading:true})
                              this.props.actionAddFriend(uid, friend_id).then((result) => {
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
                            }
                          }>
                        <Text style={{color:'red', fontSize:14}}>Add Friend</Text>
                    </TouchableOpacity>
                        */}

                    <View style={{flexDirection:'row', position:'absolute', right:0, bottom:0, margin:5, }}>
                      <View style={{borderColor:'green', borderWidth:1, borderRadius:10, padding:5}}>
                        <TouchableOpacity
                        onPress={()=>{

                          let uid = this.props.uid
                          let friend_id = item.uid

                          this.setState({loading:true})
                          this.props.actionAddFriend(uid, friend_id).then((result) => {
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
                          <Text style={{color:'green'}}>Add friend</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{borderColor:'red', borderWidth:1, borderRadius:10, padding:5, marginLeft:5}}>
                        <TouchableOpacity
                        onPress={()=>alert('Cancel')}>
                          <Text style={{color:'red'}}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  {/* </View> */}
                </View>
          )
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