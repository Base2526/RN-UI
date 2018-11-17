import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5';
import Styles from '../../styles';

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
    componentDidMount () {
        this.props.navigation.setParams({ handleHeaderRight: this.handleHeaderRight })
    }

    handleHeaderRight = () => {
        alert('handleHeaderRight')
    }

    render(){
        return(<View><Text>Chat Page</Text></View>)
    }
}