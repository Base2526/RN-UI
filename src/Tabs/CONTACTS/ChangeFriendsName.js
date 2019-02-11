import React from 'react'

import {View, 
        Text, 
        TouchableOpacity,
        TextInput} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import * as actions from '../../Actions'
import {getUid} from '../../Utils/Helpers'

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

        if(friend.hasOwnProperty('change_friend_name')){
            this.setState({friend, text:friend.change_friend_name})
        }else{
            this.setState({friend, text:friend.profile.name})
        }
    }

    handleSave = () => {
        if(this.state.text.length == 0){
            alert('Name is empty?')
        }else{

        }
    }

    // onSave = () => {
    //     // this.setState({name:this.state.text})

    //     // this.props.navigation.goBack()

    //     // console.log(this.state.friend)

    //     this.props.actionChangeFriendsName(this.props.uid, this.state.friend.friend_id, this.state.text, (result)=>{
    //         // console.log(result)
    //         this.props.navigation.goBack()
    //     })
    // }

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

const mapStateToProps = (state) => {
    console.log(state)
    return({
        uid:getUid(state)
    })
}
  
export default connect(mapStateToProps, actions)(ChangeFriendsName);