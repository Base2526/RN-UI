import React from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';

import firebase from 'react-native-firebase';
import SplashScreen from 'react-native-splash-screen'

import * as actions from '../actions';
import {makeUidState, 
        makeProfileState,
        makeFriendsState,
        makeMyIdsState, 
        makePhonesState, 
        makeWebsitesState, 
        makeEmailsState} from '../reselect'

class AuthLoadingScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        SplashScreen.hide();

        // console.log('AuthLoadingScreen', this.props.is_login)
        this._bootstrapAsync();

        // this._testCrashlytics();

        this.hasPermission()

        // AsyncStorage.getItem('fcmToken', null).then((fcmToken) => {
        //     console.log('fcmToken: ',values);
        // });

        // console.log('fcmToken')
        // console.log('fcmToken', fcmToken)

    }

    hasPermission = () =>{
        firebase.messaging().hasPermission().then(enabled => {
            if (enabled) {
                // user has permissions
                this.getToken()
            } else {
                // user doesn't have permission
                this.requestPermission();
            } 
        });
    }

    requestPermission() {
        firebase.messaging().requestPermission().then(() => {
            // User has authorised  
            this.getToken()
        })
        .catch(error => {
            // User has rejected permissions  
        });
    }

    //3
    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken', null);
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            // console.log(fcmToken)
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
        // console.log(fcmToken)
    }

    _testCrashlytics = () =>{
        firebase.crashlytics().log('TEST CRASH LOG');
        firebase.crashlytics().crash();
    }

    _bootstrapAsync = () => {
        let {is_login} = this.props

        if(!is_login){
            this.props.navigation.navigate('Auth');
        }else{
            let {uid, profile,friends, phones, websites, emails, myIds} = this.props

            // let {uid, } = this.props

            this.props.trackProfiles(uid, profile)
            this.props.trackFriends(uid, friends)
            this.props.trackLocation(uid)


            this.props.trackProfilesPhones(uid, phones, (data)=>{
                // unsubscribes.push(data.unsubscribe)
            })
            this.props.trackProfileWebsites(uid, websites, (data)=>{
                // unsubscribes.push(data.unsubscribe)
            })
            this.props.trackProfileEmails(uid, emails, (data)=>{
                // unsubscribes.push(data.unsubscribe)
            })
            this.props.trackProfileMyIds(uid, myIds, (data)=>{
                // unsubscribes.push(data.unsubscribe)
            })

            AsyncStorage.getItem('fcmToken', null).then((fcmToken) => {
                this.props.watchTaskEvent(uid, fcmToken)
                this.props.navigation.navigate('App');
            });
        }
    }

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
                {/* <ActivityIndicator /> */}

                <StatusBar barStyle="default" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const mapStateToProps = (state, ownProps) => {
    // console.log(state)
    if(!state._persist.rehydrated){
        return {}
    }

    if(!state.auth.isLogin){
        return {
            is_login:false,
        }
    }else{
        return {
            is_login:true,
            uid: makeUidState(state, ownProps),
            profile: makeProfileState(state, ownProps),
            friends:makeFriendsState(state, ownProps),

            myIds: makeMyIdsState(state, ownProps),
            phones: makePhonesState(state, ownProps),
            websites: makeWebsitesState(state, ownProps),
            emails: makeEmailsState(state, ownProps),
        }
    }
}


export default connect(mapStateToProps, actions)(AuthLoadingScreen);