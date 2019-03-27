import React, { Component } from 'react';
import { Image } from 'react-native';
import { Text } from '../components';
import firebase from 'react-native-firebase';

class FirebaseImage extends Component {
    state = {
        downloadURL: null,
    }
    componentDidMount() {
        this.fetchDownloadURL();
    }
    fetchDownloadURL = async () => {
        try {
            var storage = firebase.storage();
            var gsReference = storage.refFromURL(this.props.url);
            let downloadURL = await gsReference.getDownloadURL();
            this.setState({ downloadURL });
        } catch (err) {
            console.log(err);
        }
    }
    render() {
        let { downloadURL } = this.state;
        return (
            <Text>
                {downloadURL || 'wala pa'}
            </Text>
        );
    }
}

export default FirebaseImage;