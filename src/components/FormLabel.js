import React, { Component } from 'react';
import { ThemeContext } from './ThemeContext';
import { Text } from './';

class FormLabel extends Component {
    static contextType = ThemeContext;
    render() {
        let theme = this.context || {}
        let FormLabel = theme.FormLabel || {};
        return (
            <Text style={{
                ...(FormLabel.formLabel || {}),
                ...(this.props.style || {})
            }}>
                {this.props.children}
            </Text>
        );
    }
}

export default FormLabel;