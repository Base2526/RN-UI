import React from "react";
import { StyleSheet, Text, View , AsyncStorage, SafeAreaView} from "react-native";

// import Component from "./screens/SignUp";
// import { SignedOut } from "./router";

// export default class App extends React.Component {
//   render() {
//     // return <Component />;
//     return <SignedOut />;
//   }
// }
// import {Welcome} from './screens/Welcome'

import { createRootNavigator } from "./App"; 
// import SignUp from "./screens/SignUp";

// export default class App extends React.Component {
//   render() {
//     return <SignedIn />;
//   }
// }

// import { isSignedIn } from "./auth";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }

  isSignedIn(){
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem("auth-demo-key")
        .then(res => {

          if (res !== null) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(err => reject(err));
    });
  };

  // export const getUserId = async () => {
//   let userId = '';
//   try {
//     userId = await AsyncStorage.getItem('userId') || 'none';
//   } catch (error) {
//     // Error retrieving data
//     console.log(error.message);
//   }
//   return userId;
// }

  componentDidMount() {
    // isSignedIn()
    //   .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
    //   .catch(err => alert("An error occurred"));

    this.isSignedIn()
    .then(res => {
      this.setState({ signedIn: res, checkedSignIn: true })
    })
    .catch(err => {
      console.log(err)
      alert("An error occurred")
    });
  }

  render() {
    const { checkedSignIn, signedIn } = this.state;

    console.log("checkedSignIn : " + checkedSignIn +", signedIn : " + signedIn)

    // return <View style={{flex:1}}><Text>Index</Text></View>;
    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return null;
    }

    // return <SafeAreaView style={{flex:1}}><Welcome /></SafeAreaView>;
    // if (signedIn) {
    //   return <SignedIn />;
    // } else {
    //   return <SignedOut />;
    // }

    // return <SignedOut />;

    const Layout = createRootNavigator(signedIn);
    
    return <Layout />;
  }
}
