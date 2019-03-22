import React from 'react'
import {FlatList,  
        View, 
        Text, 
        TouchableOpacity,} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image'
import Swipeout from 'react-native-swipeout'
import { connect } from 'react-redux';
var _ = require('lodash');
import ActionButton from 'react-native-action-button';
import {
    MenuProvider,
    Menu,
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
} from 'react-native-popup-menu';

import * as actions from '../../Actions'
import {getHeaderInset, checkInternetDialog} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';

import {makeUidState, 
        makeClasssState,
        makeClassMembersState,
        makeFriendProfilesState,
    
        makeIsConnectedState} from '../../Reselect'

class ListClassMemberPage extends React.Component{
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
        headerRight: (
            <View style={{flexDirection:'row', flex:1}}>
                <TouchableOpacity
                    style={{paddingRight:10}}
                    // disabled={isModify ? false: true}
                    onPress={() => {
                        const { params = {} } = navigation.state
                        params.handleMemberAdd()
                    }}>
                    <MyIcon
                        name={'plus'}
                        size={25}
                        color={'#C7D8DD'} />
                </TouchableOpacity>
            </View>
        ),

        // 
    });

    constructor(){
        super();
        this.state = { 
            renderContent: false,
            loading: false,
            class_id: 0,
            data: []
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({handleMemberAdd: this.handleMemberAdd })
        
        setTimeout(() => {this.setState({renderContent: true})}, 0);

        const { navigation } = this.props;
        const class_id = navigation.getParam('class_id', null);

        console.log('class_id', class_id)
        this.setState({class_id},()=>{
            this.loadData(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData = (props) =>{
        let {class_id} = this.state
        let {friend_profiles, classs, class_members} = props

        let cla = _.find(classs,  function(v, k) { 
            return k == class_id; 
        })

        if(!cla){
            this.props.navigation.goBack(null)
            return;
        }

        let class_member =  _.find(class_members, (v, k)=>{
                                return k == class_id 
                            })

        let data = []
        _.map(class_member, (v, k)=>{
            if(v.status){
                let friend_profile =_.find(friend_profiles, (fv, fk)=>{
                        return v.friend_id == fk
                    })  
                data.push({friend_id:v.friend_id, member_key:k, friend_profile})
            }
        })

        this.setState({data})

        console.log(data, class_member)
    }

    handleMemberAdd = () => {
        this.props.navigation.navigate("ClasssMemberAddFriend", {'class_id':this.state.class_id})
    }

    ItemSeparatorComponent = () => {
        return (
          <View
            style={{
              height: .5,
              width: "86%",
              backgroundColor: "#CED0CE",
              marginLeft: "14%"
            }}
          />
        )
    }

    showMenu = (item)=>{

        let {is_connected} = this.props
        let {friend_id, member_key} = item
        return( <View style={{flex:1,
                              position:'absolute', 
                              top:0,
                              right:0, 
                              marginRight:10,}}>
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
                            this.props.navigation.navigate("FriendProfilePage",{'friend_id': friend_id})
                        }}>
                            <Text style={{padding:10, fontSize:18}}>View profile</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => {
                            if(!is_connected){
                                checkInternetDialog()
                                return 
                            }
  

                            this.setState({loading:true})
                            this.props.actionDeleteClassMember(this.props.uid, this.state.class_id, member_key, (result) => {
                                console.log(result)
                                this.setState({loading:false})
                            })
                        }}>
                            <Text style={{padding:10, fontSize:18}}>Remove from class</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
              </View>)
    }

    renderItem = ({item, index}) => { 
        return(
                <View style={{flex:1, 
                              padding:10, 
                              backgroundColor:'white', 
                              flexDirection:'row', 
                              alignItems:'center',}}>
                    <FastImage
                        style={{width: 50, 
                                height: 50, 
                                borderRadius: 10, 
                                // borderColor:'gray', 
                                // borderWidth:.5
                            }}
                        source={{
                            uri: item.friend_profile.image_url,
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}/>
                    <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                        <Text style={{fontSize:18}}>{item.friend_profile.name}</Text>
                    </View>
                    {this.showMenu(item)}
                </View>)
    }

    render() {
        let {renderContent, data, class_id} = this.state;

        if(!renderContent){
            return (<View style={{flex:1}}></View>)
        }
        return (
            <MenuContext>
            <View style={{ flex:1}}>
                <Spinner
                    visible={this.state.loading}
                    textContent={'Wait...'}
                    textStyle={{color: '#FFF'}}
                    overlayColor={'rgba(0,0,0,0.5)'}/>
                <FlatList
                    data={data}
                    ItemSeparatorComponent = {this.ItemSeparatorComponent}
                    renderItem={this.renderItem}
                    extraData={data}/>
            </View>
            </MenuContext>
        );
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
        uid:makeUidState(state, ownProps),
        friend_profiles:makeFriendProfilesState(state, ownProps),
        classs:makeClasssState(state, ownProps),
        class_members:makeClassMembersState(state, ownProps),

        is_connected:makeIsConnectedState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(ListClassMemberPage);