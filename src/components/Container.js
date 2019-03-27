import React, { Component } from 'react';
import { View } from 'react-native';
import { ThemeContext } from './ThemeContext';

class Container extends Component {
    static contextType = ThemeContext;
    render() {
        let { noPadding } = this.props;
        let theme = this.context || {}
        let Container = theme.Container || {};
        let style = {
            ...(Container.container || {}),
            ...(this.props.style || {}),
            flex: 1
        };
        if (noPadding === true) {
            delete style.padding;
        }
        return (
            <View {...this.props} style={style} />
        );
    }
}

export default Container;