//Created By: Randolf Joshua Diezmo - joshuadiezmo@gmail.com

import React, {Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
//import {} from 'actions';
import {View, Alert} from 'react-native';
import {Text, Touchable, Avatar} from '../components';
import moment from 'moment';
import firebase from 'react-native-firebase';
import {getImage, getName} from '../helpers/group';
import AudioBuble from "./Bubble";

const usersStorage = require('../helpers/usersStorage');

class MessagePreview extends Component {
    state = {};

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        try {
            let currentUser = firebase.auth().currentUser;
            let {group} = this.props;

            let groupName = await getName(group);
            let groupImage = await getImage(group);
            this.setState({groupImage, group, groupName});
        } catch (err) {
            Alert.alert("Error", err.message);
        }
    };

    generatePreviewText = message => {
        let text;
        if (message.type === 'sticker') {
            text = 'Sticker';
        } else if (message.image) {
            text = 'Image';
        } else if (message.video) {
            text = 'Video';
        } else if (message.location) {
            text = 'Location';
        } else if (/audio\//.test(message.fileType)) {
            return 'Voice Record'
        } else {
            text = message.text;
        }
        return text;
    };

    render() {
        let {groupImage, groupName} = this.state;
        let {groups, group, index} = this.props;
        let message = {};
        if (groups.lastMessages[group.id]) {
            message = groups.lastMessages[group.id].data();
        }

        return (
            <Touchable style={{flexDirection: 'row'}} onPress={() => {
                if (typeof this.props.onItemPress === 'function')
                    this.props.onItemPress();
            }}>
                <View style={{padding: 7.5}}>
                    <View style={{width: 60, height: 60, elevation: 3}}>
                        <Avatar
                            source={groupImage ? {uri: groupImage} : null}
                            style={{width: 60, height: 60, borderRadius: 30, backgroundColor: '#eee'}}/>
                        <View style={{
                            position: 'absolute',
                            bottom: 1,
                            right: 5,
                            width: 12,
                            height: 12,
                            backgroundColor: '#42b72a',
                            borderRadius: 6,
                            borderColor: '#fff',
                            borderWidth: 2
                        }}/>
                    </View>
                </View>
                <View style={{paddingRight: 10, flex: 1, justifyContent: 'center'}}>
                    <Text sizePercentage={120} style={{fontWeight: '600'}}>
                        {groupName}
                    </Text>
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                        }}>
                            <Text numberOfLines={1} sizePercentage={80} style={{flex: 1}}>
                                {this.generatePreviewText(message)}
                            </Text>
                            <View style={{backgroundColor: '#aaa', borderRadius: 1, width: 2, height: 2, margin: 5}}/>
                            <Text sizePercentage={80} style={{color: '#aaa'}}>
                                {moment(message.createdAt || new Date()).format('hh:mm A')}
                            </Text>
                        </View>
                    </View>
                </View>
            </Touchable>
        );
    }
}

const mapStateToProps = (state) => {
    const {groups} = state;
    const props = {groups};
    return props;
};

const mapDispatchToProps = (dispatch) => {
    const actions = {};
    const actionMap = {
        actions: bindActionCreators(actions, dispatch)
    };
    return actionMap;
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagePreview);