import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View, FlatList, Image, Alert} from 'react-native';
import {Text, Touchable} from '../components';
import Contacts from 'react-native-contacts';

class PhoneContactPicker extends PureComponent {
    state = {
        contacts: []
    };

    componentDidMount() {
        Contacts.getAll((err, contacts) => {
            if (err) throw err;
            this.setState({contacts});
        });
        try {
            let params = this.props.navigation.state.params;
            this.onSelect = params.onSelect;
        } catch (err) {

        }
    }

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

    select = item => {
        Alert.alert("Confirm", "Are you sure you want to select this contact?", [
            {text: "No"},
            {
                text: "Yes",
                onPress: () => {
                    if (typeof this.onSelect == 'function') {
                        this.onSelect(item);
                        this.props.navigation.goBack();
                    }
                }
            }
        ])
    };

    render() {
        let {contacts} = this.state;
        return (
            <View style={{flex: 1}}>
                <FlatList
                    keyExtractor={item => item.recordID}
                    data={contacts}
                    renderItem={({item}) => {
                        let {givenName, familyName, middleName, suffix, hasThumbnail, thumbnailPath} = item;
                        let imageStyle = {
                            width: 50,
                            height: 50,
                            backgroundColor: '#eee',
                            borderRadius: 50 / 2,
                            marginRight: 5
                        };
                        return (
                            <Touchable style={{flex: 1, padding: 10, flexDirection: 'row', alignItems: 'center'}}
                                       onPress={() => this.select(item)}>
                                {hasThumbnail ?
                                    (<Image
                                        source={{uri: thumbnailPath}}
                                        style={imageStyle}/>) : (
                                        <View style={[imageStyle, {justifyContent: 'center', alignItems: 'center'}]}>
                                            <Text sizePercentage={140} style={{color: '#fff'}}>
                                                {this.generateInitials([givenName, middleName, familyName, suffix])}
                                            </Text>
                                        </View>
                                    )}
                                <Text sizePercentage={120}>
                                    {[givenName, middleName, familyName, suffix].join(' ')}
                                </Text>
                            </Touchable>
                        )
                    }
                    }
                />
            </View>
        );
    }
}

PhoneContactPicker.propTypes = {};

export default PhoneContactPicker;