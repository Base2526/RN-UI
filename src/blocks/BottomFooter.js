import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Footer, FooterTab, Button, Icon} from 'native-base';

class BottomFooter extends PureComponent {
    render() {
        let {index, onItemPress} = this.props;
        onItemPress = onItemPress || (() => {
        });
        return (
            <Footer>
                <FooterTab>
                    <Button active={index === 0} onPress={() => onItemPress(0)}>
                        <Icon name="message-circle" type="Feather"/>
                    </Button>
                    <Button active={index === 1} onPress={() => onItemPress(1)}>
                        <Icon active name="people"/>
                    </Button>
                    <Button active={index === 2} onPress={() => onItemPress(2)}>
                        <Icon name="person"/>
                    </Button>
                </FooterTab>
            </Footer>
        );
    }
}

BottomFooter.propTypes = {};

export default BottomFooter;