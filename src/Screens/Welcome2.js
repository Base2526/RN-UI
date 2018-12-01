import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
// import { handleFbLogin } from './lib/auth';

import TwitterButton from './TwitterButton';
import FBButton from './FBButton'
import GoogleSigninButton from './GoogleSigninButton'

export default class App extends Component<{}> {

  constructor(props){
    super(props)
    this.state = {
      user :{}
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <TwitterButton style={{height: 50}} />
        <FBButton />
        {/* <GoogleSigninButton /> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});