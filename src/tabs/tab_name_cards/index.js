import { createStackNavigator } from 'react-navigation';
// import Home from './home';

// import Home from './homeX';

import home from './home'
import NameCardPage from './NameCardPage'
import SettingsNameCardsPage from './SettingsNameCardsPage'
import QRcodeReaderNameCard from './QRcodeReaderNameCard'
import ManageCategoryPage from './ManageCategoryPage' 

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
})

index.navigationOptions = ({ navigation }) => {
    let { routeName } = navigation.state.routes[navigation.state.index];
    let navigationOptions = {};
  
    if (routeName === 'name_card'||
        routeName === 'settings_name_cards'||
        routeName === 'qrcode_reader_name_card'||
        routeName === 'manage_category') {
      navigationOptions.tabBarVisible = false;
    }
    return navigationOptions;
};

export default index