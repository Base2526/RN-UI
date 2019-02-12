import React from 'react'
import {FlatList, 
        StyleSheet, 
        View, 
        Text, 
        Alert, 
        TouchableOpacity,
        TouchableHighlight,
        Image} from 'react-native'

import ExpandableList from 'react-native-expandable-section-flatlist'
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';

import Swipeout from 'react-native-swipeout'

var _ = require('lodash');
import ImageWithDefault from '../../Utils/ImageWithDefault'
import * as actions from '../../Actions'

import Constant from '../../Utils/Constant'
import MyIcon from '../../config/icon-font.js';

import {getUid, getHeaderInset} from '../../Utils/Helpers'

class ListGroupMemberPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "List members",
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
            <View style={{paddingLeft:10}}>
                <TouchableOpacity 
                    onPress={()=>{
                        // GroupMemberInvite
                        const { params = {} } = navigation.state
                        params.handleInvite()
                    }}>
                    <Text style={{color:'#C7D8DD', fontSize:18, fontWeight:'bold'}}>Invite</Text>
                </TouchableOpacity> 
            </View>
        ),
        headerRight: (
            <View style={{marginRight:10}}>
                <TouchableOpacity
                    style={{padding:5}}
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
    });

    constructor(){
        super();
        this.state = { 
            renderContent: false,
            data:[]
        }
    }

    componentWillMount(){
        console.log(this.props.groups)

        this.props.navigation.setParams({handleCancel: this.handleCancel })
        this.props.navigation.setParams({ handleInvite: this.handleInvite })

        const { navigation } = this.props;
        const group_id = navigation.getParam('group_id', null);
        
        let group = _.find(this.props.groups,  function(v, k) { 
            return k == group_id
        })

        this.loadData(group)
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);

        const { navigation } = this.props;
        const group_id = navigation.getParam('group_id', null);
        
        let group = _.find(nextProps.groups,  function(v, k) { 
            return k == group_id
        })

        // this.loadData(group)
        console.log(group)
    }

    getGroupId = () =>{
        const { navigation } = this.props;
        return  navigation.getParam('group_id', null);
    }

    loadData = (group) =>{

        let members = []
        let pending = []
        let decline = []
        _.each(group.members,  function(_v, _k) { 
            switch(_v.status){
                case Constant.GROUP_STATUS_MEMBER_INVITED:{
                    pending.push({
                        item_id:_k,
                        friend_id:_v.friend_id,
                        name:_v.friend_name,
                        status:_v.status,
                        image_url:_v.friend_image_url
                    })
                    break;
                }
                case Constant.GROUP_STATUS_MEMBER_JOINED:{
                    members.push({
                        item_id:_k,
                        friend_id:_v.friend_id,
                        name:_v.friend_name,
                        status:_v.status,
                        image_url:_v.friend_image_url
                    })
                    break;
                }
                case Constant.GROUP_STATUS_MEMBER_DECLINE:{
                    decline.push({
                        item_id:_k,
                        friend_id:_v.friend_id,
                        name:_v.friend_name,
                        status:_v.status,
                        image_url:_v.friend_image_url
                    })
                    break;
                }
            }
        });

        this.setState({
            data: [ {title: 'Members',member: members}, 
                    {title: 'Pending', member: pending},
                    {title: 'Decline', member: decline},]
        })
    }

    handleInvite = () => {
        const { navigation } = this.props;
        const group = navigation.getParam('group', null);
        this.props.navigation.navigate("GroupMemberInvite", {'group':group})
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    _renderRow = (rowItem, rowId, sectionId) => {

        console.log(rowItem)

        let swipeoutRight = []

        switch(rowItem.status){
            case Constant.GROUP_STATUS_MEMBER_INVITED:{
                swipeoutRight = [
                    {
                        // component: <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}><Text style={{color:'white'}}>Cancel</Text></View>,
                        component:  <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'red'}}>
                                        <Text style={{fontWeight:'bold', color:'white', fontSize:14}}>CANCEL</Text>
                                    </View>,
                        backgroundColor: 'red',
                        onPress: () => { 
                            alert('Cancel')
                        }
                    }
                ]
                break;
            }
            case Constant.GROUP_STATUS_MEMBER_JOINED:{
                swipeoutRight = [
                    {
                        // component: <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}><Text style={{color:'white'}}>Delete</Text></View>,
                        component:  <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'red'}}>
                                        <Text style={{fontWeight:'bold', color:'white', fontSize:14}}>DELETE</Text>
                                    </View>,
                        backgroundColor: 'red',
                        onPress: () => { 
                            alert('Delete')
                        }
                    }
                ]
                break;
            }

            case Constant.GROUP_STATUS_MEMBER_DECLINE:{
                return(<View style={{flex:1, height:100, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                            <TouchableHighlight 
                                style={{height:60,
                                        width: 60,
                                        borderRadius: 10}}>
                                <ImageWithDefault 
                                source={{uri: rowItem.image_url}}
                                style={{width: 60, height: 60, borderRadius: 10, borderColor:'gray', borderWidth:1}}
                                />
                            </TouchableHighlight>
                            <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                                <Text style={{fontSize:18}}>{rowItem.name}</Text>
                            </View>
                            <View style={{flexDirection:'row', position:'absolute', right:0, bottom:0, margin:5, }}>
                                <TouchableOpacity
                                    style={{padding:5, 
                                            borderColor:'green', 
                                            borderRadius:10, 
                                            borderWidth:.5,
                                            marginRight:5}}
                                    onPress={()=>{

                                        console.log(rowItem)

                                        console.log(this.getGroupId())
                                        
                                        // (uid, friend_id, group_id, item_id, callback) 
                                        // this.setState({loading:true})
                                        this.props.actionMemberInviteAgainGroup(this.props.uid, rowItem.friend_id, this.getGroupId(), rowItem.item_id, (result) => {
                                            console.log(result)

                                            // setTimeout(() => {
                                            //     this.setState({loading:false})
                                            // }, 100);
                                        })
                                        
                                    }}>
                                    <Text style={{color:'green'}}>Invite</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{padding:5, 
                                            borderColor:'red', 
                                            borderRadius:10, 
                                            borderWidth:.5}}
                                    onPress={()=>{
                                        alert('cancel')
                                    }}>
                                    <Text style={{color:'red'}}>Cancel</Text>
                                </TouchableOpacity>
                                </View>
                        </View>)
            }
        }
        
        return( 
            <Swipeout 
                style={{backgroundColor:'white'}} 
                right={swipeoutRight}>
                <View style={{flex:1, height:100, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                  <TouchableHighlight 
                      style={{height:60,
                              width: 60,
                              borderRadius: 10}}>
                      <ImageWithDefault 
                        source={{uri: rowItem.image_url}}
                        style={{width: 60, height: 60, borderRadius: 10, borderColor:'gray', borderWidth:1}}
                      />
                  </TouchableHighlight>
                  <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                    <Text style={{fontSize:18}}>{rowItem.name}</Text>
                 </View>
                </View>
            </Swipeout>)
    }

    _renderSection = (section, sectionId, state)  => {
        let {data} = this.state

        let m_length = data[sectionId].member.length
        if(m_length == 0){
            console.log('000001')
            return ;
        }

        let ic_collapse = <MyIcon name={state ? 'collapse-up' : 'collapse-down'}
                                  size={8}
                                  color={'#C7D8DD'} />
  
        return (
            <View
                style={{ 
                        height: 30, 
                        flexDirection: 'row',
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        borderBottomWidth: 0.5,
                        // borderBottomColor: DictStyle.colorSet.lineColor 
                        }}>
            <View style={{ flexDirection: 'row', 
                        alignItems: 'center'}}>
                <Text style={{ 
                                // fontSize: DictStyle.fontSet.mSize, 
                                color: 'gray',
                                paddingLeft: 10,
                                fontWeight:'700' }}>
                {section + "(" + m_length +")"}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {ic_collapse}
            </View>
            </View>
        )
    }
      
    render() {
        return (<ExpandableList
                    style={{flex:1}}
                    ref={instance => this.ExpandableList = instance}
                    dataSource={this.state.data}
                    headerKey="title"
                    memberKey="member"
                    renderRow={this._renderRow}
                    headerOnPress={(i, state) => {
                    } }
                    renderSectionHeaderX={this._renderSection}
                    openOptions={[0, 1, 2]}
                    removeClippedSubviews={false}
                />
        );
    }
}

const mapStateToProps = (state) => {
    console.log(state)

    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
        uid:getUid(state),
        groups:state.auth.users.groups
    }
}

export default connect(mapStateToProps, actions)(ListGroupMemberPage);