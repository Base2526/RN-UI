import React, { Component } from 'react';
import { TextInput as TextInputReact, View } from 'react-native';
import { ThemeContext } from './ThemeContext';

class TextInput extends Component {
    static contextType = ThemeContext;
    render() {
        let theme = this.context || {}
        let TextInput = theme.TextInput || {};
        return (
            <View style={{
                ...(TextInput.container || {}),
                ...(this.props.containerStyle || {})
            }}>
                {this.props.leftIcon}
                <TextInputReact {...this.props} style={{
                    ...(TextInput.textInput || {}),
                    ...(this.props.style || {})
                }} selectionColor={TextInput.tintColor} tintColor={TextInput.tintColor} />
                {this.props.rightIcon}
            </View>
        );
    }
}

export default TextInput;