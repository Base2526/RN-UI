import React from 'react';
import {View, Text, Image} from 'react-native'
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
// import Image from 'react-native-remote-svg'

import ContactsScreen from './CONTACTS';
import RecentScreen from './RECENT';
import iDNAScreen from './iDNA';
import SettingsScreen from './Settings';

import MyIcon from '../config/icon-font.js';

const SettingsTabs = createBottomTabNavigator({
    Contacts: {
        screen: ContactsScreen,
        navigationOptions: {
            // title: "Contacts",

            tabBarLabel: ({ routes, index, focused }) =>(<View></View>),
            // tabBarLabel: ({ routes, index, focused }) => (<View style={{flex:1, alignItems:'center'}}><Text style={{color:focused ? '#D52A6B' : '#BCD1D5'}}>Contacts</Text></View>),
            tabBarIcon: ({ tintColor, focused }) => (
                <View style={{padding:5, flex:1, alignItems:'center'}}>
                    <MyIcon
                        name={'tab-contacts'}
                        size={25}
                        color={focused ? '#DF2D6C':'#BCD1D5'} />
                    <Text style={{color:focused ? '#D52A6B' : '#BCD1D5'}}>Contacts</Text>
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
            tabBarLabel: ({ routes, index, focused }) =>(<View></View>),
            // tabBarLabel: ({ routes, index, focused }) => (<View style={{flex:1, alignItems:'center'}}><Text style={{color:focused ? '#D52A6B' : '#BCD1D5'}}>iDNA</Text></View>),
            tabBarIcon: ({ tintColor, focused}) => (
                <View style={{padding:5, flex:1, alignItems:'center'}}>
                    <MyIcon
                        name={'tab-center'}
                        size={25}
                        color={focused ? '#DF2D6C':'#BCD1D5'} />
                    <Text style={{color:focused ? '#D52A6B' : '#BCD1D5'}}>iDNA</Text>
                </View>
            )
        }
    },
    Settings: {
        screen: SettingsScreen,
        navigationOptions: {
            // tabBarLabel: "Settings",
            tabBarLabel: ({ routes, index, focused }) =>(<View></View>),
            // tabBarLabel: ({ routes, index, focused }) => (<View style={{flex:1, alignItems:'center'}}><Text style={{ color:focused ? '#D52A6B' : '#BCD1D5'}}>Settings</Text></View>),
            tabBarIcon: ({ tintColor, focused }) => (
                <View style={{padding:5, flex:1, alignItems:'center'}}>
                    <MyIcon
                        name={'tab-setting'}
                        size={25}
                        color={focused ? '#DF2D6C':'#BCD1D5'} />
                    <Text style={{color:focused ? '#D52A6B' : '#BCD1D5'}}>Settings</Text>
                </View>
            )
        }
    }
});

//Issue: the tab navigator needs to be wrapped inside a stack navigator
export default createStackNavigator({ SettingsTabs }, {mode: 'modal', headerMode: "none" });