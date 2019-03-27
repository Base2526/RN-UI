import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';
import {View, StyleSheet, Animated, Keyboard, Alert} from 'react-native';
import RNFS from 'react-native-fs';
import {Text, Icon, Touchable} from '../components';
import {upload_file} from '../helpers/Api';
import {READ_CONTACTS} from '../helpers/Permissions';

const userStorage = require('../helpers/usersStorage');

class ChatTools extends PureComponent {
    state = {
        opacity: 0,
        marginBottom: new Animated.Value(-90)
    };

    componentWillUpdate(nextProps) {
        let oldShow = this.props.show;
        let newShow = nextProps.show;
        if (!oldShow && newShow) {
            this.show();
        } else if (oldShow && !newShow) {
            this.hide();
        }
    }

    uuidv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    show = () => {
        this.setState({
            show: true
        });
        Animated.spring(this.state.marginBottom, {
            toValue: 0,
        }).start();
        Keyboard.dismiss();
    };

    hide = () => {
        Animated.spring(this.state.marginBottom, {
            toValue: -90,
        }).start(() => {
            this.setState({
                show: false,
            });
        });
    };

    handleLocationSelect = (location, locationAddress) => {
        if (typeof this.props.onSend == 'function')
            this.props.onSend([{
                location, text: locationAddress
            }])
    };

    onContactSend = async users => {
        this.props.navigation.goBack(null);
        users = await userStorage(users);
        this.props.onSend([{
            userContact: users.id,
            displayName: users.data().displayName,
            text: users.data().displayName
        }])
    };

    openFilePicker = async () => {
        try {
            let self = this;
            DocumentPicker.show({
                filetype: [DocumentPickerUtil.allFiles()]
            }, async (error, res) => {
                if (!error) {
                    let uid = self.uuidv4();
                    let uri = res.uri;
                    let type = res.type;
                    let name = res.fileName;
                    try {
                        let response = await upload_file({uid, uri, type, name});
                        let json = await response.json();
                        let data = json.data || {};
                        let original_url = data.original_url || "";
                        if (original_url != '') {
                            this.props.onSend([{
                                fileType: type,
                                fileName: name,
                                text: name,
                                url: original_url
                            }]);
                        }
                    } catch (err) {
                        throw err;
                    }
                }
            });
        } catch ({message}) {
            Alert.alert("Error", message);
        }
    };

    sendFromPhoneContact = async () => {
        try {
            await READ_CONTACTS();
            this.props.navigation.navigate('PhoneContactPicker', {
                onSelect: async contact => {
                    try {
                        let {givenName, familyName, middleName, suffix, hasThumbnail, thumbnailPath} = contact;
                        let copyContact = Object.assign({}, contact);
                        delete copyContact.hasThumbnail;
                        delete copyContact.thumbnailPath;
                        let thumbnail;
                        // if (hasThumbnail) {
                        //     thumbnail = await upload_file({
                        //         uid: this.uuidv4(),
                        //         uri: thumbnailPath,
                        //         type: 'image/png',
                        //         name: 'Contact-image.png'
                        //     });
                        //     console.log(thumbnail);
                        // }
                        this.props.onSend([{
                            contact: copyContact,
                            text: [givenName, middleName, familyName, suffix].join(' ')
                        }])
                    } catch (err) {
                        console.log(err);
                    }
                }
            });
        } catch ({message}) {
            Alert.alert("Error", message);
        }
    };

    contactPicker = () => {
        this.props.navigation.navigate('Option', {
            title: 'Select',
            buttons: [
                {
                    text: 'Phone Contact',
                    onPress: this.sendFromPhoneContact
                },
                {
                    text: 'DNA Chat Contacts',
                    onPress: () => {
                        this.props.navigation.navigate('UserSearch', {
                            title: 'Select Contact',
                            onSubmit: this.onContactSend
                        });
                    }
                }
            ]
        });
    };

    render() {
        let {marginBottom, show} = this.state;
        if (show || true)
            return (
                <Animated.View
                    style={{
                        borderTopWidth: 1,
                        borderTopColor: '#eee',
                        elevation: 1,
                        backgroundColor: '#eee',
                        padding: 10,
                        marginBottom
                    }}>
                    <View style={{flexDirection: 'row'}}>
                        <Touchable style={styles.card} onPress={this.openFilePicker}>
                            <Icon name="file" family="MaterialCommunityIcons" size={30} color="#555"/>
                            <Text>File</Text>
                        </Touchable>
                        <Touchable style={styles.card} onPress={this.contactPicker}>
                            <Icon name="person" family="MaterialIcons" size={30} color="#555"/>
                            <Text>Contact</Text>
                        </Touchable>
                        <Touchable style={styles.card}
                                   onPress={() => this.props.navigation.navigate('MapPicker', {onLocationSelect: this.handleLocationSelect})}>
                            <Icon name="location-on" family="MaterialIcons" size={30} color="#555"/>
                            <Text>Location</Text>
                        </Touchable>
                    </View>
                </Animated.View>
            );
        else
            return null;
    }
}

ChatTools.propTypes = {};

let styles = StyleSheet.create({
    card: {
        padding: 10,
        elevation: 1,
        marginRight: 10,
        minWidth: 75,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 2
    }
});

export default ChatTools;