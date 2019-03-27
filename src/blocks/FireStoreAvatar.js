import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Avatar} from '../components';

const usersStorage = require('../helpers/usersStorage');

class FireStoreAvatar extends PureComponent {
    state = {};

    componentDidMount() {
        this.fetchUser();
    }

    fetchUser = async () => {
        let user = this.props.user;
        user = await usersStorage(user);
        this.setState({userDoc: user});
    };

    render() {
        let {userDoc} = this.state;
        return (
            <Avatar
                {...this.props} source={userDoc ? {uri: userDoc.data().photoURL} : null}/>
        );
    }
}

FireStoreAvatar.propTypes = {};

export default FireStoreAvatar;