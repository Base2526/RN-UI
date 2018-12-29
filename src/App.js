import React from 'react'
import {View, Text} from 'react-native'
import { createDrawerNavigator, createStackNavigator, createSwitchNavigator, createAppContainer, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Tabs from './Tabs';  //Tab Nav
import Profile from './Profile'; //Stack Nav

import SignUp from "./Screens/SignUp";
import SignIn from "./Screens/SignIn";
import ForgotPassword from "./Screens/ForgotPassword"
import Welcome from "./Screens/Welcome"

import Menu from './DrawerMenu'

import AuthLoadingScreen from './Screens/AuthLoadingScreen'

// Inbox: { screen: InboxScreen },
export const AuthStack = createStackNavigator({
    Welcome: {
        screen: Welcome,
        navigationOptions: {
            title: "Welcome to iDNA"
        }
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            title: "Sign Up"
        }
    },
    SignIn: {
        screen: SignIn,
        navigationOptions: {
            title: "Sign In"
        }
    },
    ForgotPassword:{
      screen: ForgotPassword,
      navigationOptions:{
        title: "Forgot Password"
      }
    }
});

let drawerNavigatorConfig = {
  // initialRouteName: Home,
  // drawerWidth: width/2 + ((width/2) / 2), // เป็นการเอา เศษ 3 ส่วน 4
  drawerPosition: 'left',
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  contentComponent: Menu, // กรณีเราไม่ใส่ก็จะ render routeConfigs โดยไม่มี  DrawerContent
}

AppDrawer = createDrawerNavigator({
  Tabs: {
    screen: Tabs,
    navigationOptions: {
      drawerLabel: 'Tabs',
      drawerIcon: ({ tintColor }) => <Icon name="cog" size={17} />,
    }
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      drawerLabel: 'Profile',
      drawerIcon: ({ tintColor }) => <Icon name="user-circle" size={17} />,
    }
  },
  
}, drawerNavigatorConfig);

// export const createRootNavigator = (signedIn = false) => {
//   return( createAppContainer(createSwitchNavigator(
//       {
//         Auth: AuthStack,
//         App: AppDrawer,
//       },
//       {
//         initialRouteName: signedIn ? "App" : "Auth"
//       }
//     )
//   ))
// };

export const AppNavigator = createAppContainer(createSwitchNavigator(
  {
      AuthLoading: AuthLoadingScreen,
      Auth: AuthStack,
      App: AppDrawer,
  },
  {
      initialRouteName: 'AuthLoading',
  }
));
