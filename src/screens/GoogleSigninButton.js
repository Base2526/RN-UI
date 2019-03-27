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

import { GoogleSignin, statusCodes } from 'react-native-google-signin';

export default class GoogleSigninButton extends Component {

    constructor(props){
        super(props)

        this.state = {
            isLoggedIn: false,
            userInfo:{}
        }
    }

    componentDidMount(){
        GoogleSignin.configure({
            webClientId: "655213023351-ki4m9r9l0h1sav8cgu8ikmtoc5qtdq0m.apps.googleusercontent.com",
            offlineAccess: false,
            scopes: ['email'],
          });

    }

    // Somewhere in your code
    _signIn = async () => {
        console.log("google init")

        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            this.setState({ userInfo });
            console.log("google success")
        } catch (error) {
            console.log(error)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };

    render(){
            return (<View>
                <TouchableOpacity
                    onPress={this._signIn}
                    style={{padding: 10, borderWidth:1, backgroundColor:'red'}}>
                    <Text>Login with Google</Text>
                </TouchableOpacity>
                </View>)   
    }
}