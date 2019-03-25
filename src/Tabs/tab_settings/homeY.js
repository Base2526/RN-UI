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
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'react-native-firebase';
var _ = require('lodash');

const { RNTwitterSignIn } = NativeModules
const FBSDK = require('react-native-fbsdk');
const { LoginManager } = FBSDK;

import Constant from '../../utils/Constant'
import { actionLogout, updateIsLogin } from '../../actions';
import MyIcon from '../../config/icon-font.js';

import {getUid, getHeaderInset} from '../../utils/Helpers'

import {makeUidState, 
        makeProfileState, 
        makeFriendsState, 
        makeFriendProfilesState, 
        makePresencesState,
        makeClasssState} from '../../reselect'

class homeY extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: "Settings",
    headerTintColor: '#C7D8DD',
    headerStyle: {
      backgroundColor: 'rgba(186, 53, 100, 1.0)',
      // ios navigationoptions underline hide
      borderBottomWidth: 0,

      // android navigationoptions underline hide
      elevation: 0,
      shadowOpacity: 0
    },
    headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}>
          <MyIcon
              name={'menu'}
              size={30}
              color={'#C7D8DD'}
              />
      </TouchableOpacity>
    ),
  }) 

  // loading
  constructor(props){
    super(props)
    this.state = {
      loading: false,
    }
  }

  componentDidMount() {
    // console.log(this.props.dispatch)
  }

  onLogout = () =>{
    // let {uid, presences} = this.props
    // let {provider, users} = this.props.auth

    this.setState({loading:true})
    // this.props.updateIsLogin(users, v=>{
    //   // console.log(v)
    // })
    
    // if(provider == Constant.PROVIDERS.USER){
    //   console.log("Logout User")
    // }
    // else if(provider == Constant.PROVIDERS.TWITTER){
    //   console.log("Logout Twitter")
    //   RNTwitterSignIn.init(Constant.TWITTER_COMSUMER_KEY, Constant.TWITTER_CONSUMER_SECRET)
    //   RNTwitterSignIn.logOut()
    // }else if(provider == Constant.PROVIDERS.GOOGLE){
    //   console.log("Logout Google")
    // }else if(provider == Constant.PROVIDERS.FACEBOOK){
    //   console.log("Logout Facebook")
    //   LoginManager.logOut()
    // }
    
    this.props.actionLogout(this.props.uid, this.props.dispatch, v=>{
      // console.log(v)
      this.setState({loading:true})

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

    let {loading} = this.state

    // if(!this.props.hasOwnProperty('auth')){
    //   return <View style={{flex: 1}}></View>
    // }

    return (
      <ScrollView>
      <Spinner
            visible={loading}
            textContent={'Wait...'}
            textStyle={{color: '#FFF'}}
            overlayColor={'rgba(0,0,0,0.5)'}
          />
        <TableView>
          <Section header="STANDARD">
            <Cell 
              cellStyle="Basic" 
              title="Friend hide" 
              accessory="DisclosureIndicator"
              hideSeparator={true}
              onPress={()=>{
                this.props.navigation.navigate("hide")
              }} />
            <Cell 
              cellStyle="Basic" 
              title="Friend block" 
              accessory="DisclosureIndicator"
              hideSeparator={true}
              onPress={()=>{
                this.props.navigation.navigate("block")
              }} />
              
            <Cell 
              cellStyle="Basic" 
              title="Friend request sent" 
              accessory="DisclosureIndicator"
              hideSeparator={true}
              onPress={()=>{
                this.props.navigation.navigate("friend_request_sent", {title:'Friend Request'})
              }} />
            <Cell 
              cellStyle="Basic" 
              title="Friend online" 
              accessory="DisclosureIndicator"
              hideSeparator={true}
              onPress={()=>{
                this.props.navigation.navigate("SettingListFriendOnlinePage", {title:''})
              }} />
            <Cell 
              cellStyle="Basic" 
              title="Manage class" 
              accessory="DisclosureIndicator"
              hideSeparator={true}
              onPress={()=>{
                this.props.navigation.navigate("manage_class")
              }} />
            <Cell 
              cellStyle="Basic" 
              title="Manage group" 
              accessory="DisclosureIndicator"
              hideSeparator={true}
              onPress={()=>{
                this.props.navigation.navigate("manage_group")
              }} />
            <Cell 
              cellStyle="Basic" 
              title="Manage my application" 
              accessory="DisclosureIndicator"
              hideSeparator={true}
              onPress={()=>{
                this.props.navigation.navigate("manage_my_application")
              }} />
            <Cell 
              cellStyle="Basic" 
              title="Force Logout" 
              accessory="DisclosureIndicator"
              hideSeparator={true}
              onPress={()=>{
                this.props.navigation.navigate("manage_force_logout")
              }} />
            <Cell 
              cellStyle="Basic" 
              title="Customize tab menus" 
              accessory="DisclosureIndicator"
              hideSeparator={true}
              onPress={()=>{
                this.props.navigation.navigate("manage_customize_tab_menus")
              }} />

            <Cell 
              cellStyle="Basic" 
              title="Google Search Company" 
              accessory="DisclosureIndicator"
              hideSeparator={true}
              onPress={()=>{
                this.props.navigation.navigate("google_search_company")
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


const mapStateToProps = (state, ownProps) => {
  console.log(state)

  if(!state._persist.rehydrated){
      return {}
  }
  
  return{
    // uid:getUid(state),
    uid:makeUidState(state, ownProps),
    // auth:state.auth,
    // presences:state.presence.user_presences
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