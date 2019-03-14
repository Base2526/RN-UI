import React from 'react'
import {View, 
        Text, 
        FlatList,  
        TouchableOpacity,
        Alert,} from 'react-native'
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
var _ = require('lodash');

import * as actions from '../../Actions'
import MyIcon from '../../config/icon-font.js';

import {randomKey} from '../../Utils/Helpers'

import Constant from '../../Utils/Constant'

import {makeUidState, 
        makeClasssState,
        makeClassMembersState,
        makeFriendsState,
        makeFriendProfilesState} from '../../Reselect'

class ClasssMemberAddFriend extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: "Add member",
        headerTintColor: '#C7D8DD',
        headerStyle: {
            backgroundColor: 'rgba(186, 53, 100, 1.0)',
  
            // ios navigationoptions underline hide
            borderBottomWidth: 0,
  
            // android navigationoptions underline hide
            elevation: 0,
            shadowOpacity: 0
        },
        headerLeft: (
            <View style={{marginRight:10}}>
                <TouchableOpacity
                    style={{paddingLeft:10}}
                    // disabled={isModify ? false: true}
                    onPress={() => {
                        const { params = {} } = navigation.state
                        params.handleCancel()
                    }}>
                    <MyIcon
                        name={'cancel'}
                        size={25}
                        color={'#C7D8DD'} />
                </TouchableOpacity>
            </View>
        ),
        headerRight: (
            <View style={{flexDirection:'row', flex:1}}>
                <TouchableOpacity
                    style={{paddingRight:10}}
                    // disabled={isModify ? false: true}
                    onPress={() => {
                        const { params = {} } = navigation.state
                        params.handleAdd()
                    }}>
                    <Text style={{color:'#C7D8DD',fontSize:18, fontWeight:'bold'}}>Add</Text>
                </TouchableOpacity>
            </View>
        ),
    });

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            data: [],
            class_id: 0,
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({handleCancel: this.handleCancel })
        this.props.navigation.setParams({handleAdd: this.handleAdd })

        const { navigation} = this.props;
        const class_id = navigation.getParam('class_id', null);

        this.setState({class_id},()=>{
            this.loadData(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    loadData = (props) =>{
        let {class_id} = this.state
        let {friends, friend_profiles, classs, class_members} = props

        let class_member =  _.find(class_members, (v, k)=>{
                                return k == class_id
                            })

        // _.map(class_member, (v, k)=>{
        //     console.log(v, k)
            
        // })

        let data = []
        _.map(friends, (v, k)=>{
            if(!v.block && !v.hide && v.status == Constant.FRIEND_STATUS_FRIEND){

                let member =_.find(class_member, (mv, mk)=>{
                                return mv.friend_id == k
                            })

                let member_key = randomKey()
                if(member){
                    if(!member.status){
                        member_key  =_.findKey(class_member, (key_v, key_k)=>{
                                            return key_v.friend_id == k
                                        })

                        let friend_profile  =_.find(friend_profiles, (fv, fk)=>{
                                                return fk == k
                                            })
                                        
                        data.push({friend_id:k, member_key, friend_profile})
                    }
                }else{
                    let friend_profile  =_.find(friend_profiles, (fv, fk)=>{
                        return fk == k
                    })
                    data.push({friend_id:k, member_key, friend_profile})
                }
            } 
        })

        console.log(data)
        this.setState({data})

        /*
        let {class_id} = this.state
        let {friends, classs} = props

        console.log(friends, classs, class_id)
        let cla = _.find(classs,  function(v, k) { 
            return k == class_id; 
        })

        if(cla === undefined){
            this.props.navigation.goBack(null)
            return;
        }

        let newData = []
        _.each(friends, (v, k)=>{
            let f = _.find(cla.members, (vv, kk)=>{
                return k == vv.friend_id && vv.status
            })

            console.log(f)
            if(f === undefined){
                newData.push( {...{friend_id:k}, ...v} )
            }
        })

        this.setState({data:newData})
        */
    }

    handleAdd = () =>{
        let newData = this.state.data.filter(function(item){
            return item.seleted == true;
        })

        newData.sort(function(a, b) {
            var dateA = new Date(a.create), dateB = new Date(b.create);
            return dateA - dateB;
        });

        let members = []
        newData.map((v) => {
            // if(value.friend_id !== undefined){
            let {friend_id, member_key} = v
            members.push({friend_id, member_key})
            // }
        })

        if(members.length == 0){
            Alert.alert("Empty friend.");
        }else{

            this.setState({loading:true})
            this.props.actionClassAddMember(this.props.uid, this.state.class_id, members, (result) => {
                console.log(result)
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
        console.log(newData)
        this.setState({
            data:newData
        })
    }

    renderItem = ({ item, index }) => {
        let seleted = false
        if(this.state.data[index].seleted === undefined){
            seleted = true
        }else{
            seleted = !this.state.data[index].seleted
        }

        return(<TouchableOpacity 
                onPress={()=>{
                    this.onSeleted(index)
                }}>
                <View style={{flex:1, 
                    // height:100, 
                    padding:10, 
                    marginRight:10,
                    backgroundColor:'white', 
                    flexDirection:'row',
                    alignItems:'center',}}>
                    <MyIcon
                        style={{paddingLeft:5, paddingRight:10}}
                        name={'dot-circled'}
                        size={30}
                        color={seleted ? '#E9E9E9' : '#DF2D6C'} />
                        <FastImage
                            style={{width: 50, 
                                    height: 50, 
                                    borderRadius: 10, 
                                    backgroundColor: '#FF83AF',
                                    }}
                            source={{
                            uri: item.friend_profile.image_url,
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.normal}
                        />
                    <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                        <Text style={{fontSize:18}}>{item.friend_profile.name}</Text>
                    </View>
                </View>
                </TouchableOpacity>)
    }

    renderSeparator = () => {
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
    };

    render(){

        let{data} = this.state

        if(data.length == 0){
            return(<View style={{flex:1}}><Text>Empty member</Text></View>)
        }

        return(<View style={{flex:1}}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}/>
                    <FlatList
                        data={this.state.data}
                        renderItem={this.renderItem}
                        extraData={this.state.data}
                        ItemSeparatorComponent={this.renderSeparator}/>
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
        // uid:getUid(state),
        // friends:state.auth.users.friends,
        // classs:state.auth.users.classs,

        uid:makeUidState(state, ownProps),
        friends:makeFriendsState(state, ownProps),
        friend_profiles:makeFriendProfilesState(state, ownProps),
        classs:makeClasssState(state, ownProps),
        class_members:makeClassMembersState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(ClasssMemberAddFriend);