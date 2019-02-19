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
            buttonState: 'normal'
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
      let {groups, friends} = props

      let group = _.find(groups, (v, k)=>{
        return k == group_id
      })

      // console.log(group)
      let data = []
      _.each(friends, (fv, fk)=>{
        console.log(fv, fk, group.members)
        let member = _.find(group.members, (gv, gk)=>{
          return gv.friend_id == fk 
        })
        if(member === undefined){
          data.push({...{friend_id:fk}, ...fv})
        }else if(member.status !=Constant.GROUP_STATUS_MEMBER_JOINED && member.status !=Constant.GROUP_STATUS_MEMBER_INVITED){
          data.push({...{friend_id:fk}, ...fv})
        }
      })
      // console.log(data)
      this.setState({data})
    }

    handleInvite = () =>{
      let newData = this.state.data.filter(function(item){
          return item.seleted == true;
      })
    
      newData.sort(function(a, b) {
        var dateA = new Date(a.create), dateB = new Date(b.create);
        return dateA - dateB;
      });

      // console.log(newData)

      let members = []
      newData.map((value) => {
          if(value.friend_id !== undefined){
              members.push(value.friend_id)
          }
      })

      if(members.length == 0){
          Alert.alert("Empty friend.");
      }else{
          this.setState({loading:true})
          this.props.actionGroupInviteMember(this.props.uid, this.state.group_id, members, (result) => {
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
      // console.log(item)
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
                      <Text style={{fontSize:18}}>{item.change_friend_name === undefined?item.profile.name:item.change_friend_name}</Text>
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
        );
      };

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
                    renderItem={this.renderItem}
                    extraData={data}
                    ItemSeparatorComponent={this.renderSeparator}
                />
               </View>)
    }
}

const mapStateToProps = (state) => {
    // console.log(state)
    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
      auth:state.auth,
      friends:state.auth.users.friends,
      groups:state.auth.users.groups,
    }
}

export default connect(mapStateToProps, actions)(GroupMemberInvite);