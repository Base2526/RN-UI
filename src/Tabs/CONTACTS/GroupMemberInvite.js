import React from 'react'
import {View, 
        Alert, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity, 
        TouchableHighlight} from 'react-native'
import { connect } from 'react-redux';
import ProgressButton from 'react-progress-button'


import ImageWithDefault from '../../Utils/ImageWithDefault'
import {getStatusBarHeight} from '../../Utils/Helpers'
import * as actions from '../../Actions'

class GroupMemberInvite extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            data: [{id:1},{id:2},{id:3},{id:4}, ],
            buttonState: ''
        }
    }

    handleClick () {
        this.setState({buttonState: 'loading'})
        // make asynchronous call
        setTimeout(() => {
          this.setState({buttonState: 'success'})
        }, 3000)
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
                <View>

                <FlatList
                    data={this.state.data}
                    // renderItem={this.renderItem()}
                    renderItem={({ item }) => (
                        <View style={{flex:1, height:100, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                            <TouchableHighlight 
                                style={{height:60,
                                        width: 60,
                                        borderRadius: 10}}>
                                <ImageWithDefault 
                                source={{uri: ''}}
                                style={{width: 60, height: 60, borderRadius: 10, borderColor:'gray', borderWidth:1}}
                                />
                            </TouchableHighlight>
                            <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                            <Text style={{fontSize:18}}>'rowItem.name'</Text>
                            <ProgressButton onClick={this.handleClick} state={this.state.buttonState}>
                            Go!
                            </ProgressButton>
                        </View>
                        </View>
                    )}
                />
                </View>
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

export default connect(mapStateToProps, actions)(GroupMemberInvite);