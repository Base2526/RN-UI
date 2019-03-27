import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View, Animated, Easing} from 'react-native';
import {Text} from '../../components';

class Toast extends PureComponent {
    state = {message: '', animatedValue: new Animated.Value(0)};
    show = message => {
        let self = this;
        let {animatedValue} = this.state;
        this.setState({message});
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 300,
            easing: Easing.ease
        }).start(() => {
            if (self.timeout)
                clearTimeout(self.timeout);
            self.timeout = setTimeout(() => {
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.ease
                }).start(() => self.setState({message: ''}));
            }, 3000);
        });
    };

    render() {
        let {message, animatedValue} = this.state;
        if (message!='')
            return (
                <Animated.View style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 0,
                    right: 0,
                    height: 50,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    opacity: animatedValue
                }}>
                    <View style={{
                        backgroundColor: '#555',
                        borderRadius: 100,
                        elevation: 3,
                        padding: 10
                    }}>
                        <Text style={{color: '#fff'}}>{message}</Text>
                    </View>
                </Animated.View>
            );
        else
            return false;
    }
}

Toast.propTypes = {};

export default Toast;