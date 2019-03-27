import React, { Component } from 'react';
import { ThemeContext } from './ThemeContext';
import { TouchableNativeFeedback, TouchableOpacity, Platform, View } from 'react-native';

class Button extends Component {
    static contextType = ThemeContext;
    setChildTextStyle = () => {
        let theme = this.context || {}
        let Button = theme.Button || {};
        const { children } = this.props;
        let typeStyle = this.getTypeStyle();
        const childrenWithProps = React.Children.map(children, child => {
            let style = child.props.style || {};
            if (child.type.displayName === 'Text')
                style = { ...(Button.text || {}), ...(typeStyle.label || {}), ...style }
            return React.cloneElement(child, { style })
        }
        );
        return childrenWithProps;
    }
    getTypeStyle = () => {
        let theme = this.context || {}
        let Button = theme.Button || {};

        let type = this.props.type || 'primary';
        let typeStyle = { button: Button.primary, label: Button.textPrimary };
        switch (type) {
            case 'link':
                typeStyle = { button: Button.link, label: Button.textLink };
                break;
        }
        return typeStyle;
    }
    render() {
        let theme = this.context || {}
        let Button = theme.Button || {};
        let { disabled } = this.props;
        let children = this.setChildTextStyle();
        let alignSelf;
        if (!this.props.block)
            alignSelf = 'flex-start'
        let typeStyle = this.getTypeStyle();
        let isAndroid = Platform.OS == 'android';
        let style = {
            alignSelf,
            ...(Button.button || {}),
            ...typeStyle.button,
            ...(this.props.style || {}),
        };
        let touchableProps = {};
        if (disabled === true) {
            style.opacity = .5;
            touchableProps.disabled = disabled;
        }
        let TouchComponent = TouchableOpacity;
        if (isAndroid) {
            TouchComponent = TouchableNativeFeedback;
        } else {
            touchableProps = {
                ...touchableProps,
                style,
                activeOpacity: .6
            }
        }
        return (
            <TouchComponent onPress={() => {
                if (this.props.onPress && !disabled) {
                    this.props.onPress()
                }
            }} {...touchableProps}>
                {isAndroid ? (
                    <View style={style}>
                        {children}
                    </View>
                ) : (children)}
            </TouchComponent>
        );
    }
}

export default Button;