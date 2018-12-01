import React from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    NativeModules
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';


// import FBButton from './FBButton'

const { RNTwitterSignIn } = NativeModules

const FBSDK = require('react-native-fbsdk');
const { LoginButton, AccessToken, LoginManager } = FBSDK;

import Constant from '../Utils/Constant'
import {saveDataLocal} from '../Utils/Helpers'

// import TwitterButton from './TwitterButton';


export default class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      arg1: {}
    };
  }

  __loading(){
    this.setState({
      loading:!this.state.loading
    })

    console.log("isShow : " + isShow)
  }

  _facebookSignIn = () => {
    console.log("#1");
    _this = this.props
    LoginManager.logInWithReadPermissions(["public_profile"]).then(
        function(result) {
            if (result.isCancelled) {
                console.log("Login cancelled");
            } else {
                // this.setState({
                //   loading:true
                // })
                saveDataLocal(Constant.USER_LOGIN, {"provider": Constant.PROVIDERS.FACEBOOK}).then((data)=>{
                    if(data.status){
                      // let {navigator} = _this
                      _this.navigation.navigate("Main")

                    }
                }).catch((error)=>{
                    console.log(error)
                })
            }
        },
        function(error) {
            console.log("Login fail with error: " + error);
        }
    );
  }

  renderFB(){
    return (<View style={{padding:10}}>
      <TouchableOpacity
      onPress={this._facebookSignIn}
      style={{backgroundColor:'#3a579d', padding: 10, alignItems:'center'}}>
          <Text style={{color:'white', fontSize: 18, fontWeight:'700'}}>Login with facebook</Text>
      </TouchableOpacity>
    </View>)
  }

  _twitterSignIn = () => {
    _this = this.props
    RNTwitterSignIn.init(Constant.TWITTER_COMSUMER_KEY, Constant.TWITTER_CONSUMER_SECRET)
    RNTwitterSignIn.logIn()
      .then(loginData => {
        const { authToken, authTokenSecret } = loginData
        if (authToken && authTokenSecret) {

          saveDataLocal(Constant.USER_LOGIN, {"provider": Constant.PROVIDERS.TWITTER}).then((data)=>{
            if(data.status){
              _this.navigation.navigate("Main")
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

  renderTwitter(){
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

  render() {
    let {navigation} = this.props
    return (
      <View style={{flex: 1, backgroundColor:'white'}} >
        {/* <FBButton navigator={this.props.navigation} /> */}
        {this.renderFB()}
        {/* <TwitterButton navigator={this.props.navigation}  /> */}
        {/* {this.renderTwitter()} */}
        <View style={{padding:10}}>
        <TouchableOpacity
            style={{backgroundColor:'gray', padding: 10, alignItems:'center'}}
            onPress={()=>{
                      navigation.navigate('SignIn')
                  }}>
          <Text style={{color:'white', fontSize: 18, fontWeight:'700'}}>SignIn/SignUp</Text>
        </TouchableOpacity>
        </View>

        {
        this.state.loading && <Spinner
          visible={false}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
    backgroundColor: 'black',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
})