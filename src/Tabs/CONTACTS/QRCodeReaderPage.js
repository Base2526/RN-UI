
import React, { Component } from 'react';

import {
        StyleSheet,
        Text,
        TouchableOpacity,
        View, } from 'react-native';

// import QRCodeScanner from 'react-native-qrcode-scanner';

import {QRscanner} from 'react-native-qr-scanner';

export default class QRCodeReaderPage extends Component {

  // static navigationOptions = ({ navigation }) => ({
  //   title: "QR code reader",
  //   headerTintColor: 'white',
  //   // header: (props) => <ImageHeader {...props} />,
  //   headerStyle: {
  //     backgroundColor: 'rgba(186, 53, 100, 1.0)',
  //     shadowColor: 'transparent',
  //   },
    
  // })

  static navigationOptions = ({navigation}) => { 
    return { 
      // headerTitle: <Text style={{color: 'white', fontSize: 18}}>Test</Text>, 
      headerTransparent: true, 
      headerStyle: { borderBottomWidth: 0, } 
    } 
  }

  constructor(props) {
    super(props);
    this.state = {
      flashMode: false,
      zoom: 0.2
    };
  }

  bottomView = ()=>{
    return(
    <View style={{flex:1,flexDirection:'row',backgroundColor:'#0000004D'}}>
      <TouchableOpacity style={{flex:1,alignItems:'center', justifyContent:'center'}} onPress={()=>this.setState({flashMode:!this.state.flashMode})}>
        <Text style={{color:'#fff'}}>Click me to turn on/off the flashlight</Text>
      </TouchableOpacity>
    </View>
    );
  }
  onRead = (res) => {
    console.log(res);
  }

  render() {
    return (
      <View style={styles.container}>
        <QRscanner 
          onRead={this.onRead} 
          renderBottomView={this.bottomView} 
          flashMode={this.state.flashMode} 
          zoom={this.state.zoom} 
          // finderY={50}
          isShowScanBar={false}
          hintText=''
          rectHeight={300}
          rectWidth={300}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  }
});

// AppRegistry.registerComponent('default', () => ScanScreen);


