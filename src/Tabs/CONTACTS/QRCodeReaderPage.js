
import React, { Component } from 'react';

import {Alert,
        Text,
        TouchableOpacity,
        View, } from 'react-native';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import {QRscanner, QRreader} from 'react-native-qr-scanner';
import Spinner from 'react-native-loading-spinner-overlay';

import * as actions from '../../Actions'
import {getUid, getHeaderInset} from '../../Utils/Helpers'

class QRCodeReaderPage extends Component {
  static navigationOptions = ({navigation}) => { 
    return { 
      // headerTitle: <Text style={{color: 'white', fontSize: 18}}>Test</Text>, 
      headerTintColor: '#C7D8DD',
      headerTransparent: true, 
      headerStyle: { borderBottomWidth: 0, } 
    } 
  }

  constructor(props) {
    super(props)

    this.state = {
      loading:false,

      flashMode: false,
      zoom: 0,
      re_activate: 0,
    }
  }

  close = () => {
    this.props.navigation.goBack(null)
  }

  scanAgain = () => {
    this.setState({
      re_activate: this.state.re_activate + 1
    });
  }

  bottomView = ()=>{
    return(<View style={{flex:1,flexDirection:'row', justifyContent: 'space-between',backgroundColor:'#0000004D'}}>
            <TouchableOpacity 
              style={{paddingLeft:10, 
                      alignItems:'center', 
                      justifyContent:'center'}}
              onPress={()=>{
                this.selectFromDevice()
              }}>
              <Text style={{color:'#fff'}}>Select from device</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{paddingRight:10, 
                                      alignItems:'center', 
                                      justifyContent:'center'}}
                              onPress={()=>{
                                this.props.navigation.navigate("MyQRcodeNavigator")
                              }}>
              <Text style={{color:'#fff'}}>My QR code</Text>
            </TouchableOpacity>
          </View>);
  }

  onRead = (res) => {
    console.log(res.data);
    // alert(res.data)
    
    // this.props.navigation.goBack(null)

    // http://128.199.149.168/qe?&bi*aGVhcnQuaWRuYQ==&bii*NTQ5MTI1&biii*ZnJpZW5k

    this.dataSplit(res.data)
  }

  dataSplit = (data) =>{
    let qe = data.split("?");
    console.log(qe)

    if(qe.length == 2){
      this.setState({loading:true})
      this.props.actionScanQRcode(this.props.uid, qe[1]).then((result) => {
          this.setState({loading:false})
          console.log(result)

          if(!result.status){
            setTimeout(() => {
              Alert.alert(
                '',
                result.message,
                [
                  // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                  {
                    text: 'Close',
                    onPress: () => {
                      this.props.navigation.goBack(null)
                    },
                    style: 'cancel',
                  },
                  {text: 'Scan again', onPress: () => {
                    this.scanAgain();
                  }},
                ],
                {cancelable: false},
              )
            }, 100)
          }else{
            // is_exist

            let data = result.data.data
            // console.log(data)

            if(data.type == 'friend'){
              if(data.friend_status == 0){
                if(data.uid == this.props.uid){
                  setTimeout(() => {
                    Alert.alert(
                      '',
                      'You cannot add yourself as a friend.',
                      [
                        {
                          text: 'Close',
                          onPress: () => {
                            this.props.navigation.goBack(null)
                          },
                          style: 'cancel',
                        },
                        {text: 'Scan again', onPress: () => {
                          this.setState({
                            re_activate: this.state.re_activate + 1
                          });
                        }},
                      ],
                      {cancelable: false},
                    )
                  }, 100)
                }else{
                  this.props.navigation.navigate("ResultScanForQRcode", {close:this.close, scanAgain:this.scanAgain, friend:data})
                }
              }else{
                this.props.navigation.navigate("ResultScanForQRcode", {close:this.close, scanAgain:this.scanAgain, friend:data})
              }
            }

            /*
            if(!result.data.is_exist){
              setTimeout(() => {
                Alert.alert(
                  '',
                  'Friend not found.',
                  [
                    {
                      text: 'Close',
                      onPress: () => {
                        this.props.navigation.goBack(null)
                      },
                      style: 'cancel',
                    },
                    {text: 'Scan again', onPress: () => {
                      this.setState({
                        re_activate: this.state.re_activate + 1
                      });
                    }},
                  ],
                  {cancelable: false},
                )
              }, 100)
            }else{
              // onScroll={this.props.handleScroll}
              // You cannot add yourself as a friend.

              let friend = result.data.friends[0]
              console.log(friend)

              if(friend.uid == this.props.uid){
                setTimeout(() => {
                  Alert.alert(
                    '',
                    'You cannot add yourself as a friend.',
                    [
                      {
                        text: 'Close',
                        onPress: () => {
                          this.props.navigation.goBack(null)
                        },
                        style: 'cancel',
                      },
                      {text: 'Scan again', onPress: () => {
                        this.setState({
                          re_activate: this.state.re_activate + 1
                        });
                      }},
                    ],
                    {cancelable: false},
                  )
                }, 100)
              }else{
                this.props.navigation.navigate("ResultScanForQRcode", {close:this.close, scanAgain:this.scanAgain, friend})
              }
            }
            */
          }    
      })
    }
  }
  
  selectFromDevice(){
    console.log('ImagePicker');
    ImagePicker.launchImageLibrary({}, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }else {
        if(response.uri){
          var path = response.path;
          if(!path){
              path = response.uri;
          }

          QRreader(path).then((data)=>{
            // alert(data)
            // this.props.navigation.goBack(null)

            this.dataSplit(data)
            // this.findMyID(data)
            // console.log(data)

            // this.setState({reader: {
            //   message: '识别成功',
            //   data: data
            // }});
            // // 十秒后自动清空
            // setTimeout(() => {
            //   this.setState({reader: {
            //     message: null,
            //     data: null
            //   }})
            // }, 10000);
          }).catch((err)=>{
            console.log(err)
            // this.setState({reader: {
            //   message: '识别失败',
            //   data: null
            // }});
          });  

        }
      }
    });
  }

  render() {
    console.log('--render--')
    return (
      <View style={{flex: 1,
                    backgroundColor: '#000'}}>
        <Spinner
          visible={this.state.loading}
          textContent={'Wait...'}
          textStyle={{color: '#FFF'}}
          overlayColor={'rgba(0,0,0,0.5)'}/>
        <QRscanner 
          key={this.state.re_activate}
          onRead={this.onRead} 
          renderBottomView={this.bottomView} 
          // flashMode={this.state.flashMode} 
          zoom={this.state.zoom} 
          // finderY={50}
          isShowScanBar={false}
          hintText=''
          rectHeight={300}
          rectWidth={300}
          // hintTextPosition={40}

          // renderBottomView
          />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  console.log(state)

  // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
  //_persist.rehydrated parameter is initially set to false
  if(!state._persist.rehydrated){
    return {}
  }

  return{
    uid:getUid(state),
    // groups:state.auth.users.groups
  }
}

export default connect(mapStateToProps, actions)(QRCodeReaderPage);


