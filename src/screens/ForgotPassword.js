import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import { Card, Button, FormLabel, FormInput } from "react-native-elements";

import Spinner from 'react-native-loading-spinner-overlay';

import {forget_password} from '../utils/Services'
import {validateEmail} from '../utils/Helpers'

export default class ForgotPassword extends React.Component{

    constructor(props){
        super(props)
    
        this.state = {
            isShowSpinner: false,
            email:'',
        }
    }

    _forget_password(){
        // console.log('_forget_password : ' + this.state.email)

        if(this.state.email === '' ){
            alert("Email is empty.")
        }else if(!validateEmail(this.state.email)){
            alert("Email is Not Correct")
        }else{
            console.log('success forget password')

            this.setState({
                email:''
            })

            this.props.navigation.goBack()
        }
    }

    render(){

        let {navigation} = this.props

        return(
            <View style={{flex:1, backgroundColor:'white'}}>
                <Spinner
                    visible={this.state.isShowSpinner}
                    textContent={'Loading...'}
                    textStyle={{color: '#FFF'}}
                    overlayColor={'rgba(0,0,0,0.5)'}
                />
        
                <FormLabel>Email</FormLabel>
                <FormInput placeholder="Email..." 
                ref= {(el) => { this.email = el; }}
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}/>
            
                <View style={{padding:10}}>
                    <TouchableOpacity
                    style={{backgroundColor:'#03A9F4', padding: 10, alignItems:'center'}}
                    onPress={() => {
                        // saveDataLocal(Constant.USER_LOGIN, {"provider": Constant.PROVIDERS.EMAIL}).then((data)=>{
                        // if(data.status){
                        //     
                        // }
                        // }).catch((error)=>{
                        // console.log(error)
                        // })
                        // navigation.goBack()

                        this._forget_password()
                    }}>
                    <Text style={{color:'white', fontSize: 18, fontWeight:'700'}}>SEND</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}