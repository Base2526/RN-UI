import React, {Component} from 'react';
import {View, Image, Alert} from 'react-native';
import {Text, Touchable, Avatar} from '../components';
import moment from 'moment';
import firebase from 'react-native-firebase';

import usersStorage from '../helpers/usersStorage';

class GroupListItem extends Component {
    state = {};

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        try {
            let {contact, user} = this.props;
            if (contact) {
                let User = contact.data().User;
                user = await usersStorage(User);
            }
            user = user.data();
            this.setState({userDisplayName: user.displayName, userPhotoURL: user.photoURL});
        } catch (err) {
            console.log('err', err);
            Alert.alert("Error", err.message);
        }
    };

    render() {
        let {userDisplayName, userPhotoURL} = this.state;
        return (
            <Touchable style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                if (typeof this.props.onItemPress === 'function')
                    this.props.onItemPress();
            }}>
                <View style={{padding: 7.5}}>
                    {
                        typeof this.props.left == 'function' ? this.props.left() : (
                            <View style={{width: 40, height: 40}}>
                                <Avatar source={userPhotoURL ? {uri: userPhotoURL} : null}
                                        style={{width: 40, height: 40, borderRadius: 20}}/>
                                <View style={{
                                    position: 'absolute',
                                    bottom: -1,
                                    right: 2,
                                    width: 12,
                                    height: 12,
                                    backgroundColor: '#42b72a',
                                    borderRadius: 6,
                                    borderColor: '#fff',
                                    borderWidth: 2
                                }}/>
                            </View>
                        )
                    }
                </View>
                <View style={{paddingRight: 10, flex: 1, justifyContent: 'center'}}>
                    <Text sizePercentage={100} style={{fontWeight: '500'}}>
                        {userDisplayName}
                    </Text>
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                        }}>
                            <Text numberOfLines={1} sizePercentage={70} style={{flex: 1}}>
                                Active {moment().fromNow()}
                            </Text>
                        </View>
                    </View>
                </View>
            </Touchable>
        );
    }
}

export default GroupListItem;