import React, { Component } from "react"
import {
  AppRegistry,
  Button,
  StyleSheet,
  Text,
  View,
  Alert,
  NativeModules,
  TouchableOpacity } from "react-native"

import Constant from '../Utils/Constant'
import {saveAsyncStorage} from '../Utils/Helpers'

const { RNTwitterSignIn } = NativeModules

// const Constants = {
//   //Dev Parse keys
//   TWITTER_COMSUMER_KEY: "a7SsmDvq3XwzSN0za5uokCiBT",
//   TWITTER_CONSUMER_SECRET: "765FrNfImzNSWGKjbQSId3wI86EdiD7QxQKeJWSbhvqMMPTmCf"
// }

export default class TwitterButton extends Component {
  // state = {
  //   isLoggedIn: false
  // }

  _twitterSignIn = () => {
    _this = this.props
    RNTwitterSignIn.init(Constant.TWITTER_COMSUMER_KEY, Constant.TWITTER_CONSUMER_SECRET)
    RNTwitterSignIn.logIn()
      .then(loginData => {
        const { authToken, authTokenSecret } = loginData
        if (authToken && authTokenSecret) {
    
          saveAsyncStorage(Constant.USER_LOGIN, {"provider": Constant.PROVIDERS.TWITTER}).then((data)=>{
            if(data.status){
              let {navigator} = _this
              navigator.navigate("App")
            }
          }).catch((error)=>{
            console.log(error)
          })
        }
      })
      .catch(error => {
        console.log(error)
      }
    )
  }

  handleLogout = () => {
    // console.log("logout")
    // RNTwitterSignIn.logOut()
    // this.setState({
    //   isLoggedIn: false
    // })
  }

  render() {
    // const { isLoggedIn } = this.state

    let {navigator} = this.props
    console.log(navigator)
    
    return (
      <View style={{padding:10}}>
        <TouchableOpacity 
          onPress={this._twitterSignIn}
          style={{backgroundColor:'#4da6ea', padding: 10, alignItems:'center'}}>
            <Text
              style={{color:'white', fontSize: 18, fontWeight:'700'}}>
              Login with Twitter
            </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1b95e0',
    color: 'white',
    width: 200,
    height: 50
  }
})