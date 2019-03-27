import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Container, Icon, Touchable} from '../components';
import {View, Alert, Image} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {captureRef} from "react-native-view-shot";

const Sound = require('react-native-sound');
Sound.setCategory('Playback');

class Camera extends PureComponent {
    state = {
        flashMode: RNCamera.Constants.FlashMode.off,
        cameraType: RNCamera.Constants.Type.back,
        imageURI: null
    };

    close = () => this.props.navigation.goBack();

    playShutterSound = () => {
        const camera_shutter = new Sound(require('../../assets/mp3/camera_shutter.mp3'), (error) => {
            if (error) {
                console.log('failed to load the sound ' + error.message);
                return;
            }
            camera_shutter.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
    };

    takePicture = async () => {
        this.setState({loading: true});
        try {
            this.playShutterSound();
            const uri = await captureRef(this.camContainer, {
                format: "png"
            });

            this.setState({imageURI: uri});
        } catch (err) {
            Alert.alert('Error', err.message);
        }
        this.setState({loading: false});
    };

    flashIcon = () => {
        let {flashMode} = this.state;
        let icon = "flash-auto";
        switch (flashMode) {
            case RNCamera.Constants.FlashMode.auto:
                icon = "flash-icon";
                break;
            case RNCamera.Constants.FlashMode.off:
                icon = "flash-off";
                break;
            case RNCamera.Constants.FlashMode.on:
                icon = "flash";
                break;
            case RNCamera.Constants.FlashMode.torch:
                icon = "flash-circle";
                break;
        }
        return icon;
    };

    cameraTypeIcon = () => {
        let {cameraType} = this.state;
        let icon = 'camera-front-variant';
        if (cameraType === RNCamera.Constants.Type.front) {
            icon = 'camera-rear-variant';
        } else {
            icon = 'camera-front-variant';
        }
        return icon;
    };

    renderCamera = () => {
        let {flashMode, loading, cameraType} = this.state;
        return (
            <React.Fragment>
                <View style={{flex: 1, backgroundColor: '#000'}} ref={e => this.camContainer = e}>
                    <RNCamera ref={cam => {
                        this.camera = cam
                    }} style={{flex: 1}} flashMode={flashMode} type={cameraType}/>
                </View>
                <View style={{
                    position: 'absolute',
                    flex: 1,
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    justifyContent: 'space-between',
                    flexDirection: 'column'
                }}>
                    <View style={{
                        alignSelf: 'stretch',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20,
                        flexDirection: 'row'
                    }}>
                        <Touchable style={{padding: 10}} onPress={() => {
                            if (flashMode == RNCamera.Constants.FlashMode.off)
                                this.setState({flashMode: RNCamera.Constants.FlashMode.torch});
                            else
                                this.setState({flashMode: RNCamera.Constants.FlashMode.off});
                        }}>
                            <Icon name={this.flashIcon()} family={"MaterialCommunityIcons"} size={30}
                                  color={'#fff'}/>
                        </Touchable>
                        <Touchable style={{padding: 10}} onPress={() => {
                            if (cameraType == RNCamera.Constants.Type.front)
                                this.setState({cameraType: RNCamera.Constants.Type.back});
                            else
                                this.setState({cameraType: RNCamera.Constants.Type.front});
                        }}>
                            <Icon name={this.cameraTypeIcon()} family={"MaterialCommunityIcons"} size={30}
                                  color={'#fff'}/>
                        </Touchable>
                    </View>

                    <Touchable style={{padding: 10, position: 'absolute', top: 10, right: 10}} onPress={this.close}>
                        <Icon name={"close"} family={"MaterialCommunityIcons"} size={25}
                              color={'#fff'}/>
                    </Touchable>

                    <View style={{alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', padding: 20}}>
                        <Touchable
                            disabled={loading}
                            onPress={this.takePicture}
                            style={{borderWidth: 5, borderColor: '#fff', width: 60, height: 60, borderRadius: 30}}>
                        </Touchable>
                    </View>
                </View>
            </React.Fragment>
        )
    };

    renderImage = () => {
        let {imageURI} = this.state;
        return (
            <React.Fragment>
                <Image source={{uri: imageURI}} resizeMode={"contain"} style={{flex: 1}}/>
                <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,.25)'}}>
                    <View style={{
                        justifyContent: 'center',
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',
                        marginBottom: 10
                    }}>
                        <Touchable style={{padding: 10}} onPress={() => this.setState({imageURI: null})}>
                            <Icon name={"close"} family={"MaterialIcons"} color={"#fff"} size={35}/>
                        </Touchable>
                        <View style={{height: 30, width: 2.5, backgroundColor: "#fff"}}/>
                        <Touchable style={{padding: 10}}>
                            <Icon name={"check"} family={"MaterialIcons"} color={"#fff"} size={35}/>
                        </Touchable>
                    </View>
                </View>
            </React.Fragment>
        )
    };

    render() {
        let {imageURI} = this.state;
        return (
            <Container style={{backgroundColor: '#000', padding: 0}}>
                {!imageURI ? this.renderCamera() : this.renderImage()}
            </Container>
        );
    }
}

Camera.propTypes = {};

export default Camera;