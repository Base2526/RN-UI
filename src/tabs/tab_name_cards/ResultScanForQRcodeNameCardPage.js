import React, { Component } from 'react';
import {Alert,
        Text,
        TouchableOpacity,
        View, } from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image'
var _ = require('lodash');

import * as actions from '../../actions'
import {randomKey, checkInternetDialog} from '../../utils/Helpers'
import MyIcon from '../../config/icon-font.js';
import Constant from '../../utils/Constant'

import {makeUidState, 
        // makeProfileState,
        // makeFriendsState,
        makeIsConnectedState,} from '../../reselect'

class ResultScanForQRcodeNameCardPage extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            // title: "Result scan",
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
                <View style={{marginLeft:5}}>
                    <TouchableOpacity
                        style={{padding:5}}
                        onPress={() => {
                            const { params = {} } = navigation.state
                            params.handleScanAgain()
                        }}>
                        <Text style={{color:"#C7D8DD", fontSize:18, fontWeight:'600'}}>Scan again</Text>
                    </TouchableOpacity>
                </View>
            ),
            headerRight: (
                <View style={{marginRight:5}}>
                    <TouchableOpacity
                        style={{padding:5}}
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
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            loading:false,
            // friend:{},
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({handleCancel: this.handleCancel })
        this.props.navigation.setParams({handleScanAgain: this.handleScanAgain })

        // const { navigation } = this.props;
        // const friend = navigation.getParam('friend', null);

        // // console.log(friend)
        // // this.setState({friend})

        // this.setState({friend}, ()=>{
        //     this.loadData(this.props)
        // })
    }

    componentWillReceiveProps(nextProps) {
        // let {friends} = nextProps
        // let {friend}  = this.state

        // let __  =   _.find(friends, (v, k)=>{
        //                 return k == friend.uid
        //             })
        
        // if(__){
        //     friend = {...friend, status:__.status}
        //     this.setState({friend})
        // }

        this.loadData(nextProps)
    }

    loadData = (props) =>{
        // let {friends} = props
        // let {friend}  = this.state

        // let __  =   _.find(friends, (v, k)=>{
        //     return k == friend.uid
        // })

        // if(__){
        //     friend = {...friend, status:__.status}
        //     this.setState({friend})
        // }
    }

    handleCancel = () => {
        const { state, setParams, navigate } = this.props.navigation;
        const params = state.params || {};
        params.close()

        this.props.navigation.goBack(null)
    }

    handleScanAgain = () =>{
        const { state, setParams, navigate } = this.props.navigation;
        const params = state.params || {};
        params.scanAgain()

        this.props.navigation.goBack(null)
    }

    addFriend = (friend_data) =>{
        /*
        let {uid, friends} = this.props
        let find_friend = _.find(friends, (v, k)=>{
                            return k == friend_id
                        })

        let chat_id = randomKey()
        if(find_friend){
            chat_id = find_friend.chat_id
        }

        console.log(chat_id)

        this.setState({loading:true})
        this.props.actionInviteFriend(uid, friend_id, chat_id, (result) => {
            this.setState({loading:false})
        })
        */

        let {uid, profile, friends} = this.props

        let chat_id = friend_data.chat_id
            
        friend_data = {...friend_data, status:Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND}
        
        let user_data = {uid, ...profile, chat_id, status:Constant.FRIEND_STATUS_FRIEND_REQUEST}

        // console.log(uid, friend_data.uid, user_data, friend_data)

        this.setState({loading:true})
        this.props.actionInviteFriend(uid, friend_data.uid, user_data, friend_data, (result) => {
            // this.setState({loading:false})

            // let new_friends = [...friends];
            // new_friends[index] = {...new_friends[index], status: Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND}
        
            // this.setState({friends: new_friends});

            this.setState({ loading:false, friend:{...friend_data, status: Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND} })
        })
    }

    render() {
        
        return (<View style={{flex: 1, alignItems:'center',marginTop:40}}>
                    <Spinner
                    visible={this.state.loading}
                    textContent={'Wait...'}
                    textStyle={{color: '#FFF'}}
                    overlayColor={'rgba(0,0,0,0.5)'}/>
                    <FastImage
                        style={{width: 120, height: 120, borderRadius: 60, borderWidth:.5, borderColor:'gray'}}
                        source={{
                            uri: '',
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    {/* <Text style={{fontSize:22, marginTop:10}}>{friend.name}</Text> */}
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
        // profile: makeProfileState(state, ownProps),
        // friends: makeFriendsState(state, ownProps),

        is_connected: makeIsConnectedState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(ResultScanForQRcodeNameCardPage);


