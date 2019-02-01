import { createStackNavigator } from 'react-navigation'
import Home from './home';
import CreateApplicationPage from './CreateApplicationPage';

import ApplicationDetailPage from './ApplicationDetailPage'

import ListAllCategory from './ListAllCategory'
import ListAllSubcategory from './ListAllSubcategory'

import CommentPage from './CommentPage'

import MyProfilePage from '../CONTACTS/MyProfilePage'

import MyApplicationProfilePage from './MyApplicationProfilePage'

import CenterSearch from './CenterSearch'

import ManageMyApplicationPage from './ManageMyApplicationPage'

const index = createStackNavigator({
    'Home': {
        screen: Home,
        navigationOptions: {
          // title: 'iDNA',
        },
    },
    'CreateApplicationPage': {
        screen: CreateApplicationPage,
        navigationOptions: {
          title: 'Create Application',
        },
    },
    'ApplicationDetailPage': {
        screen: ApplicationDetailPage,
        navigationOptions: {
          title: 'Detail',
        },
    },
    'ListAllCategory': {
        screen: ListAllCategory,
        navigationOptions: {
          title: 'Select Category',
        },
    },
    'ListAllSubcategory': {
        screen: ListAllSubcategory,
        navigationOptions: {
          title: 'Select Subcategory',
        },
    },
    'Comment': {
        screen: CommentPage,
        navigationOptions: {
          title: 'Comment',
        },
    },
    'MyProfilePage': {
        screen: MyProfilePage,
        navigationOptions: {
          title: 'MyProfile',
        }
      },
    'MyApplicationProfilePage': {
        screen: MyApplicationProfilePage,
        navigationOptions: {
          title: 'My Application',
        }
      },
    'CenterSearch': {
        screen: CenterSearch,
        navigationOptions: {
          title: 'Search',
        }
    },
    'ManageMyApplicationPage': {
      screen: ManageMyApplicationPage,
      navigationOptions: {
        title: '',
      }
    },
});

index.navigationOptions = ({ navigation }) => {
    let { routeName } = navigation.state.routes[navigation.state.index];
    let navigationOptions = {};
  
    // set tabbar visible
    if (routeName === 'CreateApplicationPage' || 
        routeName === 'ApplicationDetailPage' ||
        routeName === 'ListAllCategory' ||
        routeName === 'ListAllSubcategory' ||
        routeName === 'Comment' ||
        routeName === 'MyProfilePage' ||
        routeName === 'MyApplicationProfilePage' ||
        routeName === 'CenterSearch'||
        routeName === 'ManageMyApplicationPage') {
      navigationOptions.tabBarVisible = false;
    }
  
    return navigationOptions;
};

export default index