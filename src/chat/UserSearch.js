import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View, FlatList, Alert} from 'react-native';
import {Text, theme, ActivityIndicator} from '../components';
import {Container, Header, Left, Body, Right, Button, Icon, Title, Form, Item, Label, Input} from 'native-base';
import firebase from 'react-native-firebase';
import ContactListItem from "../blocks/ContactListItem";

const usersStorage = require('../helpers/usersStorage');

class UserSearch extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        header: null,
    });
    state = {items: [], except: [], users: []};

    constructor(props) {
        super(props);

        let params = this.props.navigation.state.params || {};
        this.title = params.title;
        this.multi = params.multi;
        this.onSubmit = params.onSubmit;
        this.backOnSubmit = params.backOnSubmit;
        this.onDone = params.onDone;
    }


    componentDidMount() {
        this.fetchData();
        try {
            let params = this.props.navigation.state.params || {};
            let except = params.except || [];
            this.setState({except});
        } catch (err) {
            console.log(err);
        }

    }

    fetchData = async queryString => {
        this.setState({loading: true});
        try {
            let params = this.props.navigation.state.params || {};
            let all = params.all || false;
            let userAuth = firebase.auth().currentUser;
            let userRef = firebase.firestore().collection('Users').doc(userAuth.uid);
            let query = userRef.collection('Contacts');
            if (all) {
                query = firebase.firestore().collection('Users');
            }
            if (queryString) {
                query = query.startAt(searchText).endAt(searchText + "\uf8ff")
            }
            let items = await query.get();
            items = items.docs;
            if (!all) {
                items = items.map(item => usersStorage(item.data().User));
                items = await Promise.all(items);
            }
            this.setState({items, currentUser: userRef});
        } catch (err) {
            Alert.alert("Error", err.message);
        }
        this.setState({loading: false});
    };

    renderHeader = () => {
        let {isSearch, users} = this.state;
        let items = this.getItems();
        return (
            <Header searchBar>
                <Left style={isSearch ? {flex: null} : null}>
                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Icon name="arrow-back"/>
                    </Button>
                </Left>
                {isSearch ? (
                    <Item>
                        <Input placeholder="Search User"/>
                        <Icon name="search"/>
                    </Item>
                ) : (
                    <React.Fragment>
                        <Body>
                        <Title>{this.title || 'Select User'}</Title>
                        </Body>
                        <Right>
                            {items.length > 0 ? (
                                <Button transparent onPress={() => this.setState({isSearch: true})}>
                                    <Icon name='search'/>
                                </Button>
                            ) : null}
                            {users.length > 0 ? (
                                <Button transparent onPress={() => {
                                    if (typeof this.onSubmit === 'function')
                                        this.onSubmit(users);
                                    if (this.backOnSubmit === true)
                                        this.props.navigation.goBack();
                                }}>
                                    <Icon name='done' type="MaterialIcons"/>
                                </Button>
                            ) : null}
                        </Right>
                    </React.Fragment>
                )}
            </Header>
        );
    };

    getItems = () => {
        let {currentUser, items, except} = this.state;
        let exceptId = except.map(item => item.id);
        if (currentUser)
            exceptId.push(currentUser.id);
        let finalItems = [];
        items.map(item => {
            let index = -1;
            index = exceptId.indexOf(item.id);
            if (index < 0) {
                finalItems.push(item);
            }
        });
        return finalItems;
    };

    close = () => {
        this.props.navigation.goBack();
    };

    render() {
        let {users, loading} = this.state;
        let items = this.getItems();
        if (items.length > 0) {
            return (
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                    {this.renderHeader()}
                    <FlatList
                        data={items}
                        extraData={users}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => {
                            let usersIndex = users.map(user => user.id);
                            let index = usersIndex.indexOf(item.id);
                            return (
                                <ContactListItem
                                    left={index >= 0 ? (() => (
                                        <View style={{
                                            width: 40,
                                            height: 40,
                                            backgroundColor: theme.color.primary,
                                            borderRadius: 40 / 2,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Icon name='done' type="MaterialIcons" style={{color: '#fff'}}/>
                                        </View>
                                    )) : null}
                                    user={item} onItemPress={() => {
                                    if (!this.multi) {
                                        if (typeof this.onSubmit === 'function')
                                            this.onSubmit(item);
                                    } else {
                                        if (index >= 0) {
                                            users.splice(index, 1);
                                        } else {
                                            users.push(item)
                                        }
                                    }
                                    this.setState({users: [...users]});
                                }}/>
                            )
                        }}
                    />
                </View>
            );
        } else if (loading) {
            return (
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                    {this.renderHeader()}
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator/>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                    {this.renderHeader()}
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text sizePercentage={150}>No data.</Text>
                    </View>
                </View>
            )
        }
    }
}

UserSearch.propTypes = {};

export default UserSearch
