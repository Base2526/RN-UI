import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Animated, Easing} from 'react-native';
import {BackHandler} from "react-native";

class ModalBase extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    state = {
        animatedValue: new Animated.Value(0)
    };

    constructor(props) {
        super(props);
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }

    componentDidMount() {
        this.handleAnimation();
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }

    onBackButtonPressAndroid = () => {
        this.back();
        return true;
    };

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }


    handleAnimation = () => {
        Animated.timing(this.state.animatedValue, {
            toValue: 1,
            duration: 200,
            easing: Easing.ease
        }).start()
    };

    back = () => {
        Animated.timing(this.state.animatedValue, {
            toValue: 0,
            duration: 200,
            easing: Easing.ease
        }).start(() => {
            this.props.navigation.goBack();
        });
    };
}

ModalBase.propTypes = {};

export default ModalBase;