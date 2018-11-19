import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5';
import Styles from '../../styles';

import { GiftedChat } from 'react-native-gifted-chat'

export default class ChatPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "Contacts",
        tabBarVisible: false,
        // headerLeft: (
        //     <TouchableOpacity
        //         style={Styles.headerButton}
        //         onPress={() => navigation.openDrawer()}>
        //         <Icon name="bars" size={25} />
        //     </TouchableOpacity>
        // ),
        headerRight: (
            <TouchableOpacity
                style={Styles.headerButton}
                onPress={() => {
                    const { params = {} } = navigation.state
                    params.handleHeaderRight()
                } }>
                <Icon name="video" size={20} />
            </TouchableOpacity>
          ),
    });

    state = {
        messages: [],
    }
    
    componentWillMount() {
        this.setState({
            messages: [
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
                },
            },
            ],
        })
    }
    
    // componentDidMount () {
    //     this.props.navigation.setParams({ handleHeaderRight: this.handleHeaderRight })
    // }

    onSend(messages = []) {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    handleHeaderRight = () => {
        alert('handleHeaderRight')
    }

    render(){
        // return(<View><Text>Chat Page</Text></View>)
        return (
            <GiftedChat
              messages={this.state.messages}
              onSend={messages => this.onSend(messages)}
              user={{
                _id: 1,
              }}
            />
        )
    }
}