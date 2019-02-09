import React from 'react'
import {View, 
        Text, 
        FlatList,
        TouchableOpacity,
        Alert} from 'react-native'

import { connect } from 'react-redux';

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'
import PlaceHolderFastImage from '../../Utils/PlaceHolderFastImage'
import {getUid} from '../../Utils/Helpers'

class SettingListHide extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data:[]
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
              case Constant.FRIEND_STATUS_FRIEND:{
  
                if(friend.hide){
                    friend_member.push({...friend, friend_id:key});
                }
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
              case Constant.FRIEND_STATUS_FRIEND:{
  
                if(friend.hide){
                    friend_member.push({...friend, friend_id:key});
                }
                break
              }            
            }
        }

        this.setState({
            data:friend_member
        })
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
                      <PlaceHolderFastImage 
                        source={{uri:item.profile.image_url}}
                        style={{width: 60, height: 60, borderRadius: 10, borderWidth:1, borderColor:'gray'}}/>
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

                <View style={{flexDirection:'row', position:'absolute', right:0, bottom:0, margin:5, }}>
                  <View style={{borderColor:'red', borderWidth:1, borderRadius:10, padding:5, marginLeft:5}}>
                    <TouchableOpacity
                    onPress={()=>{
                        
                        Alert.alert(
                            '',
                            '',
                            [
                              {text: 'Remove', 
                                onPress: () => {
                                    this.props.actionUpdateStatusFriend(this.props.uid, item.friend_id, Constant.FRIEND_STATUS_FRIEND_REMOVE, (data)=>{
                                    })
                                },
                                // style: 'cancel'
                              },
                              {text: 'Unhide', 
                                onPress: () => {
                                    this.props.actionFriendHide(this.props.uid, item.friend_id, (result)=>{
                                        console.log(result)
                                    })
                                }, 
                              },
                              {text: 'Cancel', 
                                onPress: () => {
                                    console.log("cancel")
                                }, 
                                style: 'cancel'
                              },
                            ],
                            { cancelable: false }
                          )
                    }}>
                      <Text style={{color:'red'}}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            </View>
        )
    }

    render(){
        let {data} = this.state
        // console.log(data)
        return(<View style={{flex:1}}>
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={item => item.item_id}
                />
                </View>)
    }
}

const mapStateToProps = (state) => {
    console.log(state)
  
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
  
export default connect(mapStateToProps, actions)(SettingListHide);