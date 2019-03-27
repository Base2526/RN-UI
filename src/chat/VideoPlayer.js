import React, {Component} from 'react';
import {connect} from 'react-redux';
import {StatusBar, Alert} from 'react-native';
import {Container, Text} from '../components';
import Video from 'react-native-video';

function mapStateToProps(state) {
    return {};
}

class VideoPlayer extends Component {
    state = {};

    componentDidMount() {
        const {navigation} = this.props;
        const video = navigation.getParam('video');
        if (!video) {
            Alert.alert('Error', "Video not found", [{
                text: 'Ok',
                onPress: () => this.props.navigation.goBack()
            }], {cancelable: false},);
        } else {
            this.setState({video});
        }
    }

    onBuffer = (data) => {
        console.log(data)
    };

    videoError = error => {
        console.error(error);
    };

    render() {
        let {video} = this.state;
        return (
            <Container style={{backgroundColor: '#000'}}>
                <StatusBar backgroundColor={'#000'} barStyle={"light-content"}/>
                {video ? (
                    <Video
                        ref={(ref) => {
                            this.player = ref
                        }}
                        source={{uri: video}}
                        resizeMode="cover"
                        onBuffer={this.onBuffer}
                        onError={this.videoError}
                        style={{
                            flex: 1
                        }}/>
                ) : null}
            </Container>
        );
    }
}

export default connect(
    mapStateToProps,
)(VideoPlayer);