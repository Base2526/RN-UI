import React from 'react'

import {View, 
        Text, 
        TouchableOpacity,
        TextInput} from 'react-native';
import { connect } from 'react-redux';
import {getStatusBarHeight} from '../../Utils/Helpers'

import * as actions from '../../Actions'
import {getUid} from '../../Utils/Helpers'

class ChangeFriendsName extends React.Component{

    constructor(props){
        super(props)
        this.state ={
            friend: '',
            text: ''
        }
    }

    componentDidMount(){
        const { navigation } = this.props;
        const friend = navigation.getParam('friend', null);

        if(friend.hasOwnProperty('change_friend_name')){
            this.setState({friend, text:friend.change_friend_name})
        }else{
            this.setState({friend, text:friend.profile.name})
        }
    }

    onSave = () => {
        // this.setState({name:this.state.text})

        // this.props.navigation.goBack()

        // console.log(this.state.friend)

        this.props.actionChangeFriendsName(this.props.uid, this.state.friend.friend_id, this.state.text, (result)=>{
            // console.log(result)
            this.props.navigation.goBack()
        })
    }

    render(){

        // let {name} = this.state

        return( <View style={{flex:1}}>
                    <View style={{ height:40, 
                            marginTop:getStatusBarHeight(), 
                            justifyContent:'center', 
                            paddingLeft:10}}>
                        <Text style={{fontSize:22}}>Change friend's name</Text>
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
                                    margin:10,
                                    zIndex: 10,
                                        }}
                            onPress={()=>{
                                this.props.navigation.goBack()
                            }}>
                            <Text style={{color:'red', fontSize:16}}>X</Text>
                        </TouchableOpacity> 
                    </View>
                    <View style={{margin:20}}>
                        <TextInput
                            style={{ fontSize: 22, padding:10, borderColor:'gray', borderWidth:.5}}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                            clearButtonMode='while-editing'
                            placeholder= {this.state.text}
                        />
                        <View style={{alignItems:'center', marginTop:10}}>
                            <TouchableOpacity
                             style={{padding:10, 
                                    borderColor:'gray', 
                                    borderWidth:1, 
                                    width:120, 
                                    borderRadius:15, 
                                    alignItems:'center'}}
                                onPress={()=>{
                                    this.onSave()
                                }}>
                                <Text style={{fontSize:18}}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>)
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    return({
        uid:getUid(state)
    })
}
  
export default connect(mapStateToProps, actions)(ChangeFriendsName);