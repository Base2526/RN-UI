import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';
import {View} from 'react-native';
import {Text} from '../components';
import Profile from './Profile';
import {Body, Button, Container, Header, Icon, Left, Right, Title} from "native-base";

const usersStorage = require('../helpers/usersStorage');

class UserProfile extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);

        let params = this.props.navigation.state.params || {};
        let user = params.user;
        let userRef = firebase.firestore().collection('Users').doc(user.id);
        this.fetchData(userRef);
        this.state = {
            user: userRef
        }
    }

    fetchData = async userRef => {
        let userData = await usersStorage(userRef);
        this.setState({userData});
    };

    render() {
        let {userData} = this.state;
        if (this.state.user)
            return (
                <React.Fragment>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='arrow-back'/>
                            </Button>
                        </Left>
                        <Body>
                        <Title>
                            {userData ? userData.data().displayName : 'Profile'}
                        </Title>
                        </Body>
                        <Right/>
                    </Header>
                    <Profile user={this.state.user} navigation={this.props.navigation}/>
                </React.Fragment>
            );
        else
            return <Text>Something went wrong.</Text>
    }
}

UserProfile.propTypes = {};

export default UserProfile;