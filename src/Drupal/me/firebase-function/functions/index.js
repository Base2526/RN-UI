// // const functions = require('firebase-functions');

// // // // Create and Deploy Your First Cloud Functions
// // // // https://firebase.google.com/docs/functions/write-firebase-functions
// // //
// // exports.heyWorld = functions.https.onRequest((request, response) => {
// //  response.send("Hello from Firebase!");
// // });

// const Firestore = require('@google-cloud/firestore');

// const firestore = new Firestore({
//   projectId: 'rnui-227606',
//   keyFilename: 'RNUI-9bc729e9c0a0.json',
// });

// const document = firestore.doc('users/WmhvONYMrH9o1OiP0DYk');

// // Enter new data into the document.
// document.set({
//     title: 'Welcome to Firestore',
//     body: 'Hello World',
//   }).then(() => {
//     // Document created successfully.
//     console.log('Document created successfully.')
//     return true;
//   }).catch((err) => {
//     console.log('Failed with error info: ${err}');
//     return err;
//   });


const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.someMethod = functions.https.onRequest((req, res) => {
    var stuff = [];
    var db = admin.firestore();
    db.collection("users").get().then(snapshot => {

        snapshot.forEach(doc => {
            var newelement = {
                "id": doc.id,
                "xxxx": doc.data().xxx,
                "yyy": doc.data().yyy
            }
            stuff = stuff.concat(newelement);
        });
        res.send(stuff)
        return "";
    }).catch(reason => {
        res.send(reason)
    })
});
