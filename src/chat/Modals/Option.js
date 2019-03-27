import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {BackHandler} from "react-native";
import {View, FlatList, TouchableWithoutFeedback, Animated, Easing} from 'react-native';
import {Text, Touchable, Icon} from '../../components';

class Option extends PureComponent {
    state = {
        scale: new Animated.Value(0)
    };
    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props);
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }

    componentDidMount() {
        this.updateParams(this.props.navigation.state.params);
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
        Animated.timing(this.state.scale, {
            toValue: 1,
            duration: 200,
            easing: Easing.ease
        }).start();
    }

    componentWillUpdate(nextProps, nextState, nextContext) {

        let nextParams = nextProps.navigation.state.params;
        let params = this.props.navigation.state.params;
        if (JSON.stringify(nextParams) !== JSON.stringify(params)) {
            this.updateParams(nextParams)
        }
    }

    updateParams = params => {
        try {
            let buttons = params.buttons || [];
            let title = params.title;
            let subTitle = params.subTitle;
            this.setState({buttons, title, subTitle});
        } catch (err) {

        }
    };

    back = () => {
        Animated.timing(this.state.scale, {
            toValue: 0,
            duration: 100,
            easing: Easing.ease
        }).start(() => {
            this.props.navigation.goBack();
        });
    };

    onBackButtonPressAndroid = () => {
        this.back();
        return true;
    };

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    render() {
        let {buttons, title, subTitle, scale} = this.state;
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10}}>
                <TouchableWithoutFeedback onPress={this.back}>
                    <Animated.View style={{
                        backgroundColor: 'rgba(0,0,0,.5)',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        opacity: scale.interpolate({
                            inputRange: [0, 1],
                            outputRange: [.5, 1]
                        })
                    }}/>
                </TouchableWithoutFeedback>
                <Animated.View style={{
                    backgroundColor: '#fff',
                    alignSelf: 'stretch',
                    textAlign: 'center',
                    elevation: 3,
                    borderRadius: 2,
                    opacity: scale.interpolate({
                        inputRange: [0, 1],
                        outputRange: [.5, 1]
                    }),
                    transform: [
                        {
                            scale: scale.interpolate({
                                inputRange: [.5, 1],
                                outputRange: [.9, 1]
                            })
                        },
                    ]
                }}>
                    {title || subTitle ? (
                        <View style={{padding: 15}}>
                            {title ? <Text sizePercentage={115} style={{fontWeight: '900'}}>{title}</Text> : null}
                            {subTitle ? <Text sizePercentage={80}>{subTitle}</Text> : null}
                        </View>
                    ) : null}
                    <FlatList
                        data={buttons}
                        keyExtractor={(item, index) => `${item.text}-${index}-options`}
                        renderItem={({item}) => (
                            <Touchable style={{padding: 15, flexDirection: 'row'}} onPress={() => {
                                let backOnPress = typeof item.backOnPress == 'undefined' ? true : item.backOnPress;
                                if (typeof item.onPress === 'function') {
                                    if (backOnPress)
                                        this.props.navigation.goBack();
                                    item.onPress();
                                }
                            }}>
                                {typeof item.extra === 'function' ?
                                    <View style={{marginRight: 5}}>{item.extra()}</View> : null}
                                <Text>{item.text}</Text>
                            </Touchable>
                        )}
                    />
                </Animated.View>
            </View>
        );
    }
}

Option.propTypes = {};

export default Option;
