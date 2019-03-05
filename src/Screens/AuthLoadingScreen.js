import React from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';

import firebase from 'react-native-firebase';

import * as actions from '../Actions';
import {makeUidState, 
        makePhonesState, 
        makeWebsitesState,
        makeEmailsState,
        makeMyIdsState,
        makeMyAppicationsState,
        makeClasssState,
        makeGroupsState,
        makeFriendsState,
        makeFriendProfilesState,} from '../Reselect'

class AuthLoadingScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('AuthLoadingScreen', this.props.is_login)
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


    // ry {
//     await firebase.messaging().requestPermission();
//     // User has authorised
// } catch (error) {
//     // User has rejected permissions
// }

    _testCrashlytics = () =>{
        firebase.crashlytics().log('TEST CRASH LOG');
        firebase.crashlytics().crash();
    }

    _bootstrapAsync = () => {
        let {is_login} = this.props

        if(!is_login){
            this.props.navigation.navigate('Auth');
        }else{
            let {uid, 
                phones,
                friends, 
                websites,
                emails,
                myIds,
                my_applications,
                classs,
                groups,
                friend_profiles} = this.props

            this.props.trackProfilesPhones(uid, phones)
            this.props.trackProfileWebsites(uid, websites)
            this.props.trackProfileEmails(uid, emails)
            this.props.trackProfileMyIds(uid, myIds)
            this.props.trackMyApplications(uid, my_applications)
            this.props.trackClasss(uid, classs)
            this.props.trackGroups(uid, groups)
            this.props.trackFriends(uid, friends, friend_profiles)
            
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
            phones: makePhonesState(state, ownProps),
            websites: makeWebsitesState(state, ownProps),
            emails:makeEmailsState(state, ownProps),
            myIds:makeMyIdsState(state, ownProps),
            my_applications:makeMyAppicationsState(state, ownProps),
            classs:makeClasssState(state, ownProps),
            groups:makeGroupsState(state, ownProps),
            friends:makeFriendsState(state, ownProps),
            friend_profiles:makeFriendProfilesState(state, ownProps),
        }
    }
}

// const mapDispatchToProps = (dispatch, ownProps) => {
//     return { dispatch, watchTaskEvent, trackProfilesPhone }
// }

export default connect(mapStateToProps, actions)(AuthLoadingScreen);