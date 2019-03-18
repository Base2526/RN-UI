import React from 'react'
import {View, 
        Text, 
        FlatList,} from 'react-native'
import { connect } from 'react-redux';
var _ = require('lodash')
import DeviceInfo from 'react-native-device-info';

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
import {makeUidState,  
        makePresencesState} from '../../Reselect'

import MyIcon from '../../config/icon-font.js';

class SettingListForceLogout extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: "Force Logout",
        headerTintColor: '#C7D8DD',
        headerStyle: {
          backgroundColor: 'rgba(186, 53, 100, 1.0)',
          // ios navigationoptions underline hide
          borderBottomWidth: 0,
  
          // android navigationoptions underline hide
          elevation: 0,
          shadowOpacity: 0
        },
    }) 

    constructor(props){
        super(props)

        this.state = {
            data:[]
        }
        
    }

    componentDidMount(){
        this.showMenu = this.showMenu.bind(this)
        this.loadData(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData = (props) =>{
        let {uid, presences} = props

        let presence =  _.find(presences, (v, k)=>{
                            return k == uid
                        })

        let data = []
        _.map(presence, (v, k)=>{
            if(v.udid != DeviceInfo.getUniqueID()){
                data.push({...v, presence_key:k})
            }
        })
        
        this.setState({data})
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
        return( <View style={{flex:1,
                                position:'absolute', 
                                top:0,
                                right:0, 
                                marginRight:10,
                                zIndex:100,
                                }}>
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
                            
                            // if(!is_connected){
                            // checkInternetDialog()
                            // return 
                            // }

                            // // this.setState({loading:true})
                            // this.props.actionFriendDelete(this.props.uid, item.friend_id, (result)=>{
                            //     console.log(result)
                            //     // this.setState({loading:false})
                            // })
                        }}>
                            <Text style={{padding:10, fontSize:18}}>Force logout</Text>
                        </MenuOption>
                    </MenuOptions>
                    </Menu>
                    </View>)
    }

    renderItem({ item, index }) {
        return(<View style={{paddingLeft:10, 
                            paddingTop:15, 
                            paddingBottom:15,
                            flexDirection:'row'}}>
                    <View style={{width: 16, 
                        height: 16, 
                        backgroundColor:'#00ff80', 
                        borderWidth: 2,
                        borderColor: 'white',
                        borderRadius: 8,
                        padding:10,
                        marginRight:10}} />
                    <View>
                        <Text>{item.model_number} ({item.platform})</Text>
                        <Text>{item.status}</Text>
                        {this.showMenu(item)}
                    </View>
                </View>)
    }
    
    render(){
        let {data} = this.state
        return(<MenuContext>
                <View style={{flex:1}}>
                    <FlatList
                        data={data}
                        renderItem={this.renderItem.bind(this)}
                        keyExtractor = { (item, index) => index.toString() } 
                        extraData={this.state}
                        // ItemSeparatorComponent = {this.ItemSeparatorComponent}
                        />
                </View>
                </MenuContext>)
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
        // device_access:state.auth.users.device_access
        uid: makeUidState(state, ownProps),
        presences: makePresencesState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(SettingListForceLogout);