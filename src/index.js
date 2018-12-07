import React from "react";
import {StyleSheet, 
        Text, 
        View , 
        AsyncStorage, 
        SafeAreaView,
        AppState} from "react-native";

import * as firebase from "firebase";

import {db} from './Utils/Firebase'

import { createRootNavigator } from "./App"; 
import Constant from './Utils/Constant'
import {loadDataLocal} from './Utils/Helpers'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedSignIn: false,
      signedIn: false,
      appState: AppState.currentState
    };
  }

  componentDidMount() {

    // console.log("componentDidMount")
    AppState.addEventListener('change', this._handleAppStateChange);
    AppState.addEventListener('memoryWarning', this._handleAppStateChange);

    this.isSignedIn()

    db.ref('/items').set({
      date_of_birth: "June 23, 1912",
      full_name: "Alan Turing",
      name: "Somkid Simajarn"
    });

    db.ref('/items').on("child_added", (snapshot, prevChildKey) => {
      var newPost = snapshot.val();
      // console.log("Author: " + newPost.author);
      // console.log("Title: " + newPost.title);
      // console.log("Previous Post ID: " + prevChildKey);

      console.log('1, child_added')
      console.log(newPost)
      console.log('2, child_added')
    });

    db.ref('/items').on("child_changed", (snapshot) => {
      var changedPost = snapshot.val();
      console.log('1, child_changed')
      console.log(changedPost);
      console.log('2, child_changed')
    });

    db.ref('/items/kid').on("child_removed", function(snapshot) {
      var deletedPost = snapshot.val();
      // console.log("The blog post titled '" + deletedPost.title + "' has been deleted");

      console.log('1, child_changed')
      console.log(deletedPost);
      console.log('2, child_changed')
    });

    // ref.off("value");
    db.ref('/items').off()
  }

  componentWillReceiveProps(){
    console.log("componentWillReceiveProps")
  }

  componentWillUnmount(){
    console.log("componentWillUnmount")

    AppState.removeEventListener('change', this._handleAppStateChange);
    AppState.removeEventListener('memoryWarning', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    // if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
    //   console.log('App has come to the foreground!')
    // }
    
    if (nextAppState === 'active') {
      // do this
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      // do that
    }

    console.log("nextAppState : " + nextAppState)
    this.setState({appState: nextAppState});
  }

  isSignedIn(){
    loadDataLocal(Constant.USER_LOGIN).then((data) => {      
      if(data.status){
        let value = JSON.parse(data.value)
        this.setState({
          checkedSignIn: true,
          signedIn: true
        })
      }else{
        this.setState({
          checkedSignIn: true,
          signedIn: false
        })
      }
    }).catch((error)=>{
      this.setState({
        checkedSignIn: true,
        signedIn: false
      })
    })
  };

  render() {
    const { checkedSignIn, signedIn } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return null;
    }

    const Layout = createRootNavigator(signedIn);
    return <Layout />;
  }
}
