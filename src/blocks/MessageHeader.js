import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Container, Header, Left, Body, Right, Button, Icon, Title} from 'native-base';
import {Avatar, Text, Touchable} from "../components";
import {Platform, View} from "react-native";

class MessageHeader extends PureComponent {
    render() {
        let {groupDetails, navigation, openChatOptions} = this.props;
        let avatarSize = 30;
        return (
            <Header>
                <Left style={groupDetails ? {flex: null} : null}>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name='arrow-back'/>
                    </Button>
                </Left>
                <Body>
                {groupDetails ? (
                    <Touchable style={{alignItems: 'center', flexDirection: 'row'}} onPress={navigation.goBack}>
                        <View
                            style={{
                                width: avatarSize,
                                height: avatarSize,
                                borderRadius: avatarSize / 2,
                                elevation: 3,
                                marginRight: 5
                            }}>
                            <Avatar source={groupDetails ? {uri: groupDetails.groupImage} : null}
                                    style={{width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2}}/>
                        </View>
                        <Text style={{color: '#fff'}} sizePercentage={120}>{groupDetails.groupName}</Text>
                    </Touchable>
                ) : (
                    <Title>Message</Title>
                )}
                </Body>
                <Right>
                    <Button transparent onPress={openChatOptions}>
                        <Icon name='more'/>
                    </Button>
                </Right>
            </Header>
        );
    }
}

MessageHeader.propTypes = {};

export default MessageHeader;