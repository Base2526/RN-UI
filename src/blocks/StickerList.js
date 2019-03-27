//Created By: Randolf Joshua Diezmo - joshuadiezmo@gmail.com

import React, {Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {messages} from '../actions';
import {FlatList, Image, Dimensions} from 'react-native';
import {Container, Touchable, Text} from '../components';
import FirebaseImage from './FirebaseImage';

const stickers = [
    'https://res.cloudinary.com/dnachat/image/upload/v1548339217/stickers/stitch-happy.png',
    'https://res.cloudinary.com/dnachat/image/upload/v1548339217/stickers/stitch-shining.png',
    'https://res.cloudinary.com/dnachat/image/upload/v1548339217/stickers/stitch-heart.png',
    'https://res.cloudinary.com/dnachat/image/upload/v1548343532/stickers/cat-tired.png',
    'https://res.cloudinary.com/dnachat/image/upload/v1548343532/stickers/cat-wink-heart.png',
    'https://res.cloudinary.com/dnachat/image/upload/v1548343532/stickers/cat-wink.png'
];

class StickerList extends Component {
    constructor(props) {
        super(props);
        let {width} = Dimensions.get('window');
        this.state = {
            width
        };
    }

    render() {
        let {group} = this.props.screenProps;
        let imageSize = this.state.width / 4;
        return (
            <Container
                style={{padding: 0}}
                onLayout={() => {
                    let {width} = Dimensions.get('window');
                    this.setState({width});
                }}
            >
                <FlatList
                    keyExtractor={(item, index) => index}
                    data={stickers}
                    numColumns={4}
                    contentContainerStyle={{
                        alignItems: 'flex-start'
                    }}
                    renderItem={({item}) => {
                        return (
                            <Touchable style={{
                                width: imageSize,
                                padding: 15
                            }} onPress={() => {
                                this.props.actions.messages.addSticker(group, item);
                            }}>
                                <Image
                                    source={{uri: item}}
                                    resizeMode="contain"
                                    style={{
                                        width: imageSize - 30,
                                        height: imageSize - 30,
                                    }}/>
                            </Touchable>
                        )
                    }}
                />
            </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(StickerList);