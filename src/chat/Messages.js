//Created By: Randolf Joshua Diezmo - joshuadiezmo@gmail.com

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {groups} from '../actions';
import {FlatList, View} from 'react-native';
import {Container, ActivityIndicator, Text, Touchable} from '../components';
import MessagePreview from '../blocks/MessagePreview';

class Messages extends Component {
    state = {
        users: []
    };

    componentDidMount() {
        this.props.actions.groups.list();
    }

    listItemPress = (group) => {
        this.props.navigation.navigate('Message', {group});
    };

    dynamicSort = (property) => {
        let sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            a = a.data();
            b = b.data();
            let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    };

    render() {
        let items = this.props.groups.items;
        items.sort(this.dynamicSort('-updatedTimeStamp'));
        return (
            <Container style={{padding: 0}}>
                {
                    !this.props.groups.loading && items.length > 0 ? (
                        <FlatList
                            extraData={JSON.stringify({
                                itemLength: items.length,
                                groupNames: items.map(item => item.data().name)
                            })}
                            keyExtractor={(item, index) => (item.id + "-" + index + "-group-list-item")}
                            data={items}
                            renderItem={({item,index}) => <MessagePreview index={index} group={item}
                                                                    onItemPress={() => this.listItemPress(item)}/>}
                        />
                    ) : this.renderLoadingOrNone()
                }
            </Container>
        );
    }

    renderLoadingOrNone() {
        if (this.props.groups.loading)
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator/>
                </View>
            );
        else if (this.props.groups.items.length <= 0)
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text sizePercentage={150}>No messages yet.</Text>
                </View>
            );
        else
            return null;
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    const {groups} = state;
    const props = {groups};
    return props;
};

const mapDispatchToProps = (dispatch) => {
    const actions = {};
    const actionMap = {
        actions: {
            ...bindActionCreators(actions, dispatch),
            groups: bindActionCreators(groups, dispatch)
        }
    };
    return actionMap;
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);