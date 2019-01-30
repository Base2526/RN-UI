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
                    {/* <Image
                    style={{ width: 25, height: 25, color:{tintColor}}}
                    // require('../Images/icon-tab-contacts.svg')
                    source={focused ? require('../Images/icon-tab-contacts-selected.svg') : require('../Images/icon-tab-contacts.svg')}
                    /> */}

                    <Image
                        style={{ width: 25, height: 25}}
                        source={{uri:focused ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="26.249" height="23.083" viewBox="0 0 26.249 23.083">
                        <path id="Union_12" data-name="Union 12" d="M1844.048-252.917c-.034-.023-.854-.559-1.818-1.268-.57-.419-1.075-.814-1.5-1.171a10.076,10.076,0,0,1-1.207-1.162,13.216,13.216,0,0,1-1.412-1.859,8.669,8.669,0,0,1-.737-1.462,4.214,4.214,0,0,1-.326-1.393,3.927,3.927,0,0,1-.049-.621,3.86,3.86,0,0,1,.29-1.476,3.779,3.779,0,0,1,.79-1.205,3.662,3.662,0,0,1,1.172-.813,3.576,3.576,0,0,1,1.435-.3,3.6,3.6,0,0,1,2.069.653,3.77,3.77,0,0,1,1.336,1.68,3.773,3.773,0,0,1,1.336-1.68,3.6,3.6,0,0,1,2.069-.653,3.605,3.605,0,0,1,.676.064,3.885,3.885,0,0,0-.111.924,3.9,3.9,0,0,0,.049.62,4.169,4.169,0,0,0,.321,1.381,10.9,10.9,0,0,0,2.135,3.313,10.979,10.979,0,0,1-2.234,3.159,17.61,17.61,0,0,1-2.58,2.12c-.923.651-1.7,1.141-1.707,1.146Zm9.246-4.072c-.57-.419-1.075-.814-1.5-1.171a10.076,10.076,0,0,1-1.207-1.162h0l-.018-.02a6.257,6.257,0,0,0,.567-1.886,3.908,3.908,0,0,0,.05-.625,3.763,3.763,0,0,0-3.011-3.728,3.809,3.809,0,0,1,.485-1.143,3.763,3.763,0,0,1,.806-.908,3.643,3.643,0,0,1,1.055-.6,3.589,3.589,0,0,1,1.231-.216,3.6,3.6,0,0,1,2.069.653,3.767,3.767,0,0,1,1.336,1.68,3.775,3.775,0,0,1,1.336-1.68,3.6,3.6,0,0,1,2.069-.653,3.578,3.578,0,0,1,1.435.3,3.679,3.679,0,0,1,1.172.813,3.78,3.78,0,0,1,.79,1.205,3.858,3.858,0,0,1,.29,1.476,3.909,3.909,0,0,1-.05.624,5.929,5.929,0,0,1-.453,1.625,9.527,9.527,0,0,1-.84,1.573,12.053,12.053,0,0,1-1.508,1.849,17.616,17.616,0,0,1-2.58,2.119c-.921.65-1.7,1.141-1.707,1.146C1855.078-255.743,1854.256-256.282,1853.294-256.989Zm-11.939-12.4a2.766,2.766,0,0,1,2.727-2.8,2.766,2.766,0,0,1,2.727,2.8,2.765,2.765,0,0,1-2.727,2.8A2.765,2.765,0,0,1,1841.355-269.393Zm11.064-2.8a2.766,2.766,0,0,1,2.727-2.8,2.766,2.766,0,0,1,2.727,2.8,2.765,2.765,0,0,1-2.727,2.8A2.765,2.765,0,0,1,1852.418-272.2Z" transform="translate(-1836.5 275.5)" fill="#d1145b" stroke="rgba(0,0,0,0)" stroke-width="1"/>
                      </svg>
                           
                    `:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="26.249" height="23.083" viewBox="0 0 26.249 23.083">
                    <path id="Union_12" data-name="Union 12" d="M1844.048-252.917c-.034-.023-.854-.559-1.818-1.268-.57-.419-1.075-.814-1.5-1.171a10.076,10.076,0,0,1-1.207-1.162,13.216,13.216,0,0,1-1.412-1.859,8.669,8.669,0,0,1-.737-1.462,4.214,4.214,0,0,1-.326-1.393,3.927,3.927,0,0,1-.049-.621,3.86,3.86,0,0,1,.29-1.476,3.779,3.779,0,0,1,.79-1.205,3.662,3.662,0,0,1,1.172-.813,3.576,3.576,0,0,1,1.435-.3,3.6,3.6,0,0,1,2.069.653,3.77,3.77,0,0,1,1.336,1.68,3.773,3.773,0,0,1,1.336-1.68,3.6,3.6,0,0,1,2.069-.653,3.605,3.605,0,0,1,.676.064,3.885,3.885,0,0,0-.111.924,3.9,3.9,0,0,0,.049.62,4.169,4.169,0,0,0,.321,1.381,10.9,10.9,0,0,0,2.135,3.313,10.979,10.979,0,0,1-2.234,3.159,17.61,17.61,0,0,1-2.58,2.12c-.923.651-1.7,1.141-1.707,1.146Zm9.246-4.072c-.57-.419-1.075-.814-1.5-1.171a10.076,10.076,0,0,1-1.207-1.162h0l-.018-.02a6.257,6.257,0,0,0,.567-1.886,3.908,3.908,0,0,0,.05-.625,3.763,3.763,0,0,0-3.011-3.728,3.809,3.809,0,0,1,.485-1.143,3.763,3.763,0,0,1,.806-.908,3.643,3.643,0,0,1,1.055-.6,3.589,3.589,0,0,1,1.231-.216,3.6,3.6,0,0,1,2.069.653,3.767,3.767,0,0,1,1.336,1.68,3.775,3.775,0,0,1,1.336-1.68,3.6,3.6,0,0,1,2.069-.653,3.578,3.578,0,0,1,1.435.3,3.679,3.679,0,0,1,1.172.813,3.78,3.78,0,0,1,.79,1.205,3.858,3.858,0,0,1,.29,1.476,3.909,3.909,0,0,1-.05.624,5.929,5.929,0,0,1-.453,1.625,9.527,9.527,0,0,1-.84,1.573,12.053,12.053,0,0,1-1.508,1.849,17.616,17.616,0,0,1-2.58,2.119c-.921.65-1.7,1.141-1.707,1.146C1855.078-255.743,1854.256-256.282,1853.294-256.989Zm-11.939-12.4a2.766,2.766,0,0,1,2.727-2.8,2.766,2.766,0,0,1,2.727,2.8,2.765,2.765,0,0,1-2.727,2.8A2.765,2.765,0,0,1,1841.355-269.393Zm11.064-2.8a2.766,2.766,0,0,1,2.727-2.8,2.766,2.766,0,0,1,2.727,2.8,2.765,2.765,0,0,1-2.727,2.8A2.765,2.765,0,0,1,1852.418-272.2Z" transform="translate(-1836.5 275.5)" fill="#b5ccd1" stroke="rgba(0,0,0,0)" stroke-width="1"/>
                  </svg>                                                          
                `}} />
                      
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
                    {/* <Image
                    style={{ width: 25, height: 25, color:{tintColor}}}
                    // source={require('../Images/icon-tab-center.svg')}
                    source={focused ? require('../Images/icon-tab-center-selected.svg') : require('../Images/icon-tab-center.svg')}/>
                       */}

                    <Image
                        style={{ width: 25, height: 25}}
                        source={{uri:focused ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24.131" height="23.593" viewBox="0 0 24.131 23.593">
                        <g id="Group_106" data-name="Group 106" transform="translate(0.5 0.5)">
                          <g id="Group_103" data-name="Group 103" transform="translate(16.058 14.098)">
                            <path id="Path_417" data-name="Path 417" d="M559.187,2142.023a1.838,1.838,0,1,1-1.838-1.838A1.839,1.839,0,0,1,559.187,2142.023Z" transform="translate(-555.51 -2140.185)" fill="#d52a6b" stroke="#d52a6b" stroke-width="1"/>
                            <path id="Path_418" data-name="Path 418" d="M573.378,2142.023a1.838,1.838,0,1,1-1.839-1.838A1.841,1.841,0,0,1,573.378,2142.023Z" transform="translate(-566.305 -2140.185)" fill="#d52a6b" stroke="#d52a6b" stroke-width="1"/>
                            <path id="Path_419" data-name="Path 419" d="M555.607,2149.112a3.733,3.733,0,0,0,1.235,2.29,14.078,14.078,0,0,0,2.256,1.747,14.039,14.039,0,0,0,2.138-1.585,4.239,4.239,0,0,0,1.395-2.451" transform="translate(-555.584 -2146.976)" fill="#d52a6b" stroke="#d52a6b" stroke-width="1"/>
                          </g>
                          <g id="Group_104" data-name="Group 104" transform="translate(0 14.098)">
                            <path id="Path_420" data-name="Path 420" d="M492.073,2142.023a1.838,1.838,0,1,1-1.838-1.838A1.839,1.839,0,0,1,492.073,2142.023Z" transform="translate(-488.396 -2140.185)" fill="#d52a6b" stroke="#d52a6b" stroke-width="1"/>
                            <path id="Path_421" data-name="Path 421" d="M506.265,2142.023a1.838,1.838,0,1,1-1.839-1.838A1.841,1.841,0,0,1,506.265,2142.023Z" transform="translate(-499.192 -2140.185)" fill="#d52a6b" stroke="#d52a6b" stroke-width="1"/>
                            <path id="Path_422" data-name="Path 422" d="M488.5,2149.112a3.725,3.725,0,0,0,1.235,2.29,14.05,14.05,0,0,0,2.255,1.747,14.089,14.089,0,0,0,2.138-1.585,4.241,4.241,0,0,0,1.395-2.451" transform="translate(-488.473 -2146.976)" fill="#d52a6b" stroke="#d52a6b" stroke-width="1"/>
                          </g>
                          <g id="Group_105" data-name="Group 105" transform="translate(8.243)">
                            <path id="Path_423" data-name="Path 423" d="M526.525,2083.1a1.838,1.838,0,1,1-1.838-1.838A1.837,1.837,0,0,1,526.525,2083.1Z" transform="translate(-522.848 -2081.263)" fill="#d52a6b" stroke="#d52a6b" stroke-width="1"/>
                            <path id="Path_424" data-name="Path 424" d="M540.716,2083.1a1.838,1.838,0,1,1-1.839-1.838A1.839,1.839,0,0,1,540.716,2083.1Z" transform="translate(-533.644 -2081.263)" fill="#d52a6b" stroke="#d52a6b" stroke-width="1"/>
                            <path id="Path_425" data-name="Path 425" d="M522.945,2090.184a3.731,3.731,0,0,0,1.235,2.29,14.034,14.034,0,0,0,2.256,1.746,14,14,0,0,0,2.138-1.583,4.243,4.243,0,0,0,1.4-2.453" transform="translate(-522.922 -2088.05)" fill="#d52a6b" stroke="#d52a6b" stroke-width="1"/>
                          </g>
                          <path id="Path_426" data-name="Path 426" d="M502.979,2096.629a8.89,8.89,0,0,0-4.322,3.284c-2.034,2.446-1.859,6.349-1.859,6.349" transform="translate(-494.785 -2092.952)" fill="none" stroke="#d52a6b" stroke-miterlimit="10" stroke-width="2"/>
                          <path id="Path_427" data-name="Path 427" d="M557.122,2106.733a8.882,8.882,0,0,0-.986-5.339c-1.267-2.917-4.828-4.52-4.828-4.52" transform="translate(-536.256 -2093.139)" fill="none" stroke="#d52a6b" stroke-miterlimit="10" stroke-width="2"/>
                          <path id="Path_428" data-name="Path 428" d="M510.269,2163.681a10.623,10.623,0,0,0,5.786,2.333c3.26.332,6.552-2.192,6.552-2.192" transform="translate(-505.036 -2143.961)" fill="none" stroke="#d52a6b" stroke-miterlimit="10" stroke-width="2"/>
                        </g>
                      </svg>
                                                             
                    `:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24.131" height="23.593" viewBox="0 0 24.131 23.593">
                    <g id="Group_106" data-name="Group 106" transform="translate(0.5 0.5)">
                      <g id="Group_103" data-name="Group 103" transform="translate(16.058 14.098)">
                        <path id="Path_417" data-name="Path 417" d="M559.187,2142.023a1.838,1.838,0,1,1-1.838-1.838A1.839,1.839,0,0,1,559.187,2142.023Z" transform="translate(-555.51 -2140.185)" fill="#b5ccd1" stroke="#b5cdd1" stroke-width="1"/>
                        <path id="Path_418" data-name="Path 418" d="M573.378,2142.023a1.838,1.838,0,1,1-1.839-1.838A1.841,1.841,0,0,1,573.378,2142.023Z" transform="translate(-566.305 -2140.185)" fill="#b5ccd1" stroke="#b5cdd1" stroke-width="1"/>
                        <path id="Path_419" data-name="Path 419" d="M555.607,2149.112a3.733,3.733,0,0,0,1.235,2.29,14.078,14.078,0,0,0,2.256,1.747,14.039,14.039,0,0,0,2.138-1.585,4.239,4.239,0,0,0,1.395-2.451" transform="translate(-555.584 -2146.976)" fill="#b5ccd1" stroke="#b5cdd1" stroke-width="1"/>
                      </g>
                      <g id="Group_104" data-name="Group 104" transform="translate(0 14.098)">
                        <path id="Path_420" data-name="Path 420" d="M492.073,2142.023a1.838,1.838,0,1,1-1.838-1.838A1.839,1.839,0,0,1,492.073,2142.023Z" transform="translate(-488.396 -2140.185)" fill="#b5ccd1" stroke="#b5cdd1" stroke-width="1"/>
                        <path id="Path_421" data-name="Path 421" d="M506.265,2142.023a1.838,1.838,0,1,1-1.839-1.838A1.841,1.841,0,0,1,506.265,2142.023Z" transform="translate(-499.192 -2140.185)" fill="#b5ccd1" stroke="#b5cdd1" stroke-width="1"/>
                        <path id="Path_422" data-name="Path 422" d="M488.5,2149.112a3.725,3.725,0,0,0,1.235,2.29,14.05,14.05,0,0,0,2.255,1.747,14.089,14.089,0,0,0,2.138-1.585,4.241,4.241,0,0,0,1.395-2.451" transform="translate(-488.473 -2146.976)" fill="#b5ccd1" stroke="#b5cdd1" stroke-width="1"/>
                      </g>
                      <g id="Group_105" data-name="Group 105" transform="translate(8.243)">
                        <path id="Path_423" data-name="Path 423" d="M526.525,2083.1a1.838,1.838,0,1,1-1.838-1.838A1.837,1.837,0,0,1,526.525,2083.1Z" transform="translate(-522.848 -2081.263)" fill="#b5ccd1" stroke="#b5cdd1" stroke-width="1"/>
                        <path id="Path_424" data-name="Path 424" d="M540.716,2083.1a1.838,1.838,0,1,1-1.839-1.838A1.839,1.839,0,0,1,540.716,2083.1Z" transform="translate(-533.644 -2081.263)" fill="#b5ccd1" stroke="#b5cdd1" stroke-width="1"/>
                        <path id="Path_425" data-name="Path 425" d="M522.945,2090.184a3.731,3.731,0,0,0,1.235,2.29,14.034,14.034,0,0,0,2.256,1.746,14,14,0,0,0,2.138-1.583,4.243,4.243,0,0,0,1.4-2.453" transform="translate(-522.922 -2088.05)" fill="#b5ccd1" stroke="#b5cdd1" stroke-width="1"/>
                      </g>
                      <path id="Path_426" data-name="Path 426" d="M502.979,2096.629a8.89,8.89,0,0,0-4.322,3.284c-2.034,2.446-1.859,6.349-1.859,6.349" transform="translate(-494.785 -2092.952)" fill="none" stroke="#b5cdd1" stroke-miterlimit="10" stroke-width="2"/>
                      <path id="Path_427" data-name="Path 427" d="M557.122,2106.733a8.882,8.882,0,0,0-.986-5.339c-1.267-2.917-4.828-4.52-4.828-4.52" transform="translate(-536.256 -2093.139)" fill="none" stroke="#b5cdd1" stroke-miterlimit="10" stroke-width="2"/>
                      <path id="Path_428" data-name="Path 428" d="M510.269,2163.681a10.623,10.623,0,0,0,5.786,2.333c3.26.332,6.552-2.192,6.552-2.192" transform="translate(-505.036 -2143.961)" fill="none" stroke="#b5cdd1" stroke-miterlimit="10" stroke-width="2"/>
                    </g>
                  </svg>
                                                                   
                `}} />
                      
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
                    {/* <Image
                    style={{ width: 25, height: 25, color:{tintColor}}}
                    // source={require('../Images/icon-tab-center.svg')}
                    source={focused ? require('../Images/icon-tab-more-selected.svg') : require('../Images/icon-tab-more.svg')}/> */}

                    <Image
                        style={{ width: 25, height: 25}}
                        source={{uri:focused ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="55.586" height="11.928" viewBox="0 0 55.586 11.928">
                        <g id="Group_107" data-name="Group 107" transform="translate(0 0)">
                          <path id="Path_429" data-name="Path 429" d="M825.581,2120.389a3.554,3.554,0,1,1-3.554-3.554A3.552,3.552,0,0,1,825.581,2120.389Z" transform="translate(-818.474 -2116.835)" fill="#d52a6b"/>
                          <path id="Path_430" data-name="Path 430" d="M842.386,2120.389a3.554,3.554,0,1,1-3.554-3.554A3.552,3.552,0,0,1,842.386,2120.389Z" transform="translate(-828.718 -2116.835)" fill="#d52a6b"/>
                          <path id="Path_431" data-name="Path 431" d="M818.594,2127.41s-.047,1.794,2.385,4.425a27.233,27.233,0,0,0,4.359,3.375,26.842,26.842,0,0,0,4.13-3.061,8.191,8.191,0,0,0,2.7-4.739" transform="translate(-818.547 -2123.282)" fill="#d52a6b"/>
                          <path id="Path_432" data-name="Path 432" d="M880.2,2120.389a3.554,3.554,0,1,1-3.554-3.554A3.552,3.552,0,0,1,880.2,2120.389Z" transform="translate(-851.77 -2116.835)" fill="#d52a6b"/>
                          <path id="Path_433" data-name="Path 433" d="M897.006,2120.389a3.554,3.554,0,1,1-3.554-3.554A3.552,3.552,0,0,1,897.006,2120.389Z" transform="translate(-862.015 -2116.835)" fill="#d52a6b"/>
                          <path id="Path_434" data-name="Path 434" d="M873.213,2127.41s-.047,1.794,2.385,4.425a27.269,27.269,0,0,0,4.359,3.375,26.8,26.8,0,0,0,4.13-3.061,8.185,8.185,0,0,0,2.7-4.739" transform="translate(-851.843 -2123.282)" fill="#d52a6b"/>
                          <path id="Path_435" data-name="Path 435" d="M932.954,2120.389a3.554,3.554,0,1,1-3.554-3.554A3.552,3.552,0,0,1,932.954,2120.389Z" transform="translate(-883.93 -2116.835)" fill="#d52a6b"/>
                          <path id="Path_436" data-name="Path 436" d="M949.759,2120.389a3.554,3.554,0,1,1-3.553-3.554A3.551,3.551,0,0,1,949.759,2120.389Z" transform="translate(-894.174 -2116.835)" fill="#d52a6b"/>
                          <path id="Path_437" data-name="Path 437" d="M925.966,2127.41s-.046,1.794,2.386,4.425a27.267,27.267,0,0,0,4.359,3.375,26.821,26.821,0,0,0,4.13-3.061,8.187,8.187,0,0,0,2.7-4.739" transform="translate(-884.002 -2123.282)" fill="#d52a6b"/>
                        </g>
                      </svg>                                        
                    `:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="55.586" height="11.928" viewBox="0 0 55.586 11.928">
                    <g id="Group_107" data-name="Group 107" transform="translate(0 0)">
                      <path id="Path_429" data-name="Path 429" d="M825.581,2120.389a3.554,3.554,0,1,1-3.554-3.554A3.552,3.552,0,0,1,825.581,2120.389Z" transform="translate(-818.474 -2116.835)" fill="#bcd1d5"/>
                      <path id="Path_430" data-name="Path 430" d="M842.386,2120.389a3.554,3.554,0,1,1-3.554-3.554A3.552,3.552,0,0,1,842.386,2120.389Z" transform="translate(-828.718 -2116.835)" fill="#bcd1d5"/>
                      <path id="Path_431" data-name="Path 431" d="M818.594,2127.41s-.047,1.794,2.385,4.425a27.233,27.233,0,0,0,4.359,3.375,26.842,26.842,0,0,0,4.13-3.061,8.191,8.191,0,0,0,2.7-4.739" transform="translate(-818.547 -2123.282)" fill="#bcd1d5"/>
                      <path id="Path_432" data-name="Path 432" d="M880.2,2120.389a3.554,3.554,0,1,1-3.554-3.554A3.552,3.552,0,0,1,880.2,2120.389Z" transform="translate(-851.77 -2116.835)" fill="#bcd1d5"/>
                      <path id="Path_433" data-name="Path 433" d="M897.006,2120.389a3.554,3.554,0,1,1-3.554-3.554A3.552,3.552,0,0,1,897.006,2120.389Z" transform="translate(-862.015 -2116.835)" fill="#bcd1d5"/>
                      <path id="Path_434" data-name="Path 434" d="M873.213,2127.41s-.047,1.794,2.385,4.425a27.269,27.269,0,0,0,4.359,3.375,26.8,26.8,0,0,0,4.13-3.061,8.185,8.185,0,0,0,2.7-4.739" transform="translate(-851.843 -2123.282)" fill="#bcd1d5"/>
                      <path id="Path_435" data-name="Path 435" d="M932.954,2120.389a3.554,3.554,0,1,1-3.554-3.554A3.552,3.552,0,0,1,932.954,2120.389Z" transform="translate(-883.93 -2116.835)" fill="#bcd1d5"/>
                      <path id="Path_436" data-name="Path 436" d="M949.759,2120.389a3.554,3.554,0,1,1-3.553-3.554A3.551,3.551,0,0,1,949.759,2120.389Z" transform="translate(-894.174 -2116.835)" fill="#bcd1d5"/>
                      <path id="Path_437" data-name="Path 437" d="M925.966,2127.41s-.046,1.794,2.386,4.425a27.267,27.267,0,0,0,4.359,3.375,26.821,26.821,0,0,0,4.13-3.061,8.187,8.187,0,0,0,2.7-4.739" transform="translate(-884.002 -2123.282)" fill="#bcd1d5"/>
                    </g>
                  </svg>                                                     
                `}} />
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