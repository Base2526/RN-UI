const color = {
    "primary": "#1976d2",
    "primaryLight": "#63a4ff",
    "primaryDark": "#004ba0"
};
const baseFontSize = 16;
const baseBorderRadius = 3;
const basePadding = 10;
const baseFontColor = '#fff';
const baseBorderColor = '#999';

module.exports = {
    variables: {
        color,
        baseFontSize,
        baseBorderRadius,
        basePadding,
        baseBorderColor
    },
    TextInput: {
        tintColor: baseFontColor,
        container: {
            borderWidth: 1,
            borderColor: baseBorderColor,
            backgroundColor:'#777',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: baseBorderRadius
        },
        textInput: {
            padding: basePadding,
            flex: 1,
            fontSize: baseFontSize,
            borderWidth: 0,
            color: baseFontColor
        }
    },
    Container: {
        container: {
            flex: 1,
            flexDirection: 'column',
            padding: basePadding,
            backgroundColor: '#555'
        }
    },
    FormLabel: {
        formLabel: {
            fontSize: baseFontSize - 2,
            fontWeight: '700'
        }
    },
    Button: {
        button: {
            flexDirection: 'row',
            padding: basePadding,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: baseBorderRadius
        },
        text: {
            fontSize: baseFontSize
        },
        primary: {
            backgroundColor: color.primary
        },
        textPrimary: {
            color: '#fff'
        },
        link: {
            backgroundColor: 'transparent'
        },
        textLink: {
            color: baseFontColor
        }
    },
    Text: {
        text: {
            color: baseFontColor,
            fontSize: baseFontSize
        }
    },
    Icon: {
        size: 20,
        color: baseFontColor,
        colorInverted: '#000',
        style: {}
    }
}