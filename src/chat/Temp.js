import React, {Component} from 'react';
import {Container, Text, Button} from '../components';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {messages} from '../actions';
import firebase from "react-native-firebase";

class Temp extends Component {
    async componentDidMount() {
        await this.props.actions.messages.list();
        await this.props.actions.messages.list(this.props.messages.items[this.props.messages.items.length-1]);
        await this.props.actions.messages.list(this.props.messages.items[this.props.messages.items.length-1]);
        await this.props.actions.messages.list(this.props.messages.items[this.props.messages.items.length-1]);
        await this.props.actions.messages.list(this.props.messages.items[this.props.messages.items.length-1]);
        await this.props.actions.messages.list(this.props.messages.items[this.props.messages.items.length-1]);
        await this.props.actions.messages.list(this.props.messages.items[this.props.messages.items.length-1]);
    }

    render() {
        let arr = this.props.messages.items.map(item => item.data()._id);
        arr.sort();
        return (
            <Container style={{paddingTop: 50}}>
                <Button onPress={() => this.props.navigation.goBack()}>
                    <Text>Back</Text>
                </Button>
                <Text>{JSON.stringify(arr, null, 2)}</Text>
            </Container>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(Temp);