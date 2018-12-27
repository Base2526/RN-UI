import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../Actions';

// import {actionUserLogin, watchTaskAddEvent, watchTaskChangedEvent, watchTaskRemovedEvent} from '../Actions'

class AuthLoadingScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = () => {

        /*
        this.props.watchTaskAddEvent()
        this.props.watchTaskChangedEvent()
        this.props.watchTaskRemovedEvent()

        this.props.actionCheckUserLogin().then((data) => {
            console.log(data)
            if(data.status){
                this.props.navigation.navigate('App');
            }else{
                this.props.navigation.navigate('Auth');
            }
        })
        .catch(error => {
            console.log(error)
        })
        */

        if(this.props.auth.isLogin){
            this.props.navigation.navigate('App');
        }else{
            this.props.navigation.navigate('Auth');
        }
    };

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
    console.log(state)

    if(!state._persist.rehydrated){
        return {}
    }

    return {
        auth:state.auth
    }
}

// const mapDispatchToProps = dispatch => ({
//     // getUserToken: () => dispatch(getUserToken()),
// });

// const mapDispatchToProps = (dispatch) => {
//     // watchTaskAddEvent(dispatch)
//     // watchTaskChangedEvent(dispatch)
//     // watchTaskRemovedEvent(dispatch)

//     return {actionCheckUserLogin}
// }
//   export default connect(mapStateToProps, mapDispatchToProps)(FriendsPage);

export default connect(mapStateToProps, actions)(AuthLoadingScreen);