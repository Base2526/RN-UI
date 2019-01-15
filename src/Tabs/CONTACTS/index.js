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
},{
//   initialRouteName: 'Base',
// headerMode: "screen",
  transitionConfig: TransitionConfiguration
});

index.navigationOptions = ({ navigation }) => {
    let { routeName } = navigation.state.routes[navigation.state.index];
    let navigationOptions = {};
  
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
        routeName === 'ListGroupMemberPage') {
      navigationOptions.tabBarVisible = false;
    }

    return navigationOptions;
};

// index.swipeEnabled= false


//////////

let TransitionConfiguration = () => {
  // return {
  //     // Define scene interpolation, eq. custom transition
  //     screenInterpolator: (sceneProps) => {

  //         const {position, scene} = sceneProps;
  //         const {index, route} = scene;
  //         const params = route.params || {};
  //         const transition = params.transition || 'default'; 
          
  //         console.log('TransitionConfiguration')

  //         return {
  //                 myCustomTransition: MyCustomTransition(index, position),
  //                 default: MyCustomTransition(index, position),
  //         }[transition];
  //     }
  // }

  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps) => {
      const { layout, position, scene } = sceneProps;
      const width = layout.initWidth;
      const { index, route } = scene
      const params = route.params || {}; // <- That's new
      const transition = params.transition || 'default'; // <- That's new
      return {
                          myCustomTransition: MyCustomTransition(index, position),
                  default: MyCustomTransition(index, position),
      }[transition];
    },
  }
};

let MyTransition = (index, position) => {
  const inputRange = [index - 1, index, index + 1];
  const outputRange = [.8, 1, 1];
  const opacity = position.interpolate({
      inputRange,
      outputRange,
  });

  const scaleY = position.interpolate({
      inputRange,
      outputRange,
  });

  return {
  opacity,
      transform: [
          {scaleY}
      ]
  };
};
//////////

export default index