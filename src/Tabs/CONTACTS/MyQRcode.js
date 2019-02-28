import React from 'react'
import {View, 
        Text, 
        TouchableOpacity, 
        SafeAreaView,
        StyleSheet} from 'react-native'
import { connect } from 'react-redux';

import * as actions from '../../Actions'
import ImageWithDefault from '../../Utils/ImageWithDefault'
import {getStatusBarHeight} from '../../Utils/Helpers'

import MyIcon from '../../config/icon-font.js';

class MyQRcode extends React.Component{

    static navigationOptions = ({ navigation }) => {
      return {
          title: "My QR code",
          headerTintColor: '#C7D8DD',
          headerStyle: {
              backgroundColor: 'rgba(186, 53, 100, 1.0)',
              // ios navigationoptions underline hide
              borderBottomWidth: 0,

              // android navigationoptions underline hide
              elevation: 0,
              shadowOpacity: 0
          },
          headerRight: (
              <View style={{marginRight:10}}>
                  <TouchableOpacity
                      style={{padding:5}}
                      // disabled={isModify ? false: true}
                      onPress={() => {
                          const { params = {} } = navigation.state
                          params.handleCancel()
                      }}>
                      <MyIcon
                          name={'cancel'}
                          size={25}
                          color={'#C7D8DD'} />
                  </TouchableOpacity>
              </View>
          ),
      }
    }

    constructor(props) {
      super(props);
  
      this.state = {
        renderContent: false,
        loading: false,
        data: [],
        page: 1,
        seed: 1,
        error: null,
        refreshing: false,
      };
    }
  
    componentDidMount() {
      setTimeout(() => {this.setState({renderContent: true})}, 0);

      this.props.navigation.setParams({handleCancel: this.handleCancel })
    }

    handleCancel = () => {
      this.props.navigation.goBack(null)
    }
   
    render() {
        let {profiles} = this.props
        return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex: 1,  
                          justifyContent: 'center', 
                          alignItems: 'center',}}>
                <ImageWithDefault 
                    source={{uri: profiles.url_my_qrcode}}
                    style={{width: 200,
                            height: 200,
                            marginTop: -(100 + getStatusBarHeight()),
                            marginLeft: -100}}
                    />
            </View>
            <TouchableOpacity style={{position:'absolute', right:0, bottom:0, padding:10,}}
                              onPress={()=>{
                                this.props.navigation.navigate("MyQRcode_QRCodeReaderPage")
                              }}>
                <Text style={{fontSize:18}}>QR code reader</Text>
            </TouchableOpacity>
        </SafeAreaView>
      );
    }
}


const mapStateToProps = (state) => {
  // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
  //_persist.rehydrated parameter is initially set to false
  if(!state._persist.rehydrated){
    return {}
  }

  return{
    profiles:state.auth.users.profiles
  }
}

export default connect(mapStateToProps, actions)(MyQRcode);