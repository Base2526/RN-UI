/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

import { MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER } from './Constant';
import Color from './Color';

export default class Composer extends React.Component {

  onContentSizeChange(e) {
    const { contentSize } = e.nativeEvent;

    // Support earlier versions of React Native on Android.
    if (!contentSize) return;

    if (
      !this.contentSize ||
      this.contentSize.width !== contentSize.width ||
      this.contentSize.height !== contentSize.height
    ) {
      this.contentSize = contentSize;
      this.props.onInputSizeChanged(this.contentSize);
    }
  }

  onChangeText(text) {
    this.props.onTextChanged(text);
  }

  render() {
    return (
        <TextInput
          testID={this.props.placeholder}
          accessible
          accessibilityLabel={this.props.placeholder}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          multiline={this.props.multiline}
          onChange={(e) => this.onContentSizeChange(e)}
          onContentSizeChange={(e) => this.onContentSizeChange(e)}
          onChangeText={(text) => this.onChangeText(text)}
          style={[styles.textInput, this.props.textInputStyle, { height: this.props.composerHeight}]}
          autoFocus={this.props.textInputAutoFocus}
          value={this.props.text}
          enablesReturnKeyAutomatically
          underlineColorAndroid="transparent"
          keyboardAppearance={this.props.keyboardAppearance}
          {...this.props.textInputProps}
        />
    );
  }

}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'stretch',
  
    // textAlign: 'center',
    // flex: 2,
    // marginLeft: 40,
    fontSize: 16,
    lineHeight: 16,
    marginTop: Platform.select({
      // ios: 6,
      android: 5,
    }),
    marginBottom: Platform.select({
      // ios: 5,
      android: 5,
    }),
    marginLeft: Platform.select({
      ios: 5,
      android: 5,
    }),
    marginRight: Platform.select({
      ios: 5,
      android: 5,
    }),
    borderColor: 'gray', 
    borderWidth: 1,
    borderRadius: 20,
    padding:10
  },
});

Composer.defaultProps = {
  composerHeight: MIN_COMPOSER_HEIGHT,
  text: '',
  placeholderTextColor: Color.defaultProps,
  placeholder: DEFAULT_PLACEHOLDER,
  textInputProps: null,
  multiline: true,
  textInputStyle: {},
  textInputAutoFocus: false,
  keyboardAppearance: 'default',
  onTextChanged: () => {},
  onInputSizeChanged: () => {},
};

Composer.propTypes = {
  composerHeight: PropTypes.number,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  textInputProps: PropTypes.object,
  onTextChanged: PropTypes.func,
  onInputSizeChanged: PropTypes.func,
  multiline: PropTypes.bool,
  textInputStyle: TextInput.propTypes.style,
  textInputAutoFocus: PropTypes.bool,
  keyboardAppearance: PropTypes.string,
};
