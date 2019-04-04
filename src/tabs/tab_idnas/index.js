import { createStackNavigator } from 'react-navigation'
import home from './home';
import CreateApplicationPage from './CreateApplicationPage';

import ApplicationDetailPage from './ApplicationDetailPage'

import ListAllCategory from './ListAllCategory'
import ListAllSubcategory from './ListAllSubcategory'

import CommentPage from './CommentPage'

import MyProfilePage from '../tab_contacts/MyProfilePage'

import MyApplicationProfilePage from './MyApplicationProfilePage'

import CenterSearch from './CenterSearch'

import SettingMyApplicationPage from './SettingMyApplicationPage'


import MyApplicationMyPost from './MyApplicationMyPost'
import MyApplicationAddPost from './MyApplicationAddPost'
import MyApplicationReport  from './MyApplicationReport'
import MyApplicationAddFeelings from './MyApplicationAddFeelings'
import MyApplicationAddPrivacy from './MyApplicationAddPrivacy'

import ManagePhonesPage from './ManagePhonesPage'
import ManageEmailsPage from './ManageEmailsPage'
import EditNameMyApplicationPage from './EditNameMyApplicationPage'

import EditMyApplicationAddressPage from './EditMyApplicationAddressPage'

import MyApplicationQRcodePage from './MyApplicationQRcodePage'

// import ResultScanForQRcodeNameCardPage from './ResultScanForQRcodeNameCardPage'

const index = createStackNavigator({
    'Home': {
        screen: home,
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
    'setting_myapplication': {
      screen: SettingMyApplicationPage,
      navigationOptions: {
        title: '',
      }
    },
    'MyApplicationMyPost': {
      screen: MyApplicationMyPost,
      navigationOptions: {
        title: '',
      }
    },
    'ManagePhonesPage': {
      screen: ManagePhonesPage,
      navigationOptions: {

      }
    },
    'ManageEmailsPage': {
      screen: ManageEmailsPage,
      navigationOptions: {
      }
    },
    'EditNameMyApplicationPage': {
      screen: EditNameMyApplicationPage,
      navigationOptions: {
      }
    },
    'EditMyApplicationAddressPage': {
      screen: EditMyApplicationAddressPage,
      navigationOptions: {

      }
    },
    'MyApplicationQRcodePage': {
      screen: MyApplicationQRcodePage,
      navigationOptions: {

      }
    },
});

const MyApplicationAddPostNavigator = createStackNavigator(
  {
    'MyApplicationAddPost': {screen: MyApplicationAddPost},
    // 'MyApplicationReport' : {screen: MyApplicationReport},
    'MyApplicationAddFeelings': {screen: MyApplicationAddFeelings},
    'MyApplicationAddPrivacy': {screen: MyApplicationAddPrivacy}
  },
  {
    // headerMode: 'none',
  },
);

const MyApplicationReportNavigator = createStackNavigator(
  {
    'MyApplicationReport' : {screen: MyApplicationReport}
  },
  {
    // headerMode: 'none',
  },
);


const MainModalNavigator = createStackNavigator(
  {
    'index': { screen: index },
    'MyApplicationAddPostNavigator': { screen: MyApplicationAddPostNavigator },
    'MyApplicationReportNavigator': { screen: MyApplicationReportNavigator,},
    // // 'ListClassUserPageX': {
    // //   screen: ListClassUserPage,
      
    // // },
    // 'GroupSettingsNavigator': {screen: GroupSettingsNavigator},
    // 'ClasssSettingsNavigator': {screen: ClasssSettingsNavigator},
    
    // // 'ClasssSettingsPage': {screen: ClasssSettingsPage},
    // 'ClasssMemberAddFriend': {screen: ClasssMemberAddFriend},
    
    // 'MyQRcodeNavigator': {screen: MyQRcodeNavigator},
    // 'BasicInfoNavigator': {screen: BasicInfoNavigator},

    // 'ContactInfoNavigator': {screen: ContactInfoNavigator}
  },
  {
    mode: 'modal',
    headerMode: 'none',
  },
);



MainModalNavigator.navigationOptions = ({ navigation }) => {
    // let { routeName } = navigation.state.routes[navigation.state.index];
    // let navigationOptions = {};
  
    // // set tabbar visible
    // if (routeName === 'CreateApplicationPage' || 
    //     routeName === 'ApplicationDetailPage' ||
    //     routeName === 'ListAllCategory' ||
    //     routeName === 'ListAllSubcategory' ||
    //     routeName === 'Comment' ||
    //     routeName === 'MyProfilePage' ||
    //     routeName === 'MyApplicationProfilePage' ||
    //     routeName === 'CenterSearch'||
    //     routeName === 'ManageMyApplicationPage' ||
    //     routeName === 'MyApplicationMyPost' ||
    //     routeName === 'MyApplicationAddPost') {
    //   navigationOptions.tabBarVisible = false;
    // }

    let { routeName, routes } = navigation.state.routes[navigation.state.index];
    let navigationOptions = {};

    if(routes === undefined){
      console.log(routeName)
      if(routeName === 'CreateApplicationPage' || 
          routeName === 'ApplicationDetailPage' ||
        routeName === 'ListAllCategory' ||
        routeName === 'ListAllSubcategory' ||
        routeName === 'Comment' ||
        routeName === 'MyProfilePage' ||
        routeName === 'MyApplicationProfilePage' ||
        routeName === 'CenterSearch'||
        routeName === 'ManageMyApplicationPage' ||
        routeName === 'MyApplicationMyPost' ||
        routeName === 'MyApplicationAddPost' ||
        routeName === 'MyApplicationReport'  ||
        routeName === 'MyApplicationAddFeelings' ||
        routeName === 'setting_myapplication' ||
        routeName === 'MyApplicationAddPrivacy'
        ) {
        //  
        //  routeName === 'MyProfileEditContactInfoPage'

        
        navigationOptions.tabBarVisible = false;
        return navigationOptions;
      }
      return;
    }

    routeName = routes[navigation.state.routes[navigation.state.index].index].routeName;

    if(routeName === 'CreateApplicationPage' || 
        routeName === 'ApplicationDetailPage' ||
        routeName === 'ListAllCategory' ||
        routeName === 'ListAllSubcategory' ||
        routeName === 'Comment' ||
        routeName === 'MyProfilePage' ||
        routeName === 'MyApplicationProfilePage' ||
        routeName === 'CenterSearch'||
        routeName === 'ManageMyApplicationPage' ||
        routeName === 'MyApplicationMyPost' ||
        routeName === 'MyApplicationAddPost' ||
        routeName === 'ManagePhonesPage' || 
        routeName === 'ManageEmailsPage' ||
        routeName === 'setting_myapplication' ||
        routeName === 'EditNameMyApplicationPage' ||
        routeName === 'EditMyApplicationAddressPage' ||
        routeName === 'MyApplicationQRcodePage' ) {
      navigationOptions.tabBarVisible = false;
    }
  
    return navigationOptions;
};

export default MainModalNavigator