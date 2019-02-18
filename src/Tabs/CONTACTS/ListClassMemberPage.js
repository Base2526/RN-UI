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

import * as actions from '../../Actions'
import {getUid} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';

class ListClassMemberPage extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: "Class members",
        headerTintColor: '#C7D8DD',
        headerStyle: {
            backgroundColor: 'rgba(186, 53, 100, 1.0)',
  
            // ios navigationoptions underline hide
            borderBottomWidth: 0,
  
            // android navigationoptions underline hide
            elevation: 0,
            shadowOpacity: 0
        },
        // headerRight: (
        //     <View style={{flexDirection:'row', flex:1}}>
        //         <TouchableOpacity
        //             style={{padding:5}}
        //             // disabled={isModify ? false: true}
        //             onPress={() => {
        //                 const { params = {} } = navigation.state
        //                 params.handleSetting()
        //             }}>
        //             <MyIcon
        //                 name={'settings'}
        //                 size={25}
        //                 color={'#C7D8DD'} />
        //         </TouchableOpacity>
        //     </View>
        // ),
    });

    constructor(){
        super();
        this.state = { 
            renderContent: false,
            class_id: 0,
            loading: false,
            data: []
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({handleSetting: this.handleSetting })
        this.props.navigation.setParams({handleAddFriend: this.handleAddFriend })
        
        setTimeout(() => {this.setState({renderContent: true})}, 0);

        const { navigation } = this.props;
        const class_id = navigation.getParam('class_id', null);

        this.setState({class_id},()=>{
            this.loadData(this.props)
        })

        /*
        const { navigation } = this.props;
        const data = navigation.getParam('data', null);

        this.setState({class_id:data.class_id})

        _this = this

        let newData = []
        if(data.members !== undefined){
            _.each(data.members, function(_v, _k) { 
                if(_v.status){
                    
                    var friend = _this.getArrFriends().find(function(element) { 
                        return element.friend_id == _v.friend_id; 
                    }); 
                    // console.log(friend)

                    newData.push(friend)
                } 
            })
        }
        this.setState({data:newData})
        */
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
        /*
        let classs = nextProps.auth.users.classs
        let arr_classs = Object.keys(classs).map((key, index) => {
            return {...{class_id:key}, ...classs[key]};
        })

        let {class_id} = this.state
        var v = arr_classs.find(function(element) { 
            return element.class_id == class_id; 
        }); 

        _this = this

        let newData = []
        if(v.members !== undefined){
            _.each(v.members, function(_v, _k) { 
                if(_v.status){
                    
                    var friend = _this.getArrFriends().find(function(element) { 
                        return element.friend_id == _v.friend_id; 
                    }); 
                    // console.log(friend)

                    newData.push(friend)
                } 
            })
        }

        this.setState({data:newData})
        */
    }

    loadData = (props) =>{
        let {class_id} = this.state
        let {friends, classs} = props

        console.log(friends, classs, class_id)
        let cla = _.find(classs,  function(v, k) { 
            return k == class_id; 
        })

        if(cla === undefined || cla.members === undefined){
            this.props.navigation.goBack(null)
        }

        let newData = []
        _.each(cla.members, (v, k)=>{
            if(v.status){
                // return {...{friend_id:key}, ...friends[key]};
                friend =_.find(friends, (vv, kk)=>{
                            return v.friend_id == kk
                        })
                
                newData.push( {...{friend_id:v.friend_id}, ...{member_item_id:k}, ...friend} )
            }
        })

        console.log(newData)
        this.setState({data:newData})
    }

    handleSetting = () => {
        // this.props.navigation.goBack(null)

        this.props.navigation.navigate('ClasssSettingsPage')
    }

    handleAddFriend = () => {
        this.props.navigation.navigate("ClasssMemberAddFriend", {'class_id':this.state.class_id})
    }

    FlatListItemSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#CED0CE",
            //   marginLeft: "14%"
            }}
          />
        );
    }

    renderItem = ({item, index}) => { 
        let swipeoutRight = [
            {
                component: <View style={{flex: 1, 
                                        justifyContent:'center', 
                                        alignItems:'center'}}>
                                        <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>Delete</Text>
                            </View>,
                backgroundColor: 'red',
                onPress: () => { 
                    console.log(item)

                    this.setState({loading:true})

                    // console.log(this.props.uid, this.state.class_id, item.member_item_id)
                    this.props.actionDeleteClassMember(this.props.uid, this.state.class_id, item.member_item_id, (result) => {
                        console.log(result)
                        this.setState({loading:false})
                    })
                }
            }
        ]

        return( 
            <Swipeout 
                style={{backgroundColor:'white'}} 
                right={swipeoutRight}>
                <TouchableOpacity   
                onPress={()=>{  
                            this.props.navigation.navigate("FriendProfilePage",{'friend_id': item.friend_id})
                            }}>
                <View style={{flex:1, height:100, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                    <FastImage
                        style={{width: 60, height: 60, borderRadius: 10, borderColor:'gray', borderWidth:1}}
                        source={{
                            uri: item.profile.image_url,
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}/>
                    <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                        <Text style={{fontSize:18}}>{item.profile.name}</Text>
                    </View>
                </View>
                </TouchableOpacity>
            </Swipeout>)
    }

    render() {
        let {renderContent, data} = this.state;
        return (
            <View style={{ flex:1}}>
            <Spinner
                visible={this.state.loading}
                textContent={'Wait...'}
                textStyle={{color: '#FFF'}}
                overlayColor={'rgba(0,0,0,0.5)'}/>
            { renderContent &&
            <FlatList
                data={data}
                ItemSeparatorComponent = {this.FlatListItemSeparator}
                renderItem={this.renderItem}
                extraData={data}
                />
            }
                <ActionButton buttonColor="rgba(231,76,60,1)"
                    renderIcon={() => {
                        return(<MyIcon
                            name={'plus'}
                            size={25}
                            color={'#C7D8DD'} />)
                        }}>
                    <ActionButton.Item 
                        buttonColor='#3498db' 
                        title="Settings" 
                        onPress={() => {
                            this.props.navigation.navigate('ClasssSettingsPage', {'class_id':this.state.class_id})
                        }}>
                        <Text>
                            <MyIcon
                                name={'settings'}
                                size={25}
                                color={'#C7D8DD'} />
                        </Text>
                    </ActionButton.Item>
                    <ActionButton.Item 
                        buttonColor='#9b59b6' 
                        title="Add Friend" 
                        onPress={()=>{
                            this.props.navigation.navigate("ClasssMemberAddFriend", {'class_id':this.state.class_id})
                        }}>
                        <Text>
                            <MyIcon
                                name={'user-plus'}
                                size={25}
                                color={'#C7D8DD'} />
                        </Text>
                    </ActionButton.Item>
                </ActionButton>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    // console.log(state)
    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
        uid:getUid(state),
        friends:state.auth.users.friends,
        classs:state.auth.users.classs,
    }
}

export default connect(mapStateToProps, actions)(ListClassMemberPage);