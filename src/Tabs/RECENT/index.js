import { createStackNavigator } from 'react-navigation';
import Home from './home';
import ChatPage from './ChatPage'

// export default createStackNavigator({
//     Home
// })

const index = createStackNavigator({
    Home,
    'Home': {
        screen: Home,
        navigationOptions: {
          title: 'Recent',
        },
    },
    'ChatPage': {
        screen: ChatPage,
        navigationOptions: {
          title: 'Chat Page',
        },
    },
});

index.navigationOptions = ({ navigation }) => {
    let { routeName } = navigation.state.routes[navigation.state.index];
    let navigationOptions = {};
  
    // set tabbar visible
    if (routeName === 'ChatPage') {
      navigationOptions.tabBarVisible = false;
    }
  
    return navigationOptions;
};

export default index