import React, {Component} from 'react';
import {Container, Touchable, TextInput, FormLabel, Icon, Button, Text, theme} from '../components';
import {Platform, Alert, View, Image} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'rn-fetch-blob';

const Blob = RNFetchBlob.polyfill.Blob

const options = {
    title: 'Select Avatar',
    maxWidth: 150,
    quality: .75,
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

class Signup extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: "Signup"
        };
    };
    state = {
        viewPassword: false,
        email: '',
        password: '',
        displayName: '',
        loadingMessage: ""
    };

    componentDidMount() {
        let user = firebase.auth().currentUser;
        console.log(user);
    }

    uploadAvatar = async () => {
        try {
            let {email, avatarData} = this.state;
            const mime = 'image/png';
            let uploadBlob;
            const imageRef = firebase.storage().ref('user_avatars/' + email + (new Date()).getTime() + ".png");
            let blob = await Blob.build(avatarData, {type: `${mime};BASE64`});
            uploadBlob = blob;
            await imageRef.put(blob._ref, {contentType: mime});
            uploadBlob.close();
            let url = await imageRef
            return url;
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
    signup = async () => {
        let {email, password, avatarData, displayName, avatarStorage} = this.state;
        this.setState({loadingMessage: "Loading"});
        try {
            if (email == '' || password == '' || !avatarData || displayName == '') {
                throw new Error('All fields are required.');
            }
            if (!avatarStorage) {
                this.setState({loadingMessage: "Uploading Avatar"});
                avatarStorage = await this.uploadAvatar();
                this.setState({avatarStorage});
            }
            let imageMeta = await avatarStorage.getMetadata();
            let imageDownloadURL = await avatarStorage.getDownloadURL();
            this.setState({loadingMessage: "Creating User"});
            let userCredentials = await firebase.auth().createUserWithEmailAndPassword(email, password);
            let user = firebase.auth().currentUser;
            if (user) {
                await user.updateProfile({
                    displayName: displayName,
                    photoURL: imageDownloadURL
                });
                user = firebase.auth().currentUser;
                firebase.firestore().collection('Users').doc(user.uid).set(user._user);
            }
            this.props.navigation.navigate('App');

        } catch (err) {
            Alert.alert('Error', err.message);
            this.setState({loadingMessage: ""});
        }
    }
    selectAvatar = () => {
        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                Alert.alert("Error", response.error);
            } else {
                const source = {uri: response.uri};

                this.setState({
                    avatarSource: source,
                    avatarData: response.data,
                    avatarStorage: null
                });
            }
        });
    }

    render() {
        let isAndroid = Platform.OS == 'android';
        let {viewPassword, loadingMessage, avatarSource} = this.state;
        return (
            <Container>
                <View style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch'}}>
                    {avatarSource ? (
                        <Image
                            style={{width: 150, height: 150, borderRadius: 75, marginBottom: 15}}
                            source={avatarSource}
                        />
                    ) : null}
                    <Button style={{alignSelf: 'center'}} onPress={this.selectAvatar} disabled={loadingMessage != ""}>
                        <Text>{(avatarSource ? 'Change' : 'Select') + ' Avatar'}</Text>
                    </Button>
                </View>
                <FormLabel style={{marginTop: 5}}>Email</FormLabel>
                <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={email => this.setState({email})}/>
                <FormLabel style={{marginTop: 5}}>Display Name</FormLabel>
                <TextInput
                    autoCapitalize="none"
                    onChangeText={displayName => this.setState({displayName})}/>
                <FormLabel style={{marginTop: 5}}>Password</FormLabel>
                <TextInput
                    autoCapitalize="none"
                    secureTextEntry={!viewPassword}
                    onChangeText={password => this.setState({password})}
                    onSubmitEditing={this.signup}
                    rightIcon={(
                        <Touchable style={{padding: 10}} onPress={() => this.setState({viewPassword: !viewPassword})}>
                            <Icon family="Ionicons" color={theme.baseFontColor}
                                  name={(isAndroid ? "md" : "ios") + "-eye" + (viewPassword ? "-off" : "")} size={25}/>
                        </Touchable>
                    )}/>
                <Button
                    onPress={this.signup}
                    style={{marginTop: 10}}
                    disabled={loadingMessage != ""}
                    block>
                    <Text>
                        {loadingMessage == "" ? "Signup" : loadingMessage}
                    </Text>
                </Button>
            </Container>
        );
    }
}

export default Signup;