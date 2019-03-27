//Created By: Randolf Joshua Diezmo - joshuadiezmo@gmail.com

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {uuid} from '../actions';
import firebase from 'react-native-firebase';
import { AsyncStorage, Alert } from 'react-native';

class Base extends Component {
    constructor(props) {
        super(props);
        this.setUUID();
    }
    setUUID = async () => {
        try {
            let uuid = await AsyncStorage.getItem('ExpensesUUID');
            if (uuid == null) {
                uuid = String.generateID(36);
                await AsyncStorage.setItem('ExpensesUUID', uuid);
            }
            this.props.actions.uuid(uuid);
        } catch (err) {
            Alert.alert("Error", err.message);
        }
    }
    render() {
        return (this.props.children);
    }
}

const mapStateToProps = (state) => {
    //const {} = state;
    const props = {};
    return props;
};

const mapDispatchToProps = (dispatch) => {
    const actions = {uuid};
    const actionMap = {
        actions: bindActionCreators(actions, dispatch)
    };
    return actionMap;
};

export default connect(mapStateToProps, mapDispatchToProps)(Base);