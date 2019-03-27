import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Touchable from "../components/Touchable";
import firebase from 'react-native-firebase';

const usersStorage = require('../helpers/usersStorage');

class TouchableToUser extends PureComponent {
    state = {};

    async componentDidMount() {
        if (this.props.userId) {
            let userRef = firebase.firestore().collection('Users').doc(this.props.userId);
            let user = await usersStorage(userRef);
            this.setState({user});
        }
    }

    render() {
        return (
            <Touchable {...this.props} onPress={() => {
                if (this.state.user && typeof this.props.onPress == 'function')
                    this.props.onPress(this.state.user);
            }}/>
        );
    }
}

TouchableToUser.propTypes = {};

export default TouchableToUser;