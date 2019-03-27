import React, { Component } from 'react';
import { ThemeContext } from './ThemeContext';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIconsIcon from 'react-native-vector-icons/SimpleLineIcons';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import ZocialIcon from 'react-native-vector-icons/Zocial';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const configs = (family, size, color, inverted, Icon) => {
    let ComponentIcon = FontAwesomeIcon;
    switch (family) {
        case 'SimpleLineIcons':
            ComponentIcon = SimpleLineIconsIcon;
            break;
        case 'FontAwesome5':
            ComponentIcon = FontAwesome5Icon;
            break;
        case 'Ionicons':
            ComponentIcon = IoniconsIcon;
            break;
        case 'Zocial':
            ComponentIcon = ZocialIcon;
            break;
        case 'Entypo':
            ComponentIcon = EntypoIcon;
            break;
        case 'AntDesign':
            ComponentIcon = AntDesignIcon;
            break;
        case 'MaterialCommunityIcons':
            ComponentIcon = MaterialCommunityIconsIcon;
            break;
        case 'MaterialIcons':
            ComponentIcon = MaterialIconsIcon;
            break;

    }
    let themeColor = inverted ? Icon.colorInverted : Icon.color;
    size = size || Icon.size || 20;
    color = color || themeColor || '#000';
    return { ComponentIcon, size, color };
}

class Icon extends Component {
    static contextType = ThemeContext;
    static getImageSource = async ({ name, size = 20, color, inverted, family = 'FontAwesome' }) => {
        let theme = ThemeContext._currentValue || {}
        let Icon = theme.Icon || {};
        try {
            if (!name)
                throw new Error('Name is required');
            let configsData = configs(family, size, color, inverted, Icon);
            let ComponentIcon = configsData.ComponentIcon;
            size = configsData.size;
            color = configsData.color;
            let source = await ComponentIcon.getImageSource(name, size, color);
            return source;
        } catch (err) {
            throw err;
        }
    }
    render() {
        let theme = this.context || {}
        let Icon = theme.Icon || {};
        let { inverted, family } = this.props;
        let configsData = configs(family || 'FontAwesome', this.props.size, this.props.color, inverted, Icon);
        let ComponentIcon = configsData.ComponentIcon;
        return (<ComponentIcon
            {...configsData}
            name={this.props.name}
            style={{
                ...(Icon.style || {}),
                ...(this.props.style || {})
            }} />);
    }
}

export default Icon;