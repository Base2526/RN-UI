import React from 'react';
import {View, Text} from 'react-native'
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Image from 'react-native-remote-svg'

import ContactsScreen from './CONTACTS';
import RecentScreen from './RECENT';
import iDNAScreen from './iDNA';
import SettingsScreen from './Settings';

const SettingsTabs = createBottomTabNavigator({
    Contacts: {
        screen: ContactsScreen,
        navigationOptions: {
            // title: "Contacts",
            tabBarLabel: ({ routes, index, focused }) => (<View style={{flex:1, alignItems:'center'}}><Text style={{color:focused ? '#D52A6B' : '#BCD1D5'}}>Contacts</Text></View>),
            tabBarIcon: ({ tintColor, focused }) => (
                <View style={{padding:5,}}>
                    <Image
                        style={{ width: 22, height: 22}}
                        source={{uri:focused ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="25.983" height="25.999" viewBox="0 0 25.983 25.999">
                        <g id="contracts" transform="translate(-0.5 0.5)">
                          <rect id="Rectangle_550" data-name="Rectangle 550" width="25" height="25" transform="translate(1)" fill="none"/>
                          <path id="Union_25" data-name="Union 25" d="M7.092,25h0A28.867,28.867,0,0,1,2.54,21.371a12.5,12.5,0,0,1-1.5-1.984,7.479,7.479,0,0,1-.372-.694,5.694,5.694,0,0,1-.62-2.069A4.048,4.048,0,0,1,0,16a3.77,3.77,0,0,1,3.71-3.82,3.705,3.705,0,0,1,3.427,2.351,3.7,3.7,0,0,1,3.425-2.351,3.581,3.581,0,0,1,.606.051,3.589,3.589,0,0,0-.205,1.2,3.645,3.645,0,0,0,.049.59c0,.193.068,1.948,2.446,4.5.04.047.085.1.13.145A11.176,11.176,0,0,1,11.4,21.71,28.6,28.6,0,0,1,7.093,25ZM17.93,21.96h0a30.15,30.15,0,0,1-4.341-3.293,6.414,6.414,0,0,0,.635-2.043A3.954,3.954,0,0,0,14.273,16a3.773,3.773,0,0,0-3.1-3.768,3.655,3.655,0,0,1,6.8-.193,3.649,3.649,0,0,1,7.01,1.393,3.69,3.69,0,0,1-.049.6,8.359,8.359,0,0,1-2.767,4.815,27.949,27.949,0,0,1-4.235,3.118ZM3.5,6.061A3.5,3.5,0,1,1,7,9.56,3.5,3.5,0,0,1,3.5,6.061ZM14.342,3.5a3.5,3.5,0,1,1,3.5,3.5A3.5,3.5,0,0,1,14.342,3.5Z" transform="translate(1 0)" fill="#df2d6c" stroke="rgba(0,0,0,0)" stroke-width="1"/>
                        </g>
                      </svg>
                      `:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="25.983" height="25.999" viewBox="0 0 25.983 25.999">
                      <g id="contracts" transform="translate(-0.5 0.5)">
                        <rect id="Rectangle_550" data-name="Rectangle 550" width="25" height="25" transform="translate(1)" fill="none"/>
                        <path id="Union_25" data-name="Union 25" d="M7.092,25h0A28.867,28.867,0,0,1,2.54,21.371a12.5,12.5,0,0,1-1.5-1.984,7.479,7.479,0,0,1-.372-.694,5.694,5.694,0,0,1-.62-2.069A4.048,4.048,0,0,1,0,16a3.77,3.77,0,0,1,3.71-3.82,3.705,3.705,0,0,1,3.427,2.351,3.7,3.7,0,0,1,3.425-2.351,3.581,3.581,0,0,1,.606.051,3.589,3.589,0,0,0-.205,1.2,3.645,3.645,0,0,0,.049.59c0,.193.068,1.948,2.446,4.5.04.047.085.1.13.145A11.176,11.176,0,0,1,11.4,21.71,28.6,28.6,0,0,1,7.093,25ZM17.93,21.96h0a30.15,30.15,0,0,1-4.341-3.293,6.414,6.414,0,0,0,.635-2.043A3.954,3.954,0,0,0,14.273,16a3.773,3.773,0,0,0-3.1-3.768,3.655,3.655,0,0,1,6.8-.193,3.649,3.649,0,0,1,7.01,1.393,3.69,3.69,0,0,1-.049.6,8.359,8.359,0,0,1-2.767,4.815,27.949,27.949,0,0,1-4.235,3.118ZM3.5,6.061A3.5,3.5,0,1,1,7,9.56,3.5,3.5,0,0,1,3.5,6.061ZM14.342,3.5a3.5,3.5,0,1,1,3.5,3.5A3.5,3.5,0,0,1,14.342,3.5Z" transform="translate(1 0)" fill="#b5ccd1" stroke="rgba(0,0,0,0)" stroke-width="1"/>
                      </g>
                    </svg>
                    `}} />
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
                <View style={{padding:5}}>
                    <Image
                        style={{ width: 22, height: 22}}
                        source={{uri:focused ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
                        <g id="idna" transform="translate(-1)">
                          <rect id="Rectangle_550" data-name="Rectangle 550" width="25" height="25" transform="translate(1)" fill="none"/>
                          <path id="Subtraction_2" data-name="Subtraction 2" d="M11.712,23.178a12.043,12.043,0,0,1-7.569-2.65c.341-.208,1.008-.623,1.648-1.08a10.2,10.2,0,0,0,11.783-.032c.606.436,1.259.848,1.7,1.116A12.042,12.042,0,0,1,11.712,23.178Zm12.1-10.433v0A2.82,2.82,0,0,0,21.9,12.09a10.633,10.633,0,0,0,.069-1.207,10.439,10.439,0,0,0-5.429-9.177,3.7,3.7,0,0,0,.118-2.248A12.417,12.417,0,0,1,23.969,10.79a12.6,12.6,0,0,1-.152,1.952ZM-.4,12.732v0a12.6,12.6,0,0,1-.15-1.94A12.408,12.408,0,0,1,7.03-.658,2.734,2.734,0,0,0,6.94,1.619a10.41,10.41,0,0,0-5.592,9.264,10.64,10.64,0,0,0,.069,1.21,2.716,2.716,0,0,0-1.812.637ZM14.171-.907h0l-.327-.5c.255.045.5.1.732.154a1.328,1.328,0,0,0-.4.348Z" transform="translate(1.796 1.818)" fill="#df2d6c"/>
                          <g id="Group_103" data-name="Group 103" transform="translate(17.379 14.48)">
                            <path id="Path_417" data-name="Path 417" d="M559.992,2142.426a2.241,2.241,0,1,1-2.241-2.241A2.242,2.242,0,0,1,559.992,2142.426Z" transform="translate(-555.51 -2140.185)" fill="#df2d6c"/>
                            <path id="Path_418" data-name="Path 418" d="M574.183,2142.426a2.241,2.241,0,1,1-2.241-2.241A2.244,2.244,0,0,1,574.183,2142.426Z" transform="translate(-565.562 -2140.185)" fill="#df2d6c"/>
                            <path id="Path_419" data-name="Path 419" d="M555.607,2149.112s-.028,1.13,1.505,2.791a17.157,17.157,0,0,0,2.75,2.129,17.148,17.148,0,0,0,2.606-1.931,5.17,5.17,0,0,0,1.7-2.989" transform="translate(-555.579 -2146.508)" fill="#df2d6c"/>
                          </g>
                          <g id="Group_104" data-name="Group 104" transform="translate(1 14.48)">
                            <path id="Path_420" data-name="Path 420" d="M492.878,2142.426a2.241,2.241,0,1,1-2.24-2.241A2.242,2.242,0,0,1,492.878,2142.426Z" transform="translate(-488.396 -2140.185)" fill="#df2d6c"/>
                            <path id="Path_421" data-name="Path 421" d="M507.07,2142.426a2.241,2.241,0,1,1-2.242-2.241A2.243,2.243,0,0,1,507.07,2142.426Z" transform="translate(-498.449 -2140.185)" fill="#df2d6c"/>
                            <path id="Path_422" data-name="Path 422" d="M488.5,2149.112s-.03,1.13,1.505,2.791a17.121,17.121,0,0,0,2.749,2.129,17.209,17.209,0,0,0,2.606-1.931,5.172,5.172,0,0,0,1.7-2.989" transform="translate(-488.468 -2146.508)" fill="#df2d6c"/>
                          </g>
                          <g id="Group_533" data-name="Group 533" transform="translate(9.308)">
                            <path id="Path_423" data-name="Path 423" d="M527.33,2083.5a2.241,2.241,0,1,1-2.24-2.24A2.24,2.24,0,0,1,527.33,2083.5Z" transform="translate(-522.848 -2081.263)" fill="#df2d6c"/>
                            <path id="Path_424" data-name="Path 424" d="M541.521,2083.5a2.241,2.241,0,1,1-2.241-2.24A2.241,2.241,0,0,1,541.521,2083.5Z" transform="translate(-532.9 -2081.263)" fill="#df2d6c"/>
                            <path id="Path_425" data-name="Path 425" d="M522.945,2090.184s-.028,1.132,1.505,2.792a17.106,17.106,0,0,0,2.75,2.127,17.061,17.061,0,0,0,2.606-1.929,5.172,5.172,0,0,0,1.7-2.99" transform="translate(-522.917 -2087.582)" fill="#df2d6c"/>
                          </g>
                        </g>
                      </svg>
                      `:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
                      <g id="idna" transform="translate(-1)">
                        <rect id="Rectangle_550" data-name="Rectangle 550" width="25" height="25" transform="translate(1)" fill="none"/>
                        <path id="Subtraction_2" data-name="Subtraction 2" d="M11.712,23.178a12.043,12.043,0,0,1-7.569-2.65c.341-.208,1.008-.623,1.648-1.08a10.2,10.2,0,0,0,11.783-.032c.606.436,1.259.848,1.7,1.116A12.042,12.042,0,0,1,11.712,23.178Zm12.1-10.433v0A2.82,2.82,0,0,0,21.9,12.09a10.633,10.633,0,0,0,.069-1.207,10.439,10.439,0,0,0-5.429-9.177,3.7,3.7,0,0,0,.118-2.248A12.417,12.417,0,0,1,23.969,10.79a12.6,12.6,0,0,1-.152,1.952ZM-.4,12.732v0a12.6,12.6,0,0,1-.15-1.94A12.408,12.408,0,0,1,7.03-.658,2.734,2.734,0,0,0,6.94,1.619a10.41,10.41,0,0,0-5.592,9.264,10.64,10.64,0,0,0,.069,1.21,2.716,2.716,0,0,0-1.812.637ZM14.171-.907h0l-.327-.5c.255.045.5.1.732.154a1.328,1.328,0,0,0-.4.348Z" transform="translate(1.796 1.818)" fill="#b5ccd1"/>
                        <g id="Group_103" data-name="Group 103" transform="translate(17.379 14.48)">
                          <path id="Path_417" data-name="Path 417" d="M559.992,2142.426a2.241,2.241,0,1,1-2.241-2.241A2.242,2.242,0,0,1,559.992,2142.426Z" transform="translate(-555.51 -2140.185)" fill="#b5ccd1"/>
                          <path id="Path_418" data-name="Path 418" d="M574.183,2142.426a2.241,2.241,0,1,1-2.241-2.241A2.244,2.244,0,0,1,574.183,2142.426Z" transform="translate(-565.562 -2140.185)" fill="#b5ccd1"/>
                          <path id="Path_419" data-name="Path 419" d="M555.607,2149.112s-.028,1.13,1.505,2.791a17.157,17.157,0,0,0,2.75,2.129,17.148,17.148,0,0,0,2.606-1.931,5.17,5.17,0,0,0,1.7-2.989" transform="translate(-555.579 -2146.508)" fill="#b5ccd1"/>
                        </g>
                        <g id="Group_104" data-name="Group 104" transform="translate(1 14.48)">
                          <path id="Path_420" data-name="Path 420" d="M492.878,2142.426a2.241,2.241,0,1,1-2.24-2.241A2.242,2.242,0,0,1,492.878,2142.426Z" transform="translate(-488.396 -2140.185)" fill="#b5ccd1"/>
                          <path id="Path_421" data-name="Path 421" d="M507.07,2142.426a2.241,2.241,0,1,1-2.242-2.241A2.243,2.243,0,0,1,507.07,2142.426Z" transform="translate(-498.449 -2140.185)" fill="#b5ccd1"/>
                          <path id="Path_422" data-name="Path 422" d="M488.5,2149.112s-.03,1.13,1.505,2.791a17.121,17.121,0,0,0,2.749,2.129,17.209,17.209,0,0,0,2.606-1.931,5.172,5.172,0,0,0,1.7-2.989" transform="translate(-488.468 -2146.508)" fill="#b5ccd1"/>
                        </g>
                        <g id="Group_533" data-name="Group 533" transform="translate(9.308)">
                          <path id="Path_423" data-name="Path 423" d="M527.33,2083.5a2.241,2.241,0,1,1-2.24-2.24A2.24,2.24,0,0,1,527.33,2083.5Z" transform="translate(-522.848 -2081.263)" fill="#b5ccd1"/>
                          <path id="Path_424" data-name="Path 424" d="M541.521,2083.5a2.241,2.241,0,1,1-2.241-2.24A2.241,2.241,0,0,1,541.521,2083.5Z" transform="translate(-532.9 -2081.263)" fill="#b5ccd1"/>
                          <path id="Path_425" data-name="Path 425" d="M522.945,2090.184s-.028,1.132,1.505,2.792a17.106,17.106,0,0,0,2.75,2.127,17.061,17.061,0,0,0,2.606-1.929,5.172,5.172,0,0,0,1.7-2.99" transform="translate(-522.917 -2087.582)" fill="#b5ccd1"/>
                        </g>
                      </g>
                    </svg>
                    `}} />
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
                <View style={{padding:5}}>
                    <Image
                        style={{ width: 25, height: 25}}
                        source={{uri:focused ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
                        <g id="setting" transform="translate(-1)">
                          <rect id="Rectangle_550" data-name="Rectangle 550" width="25" height="25" transform="translate(1)" fill="none"/>
                          <g id="Group_536" data-name="Group 536" transform="translate(1 9.922)">
                            <path id="Path_429" data-name="Path 429" d="M822.268,2118.732a1.9,1.9,0,1,1-1.9-1.9A1.9,1.9,0,0,1,822.268,2118.732Z" transform="translate(-818.474 -2116.835)" fill="#df2d6c"/>
                            <path id="Path_430" data-name="Path 430" d="M839.073,2118.732a1.9,1.9,0,1,1-1.9-1.9A1.9,1.9,0,0,1,839.073,2118.732Z" transform="translate(-831.776 -2116.835)" fill="#df2d6c"/>
                            <path id="Path_431" data-name="Path 431" d="M818.594,2127.41a3.839,3.839,0,0,0,1.273,2.362,14.539,14.539,0,0,0,2.327,1.8,14.322,14.322,0,0,0,2.2-1.634,4.373,4.373,0,0,0,1.441-2.53" transform="translate(-818.569 -2125.206)" fill="#df2d6c"/>
                            <path id="Path_432" data-name="Path 432" d="M876.887,2118.732a1.9,1.9,0,1,1-1.9-1.9A1.9,1.9,0,0,1,876.887,2118.732Z" transform="translate(-863.983 -2116.835)" fill="#df2d6c"/>
                            <path id="Path_433" data-name="Path 433" d="M893.693,2118.732a1.9,1.9,0,1,1-1.9-1.9A1.9,1.9,0,0,1,893.693,2118.732Z" transform="translate(-877.286 -2116.835)" fill="#df2d6c"/>
                            <path id="Path_434" data-name="Path 434" d="M873.213,2127.41a3.84,3.84,0,0,0,1.273,2.362,14.553,14.553,0,0,0,2.327,1.8,14.3,14.3,0,0,0,2.2-1.634,4.369,4.369,0,0,0,1.441-2.53" transform="translate(-864.077 -2125.206)" fill="#df2d6c"/>
                            <path id="Path_435" data-name="Path 435" d="M929.641,2118.732a1.9,1.9,0,1,1-1.9-1.9A1.9,1.9,0,0,1,929.641,2118.732Z" transform="translate(-908.143 -2116.835)" fill="#df2d6c"/>
                            <path id="Path_436" data-name="Path 436" d="M946.446,2118.732a1.9,1.9,0,1,1-1.9-1.9A1.9,1.9,0,0,1,946.446,2118.732Z" transform="translate(-921.446 -2116.835)" fill="#df2d6c"/>
                            <path id="Path_437" data-name="Path 437" d="M925.966,2127.41a3.842,3.842,0,0,0,1.274,2.362,14.553,14.553,0,0,0,2.327,1.8,14.312,14.312,0,0,0,2.2-1.634,4.371,4.371,0,0,0,1.441-2.53" transform="translate(-908.237 -2125.206)" fill="#df2d6c"/>
                          </g>
                        </g>
                      </svg>
                      `:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
                      <g id="setting" transform="translate(-1)">
                        <rect id="Rectangle_550" data-name="Rectangle 550" width="25" height="25" transform="translate(1)" fill="none"/>
                        <g id="Group_536" data-name="Group 536" transform="translate(1 9.922)">
                          <path id="Path_429" data-name="Path 429" d="M822.268,2118.732a1.9,1.9,0,1,1-1.9-1.9A1.9,1.9,0,0,1,822.268,2118.732Z" transform="translate(-818.474 -2116.835)" fill="#b5ccd1"/>
                          <path id="Path_430" data-name="Path 430" d="M839.073,2118.732a1.9,1.9,0,1,1-1.9-1.9A1.9,1.9,0,0,1,839.073,2118.732Z" transform="translate(-831.776 -2116.835)" fill="#b5ccd1"/>
                          <path id="Path_431" data-name="Path 431" d="M818.594,2127.41a3.839,3.839,0,0,0,1.273,2.362,14.539,14.539,0,0,0,2.327,1.8,14.322,14.322,0,0,0,2.2-1.634,4.373,4.373,0,0,0,1.441-2.53" transform="translate(-818.569 -2125.206)" fill="#b5ccd1"/>
                          <path id="Path_432" data-name="Path 432" d="M876.887,2118.732a1.9,1.9,0,1,1-1.9-1.9A1.9,1.9,0,0,1,876.887,2118.732Z" transform="translate(-863.983 -2116.835)" fill="#b5ccd1"/>
                          <path id="Path_433" data-name="Path 433" d="M893.693,2118.732a1.9,1.9,0,1,1-1.9-1.9A1.9,1.9,0,0,1,893.693,2118.732Z" transform="translate(-877.286 -2116.835)" fill="#b5ccd1"/>
                          <path id="Path_434" data-name="Path 434" d="M873.213,2127.41a3.84,3.84,0,0,0,1.273,2.362,14.553,14.553,0,0,0,2.327,1.8,14.3,14.3,0,0,0,2.2-1.634,4.369,4.369,0,0,0,1.441-2.53" transform="translate(-864.077 -2125.206)" fill="#b5ccd1"/>
                          <path id="Path_435" data-name="Path 435" d="M929.641,2118.732a1.9,1.9,0,1,1-1.9-1.9A1.9,1.9,0,0,1,929.641,2118.732Z" transform="translate(-908.143 -2116.835)" fill="#b5ccd1"/>
                          <path id="Path_436" data-name="Path 436" d="M946.446,2118.732a1.9,1.9,0,1,1-1.9-1.9A1.9,1.9,0,0,1,946.446,2118.732Z" transform="translate(-921.446 -2116.835)" fill="#b5ccd1"/>
                          <path id="Path_437" data-name="Path 437" d="M925.966,2127.41a3.842,3.842,0,0,0,1.274,2.362,14.553,14.553,0,0,0,2.327,1.8,14.312,14.312,0,0,0,2.2-1.634,4.371,4.371,0,0,0,1.441-2.53" transform="translate(-908.237 -2125.206)" fill="#b5ccd1"/>
                        </g>
                      </g>
                    </svg>`}} />
                </View>
            )
        }
    }
});

//Issue: the tab navigator needs to be wrapped inside a stack navigator
export default createStackNavigator({ SettingsTabs }, {mode: 'modal', headerMode: "none" });