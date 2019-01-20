import React from 'react'
import {View, 
        Alert, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity, 
        SafeAreaView,
        StyleSheet} from 'react-native'

import { List, ListItem, SearchBar } from "react-native-elements";
import { connect } from 'react-redux';

import Swipeout from 'react-native-swipeout'

import DictStyle from './dictStyle';

import * as actions from '../../Actions'

import Constant from '../../Utils/Constant'
import ImageWithDefault from '../../Utils/ImageWithDefault'

import {getStatusBarHeight} from '../../Utils/Helpers'

class MyQRcode extends React.Component{
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

      // console.log("--GroupsPage")
    }
  
    componentDidMount() {
      // this.makeRemoteRequest();
      setTimeout(() => {this.setState({renderContent: true})}, 0);

    //   console.log(this.props.profiles)
    }

    componentWillReceiveProps(nextProps) {
      console.log(nextProps)
      
    //   let group_member = []
    //   for (var key in nextProps.groups) {    
    //     let group = nextProps.groups[key]

    //     group_member.push({...group, group_id:key});
    //   }

    //   this.setState({
    //     data: group_member,
    //   });
    }
      
    render() {
        let {profiles} = this.props

        return (
        <SafeAreaView style={{flex:1}}>
            <View style={{ height:40, 
                            // marginTop:getStatusBarHeight(), 
                            justifyContent:'center', 
                            paddingLeft:10}}>
                <Text style={{fontSize:22}}>My QR code</Text>
                <TouchableOpacity 
                    style={{
                            borderWidth: 1, 
                            borderColor: 'red',
                            borderRadius: 15,
                            height:30, 
                            width:30,
                            justifyContent: 'center', 
                            alignItems: 'center',
                            position:'absolute',
                            right:0,
                            margin:10,
                            zIndex: 10,
                                }}
                    onPress={()=>{
                        this.props.navigation.goBack()
                    }}>
                    <Text style={{color:'red', fontSize:16}}>X</Text>
                </TouchableOpacity> 
            </View>
            <View style={{flex: 1,  justifyContent: 'center', alignItems: 'center',}}>
                <ImageWithDefault 
                    source={{uri: profiles.url_my_qrcode}}
                    style={styles.logo}
                    />
            </View>

            {/* <Text style = {{marginLeft}}>Hello, Guest</Text> */}
            <View style={{}}>
                <TouchableOpacity style={{
                                        padding:15, 
                                        // borderColor:'red', 
                                        // borderWidth:1, 
                                        alignItems:'center',
                                        backgroundColor:'gray'}}>
                    <Text style={{fontSize:18}}>QR code reader</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
       
      );
    }
}


const mapStateToProps = (state) => {
  console.log(state)

  // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
  //_persist.rehydrated parameter is initially set to false
  if(!state._persist.rehydrated){
    return {}
  }

  // groups
  return{
    profiles:state.auth.users.profiles
    // groups:state.auth.users.groups
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 260,
    height: 260,
    marginTop: -(130 + getStatusBarHeight()),
    marginLeft: -130
  },
});

export default connect(mapStateToProps, actions)(MyQRcode);