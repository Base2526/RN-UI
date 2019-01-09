import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  NativeModules,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { connect } from 'react-redux';

import DeviceInfo from 'react-native-device-info';

var _ = require('lodash');

const { RNTwitterSignIn } = NativeModules
const FBSDK = require('react-native-fbsdk');
const { LoginManager } = FBSDK;

import firebase from 'react-native-firebase';

import Styles from '../../styles';
import Constant from '../../Utils/Constant'
import {loadAsyncStorage, removeAsyncStorageByKey} from '../../Utils/Helpers'
// import * as actions from '../../Actions';
import { actionLogout, updateIsLogin } from '../../Actions';

// import {watchTaskEvent, watchTaskAddedEvent} from '../Actions'

// import {group_deleteAll, groupDetail_deleteAll} from '../../Utils/DB'

// Example component for section:headerComponent
const CustomSectionHeader = () => (
  <View>
    <Text>Custom header!</Text>
  </View>
);

class homeY extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: "Settings",
    headerLeft: (
        <TouchableOpacity
            style={Styles.headerButton}
            onPress={() => navigation.openDrawer()}>
            <Icon name="bars" size={25} />
        </TouchableOpacity>
    ),
    // headerRight: (
    //     <TouchableOpacity
    //         style={Styles.headerButton}
    //         onPress={() => alert("address-book click")}>
    //         <Icon name="address-book" size={20} />
    //     </TouchableOpacity>
    //   ),
  }) 

  componentDidMount() {
    // console.log(this.props.dispatch)
  }

  onLogout = () =>{
    let {provider, users} = this.props.auth

    this.props.updateIsLogin(users, v=>{
      // console.log(v)
    })
    
    if(provider == Constant.PROVIDERS.USER){
      console.log("Logout User")
    }else if(provider == Constant.PROVIDERS.TWITTER){
      console.log("Logout Twitter")
      RNTwitterSignIn.init(Constant.TWITTER_COMSUMER_KEY, Constant.TWITTER_CONSUMER_SECRET)
      RNTwitterSignIn.logOut()
    }else if(provider == Constant.PROVIDERS.GOOGLE){
      console.log("Logout Google")
    }else if(provider == Constant.PROVIDERS.FACEBOOK){
      console.log("Logout Facebook")
      LoginManager.logOut()
    }
    
    this.props.actionLogout(this.props.dispatch, v=>{
      // console.log(v)
      if(!v.status){
        console.log('Error logout')
      }else{
        this.props.navigation.navigate("AuthLoading")
      }
    })
  }

  render() {
    /*
     * Uncomment following line to render example with flatlist
     */

    if(!this.props.hasOwnProperty('auth')){
      return <View style={{flex: 1}}></View>
    }

    return (

      <ScrollView contentContainerStyle={styles.stage}>
        <TableView>
          <Section header="STANDARD">
            <Cell 
              cellStyle="Basic" 
              title="Hide" 
              accessory="DisclosureIndicator"
              onPress={()=>{
                this.props.navigation.navigate("hide")
              }} />
            <Cell 
              cellStyle="Basic" 
              title="Block" 
              accessory="DisclosureIndicator"
              onPress={()=>{
                this.props.navigation.navigate("block")
              }} />
            <Cell 
              cellStyle="Basic" 
              title="Manage class" 
              accessory="DisclosureIndicator"
              onPress={()=>{
                this.props.navigation.navigate("manage_class")
              }} />
            <Cell 
              cellStyle="Basic" 
              title="Manage group" 
              accessory="DisclosureIndicator"
              onPress={()=>{
                this.props.navigation.navigate("manage_group")
              }} />
            <Cell 
              cellStyle="Basic" 
              title="Manage my application" 
              accessory="DisclosureIndicator"
              onPress={()=>{
                this.props.navigation.navigate("manage_my_application")
              }} />
            <Cell 
              cellStyle="Basic" 
              title="Force Logout" 
              accessory="DisclosureIndicator"
              onPress={()=>{
                this.props.navigation.navigate("manage_force_logout")
              }} />
            <Cell 
              cellStyle="Basic" 
              title="Customize tab menus" 
              accessory="DisclosureIndicator"
              onPress={()=>{
                this.props.navigation.navigate("manage_customize_tab_menus")
              }} />

            <Cell 
              cellStyle="Basic" 
              title="Google Search Company" 
              accessory="DisclosureIndicator"
              onPress={()=>{
                this.props.navigation.navigate("google_search_company")
              }} />


            <Cell 
              cellStyle="Basic" 
              title="Test check firebase : ON" 
              accessory="DisclosureIndicator"
              onPress={()=>{
                // this.props.navigation.navigate("google_search_company")
              }} />

            <Cell 
              cellStyle="Basic" 
              title="Test check firebase : OFF" 
              accessory="DisclosureIndicator"
              onPress={()=>{
                // this.props.navigation.navigate("google_search_company")
             
                // firebase.database().ref('idna/user/1').off()
                // console.log('off')
             }} />
            <Cell 
              cellStyle="Basic" 
              title="Logout" 
              // accessory="DisclosureIndicator"
              onPress={
                ()=> Alert.alert(
                  'Logout',
                  'Are you sure you want to log out?',
                  [
                    // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                    {text: 'Cancel', 
                    onPress: () => {console.log("cancel")}, 
                    style: 'cancel'},
                    {text: 'OK', 
                    onPress: () => {

                      this.onLogout()
                      // console.log(this.state)
                      /*
                      loadAsyncStorage(Constant.USER_LOGIN).then((data) => {      
                            if(data.status){
                              let value = JSON.parse(data.value)
                              console.log(value.provider)
                              console.log("then #1")
                              if(value.provider == Constant.PROVIDERS.USER){

                              }else if(value.provider == Constant.PROVIDERS.TWITTER){
                                console.log("Logout Twitter")
                                RNTwitterSignIn.init(Constant.TWITTER_COMSUMER_KEY, Constant.TWITTER_CONSUMER_SECRET)
                                RNTwitterSignIn.logOut()
                              }else if(value.provider == Constant.PROVIDERS.GOOGLE){

                              }else if(value.provider == Constant.PROVIDERS.FACEBOOK){
                                console.log("Logout Facebook")
                                LoginManager.logOut()
                              }
                            }
                          }).then(()=>{

                            // group_deleteAll(v=>{
                            //   console.log(v)
                            // })
                            // groupDetail_deleteAll(v=>{
                            //   console.log(v)
                            // })

                            console.log("then #2")
                            removeAsyncStorageByKey(Constant.USER_LOGIN).then((data) => {      
                              if(data.status){
                                console.log("Go to Auth")
                                this.props.navigation.navigate("Auth")
                              }else{
                                
                              }
                            })
                          }).catch((error)=>{
                        })

                        */
                      }, 
                    },
                  ],
                  { cancelable: false }
              )
            } />
          </Section>
          </TableView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  stage: {
    backgroundColor: '#EFEFF4',
    paddingTop: 20,
    paddingBottom: 20,
  },
});


const mapStateToProps = (state) => {
  console.log(state)

  if(!state._persist.rehydrated){
      return {}
  }
  
  return{
    auth:state.auth
  }
}

// watchTaskOff

const mapDispatchToProps = (dispatch, ownProps) => {
  // watchTaskAddEvent(dispatch)
  // watchTaskChangedEvent(dispatch)
  // watchTaskRemovedEvent(dispatch)

  // watchTaskEvent(dispatch)

  // console.log(dispatch)
  // console.log(ownProps)
  // watchTaskAddedEvent(dispatch)

  return { dispatch, actionLogout, updateIsLogin }
}



export default connect(mapStateToProps, mapDispatchToProps)(homeY);