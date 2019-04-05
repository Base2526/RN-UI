import React from 'react';
import {View, Text, Image} from 'react-native'
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import ContactsScreen from './tab_contacts';
import NameCardsScreen from './tab_name_cards'
import iDNAScreen from './tab_idnas';
import SettingsScreen from './tab_settings';
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
                    <Text style={{color:focused ? '#D52A6B' : '#BCD1D5', fontSize:10}}>Contacts</Text>
                </View>
            )
        }
    },
    NameCards: {
        screen: NameCardsScreen,
        navigationOptions: {
            // tabBarLabel: "iDNA",
            tabBarLabel: ({ routes, index, focused }) =>(<View></View>),
            // tabBarLabel: ({ routes, index, focused }) => (<View style={{flex:1, alignItems:'center'}}><Text style={{color:focused ? '#D52A6B' : '#BCD1D5'}}>iDNA</Text></View>),
            tabBarIcon: ({ tintColor, focused}) => (
                <View style={{padding:5, flex:1, alignItems:'center'}}>
                    <MyIcon
                        name={'wallet'}
                        size={25}
                        color={focused ? '#DF2D6C':'#BCD1D5'} />
                    <Text style={{color:focused ? '#D52A6B' : '#BCD1D5' , fontSize:10}}>Wallet</Text>
                </View>
            )
        }
    },
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
                    <Text style={{color:focused ? '#D52A6B' : '#BCD1D5' , fontSize:10}}>iDNA</Text>
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
                    <Text style={{color:focused ? '#D52A6B' : '#BCD1D5', fontSize:10}}>Settings</Text>
                </View>
            )
        }
    }
});

//Issue: the tab navigator needs to be wrapped inside a stack navigator
export default createStackNavigator({ SettingsTabs }, {mode: 'modal', headerMode: "none" });