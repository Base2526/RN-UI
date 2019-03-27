import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Image} from 'react-native';
import {Icon} from '../components';

class Avatar extends PureComponent {
    state = {};

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        let userIcon = await Icon.getImageSource({name: 'user', family: 'Entypo', size: 30,...(this.props.iconProps||{})});
        this.setState({userIcon});
    };

    render() {
        let {userIcon} = this.state;
        return (
            <Image {...this.props} source={this.props.source || userIcon}/>
        );
    }
}

Avatar.propTypes = {};

export default Avatar;