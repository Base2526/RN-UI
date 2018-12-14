import React, { Component } from 'react';
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

import Styles from '../../styles';

import Constant from '../../Utils/Constant'
import {loadAsyncStorage, removeAsyncStorageByKey} from '../../Utils/Helpers'


const { RNTwitterSignIn } = NativeModules
const FBSDK = require('react-native-fbsdk');
const { LoginManager } = FBSDK;

// Example component for section:headerComponent
const CustomSectionHeader = () => (
  <View>
    <Text>Custom header!</Text>
  </View>
);

export default class homeY extends Component<{}> {

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


  render() {
    /*
     * Uncomment following line to render example with flatlist
     */

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
                      loadAsyncStorage(Constant.USER_LOGIN).then((data) => {      
                            if(data.status){
                              let value = JSON.parse(data.value)
                              console.log(value.provider)
                              console.log("then #1")
                              if(value.provider == Constant.PROVIDERS.EMAIL){

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
                            console.log("then #2")
                            removeAsyncStorageByKey(Constant.USER_LOGIN).then((data) => {      
                              if(data.status){
                                console.log("Go to SignedOut")
                                this.props.navigation.navigate("SignedOut")
                              }else{
                                
                              }
                            })
                          }).catch((error)=>{
                            
                          })

                          
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