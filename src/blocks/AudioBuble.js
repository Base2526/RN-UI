import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Alert, View} from 'react-native';
import {Text, Touchable, Icon} from '../components';
import {Bubble} from 'react-native-gifted-chat';
import AudioRecorderPlayer from "react-native-audio-recorder-player";

class AudioBuble extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {playTime: '00:00:00'};
        this.audioRecorderPlayer = new AudioRecorderPlayer();
    }

    componentDidMount() {
        let self = this;
        this.audioRecorderPlayer.addPlayBackListener((e) => {
            if (self.state.isPlaying) {
                if (e.current_position === e.duration) {
                    console.log('finished');
                    self.setState({isPlaying: false});
                    self.audioRecorderPlayer.stopPlayer().catch(() => {
                    });
                } else {
                    self.setState({
                        currentPositionSec: e.current_position,
                        currentDurationSec: e.duration,
                        playTime: self.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
                        duration: self.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
                    });
                }
            }
            return;
        });
    }


    previewTime = time => {
        let timeArr = time.split(':');
        timeArr.splice(timeArr.length - 1, 1);
        return timeArr.join(':');
    };

    filePath = () => {
        let data = this.props.data || {};
        let {url} = data.currentMessage || {};
        return url;
    };

    onStartPlay = async () => {
        console.log('onStartPlay');
        await this.onStopPlay();
        let url = this.filePath();
        try {
            if (url) {
                this.setState({isPlaying: true}, async () => {
                    await this.audioRecorderPlayer.startPlayer(url);
                });
            } else
                throw new Error("Can't play voice record.");
        } catch ({message}) {
            // Alert("Error", "Something went wrong.");
        }
    };

    onStopPlay = async () => {
        try {
            console.log('onStopPlay');
            this.setState({isPlaying: false});
            await this.audioRecorderPlayer.stopPlayer();
        } catch ({message}) {
            // Alert.alert("Error", message);
        }
    };

    render() {
        let {playTime, isPlaying} = this.state;
        let data = this.props.data || {};
        let copyData = Object.assign({}, data);
        delete copyData.currentMessage.text;
        let {position} = data;
        let {recordTime} = data.currentMessage;
        let color = position == 'left' ? '#333' : '#fff';
        return (
            <Bubble {...copyData} key={copyData.currentMessage._id} renderCustomView={() => {
                return (
                    <Touchable style={{padding: 10, flexDirection: 'row'}} onPress={() => {
                        if (isPlaying)
                            this.onStopPlay();
                        else
                            this.onStartPlay();
                    }}>
                        <Icon name={(isPlaying ? "pause" : "play") + "-circle-outline"}
                              family="MaterialCommunityIcons"
                              style={{marginRight: 5}}
                              color={color}/>
                        <Text style={{color}}>
                            {this.previewTime(playTime)}
                            {" - "}
                            {this.previewTime(recordTime || '00:00:00')}
                        </Text>
                    </Touchable>
                )
            }}/>
        );
    }
}

AudioBuble.propTypes = {};

export default AudioBuble;