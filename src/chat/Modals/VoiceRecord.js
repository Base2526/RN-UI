import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View, TouchableWithoutFeedback, Animated, Alert, Linking, Platform} from 'react-native';
import {Card, CardItem, Body} from 'native-base';
import {Text, Icon, Touchable} from '../../components';
import ModalBase from "./ModalBase";
import {WRITE_EXTERNAL_STORAGE, RECORD_AUDIO} from '../../helpers/Permissions';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {upload_file} from '../../helpers/Api';

var RNFS = require('react-native-fs');

class VoiceRecord extends ModalBase {
    state = {
        ...this.state,
        isRecording: false
    };
    audioRecorderPlayer = new AudioRecorderPlayer();

    componentDidMount() {
        super.componentDidMount();
        let self = this;

        this.audioRecorderPlayer.addRecordBackListener((e) => {
            this.setState({
                isRecording: true,
                recordSecs: e.current_position,
                recordTime: this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
            });
            return;
        });
        this.audioRecorderPlayer.addPlayBackListener((e) => {
            if (e.current_position === e.duration) {
                console.log('finished');
                self.setState({isPlaying: false});
                self.audioRecorderPlayer.stopPlayer().catch(() => {
                });
            } else {
                self.setState({
                    isPlaying: true,
                    currentPositionSec: e.current_position,
                    currentDurationSec: e.duration,
                    playTime: self.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
                    duration: self.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
                });
            }
            return;
        });
        try {
            let params = this.props.navigation.state.params;
            this.onSend = params.onSend;
            this.group = params.group;
        } catch (err) {

        }
    }

    uuidv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    send = async () => {
        try {
            let {recordSecs, recordTime} = this.state;
            let recordURI = this.filePath();
            let uid = this.uuidv4();
            const uriParts = recordURI.split('.');
            const fileType = uriParts[uriParts.length - 1];
            let name = `audio.${fileType}`;
            let type = `audio/${fileType}`;
            let response = await upload_file({
                uid,
                uri: (Platform.OS === 'android' ? 'file://' : '') + recordURI,
                type,
                name
            });
            let json = await response.json();
            let data = json.data || {};
            let original_url = data.original_url || "";
            if (original_url != '' && this.onSend && this.group) {
                this.onSend([{
                    fileType: type,
                    fileName: name,
                    text: name,
                    url: original_url,
                    recordSecs,
                    recordTime
                }], this.group);
            }
        } catch (err) {
            console.log(err);
            Alert.alert("Error", err.message);
        }
    };


    onStopRecord = async () => {
        const result = await this.audioRecorderPlayer.stopRecorder();
        this.setState({isRecording: false, hasRecord: true});
        console.log(result);
    };

    record = async () => {
        try {
            await RECORD_AUDIO();
            await WRITE_EXTERNAL_STORAGE();
            const recordURI = await this.audioRecorderPlayer.startRecorder(this.filePath());
            this.setState({recordURI});
        } catch ({message}) {
            Alert.alert("Error", message);
        }
    };

    filePath = () => {
        let path = Platform.select({
            ios: '/dnachatrecord.m4a',
            android: '/dnachatrecord.mp4', // should give extra dir name in android. Won't grant permission to the first level of dir.
        });

        return `${RNFS.DocumentDirectoryPath}${path}`;
    };

    onStartPlay = async () => {
        console.log('onStartPlay');
        try {
            const msg = await this.audioRecorderPlayer.startPlayer(this.filePath());
        } catch ({message}) {
            Alert("Error", message);
        }
    };

    onStopPlay = async () => {
        try {
            console.log('onStopPlay');
            this.setState({isPlaying: false});
            this.audioRecorderPlayer.stopPlayer().catch(() => {
            });
        } catch ({message}) {
            Alert.alert("Error", message);
        }
    };

    render() {
        let {isRecording, animatedValue, hasRecord, isPlaying, recordTime} = this.state;
        return (
            <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: -10}}>
                <TouchableWithoutFeedback onPress={this.back}>
                    <Animated.View style={{
                        position: 'absolute',
                        top: 0, bottom: 0, right: 0, left: 0,
                        backgroundColor: 'rgba(0,0,0,.5)',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [.5, 1]
                        }),
                    }}>
                    </Animated.View>
                </TouchableWithoutFeedback>

                <Animated.View style={{
                    maxWidth: 600, alignSelf: 'center', width: '100%',
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [190, 0]
                            })
                        }
                    ]
                }}>
                    <Card style={{padding: 20, paddingBottom: 30}}>
                        <CardItem>
                            <Body>
                            <View style={{alignItems: 'center', width: '100%'}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                    {hasRecord ? (
                                        <Touchable
                                            onPress={() => this.setState({hasRecord: false, recordTime: null})}
                                            style={{padding: 10, borderRadius: 100, backgroundColor: '#fff'}}>
                                            <Icon name="trash-can"
                                                  family="MaterialCommunityIcons" size={30}/>
                                        </Touchable>
                                    ) : null}
                                    <Touchable containerStyle={{borderRadius: 100 / 2}}
                                               onPress={() => {
                                                   if (hasRecord && !isPlaying)
                                                       this.onStartPlay();
                                                   else if (hasRecord && isPlaying)
                                                       this.onStopPlay();
                                                   else if (isRecording)
                                                       this.onStopRecord();
                                                   else
                                                       this.record();
                                               }}
                                               style={{
                                                   backgroundColor: '#cc0000',
                                                   width: 100,
                                                   height: 100,
                                                   borderRadius: 100 / 2,
                                                   elevation: 3,
                                                   justifyContent: 'center',
                                                   alignItems: 'center',
                                                   margin: 15
                                               }}>
                                        {hasRecord ? (
                                            <Icon name={isPlaying ? "pause" : "play"}
                                                  family="MaterialCommunityIcons"
                                                  color="#fff" size={40}/>
                                        ) : (
                                            <Icon name={!isRecording ? "microphone" : "stop"}
                                                  family="MaterialCommunityIcons"
                                                  color="#fff" size={40}/>
                                        )}
                                    </Touchable>
                                    {hasRecord ? (
                                        <Touchable
                                            onPress={this.send}
                                            style={{padding: 10, borderRadius: 100, backgroundColor: '#fff'}}>
                                            <Icon name="send"
                                                  family="MaterialCommunityIcons" size={30}/>
                                        </Touchable>
                                    ) : null}
                                </View>
                                <Text>{recordTime || '00:00:00'}</Text>
                            </View>
                            </Body>
                        </CardItem>
                    </Card>
                </Animated.View>
            </View>
        );
    }
}

VoiceRecord.propTypes = {};

export default VoiceRecord;