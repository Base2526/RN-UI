import { createStackNavigator } from 'react-navigation';
// import Home from './home';

import Home from './homeX';

import homeY from './homeY'
import SettingListHide from './SettingListHide'
import SettingListBlock from './SettingListBlock'
import SettingListFriendRequestSent from './SettingListFriendRequestSent'
import SettingListManageClass from './SettingListManageClass'
import SettingListManageGroup from './SettingListManageGroup'
import SettingListManageMyApplication from './SettingListManageMyApplication'
import SettingListForceLogout from './SettingListForceLogout'
import SettingListCustomizeTabMenus from './SettingListCustomizeTabMenus'
import GoogleSearchCompany from './GoogleSearchCompany'
import GoogleSearchCompanyDetail from './GoogleSearchCompanyDetail'

import FriendProfilePage from '../CONTACTS/FriendProfilePage';

const index =  createStackNavigator({
    'home': {
        screen: homeY,
        navigationOptions: {
          title: 'Settings'
        },
    },
    'hide': {
        screen: SettingListHide,
        navigationOptions: {
          title: 'Friend hide'
        },
    },
    'block': {
        screen: SettingListBlock,
        navigationOptions: {
          title: 'Friend block'
        },
    },
    'friend_request_sent': {
        screen: SettingListFriendRequestSent,
        navigationOptions: {
          title: 'Friend Request Sent'
        },
    },
    'manage_class': {
        screen: SettingListManageClass,
        navigationOptions: {
          title: 'Manage Class'
        },
    },
    'manage_group': {
        screen: SettingListManageGroup,
        navigationOptions: {
          title: 'Manage Group'
        },
    },
    'manage_my_application': {
        screen: SettingListManageMyApplication,
        navigationOptions: {
          title: 'Manage My Application'
        },
    },
    'manage_force_logout': {
        screen: SettingListForceLogout,
        navigationOptions: {
          title: 'Force Logout'
        },
    },
    'manage_customize_tab_menus': {
        screen: SettingListCustomizeTabMenus,
        navigationOptions: {
          title: 'Customize Tab Menus'
        },
    },
    'google_search_company': {
        screen: GoogleSearchCompany,
        navigationOptions: {
          title: 'Google Search Company'
        },
    },
    // 
    'google_search_company_detail': {
        screen: GoogleSearchCompanyDetail,
        navigationOptions: {
          title: 'Google Search Company Detail'
        },
    },
    'FriendProfilePage': {
        screen: FriendProfilePage,
        navigationOptions: {
          // title: 'Friend Profile',
        }
      },
})

index.navigationOptions = ({ navigation }) => {
    let { routeName } = navigation.state.routes[navigation.state.index];
    let navigationOptions = {};
  
    // set tabbar visible
    if (routeName === 'hide' || 
        routeName === 'block' || 
        routeName === 'friend_request_sent' ||
        routeName === 'manage_class' ||
        routeName === 'manage_group' ||
        routeName === 'manage_my_application' ||
        routeName === 'manage_force_logout' ||
        routeName === 'manage_customize_tab_menus' ||
        routeName === 'google_search_company' ||
        routeName === 'google_search_company_detail' ||
        routeName === 'FriendProfilePage') {
      navigationOptions.tabBarVisible = false;
    }
    return navigationOptions;
};

export default index