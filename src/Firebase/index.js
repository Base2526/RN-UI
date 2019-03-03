import firebase from 'react-native-firebase';
const instance = firebase.initializeApp({
  persistence: true
});

// can also use `keepSynced` / `setPersistence` methods:
// instance.database().ref('/someref').keepSynced();
// instance.database().setPersistence(true);

export default instance;