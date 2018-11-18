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
import AddFriendByIdPage from './AddFriendByIdPage'
import InviteFriendForContactPage from './InviteFriendForContactPage'

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
          title: 'Add Groups',
        },
    },
    'MyProfilePage': {
      screen: MyProfilePage,
      navigationOptions: {
        title: 'MyProfile',
      }
    },
    'FriendProfilePage': {
      screen: FriendProfilePage,
      navigationOptions: {
        title: 'Friend Profile',
      }
    },
    'ManageGroupPage': {
      screen: ManageGroupPage,
      navigationOptions: {
        title: 'Manage Group',
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
        title: 'QRCode Reader',
      }
    },
    'AddFriendByIdPage': {
      screen: AddFriendByIdPage,
      navigationOptions: {
        title: 'By Id',
      }
    },
    'InviteFriendForContactPage': {
      screen: InviteFriendForContactPage,
      navigationOptions: {
        title: 'Invite Friend',
      }
    },
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
        routeName === 'AddFriendByIdPage' ||
        routeName === 'InviteFriendForContactPage') {
      navigationOptions.tabBarVisible = false;
    }

    return navigationOptions;
};

// index.swipeEnabled= false

export default index