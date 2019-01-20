import React from 'react'

import {View, 
        Text, 
        TouchableOpacity,
        TextInput} from 'react-native';
import { connect } from 'react-redux';
import {getStatusBarHeight} from '../../Utils/Helpers'

import * as actions from '../../Actions'
import {getUid} from '../../Utils/Helpers'

class AddAnotherPhone extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        // title: "Add another phone",
        title: `${navigation.state.params.title}`,
    })

    constructor(props){
        super(props)
        this.state ={
            friend: '',
            text: ''
        }
    }

    componentDidMount(){
        const { navigation } = this.props;
        const mode = navigation.getParam('mode', null);

        console.log(mode)

        // if(friend.hasOwnProperty('change_friend_name')){
        //     this.setState({friend, text:friend.change_friend_name})
        // }else{
        //     this.setState({friend, text:friend.profile.name})
        // }
    }

    onSave = () => {
        // this.setState({name:this.state.text})

        // this.props.navigation.goBack()

        // console.log(this.state.friend)

        // this.props.actionChangeFriendsName(this.props.uid, this.state.friend.friend_id, this.state.text, (result)=>{
        //     // console.log(result)
        //     this.props.navigation.goBack()
        // })
    }

    render(){

        // let {name} = this.state

        return( <View style={{flex:1}}>
                    
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
  
export default connect(mapStateToProps, actions)(AddAnotherPhone);