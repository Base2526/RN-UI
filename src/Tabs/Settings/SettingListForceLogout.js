import React from 'react'
import {View, Text, FlatList} from 'react-native'
import { connect } from 'react-redux';

import DeviceInfo from 'react-native-device-info';

import * as actions from '../../Actions'

class SettingListForceLogout extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            device_access:[]
        }
    }

    componentDidMount(){
        // console.log(this.props.device_access)
        this.setState({
            device_access:{...this.state.device_access, ...this.props.device_access}
        })
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.device_access)
        this.setState({
            device_access:{...this.state.device_access, ...nextProps.device_access}
        })
    }
    
    render(){

        // console.log(this.state.device_access)
        var tifOptions = [];
        let device_access = this.state.device_access;
        Object.keys(device_access).forEach(function(key) {
            // this.state.device_access[key]

            let _v = device_access[key];
            if(_v.udid !== DeviceInfo.getUniqueID()){
                tifOptions.push(device_access[key])
            }            
        })

        console.log(tifOptions)

        if(this.state.device_access.length == 0){
            return (<View style={{flex:1}}></View>)
        }

        return(
        <View style={{flex:1}}>
            <FlatList
                data={tifOptions}
                renderItem={({item}) => {
                    console.log(item)
                    return(<View style={{height:40, margin:10, backgroundColor:item.online!=0?'green':'red'}}>
                            <Text>{item.device_name}({item.platform})</Text>
                            <Text>status : {item.online==0? "OFFLINE": "ONLINE"}</Text>
                            </View>)
                }}
                extraData={this.state}
                />
        </View>)
    }
}

const mapStateToProps = (state) => {
    console.log(state)
  
    if(!state._persist.rehydrated){
        return {}
    }
    
    return{
        device_access:state.auth.users.device_access
    }
}

export default connect(mapStateToProps, actions)(SettingListForceLogout);