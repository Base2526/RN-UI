import React from 'react'
import { createDrawerNavigator, createStackNavigator, SwitchNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Tabs from './Tabs';  //Tab Nav
import Profile from './Profile'; //Stack Nav

import SignUp from "./Screens/SignUp";
import SignIn from "./Screens/SignIn";
import Welcome from "./Screens/Welcome"

import Menu from './DrawerMenu'

// Inbox: { screen: InboxScreen },
export const SignedOut = createStackNavigator({
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

Main = createDrawerNavigator({
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

// Main.navigationOptions = ({ navigation }) => {
//   let { routeName } = navigation.state.routes[navigation.state.index];
//     let navigationOptions = {};
  
//     // set tabbar visible
//     // if (routeName === 'AddFriendsPage' || 
//     //     routeName === 'AddClasssPage' || 
//     //     routeName === 'AddGroupsPage' ||
//     //     routeName === 'MyProfilePage' ||
//     //     routeName === 'FriendProfilePage' ||
//     //     routeName === 'ManageGroupPage' ||
//     //     routeName === 'ListClassUserPage') {
//     //   navigationOptions.tabBarVisible = false;
//     //   // navigationOptions.gesturesEnabled = false;
//     //   // navigationOptions.swipeEnabled= false;
//     // }

//     // navigationOptions.swipeEnabled= false;

//     // console.log("1, navigationOptions")
//     // console.log(navigationOptions)
//     // console.log("2, navigationOptions")

//     console.log("ooooooo------")

//     // return navigationOptions;
//     return {
//       swipeEnabled: false,
//       gesturesEnabled: false
//     }
// };


export default Main

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