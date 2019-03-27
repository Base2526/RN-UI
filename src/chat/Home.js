//Created By: Randolf Joshua Diezmo - joshuadiezmo@gmail.com

import React, {Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
//import {} from 'actions';
import {Dimensions, Alert, Text, Animated} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {TabView, PagerPan} from 'react-native-tab-view';
import firebase from 'react-native-firebase';
import Messages from './Messages';
import Profile from './Profile';
import Contacts from './Contacts';
import {Header, Left, Body, Right, Button, Icon, Title} from 'native-base';
import FireStoreAvatar from "../blocks/FireStoreAvatar";
import BottomFooter from "../blocks/BottomFooter";
import {theme, Touchable, Icon as CustomIcon} from "../components";
import {displayName} from '../app.json';

const usersStorage = require('../helpers/usersStorage');

class Home extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    state = {
        index: 0,
        routes: [
            {key: 'first', title: 'Messages', icon: 'ios-chatbubbles'},
            {key: 'second', title: 'Contacts', icon: 'ios-contacts'},
            {key: 'third', title: 'Profile', icon: 'ios-person'},
        ],
    };

    constructor(props) {
        super(props);
        this.userAuth = firebase.auth().currentUser;
    }


    logout = () => {
        Alert.alert("Confirm", "Are you sure you want to logout?", [
            {text: "No"},
            {
                text: "Yes",
                onPress: async () => {
                    await firebase.auth().signOut();
                    this.props.navigation.navigate('Auth');
                }
            }
        ])
    };

    openUserMenu = () => {
        this.props.navigation.navigate('Option', {
            buttons: [
                {
                    text: 'View Profile',
                    extra: () => <CustomIcon name="person" family="MaterialIcons"/>
                },
                {
                    text: 'Logout',
                    onPress: () => this.logout(),
                    extra: () => <CustomIcon name="logout" family="MaterialCommunityIcons"/>
                }
            ]
        })
    };

    onUserSearchSelect = user => {
        this.props.navigation.navigate('UserProfile', {user});
    };

    createMessage = (users, userRef) => {
        let firestore = firebase.firestore();
        users = users.map(user => {
            let ref = firestore.collection('Users').doc(user.id);
            return ref;
        });
        this.props.navigation.goBack(null);
        this.props.navigation.navigate('Message', {users: [...users, userRef]});
    };

    renderHeader = () => {
        let userAuth = firebase.auth().currentUser;
        let userRef = firebase.firestore().collection('Users').doc(userAuth.uid);
        let avatarSize = 30;
        let {routes, index} = this.state;
        let title = displayName;
        let rightIcons;
        switch (index) {
            case 0:
                title = displayName;
                rightIcons = (
                    <Button transparent onPress={() => this.props.navigation.navigate('UserSearch', {
                        all: false,
                        multi: true,
                        title: 'Select Users',
                        onSubmit: users => this.createMessage(users, userRef)
                    })}>
                        <Icon name='message-plus' type="MaterialCommunityIcons"/>
                    </Button>
                );
                break;
            case 1:
                title = 'Contacts';
                rightIcons = (
                    <Button transparent onPress={() => this.props.navigation.navigate('UserSearch', {
                        all: true,
                        title: 'Search user',
                        onSubmit: this.onUserSearchSelect
                    })}>
                        <Icon name='md-search' type="Ionicons"/>
                    </Button>
                );
                break;
            case 2:
                title = 'Profile';
                break;
        }
        return (
            <Header>
                <Left style={{flex: null}}>
                    {index === 0 ? (
                        <Touchable
                            onPress={this.openUserMenu}
                            style={{
                                width: avatarSize,
                                height: avatarSize,
                                borderRadius: avatarSize / 2,
                                elevation: 3,
                                marginRight: 7.5,
                                backgroundColor: theme.color.primary
                            }}>
                            <FireStoreAvatar
                                user={userRef}
                                style={{width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2,}}
                                iconProps={{color: '#fff', size: 30}}/>
                        </Touchable>
                    ) : null}
                </Left>
                <Body>
                <Title>{title}</Title>
                </Body>
                <Right>
                    {rightIcons}
                </Right>
            </Header>
        )
    };

    render() {
        let props = this.props;
        let {routes, index, user} = this.state;
        return (
            <SafeAreaView style={{flex: 1}}>
                {this.renderHeader()}
                <TabView
                    swipeDistanceThreshold={Dimensions.get('window').width / 2}
                    ref={e => this.tabView = e}
                    navigationState={this.state}
                    renderScene={(props) => {
                        this.position = props.position;
                        let route = props.route;
                        switch (route.key) {
                            case 'first':
                                return <Messages {...props} {...this.props} />;
                            case 'second':
                                return <Contacts {...props} activated={this.state.contactsActivated}
                                                 navigation={this.props.navigation}/>;
                            case 'third':
                                let userRef;
                                if (this.userAuth)
                                    userRef = firebase.firestore().collection('Users').doc(this.userAuth.uid);
                                return <Profile {...props} activated={index === 2} logout={this.logout}
                                                user={userRef}/>;
                            default:
                                return null;
                        }
                    }}
                    tabBarPosition="bottom"
                    indicatorStyle={{
                        backgroundColor: '#fff'
                    }}
                    renderTabBar={(data) => {
                        return null;
                    }}
                    onIndexChange={index => {
                        if (index === 1 && !this.state.contactsActivated)
                            this.setState({contactsActivated: true});
                        this.setState({index});
                    }}
                    initialLayout={{height: 0, width: Dimensions.get('window').width}}
                    useNativeDriver
                />
                <BottomFooter index={index} onItemPress={index => {
                    let key;
                    switch (index) {
                        case 0:
                            key = 'first';
                            break;
                        case 1:
                            key = 'second';
                            break;
                        case 2:
                            key = 'third';
                            break;
                    }
                    if (key)
                        this.tabView._jumpTo(key);
                }}/>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state) => {
    //const {} = state;
    const props = {};
    return props;
};

const mapDispatchToProps = (dispatch) => {
    const actions = {};
    const actionMap = {
        actions: bindActionCreators(actions, dispatch)
    };
    return actionMap;
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);