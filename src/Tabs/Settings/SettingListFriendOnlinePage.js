import React from 'react'
import {View, 
        Text, 
        FlatList,
        TouchableOpacity,
        ActivityIndicator} from 'react-native'

import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
var _ = require('lodash');

import Constant from '../../Utils/Constant'

import * as actions from '../../Actions'
import {makeUidState, 
        makeFriendsState,
        makeFriendProfilesState, 
        makePresencesState} from '../../Reselect'

class SettingListFriendOnlinePage extends React.Component{
    static navigationOptions = ({ navigation }) => ({
      title: "Friend online",
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
          refreshing: true
        }
    }

    componentDidMount(){
      this.loadData(this.props)
    }

    componentWillReceiveProps(nextProps) {
      this.loadData(nextProps)
    }

    loadData = (props) =>{
      let {uid, friends, friend_profiles, presences} = props

      let data =[]
      _.map(friends, (value, key)=>{
          let friend_profile =  _.find(friend_profiles, (v, k)=>{
                                  return key == k && k != uid
                                })

          if(friend_profile && value.status == Constant.FRIEND_STATUS_FRIEND){
            let presence = _.find(presences, (pv, pk)=>{
              return pv.status == "online" && pk == key
            })

            let is_online = false
            if(presence){
              is_online = true
            }

            data.push({...value, friend_profile, is_online})
          }
      })

      this.setState({data, refreshing:false})
    }

    isOnline = (is_online)=>{
      let backgroundColor = '#C7D8DD'
      if(is_online){
        backgroundColor = '#00ff80'
      }

      return(<View style={{width: 16, 
                height: 16, 
                backgroundColor, 
                position: 'absolute',
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 8,
                right: -5,
                top: -5}} />)
    }

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

    renderItem({ item, index }) {
        return(
            <View
              style={{
                alignItems: 'center', 
                padding: 10,
                borderColor: '#E4E4E4',
                flexDirection: 'row',
              }}>
                <TouchableOpacity>
                      <FastImage
                        style={{width: 50, 
                                height: 50, 
                                borderRadius: 10,
                            }}
                        source={{
                            uri: item.friend_profile.image_url,
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                      { this.isOnline(item.is_online) }
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
            </View>
        )
    }

    render(){
        let {data} = this.state
        return( <View style={{flex:1}}>
                  <FlatList
                      data={data}
                      showsVerticalScrollIndicator={false}
                      renderItem={this.renderItem.bind(this)}
                      ListFooterComponent={this.renderFooter}
                      keyExtractor = { (item, index) => index.toString() } 
                  />
                </View>)
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
      friend_profiles: makeFriendProfilesState(state, ownProps),
      presences: makePresencesState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(SettingListFriendOnlinePage);