import React, { Component } from 'react';
import { ThemeContext } from './ThemeContext';
import { Text as TextLib } from 'react-native';

class Text extends Component {
    static contextType = ThemeContext;
    render() {
        let { sizePercentage } = this.props;
        let theme = this.context || {}
        let Text = theme.Text || {};
        let style = {
            ...(Text.text || {}),
            ...(this.props.style || {})
        };
        let fontSize = style.fontSize || 12;
        if (typeof sizePercentage == 'number') {
            fontSize = (fontSize * sizePercentage) / 100;
        }
        return (
            <TextLib {...this.props} style={{
                ...style,
                fontSize
            }} />
        );
    }
}

export default Text;