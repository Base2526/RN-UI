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

const FBSDK = require('react-native-fbsdk');
const { LoginButton, AccessToken, LoginManager } = FBSDK;

import Constant from '../Utils/Constant'
import {saveAsyncStorage} from '../Utils/Helpers'

import {login_with_social} from '../Utils/Services'

export default class FBButton extends Component {

    constructor(props){
        super(props)

        // this.facebookLogin = this.facebookLogin.bind(this)
    }

    componentDidMount(){
        // AccessToken.getCurrentAccessToken().then(
        //     (data) => {
        //         // console.log(data)

        //         if(data){
        //             this.setState({
        //                 isLoggedIn: true
        //             })
        //         }
        //     }
        // )
    }

    facebookLogout(){
        LoginManager.logOut()
    }

    _facebookSignIn = () => {
        console.log("#1");
        _this = this.props
        LoginManager.logInWithReadPermissions(["public_profile"]).then(
            function(result) {
                if (result.isCancelled) {
                    console.log("Login cancelled");
                } else {

                    console.log(result)
                    
                    // saveAsyncStorage(Constant.USER_LOGIN, {"provider": Constant.PROVIDERS.FACEBOOK}).then((data)=>{
                    //     if(data.status){
                    //       let {navigator} = _this
                    //       navigator.navigate("Main")

                    //     }
                    // }).catch((error)=>{
                    //     console.log(error)
                    // })
                }
            },
            function(error) {
                console.log("Login fail with error: " + error);
            }
        );
    }

    render(){
        return (<View style={{padding:10}}>
                    <TouchableOpacity
                    onPress={()=>this._facebookSignIn()}
                    style={{backgroundColor:'#3a579d', padding: 10, alignItems:'center'}}>
                        <Text style={{color:'white', fontSize: 18, fontWeight:'700'}}>Login with facebook</Text>
                    </TouchableOpacity>
                </View>)
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