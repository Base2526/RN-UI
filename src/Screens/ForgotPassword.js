import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import { Card, Button, FormLabel, FormInput } from "react-native-elements";

export default class ForgotPassword extends React.Component{

    render(){

        let {navigation} = this.props

        return(
            <View style={{flex:1, backgroundColor:'white'}}>
                <FormLabel>Email</FormLabel>
                <FormInput placeholder="Email address..." />
            
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
                        navigation.goBack()
                    }}>
                    <Text style={{color:'white', fontSize: 18, fontWeight:'700'}}>SEND</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}