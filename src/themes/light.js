const color = {
    "primary": "#1976d2",
    "primaryLight": "#63a4ff",
    "primaryDark": "#0057b9"
};
const baseFontSize = 16;
const baseBorderRadius = 3;
const basePadding = 10;
const baseFontColor = '#333';
const baseBorderColor = '#ddd';


module.exports = {
    variables: {
        color,
        baseFontSize,
        baseBorderRadius,
        basePadding,
        baseBorderColor,
        baseFontColor
    },
    TextInput: {
        tintColor: color.primary,
        container: {
            borderWidth: 1,
            borderColor: '#888',
            backgroundColor: '#fefefe',
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
            backgroundColor: '#fff'
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
            borderRadius: baseBorderRadius,
            elevation:1
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
            color: color.primary
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
        color: color.primary,
        colorInverted: '#fff',
        style: {}
    }
}