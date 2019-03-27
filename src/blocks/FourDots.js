import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';
import {theme} from '../components';

class FourDots extends PureComponent {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.dotsContainer}>
                    <View style={styles.dots}/>
                    <View style={styles.dots}/>
                </View>
                <View style={styles.dotsContainer}>
                    <View style={styles.dots}/>
                    <View style={styles.dots}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        margin: 11,
        marginBottom: 7,
        marginLeft: 10,
        marginRight: 5,
        justifyContent: 'flex-start'
    },
    dotsContainer: {
        flexDirection: 'row',
        flex: 1,
        width: 23,
    },
    dots: {
        width: 7,
        height: 7,
        backgroundColor: theme.color.primary,
        margin: 2.5,
        borderRadius: 10,
    }
});

FourDots.propTypes = {};

export default FourDots;