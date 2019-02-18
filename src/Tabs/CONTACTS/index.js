import { Animated } from "react-native";

import { createStackNavigator, createTabNavigator } from 'react-navigation'
import home from './home';
import Details from './details';
import AddFriendsPage from './AddFriendsPage';
import AddGroupsPage from './AddGroupsPage';
import AddClasssPage from './AddClasssPage';

import MyProfilePage from './MyProfilePage';
import FriendProfilePage from './FriendProfilePage';
import ManageGroupPage from './ManageGroupPage';
import ListClassMemberPage from './ListClassMemberPage'

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
import ManageClasssPage from './ManageClasssPage'
import ClasssSettingsPage from './ClasssSettingsPage'

import ClasssMemberAddFriend from './ClasssMemberAddFriend'
import ChangeFriendsName from './ChangeFriendsName'
import MyQRcode from './MyQRcode'
import EditMyProfilePage from './EditMyProfilePage'
// import MyProfileEditContactInfoPage from './MyProfileEditContactInfoPage'

import AddAnotherPhone from './AddAnotherPhone'
import AddAnotherWebsite from './AddAnotherWebsite'
import AddAnotherEmail from './AddAnotherEmail'

import AddGroupsSelectMemberPage from './AddGroupsSelectMemberPage'
import AddClasssSelectMemberPage from './AddClasssSelectMemberPage'

import EditDisplayNamePage from './EditDisplayNamePage'
import EditStatusMessagePage from './EditStatusMessagePage'
import EditMyIDPage from './EditMyIDPage'

import EditAddressPage from './EditAddressPage'

import EditGroupNamePage from './EditGroupNamePage'
import EditClassNamePage from './EditClassNamePage'

