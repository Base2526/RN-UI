import React from 'react'

import {View, 
        Text, 
        TouchableOpacity,
        TextInput} from 'react-native';
import { connect } from 'react-redux';
import {getStatusBarHeight} from '../../Utils/Helpers'

import * as actions from '../../Actions'
import {getUid} from '../../Utils/Helpers'

class AddAnotherWebsite extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
        headerRight: (
            <View style={{marginRight:10}}>
            <TouchableOpacity
                style={{padding:5}}
                onPress={() => {
                    const { params = {} } = navigation.state
                    params.handleSave()
                }}>
                <Text style={{fontSize:18, color:'black'}}>ADD</Text>
            </TouchableOpacity>
            </View>
        ),
    })

    constructor(props){
        super(props)
        this.state ={
            friend: '',
            text: ''
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({handleSave: this.handleSave })

        const { navigation } = this.props;
        const mode = navigation.getParam('mode', null);
        console.log(mode)
    }

    handleSave = () => {
        /**
        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.onAddAnotherEmail(newData);
        */
    }
    
    render(){
        return( <View style={{flex:1}}>
                    
                    <View style={{margin:20}}>
                        <TextInput
                            style={{ fontSize: 22, padding:10, borderColor:'gray', borderWidth:.5}}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                            clearButtonMode='while-editing'
                            keyboardType="url"
                            placeholder= {this.state.text}
                        />
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
  
export default connect(mapStateToProps, actions)(AddAnotherWebsite);