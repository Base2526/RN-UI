import { createStackNavigator } from 'react-navigation';
// import Home from './home';

// import Home from './homeX';

import home from './home'
import SettingsNameCardsPage from './SettingsNameCardsPage'
import QRcodeReaderNameCard from './QRcodeReaderNameCard'

const index =  createStackNavigator({
    'home': {
        screen: home,
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
    }
})

index.navigationOptions = ({ navigation }) => {
    let { routeName } = navigation.state.routes[navigation.state.index];
    let navigationOptions = {};
  
    if (routeName === 'settings_name_cards'||
        routeName === 'qrcode_reader_name_card') {
      navigationOptions.tabBarVisible = false;
    }
    return navigationOptions;
};

export default index