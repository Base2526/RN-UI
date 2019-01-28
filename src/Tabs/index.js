import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native'
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
// import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';

import Image from 'react-native-remote-svg'

import ContactsScreen from './CONTACTS';
import RecentScreen from './RECENT';
import iDNAScreen from './iDNA';
import SettingsScreen from './Settings';

// import NotificationTabBarIcon from '../Library/NotificationTabBarIcon'



const SettingsTabs = createBottomTabNavigator({
    Contacts: {
        screen: ContactsScreen,
        navigationOptions: {
            // title: "Contacts",
            tabBarLabel: ({ routes, index, focused }) => (<View style={{flex:1, alignItems:'center'}}><Text style={{color:focused ? '#D52A6B' : '#BCD1D5'}}>Contacts</Text></View>),
            tabBarIcon: ({ tintColor, focused }) => (
                <View style={{padding:5}}>
                    {/* <Icon name="ios-person" size={25} color={tintColor}></Icon> */}
                    <Image
                    style={{ width: 25, height: 25, color:{tintColor}}}
                    // require('../Images/icon-tab-contacts.svg')
                    source={focused ? require('../Images/icon-tab-contacts-selected.svg') : require('../Images/icon-tab-contacts.svg')}
                    />
                       {/* <TouchableHighlight
                        style={{
                            position:'absolute',
                            backgroundColor:'red',
                            borderRadius:10,
                            top:3,
                            right:0,
                            padding:2}}    
                        underlayColor='#fff'>
                        <Text style={{color:'white', fontSize:12}}>99</Text>
                       </TouchableHighlight> */}
                </View>
            )
        }
    }, // <Icon name="ios-person" size={30} color="#4F8EF7" />
    /*
    Recent: {
        screen: RecentScreen,
        navigationOptions: {
            tabBarLabel: "Recent",
            tabBarIcon: ({ tintColor }) => (
                <View style={{padding:5}}>
                    <Icon name="ios-chatboxes" size={25} color={tintColor}></Icon>
                       <TouchableHighlight
                        style={{
                            position:'absolute',
                            backgroundColor:'red',
                            borderRadius:10,
                            top:3,
                            right:0,
                            padding:2}}    
                        underlayColor='#fff'>
                        <Text style={{color:'white', fontSize:12}}>99</Text>
                       </TouchableHighlight>
                </View>
            )
        }
    },
    */
   
    iDNA: {
        screen: iDNAScreen,
        navigationOptions: {
            // tabBarLabel: "iDNA",
            tabBarLabel: ({ routes, index, focused }) => (<View style={{flex:1, alignItems:'center'}}><Text style={{color:focused ? '#D52A6B' : '#BCD1D5'}}>iDNA</Text></View>),
            tabBarIcon: ({ tintColor, focused}) => (
                // <Icon name="ios-contract" size={25} color={tintColor}></Icon>
                <View style={{padding:5}}>
                    {/* <Icon name="ios-contract" size={25} color={tintColor}></Icon> */}
                    <Image
                    style={{ width: 25, height: 25, color:{tintColor}}}
                    // source={require('../Images/icon-tab-center.svg')}
                    source={focused ? require('../Images/icon-tab-center-selected.svg') : require('../Images/icon-tab-center.svg')}/>
                       {/* <TouchableHighlight
                        style={{
                            position:'absolute',
                            backgroundColor:'red',
                            borderRadius:10,
                            top:3,
                            right:0,
                            padding:2}}    
                        underlayColor='#fff'>
                        <Text style={{color:'white', fontSize:12}}>31</Text>
                       </TouchableHighlight> */}
                </View>
            )
        }
    },
    Settings: {
        screen: SettingsScreen,
        navigationOptions: {
            // tabBarLabel: "Settings",
            tabBarLabel: ({ routes, index, focused }) => (<View style={{flex:1, alignItems:'center'}}><Text style={{ color:focused ? '#D52A6B' : '#BCD1D5'}}>Settings</Text></View>),
            tabBarIcon: ({ tintColor, focused }) => (
                // <Icon name="ios-settings" size={25} color={tintColor}></Icon>
                <View style={{padding:5}}>
                    {/* <Icon name="ios-settings" size={25} color={tintColor}></Icon> */}
                    <Image
                    style={{ width: 25, height: 25, color:{tintColor}}}
                    // source={require('../Images/icon-tab-center.svg')}
                    source={focused ? require('../Images/icon-tab-more-selected.svg') : require('../Images/icon-tab-more.svg')}/>
                       {/* <TouchableHighlight
                        style={{
                            position:'absolute',
                            backgroundColor:'red',
                            borderRadius:10,
                            top:3,
                            right:0,
                            padding:2}}    
                        underlayColor='#fff'>
                        <Text style={{color:'white', fontSize:12}}>50</Text>
                       </TouchableHighlight> */}
                </View>
            )
        }
    }
});

//Issue: the tab navigator needs to be wrapped inside a stack navigator
export default createStackNavigator({ SettingsTabs }, {mode: 'modal', headerMode: "none" });