import { createStackNavigator } from 'react-navigation';
// import Home from './home';

// import Home from './homeX';

import home from './home'
import NameCardPage from './NameCardPage'
import SettingsNameCardsPage from './SettingsNameCardsPage'
import QRcodeReaderNameCard from './QRcodeReaderNameCard'
import ManageCategoryPage from './ManageCategoryPage' 

import ResultScanForQRcodeNameCardPage from './ResultScanForQRcodeNameCardPage'

const ResultScanForQRcodeNameCardPageNavigator = createStackNavigator({
    'ResultScanForQRcodeNameCardPage': {screen: ResultScanForQRcodeNameCardPage},
},{
    mode: 'modal',
    // headerMode: 'none',
},);

const index =  createStackNavigator({
    'home': {
        screen: home,
        navigationOptions: {
            //   title: 'Settings'
        },
    },
    'name_card': {
        screen: NameCardPage,
        navigationOptions: {
            //   title: 'Settings'
        },
    },
    'settings_name_cards': {
        screen: SettingsNameCardsPage,
        navigationOptions: {
            //   title: 'Settings'
        },
    },
    'qrcode_reader_name_card': {
        screen: QRcodeReaderNameCard,
        navigationOptions: {
            //   title: 'Settings'
        },
    },
    'manage_category': {
        screen: ManageCategoryPage,
        navigationOptions: {
            //   title: 'Settings'
        },
    },
    // 'ResultScanForQRcodeNameCardPageNavigator': {
    //     screen: ResultScanForQRcodeNameCardPageNavigator
    // }
},{
    // mode: 'modal',
    // headerMode: 'none',
})

const MainModalNavigator = createStackNavigator(
    {
      'index': { screen: index },
      'ResultScanForQRcodeNameCardPageNavigator': { screen: ResultScanForQRcodeNameCardPageNavigator },
    },
    {
      mode: 'modal',
      headerMode: 'none',
    },
);

// MainModalNavigator.navigationOptions = ({ navigation }) => {
//     let { routeName } = navigation.state.routes[navigation.state.index];
//     let navigationOptions = {};
  
//     if (routeName === 'name_card'||
//         routeName === 'settings_name_cards'||
//         routeName === 'qrcode_reader_name_card'||
//         routeName === 'manage_category'||
//         routeName === 'result_scan_name_card_navigator') {
//       navigationOptions.tabBarVisible = false;
//     }
//     return navigationOptions;
// };
MainModalNavigator.navigationOptions = ({ navigation }) => {
    let { routeName, routes } = navigation.state.routes[navigation.state.index];
    let navigationOptions = {};

    if(routes === undefined){
      console.log(routeName)
      if(routeName === 'name_card' || 
        routeName === 'settings_name_cards' ||
        routeName === 'qrcode_reader_name_card' ||
        routeName === 'manage_category' ||
        routeName === 'ResultScanForQRcodeNameCardPage' 
        // routeName === 'MyProfilePage' ||
        // routeName === 'MyApplicationProfilePage' ||
        // routeName === 'CenterSearch'||
        // routeName === 'ManageMyApplicationPage' ||
        // routeName === 'MyApplicationMyPost' ||
        // routeName === 'MyApplicationAddPost' ||
        // routeName === 'MyApplicationReport'  ||
        // routeName === 'MyApplicationAddFeelings' ||
        // routeName === 'setting_myapplication' ||
        // routeName === 'MyApplicationAddPrivacy'
        ) {
        //  
        //  routeName === 'MyProfileEditContactInfoPage'

        
        navigationOptions.tabBarVisible = false;
        return navigationOptions;
      }
      return;
    }

    routeName = routes[navigation.state.routes[navigation.state.index].index].routeName;

    if( routeName === 'name_card' || 
        routeName === 'settings_name_cards' ||
        routeName === 'qrcode_reader_name_card' ||
        routeName === 'manage_category' ||
        routeName === 'ResultScanForQRcodeNameCardPage'  ) {
      navigationOptions.tabBarVisible = false;
    }
  
    return navigationOptions;
};

export default MainModalNavigator