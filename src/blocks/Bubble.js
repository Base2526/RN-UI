import React, {Component} from 'react';
import {Bubble as GiftedBubble} from 'react-native-gifted-chat';
import {Image, View, Animated, Easing, Linking, Platform, Alert} from 'react-native';
import {Icon, Touchable, ActivityIndicator, Text} from '../components';
import MapView, {Marker} from 'react-native-maps';
import MessageHeader from "../chat/Message";
import {SafeAreaView} from "react-navigation";
import TouchableToUser from '../blocks/TouchableToUser';
import FileTypeIcon from "./FileTypeIcon";
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import AudioBuble from "./AudioBuble";
import ContactBubble from "./ContactBubble";

class Bubble extends Component {
    render() {
        let {data} = this.props;
        let createdAt = data.currentMessage.createdAt || new Date();
        if (!(createdAt instanceof Date)) {
            data.currentMessage.createdAt = new Date();
        }

        if (data.currentMessage.image && data.currentMessage.uploading === true) {
            return (
                <GiftedBubble
                    {...data}
                    renderMessageImage={({imageProps, imageStyle, currentMessage}) => (
                        <View>
                            <Image
                                {...imageProps}
                                style={imageStyle}
                                source={{uri: currentMessage.image}}
                            />
                            <View style={{
                                ...imageStyle,
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                right: 0,
                                left: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,.25)'
                            }}>
                                <ActivityIndicator/>
                            </View>
                        </View>
                    )}/>)
        } else if (data.currentMessage.video && data.currentMessage.uploading === true) {
            return (
                <GiftedBubble
                    {...data}
                    renderMessageVideo={({imageProps, imageStyle, currentMessage}) => (
                        <View>
                            <Image
                                {...imageProps}
                                style={imageStyle}
                                source={{uri: currentMessage.image}}
                            />
                            <View style={{
                                ...imageStyle,
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                right: 0,
                                left: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,.25)'
                            }}>
                                <ActivityIndicator/>
                            </View>
                        </View>
                    )}/>)
        } else if (data.currentMessage.video && !data.currentMessage.uploading) {
            return (
                <GiftedBubble
                    {...data}
                    renderMessageVideo={({imageProps, imageStyle, currentMessage}) => (
                        <Touchable onPress={() => this.props.navigation.navigate('VideoPlayer', {
                            video: currentMessage.video
                        })}>
                            <Image
                                {...imageProps}
                                style={[imageStyle, {borderRadius: 13, margin: 3}]}
                                source={{uri: currentMessage.image_thumbnail}}
                            />
                            <View style={{
                                ...imageStyle,
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                right: 0,
                                left: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Icon family={'MaterialIcons'} name={"play-circle-outline"} color={"#fff"} size={45}
                                      style={{elevation: 3}}/>
                            </View>
                        </Touchable>
                    )}/>)
        } else if (data.currentMessage.type === 'sticker') {
            let time = {color: '#aaa'};
            let wrapper = {backgroundColor: 'transparent'};
            return (
                <GiftedBubble
                    {...data}
                    timeTextStyle={{right: time, left: time}}
                    renderMessageImage={({imageProps, imageStyle, currentMessage}) => (
                        <Image
                            {...imageProps}
                            resizeMode="contain"
                            style={[{width: 150, height: 150}, imageStyle]}
                            source={{uri: currentMessage.image}}
                        />
                    )}
                    wrapperStyle={{right: wrapper, left: wrapper}}/>)

        } else if (data.currentMessage.location) {
            let {position} = data;
            return (
                <View style={{flex: 1, alignItems: position == 'left' ? 'flex-start' : 'flex-end'}}>
                    <Touchable
                        style={{flex: 1}}
                        onPress={() => {
                            let lat = data.currentMessage.location.latitude;
                            let lng = data.currentMessage.location.longitude;
                            const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
                            const latLng = `${lat},${lng}`;
                            const label = data.currentMessage.text || "Location Address";
                            const url = Platform.select({
                                ios: `${scheme}${label}@${latLng}`,
                                android: `${scheme}${latLng}(${label})`
                            });

                            Linking.canOpenURL(url).then(supported => {
                                if (supported) {
                                    return Linking.openURL(url);
                                } else {
                                    let browser_url =
                                        "https://www.google.de/maps/@" +
                                        lat +
                                        "," +
                                        lng +
                                        "?q=" +
                                        label;
                                    return Linking.openURL(browser_url);
                                }
                            });
                        }}>
                        <View style={{flex: 1, overflow: 'hidden', borderRadius: 4}}
                              pointerEvents="none">
                            <MapView
                                style={{width: 200, height: 150}}
                                region={{
                                    ...data.currentMessage.location,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                            >
                                <Marker coordinate={data.currentMessage.location}/>
                            </MapView>
                            <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}/>
                        </View>
                    </Touchable>
                </View>
            )
        } else if (data.currentMessage.userContact) {
            let {position} = data;
            let copyData = Object.assign({}, data);
            delete copyData.currentMessage.text;
            return (
                <GiftedBubble containerStyle={{overflow: 'hidden'}} {...copyData} renderCustomView={() => (
                    <TouchableToUser userId={data.currentMessage.userContact} style={{flex: 1}} onPress={user => {
                        this.props.navigation.navigate('UserProfile', {user});
                    }}>
                        <View style={{flexDirection: 'row', padding: 10}}>
                            <Text style={{color: position == 'left' ? null : '#fff'}}>Contact: </Text>
                            <Text style={{
                                color: position == 'left' ? null : '#fff',
                                textDecorationLine: 'underline',
                                fontWeight: '700',
                            }}>{data.currentMessage.displayName}</Text>
                        </View>
                    </TouchableToUser>
                )}/>
            )
        } else if (/audio\//.test(data.currentMessage.fileType)) {
            return <AudioBuble data={data} key={data.currentMessage._id}/>
        } else if (data.currentMessage.contact) {
            return <ContactBubble data={data} key={data.currentMessage._id}/>
        } else if (data.currentMessage.fileType) {
            let {position} = data;
            let copyData = Object.assign({}, data);
            delete copyData.currentMessage.text;
            return (
                <GiftedBubble containerStyle={{overflow: 'hidden'}} {...copyData} renderCustomView={() => (
                    <Touchable
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10,
                            flexDirection: 'row'
                        }}
                        onPress={() => {
                            let fileURL = data.currentMessage.url;
                            if (fileURL) {
                                Alert.alert('Confirm', 'Are you sure you want to download this file?', [
                                    {text: "No"},
                                    {
                                        text: "Yes",
                                        onPress: () => {
                                            Linking.openURL(fileURL);
                                        }
                                    }
                                ])
                            }
                        }}>
                        <FileTypeIcon fileType={data.currentMessage.fileType}
                                      color={position == 'left' ? '#333' : '#fff'}/>
                        <View style={{flexDirection: 'row', padding: 3}}>
                            <Text style={{
                                color: position == 'left' ? null : '#fff',
                                textDecorationLine: 'underline',
                                fontWeight: '700',
                            }}>{data.currentMessage.fileName}</Text>
                        </View>
                    </Touchable>
                )}/>
            )
        } else
            return <GiftedBubble {...data} />
    }
}

class ContainerBubble extends Component {
    state = {
        animatedValue: new Animated.Value(0),
        marginBottom: null
    };

    componentDidMount() {
        // this.handleAnimation();
        let {animate} = this.props;
        if (!animate) {
            this.setState({marginBottom: 0})
        }
    }


    handleAnimation = () => {
        Animated.timing(this.state.animatedValue, {
            toValue: 1,
            duration: 350,
            easing: Easing.ease
        }).start()
    };

    render() {
        let {animatedValue, marginBottom} = this.state;
        let animate = this.props.animate;
        let props = Object.assign({}, this.props);
        delete props.animate;
        return (
            <Animated.View style={{
                flex: 1,
                marginBottom: marginBottom == null ? -10000 : marginBottom
            }}>
                <View onLayout={event => {
                    let layout = event.nativeEvent.layout;
                    let height = layout.height;
                    if (marginBottom == null && animate) {
                        this.setState({marginBottom: new Animated.Value(-height)}, () => {
                            Animated.timing(this.state.marginBottom, {
                                toValue: 0,
                                duration: 250,
                                easing: Easing.ease
                            }).start()
                        });
                    }
                }}>
                    <Bubble {...props}/>
                </View>
            </Animated.View>
        )
    }
}


export default ContainerBubble;