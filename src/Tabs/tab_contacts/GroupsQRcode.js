import React from 'react'
import {View, 
        Alert, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity, 
        TouchableHighlight,
        StyleSheet} from 'react-native'

import { List, ListItem, SearchBar } from "react-native-elements";
import { connect } from 'react-redux';

import Swipeout from 'react-native-swipeout'

import DictStyle from './dictStyle';

import * as actions from '../../actions'

import Constant from '../../utils/Constant'
import ImageWithDefault from '../../utils/ImageWithDefault'

import {getStatusBarHeight} from '../../utils/Helpers'

class GroupsQRcode extends React.Component{
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
      let {renderContent} = this.state;

    //   console.log(this.props)
    //   if(!this.props.hasOwnProperty('groups')){
    //     return <View style={{flex: 1}}></View>
    //   }

      return (
        // <View style={{flex:1, alignItems:'center'}}>
        
        // {
        //     renderContent && 
        <View style={{flex:1}}>
              <View style={{ height:40, 
                            marginTop:getStatusBarHeight(), 
                            justifyContent:'center', 
                            paddingLeft:10}}>
                  <Text style={{fontSize:22}}>QR code</Text>
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
                      source={{uri: 'data:image/png;base64,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'}}
                      style={styles.logo}
                    />
            </View>

            {/* <Text style = {{marginLeft}}>Hello, Guest</Text> */}

        </View>
        // }
       
        // </View>
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
    // auth:state.auth
    groups:state.auth.users.groups
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

export default connect(mapStateToProps, actions)(GroupsQRcode);