import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View, TextInput} from 'react-native';
import {Icon, Touchable, Text} from "../components";

class ChatComposer extends PureComponent {
    state = {
        textValue: ''
    };

    render() {
        let {composerProps, showChatMediaItems} = this.props;
        let {textValue} = this.state;
        let line = textValue.split("\n").length;
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#eee',
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: line > 1 ? 'flex-end' : 'center',
                paddingBottom: line > 1 ? 7 : 0,
                paddingRight: 5,
                marginBottom: 5
            }}>
                <TextInput placeholder={composerProps.placeholder}
                           style={{flex: 1, backgroundColor: 'transparent', padding: 5, paddingLeft: 10}} multiline
                           value={composerProps.text}
                           onChangeText={textValue => {
                               this.setState({textValue});
                               composerProps.onTextChanged(textValue);
                           }} {...composerProps.textInputProps}/>
                <Touchable onPress={this.props.mediaActionClick}>
                    <Icon name={showChatMediaItems ? "smile-circle" : "smileo"} family="AntDesign" size={25}/>
                </Touchable>
            </View>
        );
    }
}

ChatComposer.propTypes = {};

export default ChatComposer;