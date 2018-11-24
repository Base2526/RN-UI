import { createStackNavigator } from 'react-navigation'
import Home from './home';
import CreateApplicationPage from './CreateApplicationPage';

import ApplicationDetailPage from './ApplicationDetailPage'

import ListAllCategory from './ListAllCategory'
import ListAllSubcategory from './ListAllSubcategory'

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
    }
});

index.navigationOptions = ({ navigation }) => {
    let { routeName } = navigation.state.routes[navigation.state.index];
    let navigationOptions = {};
  
    // set tabbar visible
    if (routeName === 'CreateApplicationPage' || 
        routeName === 'ApplicationDetailPage' ||
        routeName === 'ListAllCategory' ) {
      navigationOptions.tabBarVisible = false;
    }
  
    return navigationOptions;
};

export default index