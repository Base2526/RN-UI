import {PermissionsAndroid} from 'react-native';
import {displayName} from '../../app.json';

let READ_EXTERNAL_STORAGE = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                title: displayName + ' Storage Permission',
                message:
                    displayName + ' needs access to your external storage',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return granted;
        } else {
            throw new Error('External storage permission denied');
        }
    } catch (err) {
        throw err;
    }
};

let CAMERA = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: displayName + ' Camera Permission',
                message:
                    displayName + ' needs access your camera to capture photo and video.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return granted;
        } else {
            throw new Error('Camera permission denied');
        }
    } catch (err) {
        throw err;
    }
};

let RECORD_AUDIO = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
                title: displayName + ' Mic Permission',
                message:
                    displayName + ' needs access your mic to capture audio for video record.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return granted;
        } else {
            throw new Error('Mic permission denied');
        }
    } catch (err) {
        throw err;
    }
};

let LOCATION = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: displayName + ' Location Permission',
                message:
                    displayName + ' needs access your location.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return granted;
        } else {
            throw new Error('Location permission denied');
        }
    } catch (err) {
        throw err;
    }
};

let WRITE_EXTERNAL_STORAGE = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: displayName + ' Write External Storage Permission',
                message:
                    displayName + ' needs to write on your external storage',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return granted;
        } else {
            throw new Error('storage permission denied');
        }
    } catch (err) {
        throw err;
    }
};

let READ_CONTACTS = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                title: displayName + ' Read Contacts',
                message:
                    displayName + ' needs to access your contact list',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return granted;
        } else {
            throw new Error('contacts permission denied');
        }
    } catch (err) {
        throw err;
    }
};

let WRITE_CONTACTS = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
            {
                title: displayName + ' Write Contacts',
                message:
                    displayName + ' needs to modify your contact list',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return granted;
        } else {
            throw new Error('contacts permission denied');
        }
    } catch (err) {
        throw err;
    }
};

module.exports = {
    READ_EXTERNAL_STORAGE,
    CAMERA,
    RECORD_AUDIO,
    LOCATION,
    WRITE_EXTERNAL_STORAGE,
    READ_CONTACTS,
    WRITE_CONTACTS
};