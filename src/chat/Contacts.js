//Created By: Randolf Joshua Diezmo - joshuadiezmo@gmail.com

import React, {Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {contacts} from '../actions';
import {FlatList, View, ScrollView, StyleSheet, Alert} from 'react-native';
import {Container, Text, ActivityIndicator} from '../components';
import GroupListItem from '../blocks/GroupListItem';
import ContactListItem from '../blocks/ContactListItem';
import firebase from 'react-native-firebase';

const usersStorage = require('../helpers/usersStorage');

class Contacts extends Component {
    state = {
        users: []
    };

    componentWillUpdate(nextProps) {
        if (!this.props.activated && nextProps.activated) {
            this.fetchUser();
        }
    }

    fetchUser = async () => {
        this.props.actions.contacts.list();
    };

    render() {
        let groupList = this.props.groups.items.map(group => {
            if (group && group.data().Users.length > 2)
                return group
        }).filter(function (el) {
            return el != null;
        });
        return (
            <Container style={{padding: 0}}>
                {
                    this.props.groups.loading || this.props.contacts.loading ? (
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <ActivityIndicator/>
                        </View>
                    ) : (
                        <ScrollView>
                            {this.props.contacts.items.length > 0 ? (
                                <React.Fragment>
                                    <Text style={styles.header}>People</Text>
                                    <FlatList
                                        style={{flex: null, flexGrow: 0}}
                                        scrollEnabled={false}
                                        keyExtractor={(item, index) => (item.id + "-contact-list-item")}
                                        data={this.props.contacts.items}
                                        renderItem={({item}) => {
                                            return <ContactListItem contact={item} onItemPress={async () => {
                                                try {
                                                    let user = item.data().User;
                                                    let currentUser = firebase.auth().currentUser;
                                                    let currentUserDoc = firebase.firestore().collection('Users').doc(currentUser.uid);
                                                    this.props.navigation.navigate('Message', {users: [user, currentUserDoc]});
                                                } catch (err) {
                                                    Alert.alert("Error", err.message);
                                                }
                                            }}/>
                                        }}
                                    />
                                </React.Fragment>
                            ) : null}
                            {groupList.length > 0 ? (
                                <React.Fragment>
                                    <Text style={styles.header}>Groups</Text>
                                    <FlatList
                                        style={{flex: null, flexGrow: 0}}
                                        scrollEnabled={false}
                                        keyExtractor={(item, index) => (item.id + "-" + index + "-group-list-item")}
                                        data={groupList}
                                        renderItem={({item}) => {
                                            return <GroupListItem group={item} onItemPress={e => {
                                                this.props.navigation.navigate('Message', {group:item});
                                            }
                                            }/>
                                        }}
                                    />
                                </React.Fragment>
                            ) : null}
                        </ScrollView>
                    )
                }
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#efefef',
        padding: 3,
        color: '#555'
    }
});

const mapStateToProps = (state) => {
    const {contacts, groups} = state;
    const props = {contacts, groups};
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

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);