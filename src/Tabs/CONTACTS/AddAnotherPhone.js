import React from 'react'

import {View, 
        Text, 
        TouchableOpacity,
        TextInput} from 'react-native';
import { connect } from 'react-redux';
import {getStatusBarHeight} from '../../Utils/Helpers'

import * as actions from '../../Actions'
import {validateMobile} from '../../Utils/Helpers'

class AddAnotherPhone extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        // title: "Add another phone",
        title: `${navigation.state.params.title}`,
        headerTintColor: 'white',
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
                <Text style={{fontSize:18, color:'white'}}>{navigation.state.params.mode == 'add' ? 'ADD' : 'UPDATE'}</Text>
            </TouchableOpacity>
            </View>
        ),
    })

    constructor(props){
        super(props)
        this.state ={
            mode:'add',
            key:'',
            text: ''
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({handleSave: this.handleSave })

        const { navigation } = this.props;
        const mode = navigation.getParam('mode', null);
        // console.log(mode)
        if(mode === 'edit'){
            const key = navigation.getParam('key', null);
            const value = navigation.getParam('value', null);

            this.setState({mode, key, text:value.phone_number})
        }
    }

    handleSave = () => {
        /**
        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.onAddAnotherEmail(newData);
        */

        if(!validateMobile(this.state.text)){
            // this.setState({text:''})
            alert('Not a valid Phone Number')
        }else{
            // console.log('validate phone')

            /**
             * เช็ดว่ามีอยู่ในระบบแล้วหรือไหม
             **/

            const { navigation } = this.props;
            navigation.goBack();
            navigation.state.params.onAddAnotherPhone({value: {phone_number: this.state.text, isVerify:false}, mode:this.state.mode, key:this.state.key });
        }
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
                            keyboardType="numeric"
                            placeholder= {this.state.text}
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
      
    return({
        // uid:getUid(state)
        auth:state.auth
    })
}
  
export default connect(mapStateToProps, actions)(AddAnotherPhone);