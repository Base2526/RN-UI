import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {Touchable, Text, Icon} from "../../components";

class MuteOption extends PureComponent {
    cancel = () => {
        this.props.navigation.goBack();
    };

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Touchable style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#000',
                    opacity: .5
                }} onPress={this.cancel}/>
                <View style={{backgroundColor: '#fff', elevation: 3, borderRadius: 2, padding: 5}}>
                    <Touchable style={{padding: 10, flexDirection: 'row'}}>
                        <Icon name={"circle-outline"}
                              family="MaterialCommunityIcons"/>
                        <Text style={{marginLeft: 5}}>1 Hour</Text>
                    </Touchable>
                    <Touchable style={{padding: 10, flexDirection: 'row'}}>
                        <Icon name={"circle-slice-8"}
                              family="MaterialCommunityIcons"/>
                        <Text style={{marginLeft: 5}}>5 Hours</Text>
                    </Touchable>
                    <Touchable style={{padding: 10, flexDirection: 'row'}}>
                        <Icon name={"circle-outline"}
                              family="MaterialCommunityIcons"/>
                        <Text style={{marginLeft: 5}}>8 Hours</Text>
                    </Touchable>
                </View>
            </View>
        );
    }
}

MuteOption.propTypes = {};

export default MuteOption;
