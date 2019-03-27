import React from 'react'
import {View, 
        Text, 
        FlatList,
        TouchableOpacity,
        Alert} from 'react-native'

import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image'
var _ = require('lodash');

import * as actions from '../actions'
import {getHeaderInset, checkInternetDialog, isEmpty} from '../utils/Helpers'
import MyIcon from '../config/icon-font.js';
import Constant from '../utils/Constant'

class TestUsers extends React.Component{
    static navigationOptions = ({ navigation }) => ({
      title: "Test Users",
      headerTintColor: '#C7D8DD',
      headerStyle: {
        backgroundColor: 'rgba(186, 53, 100, 1.0)',
        // ios navigationoptions underline hide
        borderBottomWidth: 0,

        // android navigationoptions underline hide
        elevation: 0,
        shadowOpacity: 0
      },
    }) 

    constructor(props){
        super(props)
        this.state = {
          users:[],
          loading:false,
          renderContent: false,
        }
    }

    componentDidMount(){
      // this.loadData(this.props)
      this.setState({loading:true})
      this.props.actionTestUsers().then((value) => {
        if(value.status){
          this.setState({loading:false, users:value.users, renderContent:true})
        }else{
          this.setState({loading:false})
        }
      })
    }

    ItemSeparatorComponent = () => {
      return (
        <View
          style={{
            height: .5,
            width: "86%",
            backgroundColor: "#CED0CE",
            marginLeft: "14%"
          }}
        />
      )
    }

    renderItem = ({item, index}) => {
      let view_status_message = <View />
      if(!isEmpty(item.status_message)){
        view_status_message = <Text style={{fontSize: 13, 
                                  color: '#222',
                                  paddingLeft: 10}}>
                                  {item.status_message}
                              </Text>
      }
      return(<TouchableOpacity
              onPress={()=>{
                this.setState({loading:true})
                this.props.actionLogin({email:item.name, password:'1234'}).then((result) => {
                  // console.log(result)
                  this.setState({loading:false})
                  if(result.status){
                    this.props.navigation.navigate("AuthLoading") 
                  }else{
                    setTimeout(() => {
                      alert(result.error_message)
                    }, 100);
                  }
                })
              }}>
              <View
                style={{
                  alignItems: 'center', 
                  padding: 10,
                  borderColor: '#E4E4E4',
                  flexDirection: 'row',}}>
                  <FastImage
                    style={{width: 50, 
                            height: 50, 
                            borderRadius: 10, 
                        }}
                    source={{
                        uri: item.image_url,
                        headers:{ Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <View>
                      <Text style={{fontSize: 18, 
                                    fontWeight: '600',
                                    color: '#222',
                                    paddingLeft: 10, 
                                    paddingBottom:5}}>
                          {item.name}
                      </Text>
                      {view_status_message}
                  </View>
              </View>
              </TouchableOpacity>)
    }

    render(){
        let {users, renderContent, loading} = this.state

        // if(!renderContent){
        //   return (<View style={{flex:1}}></View>)
        // }

        console.log(users)

        return( <View style={{flex:1}}>
                  <Spinner
                      visible={loading}
                      textContent={'Wait...'}
                      textStyle={{color: '#FFF'}}
                      overlayColor={'rgba(0,0,0,0.5)'}
                    />
                  {/* {renderContent &&  */}
                  <FlatList
                      data={users}
                      showsVerticalScrollIndicator={false}
                      renderItem={this.renderItem}
                      keyExtractor = { (item, index) => index.toString() } 
                      ItemSeparatorComponent={this.ItemSeparatorComponent}/>
                  {/* } */}
                </View>)
    }
}

const mapStateToProps = (state,ownProps) => {
    // console.log(state)
  
    // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
    //_persist.rehydrated parameter is initially set to false
    if(!state._persist.rehydrated){
      return {}
    }

    // if(!state.auth.isLogin){
    //   return;
    // }
  
    return{}
}
  
export default connect(mapStateToProps, actions)(TestUsers);