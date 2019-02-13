
import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  NavigatorIOS,
  Dimensions,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

export default class QRCodeReaderPage extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: "QR code reader",
    headerTintColor: 'white',
    // header: (props) => <ImageHeader {...props} />,
    headerStyle: {
      backgroundColor: 'rgba(186, 53, 100, 1.0)',
      shadowColor: 'transparent',
    },
  })
  

  onSuccess(e) {
    // Linking
    //   .openURL(e.data)
    //   .catch(err => console.error('An error occured', err));
    console.log(e)
    // alert(e.data)
  }

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess.bind(this)}
        // topContent={
        //   <Text style={styles.centerText}>
        //     Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
        //   </Text>
        // }
        // bottomContent={
        //   <TouchableOpacity style={styles.buttonTouchable}>
        //     <Text style={styles.buttonText}>OK. Got it!</Text>
        //   </TouchableOpacity>
        // }
        cameraProps={{ ratio:'1:1' }}
      />
    );

    return (
      <NavigatorIOS
        initialRoute={{
          component: QRCodeScanner,
          // title: 'Scan Code',
          passProps: {
            onRead: this.onSuccess.bind(this),
            cameraStyle: styles.cameraContainer,
            topViewStyle: styles.zeroContainer,
            bottomViewStyle: styles.zeroContainer,
          }
          
        }}
        style={{flex: 1}}
        navigationBarHidden={true}
      />
    )
  }
}

const styles = StyleSheet.create({
  zeroContainer: {
    height: 0,
    flex: 0,
  },

  cameraContainer: {
    height: Dimensions.get('window').height,
  },
});

// AppRegistry.registerComponent('default', () => ScanScreen);


