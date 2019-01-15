import React from 'react'
import {View, 
        Text, 
        TouchableOpacity, 
        SafeAreaView,
        Platform,
        } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5';
import Styles from '../../styles';

import { GiftedChat ,Actions} from 'react-native-gifted-chat'

import CustomActions from './Chat/CustomActions';

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
                style={{paddingRight:10}}
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

    // 
    constructor(props){
        super(props)
    }
    
    componentWillMount() {
        this.setState({
            // messages: [
            // {
            //     _id: 1,
            //     text: 'Hello developer',
            //     createdAt: new Date(),
            //     user: {
            //     _id: 2,
            //     name: 'React Native',
            //     avatar: 'https://placeimg.com/140/140/any',
            //     },
            // },
            // ],
            messages: require('./Chat/messages.js'),
        })

        this.props.navigation.setParams({ 
            handleHeaderRight: this.handleHeaderRight,
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

    renderCustomActions(props) {
        // if (Platform.OS === 'ios') {
          return (
            <CustomActions
              {...props}
            />
          );
        // }
        const options = {

          'Action 1': (props) => {
            alert('option 1');
          },
          'Action 2': (props) => {
            alert('option 2');
          },
          'Cancel': () => {},
        };
        return (
          <Actions
            {...props}
            options={options}
          />
        );
      }

    render(){
        // return(<View><Text>Chat Page</Text></View>)
        return (
            <SafeAreaView style={{flex:1}}>
                <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: 1,
                }}

                renderActions={this.renderCustomActions}
                />
            </SafeAreaView>
        )
    }
}