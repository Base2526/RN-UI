import React from "react";
import { StyleSheet, Text, View , AsyncStorage, SafeAreaView} from "react-native";

import { createRootNavigator } from "./App"; 
import Constant from './Utils/Constant'
import {loadDataLocal} from './Utils/Helpers'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedSignIn: false,
      signedIn: false,
    };
  }

  componentDidMount() {
    this.isSignedIn()
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

    // return(<View><Text>index</Text></View>)
  }
}
