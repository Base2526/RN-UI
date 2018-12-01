import React from "react";
import { View, 
        TouchableOpacity,
        Text,
        AsyncStorage } from "react-native";
import { Card, Button, FormLabel, FormInput } from "react-native-elements";

import Constant from '../Utils/Constant'
import {saveDataLocal} from '../Utils/Helpers'

// export default ({navigation}) =>
export default class SignIn extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    let {navigation} = this.props
    return (<View style={{ flex:1, paddingVertical: 20, backgroundColor:'white' }}>
      {/* <Card title="SIGN IN"> */}
        <FormLabel>Email</FormLabel>
        <FormInput placeholder="Email address..." />
        <FormLabel>Password</FormLabel>
        <FormInput secureTextEntry placeholder="Password..." />

        {/* <Button
          buttonStyle={{ marginTop: 20 }}
          backgroundColor="#03A9F4"
          title="SIGN IN"
          onPress={() => {
            saveDataLocal(Constant.USER_LOGIN, {"provider": Constant.PROVIDERS.EMAIL}).then((data)=>{
              if(data.status){
                navigation.navigate("Main")
              }
            }).catch((error)=>{
              console.log(error)
            })
          }}
        /> */}

        <View style={{padding:10}}>
          <TouchableOpacity
            style={{backgroundColor:'#03A9F4', padding: 10, alignItems:'center'}}
            onPress={() => {
              saveDataLocal(Constant.USER_LOGIN, {"provider": Constant.PROVIDERS.EMAIL}).then((data)=>{
                if(data.status){
                  navigation.navigate("Main")
                }
              }).catch((error)=>{
                console.log(error)
              })
            }}>
            <Text style={{color:'white', fontSize: 18, fontWeight:'700'}}>SIGN IN</Text>
          </TouchableOpacity>
        </View>

        <View style={{padding:10}}>
          <TouchableOpacity
            style={{backgroundColor:'gray', padding: 10, alignItems:'center'}}
            onPress={() => {
              navigation.navigate('SignUp')
            }}>
            <Text style={{color:'white', fontSize: 18, fontWeight:'700'}}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      {/* </Card> */}

        <View style={{position:'absolute', bottom: 0, right: 0, padding:10, alignItems:'flex-end'}}>
          <TouchableOpacity
            // style={{backgroundColor:'gray', padding: 10, alignItems:'center'}}
            onPress={() => {
              navigation.navigate('ForgotPassword')
            }}>
            <Text style={{color:'black', fontSize: 18}}>Forgot Password</Text>
          </TouchableOpacity>
        </View>
    </View>)
  }
}
