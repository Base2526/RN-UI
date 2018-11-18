/** @format */

import { AppRegistry } from 'react-native';
import App from './src/index';
// import App from './src/test/index'
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
