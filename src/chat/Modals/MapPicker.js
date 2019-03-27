import React, {PureComponent} from 'react';
import {Animated, AsyncStorage, Alert} from 'react-native';
import MapView, {AnimatedRegion, Animated as MapAnimated, Marker} from 'react-native-maps';
import {Container, Header, Title, Content, Button, Icon, Left, Body, Text, Right} from "native-base";
import ModalBase from "./ModalBase";
import Toast from './Toast';
import {LOCATION} from '../../helpers/Permissions';

class MapPicker extends ModalBase {
    state = {
        ...this.state,
        region: new AnimatedRegion({
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        })
    };

    componentDidMount() {
        try {
            let params = this.props.navigation.state.params;
            let onLocationSelect = params.onLocationSelect || [];
            this.onLocationSelect = onLocationSelect;
        } catch (err) {

        }
        super.componentDidMount();
        this.fetchLocation();
    }

    fetchLocation = async () => {
        try {
            let locationKey = '@DNAChat:location';
            let lastReg = await AsyncStorage.getItem(locationKey);
            if (lastReg !== null) {
                this.setState({
                    region: new AnimatedRegion(JSON.parse(lastReg)),
                    error: null,
                });
            }
            await LOCATION();
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    let reg = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    };
                    if (!this.state.region) {
                        this.setState({
                            region: new AnimatedRegion(JSON.parse(reg)),
                            error: null,
                        });
                    }
                    try {
                        await AsyncStorage.setItem(locationKey, JSON.stringify(reg));
                    } catch (err) {
                        console.log(err.message);
                    }
                },
                (error) => this.setState({error: error.message}),
                {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
            );
        } catch (err) {
            if (this.toast && this.toast.show)
                this.toast.show(err.message);
        }
    };

    onRegionChange = (region) => {
        this.state.region.setValue(region);
    };

    onMapPress = e => {
        this.setState({marker: e.nativeEvent.coordinate});
    };

    render() {
        let {animatedValue, marker} = this.state;

        return (
            <Animated.View style={{
                flex: 1,
                opacity: animatedValue,
                transform: [
                    {
                        translateY: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [190, 0]
                        })
                    }
                ]
            }}>
                <Header>
                    <Left>
                        <Button transparent onPress={this.back}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    </Body>
                    <Right>
                        {marker ? (
                            <Button transparent onPress={() => {
                                Alert.alert(null, "Are you sure you want to send this location?", [
                                    {text: 'No'},
                                    {
                                        text: 'Yes',
                                        onPress: () => {
                                            this.props.navigation.goBack();
                                            if (this.onLocationSelect) {
                                                this.onLocationSelect(marker, 'Location address');
                                            }
                                        }
                                    }
                                ])
                            }}>
                                <Icon name="check" type="MaterialCommunityIcons"/>
                            </Button>
                        ) : null}
                    </Right>
                </Header>
                <MapAnimated
                    style={{flex: 1}}
                    region={this.state.region}
                    onRegionChange={this.onRegionChange}
                    onPress={this.onMapPress}
                >
                    {
                        marker ? (
                            <Marker coordinate={marker}/>
                        ) : null
                    }
                </MapAnimated>
                <Toast ref={e => this.toast = e}/>
            </Animated.View>
        );
    }
}

MapPicker.propTypes = {};

export default MapPicker;