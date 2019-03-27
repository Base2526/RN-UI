import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View} from "react-native";
import {Send as GiftedSend} from 'react-native-gifted-chat';
import {Icon, Text, theme, Touchable} from "../components";

class Send extends PureComponent {
    render() {
        let {messageValue, showChatMediaItems, sendProps, onSend, group} = this.props;
        return (
            <View style={{height: '100%', justifyContent: 'flex-end'}}>
                <GiftedSend {...sendProps}>
                    <Text style={{
                        color: theme.color.primary,
                        paddingHorizontal: 10,
                        marginBottom: 10
                    }}>Send</Text>
                </GiftedSend>
                {messageValue == '' ? (
                    <Touchable
                        onPress={() => {
                            this.props.navigation.navigate('VoiceRecord', {onSend, group});
                        }}
                        style={{paddingLeft: 17, paddingRight: 21, marginBottom: 4, paddingTop: 5}}
                        disabled={showChatMediaItems}>
                        <Icon name="ios-mic" color={showChatMediaItems ? '#ccc' : null}
                              family={"Ionicons"} size={30}/>
                    </Touchable>
                ) : null}
            </View>
        );
    }
}

Send.propTypes = {};

export default Send;