import { Animated } from "react-native";

import { createStackNavigator, createTabNavigator } from 'react-navigation'
import Home from './home';
import Details from './details';
import AddFriendsPage from './AddFriendsPage';
import AddGroupsPage from './AddGroupsPage';
import AddClasssPage from './AddClasssPage';

import MyProfilePage from './MyProfilePage';
import FriendProfilePage from './FriendProfilePage';
import ManageGroupPage from './ManageGroupPage';
import ListClassUserPage from './ListClassUserPage'

import QRCodeReaderPage from './QRCodeReaderPage'
import FindFriendPage from './FindFriendPage'
import InviteFriendForContactPage from './InviteFriendForContactPage'

import ContactsSearch from './ContactsSearch'

import ChatPage from '../RECENT/ChatPage'

import ListGroupMemberPage from './ListGroupMemberPage'


import MyCustomTransition from '../../test/MyCustomTransition'

import GroupsQRcode from './GroupsQRcode'

import GroupSettingsPage from './GroupSettingsPage'
import GroupMemberInvite from './GroupMemberInvite'

const index = createStackNavigator({
    'Home': {
        screen: Home,
        navigationOptions: {
          title: 'Contacts',
        },
    },
    'Details': {
        screen: Details,
        navigationOptions: {
          title: 'Details',
        },
    },
    'AddFriendsPage': {
        screen: AddFriendsPage,
        navigationOptions: {
          title: 'Add Friends'
        },
    },
    'AddClasssPage': {
        screen: AddClasssPage,
        navigationOptions: {
          title: 'Add Classs',
        },
    },
    'AddGroupsPage': {
        screen: AddGroupsPage,
        navigationOptions: {
          // title: 'Add Groups',
        },
    },
    'MyProfilePage': {
      screen: MyProfilePage,
      navigationOptions: {
        // title: 'My Profile',
      }
    },
    'FriendProfilePage': {
      screen: FriendProfilePage,
      navigationOptions: {
        // title: 'Friend Profile',
      }
    },
    'ManageGroupPage': {
      screen: ManageGroupPage,
      navigationOptions: {
        // title: 'Manage Group',
      }
    },
    'ListClassUserPage': {
      screen: ListClassUserPage,
      navigationOptions: {
        title: 'List Class User',
      }
    },
    'QRCodeReaderPage': {
      screen: QRCodeReaderPage,
      navigationOptions: {
        // title: 'QRCode Reader',
      }
    },
    'FindFriendPage': { 
      screen: FindFriendPage,
      navigationOptions: {
        // title: 'By Id',
      }
    },
    'InviteFriendForContactPage': {
      screen: InviteFriendForContactPage,
      navigationOptions: {
        title: 'Invite Friend',
      }
    },
    'ChatPage': {
      screen: ChatPage,
      navigationOptions: {
        title: 'Chat Page',
      }
    },
    'ContactsSearch': {
      screen: ContactsSearch,
      navigationOptions: {
        title: 'Search',
      }
    },
    'ListGroupMemberPage': {
      screen: ListGroupMemberPage,
    },
    // 'GroupsQRcode':{
    //   screen: GroupsQRcode
    // }
},{
//   initialRouteName: 'Base',
// headerMode: "screen",
  // transitionConfig: TransitionConfiguration
  
    // mode: 'modal',
    // headerMode: 'none',
  
});

// index.navigationOptions = ({ navigation }) => {
//     let { routeName } = navigation.state.routes[navigation.state.index];
//     let navigationOptions = {};
  
//     // set tabbar visible
//     if (routeName === 'AddFriendsPage' || 
//         routeName === 'AddClasssPage' || 
//         routeName === 'AddGroupsPage' ||
//         routeName === 'MyProfilePage' ||
//         routeName === 'FriendProfilePage' ||
//         routeName === 'ManageGroupPage' ||
//         routeName === 'ListClassUserPage' ||
//         routeName === 'QRCodeReaderPage' ||
//         routeName === 'FindFriendPage' ||
//         routeName === 'InviteFriendForContactPage' ||
//         routeName === 'ChatPage' ||
//         routeName === 'ContactsSearch' ||
//         routeName === 'ListGroupMemberPage'
//         ) {
//       navigationOptions.tabBarVisible = false;
//     }

//     return navigationOptions;
// };

// https://github.com/react-navigation/react-navigation/issues/707#issuecomment-299859578
const MainModalNavigator = createStackNavigator(
  {
    'index': { screen: index },
    'GroupsQRcode': { screen: GroupsQRcode },
    // 'ListGroupMemberPage': { screen: ListGroupMemberPage,},
    // 'ListClassUserPageX': {
    //   screen: ListClassUserPage,
      
    // },
    'GroupSettingsPage': {screen: GroupSettingsPage},
    'GroupMemberInvite': {screen: GroupMemberInvite}
  },
  {
    mode: 'modal',
    headerMode: 'none',
  },
);

MainModalNavigator.navigationOptions = ({ navigation }) => {
  // let { routeName, routes } = navigation.state.routes[navigation.state.index];
  let { routeName, routes } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if(routes === undefined){
    // console.log(routeName)
    if(routeName === 'GroupsQRcode' || 
       routeName === 'GroupSettingsPage' ||
       routeName === 'GroupMemberInvite'){
      navigationOptions.tabBarVisible = false;
      return navigationOptions;
    }
    return;
  }

  routeName = routes[navigation.state.routes[navigation.state.index].index].routeName;

  // set tabbar visible
  if (routeName === 'AddFriendsPage' || 
      routeName === 'AddClasssPage' || 
      routeName === 'AddGroupsPage' ||
      routeName === 'MyProfilePage' ||
      routeName === 'FriendProfilePage' ||
      routeName === 'ManageGroupPage' ||
      routeName === 'ListClassUserPage' ||
      routeName === 'QRCodeReaderPage' ||
      routeName === 'FindFriendPage' ||
      routeName === 'InviteFriendForContactPage' ||
      routeName === 'ChatPage' ||
      routeName === 'ContactsSearch' ||
      routeName === 'ListGroupMemberPage'
      ) {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};


export default MainModalNavigator