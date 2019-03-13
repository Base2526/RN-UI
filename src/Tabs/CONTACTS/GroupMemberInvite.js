import React from 'react'
import {View, 
        Alert, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity,} from 'react-native'
import { connect } from 'react-redux'
var _ = require('lodash')
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'
import MyIcon from '../../config/icon-font.js';
import {randomKey} from '../../Utils/Helpers'

import {makeUidState, 
        makeFriendsState, 
        makeFriendProfilesState, 
        makeGroupsState,
        makeGroupProfilesState} from '../../Reselect'

class GroupMemberInvite extends React.Component{
    
    static navigationOptions = ({ navigation }) => ({
        title: "Invite members",
        headerTintColor: '#C7D8DD',
        headerStyle: {
          backgroundColor: 'rgba(186, 53, 100, 1.0)',

          // ios navigationoptions underline hide
          borderBottomWidth: 0,

          // android navigationoptions underline hide
          elevation: 0,
          shadowOpacity: 0
        },
        headerRight: (
          <TouchableOpacity
            style={{paddingRight:10}}
            onPress={() => {
              const { params = {} } = navigation.state
              params.handleInvite()
            }}>
            <Text style={{fontSize:18, fontWeight:'bold', color:'#C7D8DD'}}>Invite</Text>
          </TouchableOpacity>
        )
    })
    
    constructor(props) {
        super(props)

        this.state = {
            loading:false,
            data: [],
            buttonState: 'normal',
            group_profile:{}
        }
    }

    componentDidMount(){
      this.props.navigation.setParams({ handleInvite: this.handleInvite })
    
      const { navigation } = this.props;
      const group_id = navigation.getParam('group_id', null);

      this.setState({group_id}, ()=>{
        this.loadData(this.props)
      })
    }

    componentWillReceiveProps(nextProps) {
      this.loadData(nextProps)
    }

    loadData = (props) =>{

      let {group_id} = this.state
      let {groups, group_profiles, friends, friend_profiles} = props

      let group_profile = _.find(group_profiles, (v, k)=>{
                            return k == group_id
                          })

      // console.log('group_profile', group_profile, friends, friend_profiles)

      let data = []
      _.each(friends, (fv, fk)=>{
        // console.log('group_profile', fv, fk)
        if(fv.status === Constant.FRIEND_STATUS_FRIEND){
          let member = _.find(group_profile.members, (gv, gk)=>{
            return gv.friend_id == fk 
          })
  
          let friend_profile = _.find(friend_profiles, (fpv, fpk)=>{
                                  return fk == fpk
                               })
  
          if(friend_profile){
            fv = {...fv, profile:friend_profile}
            // console.log('group_profile', fv)
            if(!member){
              data.push({...{friend_id:fk}, ...fv})
            }else if(member.status !=Constant.GROUP_STATUS_MEMBER_JOINED && member.status !=Constant.GROUP_STATUS_MEMBER_INVITED){
              data.push({...{friend_id:fk}, ...fv})
            }
          }
        }
      })
      this.setState({data, group_profile})
    }

    handleInvite = () =>{
      let newData = this.state.data.filter(function(item){
          return item.seleted == true;
      })
    
      newData.sort(function(a, b) {
        var dateA = new Date(a.create), dateB = new Date(b.create);
        return dateA - dateB;
      });

      let members = []
      newData.map((value) => {
          if(value.friend_id !== undefined){
              members.push(value.friend_id)
          }
      })

      if(members.length == 0){
          Alert.alert("Empty friend.");
      }else{

        let {group_profile} = this.state

        /*
         เราจะ pack กรณี member มี member_key 
         อยู่แล้วเราจะไม่ดึงจะ firestore มาเช็ดเพราะทำให้ช้าเราเลย อ้างอิงจะเครื่อง
        */
        let new_members = members.map((v,k)=>{
                            let member_key  = _.findKey(group_profile.members, (pv, pk)=>{
                                              return pv.friend_id == v
                                            })
                            if(!member_key){
                              member_key = randomKey()
                            }

                            return {friend_id:v, member_key}
                          })

        this.setState({loading:true})
        this.props.actionGroupInviteMember(this.props.uid, this.state.group_id, new_members, (result) => {
            console.log(result)
            this.setState({loading:false})
            if(result.status){
                // setTimeout(() => {
                this.setState({loading:false})
                this.props.navigation.goBack(null)
                // }, 200);
            }else{
                setTimeout(() => {
                    Alert.alert(result.message);
                }, 100);
            }
        })
      }
    }

    onSeleted = (index) =>{
      let newData = [...this.state.data];
      if(this.state.data[index].seleted === undefined){
          this.state.data[index].seleted = true
          this.state.data[index].create = new Date()
      }else{
          this.state.data[index].seleted = !this.state.data[index].seleted
      }

      this.setState({
          data:newData
      })
    }

    renderItem = ({ item, index }) => {
      console.log(item)
      let seleted = false
      if(this.state.data[index].seleted === undefined){
          seleted = true
      }else{
          seleted = !this.state.data[index].seleted
      }
      return (<TouchableOpacity
                  onPress={()=>{
                    this.onSeleted(index)
                  }}>
                <View style={{flex:1, 
                  height:100, 
                  padding:10, 
                  marginRight:10,
                  backgroundColor:'white', 
                  flexDirection:'row',
                  alignItems:'center',}}>
                  <MyIcon
                    style={{paddingLeft:5, 
                            paddingRight:10}}
                    name={'dot-circled'}
                    size={30}
                    // color={'#E9E9E9'}
                    color={seleted ? '#E9E9E9' : '#DF2D6C'} 
                  />
                  <FastImage
                    style={{width: 60,  
                            height: 60,
                            borderRadius: 10, 
                            borderColor:'gray', 
                            // backgroundColor: '#FF83AF',
                            borderWidth:1
                            }}
                    source={{
                        uri: item.profile.image_url,
                        headers:{ Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.normal}
                  />
                  <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                      <Text style={{fontSize:18}}>{item.change_friend_name?item.change_friend_name:item.profile.name}</Text>
                  </View>  
                </View>
                </TouchableOpacity>)
    }

    handleCallback =(item)=> {
        console.log('-- handleCallback', item) 
    }

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
      )
    }

    render(){
        let {loading, data} = this.state
        return( <View style={{flex:1}}> 
                  <Spinner
                    visible={loading}
                    textContent={'Wait...'}
                    textStyle={{color: '#FFF'}}
                    overlayColor={'rgba(0,0,0,0.5)'}/>
                  <FlatList
                      data={data}
                      renderItem={this.renderItem}
                      extraData={data}
                      ItemSeparatorComponent={this.renderSeparator}
                  />
                </View>)
    }
}

const mapStateToProps = (state, ownProps) => {
    // console.log(state)
    if(!state._persist.rehydrated){
      return {}
    }

    if(!state.auth.isLogin){
      return;
    }
  
    return{
      // friends:state.auth.users.friends,
      // groups:state.auth.users.groups,
      uid:makeUidState(state, ownProps),
      friends:makeFriendsState(state, ownProps),
      friend_profiles:makeFriendProfilesState(state, ownProps),
      groups:makeGroupsState(state, ownProps),
      group_profiles:makeGroupProfilesState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(GroupMemberInvite);