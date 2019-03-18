import React from 'react'
import {View, 
        Text, 
        FlatList,
        TouchableOpacity,
        Alert} from 'react-native'

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
// import PlaceHolderFastImage from '../../Utils/PlaceHolderFastImage'
import {getHeaderInset, checkInternetDialog} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';

import {makeUidState, 
        makeFriendsState,
        makeFriendProfilesState,
        makeIsConnectedState} from '../../Reselect'

class SettingListBlock extends React.Component{
    static navigationOptions = ({ navigation }) => ({
      title: "Friend block",
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
          loading:false,
          renderContent: false,
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
      _.map(friends, (value, key)=>{
        if(value.status === Constant.FRIEND_STATUS_FRIEND && value.block){
          let friend_profile =_.find(friend_profiles, (v, k)=>{
                                return k == key
                              })
          data.push({...value, friend_id:key, friend_profile});
        }
      })

      this.setState({data, renderContent:true})
    }

    showMenu = (item)=>{

      let {is_connected} = this.props

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

                        if(!is_connected){
                          checkInternetDialog()
                          return 
                        }

                        // this.setState({loading:true})
                        this.props.actionFriendBlock(this.props.uid, item.friend_id, false, (result)=>{
                            console.log(result)
                            // this.setState({loading:false})
                        })
                      }}>
                          <Text style={{padding:10, fontSize:18}}>Unblock</Text>
                      </MenuOption>
                      <MenuOption onSelect={() => {
                        
                        if(!is_connected){
                          checkInternetDialog()
                          return 
                        }

                        // this.setState({loading:true})
                        this.props.actionFriendDelete(this.props.uid, item.friend_id, (result)=>{
                            console.log(result)
                            // this.setState({loading:false})
                        })
                      }}>
                        <Text style={{padding:10, fontSize:18}}>Delete friend</Text>
                      </MenuOption>
                  </MenuOptions>
              </Menu>
            </View>)
    }

    renderItem({ item, index }) {
        // return (<View><Text>{index}</Text></View>)
        // console.log(item)
        return(
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
                      {/* <PlaceHolderFastImage 
                        source={{uri:item.profile.image_url}}
                        style={{width: 60, height: 60, borderRadius: 10, borderWidth:1, borderColor:'gray'}}/> */}

                      <FastImage
                        style={{width: 50, 
                                height: 50, 
                                borderRadius: 10, 
                                // borderWidth:.5, 
                                // borderColor:'gray'
                            }}
                        source={{
                            uri: item.friend_profile.image_url,
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

                         {item.hasOwnProperty('change_friend_name') ? item.change_friend_name : item.friend_profile.name}
                    </Text>
                    <Text style={{fontSize: 13, 
                                color: '#222',
                                paddingLeft: 10}}>
                         {item.friend_profile.status_message}
                    </Text>
                </View>
                {this.showMenu(item)}
            </View>
        )
    }

    render(){
        let {data, renderContent, loading} = this.state

        if(!renderContent){
          return (<View style={{flex:1}}></View>)
        }

        return( <MenuContext>
                <View style={{flex:1}}>
                  <Spinner
                    visible={loading}
                    textContent={'Wait...'}
                    textStyle={{color: '#FFF'}}
                    overlayColor={'rgba(0,0,0,0.5)'}/>
                  <FlatList
                      data={data}
                      showsVerticalScrollIndicator={false}
                      renderItem={this.renderItem.bind(this)}
                      keyExtractor={item => item.item_id}
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

      is_connected: makeIsConnectedState(state, ownProps),
    }
}
  
export default connect(mapStateToProps, actions)(SettingListBlock);