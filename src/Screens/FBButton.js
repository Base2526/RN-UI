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
    // state = {
    //   isLoggedIn: false
    // }
    
    constructor(props){
        super(props)

        this.state = {
            isLoggedIn: false
        }

        this.facebookLogin = this.facebookLogin.bind(this)
        this.facebookLogout = this.facebookLogout.bind(this)
    }

    componentDidMount(){
        AccessToken.getCurrentAccessToken().then(
            (data) => {
                console.log(data)
                if(data){
                    this.setState({
                        isLoggedIn: true
                    })
                }
            }
        )
    }

    facebookLogout(){
        console.log("facebookLogout")
        LoginManager.logOut()

        this.setState({
            isLoggedIn: false
        })
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

        console.log("facebookLogin")

        // AccessToken.getCurrentAccessToken().then(
        //     (data) => {
        //         console.log(data)
        //         if(data){
        //             this.setState({
        //                 isLoggedIn: true
        //             })
        //         }
        //     }
        // )

        LoginManager.logInWithReadPermissions(["public_profile"]).then(
            function(result) {
                // console.log(result)
                if (result.isCancelled) {
                    console.log("Login cancelled");
                    this.setState({
                        isLoggedIn: false
                    })
                } else {
                    console.log("Login success with permissions: " +
                        result.grantedPermissions.toString()
                    );

                    this.setState({
                        isLoggedIn: true
                    })
                }
            },
            function(error) {
                console.log("Login fail with error: " + error);
                this.setState({
                    isLoggedIn: false
                })
            }
          );
      }

    render(){
            console.log("this.state.isLoggedIn : " + this.state.isLoggedIn)


            // return (<View>
            //     <TouchableOpacity
            //         onPress={()=>this.facebookLogin()}>
            //         <Text>Login with facebook</Text>
            //     </TouchableOpacity>
            //         <TouchableOpacity
            //             onPress={()=>this.facebookLogout()}
            //             style={{padding:10}}>
            //             <Text>Logout</Text>
            //         </TouchableOpacity>
            //     </View>)
                    if(this.state.isLoggedIn){
                        return (<View>
                            <TouchableOpacity
                                onPress={()=>this.facebookLogin()}>
                                <Text>Login with facebook</Text>
                            </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={()=>this.facebookLogout()}
                                    style={{padding:10}}>
                                    <Text>Logout</Text>
                                </TouchableOpacity>
                            </View>)
                    }else{
                        return (<View>
                            <TouchableOpacity
                            onPress={()=>this.facebookLogin()}>
                                <Text>Login with facebook</Text>
                            </TouchableOpacity>
                            
                            </View>)
                    }

        /*
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

             <TouchableOpacity
            onPress={()=>this.facebookLogout()}
            style={{padding:10}}>
                <Text>Logout</Text>
            </TouchableOpacity>
          </View>)
          */
    }
}