import React from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';


import firebase from 'react-native-firebase';

// import {watchTaskEvent, trackProfilesPhone} from '../Actions'
// import console = require('console');
import * as actions from '../Actions';
import {makeUidState, 
        makePhonesState, 
        makeWebsitesState,
        makeEmailsState,
        makeMyIdsState,
        makeMyAppicationsState,
        makeClasssState,
        makeGroupsState,} from '../Reselect'

class AuthLoadingScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    
    constructor(props) {
        super(props);
    }

    componentDidMount() {
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

        if(this.props.auth === undefined){
            this.props.navigation.navigate('Auth');
        }else if(this.props.auth.isLogin){
            console.log(this.props.phones)

            this.props.trackProfilesPhones(this.props.uid, this.props.phones)
            this.props.trackProfileWebsites(this.props.uid, this.props.websites)
            this.props.trackProfileEmails(this.props.uid, this.props.emails)
            this.props.trackProfileMyIds(this.props.uid, this.props.myIds)

            this.props.trackMyApplications(this.props.uid, this.props.my_applications)

            this.props.trackClasss(this.props.uid, this.props.classs)

            this.props.trackGroups(this.props.uid, this.props.groups)
            
            AsyncStorage.getItem('fcmToken', null).then((fcmToken) => {
                // console.log('fcmToken: ',fcmToken);

                this.props.watchTaskEvent(this.props.uid, fcmToken)
                this.props.navigation.navigate('App');
            });
            
        }else{
            this.props.navigation.navigate('Auth');
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

    if(state.auth.users !== null){
        return {
            auth:state.auth,
            // uid:state.auth.users.user.uid
            uid: makeUidState(state, ownProps),
            phones: makePhonesState(state, ownProps),
            websites: makeWebsitesState(state, ownProps),
            emails:makeEmailsState(state, ownProps),
            myIds:makeMyIdsState(state, ownProps),
            my_applications:makeMyAppicationsState(state, ownProps),

            classs:makeClasssState(state, ownProps),
            groups:makeGroupsState(state, ownProps),
        }
    }else{
        return {
            auth:state.auth
        }
    }
}

// const mapDispatchToProps = (dispatch, ownProps) => {
//     return { dispatch, watchTaskEvent, trackProfilesPhone }
// }

export default connect(mapStateToProps, actions)(AuthLoadingScreen);