const index = createStackNavigator({
    'Home': {
        screen: home,
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
          // title: 'Add Friends'
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
    'AddGroupsSelectMemberPage':{
      screen: AddGroupsSelectMemberPage,
        navigationOptions: {
          // title: 'Add Groups',
        },
    },
    'AddClasssSelectMemberPage':{
      screen: AddClasssSelectMemberPage,
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
    'ListClassMemberPage': {
      screen: ListClassMemberPage,
      navigationOptions: {
        // title: 'List Class User',
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
        // title: 'Invite Friend',
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
    // 'ListGroupMemberPage': {
    //   screen: ListGroupMemberPage,
    // },
    'ManageClasssPage':{
      screen: ManageClasssPage
    },
    'ChangeFriendsName': {
      screen: ChangeFriendsName
    },
    // 'ClasssMemberAddFriend': {
    //   screen: ClasssMemberAddFriend
    // },
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

// EditBasicInfoPage
const BasicInfoNavigator = createStackNavigator(
{
  'EditMyProfilePage': {screen: EditMyProfilePage},  
  'AddAnotherPhone': {screen: AddAnotherPhone},
  'AddAnotherWebsite': {screen: AddAnotherWebsite},
  'AddAnotherEmail': {screen: AddAnotherEmail},
  'EditDisplayNamePage':{screen: EditDisplayNamePage},
  'EditStatusMessagePage':{screen: EditStatusMessagePage},
  'EditMyIDPage':{screen: EditMyIDPage},
  'EditAddressPage':{screen: EditAddressPage}
},
{
  // headerMode: 'none',
},);


const MyQRcodeNavigator = createStackNavigator(
{
  'MyQRcode': {screen: MyQRcode},
  'MyQRcode_QRCodeReaderPage' : {screen:QRCodeReaderPage}
},
{
  // headerMode: 'none',
},);

const ListGroupMemberNavigator = createStackNavigator(
  {
    'ListGroupMemberPage': {screen: ListGroupMemberPage},
    'GroupMemberInvite': {screen: GroupMemberInvite},
  },
  {
    // headerMode: 'none',
},);

const ClasssSettingsNavigator = createStackNavigator(
  {
    'ClasssSettingsPage': {screen: ClasssSettingsPage},
    'EditClassNamePage': {screen: EditClassNamePage}
  },
  {
    // headerMode: 'none',
  },
);

const ListClassMemberNavigator = createStackNavigator(
  {
    // 'ClasssSettingsPage': {screen: ClasssSettingsPage},
    // 'ListClassMemberPage': {screen: ListClassMemberPage},
    'ClasssMemberAddFriend': {screen: ClasssMemberAddFriend},
  },
  {
    // headerMode: 'none',
  },
);

const GroupSettingsNavigator = createStackNavigator(
  {
    'GroupSettingsPage': {screen: GroupSettingsPage},
    'EditGroupNamePage': {screen: EditGroupNamePage}
  },
  {
    // headerMode: 'none',
  },
);

// const ContactInfoNavigator = createStackNavigator(
// {
//   // 'MyProfileEditContactInfoPage': {screen: MyProfileEditContactInfoPage},
//   'AddAnotherPhone': {screen: AddAnotherPhone},
//   'AddAnotherWebsite': {screen: AddAnotherWebsite},
//   'AddAnotherEmail': {screen: AddAnotherEmail},
// },
// {
//   // headerMode: 'none',
// },);

// https://github.com/react-navigation/react-navigation/issues/707#issuecomment-299859578
const MainModalNavigator = createStackNavigator(
  {
    'index': { screen: index },
    'GroupsQRcode': { screen: GroupsQRcode },
    'ListGroupMemberNavigator': { screen: ListGroupMemberNavigator,},
    // 'ListClassUserPageX': {
    //   screen: ListClassUserPage,
      
    // },
    'GroupSettingsNavigator': {screen: GroupSettingsNavigator},
    'ClasssSettingsNavigator': {screen: ClasssSettingsNavigator},
    'ListClassMemberNavigator': {screen: ListClassMemberNavigator},
    
    // 'ClasssSettingsPage': {screen: ClasssSettingsPage},
    // 'ClasssMemberAddFriend': {screen: ClasssMemberAddFriend},
    
    'MyQRcodeNavigator': {screen: MyQRcodeNavigator},
    'BasicInfoNavigator': {screen: BasicInfoNavigator},

    // 'ContactInfoNavigator': {screen: ContactInfoNavigator}
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
    console.log(routeName)
    if(routeName === 'GroupsQRcode' || 
       routeName === 'GroupSettingsPage' ||
       routeName === 'GroupMemberInvite' ||
       routeName === 'ClasssSettingsPage' ||
       routeName === 'ClasssMemberAddFriend' ||
       routeName === 'ChangeFriendsName' ||
       routeName === 'MyQRcode' ){
      //  routeName === 'MyProfileEditBasicInfoPage' ||
      //  routeName === 'MyProfileEditContactInfoPage'
      
      navigationOptions.tabBarVisible = false;
      return navigationOptions;
    }
    return;
  }

  routeName = routes[navigation.state.routes[navigation.state.index].index].routeName;

  // console.log(routeName)
  // set tabbar visible
  if (routeName === 'AddFriendsPage' || 
      routeName === 'AddClasssPage' || 
      routeName === 'AddGroupsPage' ||
      routeName === 'MyProfilePage' ||
      routeName === 'FriendProfilePage' ||
      routeName === 'ManageGroupPage' ||
      routeName === 'ListClassMemberPage' ||
      routeName === 'QRCodeReaderPage' ||
      routeName === 'FindFriendPage' ||
      routeName === 'InviteFriendForContactPage' ||
      routeName === 'ChatPage' ||
      routeName === 'ContactsSearch' ||
      routeName === 'ListGroupMemberPage' ||
      routeName === 'ManageClasssPage' ||
      routeName === 'AddGroupsSelectMemberPage' ||
      routeName === 'AddClasssSelectMemberPage' ||
      routeName === 'AddAnotherPhone' ||
      routeName === 'AddAnotherEmail' || 
      routeName === 'AddAnotherWebsite' ||
      routeName === 'EditMyProfilePage' ||
      routeName === 'EditDisplayNamePage' ||
      routeName === 'EditStatusMessagePage' ||
      routeName === 'EditMyIDPage' ||
      routeName === 'EditAddressPage' ||
      routeName === 'MyQRcode' ||
      routeName === 'MyQRcode_QRCodeReaderPage' ||
      routeName === 'GroupSettingsPage' ||
      routeName === 'EditGroupNamePage' ||
      routeName === 'GroupMemberInvite' ||
      routeName === 'ChangeFriendsName' ||
      routeName === 'ClasssSettingsPage' ||
      routeName === 'ClasssMemberAddFriend' ||
      routeName === 'EditClassNamePage'
      ) {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

export default MainModalNavigator