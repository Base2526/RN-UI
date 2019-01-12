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

// 
exports.updateMyApplications = functions.firestore
    .document('users/{userId}/my_applications/{my_applicationsId}')
    .onUpdate((change, context) => {

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

        // ...or the previous value before this update
        const previousValue = change.before.data();

        // access a particular field as you would any JS property
        const name = newValue.name;

        // perform desired operations ...
        console.log(change);

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
