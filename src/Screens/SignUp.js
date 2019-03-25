import React from "react";
import { View, AsyncStorage, TouchableOpacity, Text } from "react-native";
import { Card, Button, FormLabel, FormInput } from "react-native-elements";

import Spinner from 'react-native-loading-spinner-overlay';

import Constant from '../utils/Constant'
import {validateEmail} from '../utils/Helpers'

import {register} from '../utils/Services'

export default class SignUp extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      isShowSpinner: false,
      email:'',
      password:'',
      confirmPassword:''
    }
  }

  _signUp(){
    console.log('email : ' + this.state.email + " , password : " + this.state.password + " , Confirm Password : " + this.state.confirmPassword)

    // if(!validateEmail(this.state.email)){
    //   alert("Email is Not Correct")
    // }else{
    //   alert("Email is Correct")
    // }

    if(this.state.email === '' && this.state.password === '' && this.state.confirmPassword === ''){
      alert("Email and Password and Confirm Password is empty.")
    }else if(this.state.email === ''){
      alert("Email is empty.")
    }else if(this.state.password === ''){
      alert("Password is empty.")
    }else if(this.state.confirmPassword === ''){
      alert("Confirm Password is empty.")
    }else if(this.state.password !== this.state.confirmPassword){
      alert("Password and Confirm Password is not match.")
    }else if(!validateEmail(this.state.email)){
      alert("Email is Not Correct")
    }else{
      // this.setState({isShowSpinner:true})
      // register(this.state.email, this.state.password).then(data => {
      //   this.setState({isShowSpinner:false})
      //   console.log(data)
      // })

      // console.log(this)

      this.props.navigation.goBack()
    }
  }

  render(){
    // let {navigation} = this.props
    return(<View style={{ flex:1, paddingVertical: 20, backgroundColor:'white' }}>
      {/* <Card title="SIGN UP"> */}
      <Spinner
          visible={this.state.isShowSpinner}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
          overlayColor={'rgba(0,0,0,0.5)'}
        />
        
        <FormLabel>Email</FormLabel>
        <FormInput 
          placeholder="Email address..." 
          ref= {(el) => { this.email = el; }}
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}/>
        <FormLabel>Password</FormLabel>
        <FormInput 
          secureTextEntry 
          placeholder="Password..." 
          ref= {(el) => { this.password = el; }}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
        />
        <FormLabel>Confirm Password</FormLabel>
        <FormInput 
          secureTextEntry 
          placeholder="Confirm Password..." 
          ref= {(el) => { this.confirmPassword = el; }}
          onChangeText={(confirmPassword) => this.setState({confirmPassword})}
          value={this.state.confirmPassword}
        />

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
              this._signUp()
              // navigation.goBack()
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

