import React from "react";
import { View, 
        TouchableOpacity,
        Text,
        SafeAreaView } from "react-native";
import { Card, Button, FormLabel, FormInput } from "react-native-elements";
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';

import * as actions from '../Actions'

class SignIn extends React.Component{
  constructor(props){
    super(props)

    this.state={
      loading: false,
      email:'',
      password:''
    }
  }

  onLogin(){
    let _email    = this.state.email.trim()
    let _password = this.state.password.trim()

    if(_email === '' && _password === ''){
      alert("Name or Email and Password is empty.")
    }else if(_email === ''){
      alert("Name or Email is empty.")
    }else if(_password === ''){
      alert("Password is empty.")
    }else{
      this.setState({loading:true})
      this.props.actionLogin({email:_email, password:_password}).then((result) => {
        // console.log(result)
        this.setState({loading:false})
        if(result.status){
          this.props.navigation.navigate("AuthLoading") 
        }else{
          setTimeout(() => {
            alert(result.error_message)
          }, 100);
        }
      })
    }
  }

  render(){
    let {navigation, isLogin} = this.props

    return (
    <SafeAreaView style={{flex:1}}>
    <View style={{ flex:1, paddingVertical: 20, backgroundColor:'white' }}>
      {/* <Card title="SIGN IN"> */}

        <Spinner
          visible={this.state.loading}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
          overlayColor={'rgba(0,0,0,0.5)'}
        />
        <FormLabel>Name or Email</FormLabel>
        <FormInput 
          placeholder="name or email..." 
          ref= {(el) => { this.email = el; }}
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}/>
        <FormLabel>Password</FormLabel>
        <FormInput 
          secureTextEntry 
          placeholder="password..." 
          ref= {(el) => { this.password = el; }}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}/>

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
              this.onLogin()
              /*
              saveDataLocal(Constant.USER_LOGIN, {"provider": Constant.PROVIDERS.EMAIL}).then((data)=>{
                if(data.status){
                  navigation.navigate("Main")
                }
              }).catch((error)=>{
                console.log(error)
              })
              */
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
    </View>
    </SafeAreaView>)
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return({
      loading:state.auth.loading,
      isLogin:state.auth.isLogin
  })
}

export default connect(mapStateToProps, actions)(SignIn)