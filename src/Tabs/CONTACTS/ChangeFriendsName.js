import React from 'react'

import {View, 
        Text, 
        TouchableOpacity,
        TextInput,
        Alert} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import * as actions from '../../Actions'
import {getUid} from '../../Utils/Helpers'

import {makeUidState} from '../../Reselect'

class ChangeFriendsName extends React.Component{

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Change friend name",
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
                <View style={{marginRight:10}}>
                <TouchableOpacity
                    style={{padding:5}}
                    onPress={() => {
                        const { params = {} } = navigation.state
                        params.handleSave()
                    }}>
                    <Text style={{fontSize:18, color:'#C7D8DD', fontWeight:'bold'}}>Save</Text>
                </TouchableOpacity>
                </View>
            ),
        }
    }

    constructor(props){
        super(props)
        this.state ={
            friend: '',
            text: '',
            loading:false
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({handleSave: this.handleSave })

        const { navigation } = this.props;
        const friend = navigation.getParam('friend', null);

        if(friend.change_friend_name === undefined){
            this.setState({friend, text:friend.profile.name}) 
        }else{
            this.setState({friend, text:friend.change_friend_name})
        }
    }

    handleSave = () => {
        if(this.state.text.length == 0){
            alert('Name is empty?')
        }else{
            if(this.state.friend.change_friend_name === undefined){
                if(this.state.text === this.state.friend.profile.name){
                    this.props.navigation.goBack()
                    return;
                }
            }else{
                if(this.state.text === this.state.friend.change_friend_name){
                    this.props.navigation.goBack()
                    return;
                }
            }

            this.setState({loading:true})
            this.props.actionChangeFriendsName(this.props.uid, this.state.friend.friend_id, this.state.text, (result)=>{
                console.log(result)
                this.setState({loading:false})
                if(result.status){
                    this.props.navigation.goBack()
                }else{
                    setTimeout(() => {
                        Alert.alert(result.message);
                    }, 100);
                }
            })
        }
    }

    render(){
        return( <View style={{flex:1, margin:10}}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}
                    />
                    <View style={{alignItems:'flex-end', padding:5}}>
                        <Text>{this.state.text.length}/30</Text>
                    </View>
                    <TextInput
                        style={{ fontSize: 22, padding:10, borderColor:'gray', borderWidth:.5}}
                        onChangeText={(text) => this.setState({text})}
                        value={this.state.text}
                        clearButtonMode='while-editing'
                        maxLength={30}
                        placeholder= {this.state.text}
                    />
                </View>)
    }
}

const mapStateToProps = (state, ownProps) => {
    if(!state._persist.rehydrated){
        return {}
    }
  
    if(!state.auth.isLogin){
        return;
    }

    return({
        uid:makeUidState(state, ownProps)
    })
}
  
export default connect(mapStateToProps, actions)(ChangeFriendsName);