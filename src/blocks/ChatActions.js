//Created By: Randolf Joshua Diezmo - joshuadiezmo@gmail.com

import React, {Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {messages} from '../actions';
import {View, StyleSheet, Platform} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import {Touchable, Icon} from '../components';
import FourDots from './FourDots';
import ImagePicker from 'react-native-image-picker';
import {name as appName} from '../../app.json';

const Permissions = require('../helpers/Permissions');

class ChatActions extends Component {
    cameraResponse = response => {
        let {group} = this.props;
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            this.props.actions.messages.addFile(group, response, 'image');
        }
    };
    videoResponse = response => {
        let {group} = this.props;
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            this.props.actions.messages.addFile(group, response, 'video');
        }
    };

    selectType = (callFunc) => {

        const imageOptions = {
            storageOptions: {
                path: appName,
            },
            mediaType: 'image',
            noData: true,
            maxWidth: __DEV__ ? 100 : 1500
        };

        const videoOptions = {
            storageOptions: {
                path: appName,
            },
            mediaType: 'video',
            noData: true,
            maxWidth: __DEV__ ? 100 : 1500
        };

        this.props.navigation.navigate('Option', {
            title: 'Type',
            buttons: [
                {
                    text: 'Image',
                    extra: () => <Icon name={`${Platform === 'ios' ? 'ios' : 'md'}-images`} family="Ionicons"/>,
                    onPress: () => callFunc(imageOptions, this.cameraResponse)
                },
                {
                    text: 'Video',
                    extra: () => <Icon name={`${Platform === 'ios' ? 'ios' : 'md'}-videocam`} family="Ionicons"/>,
                    onPress: () => callFunc(videoOptions, this.videoResponse)
                }
            ]
        });
    };

    render() {
        let isAndroid = Platform.OS === 'android';
        let {mediaActive} = this.props;
        let iconPrefix = isAndroid ? 'md' : 'ios';
        let textFocused = this.props.textFocused;

        return (
            <View style={styles.container}>
                {
                    !textFocused ? (
                        <React.Fragment>
                            <Touchable onPress={() => {
                                if (typeof this.props.onClickMedia === 'function')
                                    this.props.onClickMedia();
                            }}>
                                {mediaActive ? (
                                    <Icon name={`ios-arrow-down`} family="Ionicons" size={28}
                                          style={{marginHorizontal: 9}}/>
                                ) : (
                                    <FourDots/>
                                )}
                            </Touchable>
                            <Touchable disabled={mediaActive}
                                       onPress={() => this.selectType(ImagePicker.launchCamera)}>
                                <Icon name="ios-camera" color={mediaActive ? '#ccc' : null} family={"Ionicons"}
                                      size={30} style={{marginHorizontal: 7.5, marginBottom: 3}}/>
                            </Touchable>
                            <Touchable disabled={mediaActive}
                                       onPress={() => this.selectType(ImagePicker.launchImageLibrary)}>
                                <Icon name="picture" color={mediaActive ? '#ccc' : null} family="AntDesign" size={23}
                                      style={{marginHorizontal: 5, marginBottom: 5}}/>
                            </Touchable>
                        </React.Fragment>
                    ) : (
                        <Touchable onPress={() => {
                            if (this.props.onShowActionsPress)
                                this.props.onShowActionsPress()
                        }} style={{paddingLeft: 15, paddingRight: 5, paddingBottom: 5}}>
                            <Icon name={`ios-arrow-forward`} family="Ionicons" size={28}/>
                        </Touchable>
                    )
                }
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    //const {} = state;
    const props = {};
    return props;
};

const mapDispatchToProps = (dispatch) => {
    const actions = {};
    const actionMap = {
        actions: {
            ...bindActionCreators(actions, dispatch),
            messages: bindActionCreators(messages, dispatch)
        }
    };
    return actionMap;
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        alignSelf: 'stretch',
        flexDirection: 'row'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatActions);