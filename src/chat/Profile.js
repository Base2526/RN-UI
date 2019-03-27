import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View, ImageBackground, FlatList, Alert} from 'react-native';
import {Container, ListItem, Header, Left, Body, Right, Title, Button, Icon} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import firebase from 'react-native-firebase';
import FireStoreAvatar from "../blocks/FireStoreAvatar";
import {Text, theme, Icon as IconCustom} from '../components';
import {bindActionCreators} from "redux";
import {contacts} from "../actions";
import {connect} from "react-redux";

const usersStorage = require('../helpers/usersStorage');

class Profile extends PureComponent {
    constructor(props) {
        super(props);
        let currentUser = firebase.auth().currentUser;
        let currentUserRef = firebase.firestore().collection('Users').doc(currentUser.uid);
        this.state = {
            currentUserRef
        };
    }


    componentDidMount() {
        this.fetchUser();
        let {contacts} = this.props.actions;
        contacts.list();
        contacts.subscribe();
    }

    fetchUser = async () => {
        let {user} = this.props;
        if (user) {
            user = await usersStorage(user);
            this.setState({user});
        }
    };

    addToContacts = async () => {
        let {currentUserRef, user} = this.state;
        let ContactRef = currentUserRef.collection('Contacts').doc(user.id);
        ContactRef.set({
            User: firebase.firestore().collection('Users').doc(user.id),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    };

    removeToContacts = () => {
        let {currentUserRef, user} = this.state;
        let ContactRef = currentUserRef.collection('Contacts').doc(user.id);
        Alert.alert("Warning", "Are you sure you want to remove this to your contact?", [
            {
                text: "No"
            },
            {
                text: "Yes",
                onPress: () => ContactRef.delete()
            }
        ]);
    };

    sendMessage = () => {
        let {currentUserRef, user} = this.state;
        let userRef = firebase.firestore().collection('Users').doc(user.id);
        this.props.navigation.navigate('Message', {users: [userRef, currentUserRef]});
    };

    generateDetailList = () => {
        let {user, currentUserRef} = this.state;
        let isCurrentUser = user.id === currentUserRef.id;
        let detailList = [
            {
                icon: {name: 'person', family: 'MaterialIcons'},
                text: user ? user.data().displayName : null
            }
        ];
        if (isCurrentUser) {
            detailList.push({
                icon: {name: 'logout-variant', family: 'MaterialCommunityIcons'},
                text: 'Logout',
                onPress: () => {
                    if (typeof this.props.logout)
                        this.props.logout();
                }
            });
        } else {
            let {contacts} = this.props;
            let contactsId = contacts.items.map(item => item.id);
            detailList.push({
                icon: {name: 'message-plus', family: 'MaterialCommunityIcons'},
                text: 'Send message',
                onPress: this.sendMessage
            });

            if (contactsId.indexOf(user.id) < 0) {
                detailList.push({
                    icon: {name: 'person-add', family: 'MaterialIcons'},
                    text: 'Add to contact',
                    onPress: this.addToContacts
                });
            } else {
                detailList.push({
                    icon: {name: 'account-remove', family: 'MaterialCommunityIcons', color: '#f00'},
                    text: 'Remove to contact',
                    onPress: this.removeToContacts
                });
            }

            detailList.push({
                icon: {name: 'block', family: 'MaterialIcons', color: '#f00'},
                text: 'Block'
            });
        }
        return detailList;
    };

    render() {
        let {user} = this.state;
        let activated = this.props.activated;
        if (typeof activated == 'undefined')
            activated = true;
        if (user) {
            let detailList = this.generateDetailList();
            let userData = user.data();
            return (
                <Container>
                    <ImageBackground source={{uri: userData.photoURL}}
                                     blurRadius={1}
                                     style={{justifyContent: 'center', alignItems: 'center', padding: 50}}>
                        <View style={{width: 150, height: 150, borderRadius: 150 / 2, elevation: 3,backgroundColor:'#fff'}}>
                            <FireStoreAvatar user={user} style={{
                                width: 150,
                                height: 150,
                                borderRadius: 150 / 2,
                                borderWidth: 3,
                                borderColor: '#fff'
                            }}/>
                        </View>
                    </ImageBackground>
                    <Grid>
                        <Row>
                            <Col>
                                <FlatList
                                    keyExtractor={(item, index) => `user-profile-detail-item-${index}`}
                                    scrollEnabled={false}
                                    data={detailList}
                                    renderItem={({item}) => (
                                        <ListItem icon onPress={item.onPress}>
                                            <Left>
                                                <IconCustom {...(item.icon || {})}
                                                            size={25}/>
                                            </Left>
                                            <Body>
                                            <Text>{item.text}</Text>
                                            </Body>
                                        </ListItem>
                                    )}
                                />
                            </Col>
                        </Row>
                    </Grid>
                </Container>
            );
        }
        return null;
    }
}

Profile.propTypes = {};

const mapStateToProps = (state) => {
    const {contacts} = state;
    const props = {contacts};
    return props;
};

const mapDispatchToProps = (dispatch) => {
    const actions = {};
    const actionMap = {
        actions: {
            ...bindActionCreators(actions, dispatch),
            contacts: bindActionCreators(contacts, dispatch)
        }
    };
    return actionMap;
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);