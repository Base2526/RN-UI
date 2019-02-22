import React from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    Text
} from 'react-native';
import { connect } from 'react-redux';
// import * as actions from '../Actions';



import {watchTaskEvent} from '../Actions'

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
    }

    _testCrashlytics = () =>{
        firebase.crashlytics().log('TEST CRASH LOG');
        firebase.crashlytics().crash();
    }

    _bootstrapAsync = () => {

        if(this.props.auth === undefined){
            this.props.navigation.navigate('Auth');
        }else if(this.props.auth.isLogin){
            // console.log(this.props.uid)
            this.props.watchTaskEvent(this.props.uid, this.props.dispatch)
            this.props.navigation.navigate('App');
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

const mapStateToProps = (state) => {
    // console.log(state)
    if(!state._persist.rehydrated){
        return {}
    }

    if(state.auth.users !== null){
        return {
            auth:state.auth,
            uid:state.auth.users.user.uid
        }
    }else{
        return {
            auth:state.auth
        }
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return { dispatch, watchTaskEvent }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen);