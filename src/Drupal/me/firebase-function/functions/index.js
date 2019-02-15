const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firestore);

const firestoreDB = admin.firestore().settings({ timestampsInSnapshots: true }); 

/*
เป็นส่วน call api Drupal
*/
var request = require('request');
const config = require('./config');

// https://gist.github.com/CodingDoug/490f9222c8b0f696338e2d74fcb78594
exports.userPresenceCreate = functions.database.ref('user_presence/{userId}').onCreate((snapshot, context) => {
    console.log(context.params.userId);
    const original = snapshot.val();

    console.log(original);

    /*
        {   
        bundle_identifier: 'th.dna',
        model_number: 'iPhone 5s',
        platform: 'ios',
        status: 'online',
        udid: 'E5EB164A-ED5A-4502-8938-AD18952CB34C' }
     */

    return true;
})

exports.userPresenceUpdate = functions.database.ref('user_presence/{userId}').onUpdate((change, context) => {
    // console.log(change);
    // console.log(context.params.userId);

    let before = change.before.val();
    let after = change.after.val()
    console.log(before)
    console.log(after)

    return true;
})

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
    // request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.PATH_API_TEST, form: {value:newValue}, headers: config.headers}, function(err,httpResponse,body){ 
    //     /* ... */
    //     // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
    //     var objectValue = JSON.parse(body);
    //     console.log(objectValue);
    //     if (!objectValue.result) {
    //         // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
    //     }
    // });

    return true;
    
});

exports.deleteClasss = functions.firestore
    .document('users/{userId}/classs/{classId}')
    .onDelete((snap, context) => {
        // Get an object representing the document prior to deletion
        // e.g. {'name': 'Marie', 'age': 66}
        const deletedValue = snap.data();

        request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.DELETE_CLASSS, form: {deletedValue, context}, headers: config.headers}, function(err,httpResponse,body){ 
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
        // console.log(objectValue);
        if (!objectValue.result) {
            // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
        }
    });

    return true;
});

exports.updateProfiles = functions.firestore
    .document('profiles/{userId}')
    .onUpdate((change, context) => {
        const newValue = change.after.data();
        request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.UPDATE_PROFILE, form: {newValue, context}, headers: config.headers}, function(err,httpResponse,body){ 
            /* ... */
            // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
            var objectValue = JSON.parse(body);
            // console.log(objectValue);
            if (!objectValue.result) {
                // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
            }
        });
        return true;
});

exports.createProfiles_phones = functions.firestore
    .document('profiles/{userId}/phones/{phoneId}')
    .onCreate((snap, context) => {
        const newValue = snap.data();
        let mode = 'added';
        request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.PROFILE_PHONES, form: {context, mode, newValue}, headers: config.headers}, function(err,httpResponse,body){ 
            /* ... */
            // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
            var objectValue = JSON.parse(body);
            // console.log(objectValue);
            if (!objectValue.result) {
                // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
            }
        });
        return true;
    }
);

exports.updateProfiles_phones = functions.firestore
    .document('profiles/{userId}/phones/{phoneId}')
    .onUpdate((change, context) => {
        const newValue = change.after.data();
        let mode = 'modified';
        request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.PROFILE_PHONES, form: {context, mode, newValue}, headers: config.headers}, function(err,httpResponse,body){ 
            /* ... */
            // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
            var objectValue = JSON.parse(body);
            // console.log(objectValue);
            if (!objectValue.result) {
                // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
            }
        });
        return true;
    }
);

exports.deleteProfiles_phones = functions.firestore
    .document('profiles/{userId}/phones/{phoneId}')
    .onDelete((snap, context) => {
        let mode = 'removed';
        request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.PROFILE_PHONES, form: {context, mode}, headers: config.headers}, function(err,httpResponse,body){ 
            /* ... */
            // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
            var objectValue = JSON.parse(body);
            // console.log(objectValue);
            if (!objectValue.result) {
                // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
            }
        });
        return true;
    }
);

exports.createProfiles_emails = functions.firestore
    .document('profiles/{userId}/emails/{emailId}')
    .onCreate((snap, context) => {
        const newValue = snap.data();
        let mode = 'added';
        request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.PROFILE_EMAILS, form: {context, mode, newValue}, headers: config.headers}, function(err,httpResponse,body){ 
            /* ... */
            // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
            var objectValue = JSON.parse(body);
            // console.log(objectValue);
            if (!objectValue.result) {
                // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
            }
        });
        return true;
    }
);

exports.updateProfiles_emails = functions.firestore
    .document('profiles/{userId}/emails/{emailId}')
    .onUpdate((change, context) => {
        const newValue = change.after.data();
        let mode = 'modified';
        request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.PROFILE_EMAILS, form: {context, mode, newValue}, headers: config.headers}, function(err,httpResponse,body){ 
            /* ... */
            // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
            var objectValue = JSON.parse(body);
            // console.log(objectValue);
            if (!objectValue.result) {
                // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
            }
        });
        return true;
    }
);

exports.deleteProfiles_emails = functions.firestore
    .document('profiles/{userId}/emails/{emailId}')
    .onDelete((snap, context) => {
        let mode = 'removed';
        request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.PROFILE_EMAILS, form: {context, mode}, headers: config.headers}, function(err,httpResponse,body){ 
            /* ... */
            // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
            var objectValue = JSON.parse(body);
            // console.log(objectValue);
            if (!objectValue.result) {
                // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
            }
        });
        return true;
    }
);

exports.createProfiles_websites = functions.firestore
    .document('profiles/{userId}/websites/{websiteId}')
    .onCreate((snap, context) => {
        const newValue = snap.data();
        let mode = 'added';
        request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.PROFILE_WEBSITES, form: {context, mode, newValue}, headers: config.headers}, function(err,httpResponse,body){ 
            /* ... */
            // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
            var objectValue = JSON.parse(body);
            // console.log(objectValue);
            if (!objectValue.result) {
                // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
            }
        });
        return true;
    }
);

exports.updateProfiles_websites = functions.firestore
    .document('profiles/{userId}/websites/{websiteId}')
    .onUpdate((change, context) => {
        const newValue = change.after.data();
        let mode = 'modified';
        request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.PROFILE_WEBSITES, form: {context, mode, newValue}, headers: config.headers}, function(err,httpResponse,body){ 
            /* ... */
            // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
            var objectValue = JSON.parse(body);
            // console.log(objectValue);
            if (!objectValue.result) {
                // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
            }
        });
        return true;
    }
);

exports.deleteProfiles_websites = functions.firestore
    .document('profiles/{userId}/websites/{websiteId}')
    .onDelete((snap, context) => {
        let mode = 'removed';
        request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.PROFILE_WEBSITES, form: {context, mode}, headers: config.headers}, function(err,httpResponse,body){ 
            /* ... */
            // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
            var objectValue = JSON.parse(body);
            // console.log(objectValue);
            if (!objectValue.result) {
                // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
            }
        });
        return true;
    }
);

// my id
exports.createProfiles_myID = functions.firestore
    .document('profiles/{userId}/my_ids/{myIDId}')
    .onCreate((snap, context) => {
        const newValue = snap.data();
        let mode = 'added';
        request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.PROFILE_MYIDS, form: {context, mode, newValue}, headers: config.headers}, function(err,httpResponse,body){ 
            /* ... */
            // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
            var objectValue = JSON.parse(body);
            // console.log(objectValue);
            if (!objectValue.result) {
                // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
            }
        });
        return true;
    }
);

exports.deleteProfiles_myID = functions.firestore
    .document('profiles/{userId}/my_ids/{myIDId}')
    .onDelete((snap, context) => {
        let mode = 'removed';
        request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.PROFILE_MYIDS, form: {context, mode}, headers: config.headers}, function(err,httpResponse,body){ 
            /* ... */
            // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
            var objectValue = JSON.parse(body);
            // console.log(objectValue);
            if (!objectValue.result) {
                // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
            }
        });
        return true;
    }
);

// UpdateStatusFriend
exports.updateStatusFriend = functions.firestore
    .document('users/{userId}/friends/{friendId}')
    .onUpdate((change, context) =>{

    const newValue = change.after.data();
    // console.log(newValue);

    // user_for_friend_editupdate

    request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.UPDATE_FOR_FRIEND_EDITUPDATE, form: {newValue, context}, headers: config.headers}, function(err,httpResponse,body){ 
        /* ... */
        // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
        var objectValue = JSON.parse(body);
        // console.log(objectValue);
        if (!objectValue.result) {
            // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
        }
    });

    return true;
})

exports.deleteGroups = functions.firestore
    .document('groups/{groupId}')
    .onDelete((snap, context) => {
        // Get an object representing the document prior to deletion
        // e.g. {'name': 'Marie', 'age': 66}
        const deletedValue = snap.data();

        // console.log(context.params.groupId);
        // console.log(deletedValue);

        // perform desired operations ...

        // DELETE_CHAT_GROUP
        request.post({url:config.API_URL_IDNA + config.END_POINT_IDNA + config.DELETE_CHAT_GROUP, form: {deletedValue, context}, headers: config.headers}, function(err,httpResponse,body){ 
            /* ... */
            // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
            var objectValue = JSON.parse(body);
            // console.log(objectValue);
            if (!objectValue.result) {
                // console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
            }
        });

        return true;
});
