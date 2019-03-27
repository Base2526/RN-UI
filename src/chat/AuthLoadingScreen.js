import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {ActivityIndicator} from '../components';
import firebase from 'react-native-firebase';

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        this.props.navigation.navigate(firebase.auth().currentUser ? 'App' : 'Auth');
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default AuthLoadingScreen;