import React from 'react'
import {View, 
        Text, 
        TouchableOpacity, 
        SafeAreaView,
        Platform,
        } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { GiftedChat ,Actions} from 'react-native-gifted-chat'

import * as actions from '../../actions'
import CustomActions from './Chat/CustomActions';

import {makeUidState, 
        makeProfileState, 
        makeFriendsState, 
        makePresencesState,
        makeIsConnectedState} from '../../reselect'

class ChatPage extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
        headerTintColor: 'white',
        tabBarVisible: false,
        headerStyle: {
            backgroundColor: 'rgba(186, 53, 100, 1.0)',
        },
        headerRight: (
            <TouchableOpacity
                style={{paddingRight:10}}
                onPress={() => {
                    const { params = {} } = navigation.state
                    params.handleHeaderRight()
                } }>
                <Icon name="video" size={20} color={'white'} />
            </TouchableOpacity>
          ),
    });

    state = {
        messages: [],
    }

    constructor(props){
        super(props)
    }
    
    componentWillMount() {
      const { navigation } = this.props;
      const params = navigation.getParam('params', null);
      console.log(params)

      if(params.type == 'private'){

      }else if(params.type == 'group'){

      }else{
        // if type not private, group 
        this.props.navigation.goBack(null);
      }


      // this.setState({
      //     messages: require('./Chat/messages.js'),
      // })
      // this.props.navigation.setParams({ 
      //     handleHeaderRight: this.handleHeaderRight,
      // })
    }
    
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

const mapStateToProps = (state, ownProps) => {
  // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
  //_persist.rehydrated parameter is initially set to false
  if(!state._persist.rehydrated){
    return {}
  }

  if(!state.auth.isLogin){
    return;
  }

  return{
    uid:makeUidState(state, ownProps),
    profile:makeProfileState(state, ownProps),
    friends:makeFriendsState(state, ownProps),
    presences:makePresencesState(state, ownProps),
    is_connected: makeIsConnectedState(state, ownProps),
  }
}
export default connect(mapStateToProps, actions)(ChatPage);