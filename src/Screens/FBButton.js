import React, { Component } from "react"
import {
  AppRegistry,
  Button,
  StyleSheet,
  Text,
  View,
  Alert,
  NativeModules,
  TouchableOpacity
   } from "react-native"

// import { LoginButton, AccessToken } from 'react-native-fbsdk';

const FBSDK = require('react-native-fbsdk');
// const {LoginButton, ShareDialog, AccessToken} = FBSDK;

const {
    LoginButton,
    AccessToken,
    LoginManager
  } = FBSDK;

export default class FBButton extends Component {
    state = {
      isLoggedIn: false
    }
    
    constructor(props){
        super(props)

        this.facebookLogin = this.facebookLogin.bind(this)
    }

    facebookLogin() {
        // if(options) {
        //   LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_about_me']).then(
        //       function(result) {
        //           console.log(result)
        //         if (result.isCancelled) {
      
        //         } else {
        //           AccessToken.getCurrentAccessToken().then(function(data) {
        //             var accessToken = Firebase.auth.FacebookAuthProvider.credential(data.accessToken);
        //             handleFirebaseLogin(accessToken);
        //           }.bind(this));
        //         }
        //       }.bind(this),
        //       function(error) {
      
        //       }
        //     );
        // }
        // console.log(FBSDK)
        // console.log(LoginManager)
        LoginManager.logInWithReadPermissions(["public_profile"]).then(
            function(result) {
                console.log(result)
                if (result.isCancelled) {
                    console.log("Login cancelled");
                } else {
                    console.log(
                    "Login success with permissions: " +
                        result.grantedPermissions.toString()
                    );
                }
            },
            function(error) {
              console.log("Login fail with error: " + error);
            }
          );
      }

    render(){
        return (<View>
            <TouchableOpacity
            onPress={()=>this.facebookLogin()}>
                <Text>Login with facebook</Text>
            </TouchableOpacity></View>)

        return (<View>
             <LoginButton
          onLoginFinished={
            (error, result) => {
              if (error) {
                console.log("login has error: " + result.error);
              } else if (result.isCancelled) {
                console.log("login is cancelled.");
              } else {
                console.log("login is success.");
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    console.log(data.accessToken.toString())
                  }
                )
              }
            }
          }
          onLogoutFinished={() => console.log("logout.")}/>
          </View>)
    }
}