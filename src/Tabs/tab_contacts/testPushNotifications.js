import React, { Component } from 'react';
import {View, 
        Text,
        Alert} from 'react-native';

import { AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';

class testPushNotifications extends Component {
  
    static navigationOptions = ({ navigation }) => ({
        title: "Test PushNotifications",
        // headerLeft: (
        //     <TouchableOpacity
        //         style={Styles.headerButton}
        //         onPress={() => navigation.openDrawer()}>
        //         <Icon name="bars" size={25} />
        //     </TouchableOpacity>
        // ),        
    })

    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        this.checkPermission();

        this.createNotificationListeners(); //add this line
    }
      
    //1
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }
      
    //3
    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken', null);
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            console.log(fcmToken)
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }

        console.log(fcmToken)
    }
      
    //2
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }

    async createNotificationListeners() {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            this.showAlert(title, body);
        });
        
        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        });
      
        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
          //process data message
          console.log(JSON.stringify(message));
        });
    }
      
    showAlert(title, body) {

        console.log('showAlert')
        Alert.alert(
            title, body,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }
      
    render() {
        return (
          <View style={{flex:1, backgroundColor: 'white'}}>
            <Text>testPushNotifications</Text>
          </View>
        );
    }
}

export default testPushNotifications;