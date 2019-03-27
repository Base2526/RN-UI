import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Touchable, Text} from "../components";
import {Bubble} from "react-native-gifted-chat";
import {Image, View, Alert} from "react-native";
import Contact from 'react-native-contacts';
import {WRITE_CONTACTS} from '../helpers/Permissions';

class ContactBubble extends PureComponent {

    generateInitials = (data) => {
        let numInitials = 2;
        let initials = [];
        for (let x = 0; x < data.length; x++) {
            if (numInitials > 0 && data[x]) {
                initials.push(data[x][0]);
                numInitials -= 1;
            }
        }
        return initials.join('');
    };

    addContact = async contact => {
        Alert.alert('Confirm', "You want to save this contact?", [
            {text: "No"},
            {
                text: "Yes",
                onPress: async () => {
                    try {
                        await WRITE_CONTACTS();
                        Contact.addContact(contact, (err, photoUri) => {
                            if (err) {
                                throw new Error(err);
                            } else {
                                let {givenName, familyName, middleName, suffix, contactPhoto} = contact;
                                Alert.alert('Success', ([givenName, middleName, familyName, suffix].join(' ')) + " successfully added.");
                            }
                        })
                    } catch (err) {
                        Alert.alert("Error", err);
                    }
                }
            }
        ])
    };

    render() {
        let data = this.props.data;
        let copyData = Object.assign({}, data);
        delete copyData.currentMessage.text;
        let {position} = copyData;
        let color = position == 'left' ? '#333' : '#fff';
        let {givenName, familyName, middleName, suffix, contactPhoto, phoneNumbers, emailAddresses} = copyData.currentMessage.contact || {};
        let imageStyle = {
            width: 35,
            height: 35,
            backgroundColor: '#bbb',
            borderRadius: 35 / 2,
            marginRight: 3
        };
        let hasEmailAddresses = emailAddresses.length > 0;
        let hasPhoneNumbers = phoneNumbers.length > 0;
        return (
            <Bubble {...copyData} renderCustomView={() => {
                return (
                    <Touchable style={{flex: 1, padding: 5}}
                               onPress={() => this.addContact(copyData.currentMessage.contact)}
                    >
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                            {contactPhoto ?
                                (<Image
                                    source={{uri: contactPhoto}}
                                    style={imageStyle}/>) : (
                                    <View style={[imageStyle, {justifyContent: 'center', alignItems: 'center'}]}>
                                        <Text sizePercentage={90} style={{color: '#fff'}}>
                                            {this.generateInitials([givenName, middleName, familyName, suffix])}
                                        </Text>
                                    </View>
                                )}
                            <View>
                                <Text style={{color}}>{[givenName, middleName, familyName, suffix].join(' ')}</Text>
                                <View style={{flexDirection: 'row'}}>
                                    {hasEmailAddresses || hasPhoneNumbers ? (
                                        <Text sizePercentage={80} style={{color}}>
                                            {(hasEmailAddresses ? 'Email: ' + emailAddresses.length : '')}
                                            {hasEmailAddresses && hasPhoneNumbers ? ", " : ""}
                                            {(hasPhoneNumbers ? 'Phone: ' + phoneNumbers.length : '')}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>
                        </View>
                    </Touchable>
                )
            }}/>
        );
    }
}

ContactBubble.propTypes = {};

export default ContactBubble;