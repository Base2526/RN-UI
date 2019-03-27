import React from 'react'
import {GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import Send from '../blocks/Send';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {messages} from '../actions';
import {SafeAreaView} from 'react-navigation';
import firebase from 'react-native-firebase';
import {BackHandler, Keyboard, View, Alert, Platform} from 'react-native';
import ChatActions from '../blocks/ChatActions';
import ChatMediaItems from '../blocks/ChatMediaItems';
import Bubble from '../blocks/Bubble';
import {Touchable, Text, Avatar, Icon, ActivityIndicator} from '../components';
import RNFetchBlob from 'rn-fetch-blob';
import FireStoreAvatar from "../blocks/FireStoreAvatar";
import MessageHeader from "../blocks/MessageHeader";
import {getImage, getName} from "../helpers/group";
import ChatComposer from "../blocks/ChatComposer";
import ChatTools from "../blocks/ChatTools";

class Message extends React.Component {
    onScroll = false;
    _didFocusSubscription;
    _willBlurSubscription;

    static navigationOptions = ({navigation}) => ({
        header: null,
    });

    constructor(props) {
        super(props);
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
        const {navigation} = this.props;
        const group = navigation.getParam('group');

        this.state = {
            localImages: [],
            page: 1,
            messageLoading: true,
            textFocused: false,
            messageValue: '',
            group,
            showChatTools: false
        };
    }

    openChatOptions = () => {
        let group = this.state.group;
        if (group) {
            this.props.navigation.navigate('Option', {
                buttons: [
                    {
                        text: 'Add Member',
                        extra: () => <Icon family="MaterialIcons" name="group-add"/>,
                        backOnPress: true,
                        onPress: () => {
                            this.props.navigation.navigate('UserSearch', {
                                backOnSubmit: true,
                                except: group.data().Users,
                                multi: true,
                                onSubmit: selectedUsers => {
                                    selectedUsers = selectedUsers.map(user => {
                                        let userDoc = firebase.firestore().collection('Users').doc(user.id);
                                        return userDoc;
                                    });
                                    let users = group.data().Users;
                                    selectedUsers.map(u => {
                                        let index = -1;
                                        index = users.map(user => user.id).indexOf(u.id);
                                        if (index >= 0) {
                                            users.splice(index, 1);
                                        }
                                    });
                                    users = [...users, ...selectedUsers];
                                    group.ref.update({
                                        Users: users,
                                        updatedTimeStamp: firebase.firestore.FieldValue.serverTimestamp()
                                    });
                                    this.onSend([
                                        {
                                            text: selectedUsers.length + " User" + (selectedUsers.length > 1 ? 's' : "") + " added to this group.",
                                            isSystemMessage: true,
                                            data: {
                                                type: 'USER_ADDED',
                                                users: selectedUsers
                                            }
                                        }
                                    ], group);
                                    this.setState({group});
                                }
                            })
                        },
                    }, {
                        text: 'Search',
                        extra: () => <Icon family="MaterialCommunityIcons" name="comment-search"/>
                    }, {
                        text: 'Mute chat',
                        extra: () => <Icon family="MaterialCommunityIcons" name="volume-mute"/>,
                        backOnPress: true,
                        onPress: this.mute
                    }, {
                        text: 'Block',
                        extra: () => <Icon family="MaterialIcons" name="block"/>
                    }
                ]
            });
        }
    };

    mute = () => {
        this.props.navigation.navigate('MuteOption');
    };

    temp = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), 100);
        })
    };

    fetchData = async (group) => {
        let {messages} = this.props.actions;
        await messages.list(group);
        setTimeout(() => this.setState({animate: true}), 1000);
        messages.subscribe(group);
        this.fetchGroupData(group);
        this.setState({group});
    };

    componentDidMount() {
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
        const {navigation} = this.props;
        const group = navigation.getParam('group');
        const users = navigation.getParam('users');
        if (group)
            this.fetchData(group);
        else if (users)
            this.fetchGroupByUser(users);
    }

    fetchGroupData = async (group) => {
        try {

            let groupName = await getName(group);
            let groupImage = await getImage(group);
            this.setState({groupDetails: {groupName, groupImage}});
        } catch (err) {
            Alert.alert("Error", err.message);
        }
    };


    fetchGroupByUser = async users => {
        try {
            let query = firebase
                .firestore()
                .collection('Groups')
                .where('Users', 'array-contains', users[0]);
            let data = await query.get();
            let docs = data.docs;
            let group;
            docs.map(doc => {
                let {Users} = doc.data();
                if (Users.length === users.length) {
                    let ifAllExists = true;
                    users.map(user => {
                        let index = Users.map(u => u.id).indexOf(user.id);
                        if (index < 0)
                            ifAllExists = false;
                    });
                    if (ifAllExists)
                        group = doc;
                }
            });
            if (group)
                this.fetchData(group);
            else
                this.createGroup(users);
        } catch (err) {
            Alert.alert("Error", err.message);
        }
    };

    createGroup = async Users => {
        try {
            let group = firebase.firestore().collection('Groups').doc();
            await group.set({
                Users,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            group = await group.get();
            this.fetchData(group);
        } catch (err) {
            Alert.alert("Error", err.message);
        }
    };

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    onBackButtonPressAndroid = () => {
        if (this.state.showChatMediaItems === true) {
            this.setState({showChatMediaItems: false});
            return true;
        } else {
            return false;
        }
    };

    isImageExists = data => {
        let localImages = this.state.localImages || [];
        let uri;
        localImages.map(message => {
            if (message._id === data._id && data.image) {
                uri = message.image;
            }
        });
        return uri;
    };

    onSend(messages = [], group) {
        const {navigation} = this.props;
        group = group || this.state.group;
        let currentUser = firebase.auth().currentUser;
        let userDoc = firebase.firestore().collection('Users').doc(currentUser.uid);
        messages = messages.map(message => ({
            ...message,
            user: userDoc
        }));
        messages.map(message => {
            group.ref.update({updatedTimeStamp: firebase.firestore.FieldValue.serverTimestamp()});
            message._id = message._id || this.uuidv4();
            let ref = group.ref.collection("Messages").doc(message._id);
            ref.set({
                ...message,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                user: userDoc
            });
        });
        // this.setState(previousState => ({
        //     messages: GiftedChat.append(previousState.messages, messages),
        // }))
    }

    mediaActionClick = () => {
        let showChatMediaItems = this.state.showChatMediaItems;
        if (!showChatMediaItems) {
            this.setState({showChatTools: false});
        }
        this.setState({showChatMediaItems: !showChatMediaItems});
    };

    uuidv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    onMomentumScrollBegin = () => {
        this.onScroll = true;
    };

    render() {
        const {navigation} = this.props;
        let {showChatMediaItems, textFocused, messageValue, group, groupDetails, showChatTools, animate} = this.state;
        let currentUser = firebase.auth().currentUser;
        let messages = Object.assign({}, this.props.messages);
        if (group)
            return (
                <SafeAreaView style={{flex: 1}}>
                    <MessageHeader navigation={this.props.navigation} groupDetails={groupDetails}
                                   openChatOptions={this.openChatOptions}/>
                    <GiftedChat
                        renderAvatar={(props) => {
                            return <FireStoreAvatar user={props.currentMessage.user.data} style={{
                                width: 37,
                                height: 36,
                                borderRadius: 36 / 2,
                                backgroundColor: '#eee',
                                resizeMode: 'cover'
                            }}/>
                        }}
                        messages={(messages.items[group.id] || []).map(doc => {
                            let data = typeof doc.data === 'function' ? doc.data() : doc;
                            return {
                                ...data,
                                createdAt: data.createdAt || new Date(),
                                user: {
                                    _id: data.user.id,
                                    data: data.user
                                }
                            };
                        })}
                        onSend={messages => this.onSend(messages)}
                        user={{
                            _id: currentUser._user.uid,
                        }}
                        renderActions={() => (
                            <ChatActions
                                group={group}
                                textFocused={textFocused}
                                mediaActive={showChatTools}
                                onShowActionsPress={() => Keyboard.dismiss()}
                                onClickMedia={() => {
                                    if (!showChatTools) {
                                        this.setState({showChatMediaItems: false});
                                    }
                                    this.setState({showChatTools: !showChatTools})
                                }}
                                navigation={this.props.navigation}
                            />
                        )}
                        renderBubble={(data) => (
                            <Bubble data={data} navigation={this.props.navigation} animate={animate}/>)}
                        textInputProps={{
                            onFocus: () => this.setState({showChatMediaItems: false, textFocused: true}),
                            onBlur: () => this.setState({textFocused: false})
                        }}
                        renderSend={props => (
                            <Send sendProps={props}
                                  group={group}
                                  navigation={this.props.navigation}
                                  messageValue={messageValue}
                                  onSend={this.onSend}
                                  showChatMediaItems={showChatMediaItems}/>
                        )}
                        maxComposerHeight={100}
                        renderComposer={props => <ChatComposer composerProps={props}
                                                               mediaActionClick={this.mediaActionClick}
                                                               showChatMediaItems={showChatMediaItems}/>}
                        onInputTextChanged={messageValue => {
                            this.setState({messageValue});
                        }}
                        placeholder={textFocused ? 'Type a message...' : 'Aa'}
                        renderInputToolbar={props => <InputToolbar {...props} containerStyle={{borderTopWidth: 0}}/>}
                        listViewProps={{
                            onEndReached: async () => {
                                if (!this.props.messages.loading) {
                                    let items = this.props.messages.items[group.id] || [];
                                    await this.props.actions.messages.list(group, items[items.length - 1]);
                                }
                            }
                        }}
                        imageStyle={{
                            width: 120 + 50,
                            height: 120,
                            // margin: 0,
                            // marginBottom: 3,
                            // borderRadius: 0,
                            // borderTopLeftRadius: 13,
                            // borderTopRightRadius: 3,
                        }}
                    />
                    <ChatMediaItems
                        group={group}
                        show={showChatMediaItems}
                    />
                    <ChatTools show={showChatTools} navigation={this.props.navigation}
                               onSend={data => this.onSend(data)}/>
                </SafeAreaView>
            );
        else {
            return (
                <View style={{flex: 1}}>
                    <MessageHeader navigation={this.props.navigation} groupDetails={groupDetails}
                                   openChatOptions={this.openChatOptions}/>
                    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                        <ActivityIndicator/>
                    </View>
                </View>
            )
        }
    }
}

const mapStateToProps = (state) => {
    const {messages} = state;
    const props = {messages};
    return props;
};

const mapDispatchToProps = (dispatch) => {
    const actions = {};
    const actionMap = {
        actions: {
            ...bindActionCreators(actions, dispatch),
            messages: bindActionCreators(messages, dispatch)
        }
    };
    return actionMap;
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);
