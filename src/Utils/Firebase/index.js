import Firebase from 'firebase';
let config = {
    apiKey: "AIzaSyDvYSOBwJBAuOEBB1NBRq70W9QCy2QDxmo",
    authDomain: "rn-ui-a37a1.firebaseapp.com",
    databaseURL: "https://rn-ui-a37a1.firebaseio.com",
    projectId: "rn-ui-a37a1",
    storageBucket: "rn-ui-a37a1.appspot.com",
    messagingSenderId: "372495115726"
};
let app = Firebase.initializeApp(config);
export const db = app.database();