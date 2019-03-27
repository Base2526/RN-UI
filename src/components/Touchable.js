import React, {Component} from 'react';
import {ThemeContext} from './ThemeContext';
import {TouchableNativeFeedback, View, TouchableOpacity, Platform} from 'react-native';

class Touchable extends Component {
    static contextType = ThemeContext;

    render() {
        let theme = this.context || {}
        let Touchable = theme.Touchable || {};
        let isAndroid = Platform.OS == 'android';
        let TouchableComponent = TouchableOpacity;
        if (isAndroid) {
            TouchableComponent = TouchableNativeFeedback;
        }
        return (
            <TouchableComponent onPress={() => {
                if (typeof this.props.onPress === 'function') {
                    if (Platform.OS === 'android') {
                        setTimeout(() => this.props.onPress(), 0);
                    } else {
                        this.props.onPress();
                    }
                }
            }} activeOpacity={.6} {...(!isAndroid ? this.props : {})}>
                {
                    isAndroid ? (
                        <View {...this.props} />
                    ) : this.props.children
                }
            </TouchableComponent>
        );
    }
}

export default Touchable;