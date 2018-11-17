import React from 'react'
import { createDrawerNavigator, StackNavigator, SwitchNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Tabs from './Tabs';  //Tab Nav
import Profile from './Profile'; //Stack Nav

import SignUp from "./Screens/SignUp";
import SignIn from "./Screens/SignIn";
import Welcome from "./Screens/Welcome"

import Menu from './DrawerMenu'

export const SignedOut = StackNavigator({
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

export default Main = createDrawerNavigator({
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
  }
}, drawerNavigatorConfig);

export const createRootNavigator = (signedIn = false) => {
  return SwitchNavigator(
    {
      SignedOut: {
        screen: SignedOut
      },
      Main: {
        screen: Main
      }
    },
    {
      initialRouteName: signedIn ? "SignedOut" : "Main"
    }
  );
};