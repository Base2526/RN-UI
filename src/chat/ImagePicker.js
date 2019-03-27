import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import PhotoGrid from 'react-native-image-grid';
import {View, CameraRoll, Image, Dimensions, Platform} from 'react-native';
import {Container, Text, Icon, Touchable, theme} from '../components';
import {SafeAreaView} from 'react-navigation';

class ImagePicker extends PureComponent {
    state = {images: [], selectedImages: [], columns: 3, width: Dimensions.get('window').width};

    componentDidMount() {
        this.fetchData();
        this.multiple = this.props.navigation.getParam('multiple', false);
    }

    fetchData = async (page = 1) => {
        let cameraRollOptions = {
            first: 20,
            assetType: 'All'
        };

        if (Platform.OS === 'ios')
            cameraRollOptions.groupTypes = 'All';

        let response = await CameraRoll.getPhotos(cameraRollOptions);
        let page_info = response.page_info;
        let images = this.state.images;
        images = images.concat(response.edges);
        this.setState({images}, () => {
            if (page_info.has_next_page) {

            }
        });
    };

    getIndex = (item) => {
        let {selectedImages} = this.state;
        let index = -1;
        let currentUri = item.node.image.uri;
        selectedImages.map((data, i) => {
            if (currentUri === data.node.image.uri)
                index = i;
        });
        return index;
    };

    selectImage = (item) => {
        let selectedIndex = this.getIndex(item);
        let selected = selectedIndex >= 0;
        let multiple = this.multiple;
        let {selectedImages} = this.state;
        if (!multiple) {
            selectedImages = [];
        }
        if (selected)
            selectedImages.splice(selectedIndex, 1);
        else
            selectedImages = selectedImages.concat([item]);
        this.setState({selectedImages: [...selectedImages]});
    };

    renderItem = (item, itemSize, itemPaddingHorizontal) => {
        let {isLandscape} = this.state;
        let index = this.getIndex(item);
        let isSelected = index >= 0;
        let minusSize = isLandscape ? 3 : 5;
        const shadowOpt = {
            width: 100,
            height: 100,
            color: "#000",
            border: 2,
            radius: 3,
            opacity: 0.2,
            x: 0,
            y: 3,
            style: {marginVertical: 5}
        };
        let indicatorSize = 30;
        return (
            <Touchable
                key={item.node.image.uri}
                style={{
                    width: itemSize - minusSize,
                    height: itemSize - minusSize,
                    paddingHorizontal: itemPaddingHorizontal
                }}
                onPress={() => {
                    this.selectImage(item);
                }}>
                <View style={{flex: 1}}>
                    <Image
                        resizeMode="cover"
                        style={{flex: 1}}
                        source={{uri: item.node.image.uri}}
                    />
                    {this.multiple ? (
                        <View style={{
                            width: indicatorSize,
                            height: indicatorSize,
                            borderWidth: 2,
                            borderColor: '#fff',
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            borderRadius: indicatorSize / 2,
                            elevation: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: index >= 0 ? theme.color.primary : null
                        }}>
                            {index >= 0 ? <Text style={{color: '#fff', fontWeight: '700'}}>{index + 1}</Text> : null}
                        </View>
                    ) : null}
                </View>
            </Touchable>
        )
    };

    render() {
        let selectedImages = this.state.selectedImages;
        let columns = this.state.columns;
        return (
            <SafeAreaView style={{flex: 1}} onLayout={() => {
                let width = Dimensions.get('window').width;
                let height = Dimensions.get('window').height;
                let isLandscape = width > height;
                this.setState({columns: isLandscape ? 5 : 3, isLandscape});
            }}>
                <Container>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Touchable style={{padding: 20}} onPress={() => this.props.navigation.goBack()}>
                            <Icon name="close" type="MaterialIcons"/>
                        </Touchable>
                        <Text sizePercentage={110}>Select Image</Text>
                        <Touchable style={{padding: 20, flexDirection: 'row'}}
                                   onPress={() => this.props.navigation.goBack()}>
                            {selectedImages.length > 0 ? (
                                <Text sizePercentage={110}
                                      style={{fontWeight: '700', marginRight: 3}}>({selectedImages.length})</Text>
                            ) : null}
                            <Icon name="check" type="MaterialIcons"/>
                        </Touchable>
                    </View>
                    <PhotoGrid
                        data={this.state.images}
                        itemsPerRow={columns}
                        itemMargin={0}
                        itemPaddingHorizontal={4}
                        // renderHeader = { this.renderHeader }
                        renderItem={this.renderItem}
                    />
                </Container>
            </SafeAreaView>
        );
    }
}

ImagePicker.defaultProps = {};

ImagePicker.propTypes = {};

export default ImagePicker;