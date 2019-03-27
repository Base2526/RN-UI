import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Icon} from '../components';

class FileTypeIcon extends PureComponent {
    iconProps = () => {
        let {fileType, color} = this.props;
        let name = 'insert-drive-file';
        let family = 'MaterialIcons';
        switch (fileType) {
            case 'application/pdf':
                name = "file-pdf";
                family = "MaterialCommunityIcons";
                break;
            case 'application/zip':
                name = "zip-box";
                family = "MaterialCommunityIcons";
                break;
        }

        if (/image\//.test(fileType)) {
            name = "file-image";
            family = "MaterialCommunityIcons";
        }

        return {name, family, color};
    };

    render() {
        return (
            <Icon {...this.iconProps()} size={15}/>
        );
    }
}

FileTypeIcon.propTypes = {};

export default FileTypeIcon;