import React, { Component } from 'react';
import {Alert,
        Text,
        TouchableOpacity,
        View, } from 'react-native';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import {QRscanner, QRreader} from 'react-native-qr-scanner';
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image'

import * as actions from '../../Actions'
import {getUid, getHeaderInset} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';
import Constant from '../../Utils/Constant'

class ResultScanForQRcode extends Component {
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
                <View style={{marginRight:10}}>
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
                <View style={{marginRight:10}}>
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
            friend:{},
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({handleCancel: this.handleCancel })
        this.props.navigation.setParams({handleScanAgain: this.handleScanAgain })

        const { state, setParams, navigate } = this.props.navigation;
        const params = state.params || {};

        const { navigation } = this.props;
        const friend = navigation.getParam('friend', null);

        this.setState({friend})
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

    render() {
        let {friend} = this.state

        console.log(friend)

        let btn = <View />
        switch(friend.friend_status){
            case Constant.FRIEND_STATUS_FRIEND:{
                btn =   <View style={{flexDirection:'row', marginTop:20}}>
                            <TouchableOpacity style={{padding:10, 
                                                    margin:5, 
                                                    borderColor:'gray', 
                                                    borderWidth:1}}
                                                onPress={()=>{
                                                    this.props.navigation.navigate("ChatPage")
                                                }}>
                                <Text>Chat</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{padding:10, 
                                                    margin:5, 
                                                    borderColor:'gray', 
                                                    borderWidth:1}}
                                                onPress={()=>{
                                                    this.props.navigation.navigate("FriendProfilePage",{'friend_id': friend.uid})
                                                }}>
                                <Text>View profile</Text>
                            </TouchableOpacity>
                        </View>;
                break;
            }
        }

        /*
            FRIEND_STATUS_FRIEND: '10',
    FRIEND_STATUS_FRIEND_CANCEL: '13',
    FRIEND_STATUS_FRIEND_CANCEL_FROM_FRIEND: '40', 
    FRIEND_STATUS_FRIEND_REQUEST: '11',
    FRIEND_STATUS_WAIT_FOR_A_FRIEND: '12',
    FRIEND_STATUS_FRIEND_REMOVE: '41',
    FRIEND_STATUS_FRIEND_99:'45',
        */

        return (
        <View style={{flex: 1, alignItems:'center',marginTop:40}}>
            <Spinner
            visible={this.state.loading}
            textContent={'Wait...'}
            textStyle={{color: '#FFF'}}
            overlayColor={'rgba(0,0,0,0.5)'}/>
            <FastImage
                style={{width: 120, height: 120, borderRadius: 60, borderWidth:.5, borderColor:'gray'}}
                source={{
                    uri: friend.image_url,
                    headers:{ Authorization: 'someAuthToken' },
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
            <Text style={{fontSize:22, marginTop:10}}>{friend.name}</Text>
            {btn}
        </View>
        )
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
    // groups:state.auth.users.groups
  }
}

export default connect(mapStateToProps, actions)(ResultScanForQRcode);


