var functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);  // this looks for config.json in the functions folder

exports.helloWorld = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text || 'Nothing said';
  // Push it into the Realtime Database then send a response
  admin.database().ref('/messages').push({original: original}).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    //res.redirect(303, snapshot.ref); // don't do this when curling
    res.send(snapshot.key);

    return null;
  }).catch(error => {
    console.error(error);
    res.error(500);
    });
});