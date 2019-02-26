// https://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules

let bundle_identifier= "th.dna";
let platform= "firebase";

let constants = {
    bundle_identifier,
    platform,
    headers : { 
        'bundle_identifier': bundle_identifier,
        'platform' : platform 
    },
    API_URL_IDNA: 'http://128.199.149.168',
    END_POINT_IDNA: '/api',
    PATH_API_TEST: '/api_test',
    PRESENCE: '/presence',
    UPDATE_PROFILE: '/update_profile',
    PROFILE_EMAILS: '/profile_emails',
    PROFILE_WEBSITES: '/profile_websites',
    PROFILE_PHONES: '/profile_phones',
    PROFILE_MYIDS: '/profile_myids',
    UPDATE_FOR_FRIEND_EDITUPDATE: '/user_for_friend_editupdate',

    DELETE_CHAT_GROUP: '/delete_chat_group',
    CLASSS: '/classs',
    CLASS_MEMBER: '/class_member',
};

module.exports = Object.freeze(constants); 

/*
// Header 
// Refer : https://stackoverflow.com/questions/17121846/node-js-how-to-send-headers-with-form-data-using-request-module

var bundle_identifier = 'heart.idna';
var platform          = 'firebase';

var headers = { 
    'bundle_identifier': bundle_identifier,
    'platform' : platform 
};

var API_URL_IDNA 	= 'http://128.199.149.168';
var END_POINT_IDNA 	= '/api';

var PATH_API_TEST 	= '/api_test';
 */