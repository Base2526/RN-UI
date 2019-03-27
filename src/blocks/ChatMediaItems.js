//Created By: Randolf Joshua Diezmo - joshuadiezmo@gmail.com

import React, {Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
//import {} from 'actions';
import {Animated, Keyboard} from 'react-native';
import {createMaterialTopTabNavigator, createAppContainer} from 'react-navigation';
import {Container, Text} from '../components';
import StickerList from './StickerList';
import EmojisList from './EmojisList';
import {ThemeContext} from '../components/ThemeContext';

const variables = ThemeContext._currentValue.variables;

const TabNavigator = createMaterialTopTabNavigator({
    Stickers: {
        screen: StickerList
    },
    // Emojis: {
    //     screen: EmojisList
    // },
}, {
    swipeEnabled: false,
    tabBarOptions: {
        upperCaseLabel: false,
        activeTintColor: variables.color.primary,
        inactiveTintColor: variables.color.primaryLight,
        style: {
            backgroundColor: '#eee'
        },
        indicatorStyle: {
            backgroundColor: variables.color.primary
        }
    }
});
const MediaItems = createAppContainer(TabNavigator)

class ChatMediaItems extends Component {
    state = {
        opacity: 0,
        marginBottom: new Animated.Value(-290)
    }

    componentWillUpdate(nextProps) {
        let oldShow = this.props.show;
        let newShow = nextProps.show;
        if (!oldShow && newShow) {
            this.show();
        } else if (oldShow && !newShow) {
            this.hide();
        }
    }

    show = () => {
        Animated.spring(this.state.marginBottom, {
            toValue: 0,
        }).start();
        this.setState({
            opacity: 1,
        });
        Keyboard.dismiss();
    }
    hide = () => {
        Animated.spring(this.state.marginBottom, {
            toValue: -290,
        }).start(() => {
            this.setState({
                opacity: 0,
            });
        });
    }

    render() {
        let {group} = this.props;
        let {opacity, marginBottom} = this.state;
        if (opacity == 1)
            return (
                <Animated.View style={{flex: 1, marginBottom, opacity, maxHeight: 290, padding: 0}}>
                    <MediaItems screenProps={{group}}/>
                </Animated.View>
            );
        else
            return null;
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
        actions: bindActionCreators(actions, dispatch)
    };
    return actionMap;
};

export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(ChatMediaItems);