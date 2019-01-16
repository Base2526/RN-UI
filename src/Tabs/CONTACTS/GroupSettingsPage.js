import React from 'react'
import {View, 
        Alert, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity, 
        TouchableHighlight} from 'react-native'
import { connect } from 'react-redux';


import {getStatusBarHeight} from '../../Utils/Helpers'

import * as actions from '../../Actions'

class GroupSettingsPage extends React.Component{
    constructor(props) {
        super(props)
    }

    render(){
        return(<View style={{flex:1}}>
                <View style={{ height:60, marginTop:getStatusBarHeight()}}>
                    <TouchableOpacity 
                        style={{
                                borderWidth: 1, 
                                borderColor: 'red',
                                borderRadius: 15,
                                height:30, 
                                width:30,
                                justifyContent: 'center', 
                                alignItems: 'center',
                                position:'absolute',
                                right:0,
                                margin:10
                                    }}
                        onPress={()=>{
                            this.props.navigation.goBack()
                        }}>
                        <Text style={{color:'red', fontSize:22}}>X</Text>
                    </TouchableOpacity> 
                </View>
                <Text>GroupSettingsPage</Text>
            </View>)
    }
}

const mapStateToProps = (state) => {
    console.log(state)

    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
      auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(GroupSettingsPage);