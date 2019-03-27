import React, { Component } from 'react';
import Emoticons from 'react-native-emoticons';
import { Text } from '../components';

class EmojisList extends Component {
    render() {
        return (
            <Emoticons
                onEmoticonPress={e => console.log(e)}
                show={true}
                concise={true}
                showHistoryBar={true}
                showPlusBar={false}
            />
        );
    }
}

export default EmojisList;