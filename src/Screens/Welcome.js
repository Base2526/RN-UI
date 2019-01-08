import React from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Platform,
    NativeModules
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

import { connect } from 'react-redux';
// import firebase from 'react-native-firebase';


// import { openDatabase } from 'react-native-sqlite-storage';

const { RNTwitterSignIn } = NativeModules

const FBSDK = require('react-native-fbsdk');
const { LoginButton, AccessToken, LoginManager } = FBSDK;

import firebase from 'react-native-firebase'

import Constant from '../Utils/Constant'
import {saveAsyncStorage} from '../Utils/Helpers'
import * as actions from '../Actions'

// import {watchTaskEvent} from '../Actions'

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      arg1: {}
    };

    this.unsubscribe = null;

    this.ref = firebase.firestore().collection('users')

    // console.log(this.ref);
    // let doc = this.ref.doc('548894').get()
    // if (doc.exists) {
    //   console.log(doc.data())
    // }
  }

  async load(id) {
    const doc = await this.ref.doc(id).get()
    if (doc.exists) {
      return doc.data()
    } else {
      const defaultDoc = {
        name: "ABC",
        age: 2
      }
      await this.ref.doc(id).set(defaultDoc)
      return doc
    }
  }

  // errorCB(err) {
  //   console.log("SQL Error: " + err);
  // }
  
  // successCB() {
  //   console.log("SQL executed fine");
  // }
  
  // openCB() {
  //   console.log("Database OPENED");
  // }

  onCollectionUpdate = (querySnapshot) => {
    console.log(querySnapshot)
  }

  componentDidMount(){

    // this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)

    // this.load('548894').then(data=>{
    //   console.log(data)
    // })

    // this.props.watchTaskEvent('12', this.props.dispatch)

    // addSnapshotListener
    // this.ref.doc(id).onSnapshot

    // this.ref.get().then(snapshot => {
    //   console.log(snapshot)
    // })


    // console.log("off firebase 001")
    // firebase.database().ref('/items').off()

    // var db
    // if(Platform.OS === 'ios'){
    //   db = openDatabase({ name: 'db.sql', createFromLocation : "~www/db.sql", location: 'Library'}, this.openCB, this.errorCB);
    // }else{
    //   db = openDatabase({ name: 'db.sql', createFromLocation : "~db.sql"}, this.openCB, this.errorCB);
    // }

    // console.log(db)
    /*
    Database.getConnection().transaction((tx) => {
      // SELECT name FROM sqlite_master WHERE type=\'table\'
      tx.executeSql("SELECT name FROM sqlite_master WHERE type=\'table\'", [], (tx, results) => {
        // console.log("Query completed");
  
        // Get rows with Web SQL Database spec compliance.
        // console.log(results.rows)
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          // console.log(`Employee name: ${row.name}, Dept Name: ${row.deptName}`);
        
          // console.log(row)
        }
        
        // console.log('len : ' + len)
  
        // Alternatively, you can use the non-standard raw method.
  
        
        // let rows = results.rows.raw(); // shallow copy of rows Array
        // rows.map(row => console.log(`Employee name: ${row.name}, Dept Name: ${row.deptName}`));
        
      });
    })
    */
  }

  __loading(){
    this.setState({
      loading:!this.state.loading
    })
  }

  _facebookSignIn = () => {
    // console.log("#1");
    _this = this.props
    LoginManager.logInWithReadPermissions(["public_profile"]).then(
        function(result) {
            if (result.isCancelled) {
                console.log("Login cancelled");
            } else {
                // this.setState({
                //   loading:true
                // })
                saveAsyncStorage(Constant.USER_LOGIN, {"provider": Constant.PROVIDERS.FACEBOOK}).then((data)=>{
                    if(data.status){
                      // let {navigator} = _this
                      _this.navigation.navigate("App")

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
      // onPress={this._facebookSignIn}
      onPress={()=>this.props.loginWithFacebook()}
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

          saveAsyncStorage(Constant.USER_LOGIN, {"provider": Constant.PROVIDERS.TWITTER}).then((data)=>{
            if(data.status){
              _this.navigation.navigate("App")
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
        {/* {this.renderFB()} */}
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

const mapStateToProps = (state) => {
  return({
      email:state.auth.email,
      password:state.auth.password,
      loading:state.auth.loading
  })
}

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return { dispatch, watchTaskEvent }
// }

export default connect(mapStateToProps, actions)(Welcome)

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