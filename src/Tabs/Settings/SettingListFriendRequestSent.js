import React from 'react'
import {View, 
        Text, 
        FlatList,
        TouchableOpacity} from 'react-native'

import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image'

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'
import {getUid} from '../../Utils/Helpers'

class SettingListFriendRequestSent extends React.Component{
    constructor(props){
        super(props)

        this.state = {
          data:[],
          loading: false
        }
    }

    componentDidMount(){
        this.setState({
            data:[]
        })

        this.loadData()
    }

    loadData = () =>{
        let friend_member = []
        for (var key in this.props.auth.users.friends) {
            let friend =  this.props.auth.users.friends[key]
            switch(friend.status){
              case Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND:{
  
                // if(friend.hide){
                friend_member.push({...friend, friend_id:key});
                // }
                break
              }            
            }
        }

        this.setState({
            data:friend_member
        })
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps)

        if(nextProps.auth === undefined){
            return;
        }

        let friend_member = []
        for (var key in nextProps.auth.users.friends) {
            let friend =  nextProps.auth.users.friends[key]
            switch(friend.status){
              case Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND:{
  
                // if(friend.hide){
                    friend_member.push({...friend, friend_id:key});
                // }
                break
              }            
            }
        }

        this.setState({
            data:friend_member
        })
    }

    renderItem = ({item, index}) => {
        // return (<View><Text>{index}</Text></View>)

        // console.log(item)
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
                                // borderWidth:1, 
                                // borderColor:'gray'
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

                         Name : {item.hasOwnProperty('change_friend_name') ? item.change_friend_name : item.profile.name}
                    </Text>
                    <Text style={{fontSize: 13, 
                                color: '#222',
                                paddingLeft: 10}}>
                        Status : {item.profile.status_message}
                    </Text>
                </View>

                {/* <TouchableOpacity
                  style={{backgroundColor:'red'}}
                  onPress={()=>{
                    this.setState({loading:true})
                  }}>
                  <Text>red</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                  style={{flexDirection:'row', position:'absolute', right:0, bottom:0, margin:5, }}
                  onPress={()=>{
                      this.setState({loading:true})
                      this.props.actionUpdateStatusFriend(this.props.uid, item.friend_id, Constant.FRIEND_STATUS_FRIEND_CANCEL, (result)=>{
                          // console.log(result)
                          this.setState({loading:false})
                      })
                  }}>
                  <View style={{borderColor:'red', borderWidth:1, borderRadius:10, padding:5, marginLeft:5}}>
                      <Text style={{color:'red'}}>Cancel request</Text>
                  </View>
                </TouchableOpacity>
            </View>
            </TouchableOpacity>
        )
    }

    render(){
      let {data} = this.state
      return(<View style={{flex:1}}>
              <Spinner
                visible={this.state.loading}
                textContent={'Wait...'}
                textStyle={{color: '#FFF'}}
                overlayColor={'rgba(0,0,0,0.5)'}/>
              <FlatList
                data={data}
                // showsVerticalScrollIndicator={false}
                renderItem={this.renderItem}
                extraData={this.state}
                keyExtractor = { (item, index) => index.toString() } />
            </View>)
    }
}

const mapStateToProps = (state) => {
    // console.log(state)
  
    // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
    //_persist.rehydrated parameter is initially set to false
    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
      uid:getUid(state),
      auth:state.auth
    }
}
  
export default connect(mapStateToProps, actions)(SettingListFriendRequestSent);