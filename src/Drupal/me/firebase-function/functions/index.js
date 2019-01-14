const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firestore);

const firestoreDB = admin.firestore().settings({ timestampsInSnapshots: true }); 

/*
เป็นส่วน call api Drupal
*/
var request = require('request');

const config = require('./config');

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase! > " + config.headers);
// });

// classs
exports.updateClasss = functions.firestore
    .document('users/{userId}/classs/{classId}')
    .onUpdate((change, context) => {

    console.log(context);

    const newValue = change.after.data();

    // const timestamp = functions.firestore.FieldValue.serverTimestamp();

    // console.log(admin.database.ServerValue.TIMESTAMP);

    // Using Cloud Firestore
    // console.log(admin.firestore.FieldValue.serverTimestamp());

    // Using Realtime Database
    // admin.database.ServerValue.TIMESTAMP

    // กรณี 
    request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.PATH_API_TEST, form: {value:newValue}, headers: config.headers}, function(err,httpResponse,body){ 
        /* ... */
        // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
        var objectValue = JSON.parse(body);
        console.log(objectValue);
        if (!objectValue.result) {
            // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
        }
    });

    return true;
    
});

// 
exports.updateMyApplications = functions.firestore
    .document('users/{userId}/my_applications/{my_applicationsId}')
    .onUpdate((change, context) => {

    // context.params.userId
    const newValue = change.after.data();

    // กรณี profile user มีการ edit | Update
    request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.PATH_API_TEST, form: {value:newValue}, headers: config.headers}, function(err,httpResponse,body){ 
        /* ... */
        // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
        var objectValue = JSON.parse(body);
        console.log(objectValue);
        if (!objectValue.result) {
            // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
        }
    });

    return true;
});

exports.updateProfiles = functions.firestore
    .document('profiles/{userId}')
    .onUpdate((change, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const newValue = change.after.data();

        // console.log(newValue);

        // ...or the previous value before this update
        // const previousValue = change.before.data();

        // access a particular field as you would any JS property
        // const name = newValue.name;

        // perform desired operations ...
        // console.log(change);

        request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.UPDATE_PROFILE, form: {newValue, context}, headers: config.headers}, function(err,httpResponse,body){ 
            /* ... */
            // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
            var objectValue = JSON.parse(body);
            console.log(objectValue);
            if (!objectValue.result) {
                // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
            }
        });
        return true;
});

// UpdateStatusFriend
exports.updateStatusFriend = functions.firestore
    .document('users/{userId}/friends/{friendId}')
    .onUpdate((change, context) =>{

    const newValue = change.after.data();
    console.log(newValue);

    // user_for_friend_editupdate

    request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.UPDATE_FOR_FRIEND_EDITUPDATE, form: {newValue, context}, headers: config.headers}, function(err,httpResponse,body){ 
        /* ... */
        // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
        var objectValue = JSON.parse(body);
        console.log(objectValue);
        if (!objectValue.result) {
            // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
        }
    });

    return true;
})
