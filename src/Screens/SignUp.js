import React from "react";
import { View, AsyncStorage, TouchableOpacity, Text } from "react-native";
import { Card, Button, FormLabel, FormInput } from "react-native-elements";
// import { onSignIn } from "../auth";

import Constant from '../Utils/Constant'
import {saveDataLocal} from '../Utils/Helpers'

export default class SignUp extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    let {navigation} = this.props
    return(<View style={{ flex:1, paddingVertical: 20, backgroundColor:'white' }}>
      {/* <Card title="SIGN UP"> */}
        <FormLabel>Email</FormLabel>
        <FormInput placeholder="Email address..." />
        <FormLabel>Password</FormLabel>
        <FormInput secureTextEntry placeholder="Password..." />
        <FormLabel>Confirm Password</FormLabel>
        <FormInput secureTextEntry placeholder="Confirm Password..." />

        {/* <Button
          buttonStyle={{ marginTop: 20 }}
          backgroundColor="#03A9F4"
          title="SIGN UP"
          // onPress={() => onSignIn()}
          onPress={() => {
            // AsyncStorage.setItem("auth-demo-key", "true", ()=>{
            //   navigation.navigate("Main")
            // })      
            
            saveDataLocal(Constant.USER_LOGIN, {"provider": Constant.PROVIDERS.EMAIL}).then((data)=>{
              if(data.status){
                navigation.navigate("Main")
              }
            }).catch((error)=>{
              console.log(error)
            })
          }
          }
        /> */}

        <View style={{padding:10}}>
          <TouchableOpacity
            style={{backgroundColor:'#03A9F4', padding: 10, alignItems:'center'}}
            onPress={() => {
              navigation.goBack()
            }}>
            <Text style={{color:'white', fontSize: 18, fontWeight:'700'}}>SIGN UP</Text>
          </TouchableOpacity>
        </View>

        {/* <Button
          buttonStyle={{ marginTop: 20 }}
          backgroundColor="transparent"
          textStyle={{ color: "#bcbec1" }}
          title="Sign In"
          // onPress={() => alert("go to sign in screen")}
          onPress={() => navigation.navigate("SignIn")}
        /> */}
      {/* </Card> */}
    </View>
    )
  }
}

