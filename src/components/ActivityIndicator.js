import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator as ActivityIndicatorLib} from 'react-native';
import {theme} from './';

class ActivityIndicator extends PureComponent {
    render() {
        return (
            <ActivityIndicatorLib color={theme.color.primary} size="large" {...this.props}/>
        );
    }
}

ActivityIndicator.propTypes = {};

export default ActivityIndicator;