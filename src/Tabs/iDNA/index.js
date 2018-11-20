import { createStackNavigator } from 'react-navigation'
import Home from './home';
import CreateApplicationPage from './CreateApplicationPage';

import ApplicationDetailPage from './ApplicationDetailPage'

const index = createStackNavigator({
    'Home': {
        screen: Home,
        navigationOptions: {
          title: 'iDNA',
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
          title: 'Application Detail',
        },
    }
});

index.navigationOptions = ({ navigation }) => {
    let { routeName } = navigation.state.routes[navigation.state.index];
    let navigationOptions = {};
  
    // set tabbar visible
    if (routeName === 'CreateApplicationPage' || 
        routeName === 'ApplicationDetailPage' ) {
      navigationOptions.tabBarVisible = false;
    }
  
    return navigationOptions;
};

export default index