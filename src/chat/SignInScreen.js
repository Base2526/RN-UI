//Created By: Randolf Joshua Diezmo - joshuadiezmo@gmail.com

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import {} from 'actions';
import { Alert, Platform } from 'react-native';
import firebase from 'react-native-firebase';
import { TextInput, Container, FormLabel, Button, Text, Icon, Touchable, theme } from '../components';

class SignInScreen extends Component {
    static navigationOptions = {
        header: null,
    };
    state = {
        viewPassword: false,
        email: '',
        password: '',
        loading: false
    }

    signup = async () => {
        this.props.navigation.navigate('Signup');
    };

    signin = async () => {
        let { email, password } = this.state;
        try {
            this.setState({ loading: true });
            if (email === '' || password === '') {
                throw new Error('Email and password are required.');
            }
            let user = await firebase.auth().signInWithEmailAndPassword(email, password);
            user = user.user._user;
            firebase.firestore().collection('Users').doc(user.uid).set(user);
            this.props.navigation.navigate('App');
        } catch (err) {
            Alert.alert("Error", err.message);
            this.setState({ loading: false });
        }
    }

    render() {
        let isAndroid = Platform === 'android';
        let { viewPassword, loading } = this.state;
        return (
            <Container style={{ flex: 1, justifyContent: 'center', marginTop: -50 }}>
                <FormLabel>Email</FormLabel>
                <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={email => this.setState({ email })} />
                <FormLabel style={{ marginTop: 5 }}>Password</FormLabel>
                <TextInput
                    secureTextEntry={!viewPassword}
                    onChangeText={password => this.setState({ password })}
                    onSubmitEditing={this.signin}
                    rightIcon={(
                        <Touchable style={{ padding: 10 }} onPress={() => this.setState({ viewPassword: !viewPassword })}>
                            <Icon family="Ionicons" color={theme.baseFontColor} name={(isAndroid ? "md" : "ios") + "-eye" + (viewPassword ? "-off" : "")} size={25} />
                        </Touchable>
                    )} />
                <Button style={{ marginTop: 10 }} block onPress={this.signin} disabled={loading}>
                    <Text>Signin</Text>
                </Button>
                {/* <View style={{ flexDirection: 'row' }}>
                    <Button style={{ marginTop: 10, backgroundColor: '#4267b2', flex: 1, marginRight: 5 }} block>
                        <Icon name="facebook-square" color="#fff" style={{ marginRight: 5 }} />
                        <Text>Facebook</Text>
                    </Button>
                    <Button style={{ marginTop: 10, backgroundColor: '#d62d20', flex: 1, marginLeft: 5 }} block>
                        <Icon name="google" color="#fff" style={{ marginRight: 5 }} />
                        <Text>Google</Text>
                    </Button>
                </View> */}
                <Button style={{ marginTop: 10 }} type="link" block onPress={this.signup}>
                    <Text>Signup</Text>
                </Button>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    //const {} = state;
    const props = {};
    return props;
};

const mapDispatchToProps = (dispatch) => {
    const actions = {};
    const actionMap = {
        actions: bindActionCreators(actions, dispatch)
    };
    return actionMap;
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);