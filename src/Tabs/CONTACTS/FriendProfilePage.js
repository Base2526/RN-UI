import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'

import Styles from '../../styles';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class FriendProfilePage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "Friend Profile",
        // tabBarVisible: false,
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
                    // const { params = {} } = navigation.state
                    // params.handleHeaderRight()
                    navigation.navigate("ChatPage")
                } }>
                <Icon name="comments" size={20} />
            </TouchableOpacity>
          ),
    });

    constructor(props){
        super(props)
        console.log(props)
    }

    render(){
        return(<View><Text>Friend Profile Page</Text></View>)
    }
}